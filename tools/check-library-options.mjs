#!/usr/bin/env node
// Checks that code a script imports reads only options that script declares.
//
// `bot.config.get(name)` reads the options of the script you start, not of the file the code is
// in, and throws for a name that script doesn't declare. VibeSkua's `Config.Get` returned
// false/0 instead, so C# libraries that read their own script's options (BuyScrolls'
// `UseMysticParchment`, read by every ArchMage book) ported as-is fail in Turu, and only at the
// moment that line runs. This finds them before then.
//
// For every script (a file with `export default function main`), it evaluates `scriptOptions`
// as the engine does (the module's top level, with bot calls failing), follows the script's
// imports, and reports each `bot.config.get("Name")` / `bot.config.get("Group", "Name")` with
// literal names in an imported file (outside that file's own `main`) that the script doesn't
// declare. Reads of a name the same file checks with `bot.config.has` are skipped, and so is a
// line marked `// options-check: ok` (on it or the line above) where every caller is known to
// declare the option. Fix a finding by passing the value in as a parameter from the library's
// own `main`, or read it with CoreBots' `configOr(name, fallback)` (docs/SCRIPTING.md, "Options").
//
//     node tools/check-library-options.mjs
//
// Needs the `typescript` package (5.9.3): `npm install --no-save typescript@5.9.3` here, or
// `npm ci` in tools/cs2ts. Run it from the repository root.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative, resolve, sep } from "node:path";
import { createContext, runInContext } from "node:vm";

const ts = await loadTypeScript();
const root = process.cwd();
// Not scripts: the API types and the C# converter.
const SKIP = new Set([join(root, "types"), join(root, "tools", "cs2ts"), join(root, "node_modules")]);
const MARKER = "options-check: ok";
// The engine's category for options outside a group (turu_bot::script::options::MAIN).
const MAIN = "";

async function loadTypeScript() {
    try {
        return (await import("typescript")).default;
    } catch {
        try {
            return createRequire(new URL("./cs2ts/package.json", import.meta.url))("typescript");
        } catch {
            console.error("check-library-options: needs typescript: npm install --no-save typescript@5.9.3");
            process.exit(2);
        }
    }
}

function listFiles(dir) {
    const out = [];
    for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (name.startsWith(".") || SKIP.has(path)) continue;
        if (statSync(path).isDirectory()) out.push(...listFiles(path));
        else if (name.endsWith(".ts")) out.push(path);
    }
    return out;
}

const rel = (path) => relative(root, path).split(sep).join("/");
const sources = new Map(listFiles(root).map((f) => [f, readFileSync(f, "utf8")]));

/** The files `file` imports (relative imports only; `"turu"` is the API). */
function importsOf(file) {
    const out = [];
    const re = /(?:import|export)\s[^;]*?from\s*["'](\.{1,2}\/[^"']+)["']|import\s*["'](\.{1,2}\/[^"']+)["']/g;
    for (const m of sources.get(file).matchAll(re)) {
        const target = resolve(dirname(file), m[1] ?? m[2]) + ".ts";
        if (sources.has(target)) out.push(target);
    }
    return out;
}

// ---------------------------------------------------------------------------------------------
// Declarations: run each module's top level like the engine's declaration runtime.

const turuPath = join(root, "types", "turu.ts");
const modules = new Map();
// One global scope for every module, apart from this tool's (turu.ts replaces `console`). Bot
// calls fail while declaring, as in the engine.
const context = createContext({
    __turu: () => JSON.stringify({ error: "the bot isn't running while options are read" }),
    __turuEvents: () => "[]",
});

function loadModule(file) {
    const cached = modules.get(file);
    if (cached) return cached.exports;
    const module = { exports: {} };
    modules.set(file, module);
    const source = file === turuPath ? readFileSync(file, "utf8") : sources.get(file);
    const js = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
        fileName: file,
    }).outputText;
    const require = (spec) => {
        if (spec === "turu") return loadModule(turuPath);
        const target = resolve(dirname(file), spec) + ".ts";
        if (!sources.has(target)) throw new Error(`${rel(file)}: can't resolve "${spec}"`);
        return loadModule(target);
    };
    runInContext(`(function (exports, require, module) {\n${js}\n})`, context, { filename: file })(
        module.exports,
        require,
        module,
    );
    return module.exports;
}

