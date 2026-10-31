// Converts one C# script (a tree-sitter tree) to TypeScript text. The output is a first draft:
// it follows the porting conventions of `scripts/README.md`, resolves names and signatures
// against the TypeScript side (TsIndex) and the C# side (CsIndex), and marks what it can't
// convert with `/* cs2ts: ... */` comments. `tsc` then shows what is left to fix by hand.

import path from "node:path";
import { named, modifiers, paramsOf } from "./csindex.mjs";
import { lcFirst } from "./tsindex.mjs";

// C# model types and their TypeScript names (turu.ts or CoreBots.ts).
const MODEL_TYPES = {
    ItemBase: "InventoryItem",
    InventoryItem: "InventoryItem",
    ShopItem: "ShopItem",
    Quest: "Quest",
    QuestData: "QuestData",
    Monster: "Monster",
    ItemCategory: "string",
    IOption: "ScriptOption",
    SimpleReward: "SimpleReward",
    ItemBase_: "InventoryItem",
    Server: "Server",
    Faction: "Faction",
    Aura: "Aura",
    SkillItem: "Skill",
    Exception: "Error",
    IScriptInterface: "Bot",
};
const NUMBER_TYPES = new Set([
    "int",
    "long",
    "short",
    "byte",
    "sbyte",
    "uint",
    "ulong",
    "ushort",
    "float",
    "double",
    "decimal",
    "Int32",
    "Int64",
    "Double",
    "Single",
]);
const LIST_TYPES = new Set([
    "List",
    "IEnumerable",
    "IList",
    "ICollection",
    "IReadOnlyList",
    "IReadOnlyCollection",
    "Queue",
    "Stack",
    "ConcurrentBag",
    "LinkedList",
]);
const MAP_TYPES = new Set([
    "Dictionary",
    "IDictionary",
    "IReadOnlyDictionary",
    "ConcurrentDictionary",
    "SortedDictionary",
]);
const SET_TYPES = new Set(["HashSet", "ISet", "SortedSet"]);
// Library properties of a script class that become module-level instances or imports.
const CORE_SINGLETONS = { CoreBots: "Core" };

const T = {
    str: { prim: "string" },
    num: { prim: "number" },
    bool: { prim: "boolean" },
};

export class FileConverter {
    constructor({ tsx, csx, rel, outRel }) {
        this.tsx = tsx; // TsIndex
        this.csx = csx; // CsIndex
        this.rel = rel; // C# path in the Scripts repo
        this.outRel = outRel; // TS path in scripts/, without .ts
        this.tree = csx.tree(rel);
        this.imports = new Map(); // module -> Set(names)
        this.typeImports = new Map();
        this.todos = [];
        this.scopes = [];
        this.libs = new Map(); // C# name -> { name, t, decl }
        this.pending = []; // comments seen inside expressions
        this.includes = [];
        this.localEnums = new Map();
        this.localClasses = new Map();
        this.selfRef = "this";
    }

    // ----- bookkeeping -------------------------------------------------------------------------

    todo(why, node) {
        this.todos.push(`${why}${node ? ` (line ${node.startPosition.row + 1})` : ""}`);
        return `/* cs2ts: ${why.replaceAll("*/", "* /")} */`;
    }

    /** Imports `name` from the module that exports it (an include's port first), if any. */
    need(name, asType = false, preferModule = null) {
        if (this.localEnums.has(name) || this.localClasses.has(name)) {
            // Another file's enum of the same name (`InTheFiendsShadow.Rewards` next to our `Rewards`).
            if (!preferModule || preferModule === this.outRel) return;
            const local = `${path.posix.basename(preferModule).replace(/\W/g, "").replace(/^\d+/, "")}${name}`;
            const map = asType ? this.typeImports : this.imports;
            if (!map.has(preferModule)) map.set(preferModule, new Set());
            map.get(preferModule).add(`${name} as ${local}`);
            return local;
        }
        const prefer = [...(preferModule ? [preferModule] : []), "turu", ...this.includes.map((i) => i.module)];
        const e = this.tsx.exportSymbol(name, prefer);
        let module = e?.module;
        if (!module) {
            // A C# class or enum not ported yet: import it from where its port will be.
            const cls =
                this.csx.classByName(name) ??
                (this.csx.enums.get(name) ? { file: this.csx.enums.get(name).file } : null);
            if (!cls || cls.file === this.rel) return;
            module = tsPathOf(cls.file);
        }
        // The same name from two modules (two scripts' `RewardsSelection`): alias the later one.
        this.importedFrom ??= new Map();
        let local = name;
        const first = this.importedFrom.get(name);
        if (first && first !== module) {
            local = `${path.posix.basename(module).replace(/\W/g, "").replace(/^\d+/, "")}${name}`;
            name = `${name} as ${local}`;
        } else this.importedFrom.set(name, module);
        const map = asType ? this.typeImports : this.imports;
        if (!map.has(module)) map.set(module, new Set());
        map.get(module).add(name);
        return local;
    }

