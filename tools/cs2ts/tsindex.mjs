// What the TypeScript side already has: the turu API and every ported script, read with the
// TypeScript checker. The converter asks it for exported names (imports), member names (C#
// `GetQuantity` is `getQuantity`, `ID` is `id`), types (to follow `Bot.Inventory.Items`) and
// signatures (which C# arguments go into a trailing options object).

import path from "node:path";
import ts from "typescript";

export class TsIndex {
    constructor(scriptsDir) {
        this.scriptsDir = scriptsDir;
        const configPath = path.join(scriptsDir, "tsconfig.json");
        const config = ts.readConfigFile(configPath, ts.sys.readFile);
        const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, scriptsDir);
        const files = parsed.fileNames.filter((f) => !f.includes("/node_modules/") && !f.includes("/tools/"));
        this.program = ts.createProgram(files, parsed.options);
        this.checker = this.program.getTypeChecker();
        // name -> [{ module, file, symbol }]
        this.exports = new Map();
        this.turuFile = null;
        for (const sf of this.program.getSourceFiles()) {
            if (sf.isDeclarationFile) continue;
            const file = sf.fileName;
            let module;
            if (file.endsWith("/bot/js/turu.ts") || file.endsWith("/types/turu.ts")) {
                if (this.turuFile && file.endsWith("/types/turu.ts")) continue;
                module = "turu";
                this.turuFile = sf;
            } else {
                module = path.relative(scriptsDir, file).replace(/\.ts$/, "");
            }
            const sym = this.checker.getSymbolAtLocation(sf);
            if (!sym) continue;
            for (const e of this.checker.getExportsOfModule(sym)) {
                if (e.name === "default") continue;
                const list = this.exports.get(e.name) ?? [];
                if (module === "turu") list.unshift({ module, file, symbol: e });
                else list.push({ module, file, symbol: e });
                this.exports.set(e.name, list);
            }
        }
        this.bot = this.valueType("bot");
        this.memberNames = new Map(); // lower -> Set(names) over every class and interface
        for (const sf of this.program.getSourceFiles()) {
            if (sf.isDeclarationFile) continue;
            const visit = (node) => {
                if (
                    (ts.isMethodDeclaration(node) ||
                        ts.isPropertyDeclaration(node) ||
                        ts.isGetAccessorDeclaration(node) ||
                        ts.isPropertySignature(node) ||
                        ts.isMethodSignature(node)) &&
                    node.name &&
                    ts.isIdentifier(node.name)
                ) {
                    const n = node.name.text;
                    const set = this.memberNames.get(norm(n)) ?? new Set();
                    set.add(n);
                    this.memberNames.set(norm(n), set);
                }
                ts.forEachChild(node, visit);
            };
            visit(sf);
        }
    }

    /** The modules exporting `name`, turu first. */
    modulesOf(name) {
        return (this.exports.get(name) ?? []).map((e) => e.module);
    }

    exportSymbol(name, preferModules = []) {
        const list = this.exports.get(name);
        if (!list) return null;
        for (const m of preferModules) {
            const hit = list.find((e) => e.module === m);
            if (hit) return hit;
        }
        return list[0];
    }

    /** The instance type of an exported class or interface, the type of an exported value. */
    declaredType(name, prefer) {
        const e = this.exportSymbol(name, prefer);
        if (!e) return null;
        const sym = e.symbol.flags & ts.SymbolFlags.Alias ? this.checker.getAliasedSymbol(e.symbol) : e.symbol;
        if (sym.flags & (ts.SymbolFlags.Class | ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias))
            return this.checker.getDeclaredTypeOfSymbol(sym);
        if (sym.flags & ts.SymbolFlags.Enum) return this.checker.getTypeOfSymbol(sym);
        return null;
    }

    valueType(name, prefer) {
        const e = this.exportSymbol(name, prefer);
        if (!e) return null;
        const sym = e.symbol.flags & ts.SymbolFlags.Alias ? this.checker.getAliasedSymbol(e.symbol) : e.symbol;
        if (!(sym.flags & ts.SymbolFlags.Value)) return null;
        return this.checker.getTypeOfSymbol(sym);
    }

    kindOf(name, prefer) {
        const e = this.exportSymbol(name, prefer);
        if (!e) return null;
        const sym = e.symbol.flags & ts.SymbolFlags.Alias ? this.checker.getAliasedSymbol(e.symbol) : e.symbol;
        if (sym.flags & ts.SymbolFlags.Class) return "class";
        if (sym.flags & ts.SymbolFlags.Enum) return "enum";
        if (sym.flags & ts.SymbolFlags.Interface) return "interface";
        if (sym.flags & ts.SymbolFlags.TypeAlias) return "type";
        if (sym.flags & ts.SymbolFlags.Function) return "function";
        return "value";
    }

    /** A member of `type` matching the C# name, ignoring case: { name, symbol, type, kind }. */
    member(type, csName) {
        if (!type) return null;
        const props = this.checker.getPropertiesOfType(this.checker.getNonNullableType(type));
        const lower = norm(csName);
        const hits = props.filter((p) => norm(p.name) === lower);
        if (hits.length === 0) return null;
        const sym = hits.find((p) => p.name === lcFirst(csName)) ?? hits[0];
        const decl = sym.valueDeclaration ?? sym.declarations?.[0];
        const t = decl ? this.checker.getTypeOfSymbolAtLocation(sym, decl) : this.checker.getTypeOfSymbol(sym);
        let kind = "property";
        if (sym.flags & ts.SymbolFlags.Method) kind = "method";
        else if (sym.flags & ts.SymbolFlags.GetAccessor) kind = "getter";
        return { name: sym.name, symbol: sym, type: t, kind };
    }

    /** A C# member name as the TS side spells it, when some class or interface has it. */
    knownName(csName) {
        const set = this.memberNames.get(norm(csName));
        if (!set) return null;
        const lc = lcFirst(csName);
        if (set.has(lc)) return lc;
        return set.size === 1 ? [...set][0] : null;
    }

    /** The call signatures of a method type, each as { params, returnType }. */
    signatures(type) {
        if (!type) return [];
        return this.checker
            .getSignaturesOfType(this.checker.getNonNullableType(type), ts.SignatureKind.Call)
            .map((s) => ({
                params: s.parameters.map((p) => this.paramInfo(p)),
                returnType: s.getReturnType(),
            }));
    }

    paramInfo(sym) {
        const decl = sym.valueDeclaration;
        const type = this.checker.getTypeOfSymbol(sym);
        const info = {
            name: sym.name,
            rest: !!decl?.dotDotDotToken,
            optional: !!(decl?.questionToken || decl?.initializer),
            options: null,
            type,
        };
        if (decl && ts.isObjectBindingPattern(decl.name)) info.name = "options";
        // An options object: optional with all-optional properties, or a declared object-literal
        // (or `...Options`) type in last place (`{ member: boolean; keepVoucher?: boolean }`).
        const declType = decl?.type;
        const literalish =
            declType &&
            (ts.isTypeLiteralNode(declType) ||
                (ts.isIntersectionTypeNode(declType) && declType.types.some((x) => ts.isTypeLiteralNode(x))) ||
                (ts.isTypeReferenceNode(declType) && /Options$/.test(declType.typeName.getText())));
        const isLast = decl && ts.isParameter(decl) && decl.parent.parameters.at(-1) === decl;
        if (!info.rest && (info.optional || (literalish && isLast))) {
            const t = this.checker.getNonNullableType(type);
            if (
                t.flags & (ts.TypeFlags.Object | ts.TypeFlags.Intersection) &&
                !this.checker.isArrayType(t) &&
                !this.checker.isTupleType(t) &&
                this.checker.getSignaturesOfType(t, ts.SignatureKind.Call).length === 0
            ) {
                const props = this.checker.getPropertiesOfType(t);
                if (props.length > 0 && (literalish || props.every((p) => p.flags & ts.SymbolFlags.Optional)))
                    info.options = props.map((p) => p.name);
            }
        }
        return info;
    }

    isArray(type) {
        if (!type) return false;
        const t = this.checker.getNonNullableType(type);
        return this.checker.isArrayType(t) || this.checker.isTupleType(t);
    }
    elementType(type) {
        if (!type) return null;
        const t = this.checker.getNonNullableType(type);
        if (this.checker.isArrayType(t)) return this.checker.getTypeArguments(t)[0] ?? null;
        return null;
    }
    isString(type) {
        return !!type && !!(this.checker.getNonNullableType(type).flags & ts.TypeFlags.StringLike);
    }
    isNumber(type) {
        return !!type && !!(this.checker.getNonNullableType(type).flags & ts.TypeFlags.NumberLike);
    }
    isMap(type) {
        const s = type && this.checker.getNonNullableType(type).getSymbol();
        return s?.name === "Map";
    }
    isSet(type) {
        const s = type && this.checker.getNonNullableType(type).getSymbol();
        return s?.name === "Set";
    }
    typeName(type) {
        return type ? this.checker.typeToString(type) : "?";
    }
}

export function lcFirst(name) {
    // ID -> id, XPFarm -> xpFarm, BuyAllMerge -> buyAllMerge, _x -> _x
    const m = /^([A-Z]+)(?=[A-Z][a-z]|$|[^A-Za-z])/.exec(name);
    if (m && m[1].length > 1) return m[1].toLowerCase() + name.slice(m[1].length);
    return name.charAt(0).toLowerCase() + name.slice(1);
}

/** Names compared without case and underscores (C# `DL_Enable` is `dlEnable`). */
export function norm(name) {
    return name.toLowerCase().replaceAll("_", "");
}