/** `"group\0name"` keys of the options a script declares, or null when they can't be read. */
function declared(file) {
    let options;
    try {
        options = loadModule(file).scriptOptions;
    } catch (error) {
        console.warn(`warning: ${rel(file)}: couldn't read its options: ${error.message}`);
        return null;
    }
    const keys = new Set();
    if (!options) return keys;
    for (const o of options.options ?? []) keys.add(`${MAIN}\0${o.name}`);
    for (const g of options.groups ?? []) for (const o of g.options) keys.add(`${g.name}\0${o.name}`);
    return keys;
}

// ---------------------------------------------------------------------------------------------
// Reads: literal `bot.config.get(...)` outside the file's own `main`.

const STR = String.raw`(?:"([^"\\]*)"|'([^'\\]*)')`;
const GET = new RegExp(String.raw`bot\.config!?\.get\s*(?:<[^()]*?>)?\s*\(\s*${STR}\s*(?:,\s*${STR}\s*)?\)`, "g");
const HAS = new RegExp(String.raw`bot\.config!?\.has\s*\(\s*${STR}\s*(?:,\s*${STR}\s*)?\)`, "g");

const keyOf = (m) => {
    const first = m[1] ?? m[2];
    const second = m[3] ?? m[4];
    return second === undefined ? `${MAIN}\0${first}` : `${first}\0${second}`;
};
const nameOf = (key) => {
    const [group, name] = key.split("\0");
    return group === MAIN ? `"${name}"` : `"${group}", "${name}"`;
};

/** The [start, end) offsets of `export default function main`'s body. */
function mainBody(source) {
    const at = source.search(/export\s+default\s+function\s+main\s*\(/);
    if (at < 0) return null;
    const open = source.indexOf("{", source.indexOf(")", at));
    let depth = 0;
    for (let i = open; i < source.length; i++) {
        if (source[i] === "{") depth++;
        else if (source[i] === "}" && --depth === 0) return [open, i];
    }
    return [open, source.length];
}

const readsCache = new Map();
function readsOf(file) {
    if (readsCache.has(file)) return readsCache.get(file);
    const source = sources.get(file);
    const lines = source.split("\n");
    const body = mainBody(source);
    const checked = new Set([...source.matchAll(HAS)].map(keyOf));
    const reads = [];
    for (const m of source.matchAll(GET)) {
        if (body && m.index > body[0] && m.index < body[1]) continue;
        const key = keyOf(m);
        if (checked.has(key)) continue;
        const line = source.slice(0, m.index).split("\n").length;
        if (lines[line - 1].includes(MARKER) || (lines[line - 2] ?? "").includes(MARKER)) continue;
        reads.push({ key, line });
    }
    readsCache.set(file, reads);
    return reads;
}

// ---------------------------------------------------------------------------------------------

/** Every file `file` imports, directly or not. */
function closure(file) {
    const seen = new Set();
    const stack = [file];
    while (stack.length > 0) {
        for (const next of importsOf(stack.pop())) {
            if (!seen.has(next)) {
                seen.add(next);
                stack.push(next);
            }
        }
    }
    seen.delete(file);
    return seen;
}

const scripts = [...sources.keys()].filter((f) => /export\s+default\s+function\s+main\s*\(/.test(sources.get(f)));
/** `file:line` -> { key, scripts } */
const findings = new Map();
for (const script of scripts.sort()) {
    const libraries = [...closure(script)].filter((f) => readsOf(f).length > 0);
    if (libraries.length === 0) continue;
    const keys = declared(script);
    if (keys === null) continue;
    for (const library of libraries) {
        for (const { key, line } of readsOf(library)) {
            if (keys.has(key)) continue;
            const at = `${rel(library)}:${line}`;
            if (!findings.has(at)) findings.set(at, { key, scripts: [] });
            findings.get(at).scripts.push(rel(script));
        }
    }
}

if (findings.size === 0) {
    console.log(`check-library-options: ${scripts.length} scripts, every imported option read is declared`);
    process.exit(0);
}
for (const [at, { key, scripts }] of [...findings].sort(([a], [b]) => a.localeCompare(b, "en"))) {
    const shown = scripts.slice(0, 3).join(", ") + (scripts.length > 3 ? `, and ${scripts.length - 3} more` : "");
    console.log(
        `${at}: reads option ${nameOf(key)}, which ${shown} ${scripts.length > 1 ? "don't" : "doesn't"} declare`,
    );
}
console.log(
    `\n${findings.size} read(s) would throw "this script has no option named ..." when they run. Pass the value in` +
        ` as a parameter from the library's main, read it with configOr(name, fallback), or, when every caller declares` +
        ` it, mark the line "// ${MARKER}" (docs/SCRIPTING.md in Turu, "Options").`,
);
process.exit(1);