    pushScope() {
        this.scopes.push(new Map());
    }
    popScope() {
        this.scopes.pop();
    }
    declare(name, t, extra = {}) {
        this.scopes.at(-1).set(name, { t, ...extra });
    }
    lookup(name) {
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            const v = this.scopes[i].get(name);
            if (v) return v;
        }
        return null;
    }

    takeComments(node) {
        // Comments inside expressions: keep them for the next statement.
        for (const c of named(node)) if (c.type === "comment") this.pending.push(c.text);
    }
    flushComments() {
        if (this.pending.length === 0) return "";
        const out = this.pending.map((c) => (c.startsWith("//") ? c : c) + "\n").join("");
        this.pending = [];
        return out;
    }

    // ----- types ------------------------------------------------------------------------------

    /** C# type node -> a type descriptor. */
    csType(node) {
        if (!node) return null;
        switch (node.type) {
            case "predefined_type":
                if (node.text === "string" || node.text === "char") return T.str;
                if (node.text === "bool") return T.bool;
                if (NUMBER_TYPES.has(node.text)) return T.num;
                return null;
            case "nullable_type":
                return this.csType(node.childForFieldName("type") ?? named(node)[0]);
            case "array_type":
                return { arr: this.csType(node.childForFieldName("type")) };
            case "tuple_type":
                return {
                    tuple: named(node)
                        .filter((e) => e.type === "tuple_element")
                        .map((e) => ({
                            name: e.childForFieldName("name")?.text ?? null,
                            t: this.csType(e.childForFieldName("type")),
                        })),
                };
            case "generic_name": {
                const [id, targs] = named(node);
                const args = targs ? named(targs).map((a) => this.csType(a)) : [];
                if (LIST_TYPES.has(id.text)) return { arr: args[0] ?? null };
                if (MAP_TYPES.has(id.text)) return { map: [args[0] ?? null, args[1] ?? null] };
                if (SET_TYPES.has(id.text)) return { set: args[0] ?? null };
                if (id.text === "KeyValuePair") return { kv: [args[0] ?? null, args[1] ?? null] };
                if (id.text === "Func" || id.text === "Action") return { fn: id.text };
                return null;
            }
            case "identifier":
            case "qualified_name": {
                const name = node.text.split(".").at(-1);
                if (NUMBER_TYPES.has(name)) return T.num;
                if (name === "String") return T.str;
                if (name === "Boolean") return T.bool;
                if (name === "DateTime") return { date: true, prim: "number" };
                if (name === "TimeSpan") return { span: true, prim: "number" };
                return this.namedType(name);
            }
            case "implicit_type":
                return null;
            default:
                return null;
        }
    }

    namedType(name) {
        const tsName = MODEL_TYPES[name] ?? name;
        if (tsName === "string") return T.str;
        if (this.localEnums.has(name)) return { enumT: name };
        if (this.localClasses.has(name)) return { cs: name };
        const t = this.tsx.declaredType(tsName);
        if (t) return { ts: t, tsName };
        if (this.csx.classByName(name)) return { cs: name };
        if (this.csx.enums.has(name)) return { enumT: name };
        return null;
    }

    /** C# type node -> TypeScript type text. */
    tsTypeText(node) {
        if (!node) return "unknown";
        switch (node.type) {
            case "predefined_type":
                if (node.text === "string" || node.text === "char") return "string";
                if (node.text === "bool") return "boolean";
                if (node.text === "void") return "void";
                if (node.text === "object") return "unknown";
                if (NUMBER_TYPES.has(node.text)) return "number";
                return "unknown";
            case "nullable_type":
                return `${this.tsTypeText(node.childForFieldName("type") ?? named(node)[0])} | null`;
            case "array_type": {
                const inner = this.tsTypeText(node.childForFieldName("type"));
                return /[|&]/.test(inner) ? `(${inner})[]` : `${inner}[]`;
            }
            case "tuple_type":
                return `[${named(node)
                    .filter((e) => e.type === "tuple_element")
                    .map((e) => {
                        const n = e.childForFieldName("name")?.text;
                        const t = this.tsTypeText(e.childForFieldName("type"));
                        return n ? `${n}: ${t}` : t;
                    })
                    .join(", ")}]`;
            case "generic_name": {
                const [id, targs] = named(node);
                const args = targs ? named(targs).map((a) => this.tsTypeText(a)) : [];
                const wrap = (s) => (/[|&]/.test(s) ? `(${s})` : s);
                if (LIST_TYPES.has(id.text)) return `${wrap(args[0] ?? "unknown")}[]`;
                if (MAP_TYPES.has(id.text)) return `Map<${args[0] ?? "unknown"}, ${args[1] ?? "unknown"}>`;
                if (SET_TYPES.has(id.text)) return `Set<${args[0] ?? "unknown"}>`;
                if (id.text === "KeyValuePair") return `[${args[0]}, ${args[1]}]`;
                if (id.text === "Action") return `(${args.map((a, i) => `arg${i}: ${a}`).join(", ")}) => void`;
                if (id.text === "Func") {
                    const ret = args.pop() ?? "unknown";
                    return `(${args.map((a, i) => `arg${i}: ${a}`).join(", ")}) => ${ret}`;
                }
                if (id.text === "Option") return "ScriptOption";
                this.need(id.text, true);
                return `${id.text}<${args.join(", ")}>`;
            }
            case "identifier":
            case "qualified_name": {
                if (
                    node.type === "qualified_name" &&
                    this.csx.nestedEnums.has(node.text.split(".").slice(-2).join("."))
                )
                    return this.enumName(node.text);
                const name = node.text.split(".").at(-1);
                if (NUMBER_TYPES.has(name)) return "number";
                if (name === "String") return "string";
                if (name === "Boolean") return "boolean";
                if (name === "Object") return "unknown";
                if (name === "dynamic") return "any";
                if (name === "DateTime" || name === "TimeSpan") return "number";
                if (name === "Action") return "() => void";
                const tsName = MODEL_TYPES[name] ?? name;
                if (tsName !== "string") this.need(tsName, true);
                return tsName;
            }
            case "implicit_type":
                return "unknown";
            default:
                return this.todo(`type ${node.text}`, node) + " unknown";
        }
    }

    // Type descriptor helpers.
    isArr(t) {
        return !!t && (!!t.arr || !!t.tuple || (t.ts && this.tsx.isArray(t.ts)));
    }
    /** An array to spread into a params argument (a tuple is one element). */
    isSpreadable(t) {
        return (
            !!t &&
            !t.tuple &&
            (t.arr !== undefined ||
                (t.ts &&
                    this.tsx.isArray(t.ts) &&
                    !this.tsx.checker.isTupleType(this.tsx.checker.getNonNullableType(t.ts))))
        );
    }
    isMapT(t) {
        return !!t && (!!t.map || (t.ts && this.tsx.isMap(t.ts)));
    }
    isSetT(t) {
        return !!t && (!!t.set || (t.ts && this.tsx.isSet(t.ts)));
    }
    isStr(t) {
        return !!t && (t.prim === "string" || (t.ts && this.tsx.isString(t.ts)));
    }
    elemOf(t) {
        if (!t) return null;
        if (t.arr !== undefined) return t.arr;
        if (t.set !== undefined) return t.set;
        if (t.map) return { kv: t.map };
        if (t.ts) {
            const e = this.tsx.elementType(t.ts);
            return e ? { ts: e } : null;
        }
        return null;
    }

    /** A member of a type, by its C# name: { name, t, kind, tsSigs, csSigs }. */
    memberOf(t, csName) {
        if (!t) return null;
        if (t.ts) {
            const m = this.tsx.member(t.ts, csName);
            if (!m) return null;
            const sigs = m.kind === "method" ? this.tsx.signatures(m.type) : [];
            // The C# class of the same name gives the C# parameter names (extra positional arguments).
            const csName_ = this.tsx.checker.getNonNullableType(t.ts).getSymbol()?.name;
            const csCls = csName_ ? this.csx.classByName(csName_) : null;
            return {
                name: m.name,
                kind: m.kind,
                t: m.kind === "method" ? (sigs[0] ? { ts: sigs[0].returnType } : null) : { ts: m.type },
                tsSigs: sigs,
                csSigs: csCls?.methods.get(csName) ?? null,
            };
        }
        if (t.cs || t.csStatic) {
            const cls = this.localClasses.get(t.cs ?? t.csStatic) ?? this.csx.classByName(t.cs ?? t.csStatic);
            if (!cls) return null;
            const ms = cls.methods.get(csName);
            if (ms)
                return {
                    name: lcFirst(csName),
                    kind: "method",
                    t: this.csTypeFromText(ms[0].returns),
                    csSigs: ms,
                };
            const mem = cls.members.get(csName);
            if (mem) return { name: lcFirst(csName), kind: "property", t: this.csTypeFromText(mem.type) };
            return null;
        }
        if (t.enumT) return { name: csName, kind: "property", t };
        return null;
    }

    csTypeFromText(text) {
        if (!text) return null;
        text = text.replace(/\?$/, "");
        if (text === "string" || text === "char") return T.str;
        if (text === "bool") return T.bool;
        if (NUMBER_TYPES.has(text)) return T.num;
        let m = /^(\w+)<(.+)>$/.exec(text);
        if (m) {
            const args = splitTop(m[2]).map((a) => this.csTypeFromText(a.trim()));
            if (LIST_TYPES.has(m[1])) return { arr: args[0] };
            if (MAP_TYPES.has(m[1])) return { map: [args[0], args[1]] };
            if (SET_TYPES.has(m[1])) return { set: args[0] };
            return null;
        }
        m = /^(.+)\[\]$/.exec(text);
        if (m) return { arr: this.csTypeFromText(m[1]) };
        if (/^\w+$/.test(text)) return this.namedType(text);
        return null;
    }

    // ----- the file ----------------------------------------------------------------------------

    convert() {
        const root = this.tree.rootNode;
        const top = named(root);
        let header = "";
        const leading = [];
        for (const c of top) {
            if (c.type !== "comment") break;
            const inc = /^\/\/cs_include\s+(\S+)/.exec(c.text);
            if (inc) {
                const file = this.csx.resolve(inc[1].replace(/^Scripts\//, ""));
                this.includes.push({ file, module: tsPathOf(file) });
            } else if (!header && c.text.startsWith("/*") && /\bname\s*:/.test(c.text)) header = c.text;
            else leading.push(c.text);
        }

        // Classes, enums and records of the file.
        const decls = [];
        const collect = (node) => {
            for (const c of named(node)) {
                if (
                    ["class_declaration", "record_declaration", "struct_declaration", "interface_declaration"].includes(
                        c.type,
                    )
                ) {
                    decls.push(c);
                    const info = this.csx.classInfo(c, this.rel);
                    this.localClasses.set(info.name, info);
                    const body = c.childForFieldName("body");
                    if (body) collect(body);
                } else if (c.type === "enum_declaration") {
                    decls.push(c);
                    this.localEnums.set(c.childForFieldName("name").text, c);
                } else if (
                    c.type === "namespace_declaration" ||
                    c.type === "file_scoped_namespace_declaration" ||
                    c.type === "declaration_list"
                ) {
                    collect(c);
                }
            }
        };
        collect(root);

        const parts = [];
        const enumsUsedAsOptions = this.optionEnums(root);
        for (const d of decls) {
            if (d.type === "enum_declaration") parts.push(this.enumDecl(d, enumsUsedAsOptions));
        }
        let main = "";
        let scriptOptions = "";
        for (const d of decls) {
            if (d.type === "enum_declaration") continue;
            if (d.type === "interface_declaration") {
                parts.push(this.todo(`interface ${d.childForFieldName("name").text} not converted`, d));
                continue;
            }
            const r = this.classDecl(d);
            parts.push(r.text);
            if (r.main) main = r.main;
            if (r.options) scriptOptions = r.options;
        }

        // Module-level library instances.
        const libLines = [];
        for (const [, lib] of this.libs) if (lib.decl && lib.used) libLines.push(lib.decl);

        const out = [];
        out.push(header || `/*\nname: ${path.basename(this.rel, ".cs")}\ndescription: null\ntags: null\n*/`);
        out.push(`// Port of Scripts/${this.rel}.`);
        out.push(MARKER);
        for (const l of leading) out.push(l);
        out.push("");
        // A name asked for and then not emitted (`Bot.Config` read through `configEnum`) isn't imported.
        const body = [...leading, ...libLines, ...parts, scriptOptions, main].join("\n");
        out.push(this.importLines(body));
        out.push("");
        if (libLines.length) out.push(libLines.join("\n") + "\n");
        out.push(parts.join("\n\n"));
        if (scriptOptions) out.push("\n" + scriptOptions);
        if (main) out.push("\n" + main);
        if (this.needCompare)
            out.push("\nfunction compare(a: any, b: any): number {\nreturn a < b ? -1 : a > b ? 1 : 0;\n}");
        return { text: out.join("\n") + "\n", todos: this.todos };
    }

    importLines(body = null) {
        // Strings and comments don't count ("...do you want the bot to..."); template literals do.
        const code = body
            ?.replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/g, '""')
            .replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, "");
        const used = (n) => code == null || new RegExp(`\\b${n.split(" as ").at(-1)}\\b`).test(code);
        const lines = [];
        const modules = new Set([...this.imports.keys(), ...this.typeImports.keys()]);
        const order = [...modules].sort((a, b) => (a === "turu" ? -1 : b === "turu" ? 1 : a.localeCompare(b)));
        for (const m of order) {
            if (m === this.outRel) continue;
            const values = this.imports.get(m) ?? new Set();
            const types = [...(this.typeImports.get(m) ?? [])].filter(
                (n) => !values.has(n) && !values.has(n.split(" as ")[0]),
            );
            const names = [...[...values].filter(used), ...types.filter(used).map((n) => `type ${n}`)].sort((a, b) =>
                a.replace(/^type /, "").localeCompare(b.replace(/^type /, "")),
            );
            if (names.length === 0) continue;
            const spec = m === "turu" ? "turu" : relImport(this.outRel, m);
            lines.push(`import { ${names.join(", ")} } from "${spec}";`);
        }
        return lines.join("\n");
    }

    /** Enums used as `Option<E>` or `Config.Get<E>`: those become string enums. */
    optionEnums(root) {
        const out = new Set();
        const visit = (n) => {
            if (n.type === "generic_name") {
                const [id, targs] = named(n);
                if ((id.text === "Option" || id.text === "Get") && targs) for (const a of named(targs)) out.add(a.text);
            }
            for (const c of named(n)) visit(c);
        };
        visit(root);
        return out;
    }

    enumDecl(node, optionEnums) {
        const name = node.childForFieldName("name").text;
        const body = node.childForFieldName("body");
        const members = [];
        let numeric = false;
        for (let i = 0; i < (body?.childCount ?? 0); i++) {
            const c = body.child(i);
            if (c.type === "comment") members.push({ comment: c.text });
            else if (c.type === "enum_member_declaration") {
                const value = c.childForFieldName("value");
                if (value) numeric = true;
                members.push({ name: c.childForFieldName("name").text, value: value?.text ?? null });
            }
        }
        const stringEnum = !numeric;
        const lines = members.map((m) =>
            m.comment
                ? m.comment
                : `${m.name}${
                      m.value !== null
                          ? ` = ${
                                this.expr(
                                    body
                                        .descendantsOfType("enum_member_declaration")
                                        .find((d) => d.childForFieldName("name").text === m.name)
                                        .childForFieldName("value"),
                                ).s
                            }`
                          : stringEnum
                            ? ` = "${m.name}"`
                            : ""
                  },`,
        );
        if (numeric && optionEnums.has(name))
            this.numericOptionEnums = (this.numericOptionEnums ?? new Set()).add(name);
        return `export enum ${name} {\n${lines.join("\n")}\n}`;
    }

    // ----- classes -----------------------------------------------------------------------------

    classDecl(node) {
        const name = node.childForFieldName("name").text;
        const info = this.localClasses.get(name);
        const body = node.childForFieldName("body");
        const prevClass = this.cls;
        this.cls = {
            name,
            info,
            members: new Map(),
            usedFromMain: new Set(),
            tsType: this.tsx.kindOf(name) === "class" ? this.tsx.declaredType(name) : null,
        };

        // Members, by C# name.
        const kids = body ? named(body) : [];
        const optionFields = {};
        for (const m of kids) {
            if (m.type === "method_declaration") {
                const n = m.childForFieldName("name").text;
                this.cls.members.set(n, {
                    name: lcFirst(n),
                    kind: "method",
                    isStatic: modifiers(m).includes("static"),
                    csSigs: info.methods.get(n),
                });
            } else if (m.type === "property_declaration") {
                const n = m.childForFieldName("name").text;
                const lib = this.libraryProperty(m);
                if (lib) continue;
                this.cls.members.set(n, {
                    name: lcFirst(n),
                    kind: "property",
                    isStatic: modifiers(m).includes("static"),
                    t: this.csType(m.childForFieldName("type")),
                });
            } else if (m.type === "field_declaration") {
                const decl = named(m).find((k) => k.type === "variable_declaration");
                const typeNode = decl.childForFieldName("type");
                for (const v of named(decl).filter((k) => k.type === "variable_declarator")) {
                    const n = v.childForFieldName("name").text;
                    if (["Options", "MultiOptions", "OptionsStorage", "DontPreconfigure"].includes(n)) {
                        optionFields[n] = v;
                        continue;
                    }
                    if (this.isBackingField(n, kids)) continue;
                    if (this.libraryField(m, v)) continue;
                    this.cls.members.set(n, {
                        name: lcFirst(n) === n ? n : n.startsWith("_") ? n : lcFirst(n),
                        kind: "field",
                        isStatic: modifiers(m).includes("static") || modifiers(m).includes("const"),
                        t: this.csType(typeNode),
                    });
                }
            }
        }
        // Methods used as event handlers (`Bot.Events.RunToArea += DarkCarnaxMove;`).
        this.cls.eventHandlers = new Map();
        this.cls.localEventHandlers = new Map();
        for (const a of body ? body.descendantsOfType("assignment_expression") : []) {
            const left = a.childForFieldName("left");
            const right = a.childForFieldName("right");
            const op = a.childForFieldName("operator")?.text ?? a.child(1)?.text;
            if (!/^(\+|-)=$/.test(op ?? "") || !/^Bot\.Events\.\w+$/.test(left.text)) continue;
            const handler = right.text.replace(/^this\./, "");
            const ev = left.text.split(".")[2];
            if (this.cls.members.get(handler)?.kind === "method")
                this.cls.eventHandlers.set(handler, EVENT_NAMES[ev] ?? lcFirst(ev));
            // A local function (`void Event_RunToArea(string zone)` inside the method).
            else if (/^\w+$/.test(handler)) this.cls.localEventHandlers.set(handler, EVENT_NAMES[ev] ?? lcFirst(ev));
        }

        // Option groups (MultiOptions) and the option fields.
        let groupNames = [];
        if (optionFields.MultiOptions) {
            const init = initOf(optionFields.MultiOptions);
            groupNames = init ? init.descendantsOfType("string_literal_content").map((s) => s.text) : [];
            for (const g of groupNames) {
                const mem = this.cls.members.get(g);
                if (mem) {
                    mem.isStatic = true;
                    mem.optionGroup = true;
                }
            }
        }

        const lines = [];
        let mainText = "";
        let optionsText = "";
        let prevRow = null;
        let docLines = [];
        for (let i = 0; i < (body?.childCount ?? 0); i++) {
            const m = body.child(i);
            if (!m.isNamed) continue;
            if (prevRow !== null && m.startPosition.row > prevRow + 1 && lines.length && lines.at(-1) !== "")
                lines.push("");
            prevRow = m.endPosition.row;
            if (m.type === "comment" && m.text.startsWith("///")) {
                docLines.push(m.text);
                continue;
            }
            if (docLines.length) {
                lines.push(jsdoc(docLines));
                docLines = [];
            }
            switch (m.type) {
                case "comment":
                    lines.push(m.text);
                    break;
                case "preproc_region":
                case "preproc_endregion":
                    lines.push(preproc(m));
                    break;
                case "property_declaration":
                    if (this.libraryProperty(m)) break;
                    lines.push(this.propertyDecl(m));
                    break;
                case "field_declaration":
                    lines.push(this.fieldDecl(m, kids, groupNames));
                    break;
                case "method_declaration":
                    if (m.childForFieldName("name").text === "ScriptMain") {
                        // A library's `ScriptMain` that only calls `Core.RunCore()`: no main().
                        const bodyText =
                            (m.childForFieldName("body") ?? named(m).find((k) => k.type === "arrow_expression_clause"))
                                ?.text ?? "";
                        if (
                            /^(=>\s*Core\.RunCore\(\)|\{\s*((Core\.SetOptions\((false)?\);|Core\.RunCore\(\);)\s*)*\})$/.test(
                                bodyText.replace(/\/\/.*$/gm, "").trim(),
                            )
                        )
                            break;
                        mainText = this.scriptMain(m, name);
                    } else lines.push(this.methodDecl(m));
                    break;
                case "constructor_declaration":
                    lines.push(this.constructorDecl(m));
                    break;
                case "class_declaration":
                case "enum_declaration":
                case "record_declaration":
                case "struct_declaration":
                    break; // emitted at module level
                default:
                    lines.push(this.todo(`member ${m.type}`, m) + "\n// " + m.text.split("\n").join("\n// "));
            }
        }
        if (!mainText && !groupNames.length && (optionFields.Options || optionFields.OptionsStorage)) {
            // A library (Core) file: the scripts that include it pass its `OptionsStorage` and
            // `Options` to their own `defineScriptOptions`, so they stay fields.
            if (lines.length && lines.at(-1) !== "") lines.push("");
            if (optionFields.OptionsStorage)
                lines.push(`optionsStorage = ${this.expr(initOf(optionFields.OptionsStorage)).s};`);
            if (optionFields.DontPreconfigure)
                lines.push(`dontPreconfigure = ${this.expr(initOf(optionFields.DontPreconfigure)).s};`);
            if (optionFields.Options) lines.push(`options = ${this.optionList(initOf(optionFields.Options))};`);
        } else if (Object.keys(optionFields).length || groupNames.length)
            optionsText = this.scriptOptionsDecl(name, optionFields, groupNames);

        // Members used by main() can't be private.
        let text = lines
            .filter((l) => l !== null && l !== undefined)
            .join("\n")
            .replace(/\n{3,}/g, "\n\n");
        for (const used of this.cls.usedFromMain)
            text = text.replace(new RegExp(`\\bprivate (static )?(readonly )?(${used})\\b`, "g"), "$1$2$3");
        const exported = `export class ${name} {\n${text}\n}`;
        this.cls = prevClass;
        return { text: exported, main: mainText, options: optionsText };
    }

    isBackingField(name, kids) {
        // `_Farm` behind `Farm { get => _Farm ??= new CoreFarms(); }`
        if (!name.startsWith("_")) return false;
        return kids.some(
            (k) =>
                k.type === "property_declaration" &&
                new RegExp(`\\b${name}\\b`).test(k.text) &&
                this.libraryProperty(k),
        );
    }

    /** `private static readonly CoreAdvanced sAdv = new();`: a module-level instance too. */
    libraryField(m, v) {
        const n = v.childForFieldName("name").text;
        if (this.libs.has(n)) return this.libs.get(n);
        const decl = named(m).find((k) => k.type === "variable_declaration");
        const type = decl.childForFieldName("type")?.text;
        const init = initOf(v);
        if (!type || !init || !/^(implicit_)?object_creation_expression$/.test(init.type)) return null;
        if (init.type === "object_creation_expression" && init.childForFieldName("type")?.text !== type) return null;
        if (
            named(init).some((k) => k.type === "initializer_expression") ||
            named(init).find((k) => k.type === "argument_list")?.namedChildCount
        )
            return null;
        const isLibrary =
            this.csx.classByName(type) || (this.tsx.kindOf(type) === "class" && this.tsx.modulesOf(type)[0] !== "turu");
        if (!isLibrary) return null;
        let lib = null;
        for (const [, other] of this.libs)
            if (other.type === type && !lib) lib = { ...other, decl: null, ref: other.ref ?? other };
        if (!lib) {
            const local = n === type ? lcFirst(n) : n;
            lib = { name: local, type, t: this.namedType(type), decl: `const ${local} = new ${type}();` };
        }
        this.libs.set(n, lib);
        return lib;
    }

    /**
     * `public CoreBots Core => CoreBots.Instance;`, `IScriptInterface Bot => ...` and the lazy
     * `static CoreFarms Farm { get => _Farm ??= new CoreFarms(); }`: module-level instances.
     */
    libraryProperty(m) {
        const n = m.childForFieldName("name").text;
        const typeNode = m.childForFieldName("type");
        const type = typeNode?.text;
        if (this.libs.has(n)) return this.libs.get(n);
        if (type === "IScriptInterface") {
            this.libs.set(n, { name: "bot", t: { ts: this.tsx.bot } });
            return this.libs.get(n);
        }
        const text = m.text;
        let lib = null;
        if (CORE_SINGLETONS[type] && /Instance/.test(text)) {
            lib = { name: CORE_SINGLETONS[type], t: { ts: this.tsx.declaredType(type) } };
        } else if (
            /=>\s*\w+\s*\?\?=\s*new\s+\w+\(\)/.test(text) ||
            /=>\s*new\s+\w+\(\)\s*;/.test(text) ||
            /=>\s*\w+\.Instance\s*;/.test(text)
        ) {
            // Several properties of one type share the first one's instance (Adv and sAdv).
            for (const [, other] of this.libs)
                if (other.type === type && !lib) lib = { ...other, decl: null, ref: other.ref ?? other };
            if (!lib) {
                const t = this.namedType(type);
                // `GooseMerge GooseMerge` would shadow the imported class: `const gooseMerge`.
                const local = n === type ? lcFirst(n) : n;
                lib = { name: local, type, t, decl: `const ${local} = new ${type}();` };
            }
        }
        if (lib) this.libs.set(n, lib);
        return lib;
    }

    scriptOptionsDecl(className, f, groups) {
        const storage = f.OptionsStorage ? this.expr(initOf(f.OptionsStorage)).s : JSON.stringify(className);
        const opts = f.Options ? this.optionList(initOf(f.Options)) : "[]";
        const dont = f.DontPreconfigure ? this.expr(initOf(f.DontPreconfigure)).s : "false";
        this.need("defineScriptOptions");
        let g = "";
        if (groups.length) {
            g = `, {\n${groups
                .map((name) => {
                    const mem = this.cls?.members.get(name);
                    return `${name}: ${mem?.inline ?? `${className}.${mem?.name ?? lcFirst(name)}`},`;
                })
                .join("\n")}\n}`;
        }
        const tail = g ? `, ${dont}${g}` : dont !== "false" ? `, ${dont}` : "";
        return `export const scriptOptions = defineScriptOptions(${storage}, ${opts}${tail});`;
    }

    /** A `List<IOption>` initializer -> an array of option.* calls. */
    optionList(node) {
        if (!node) return "[]";
        const elemT = { ts: this.tsx.declaredType("ScriptOption") };
        const init =
            node.type === "initializer_expression"
                ? node
                : named(node).find((k) => k.type === "initializer_expression");
        if (!init) return this.expr(node, { arr: elemT }).s;
        // An option listed twice (C# data slips; Turu refuses duplicate names): keep the first.
        const seen = new Set();
        const list = this.elements(init, elemT).filter((e) => {
            const name = e.s && /^option\.\w+\(\s*("(?:[^"\\]|\\.)*")/.exec(e.s)?.[1];
            if (!name) return true;
            if (seen.has(name)) {
                e.s = null;
                e.comments.unshift(`// C# lists option ${name} twice.`);
                return true;
            }
            seen.add(name);
            return true;
        });
        return this.joinElements(list);
    }

    propertyDecl(m) {
        const n = m.childForFieldName("name").text;
        const mem = this.cls.members.get(n);
        const mods = modifiers(m);
        const prefix = `${mods.includes("private") ? "private " : ""}${mods.includes("static") ? "static " : ""}`;
        const typeText = this.tsTypeText(m.childForFieldName("type"));
        const value = m.childForFieldName("value");
        const accessors = m.childForFieldName("accessors");
        const comments = this.flushComments();
        if (value && value.type === "arrow_expression_clause") {
            this.pushScope();
            const e = this.expr(named(value)[0], this.csType(m.childForFieldName("type")));
            this.popScope();
            return `${comments}${prefix}get ${mem.name}(): ${typeText} {\nreturn ${e.s};\n}`;
        }
        if (accessors) {
            const accs = named(accessors).filter((a) => a.type === "accessor_declaration");
            const auto = accs.every(
                (a) =>
                    !a.childForFieldName("body") &&
                    !named(a).some((k) => k.type === "block" || k.type === "arrow_expression_clause"),
            );
            const init = named(m).find(
                (k) =>
                    k.type !== "modifier" &&
                    k.id !== m.childForFieldName("type")?.id &&
                    k.id !== m.childForFieldName("name")?.id &&
                    k.id !== accessors.id &&
                    k.type !== "attribute_list",
            );
            if (auto) {
                const initText = init ? ` = ${this.expr(init, this.csType(m.childForFieldName("type"))).s}` : "";
                return `${comments}${prefix}${mem.name}${initText ? "" : "!"}: ${typeText}${initText};`;
            }
            const out = [];
            for (const a of accs) {
                const kind =
                    a.text.trimStart().startsWith("set") || /\bset\b/.test(a.text.split(/[{=]/)[0]) ? "set" : "get";
                const b = named(a).find((k) => k.type === "block" || k.type === "arrow_expression_clause");
                this.pushScope();
                if (kind === "set") this.declare("value", this.csType(m.childForFieldName("type")));
                let bodyText;
                if (!b) bodyText = "{}";
                else if (b.type === "block") bodyText = this.block(b);
                else
                    bodyText =
                        kind === "get"
                            ? `{\nreturn ${this.expr(named(b)[0]).s};\n}`
                            : `{\n${this.expr(named(b)[0]).s};\n}`;
                this.popScope();
                out.push(
                    kind === "get"
                        ? `${prefix}get ${mem.name}(): ${typeText} ${bodyText}`
                        : `${prefix}set ${mem.name}(value: ${typeText}) ${bodyText}`,
                );
            }
            return comments + out.join("\n");
        }
        return this.todo(`property ${n}`, m);
    }

    fieldDecl(m, kids, groupNames) {
        const decl = named(m).find((k) => k.type === "variable_declaration");
        const typeNode = decl.childForFieldName("type");
        const mods = modifiers(m);
        const out = [];
        for (const v of named(decl).filter((k) => k.type === "variable_declarator")) {
            const n = v.childForFieldName("name").text;
            if (["Options", "MultiOptions", "OptionsStorage", "DontPreconfigure"].includes(n)) continue;
            if (this.isBackingField(n, kids)) continue;
            if (this.libraryField(m, v)) continue;
            const mem = this.cls.members.get(n);
            const init = initOf(v);
            const isStatic = mem.isStatic;
            const isConst = mods.includes("const") || mods.includes("readonly") || mem.optionGroup;
            const prefix = `${mods.includes("private") ? "private " : ""}${isStatic ? "static " : ""}${isConst ? "readonly " : ""}`;
            const t = this.csType(typeNode);
            if (mem.optionGroup && init && init.type === "member_access_expression") {
                mem.inline = this.expr(init).s;
                continue;
            }
            if (mem.optionGroup || (init && typeNode.text.includes("IOption"))) {
                out.push(`${prefix}${mem.name} = ${init ? this.optionList(init) : "[]"};`);
                continue;
            }
            const typeText = this.tsTypeText(typeNode);
            if (init) {
                const e = this.expr(init, t);
                const annotate = typeNode.type !== "implicit_type" && !isLiteral(init) ? `: ${typeText}` : "";
                out.push(`${prefix}${mem.name}${annotate} = ${e.s};`);
            } else {
                out.push(`${prefix}${mem.name}: ${typeText} = ${defaultFor(typeNode, typeText)};`);
            }
        }
        return out.join("\n");
    }

    params(list, scopeOnly = false) {
        const ps = paramsOf(list);
        const out = [];
        for (const p of ps) {
            // ScriptMain(IScriptInterface bot / Bot): the `bot` of turu.
            if (p.type === "IScriptInterface") {
                this.declare(p.name, { ts: this.tsx.bot }, { alias: "bot" });
                continue;
            }
            const t = this.csType(p.typeNode);
            this.declare(p.name, p.isParams ? (t?.arr !== undefined ? t : { arr: t }) : t);
            if (scopeOnly) continue;
            let typeText = p.typeNode ? this.tsTypeText(p.typeNode) : "unknown";
            let s;
            if (p.isParams) s = `...${p.name}: ${typeText}`;
            else if (p.defaultNode) {
                let d = this.expr(p.defaultNode, t).s;
                if (d === "null" && !typeText.includes("null")) typeText += " | null";
                // `rank = 10`, not `rank: number = 10` (as the hand ports write it).
                const literal = ["integer_literal", "real_literal", "boolean_literal", "string_literal"].includes(
                    p.defaultNode.type,
                );
                s =
                    literal && ["number", "boolean", "string"].includes(typeText)
                        ? `${p.name} = ${d}`
                        : `${p.name}: ${typeText} = ${d}`;
            } else s = `${p.name}: ${typeText}`;
            if (p.isOut || p.isRef) s = `${this.todo(`${p.isOut ? "out" : "ref"} parameter ${p.name}`, list)} ${s}`;
            out.push(s);
        }
        return out.join(", ");
    }

    methodDecl(m) {
        const n = m.childForFieldName("name").text;
        const mem = this.cls.members.get(n);
        const mods = modifiers(m);
        const prefix = `${mods.includes("private") ? "private " : ""}${mods.includes("static") ? "static " : ""}`;
        const prevSelf = this.selfRef;
        this.currentMethod = mem.name;
        if (mods.includes("static")) this.selfRef = this.cls.name;
        this.pushScope();
        this.assigned = assignedNames(m);
        // An event handler (`Bot.Events.X += Method`): a bound arrow property taking the event's data.
        const event = this.cls.eventHandlers?.get(n);
        let ps = this.params(m.childForFieldName("parameters"));
        if (event) ps = this.eventParams(event, m);
        const ret = this.tsTypeText(m.childForFieldName("returns") ?? m.childForFieldName("type"));
        const bodyNode =
            m.childForFieldName("body") ??
            named(m).find((k) => k.type === "block" || k.type === "arrow_expression_clause");
        this.returnType = this.csType(m.childForFieldName("returns") ?? m.childForFieldName("type"));
        let body;
        if (!bodyNode) body = "{}";
        else if (bodyNode.type === "block") body = this.block(bodyNode);
        else {
            const e = this.expr(named(bodyNode)[0], this.returnType);
            body = ret === "void" ? `{\n${e.s};\n}` : `{\nreturn ${e.s};\n}`;
        }
        this.popScope();
        this.selfRef = prevSelf;
        const comments = this.flushComments();
        const attrs = named(m)
            .filter((k) => k.type === "attribute_list")
            .map((a) => `// ${a.text}\n`)
            .join("");
        if (event) return `${comments}${attrs}${prefix}${mem.name} = (${ps}): ${ret} => ${body};`;
        return `${comments}${attrs}${prefix}${mem.name}(${ps}): ${ret} ${body}`;
    }

    constructorDecl(m) {
        this.pushScope();
        this.assigned = assignedNames(m);
        const ps = this.params(m.childForFieldName("parameters"));
        const b = m.childForFieldName("body");
        const body = b ? this.block(b) : "{}";
        this.popScope();
        const init = named(m).find((k) => k.type === "constructor_initializer");
        return `constructor(${ps}) ${init ? this.todo(`constructor initializer ${init.text}`, init) : ""}${body}`;
    }

    scriptMain(m, className) {
        const prevSelf = this.selfRef;
        this.selfRef = "script";
        this.inMain = true;
        this.usedScript = false;
        this.pushScope();
        this.assigned = assignedNames(m);
        this.params(m.childForFieldName("parameters"), true);
        const body = this.block(m.childForFieldName("body"));
        this.popScope();
        this.inMain = false;
        this.selfRef = prevSelf;
        const decl = this.usedScript ? `const script = new ${className}();\n` : "";
        return `export default function main(): void {\n${decl}${body.slice(1, -1).trim()}\n}`;
    }

    // ----- statements --------------------------------------------------------------------------

    /** The parameter list of an event handler: the event's data object, destructured as C#'s parameters. */
    eventParams(event, m) {
        let ps = this.params(m.childForFieldName("parameters"));
        const csParams = paramsOf(m.childForFieldName("parameters"));
        const keys = EVENT_ARGS[event];
        this.need("EventMap", true);
        if (keys && csParams.length)
            ps = `{ ${csParams.map((p, i) => (keys[i] === p.name ? p.name : `${keys[i] ?? p.name}: ${p.name}`)).join(", ")} }: EventMap["${event}"]`;
        else if (csParams.length)
            ps = `${csParams[0].name}: EventMap["${event}"]${
                csParams.length > 1
                    ? " " +
                      this.todo(
                          `extra handler parameters ${csParams
                              .slice(1)
                              .map((p) => p.name)
                              .join(", ")}`,
                          m,
                      )
                    : ""
            }`;
        return ps;
    }

    block(node) {
        this.pushScope();
        const kids = [];
        for (let i = 0; i < node.childCount; i++) if (node.child(i).isNamed) kids.push(node.child(i));
        // C# local functions can be called before they're declared: hoist them.
        const fns = kids.filter((k) => k.type === "local_function_statement");
        for (const f of fns) this.declare(f.childForFieldName("name").text, null, { localFn: true });
        const out = [];
        for (const f of fns) out.push(this.stmt(f));
        let prevRow = null;
        for (const k of kids) {
            if (k.type === "local_function_statement") continue;
            if (prevRow !== null && k.startPosition.row > prevRow + 1) out.push("");
            prevRow = k.endPosition.row;
            out.push(this.stmt(k));
        }
        this.popScope();
        return `{\n${out
            .filter((x) => x !== null)
            .join("\n")
            .replace(/^\n+|\n+$/g, "")
            .replace(/\n{3,}/g, "\n\n")}\n}`;
    }

    stmtOrBlock(node) {
        if (node.type === "block") return this.block(node);
        this.pushScope();
        const s = this.stmt(node);
        this.popScope();
        return `{\n${s}\n}`;
    }

    stmt(node) {
        const c = () => this.flushComments();
        switch (node.type) {
            case "comment":
                return node.text;
            case "preproc_region":
            case "preproc_endregion":
            case "preproc_if":
            case "preproc_nullable":
                return preproc(node);
            case "block":
                return this.block(node);
            case "empty_statement":
                return ";";
            case "expression_statement": {
                const e = named(node).find((k) => k.type !== "comment");
                this.takeComments(node);
                const s = this.exprStatement(e);
                return c() + s + ";";
            }
            case "local_declaration_statement": {
                const decl = named(node).find((k) => k.type === "variable_declaration");
                const s = this.varDecl(decl, modifiers(node).includes("const"));
                if (s === null) return c() || null;
                return c() + s + ";";
            }
            case "local_function_statement": {
                const name = node.childForFieldName("name").text;
                this.pushScope();
                const prevAssigned = this.assigned;
                const event = this.cls?.localEventHandlers?.get(name);
                const ps = event ? this.eventParams(event, node) : this.params(node.childForFieldName("parameters"));
                const retNode = node.childForFieldName("type") ?? node.childForFieldName("returns");
                const ret = this.tsTypeText(retNode);
                const prevRet = this.returnType;
                this.returnType = this.csType(retNode);
                const b = named(node).find((k) => k.type === "block" || k.type === "arrow_expression_clause");
                let body;
                if (b.type === "block") body = this.block(b);
                else {
                    const e = this.expr(named(b)[0]);
                    body = ret === "void" ? `{\n${e.s};\n}` : `{\nreturn ${e.s};\n}`;
                }
                this.returnType = prevRet;
                this.assigned = prevAssigned;
                this.popScope();
                return `${c()}const ${name} = (${ps}): ${ret} => ${body};`;
            }
            case "if_statement": {
                const cond = this.expr(node.childForFieldName("condition"), T.bool).s;
                const then = this.stmtOrBlock(node.childForFieldName("consequence"));
                const alt = node.childForFieldName("alternative");
                let s = `${c()}if (${cond}) ${then}`;
                if (alt)
                    s += alt.type === "if_statement" ? ` else ${this.stmt(alt)}` : ` else ${this.stmtOrBlock(alt)}`;
                return s;
            }
            case "while_statement":
                return `${c()}while (${this.expr(node.childForFieldName("condition")).s}) ${this.stmtOrBlock(node.childForFieldName("body"))}`;
            case "do_statement":
                return `${c()}do ${this.stmtOrBlock(node.childForFieldName("body"))} while (${this.expr(node.childForFieldName("condition")).s});`;
            case "for_statement": {
                this.pushScope();
                const init = node.childForFieldName("initializer");
                let initText = "";
                if (init)
                    initText =
                        init.type === "variable_declaration" ? this.varDecl(init, false, true) : this.expr(init).s;
                const extraInit = node.childrenForFieldName
                    ? node
                          .childrenForFieldName("initializer")
                          .slice(1)
                          .map((k) => this.expr(k).s)
                    : [];
                if (extraInit.length) initText += ", " + extraInit.join(", ");
                const cond = node.childForFieldName("condition");
                const updates = node.childrenForFieldName("update").map((u) => this.expr(u).s);
                const body = this.stmtOrBlock(node.childForFieldName("body"));
                this.popScope();
                return `${c()}for (${initText}; ${cond ? this.expr(cond).s : ""}; ${updates.join(", ")}) ${body}`;
            }
            case "foreach_statement":
                return c() + this.foreach(node);
            case "return_statement": {
                const e = named(node).find((k) => k.type !== "comment");
                return `${c()}return${e ? " " + this.expr(e, this.returnType).s : ""};`;
            }
            case "break_statement":
                return "break;";
            case "continue_statement":
                return "continue;";
            case "throw_statement": {
                const e = named(node)[0];
                return `${c()}throw ${e ? this.expr(e).s : "error"};`;
            }
            case "try_statement":
                return c() + this.tryStmt(node);
            case "switch_statement":
                return c() + this.switchStmt(node);
            case "lock_statement":
            case "using_statement":
            case "checked_statement":
            case "unsafe_statement": {
                const b = node.childForFieldName("body") ?? named(node).at(-1);
                return `${c()}${node.type === "lock_statement" ? "" : this.todo(node.type, node)}${this.stmtOrBlock(b)}`;
            }
            case "labeled_statement": {
                // `Label: while (...)` with `goto Label;` inside: JS's `continue Label;` (the loop's
                // condition is checked again, as the goto does).
                const label = named(node)[0].text;
                const inner = named(node)
                    .slice(1)
                    .find((k) => k.type !== "comment");
                if (inner && /^(while|for|foreach|do)_statement$/.test(inner.type)) {
                    this.loopLabels ??= new Set();
                    this.loopLabels.add(label);
                    const out = `${c()}${label}: ${this.stmt(inner)}`;
                    this.loopLabels.delete(label);
                    return out;
                }
            }
            // falls through
            case "goto_statement":
                if (node.type === "goto_statement") {
                    const label = named(node)[0]?.text;
                    if (label && this.loopLabels?.has(label)) return `${c()}continue ${label};`;
                }
                return (
                    c() +
                    this.todo(`${node.type}: ${node.text.split("\n")[0]}`, node) +
                    (node.type === "labeled_statement"
                        ? "\n" +
                          named(node)
                              .slice(1)
                              .map((k) => this.stmt(k))
                              .join("\n")
                        : "")
                );
            case "yield_statement":
                return c() + this.todo("yield", node);
            default:
                return c() + this.todo(`statement ${node.type}`, node) + "\n// " + node.text.split("\n").join("\n// ");
        }
    }

    exprStatement(e) {
        // Core.CheckSpaces(ref count, items): the port returns the counter.
        if (e.type === "invocation_expression" && /\.CheckSpaces$/.test(e.childForFieldName("function").text)) {
            const first = named(e.childForFieldName("arguments")).find((k) => k.type === "argument");
            const m = first && /^ref\s+(\w+)$/.exec(first.text);
            if (m) {
                const call = this.expr(e).s.replace(/\/\* cs2ts: out argument [^*]*\*\/ /, "");
                return `${m[1]} = ${call}`;
            }
        }
        if (e.type === "assignment_expression" && e.childForFieldName("left").type === "tuple_expression") {
            const left = e.childForFieldName("left");
            const parts = named(left)
                .filter((k) => k.type === "argument")
                .map((a) => named(a).at(-1));
            const r = this.expr(e.childForFieldName("right"));
            const elems = r.t?.tuple?.map((x) => x.t) ?? r.t?.kv ?? [];
            if (parts.every((p) => p.type === "declaration_expression")) {
                const names = parts.map((p) => p.childForFieldName("name").text);
                names.forEach((n, i) =>
                    this.declare(n, this.csType(parts[i].childForFieldName("type")) ?? elems[i] ?? null),
                );
                return `${names.some((n) => this.assigned?.has(n)) ? "let" : "const"} [${names.join(", ")}] = ${r.s}`;
            }
            return `[${parts.map((p) => (p.type === "discard" ? "" : this.expr(p).s)).join(", ")}] = ${r.s}`;
        }
        // `Bot.Events.X += Handler;` -> bot.events.on(...)
        if (e.type === "assignment_expression") {
            const op = e.child(1).text;
            const left = e.childForFieldName("left");
            if ((op === "+=" || op === "-=") && /^Bot\.Events\.\w+$/.test(left.text)) {
                const ev = left.text.split(".")[2];
                const name = EVENT_NAMES[ev] ?? lcFirst(ev.replace(/(Received|Event)$/, ""));
                const h = this.expr(e.childForFieldName("right")).s;
                return `bot.events.${op === "+=" ? "on" : "off"}("${name}", ${h})${EVENT_NAMES[ev] ? "" : " " + this.todo(`event ${ev}`, e)}`;
            }
        }
        return this.expr(e).s;
    }

    varDecl(decl, isConst, forInit = false) {
        const typeNode = decl.childForFieldName("type");
        const declared = this.csType(typeNode);
        const out = [];
        let kw = "const";
        const vars = named(decl).filter((k) => k.type === "variable_declarator");
        for (const v of vars) {
            const nameNode = v.childForFieldName("name");
            const init = initOf(v);
            if (!nameNode || nameNode.type === "tuple_pattern" || v.text.startsWith("(")) {
                // `var (a, b) = pair;` -> `const [a, b] = pair;`
                const pattern = named(v).find(
                    (k) => k.type === "tuple_pattern" || k.type === "parenthesized_variable_designation",
                );
                const e = init ? this.expr(init) : null;
                const names = pattern ? pattern.descendantsOfType("identifier").map((i) => i.text) : [];
                const elems = e?.t?.tuple?.map((x) => x.t) ?? e?.t?.kv ?? [];
                names.forEach((n, i) => this.declare(n, elems[i] ?? null));
                if (names.some((n) => this.assigned?.has(n))) kw = "let";
                out.push({
                    s: e && names.length ? `[${names.join(", ")}] = ${e.s}` : this.todo("deconstruction", v) + v.text,
                });
                continue;
            }
            const name = nameNode.text;
            // A local nobody reads (C#'s unused locals; TS's noUnusedLocals rejects them).
            if (
                !forInit &&
                vars.length === 1 &&
                init &&
                decl.parent?.parent &&
                countRefs(enclosingScope(decl), name) === 0
            ) {
                if (isPure(init)) return null;
                return this.expr(init, declared).s;
            }
            if (!init || forInit || this.assigned?.has(name)) kw = "let";
            let e = null;
            if (init) e = this.expr(init, declared);
            const t = declared ?? e?.t ?? null;
            this.declare(name, t);
            let annotation = "";
            if (typeNode && typeNode.type !== "implicit_type") {
                // Annotated when TS can't infer it: null, empty collections, tuples (inferred as arrays).
                if (
                    !init ||
                    (init &&
                        (init.type === "null_literal" ||
                            /^(\[\]|new Map\(\)|new Set\(\))$/.test(e.s) ||
                            typeNode.descendantsOfType("tuple_type").length))
                )
                    annotation = `: ${this.tsTypeText(typeNode)}`;
                if (init?.type === "null_literal" && !annotation.includes("null")) annotation += " | null";
            }
            out.push({ s: `${name}${annotation}${e ? ` = ${e.s}` : ""}` });
        }
        if (isConst) kw = "const";
        return `${kw} ${out.map((o) => o.s).join(", ")}`;
    }

    foreach(node) {
        const left = node.childForFieldName("left");
        const right = node.childForFieldName("right");
        const typeNode = node.childForFieldName("type");
        const r = this.expr(right);
        let elem = this.csType(typeNode) ?? this.elemOf(r.t);
        this.pushScope();
        let binding;
        if (
            left.type === "tuple_pattern" ||
            left.type === "parenthesized_variable_designation" ||
            left.text.startsWith("(")
        ) {
            const names = left.descendantsOfType("identifier").map((i) => i.text);
            const elems = elem?.kv ?? elem?.tuple?.map((x) => x.t) ?? [];
            names.forEach((n, i) => this.declare(n, elems[i] ?? null));
            binding = `[${names.join(", ")}]`;
        } else {
            binding = left.text;
            this.declare(binding, elem);
        }
        const iter = this.isMapT(r.t) && !r.s.endsWith(")") ? r.s : r.s;
        const body = this.stmtOrBlock(node.childForFieldName("body"));
        this.popScope();
        return `for (${this.assigned?.has(binding) ? "let" : "const"} ${binding} of ${iter}) ${body}`;
    }

    tryStmt(node) {
        let s = `try ${this.block(node.childForFieldName("body"))}`;
        for (const k of named(node)) {
            if (k.type === "catch_clause") {
                const decl = named(k).find((x) => x.type === "catch_declaration");
                const name = decl?.childForFieldName("name")?.text ?? "error";
                const filter = named(k).find((x) => x.type === "catch_filter_clause");
                const typeName = decl?.childForFieldName("type")?.text;
                this.pushScope();
                this.declare(name, null);
                const body = this.block(k.childForFieldName("body"));
                this.popScope();
                this.need("rethrowIfStopped");
                let inner = `rethrowIfStopped(${name});\n`;
                if (typeName && !/^(System\.)?Exception$/.test(typeName))
                    inner += this.todo(`catch only ${typeName}`, k) + "\n";
                if (filter) inner += this.todo(`catch filter ${filter.text}`, k) + "\n";
                s += ` catch (${name}) {\n${inner}${body.slice(1, -1)}}`;
            } else if (k.type === "finally_clause") {
                s += ` finally ${this.block(named(k).find((x) => x.type === "block"))}`;
            }
        }
        return s;
    }

    switchStmt(node) {
        const value = this.expr(node.childForFieldName("value"));
        const body = node.childForFieldName("body");
        const sections = [];
        for (const sec of named(body)) {
            if (sec.type === "comment") {
                sections.push(sec.text);
                continue;
            }
            if (sec.type.startsWith("preproc")) {
                sections.push(preproc(sec));
                continue;
            }
            if (sec.type !== "switch_section") continue;
            const labels = [];
            const stmts = [];
            let expectLabel = false;
            let inBody = false;
            for (let i = 0; i < sec.childCount; i++) {
                const k = sec.child(i);
                if (!k.isNamed) {
                    if (k.type === "case") {
                        expectLabel = true;
                        inBody = false;
                    } else if (k.type === "default") {
                        labels.push("default:");
                        inBody = false;
                    } else if (k.type === ":") {
                        inBody = true;
                        expectLabel = false;
                    }
                    continue;
                }
                if (expectLabel && !inBody) {
                    if (k.type === "when_clause") {
                        labels.push(this.todo(`case guard ${k.text}`, k));
                        continue;
                    }
                    for (const l of this.caseLabels(k, value.t)) labels.push(l);
                    continue;
                }
                stmts.push(k);
            }
            const hasDecl = stmts.some(
                (k) => k.type === "local_declaration_statement" || k.type === "local_function_statement",
            );
            this.pushScope();
            const bodyText = stmts.map((k) => this.stmt(k)).join("\n");
            this.popScope();
            sections.push(`${labels.join("\n")}\n${hasDecl ? `{\n${bodyText}\n}` : bodyText}`);
        }
        return `switch (${value.s}) {\n${sections.join("\n")}\n}`;
    }

    caseLabels(p, valueT) {
        switch (p.type) {
            case "constant_pattern":
                return [`case ${this.expr(named(p)[0], valueT).s}:`];
            case "or_pattern":
                return [
                    ...this.caseLabels(p.childForFieldName("left"), valueT),
                    ...this.caseLabels(p.childForFieldName("right"), valueT),
                ];
            case "discard":
                return ["default:"];
            default:
                if (p.type.endsWith("_pattern")) return [`case ${this.todo(`pattern ${p.text}`, p)} undefined:`];
                return [`case ${this.expr(p, valueT).s}:`];
        }
    }

    // ----- expressions -------------------------------------------------------------------------

    /** -> { s, t } */
    expr(node, expected = null) {
        if (!node) return { s: "undefined", t: null };
        const r = this.expr_(node, expected);
        return r;
    }

    expr_(node, expected) {
        switch (node.type) {
            case "comment":
                this.pending.push(node.text);
                return { s: "", t: null };
            case "identifier":
                return this.identifier(node);
            case "this_expression":
            case "this":
                if (this.inMain) this.usedScript = true;
                return { s: this.selfRef, t: { cs: this.cls?.name } };
            case "base_expression":
                return { s: "super", t: null };
            case "integer_literal":
                // C# `000` is decimal; a leading zero would be an octal literal in TS.
                return {
                    s: node.text
                        .replace(/[uUlL]+$/, "")
                        .replaceAll("_", "")
                        .replace(/^0+(?=\d)/, ""),
                    t: T.num,
                };
            case "real_literal":
                return { s: node.text.replace(/[fFdDmM]$/, "").replaceAll("_", ""), t: T.num };
            case "boolean_literal":
                return { s: node.text, t: T.bool };
            case "null_literal":
                return { s: "null", t: null };
            case "string_literal":
                return { s: `"${node.text.slice(1, -1)}"`, t: T.str };
            case "verbatim_string_literal":
                return { s: JSON.stringify(node.text.slice(2, -1).replaceAll('""', '"')), t: T.str };
            case "raw_string_literal":
                return { s: JSON.stringify(node.text.replace(/^"""\n?|\n?\s*"""$/g, "")), t: T.str };
            case "character_literal":
                return { s: `"${node.text.slice(1, -1).replace(/^\\'$/, "'").replace(/"/g, '\\"')}"`, t: T.str };
            case "interpolated_string_expression":
                return this.interpolated(node);
            case "parenthesized_expression": {
                const e = this.expr(
                    named(node).find((k) => k.type !== "comment"),
                    expected,
                );
                return { s: `(${e.s})`, t: e.t };
            }
            case "member_access_expression":
                return this.memberAccess(node);
            case "invocation_expression":
                return this.invocation(node, expected);
            case "object_creation_expression":
                return this.objectCreation(node, expected);
            case "implicit_object_creation_expression":
                return this.implicitCreation(node, expected);
            case "array_creation_expression":
                return this.arrayCreation(node, expected);
            case "implicit_array_creation_expression":
            case "initializer_expression":
            case "collection_expression":
                return this.arrayLiteral(
                    node,
                    expected?.arr !== undefined ? expected : this.isArr(expected) ? expected : null,
                    expected,
                );
            case "anonymous_object_creation_expression":
                return this.anonymousObject(node);
            case "binary_expression":
                return this.binary(node);
            case "assignment_expression":
                return this.assignment(node);
            case "prefix_unary_expression": {
                const op = node.child(0).text;
                const e = this.expr(named(node)[0]);
                return { s: `${op}${e.s}`, t: op === "!" ? T.bool : e.t };
            }
            case "postfix_unary_expression": {
                const op = node.child(node.childCount - 1).text;
                const e = this.expr(named(node)[0]);
                if (op === "!") return { s: `${e.s}!`, t: e.t };
                return { s: `${e.s}${op}`, t: e.t };
            }
            case "conditional_expression": {
                const cond = this.expr(node.childForFieldName("condition"));
                const a = this.expr(node.childForFieldName("consequence"), expected);
                const b = this.expr(node.childForFieldName("alternative"), expected);
                return { s: `${cond.s} ? ${a.s} : ${b.s}`, t: a.t ?? b.t };
            }
            case "cast_expression":
                return this.cast(node);
            case "as_expression": {
                const e = this.expr(node.childForFieldName("left"));
                return {
                    s: `(${e.s} as ${this.tsTypeText(node.childForFieldName("right"))})`,
                    t: this.csType(node.childForFieldName("right")),
                };
            }
            case "is_expression": {
                const e = this.expr(node.childForFieldName("left"));
                return {
                    s: `${this.todo(`is ${node.childForFieldName("right").text}`, node)} (${e.s} != null)`,
                    t: T.bool,
                };
            }
            case "is_pattern_expression": {
                const e = this.expr(node.childForFieldName("expression"));
                return { s: `(${this.pattern(node.childForFieldName("pattern"), e.s, e.t)})`, t: T.bool };
            }
            case "conditional_access_expression": {
                const cond = this.expr(node.childForFieldName("condition"));
                const binding = named(node).find((k) => k.id !== node.childForFieldName("condition").id);
                return this.binding(binding, cond, true);
            }
            case "element_binding_expression":
                if (!this.condReceiver) return this.collection(node, expected);
                return this.binding(node, this.condReceiver, false);
            case "member_binding_expression":
                return this.binding(node, this.condReceiver ?? { s: "", t: null }, false);
            case "element_access_expression":
                return this.elementAccess(node);
            case "lambda_expression":
                return this.lambda(node, expected);
            case "tuple_expression": {
                const elems = named(node)
                    .filter((k) => k.type === "argument")
                    .map((a) => this.expr(named(a).at(-1)));
                return {
                    s: `[${elems.map((e) => e.s).join(", ")}]`,
                    t: { tuple: elems.map((e) => ({ name: null, t: e.t })) },
                };
            }
            case "switch_expression":
                return this.switchExpression(node, expected);
            case "default_expression":
            case "default_literal":
                return {
                    s: expected?.prim === "number" ? "0" : expected?.prim === "boolean" ? "false" : "null",
                    t: expected,
                };
            case "typeof_expression":
                return { s: `${this.todo(`typeof(${named(node)[0]?.text})`, node)} null`, t: null };
            case "throw_expression":
                return { s: `(() => {\nthrow ${this.expr(named(node)[0]).s};\n})()`, t: null };
            case "declaration_expression":
                return {
                    s: `${this.todo(`out ${node.text}`, node)} ${node.childForFieldName("name")?.text ?? node.text.split(/\s+/).at(-1)}`,
                    t: null,
                };
            case "await_expression":
                return { s: `${this.todo("await", node)} ${this.expr(named(node)[0]).s}`, t: null };
            case "checked_expression":
                return this.expr(named(node)[0], expected);
            case "range_expression":
                return { s: this.todo(`range ${node.text}`, node), t: null };
            case "generic_name":
                return { s: named(node)[0].text, t: null };
            case "predefined_type":
                return { s: node.text, t: null };
            case "argument":
                return this.expr(named(node).at(-1), expected);
            case "ref_expression":
                return this.expr(named(node)[0], expected);
            case "qualified_name":
                return { s: node.text, t: null };
            case "with_expression":
            default:
                return { s: `${this.todo(`expression ${node.type}`, node)} ${JSON.stringify(node.text)}`, t: null };
        }
    }

    identifier(node) {
        return this.identifierName(node.text);
    }

    identifierName(name) {
        const local = this.lookup(name);
        if (local?.alias) {
            this.need(local.alias);
            return { s: local.alias, t: local.t };
        }
        if (local) return { s: name, t: local.t };
        // A member of the class (implicit this).
        const mem = this.cls?.members.get(name);
        if (mem) {
            if (mem.isStatic) return { s: `${this.cls.name}.${mem.name}`, t: mem.t ?? null, member: mem };
            if (this.inMain) {
                this.usedScript = true;
                this.cls.usedFromMain.add(mem.name);
            }
            return { s: `${this.selfRef}.${mem.name}`, t: mem.t ?? null, member: mem };
        }
        const lib = this.libs.get(name);
        if (lib) {
            const owner = lib.ref ?? lib;
            owner.used = true;
            this.need(owner.type && owner.decl ? owner.type : owner.name);
            return { s: lib.name, t: lib.t };
        }
        if (name === "Bot") {
            this.need("bot");
            return { s: "bot", t: { ts: this.tsx.bot } };
        }
        if (name === "Core") {
            this.need("Core");
            return { s: "Core", t: { ts: this.tsx.declaredType("CoreBots") } };
        }
        // A type: enum, class (static access).
        if (this.localEnums.has(name) || this.csx.enums.has(name) || this.tsx.kindOf(name) === "enum") {
            this.need(name);
            return { s: name, t: { enumT: name } };
        }
        if (this.localClasses.has(name)) return { s: name, t: { csStatic: name } };
        const kind = this.tsx.kindOf(name);
        if (kind === "class") {
            this.need(name);
            return { s: name, t: { ts: this.tsx.valueType(name) } };
        }
        if (kind === "function" || kind === "value") {
            this.need(name);
            return { s: name, t: { ts: this.tsx.valueType(name) } };
        }
        if (this.csx.classByName(name)) {
            this.need(name);
            return { s: name, t: { csStatic: name } };
        }
        return { s: name, t: null };
    }

    memberAccess(node) {
        const exprNode = node.childForFieldName("expression");
        const nameNode = node.childForFieldName("name");
        const name = nameNode.type === "generic_name" ? named(nameNode)[0].text : nameNode.text;
        const et = exprNode.text;
        // Statics of the .NET library.
        const special = this.staticMember(et, name, node);
        if (special) return special;
        // Skua.Core.Models.GameActions.TryQuestComplete -> "tryQuestComplete" (bot.wait.forActionCooldown).
        if (/(^|\.)GameActions$/.test(et)) return { s: JSON.stringify(lcFirst(name)), t: T.str };
        // Skua.Core.Models.Skills.ClassUseMode.Def, System.Enum.X: the last segment names it.
        if (/^(Skua|System)\./.test(et) && exprNode.type === "member_access_expression") {
            const recv = this.identifierName(et.split(".").at(-1));
            return this.memberOn(recv, name, node);
        }
        // An enum nested in a class (JuggernautItemsofNulgath.RewardsSelection): exported by itself.
        const outerName = et.split(".").at(-1);
        if (this.csx.nestedEnums.has(`${outerName}.${name}`)) {
            const owner =
                this.tsx.exportSymbol(outerName)?.module ??
                tsPathOf(this.csx.nestedEnums.get(`${outerName}.${name}`).file);
            const local = this.need(name, false, owner) ?? name;
            return { s: local, t: { enumT: name } };
        }
        if (name === "Instance" && CORE_SINGLETONS[et]) {
            this.need(CORE_SINGLETONS[et]);
            return { s: CORE_SINGLETONS[et], t: { ts: this.tsx.declaredType(et) } };
        }
        const recv = this.expr(exprNode);
        return this.memberOn(recv, name, node);
    }

    memberOn(recv, name, node) {
        const t = recv.t;
        if (t?.date) {
            const d = `new Date(${recv.s})`;
            const utc = t.utc ? "UTC" : "";
            const fields = {
                Year: "FullYear",
                Month: "Month",
                Day: "Date",
                Hour: "Hours",
                Minute: "Minutes",
                Second: "Seconds",
                DayOfWeek: "Day",
                Millisecond: "Milliseconds",
            };
            if (fields[name])
                return { s: `${d}.get${utc}${fields[name]}()${name === "Month" ? " + 1" : ""}`, t: T.num };
            if (name === "Ticks") return { s: `${wrap(recv.s)} * 10000`, t: T.num };
            if (name === "Date") return { s: `new Date(${d}.toDateString()).getTime()`, t };
        }
        if (t?.span) {
            const k = {
                TotalMilliseconds: 1,
                TotalSeconds: 1000,
                TotalMinutes: 60000,
                TotalHours: 3600000,
                TotalDays: 86400000,
            }[name];
            if (k) return { s: k === 1 ? recv.s : `${wrap(recv.s)} / ${k}`, t: T.num };
            const part = {
                Milliseconds: [1, 1000],
                Seconds: [1000, 60],
                Minutes: [60000, 60],
                Hours: [3600000, 24],
                Days: [86400000, 0],
            }[name];
            if (part)
                return { s: `Math.floor(${wrap(recv.s)} / ${part[0]})${part[1] ? ` % ${part[1]}` : ""}`, t: T.num };
        }
        if (t?.position) {
            if (name === "X" || name === "Y") return { s: `${t.position}.${name.toLowerCase()}`, t: T.num };
        }
        if (name === "Position" && t?.ts && this.tsx.typeName(t.ts) === "Player")
            return { s: recv.s, t: { position: recv.s } };
        // Collections and strings.
        if (name === "Count" || name === "Length") {
            if (this.isMapT(t) || this.isSetT(t)) return { s: `${recv.s}.size`, t: T.num };
            if (this.isArr(t) || this.isStr(t) || !t || !this.memberOf(t, name))
                return { s: `${recv.s}.length`, t: T.num };
        }
        if (t?.kv || (t?.tuple === undefined && (name === "Key" || name === "Value") && !this.memberOf(t, name))) {
            if (name === "Key") return { s: `${recv.s}[0]`, t: t?.kv?.[0] ?? null };
            if (name === "Value") return { s: `${recv.s}[1]`, t: t?.kv?.[1] ?? null };
        }
        if (this.isMapT(t) && (name === "Keys" || name === "Values"))
            return {
                s: `[...${recv.s}.${name.toLowerCase()}()]`,
                t: { arr: t.map?.[name === "Keys" ? 0 : 1] ?? null },
            };
        if (/^Item\d$/.test(name) && (!t || t.tuple))
            return {
                s: `${recv.s}[${Number(name.slice(4)) - 1}]`,
                t: t?.tuple?.[Number(name.slice(4)) - 1]?.t ?? null,
            };
        if (t?.tuple) {
            const i = t.tuple.findIndex((e) => e.name === name);
            if (i >= 0) return { s: `${recv.s}[${i}]`, t: t.tuple[i].t };
        }
        // Nullable<T> of an enum or a primitive: `x.HasValue`, `x.Value`.
        if ((name === "HasValue" || name === "Value") && (t?.enumT || t?.enumMember || t?.prim))
            return name === "HasValue" ? { s: `(${recv.s} != null)`, t: T.bool } : { s: `${recv.s}!`, t };
        if (t?.enumT) return { s: `${recv.s}.${name}`, t: { enumMember: t.enumT } };
        // Skua's Monster.Alive (turu.ts's Monster has the raw fields).
        if (name === "Alive" && t?.ts && this.tsx.typeName(t.ts).replace(/ \| null$/, "") === "Monster")
            return { s: `(${recv.s}.hp > 0 && ${recv.s}.state > 0)`, t: T.bool };
        // Skua's Quest.Active (Status != null).
        if (name === "Active" && t?.ts && /^(Quest|QuestData)( \| null)?$/.test(this.tsx.typeName(t.ts)))
            return { s: `(${recv.s}.status != null)`, t: T.bool };
        const alias = t?.ts && MEMBER_ALIASES[this.tsx.typeName(t.ts).replace(/ \| null$/, "")]?.[name];
        if (alias) name = alias;
        const m = this.memberOf(t, name);
        if (m) {
            if (t?.csStatic || t?.cs) {
                const cls = this.localClasses.get(t.cs ?? t.csStatic);
                const localMem = cls && cls.name === this.cls?.name ? this.cls.members.get(name) : null;
                if (localMem)
                    return {
                        s: `${recv.s}.${localMem.name}`,
                        t: m.t,
                        member: { ...m, csSigs: localMem.csSigs ?? m.csSigs },
                    };
            }
            return { s: `${recv.s}.${m.name}`, t: m.t, member: m };
        }
        const known = this.tsx.knownName(name);
        return { s: `${recv.s}.${known ?? lcFirst(name)}`, t: null };
    }

    binding(node, recv, conditional) {
        const q = conditional ? "?." : ".";
        if (node.type === "member_binding_expression") {
            const nameNode = node.childForFieldName("name") ?? named(node)[0];
            const name = nameNode.type === "generic_name" ? named(nameNode)[0].text : nameNode.text;
            const r = this.memberOn({ s: recv.s + (conditional ? "?" : ""), t: recv.t }, name, node);
            // memberOn joins with "."; turn "x?.length" etc. right.
            return { ...r, s: r.s.replace(recv.s + "?.", recv.s + q).replace(recv.s + "?[", recv.s + "?.[") };
        }
        if (node.type === "element_binding_expression") {
            const args = named(node).filter((k) => k.type === "argument" || k.type === "bracketed_argument_list");
            const idx = args.map((a) => this.expr(a).s).join(", ");
            return { s: `${recv.s}${conditional ? "?." : ""}[${idx}]`, t: this.elemOf(recv.t) };
        }
        if (node.type === "invocation_expression") {
            // a?.B() : the binding is the function of the invocation
            const prev = this.condReceiver;
            this.condReceiver = { s: recv.s + (conditional ? "?" : ""), t: recv.t };
            const r = this.expr(node);
            this.condReceiver = prev;
            return { ...r, s: r.s.replace(recv.s + "?.", recv.s + "?.") };
        }
        if (node.type === "conditional_access_expression" || node.type === "member_access_expression") {
            const prev = this.condReceiver;
            this.condReceiver = { s: recv.s + (conditional ? "?" : ""), t: recv.t };
            const r = this.expr(node);
            this.condReceiver = prev;
            return r;
        }
        return { s: `${recv.s}${q}${this.todo(`binding ${node.type}`, node)}`, t: null };
    }

    staticMember(et, name, node) {
        if (et === "string" || et === "String") {
            if (name === "Empty") return { s: '""', t: T.str };
        }
        if (et === "int" || et === "Int32" || et === "long") {
            if (name === "MaxValue") return { s: et === "long" ? "Number.MAX_SAFE_INTEGER" : "2147483647", t: T.num };
            if (name === "MinValue") return { s: et === "long" ? "Number.MIN_SAFE_INTEGER" : "-2147483648", t: T.num };
        }
        if (et === "Environment" && name === "NewLine") return { s: '"\\n"', t: T.str };
        // DateTime and TimeSpan are milliseconds (Date.now()).
        if (et === "DateTime") {
            if (name === "Now") return { s: "Date.now()", t: { date: true, prim: "number" } };
            if (name === "UtcNow") return { s: "Date.now()", t: { date: true, utc: true, prim: "number" } };
            if (name === "MinValue") return { s: "0", t: { date: true, prim: "number" } };
            if (name === "MaxValue") return { s: "8640000000000000", t: { date: true, prim: "number" } };
            if (name === "Today")
                return { s: "new Date(new Date().toDateString()).getTime()", t: { date: true, prim: "number" } };
        }
        if (et === "TimeSpan" && name === "Zero") return { s: "0", t: { span: true, prim: "number" } };
        if (et === "DayOfWeek") {
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            if (days.includes(name)) return { s: `${days.indexOf(name)} /* ${name} */`, t: T.num };
        }
        if (et === "ClassType" || et === "mergeOptionsEnum" || et === "SkillUseMode") return null;
        return null;
    }

    interpolated(node) {
        const verbatim = /^(\$@|@\$)/.test(node.text);
        let s = "`";
        for (let i = 0; i < node.childCount; i++) {
            const k = node.child(i);
            if (k.type === "string_content") {
                let raw = k.text.replaceAll("{{", "{").replaceAll("}}", "}");
                if (verbatim) raw = raw.replaceAll("\\", "\\\\").replaceAll('""', '"');
                s += raw.replaceAll("`", "\\`").replaceAll("${", "\\${");
            } else if (k.type === "escape_sequence") {
                s += k.text === '\\"' ? '"' : k.text;
            } else if (k.type === "interpolation") {
                const kids = named(k).filter((x) => x.type !== "interpolation_brace");
                const e = this.expr(kids[0]);
                const fmt = kids.find((x) => x.type === "interpolation_format_clause");
                const align = kids.find((x) => x.type === "interpolation_alignment_clause");
                let v = e.s;
                const en = !fmt && this.numericEnumOf(e.t);
                if (en) v = `${en}[${v}]`;
                if (fmt)
                    v = formatValue(v, fmt.text.replace(/^:/, "")) ?? `${v} ${this.todo(`format ${fmt.text}`, fmt)}`;
                if (align) v = `${v} ${this.todo(`alignment ${align.text}`, align)}`;
                s += "${" + v + "}";
            }
        }
        return { s: s + "`", t: T.str };
    }

    binary(node) {
        const op = node.childForFieldName("operator")?.text ?? node.child(1).text;
        const l = this.expr(node.childForFieldName("left"));
        const r = this.expr(node.childForFieldName("right"), op === "??" ? null : l.t);
        let tsOp = op;
        // C#'s non-short-circuit `&` / `|` on booleans: the same result here (TS rejects them).
        if ((op === "&" || op === "|") && (l.t === T.bool || r.t === T.bool || /^!/.test(l.s) || /^!/.test(r.s)))
            tsOp = op + op;
        if (op === "==" || op === "!=") {
            const nullish = l.s === "null" || r.s === "null";
            tsOp = nullish ? op : op + "=";
        }
        let t = null;
        if (["==", "!=", "<", ">", "<=", ">=", "&&", "||"].includes(op)) t = T.bool;
        else if (op === "+" && (this.isStr(l.t) || this.isStr(r.t))) t = T.str;
        else if (["-", "*", "/", "%", "+"].includes(op)) t = T.num;
        else if (op === "??") t = l.t ?? r.t;
        if (op === "-" && l.t?.date && r.t?.date) t = { span: true, prim: "number" };
        else if ((op === "+" || op === "-") && l.t?.date) t = l.t;
        else if ((op === "+" || op === "-") && l.t?.span && r.t?.span) t = l.t;
        if (op === "??" && /^\((.*) \?\? null\)$/s.test(l.s)) return { s: `${l.s.slice(1, -9)} ?? ${r.s}`, t };
        if (
            op === "/" &&
            l.t?.prim === "number" &&
            r.t?.prim === "number" &&
            isIntish(node.childForFieldName("left")) &&
            isIntish(node.childForFieldName("right"))
        )
            return { s: `Math.trunc(${l.s} / ${r.s})`, t: T.num };
        return { s: `${l.s} ${tsOp} ${r.s}`, t };
    }

    assignment(node) {
        const left = node.childForFieldName("left");
        const op = node.childForFieldName("operator")?.text ?? node.child(1).text;
        // dict[key] = value -> dict.set(key, value)
        if (left.type === "element_access_expression" && op === "=") {
            const recv = this.expr(left.childForFieldName("expression"));
            if (this.isMapT(recv.t)) {
                const key = this.subscript(left);
                const v = this.expr(node.childForFieldName("right"), recv.t.map?.[1] ?? null);
                return { s: `${recv.s}.set(${key}, ${v.s})`, t: null };
            }
        }
        const l = this.expr(left);
        const r = this.expr(node.childForFieldName("right"), l.t);
        return { s: `${l.s} ${op} ${r.s}`, t: l.t };
    }

    subscript(node) {
        const sub =
            node.childForFieldName("subscript") ?? named(node).find((k) => k.type === "bracketed_argument_list");
        return named(sub)
            .filter((k) => k.type === "argument")
            .map((a) => this.expr(named(a).at(-1)).s)
            .join(", ");
    }

    elementAccess(node) {
        const recv = this.expr(node.childForFieldName("expression"));
        const sub =
            node.childForFieldName("subscript") ?? named(node).find((k) => k.type === "bracketed_argument_list");
        const args = named(sub).filter((k) => k.type === "argument");
        if (args.length === 1) {
            const a = named(args[0]).at(-1);
            if (a.type === "range_expression") {
                const [from, to] = [a.child(0), a.child(a.childCount - 1)];
                const f = from && from.type !== ".." ? this.expr(from).s : "0";
                const tt = to && to.type !== ".." && to !== from ? this.expr(to).s : null;
                return { s: `${recv.s}.slice(${f}${tt ? `, ${tt}` : ""})`, t: recv.t };
            }
            if (a.type === "prefix_unary_expression" && a.child(0).text === "^")
                return { s: `${recv.s}.at(-${this.expr(named(a)[0]).s})!`, t: this.elemOf(recv.t) };
        }
        const key = args.map((a) => this.expr(named(a).at(-1)).s).join(", ");
        if (this.isMapT(recv.t)) return { s: `${recv.s}.get(${key})!`, t: recv.t.map?.[1] ?? null };
        if (this.isStr(recv.t)) return { s: `${recv.s}[${key}]`, t: T.str };
        return { s: `${recv.s}[${key}]`, t: this.elemOf(recv.t) };
    }

    cast(node) {
        const typeNode = node.childForFieldName("type");
        const e = this.expr(node.childForFieldName("value"));
        const target = this.csType(typeNode);
        if (target?.prim === "number") {
            if (e.t?.enumMember || e.t?.enumT) return { s: e.s, t: T.num };
            if (/^(int|long|short|byte)$/.test(typeNode.text) && /[/.]/.test(e.s) && !/^[\w.]+$/.test(e.s))
                return { s: `Math.trunc(${e.s})`, t: T.num };
            return { s: e.s, t: T.num };
        }
        if (target?.prim) return { s: e.s, t: target };
        return { s: `(${e.s} as ${this.tsTypeText(typeNode)})`, t: target };
    }

    pattern(p, subject, subjectT) {
        switch (p.type) {
            case "constant_pattern": {
                const v = this.expr(named(p)[0], subjectT);
                return v.s === "null" ? `${subject} == null` : `${subject} === ${v.s}`;
            }
            case "negated_pattern": {
                const inner = named(p)[0];
                if (inner.type === "constant_pattern" && named(inner)[0].type === "null_literal")
                    return `${subject} != null`;
                return `!(${this.pattern(inner, subject, subjectT)})`;
            }
            case "or_pattern":
                return `${this.pattern(p.childForFieldName("left"), subject, subjectT)} || ${this.pattern(p.childForFieldName("right"), subject, subjectT)}`;
            case "and_pattern":
                return `${this.pattern(p.childForFieldName("left"), subject, subjectT)} && ${this.pattern(p.childForFieldName("right"), subject, subjectT)}`;
            case "relational_pattern": {
                const op = p.child(0).text;
                return `${subject} ${op} ${this.expr(named(p)[0]).s}`;
            }
            case "parenthesized_pattern":
                return `(${this.pattern(named(p)[0], subject, subjectT)})`;
            case "discard":
                return "true";
            case "declaration_pattern": {
                const n = p.childForFieldName("name")?.text;
                if (n) this.declare(n, this.csType(p.childForFieldName("type")));
                return `${this.todo(`pattern ${p.text}`, p)} ${subject} != null`;
            }
            default:
                return `${this.todo(`pattern ${p.text}`, p)} ${subject} != null`;
        }
    }

    switchExpression(node, expected) {
        const value = this.expr(named(node)[0]);
        const arms = named(node).filter((k) => k.type === "switch_expression_arm");
        const simple = /^[\w.]+$/.test(value.s);
        const subj = simple ? value.s : "v";
        let s = "";
        let t = null;
        let close = "";
        for (const arm of arms) {
            const kids = named(arm);
            const pat = kids[0];
            const when = kids.find((k) => k.type === "when_clause");
            const res = this.expr(kids.at(-1), expected);
            t ??= res.t;
            let cond = pat.type === "discard" ? null : this.pattern(pat, subj, value.t);
            if (when) cond = `${cond ? `(${cond}) && ` : ""}(${this.expr(named(when)[0]).s})`;
            if (cond === null) {
                s += res.s;
                close = "";
                break;
            }
            s += `${cond} ? ${res.s} : `;
            close = this.todo("switch expression without a default arm", node) + " undefined";
        }
        s += close;
        return { s: simple ? `(${s})` : `((v) => ${s})(${value.s})`, t };
    }

    lambda(node, expected, paramTypes = null) {
        const ps = node.childForFieldName("parameters");
        const body = node.childForFieldName("body");
        this.pushScope();
        let params;
        if (ps.type === "implicit_parameter" || ps.type === "identifier") {
            this.declare(ps.text, paramTypes?.[0] ?? null);
            params = `(${ps.text})`;
        } else {
            const list = paramsOf(ps);
            const out = list.map((p, i) => {
                this.declare(p.name, p.typeNode ? this.csType(p.typeNode) : (paramTypes?.[i] ?? null));
                return p.typeNode ? `${p.name}: ${this.tsTypeText(p.typeNode)}` : p.name;
            });
            params = `(${out.join(", ")})`;
        }
        const prevRet = this.returnType;
        this.returnType = null;
        let b;
        let t = null;
        if (body.type === "block") b = this.block(body);
        else {
            const e = this.expr(body);
            t = e.t;
            b = e.s.startsWith("{") ? `(${e.s})` : e.s;
        }
        this.returnType = prevRet;
        this.popScope();
        return { s: `${params} => ${b}`, t: { fn: true, ret: t } };
    }

    /** C# 12 `[a, .. b]`: an array, `..` spreads. */
    collection(node, expected) {
        const elemT = this.elemOf(expected);
        const items = named(node)
            .filter((k) => k.type === "argument")
            .map((a) => {
                const e = named(a).at(-1);
                if (e.type === "range_expression" && e.child(0).type === "..")
                    return `...${wrap(this.expr(named(e)[0]).s)}`;
                return this.expr(e, elemT).s;
            });
        if (this.isSetT(expected)) return { s: `new Set([${items.join(", ")}])`, t: expected };
        return { s: `[${items.join(", ")}]`, t: expected?.arr !== undefined ? expected : { arr: elemT } };
    }

    anonymousObject(node) {
        const props = [];
        for (const k of named(node)) {
            if (k.type === "comment") continue;
            if (k.type === "assignment_expression" || k.type === "name_equals")
                props.push(
                    `${lcFirst(k.childForFieldName("left")?.text ?? named(k)[0].text)}: ${this.expr(k.childForFieldName("right") ?? named(k).at(-1)).s}`,
                );
            else props.push(this.expr(k).s);
        }
        return { s: `{ ${props.join(", ")} }`, t: null };
    }

    /** Elements of an initializer, comments kept after their element. */
    elements(node, elemT) {
        const out = [];
        for (let i = 0; i < node.childCount; i++) {
            const k = node.child(i);
            if (!k.isNamed) continue;
            if (k.type === "comment") {
                if (out.length) out[out.length - 1].comments.push(k.text);
                else out.push({ s: null, comments: [k.text] });
                continue;
            }
            if (k.type.startsWith("preproc")) {
                out.push({ s: null, comments: [preproc(k)] });
                continue;
            }
            if (k.type === "initializer_expression" && node.type === "initializer_expression" && !elemT) {
                out.push({ s: this.expr(k).s, comments: [] });
                continue;
            }
            out.push({ s: this.expr(k, elemT).s, comments: [] });
        }
        return out;
    }

    joinElements(list, open = "[", close = "]") {
        if (list.every((e) => e.comments.length === 0)) return `${open}${list.map((e) => e.s).join(", ")}${close}`;
        return `${open}\n${list.map((e) => (e.s === null ? "" : e.s + ",") + e.comments.map((c) => " " + c + "\n").join("") + (e.comments.length ? "" : "\n")).join("")}${close}`;
    }

    arrayLiteral(node, arrT, expected) {
        if (this.isMapT(expected)) return this.mapLiteral(node, expected);
        if (node.type === "implicit_array_creation_expression")
            node = named(node).find((k) => k.type === "initializer_expression") ?? node;
        const elemT = this.elemOf(arrT);
        const list = this.elements(node, elemT);
        return { s: this.joinElements(list), t: arrT ?? { arr: null } };
    }

    mapLiteral(init, mapT) {
        const entries = [];
        for (const k of named(init)) {
            if (k.type === "comment") {
                entries.push({ s: null, comments: [k.text] });
                continue;
            }
            if (k.type === "initializer_expression") {
                const [a, b] = named(k).filter((x) => x.type !== "comment");
                entries.push({
                    s: `[${this.expr(a, mapT.map?.[0]).s}, ${this.expr(b, mapT.map?.[1]).s}]`,
                    comments: [],
                });
            } else if (k.type === "assignment_expression") {
                const left = k.childForFieldName("left");
                const key = named(left)
                    .filter((x) => x.type === "argument")
                    .map((a) => this.expr(named(a).at(-1)).s)
                    .join(", ");
                entries.push({
                    s: `[${key}, ${this.expr(k.childForFieldName("right"), mapT.map?.[1]).s}]`,
                    comments: [],
                });
            } else entries.push({ s: this.todo(`map entry ${k.text}`, k), comments: [] });
        }
        return { s: entries.length ? `new Map(${this.joinElements(entries)})` : "new Map()", t: mapT };
    }

    arrayCreation(node, expected) {
        const typeNode = node.childForFieldName("type");
        const init = named(node).find((k) => k.type === "initializer_expression");
        const t = this.csType(typeNode);
        if (init) return this.arrayLiteral(init, t, t);
        const rank = typeNode?.descendantsOfType("array_rank_specifier")[0];
        const size = rank ? named(rank)[0] : null;
        if (size) {
            const elem = t?.arr;
            const fill =
                elem?.prim === "number"
                    ? "0"
                    : elem?.prim === "boolean"
                      ? "false"
                      : elem?.prim === "string"
                        ? '""'
                        : "null";
            return { s: `new Array(${this.expr(size).s}).fill(${fill})`, t };
        }
        return { s: "[]", t };
    }

    objectCreation(node, expected) {
        const typeNode = node.childForFieldName("type");
        const args = node.childForFieldName("arguments");
        const init =
            node.childForFieldName("initializer") ?? named(node).find((k) => k.type === "initializer_expression");
        const argNodes = args ? named(args).filter((k) => k.type === "argument") : [];
        const t = this.csType(typeNode);
        let typeName = typeNode.type === "generic_name" ? named(typeNode)[0].text : typeNode.text.split(".").at(-1);
        if (typeNode.type === "generic_name" && typeName === "Option") {
            return this.optionCreation(named(named(typeNode)[1])[0], argNodes, node);
        }
        // `new Action(() => ...)`, `new Func<int>(...)`: the delegate is the lambda itself.
        if ((typeName === "Action" || typeName === "Func") && argNodes.length === 1 && !init)
            return this.expr(named(argNodes[0]).at(-1), expected);
        if (t?.arr !== undefined || LIST_TYPES.has(typeName)) {
            if (init) return this.arrayLiteral(init, t, t);
            if (argNodes.length === 1) {
                const a = this.expr(named(argNodes[0]).at(-1));
                if (a.t?.prim === "number") return { s: "[]", t };
                return { s: `[...${a.s}]`, t };
            }
            return { s: "[]", t };
        }
        if (t?.map || MAP_TYPES.has(typeName)) {
            if (init) {
                const m = this.mapLiteral(init, t);
                // Tuple values (`(int Order, Action Action)`) would be inferred as arrays of a union.
                const tt = t?.map?.[1]?.tuple ? this.tsTypeText(typeNode) : "";
                if (tt.startsWith("Map<")) m.s = m.s.replace(/^new Map\(/, `new ${tt}(`);
                return m;
            }
            if (argNodes.length === 1) {
                const a = this.expr(named(argNodes[0]).at(-1));
                if (/StringComparer/.test(a.s))
                    return { s: `new Map() ${this.todo("case-insensitive keys", node)}`, t };
                return { s: `new Map(${a.s})`, t };
            }
            return { s: "new Map()", t };
        }
        if (t?.set || SET_TYPES.has(typeName)) {
            const elems = init
                ? this.joinElements(this.elements(init, t?.set))
                : argNodes.length
                  ? this.expr(named(argNodes[0]).at(-1)).s
                  : "";
            return { s: `new Set(${elems})`, t };
        }
        if (typeName === "Exception" || /Exception$/.test(typeName)) {
            const a = argNodes.map((x) => this.expr(named(x).at(-1)).s);
            return { s: `new Error(${a[0] ?? ""})`, t: null };
        }
        if (typeName === "Random") return { s: "null", t: { random: true } };
        if (typeName === "DateTime") {
            const a = argNodes.map((x) => this.expr(named(x).at(-1)).s);
            if (a.length >= 3)
                return {
                    s: `new Date(${a[0]}, ${a[1]} - 1, ${a.slice(2).join(", ")}).getTime()`,
                    t: { date: true, prim: "number" },
                };
        }
        if (typeName === "StringBuilder") return { s: `${this.todo("StringBuilder", node)} []`, t: { arr: T.str } };
        if (
            typeName === "CancellationTokenSource" ||
            typeName === "Stopwatch" ||
            typeName === "Thread" ||
            typeName === "Task"
        )
            return { s: `${this.todo(`new ${typeName}`, node)} null`, t: null };
        // A class: TS (ported) or C#.
        const argList = this.callArgs(argNodes, [], this.ctorSigs(typeName), node);
        this.need(MODEL_TYPES[typeName] ?? typeName);
        let s = `new ${MODEL_TYPES[typeName] ?? typeName}(${argList})`;
        if (init) {
            const props = named(init)
                .filter((k) => k.type === "assignment_expression")
                .map(
                    (k) => `${lcFirst(k.childForFieldName("left").text)}: ${this.expr(k.childForFieldName("right")).s}`,
                );
            s = `Object.assign(${s}, { ${props.join(", ")} })`;
        }
        return { s, t: t ?? this.namedType(typeName) };
    }

    ctorSigs(typeName) {
        const cls = this.localClasses.get(typeName) ?? this.csx.classByName(typeName);
        return cls ? [] : [];
    }

    implicitCreation(node, expected) {
        const args = named(node).find((k) => k.type === "argument_list");
        const init = named(node).find((k) => k.type === "initializer_expression");
        const argNodes = args ? named(args).filter((k) => k.type === "argument") : [];
        if (this.isArr(expected) || expected?.arr !== undefined) {
            if (init) return this.arrayLiteral(init, expected, expected);
            return { s: "[]", t: expected };
        }
        if (this.isMapT(expected)) return init ? this.mapLiteral(init, expected) : { s: "new Map()", t: expected };
        if (this.isSetT(expected))
            return { s: `new Set(${init ? this.joinElements(this.elements(init, expected.set)) : ""})`, t: expected };
        if (expected?.tsName || expected?.cs) {
            const name = expected.tsName ?? expected.cs;
            this.need(name);
            return { s: `new ${name}(${argNodes.map((a) => this.expr(named(a).at(-1)).s).join(", ")})`, t: expected };
        }
        if (init) return this.arrayLiteral(init, null, null);
        // `int x = new()` is 0 (and false, "" for bool and string).
        if (expected?.prim === "number" && !expected.date && !expected.span) return { s: "0", t: expected };
        if (expected?.prim === "boolean") return { s: "false", t: expected };
        if (expected?.prim === "string") return { s: '""', t: expected };
        return { s: `${this.todo("new() of an unknown type", node)} {}`, t: null };
    }

    /** `new Option<T>(name, display, description, default)` -> option.bool/int/text/choice */
    optionCreation(typeArg, argNodes, node) {
        const args = argNodes.map((a) => this.expr(named(a).at(-1)).s);
        this.need("option");
        const t = typeArg.text;
        if (t === "bool") return { s: `option.bool(${args.slice(0, 4).join(", ")})`, t: null };
        if (NUMBER_TYPES.has(t)) return { s: `option.int(${args.slice(0, 4).join(", ")})`, t: null };
        if (t === "string") return { s: `option.text(${args.slice(0, 4).join(", ")})`, t: null };
        this.need("choices");
        const numeric = this.isNumericEnum(t);
        const tl = this.enumName(t);
        let def = args[3];
        if (def !== undefined && numeric) def = `${tl}[${def}]`;
        const rest = args.length > 4 ? ` ${this.todo(`extra Option arguments ${args.slice(4).join(", ")}`, node)}` : "";
        return {
            s: `option.choice(${[...args.slice(0, 3), `choices(${tl})`, ...(def !== undefined ? [def] : [])].join(", ")})${rest}`,
            t: null,
        };
    }

    /** The (local) name of the numeric enum a value of type `t` belongs to, else null. */
    numericEnumOf(t) {
        const en = t?.enumMember ?? t?.enumT ?? (t?.tsName && this.csx.enums.has(t.tsName) ? t.tsName : null);
        if (!en || !this.isNumericEnum(en)) return null;
        return this.localEnums.has(en) ? en : this.enumName(en);
    }

    /** A C# enum type's name here: `Outer.Enum` (an enum nested in another script's class) imported. */
    enumName(text) {
        const [outer, name] = text.split(".").slice(-2);
        if (name && this.csx.nestedEnums.has(`${outer}.${name}`)) {
            const owner =
                this.tsx.exportSymbol(outer)?.module ?? tsPathOf(this.csx.nestedEnums.get(`${outer}.${name}`).file);
            return this.need(name, false, owner) ?? name;
        }
        this.need(text);
        return text;
    }

    isNumericEnum(name) {
        if (name.includes(".")) {
            const nested = this.csx.nestedEnums.get(name.split(".").slice(-2).join("."));
            if (nested) return nested.members.some((m) => m.value !== null);
        }
        const local = this.localEnums.get(name);
        if (local) return local.descendantsOfType("enum_member_declaration").some((m) => m.childForFieldName("value"));
        // A ported enum: as the port declares it (CoreBLOD's `BLODMethod` is numeric, C#'s has no values).
        const ported = this.tsx.isNumericEnum(name);
        if (ported !== null) return ported;
        const cs = this.csx.enums.get(name);
        if (cs) return cs.members.some((m) => m.value !== null);
        return false;
    }

    // ----- calls -------------------------------------------------------------------------------

    invocation(node, expected) {
        const fn = node.childForFieldName("function");
        const argList = node.childForFieldName("arguments");
        const argNodes = argList ? named(argList).filter((k) => k.type === "argument") : [];
        if (argList) this.takeComments(argList);

        if (fn.type === "identifier" && fn.text === "nameof")
            return { s: JSON.stringify(argNodes[0]?.text.split(".").at(-1) ?? ""), t: T.str };

        if (fn.type === "member_access_expression") {
            const exprNode = fn.childForFieldName("expression");
            const nameNode = fn.childForFieldName("name");
            const name = nameNode.type === "generic_name" ? named(nameNode)[0].text : nameNode.text;
            const typeArgs = nameNode.type === "generic_name" ? named(named(nameNode)[1]) : [];
            const st = this.staticCall(exprNode.text, name, argNodes, typeArgs, node);
            if (st) return st;
            const recv = this.expr(exprNode);
            return this.methodCall(recv, name, typeArgs, argNodes, node, expected);
        }
        if (fn.type === "member_binding_expression" && this.condReceiver) {
            const nameNode = fn.childForFieldName("name") ?? named(fn)[0];
            const name = nameNode.type === "generic_name" ? named(nameNode)[0].text : nameNode.text;
            const typeArgs = nameNode.type === "generic_name" ? named(named(nameNode)[1]) : [];
            const r = this.methodCall(this.condReceiver, name, typeArgs, argNodes, node, expected);
            return { ...r, s: r.s.replace(this.condReceiver.s + ".", this.condReceiver.s + ".") };
        }
        if (fn.type === "conditional_access_expression") {
            // a?.B(...) parses as (a?.B)(...)
            const cond = this.expr(fn.childForFieldName("condition"));
            const binding = named(fn).find((k) => k.id !== fn.childForFieldName("condition").id);
            if (binding.type === "member_binding_expression") {
                const nameNode = binding.childForFieldName("name") ?? named(binding)[0];
                const name = nameNode.type === "generic_name" ? named(nameNode)[0].text : nameNode.text;
                const typeArgs = nameNode.type === "generic_name" ? named(named(nameNode)[1]) : [];
                const r = this.methodCall({ s: cond.s + "?", t: cond.t }, name, typeArgs, argNodes, node, expected);
                return r;
            }
            const f = this.expr(fn);
            return { s: `${f.s}(${argNodes.map((a) => this.expr(a).s).join(", ")})`, t: null };
        }
        if (fn.type === "identifier" || fn.type === "generic_name") {
            const name = fn.type === "generic_name" ? named(fn)[0].text : fn.text;
            const local = this.lookup(name);
            if (local) return { s: `${name}(${this.callArgs(argNodes, [], null, node)})`, t: local.t?.ret ?? null };
            const mem = this.cls?.members.get(name);
            if (mem) {
                const self = mem.isStatic ? this.cls.name : this.selfRef;
                if (!mem.isStatic && this.inMain) {
                    this.usedScript = true;
                    this.cls.usedFromMain.add(mem.name);
                }
                const sigs = mem.csSigs ?? [];
                const ported = this.cls.tsType ? this.memberOf({ ts: this.cls.tsType }, name) : null;
                if (ported?.kind === "method")
                    return {
                        s: `${self}.${ported.name}(${this.callArgs(argNodes, ported.tsSigs, sigs, node)})`,
                        t: ported.t,
                    };
                return {
                    s: `${self}.${mem.name}(${this.callArgs(argNodes, [], sigs, node)})`,
                    t: sigs[0] ? this.csTypeFromText(sigs[0].returns) : null,
                };
            }
            const r = this.expr(fn);
            return { s: `${r.s}(${this.callArgs(argNodes, [], null, node)})`, t: null };
        }
        const f = this.expr(fn);
        return { s: `${f.s}(${this.callArgs(argNodes, [], null, node)})`, t: null };
    }

    staticCall(recvText, name, argNodes, typeArgs, node) {
        const a = () => argNodes.map((x) => this.expr(named(x).at(-1)));
        const isString = recvText === "string" || recvText === "String";
        if (isString) {
            const args = a();
            switch (name) {
                case "IsNullOrEmpty":
                    return { s: `!${wrap(args[0].s)}`, t: T.bool };
                case "IsNullOrWhiteSpace":
                    return { s: `!${wrap(args[0].s)}?.trim()`, t: T.bool };
                case "Join":
                    return {
                        s: `${wrap(
                            args.length > 2
                                ? `[${args
                                      .slice(1)
                                      .map((x) => x.s)
                                      .join(", ")}]`
                                : args[1].s,
                        )}.join(${args[0].s})`,
                        t: T.str,
                    };
                case "Concat":
                    return { s: args.map((x) => x.s).join(" + "), t: T.str };
                case "Format":
                    return {
                        s: `${this.todo("string.Format", node)} [${args.map((x) => x.s).join(", ")}].join(" ")`,
                        t: T.str,
                    };
                case "Equals":
                    return { s: `${args[0].s} === ${args[1].s}`, t: T.bool };
                case "Compare":
                    return { s: `${args[0].s}.localeCompare(${args[1].s})`, t: T.num };
            }
        }
        if (recvText === "Math") {
            const args = a();
            return { s: `Math.${lcFirst(name)}(${args.map((x) => x.s).join(", ")})`, t: T.num };
        }
        if (/^(int|long|Int32|double|float|decimal)$/.test(recvText)) {
            const args = a();
            if (name === "Parse")
                return {
                    s: /^(int|long|Int32)$/.test(recvText) ? `parseInt(${args[0].s})` : `Number(${args[0].s})`,
                    t: T.num,
                };
            if (name === "TryParse")
                return { s: `${this.todo("TryParse", node)} !isNaN(Number(${args[0].s}))`, t: T.bool };
        }
        if (recvText === "Convert") {
            const args = a();
            if (/^ToInt/.test(name)) return { s: `Math.trunc(Number(${args[0].s}))`, t: T.num };
            if (name === "ToDouble" || name === "ToSingle" || name === "ToDecimal")
                return { s: `Number(${args[0].s})`, t: T.num };
            if (name === "ToBoolean") return { s: `Boolean(${args[0].s})`, t: T.bool };
            if (name === "ToString") return { s: `String(${args[0].s})`, t: T.str };
        }
        if (recvText === "TimeSpan" && /^From/.test(name)) {
            const k = {
                FromMilliseconds: 1,
                FromSeconds: 1000,
                FromMinutes: 60000,
                FromHours: 3600000,
                FromDays: 86400000,
            }[name];
            if (k) {
                const v = a()[0].s;
                return { s: k === 1 ? v : `${wrap(v)} * ${k}`, t: { span: true, prim: "number" } };
            }
        }
        if (recvText === "Thread" && name === "Sleep")
            return { s: `bot.sleep(${a()[0].s})`, t: null, need: this.need("bot") };
        if (recvText === "Task" && name === "Delay")
            return { s: `bot.sleep(${a()[0].s})`, t: null, need: this.need("bot") };
        if (recvText === "Enum") {
            const args = a();
            if (name === "GetValues" || name === "GetNames") {
                const tcs = typeArgs[0]?.text ?? /typeof\(([\w.]+)\)/.exec(argNodes[0]?.text ?? "")?.[1];
                if (tcs) {
                    const numeric = this.isNumericEnum(tcs);
                    const tn = this.enumName(tcs);
                    this.need("choices");
                    return name === "GetNames" || !numeric
                        ? { s: `(choices(${tn}) as ${tn}[])`, t: { arr: { enumMember: tn } } }
                        : {
                              s: `choices(${tn}).map((n) => ${tn}[n as keyof typeof ${tn}])`,
                              t: { arr: { enumMember: tn } },
                          };
                }
            }
            if (name === "Parse") {
                const tn = typeArgs[0]?.text ?? /typeof\((\w+)\)/.exec(argNodes[0]?.text ?? "")?.[1];
                const value = typeArgs[0] ? args[0] : args[1];
                if (tn && value) {
                    this.need(tn);
                    return { s: `${tn}[${value.s} as keyof typeof ${tn}]`, t: { enumMember: tn } };
                }
            }
            if (name === "Parse" || name === "TryParse")
                return { s: `${this.todo(`Enum.${name}`, node)} ${args.map((x) => x.s).join(", ")}`, t: null };
            if (name === "GetName") {
                const tcs = typeArgs[0]?.text ?? /typeof\(([\w.]+)\)/.exec(argNodes[0]?.text ?? "")?.[1];
                if (tcs && this.isNumericEnum(tcs)) return { s: `${this.enumName(tcs)}[${args.at(-1).s}]`, t: T.str };
                if (tcs) return { s: `String(${args.at(-1).s})`, t: T.str };
                return { s: `${this.todo("Enum.GetName", node)} String(${args.at(-1).s})`, t: T.str };
            }
        }
        if (recvText === "Array" && name === "Empty") return { s: "[]", t: { arr: null } };
        if (recvText === "Enumerable") {
            const args = a();
            if (name === "Empty") return { s: "[]", t: { arr: typeArgs[0] ? this.csType(typeArgs[0]) : null } };
            if (name === "Range")
                return { s: `Array.from({ length: ${args[1].s} }, (_, i) => ${args[0].s} + i)`, t: { arr: T.num } };
            if (name === "Repeat") return { s: `new Array(${args[1].s}).fill(${args[0].s})`, t: { arr: args[0].t } };
        }
        if ((recvText === "JArray" || recvText === "JObject" || recvText === "JToken") && name === "Parse")
            return { s: `JSON.parse(${a()[0].s})`, t: null };
        if (recvText === "JsonConvert" && name === "DeserializeObject") {
            const tt = typeArgs[0] ? ` as ${this.tsTypeText(typeArgs[0])}` : "";
            return { s: `(JSON.parse(${a()[0].s})${tt})`, t: typeArgs[0] ? this.csType(typeArgs[0]) : null };
        }
        if (recvText === "JsonConvert" && name === "SerializeObject")
            return { s: `JSON.stringify(${a()[0].s})`, t: T.str };
        if (recvText === "Array" && name === "Exists") {
            const args = a();
            return { s: `${args[0].s}.some(${args[1].s})`, t: T.bool };
        }
        if (recvText === "Array" && name === "IndexOf" && argNodes.length === 2) {
            const args = a();
            return { s: `${args[0].s}.indexOf(${args[1].s})`, t: T.num };
        }
        if (recvText === "Array" && (name === "Find" || name === "FindAll") && argNodes.length === 2) {
            const args = a();
            return name === "Find"
                ? { s: `(${args[0].s}.find(${args[1].s}) ?? null)`, t: args[0].t?.arr ?? null }
                : { s: `${args[0].s}.filter(${args[1].s})`, t: args[0].t };
        }
        if (
            recvText === "DateTime" ||
            recvText === "TimeSpan" ||
            recvText === "Stopwatch" ||
            recvText === "File" ||
            recvText === "Directory" ||
            recvText === "Path" ||
            recvText === "Process" ||
            recvText === "Regex" ||
            recvText === "Console"
        )
            return { s: `${this.todo(`${recvText}.${name}`, node)} null`, t: null };
        return null;
    }

    methodCall(recv, name, typeArgs, argNodes, node, expected) {
        const t = recv.t;
        if (t?.date && /^Add/.test(name)) {
            const k = {
                AddMilliseconds: 1,
                AddSeconds: 1000,
                AddMinutes: 60000,
                AddHours: 3600000,
                AddDays: 86400000,
                Add: 1,
            }[name];
            if (k) {
                const v = this.expr(named(argNodes[0]).at(-1)).s;
                return { s: `${recv.s} + ${k === 1 ? v : `${wrap(v)} * ${k}`}`, t };
            }
        }
        if (t?.date && name === "Subtract") {
            const v = this.expr(named(argNodes[0]).at(-1));
            return { s: `${recv.s} - ${wrap(v.s)}`, t: v.t?.date ? { span: true, prim: "number" } : t };
        }
        // Bot.Random.Next(a, b) and new Random().Next: randomInt(min, max) is [min, max) too.
        if (name === "Next" && (/^bot\.random$/i.test(recv.s) || t?.random)) {
            const a = argNodes.map((x) => this.expr(named(x).at(-1)).s);
            this.need("randomInt");
            if (a.length === 2) return { s: `randomInt(${a[0]}, ${a[1]})`, t: T.num };
            if (a.length === 1) return { s: `randomInt(0, ${a[0]})`, t: T.num };
            return { s: "randomInt(0, 2147483647)", t: T.num };
        }
        const targs = typeArgs.length ? `<${typeArgs.map((x) => this.tsTypeText(x)).join(", ")}>` : "";
        const q = recv.s.endsWith("?") ? "?." : ".";
        const base = recv.s.replace(/\?$/, "");

        // Core.QuestRequirements<int>(...) / <string>(...): C#'s two generic versions.
        if (name === "QuestRequirements" && typeArgs.length === 1 && recv.t?.ts === this.tsx.declaredType("CoreBots")) {
            const ids = NUMBER_TYPES.has(typeArgs[0].text);
            const args = argNodes.map((x) => this.expr(named(x).at(-1)).s).join(", ");
            return {
                s: `${base}${q}${ids ? "questRequirementIds" : "questRequirements"}(${args})`,
                t: { arr: ids ? T.num : T.str },
            };
        }
        // Bot.Config.Get<NumericEnum>(name) -> configEnum(name, E, first)
        if (
            name === "Get" &&
            /\.config!?$/.test(base) &&
            typeArgs.length === 1 &&
            this.isNumericEnum(typeArgs[0].text)
        ) {
            this.need("configEnum");
            const cs = typeArgs[0].text;
            const e = this.enumName(cs);
            const first =
                this.localEnums.get(cs)?.descendantsOfType("enum_member_declaration")[0]?.childForFieldName("name")
                    .text ??
                (this.csx.nestedEnums.get(cs.split(".").slice(-2).join(".")) ?? this.csx.enums.get(cs))?.members[0]
                    ?.name;
            return {
                s: `configEnum(${argNodes.map((x) => this.expr(x).s).join(", ")}, ${e}, ${e}.${first})`,
                t: { enumMember: e },
            };
        }

        // Skills.StartAdvanced(string skills, int timeout, SkillUseMode) is startSkills in Turu.
        if (name === "StartAdvanced" && /\.skills$/.test(base) && argNodes.length >= 2) {
            const second = named(argNodes[1]).at(-1);
            if (second.type === "integer_literal" || /SkillUseMode/.test(argNodes.at(-1).text)) name = "StartSkills";
        }
        // C# array overloads that the port names apart: EnsureComplete(params int[]) etc.
        const ARRAY_OVERLOADS = {
            EnsureComplete: "EnsureCompleteQuests",
            EnsureAccept: "EnsureAcceptmultiple",
            EnsureLoad: "EnsureLoadMany",
            EnsureCompleteChoose: null,
        };
        // More arguments than the single-quest form takes: C#'s params overload.
        if (name === "EnsureComplete" && argNodes.length > 2 && !argNodes.some((a) => a.childForFieldName("name")))
            name = "EnsureCompleteQuests";
        else if (name === "EnsureAccept" && argNodes.length > 1 && !argNodes.some((a) => a.childForFieldName("name")))
            name = "EnsureAcceptmultiple";
        else if (name === "EnsureLoad" && argNodes.length > 1) name = "EnsureLoadMany";
        else if (ARRAY_OVERLOADS[name] && argNodes.length === 1 && !argNodes[0].childForFieldName("name")) {
            const only = named(argNodes[0]).at(-1);
            if (isArrayExpr(only) || only.type === "element_binding_expression" || this.isSpreadable(this.expr(only).t))
                name = ARRAY_OVERLOADS[name];
        }
        // Bot.StopSync(bool) / Bot.Stop(): bot.stop() (it throws, ending the script).
        if ((name === "StopSync" || name === "Stop") && t?.ts === this.tsx.bot) return { s: `${base}.stop()`, t: null };
        // VibeSkua names that turu.ts spells differently.
        const alias = t?.ts && MEMBER_ALIASES[this.tsx.typeName(t.ts)]?.[name];
        if (alias) name = alias;
        const m = this.memberOf(t, name);
        if (m && m.kind === "method") {
            const elemT = this.elemOf(t);
            const args = this.callArgs(argNodes, m.tsSigs ?? [], m.csSigs ?? null, node, elemT);
            let rt = m.t;
            if (typeArgs.length && name === "Get") rt = this.csType(typeArgs[0]);
            return { s: `${base}${q}${m.name}${targs}(${args})`, t: rt };
        }
        // A C# extension method ported as a function (`s.FormatForCompare()` -> `formatForCompare(s)`).
        if (this.csx.extensions.has(name) && this.tsx.kindOf(lcFirst(name)) === "function") {
            this.need(lcFirst(name));
            const sigs = this.tsx.signatures(this.tsx.valueType(lcFirst(name)));
            const rest = this.callArgs(
                argNodes,
                sigs.map((x) => ({ ...x, params: x.params.slice(1) })),
                null,
                node,
            );
            return {
                s: `${lcFirst(name)}(${base}${rest ? `, ${rest}` : ""})`,
                t: sigs[0] ? { ts: sigs[0].returnType } : null,
            };
        }
        // C# library: collections, strings, LINQ.
        const lib = this.libraryCall(base, q, name, typeArgs, argNodes, t, node);
        if (lib) return lib;
        // Unknown: keep the call, camelCased.
        const known = this.tsx.knownName(name);
        if (t?.ts && !m)
            return {
                s: `${base}${q}${known ?? lcFirst(name)}${targs}(${this.callArgs(argNodes, [], null, node)}) ${this.todo(`${this.tsx.typeName(t.ts)} has no ${name}`, node)}`,
                t: null,
            };
        return {
            s: `${base}${q}${known ?? lcFirst(name)}${targs}(${this.callArgs(argNodes, [], null, node)})`,
            t: null,
        };
    }

    /** Lambda argument types for collection methods. */
    lambdaArgs(argNodes, elemT) {
        return argNodes.map((a) => {
            const e = named(a).at(-1);
            if (e.type === "lambda_expression") return this.lambda(e, null, [elemT, T.num]).s;
            return this.expr(e).s;
        });
    }

    libraryCall(base, q, name, typeArgs, argNodes, t, node) {
        const elemT = this.elemOf(t);
        const args = () => this.lambdaArgs(argNodes, elemT);
        const isStr = this.isStr(t);
        const isMap = this.isMapT(t);
        const isSet = this.isSetT(t);
        const r = (s, rt = null) => ({ s, t: rt });
        const call = (m, a = args()) => `${base}${q}${m}(${a.join(", ")})`;
        const idx = q === "?." ? "?." : "";
        if (isMap) {
            switch (name) {
                case "ContainsKey":
                    return r(call("has"), T.bool);
                case "Add":
                case "TryAdd":
                    return r(call("set"));
                case "Remove":
                    return r(call("delete"), T.bool);
                case "Clear":
                    return r(call("clear"));
                case "TryGetValue":
                    return r(`${this.todo("TryGetValue", node)} ${call("has", [args()[0]])}`, T.bool);
                case "ContainsValue":
                    return r(`[...${base}.values()].includes(${args()[0]})`, T.bool);
                case "GetValueOrDefault":
                    return r(`(${base}.get(${args()[0]}) ?? ${args()[1] ?? "null"})`, t.map?.[1] ?? null);
            }
        }
        if (isSet) {
            switch (name) {
                case "Contains":
                    return r(call("has"), T.bool);
                case "Add":
                    return r(call("add"));
                case "Remove":
                    return r(call("delete"), T.bool);
                case "Clear":
                    return r(call("clear"));
            }
        }
        if (isStr || (!this.isArr(t) && STRING_ONLY.has(name))) {
            const a = args();
            switch (name) {
                case "ToLower":
                case "ToLowerInvariant":
                    return r(call("toLowerCase", []), T.str);
                case "ToUpper":
                case "ToUpperInvariant":
                    return r(call("toUpperCase", []), T.str);
                case "Trim":
                    return r(
                        a.length ? `${this.todo("Trim(chars)", node)} ${call("trim", [])}` : call("trim", []),
                        T.str,
                    );
                case "TrimStart":
                    return r(call("trimStart", []), T.str);
                case "TrimEnd":
                    return r(call("trimEnd", []), T.str);
                case "StartsWith":
                    return r(
                        caseInsensitive(a)
                            ? `${base}${q}toLowerCase().startsWith(${a[0]}.toLowerCase())`
                            : call("startsWith", [a[0]]),
                        T.bool,
                    );
                case "EndsWith":
                    return r(
                        caseInsensitive(a)
                            ? `${base}${q}toLowerCase().endsWith(${a[0]}.toLowerCase())`
                            : call("endsWith", [a[0]]),
                        T.bool,
                    );
                case "Contains":
                    return r(
                        caseInsensitive(a)
                            ? `${base}${q}toLowerCase().includes(${a[0]}.toLowerCase())`
                            : call("includes", [a[0]]),
                        T.bool,
                    );
                case "Equals":
                    return r(
                        caseInsensitive(a)
                            ? `${base}${q}toLowerCase() === ${a[0]}.toLowerCase()`
                            : `${base} === ${a[0]}`,
                        T.bool,
                    );
                case "Replace":
                    return r(call("replaceAll"), T.str);
                case "Split": {
                    const sep = a.filter((x) => !/StringSplitOptions/.test(x));
                    const s = call("split", sep.length > 1 ? [sep[0]] : sep);
                    return r(a.some((x) => /RemoveEmptyEntries/.test(x)) ? `${s}.filter((x) => x)` : s, { arr: T.str });
                }
                case "Substring":
                    return r(
                        a.length === 2 ? `${base}${q}substring(${a[0]}, ${a[0]} + ${a[1]})` : call("substring"),
                        T.str,
                    );
                case "IndexOf":
                    return r(call("indexOf", [a[0]]), T.num);
                case "LastIndexOf":
                    return r(call("lastIndexOf", [a[0]]), T.num);
                case "PadLeft":
                    return r(call("padStart"), T.str);
                case "PadRight":
                    return r(call("padEnd"), T.str);
                case "ToCharArray":
                    return r(`[...${base}]`, { arr: T.str });
                case "Remove":
                    return r(`${this.todo("string.Remove", node)} ${call("slice")}`, T.str);
                case "Insert":
                    return r(`${this.todo("string.Insert", node)} ${base}`, T.str);
            }
        }
        if (name === "ToString") {
            const a = args();
            if (a.length)
                return r(
                    formatValue(base, a[0].replace(/^"|"$/g, "")) ??
                        `${this.todo(`ToString(${a[0]})`, node)} String(${base})`,
                    T.str,
                );
            // Skua's ItemBase.ToString() is "[ID]\t(Item) Name xN": rarely what a script meant.
            if (
                t?.ts &&
                /^(InventoryItem|QuestItem|ShopItem|RewardItem|SimpleReward)( \| null)?$/.test(this.tsx.typeName(t.ts))
            )
                return r(
                    `String(${base}) ${this.todo('ItemBase.ToString() is "[ID] (Item) Name xN", not the name', node)}`,
                    T.str,
                );
            // A numeric enum's ToString() is the member's name.
            const en = this.numericEnumOf(t);
            if (en) return r(`${en}[${base}]`, T.str);
            // x?.ToString() is null when x is: String(undefined) would be "undefined".
            if (q === "?.") return r(`${base}?.toString()`, T.str);
            return r(t?.prim === "string" ? base : `String(${base})`, T.str);
        }
        if (name === "Equals") return r(`${base} === ${args()[0]}`, T.bool);
        if (name === "CompareTo") return r(`${base} - ${args()[0]}`, T.num);
        if (name === "GetType") return r(`${this.todo("GetType", node)} null`);
        if (name === "ToObject" || name === "Value") {
            const tt = typeArgs[0] ? this.tsTypeText(typeArgs[0]) : "unknown";
            return r(`(${base} as ${tt})`, typeArgs[0] ? this.csType(typeArgs[0]) : null);
        }
        if (name === "HasValue" && !argNodes.length) return r(`${base} != null`, T.bool);
        // Lists, arrays and LINQ (unknown receivers are taken as arrays).
        const a = args();
        const pred = a[0];
        switch (name) {
            case "Add":
            case "Enqueue":
            case "Push":
                return r(call("push"));
            case "AddRange":
                if (isArrayExpr(named(argNodes[0]).at(-1)) || /^\[.*\]$/s.test(a[0])) {
                    const items = a[0]
                        .replace(/^\[|\]$/g, "")
                        .trim()
                        .replace(/,$/, "");
                    // A trailing `// comment` would swallow the `)`.
                    return r(`${base}${q}push(${items}${/\/\/[^\n]*$/.test(items) ? "\n" : ""})`);
                }
                return r(`${base}${q}push(...${wrap(a[0])})`);
            case "Insert":
                return r(`${base}${q}splice(${a[0]}, 0, ${a[1]})`);
            case "InsertRange":
                return r(`${base}${q}splice(${a[0]}, 0, ...${wrap(a[1])})`);
            case "Remove":
                return r(`${this.todo("List.Remove", node)} ${base}${q}splice(${base}.indexOf(${a[0]}), 1)`);
            case "RemoveAt":
                return r(`${base}${q}splice(${a[0]}, 1)`);
            case "RemoveAll":
                // As a statement the count C# returns doesn't matter.
                return r(
                    `${node.parent?.type === "expression_statement" ? "" : `${this.todo("List.RemoveAll returns the count", node)} `}${base}${q}splice(0, ${base}.length, ...${base}.filter((x) => !(${pred})(x)))`,
                );
            case "RemoveRange":
                return r(`${base}${q}splice(${a[0]}, ${a[1]})`);
            case "Clear":
                return r(`${base}${q}splice(0)`);
            case "Contains":
                return r(call("includes", [a[0]]), T.bool);
            case "IndexOf":
                return r(call("indexOf", [a[0]]), T.num);
            case "Find":
            case "FirstOrDefault":
            case "SingleOrDefault":
                return r(pred ? `(${call("find", [pred])} ?? null)` : `(${base}${idx}[0] ?? null)`, elemT);
            case "LastOrDefault":
                return r(pred ? `(${call("findLast", [pred])} ?? null)` : `(${base}${q}at(-1) ?? null)`, elemT);
            case "First":
            case "Single":
                return r(pred ? `${call("find", [pred])}!` : `${base}${idx}[0]`, elemT);
            case "Last":
                return r(pred ? `${call("findLast", [pred])}!` : `${base}${q}at(-1)!`, elemT);
            case "FindIndex":
                return r(call("findIndex"), T.num);
            case "Exists":
            case "Any":
                return r(pred ? call("some", [pred]) : `${base}${q}length > 0`, T.bool);
            case "TrueForAll":
            case "All":
                return r(call("every", [pred]), T.bool);
            case "Where":
            case "FindAll":
                return r(call("filter", [pred]), { arr: elemT });
            case "Select": {
                const lam = named(argNodes[0]).at(-1);
                const lr = lam.type === "lambda_expression" ? this.lambda(lam, null, [elemT, T.num]) : null;
                return r(call("map", [pred]), { arr: lr?.t?.ret ?? null });
            }
            case "SelectMany":
                return r(call("flatMap", [pred]), { arr: null });
            case "ForEach":
                return r(call("forEach", [pred]));
            case "Count":
            case "LongCount":
                return r(pred ? `${call("filter", [pred])}.length` : `${base}${q}length`, T.num);
            case "Sum":
                return r(
                    pred
                        ? `${base}${q}reduce((sum, x) => sum + (${pred})(x), 0)`
                        : `${base}${q}reduce((sum, x) => sum + x, 0)`,
                    T.num,
                );
            case "Max":
            case "Min":
                return r(`Math.${name.toLowerCase()}(...${pred ? call("map", [pred]) : base})`, T.num);
            case "Average":
                return r(`${this.todo("Average", node)} 0`, T.num);
            case "OrderBy":
            case "OrderByDescending":
            case "ThenBy":
            case "ThenByDescending": {
                const desc = name.endsWith("Descending");
                const key = pred ? `(${pred})` : "((x) => x)";
                const cmp = desc
                    ? `(b, a) => compare(${key}(a), ${key}(b))`
                    : `(a, b) => compare(${key}(a), ${key}(b))`;
                this.needCompare = true;
                return r(
                    `[...${base}].sort(${cmp})${name.startsWith("Then") ? " " + this.todo("ThenBy", node) : ""}`,
                    t,
                );
            }
            case "Reverse":
                return r(`${base}${q}reverse()`, t);
            case "Sort":
                return r(a.length ? call("sort") : `${base}${q}sort()`, t);
            case "ToList":
            case "ToArray":
            case "AsEnumerable":
            case "ToHashSet":
                if (name === "ToHashSet") return r(`new Set(${base})`, { set: elemT });
                return r((this.isArr(t) && /\)$/.test(base)) || /^\[\.\.\..*\]$/s.test(base) ? base : `[...${base}]`, {
                    arr: elemT,
                });
            case "ToDictionary":
                return r(`new Map(${base}.map((x) => [(${a[0]})(x), (${a[1] ?? "(x) => x"})(x)]))`, {
                    map: [null, null],
                });
            case "Distinct":
                return r(`[...new Set(${base})]`, t);
            case "DistinctBy":
                return r(
                    `${base}${q}filter((x, i, all) => all.findIndex((y) => (${pred})(y) === (${pred})(x)) === i)`,
                    t,
                );
            case "UnionWith":
                return r(`${wrap(a[0])}.forEach((x) => ${base}.add(x))`, null);
            case "Concat":
            case "Union":
                return r(`[...${base}, ...${wrap(a[0])}]`, t);
            case "Except":
                return r(`${base}${q}filter((x) => !${wrap(a[0])}.includes(x))`, t);
            case "Intersect":
                return r(`${base}${q}filter((x) => ${wrap(a[0])}.includes(x))`, t);
            case "Skip":
                return r(call("slice", [a[0]]), t);
            case "Take":
                return r(call("slice", ["0", a[0]]), t);
            case "ElementAt":
                return r(`${base}${idx}[${a[0]}]`, elemT);
            case "ElementAtOrDefault":
                return r(`(${base}${idx}[${a[0]}] ?? null)`, elemT);
            case "SequenceEqual":
                return r(`(JSON.stringify(${base}) === JSON.stringify(${a[0]}))`, T.bool);
            case "Dequeue":
                return r(`${base}${q}shift()!`, elemT);
            case "Pop":
                return r(`${base}${q}pop()!`, elemT);
            case "Peek":
                return r(`${base}${idx}[0]`, elemT);
            case "GroupBy":
            case "Aggregate":
            case "Zip":
                return r(`${this.todo(name, node)} ${call(lcFirst(name))}`);
            case "Cast":
            case "OfType":
                return r(`(${base} as ${typeArgs[0] ? this.tsTypeText(typeArgs[0]) : "unknown"}[])`, {
                    arr: this.csType(typeArgs[0]),
                });
        }
        return null;
    }

    /**
     * C# arguments -> TS argument text. With TS signatures (a ported member), named arguments and
     * extra positional ones that the TS signature takes in a trailing options object go there.
     * With C# signatures only (a member to be ported as C# has it), arguments go in C# order.
     */
    callArgs(argNodes, tsSigs, csSigs, node, elemT = null) {
        const calleeText = node?.childForFieldName?.("function")?.text
            ? lcFirstPath(node.childForFieldName("function").text)
            : "";
        const args = argNodes.map((a) => {
            const nameNode = a.childForFieldName("name");
            // `this` is an unnamed token in this grammar.
            const valueNode =
                named(a)
                    .filter((k) => k.id !== nameNode?.id && k.type !== "comment")
                    .at(-1) ?? a.child(a.childCount - 1);
            const isOut = /^\s*(out|ref)\s/.test(a.text.replace(/^\w+\s*:\s*/, ""));
            return { name: nameNode?.text ?? null, node: valueNode, isOut };
        });
        const csSig = pickCsSig(csSigs, args);
        const tsSig = pickTsSig(tsSigs, args, csSig);

        const emit = (arg, tsParam) => {
            if (arg.isOut)
                return `${this.todo(`out argument ${arg.node.text}`, arg.node)} ${arg.node.childForFieldName?.("name")?.text ?? arg.node.text.split(/\s+/).at(-1)}`;
            let expected = null;
            if (tsParam?.type) expected = { ts: tsParam.type };
            // Story.PreLoad(this): C# reads the calling method; the port takes the function.
            if (arg.node.type === "this" && this.currentMethod && /\.preLoad$/.test(calleeText))
                return `${this.selfRef}.${this.currentMethod}`;
            if (arg.node.type === "lambda_expression") {
                const pts = tsParam?.type ? this.lambdaParamTypes(tsParam.type) : null;
                return this.lambda(arg.node, null, pts ?? [elemT]).s;
            }
            const r = this.expr(arg.node, expected);
            // A Monster where the TS side takes a name or map ID (C#'s Kill.Monster(Monster)).
            if (
                tsParam?.type &&
                r.t?.ts &&
                this.tsx.typeName(r.t.ts) === "Monster" &&
                /^string \| number$/.test(this.tsx.typeName(tsParam.type))
            )
                return `${wrap(r.s)}.mapId`;
            return r.s;
        };

        if (!tsSig) {
            // C# order (or as written when the signature is unknown).
            if (!csSig) {
                return args
                    .map((a) => (a.name ? `${this.todo(`named argument ${a.name}`, a.node)} ${emit(a)}` : emit(a)))
                    .join(", ");
            }
            const slots = [];
            const rest = [];
            const restIndex = csSig.params.findIndex((p) => p.isParams);
            args.forEach((a, i) => {
                let j = a.name ? csSig.params.findIndex((p) => p.name === a.name) : i;
                if (restIndex >= 0 && j >= restIndex && !a.name) {
                    rest.push(a);
                    return;
                }
                if (j < 0) j = slots.length;
                slots[j] = emit(a);
            });
            const out = [];
            const last = Math.max(slots.length, 0);
            for (let i = 0; i < last; i++) out.push(slots[i] ?? "undefined");
            if (rest.length) {
                while (out.length < restIndex) out.push("undefined");
                if (rest.length === 1 && (isArrayExpr(rest[0].node) || this.isSpreadable(this.expr(rest[0].node).t)))
                    out.push(`...${emit(rest[0])}`);
                else for (const r of rest) out.push(emit(r));
            }
            return out.join(", ");
        }

        const tsParams = tsSig.params;
        const optIndex = tsParams.findIndex((p) => p.options);
        const restIndex = tsParams.findIndex((p) => p.rest);
        const positionalCount = tsParams.filter(
            (p, i) => !p.options && !p.rest && (optIndex < 0 || i < optIndex),
        ).length;
        const slots = [];
        const opts = [];
        const rest = [];
        // C# `params T[] x` filled by loose arguments, where the TS side takes `x: T[]`.
        const csParamsIndex = csSig?.params.findIndex((p) => p.isParams) ?? -1;
        const tsArrayForParams =
            csParamsIndex >= 0
                ? tsParams.findIndex(
                      (p) =>
                          !p.rest &&
                          !p.options &&
                          p.name.toLowerCase() === csSig.params[csParamsIndex].name.toLowerCase() &&
                          this.tsx.isArray(p.type),
                  )
                : -1;
        if (tsArrayForParams >= 0) {
            const loose = args.filter((a, i) => !a.name && i >= csParamsIndex);
            if (
                loose.length &&
                !(loose.length === 1 && (isArrayExpr(loose[0].node) || this.isSpreadable(this.expr(loose[0].node).t)))
            ) {
                slots[tsArrayForParams] = `[${loose.map((a) => emit(a)).join(", ")}]`;
                for (const a of loose) a.consumed = true;
            }
        }
        args.forEach((a, i) => {
            if (a.consumed) return;
            const csName = a.name ?? csSig?.params[i]?.name ?? null;
            // C#'s `object _this` (DebugLogger) has no TS parameter.
            if (csName === "_this" && !/\.preLoad$/.test(calleeText) && !tsParams.some((p) => p.name === "_this"))
                return;
            if (!a.name && restIndex >= 0 && i >= restIndex) {
                rest.push(a);
                return;
            }
            // Positional, unless the C# parameter there is another TS parameter or an option
            // (CheckDailyv2(quest, any, shouldUnBank, params items) vs checkDailyv2(quest, items, { any, ... })).
            const lowerName = csName?.toLowerCase();
            const elsewhere =
                lowerName &&
                tsParams[i] &&
                tsParams[i].name.toLowerCase() !== lowerName &&
                (tsParams.some((p) => !p.options && !p.rest && p.name.toLowerCase() === lowerName) ||
                    (optIndex >= 0 && tsParams[optIndex].options.some((k) => k.toLowerCase() === lowerName)));
            if (!a.name && i < positionalCount && !elsewhere) {
                slots[i] = emit(a, tsParams[i]);
                return;
            }
            const lower = csName?.toLowerCase().replaceAll("_", "");
            // `_sell`: a TS parameter the port keeps but doesn't use.
            const j = lower
                ? tsParams.findIndex((p) => !p.options && !p.rest && p.name.toLowerCase().replaceAll("_", "") === lower)
                : -1;
            if (j >= 0) {
                slots[j] = emit(a, tsParams[j]);
                return;
            }
            if (optIndex >= 0) {
                const keys = tsParams[optIndex].options;
                const key =
                    keys.find((k) => k.toLowerCase().replaceAll("_", "") === lower?.replaceAll("_", "")) ??
                    (csName ? lcFirst(csName) : null);
                if (key) {
                    const v = emit(a);
                    opts.push(
                        `${v === key ? key : `${key}: ${v}`}${keys.includes(key) ? "" : " " + this.todo(`no option ${key}`, a.node)}`,
                    );
                    return;
                }
            }
            if (!a.name && i < tsParams.length && !tsParams[i].options) {
                slots[i] = emit(a, tsParams[i]);
                return;
            }
            slots[slots.length] = `${this.todo(`argument ${csName ?? i} has no parameter`, a.node)} ${emit(a)}`;
        });
        const out = [];
        for (let i = 0; i < slots.length; i++) out.push(slots[i] ?? "undefined");
        if (rest.length) {
            while (out.length < restIndex) out.push("undefined");
            const restT = tsParams[restIndex] && this.tsx.elementType(tsParams[restIndex].type);
            if (rest.length === 1 && isArrayExpr(rest[0].node)) {
                // `new[] { ... }` for a params array: pass the elements (keeps tuple typing).
                const init =
                    rest[0].node.type === "initializer_expression"
                        ? rest[0].node
                        : named(rest[0].node).find((k) => k.type === "initializer_expression");
                if (init)
                    out.push(
                        ...this.elements(init, restT ? { ts: restT } : null)
                            .filter((e) => e.s !== null)
                            .map(
                                (e) =>
                                    e.s +
                                    e.comments
                                        .map((c) => ` ${c.startsWith("//") ? `/* ${c.slice(2).trim()} */` : c}`)
                                        .join(""),
                            ),
                    );
                else out.push(`...${emit(rest[0])}`);
            } else if (rest.length === 1 && this.isSpreadable(this.expr(rest[0].node).t))
                out.push(`...${emit(rest[0])}`);
            else for (const r of rest) out.push(emit(r, { type: restT }));
        }
        if (opts.length) {
            while (out.length < optIndex) out.push("undefined");
            out.push(`{ ${opts.join(", ")} }`);
        }
        return out.join(", ");
    }

    lambdaParamTypes(type) {
        const sigs = this.tsx.signatures(type);
        if (!sigs.length) return null;
        return sigs[0].params.map((p) => ({ ts: p.type }));
    }
}

