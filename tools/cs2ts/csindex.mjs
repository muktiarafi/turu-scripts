// The C# side: every class of VibeSkua's Scripts repository, its file, its method signatures
// (to place named and extra arguments) and member types, and the enums.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { Parser, Language } from "web-tree-sitter";

const require = createRequire(import.meta.url);

let parser = null;
export async function csParser() {
    if (parser) return parser;
    await Parser.init();
    const wasm = require.resolve("tree-sitter-c-sharp/tree-sitter-c_sharp.wasm");
    const lang = await Language.load(wasm);
    parser = new Parser();
    parser.setLanguage(lang);
    return parser;
}

export function named(node) {
    const out = [];
    for (let i = 0; i < node.childCount; i++) {
        const c = node.child(i);
        if (c.isNamed) out.push(c);
    }
    return out;
}

export function modifiers(node) {
    return named(node)
        .filter((c) => c.type === "modifier")
        .map((c) => c.text);
}

/** Parameters of a parameter_list: { name, type, defaultText, isParams, isOut, isRef }. */
export function paramsOf(list) {
    if (!list) return [];
    const out = [];
    // `params T[] name` isn't a parameter node: the token and the fields sit in the list.
    for (let i = 0; i < list.childCount; i++) {
        if (list.child(i).type !== "params") continue;
        let typeNode = null;
        let nameNode = null;
        for (let j = i + 1; j < list.childCount; j++) {
            const k = list.child(j);
            if (!k.isNamed) continue;
            if (!typeNode) typeNode = k;
            else {
                nameNode = k;
                break;
            }
        }
        out.paramsArray = {
            name: nameNode?.text ?? "_",
            type: typeNode?.text ?? null,
            typeNode,
            defaultNode: null,
            isParams: true,
            isOut: false,
            isRef: false,
            attributes: [],
        };
    }
    for (const p of named(list)) {
        if (p.type !== "parameter") continue;
        const typeNode = p.childForFieldName("type");
        const nameNode = p.childForFieldName("name");
        const kids = named(p);
        const def = kids.find(
            (k) =>
                k.id !== typeNode?.id && k.id !== nameNode?.id && k.type !== "modifier" && k.type !== "attribute_list",
        );
        const mods = [];
        for (let i = 0; i < p.childCount; i++) {
            const t = p.child(i).type;
            if (t === "params" || t === "out" || t === "ref" || t === "this" || t === "in") mods.push(t);
            if (p.child(i).type === "parameter_modifier" || p.child(i).type === "modifier") mods.push(p.child(i).text);
        }
        const text = p.text;
        out.push({
            name: nameNode?.text ?? "_",
            type: typeNode?.text ?? null,
            typeNode,
            defaultNode: def ?? null,
            isParams: mods.includes("params") || /^params\s/.test(text),
            isOut: mods.includes("out") || /^out\s/.test(text),
            isRef: mods.includes("ref") || /^ref\s/.test(text),
            attributes: kids.filter((k) => k.type === "attribute_list").map((k) => k.text),
        });
    }
    if (out.paramsArray) out.push(out.paramsArray);
    return out;
}

export class CsIndex {
    constructor(scriptsRepo) {
        this.root = scriptsRepo;
        this.classes = new Map(); // name -> [{ name, file, methods, members, isScript }]
        this.enums = new Map(); // name -> { file, members }
        this.trees = new Map(); // rel -> tree
        this.extensions = new Set(); // names of extension methods
        this.nestedEnums = new Map(); // "Outer.Enum" -> { file, members }
    }

    async load() {
        const p = await csParser();
        const walk = (dir) => {
            for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
                if (e.name.startsWith(".")) continue;
                const f = path.join(dir, e.name);
                if (e.isDirectory()) walk(f);
                else if (f.endsWith(".cs")) this.add(path.relative(this.root, f), p.parse(fs.readFileSync(f, "utf8")));
            }
        };
        walk(this.root);
        return this;
    }

    tree(rel) {
        return this.trees.get(this.resolve(rel));
    }

    /** An include's path as the file is really spelled (`//cs_include`s don't always match case). */
    resolve(rel) {
        if (this.trees.has(rel)) return rel;
        if (!this.lower) this.lower = new Map([...this.trees.keys()].map((k) => [k.toLowerCase(), k]));
        return this.lower.get(rel.toLowerCase()) ?? rel;
    }

    add(rel, tree) {
        this.trees.set(rel, tree);
        const visit = (node, outer) => {
            for (const c of named(node)) {
                if (
                    c.type === "class_declaration" ||
                    c.type === "record_declaration" ||
                    c.type === "struct_declaration"
                ) {
                    const info = this.classInfo(c, rel);
                    const list = this.classes.get(info.name) ?? [];
                    list.push(info);
                    this.classes.set(info.name, list);
                    visit(c.childForFieldName("body") ?? c, info);
                } else if (c.type === "enum_declaration") {
                    const name = c.childForFieldName("name").text;
                    const body = c.childForFieldName("body");
                    const members = body
                        ? named(body)
                              .filter((m) => m.type === "enum_member_declaration")
                              .map((m) => ({
                                  name: m.childForFieldName("name").text,
                                  value: m.childForFieldName("value")?.text ?? null,
                              }))
                        : [];
                    if (outer) this.nestedEnums.set(`${outer.name}.${name}`, { file: rel, members });
                    if (!outer || !this.enums.has(name))
                        this.enums.set(name, { file: rel, members, outer: outer?.name ?? null });
                } else if (
                    c.type === "namespace_declaration" ||
                    c.type === "file_scoped_namespace_declaration" ||
                    c.type === "declaration_list"
                ) {
                    visit(c, outer);
                }
            }
        };
        visit(tree.rootNode, null);
    }

    classInfo(node, rel) {
        const name = node.childForFieldName("name").text;
        const methods = new Map();
        const members = new Map();
        const body = node.childForFieldName("body");
        let isScript = false;
        for (const m of body ? named(body) : []) {
            if (m.type === "method_declaration") {
                const mname = m.childForFieldName("name").text;
                if (mname === "ScriptMain") isScript = true;
                const list = methods.get(mname) ?? [];
                const ps = paramsOf(m.childForFieldName("parameters"));
                // An extension method (`static bool X(this string s)`): calls read `s.X()`.
                if (/^\(\s*this\s/.test(m.childForFieldName("parameters")?.text ?? "")) this.extensions.add(mname);
                list.push({
                    params: paramsOf(m.childForFieldName("parameters")),
                    returns: m.childForFieldName("returns")?.text ?? m.childForFieldName("type")?.text ?? "void",
                    isStatic: modifiers(m).includes("static"),
                });
                methods.set(mname, list);
            } else if (m.type === "property_declaration") {
                members.set(m.childForFieldName("name").text, {
                    type: m.childForFieldName("type").text,
                    isStatic: modifiers(m).includes("static"),
                });
            } else if (m.type === "field_declaration") {
                const decl = named(m).find((k) => k.type === "variable_declaration");
                const type = decl.childForFieldName("type").text;
                for (const v of named(decl).filter((k) => k.type === "variable_declarator"))
                    members.set(v.childForFieldName("name").text, { type, isStatic: modifiers(m).includes("static") });
            }
        }
        return { name, file: rel, methods, members, isScript };
    }

    classByName(name) {
        const list = this.classes.get(name);
        return list ? list[0] : null;
    }
}