/** The draft's marker line: remove it once the port is checked (cs2ts --force then leaves it alone). */
export const MARKER =
    "// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.";

/** C# members whose turu.ts names differ, by the turu.ts type. */
const MEMBER_ALIASES = {
    Flash: { GetGameObject: "get", GetGameObjectStatic: "getStatic", SetGameObject: "set", CallFlashFunction: "call" },
    // Skua's ItemBase.ItemGroup is the item's `sES`; Wearing is `bWear`, which turu reads as `equipped`.
    InventoryItem: { ItemGroup: "EquipSlot", Wearing: "Equipped" },
};

/** The keys of an event's data object, in the order of the C# handler's parameters. */
const EVENT_ARGS = {
    runToArea: ["zone"],
    mapChanged: ["map"],
    cellChanged: ["map", "cell", "pad"],
    monsterKilled: ["mapId"],
    questAccepted: ["questId"],
    questTurnedIn: ["questId"],
    login: ["username"],
    counterAttack: ["faded"],
    reloginTriggered: ["wasKicked"],
};

const EVENT_NAMES = {
    ExtensionPacketReceived: "extensionPacket",
    PacketReceived: "extensionPacket",
    MonsterKilled: "monsterKilled",
    PlayerDeath: "playerDeath",
    MapChanged: "mapChanged",
    CellChanged: "cellChanged",
    QuestAccepted: "questAccepted",
    QuestTurnedIn: "questTurnedIn",
    ItemDropped: "itemDropped",
    ItemAddedToBank: "itemAddedToBank",
    ScriptStopping: "scriptStopping",
    PlayerAFK: "playerAFK",
    Logout: "logout",
    ReloginTriggered: "reloginTriggered",
    CounterAttack: "counterAttack",
    RunToArea: "runToArea",
    ItemBought: "itemBought",
    ItemSold: "itemSold",
    BankLoaded: "bankLoaded",
    ShopLoaded: "shopLoaded",
    PacketSent: "packetSent",
};

const STRING_ONLY = new Set([
    "ToLower",
    "ToUpper",
    "ToLowerInvariant",
    "ToUpperInvariant",
    "Trim",
    "TrimStart",
    "TrimEnd",
    "StartsWith",
    "EndsWith",
    "Split",
    "Substring",
    "PadLeft",
    "PadRight",
    "ToCharArray",
    "Replace",
]);

function lcFirstPath(text) {
    return text.split(".").map(lcFirst).join(".");
}

function caseInsensitive(args) {
    return args.some((a) => /IgnoreCase/.test(a));
}

function wrap(s) {
    return /^[\w.$\[\]"'`()!?]+$/.test(s) ? s : `(${s})`;
}

function isArrayExpr(node) {
    return [
        "implicit_array_creation_expression",
        "array_creation_expression",
        "initializer_expression",
        "collection_expression",
    ].includes(node?.type);
}

function isIntish(node) {
    return node?.type === "integer_literal";
}

function isLiteral(node) {
    return [
        "string_literal",
        "integer_literal",
        "boolean_literal",
        "real_literal",
        "verbatim_string_literal",
        "interpolated_string_expression",
    ].includes(node.type);
}

function initOf(declarator) {
    const kids = named(declarator);
    const nameNode = declarator.childForFieldName("name");
    const rest = kids.filter(
        (k) => k.id !== nameNode?.id && k.type !== "comment" && k.type !== "bracketed_argument_list",
    );
    if (rest.length === 0) return null;
    const last = rest.at(-1);
    return last.type === "equals_value_clause" ? named(last)[0] : last;
}

function defaultFor(typeNode, typeText) {
    if (typeText === "number") return "0";
    if (typeText === "boolean") return "false";
    if (typeText === "string") return '""';
    if (typeText.endsWith("[]")) return "[]";
    if (typeText.startsWith("Map<")) return "new Map()";
    if (typeText.startsWith("Set<")) return "new Set()";
    return typeText.includes("null") ? "null" : "null!";
}

/** C# `///` XML documentation -> a JSDoc block. */
function jsdoc(lines) {
    let text = lines.map((l) => l.replace(/^\/\/\/ ?/, "")).join("\n");
    text = text
        .replace(/<\/?summary>/g, "")
        .replace(/<\/?remarks>/g, "")
        .replace(/<\/?para>/g, "")
        .replace(/<typeparam name="[^"]*">[\s\S]*?<\/typeparam>/g, "")
        .replace(/<param name="([^"]*)">([\s\S]*?)<\/param>/g, (_, n, d) => `@param ${n} ${d.trim()}`)
        .replace(/<returns>([\s\S]*?)<\/returns>/g, (_, d) => `@returns ${d.trim()}`)
        .replace(/<see cref="([^"]*)"\s*\/>/g, (_, n) => `{@link ${n}}`)
        .replace(/<paramref name="([^"]*)"\s*\/>/g, "`$1`")
        .replace(/<c>([\s\S]*?)<\/c>/g, "`$1`")
        .replace(/\*\//g, "* /");
    const body = text
        .split("\n")
        .map((l) => l.trimEnd())
        .filter((l, i, all) => l.trim() || (i > 0 && i < all.length - 1 && all[i - 1].trim()));
    while (body.length && !body[0].trim()) body.shift();
    while (body.length && !body.at(-1).trim()) body.pop();
    if (body.length === 0) return "";
    if (body.length === 1) return `/** ${body[0].trim()} */`;
    return `/**\n${body.map((l) => ` * ${l.trim()}`.trimEnd()).join("\n")}\n */`;
}

function preproc(node) {
    const t = node.text.trim();
    if (node.type === "preproc_region") return `//#region${t.replace(/^#region/, "")}`;
    if (node.type === "preproc_endregion") return `//#endregion${t.replace(/^#endregion/, "")}`;
    return `// ${t.split("\n").join("\n// ")}`;
}

function formatValue(v, fmt) {
    if (/^[NnFf](\d*)$/.test(fmt)) {
        const d = /\d+/.exec(fmt)?.[0] ?? (fmt[0].toUpperCase() === "N" ? "0" : "2");
        if (fmt[0].toUpperCase() === "N")
            return `${wrap(v)}.toLocaleString("en-US", { minimumFractionDigits: ${d}, maximumFractionDigits: ${d} })`;
        return `${wrap(v)}.toFixed(${d})`;
    }
    if (/^[Dd](\d+)$/.test(fmt)) return `String(${v}).padStart(${fmt.slice(1)}, "0")`;
    // Percent: "57.00 %" (invariant culture).
    if (/^[Pp](\d*)$/.test(fmt)) return `\`\${(${v} * 100).toFixed(${fmt.slice(1) || 2})} %\``;
    // Dates are milliseconds here; sv-SE prints "yyyy-MM-dd HH:mm:ss".
    if (fmt === "yyyy-MM-dd HH:mm:ss") return `new Date(${v}).toLocaleString("sv-SE")`;
    if (fmt === "yyyy-MM-dd") return `new Date(${v}).toLocaleDateString("sv-SE")`;
    if (fmt === "HH:mm:ss") return `new Date(${v}).toLocaleTimeString("sv-SE")`;
    if (fmt === "MMMM") return `new Date(${v}).toLocaleString("en-US", { month: "long" })`;
    if (/^0+$/.test(fmt)) return `String(${v}).padStart(${fmt.length}, "0")`;
    return null;
}

function pickCsSig(sigs, args) {
    if (!sigs || sigs.length === 0) return null;
    if (sigs.length === 1) return sigs[0];
    const names = args.filter((a) => a.name).map((a) => a.name);
    const scored = sigs.map((s) => {
        let score = 0;
        const required = s.params.filter((p) => !p.defaultNode && !p.isParams).length;
        if (args.length < required) score -= 10;
        if (args.length > s.params.length && !s.params.some((p) => p.isParams)) score -= 10;
        for (const n of names) score += s.params.some((p) => p.name === n) ? 2 : -5;
        // Type of the first differing positional argument: int literal vs string literal.
        args.forEach((a, i) => {
            const p = s.params[i];
            if (!p || a.name) return;
            const isNum = a.node?.type === "integer_literal";
            const isStrLit = a.node?.type === "string_literal" || a.node?.type === "interpolated_string_expression";
            if (isNum && /^(int|long)\??$/.test(p.type ?? "")) score += 1;
            if (isNum && /^string/.test(p.type ?? "")) score -= 3;
            if (isStrLit && /^(int|long)/.test(p.type ?? "")) score -= 3;
            if (isStrLit && /^string/.test(p.type ?? "")) score += 1;
        });
        return { s, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored[0].s;
}

function pickTsSig(sigs, args, csSig) {
    if (!sigs || sigs.length === 0) return null;
    if (sigs.length === 1) return sigs[0];
    const positional = args.filter((a) => !a.name).length;
    const scored = sigs.map((s) => {
        let score = 0;
        const max = s.params.some((p) => p.rest) ? Infinity : s.params.length;
        const required = s.params.filter((p) => !p.optional && !p.rest).length;
        if (positional > max && !s.params.some((p) => p.options)) score -= 10;
        if (args.length < required) score -= 10;
        if (csSig)
            s.params.forEach(
                (p, i) => (score += csSig.params[i]?.name?.toLowerCase() === p.name.toLowerCase() ? 1 : 0),
            );
        const csRest = csSig?.params.findIndex((p) => p.isParams) ?? -1;
        if (csRest >= 0 && args.length > csRest && s.params.some((p) => p.rest)) score += 3;
        if (args.some((a) => isArrayExpr(a.node)) && s.params.some((p) => p.rest)) score += 2;
        return { s, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored[0].s;
}

function splitTop(s) {
    const out = [];
    let depth = 0;
    let cur = "";
    for (const ch of s) {
        if (ch === "<" || ch === "(") depth++;
        if (ch === ">" || ch === ")") depth--;
        if (ch === "," && depth === 0) {
            out.push(cur);
            cur = "";
        } else cur += ch;
    }
    if (cur) out.push(cur);
    return out;
}

/** The block (or switch) a declaration's name is visible in. */
function enclosingScope(node) {
    let n = node.parent;
    while (
        n &&
        !["block", "switch_body", "method_declaration", "local_function_statement", "lambda_expression"].includes(
            n.type,
        )
    )
        n = n.parent;
    return n ?? node.parent.parent;
}

/** References to a local in a block (its declaration not counted). */
function countRefs(block, name) {
    let n = 0;
    for (const id of block.descendantsOfType("identifier")) {
        if (id.text !== name) continue;
        const p = id.parent;
        if (p?.type === "variable_declarator" && p.childForFieldName("name")?.id === id.id) continue;
        if (p?.type === "member_access_expression" && p.childForFieldName("name")?.id === id.id) continue;
        if (p?.type === "argument" && p.childForFieldName("name")?.id === id.id) continue;
        n++;
    }
    return n;
}

/** An initializer that only reads (dropped with its unused local). */
function isPure(node) {
    return (
        node.descendantsOfType("invocation_expression").every((inv) => {
            const fn = inv.childForFieldName("function");
            const name = (fn.childForFieldName?.("name") ?? fn).text.replace(/<.*$/, "");
            return /^(Get|Contains|Check|Is|Has|Find|Count|First|Last|Any|All|Where|Select|ToList|ToArray|Parse|Max|Min|Sum|Equals|ToLower|ToUpper|Trim|Split)/.test(
                name,
            );
        }) && !node.descendantsOfType("assignment_expression").length
    );
}

/** Names assigned in a method (they become `let`). */
function assignedNames(node) {
    const out = new Set();
    const visit = (n) => {
        if (n.type === "assignment_expression") {
            const l = n.childForFieldName("left");
            if (l?.type === "identifier") out.add(l.text);
        } else if (n.type === "prefix_unary_expression" || n.type === "postfix_unary_expression") {
            const op = n.type === "prefix_unary_expression" ? n.child(0).text : n.child(n.childCount - 1).text;
            if (op === "++" || op === "--") {
                const e = named(n)[0];
                if (e?.type === "identifier") out.add(e.text);
            }
        } else if (n.type === "argument" && /^(out|ref)\s/.test(n.text)) {
            const id = n.descendantsOfType("identifier").at(-1);
            if (id) out.add(id.text);
        }
        for (const c of named(n)) visit(c);
    };
    visit(node);
    return out;
}

/** `Nation/Materials/0MaxBags.cs` -> `nation/materials/0MaxBags` (directories lower-cased). */
export function tsPathOf(csRel) {
    const parts = csRel.replace(/\.cs$/, "").split("/");
    const file = parts.pop();
    if (parts.length === 0) return `core/${file}`;
    return [...parts.map((p) => p.toLowerCase()), file].join("/");
}

function relImport(from, to) {
    let r = path.posix.relative(path.posix.dirname(from), to);
    if (!r.startsWith(".")) r = "./" + r;
    return r;
}
