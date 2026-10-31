#!/usr/bin/env node
// cs2ts: converts VibeSkua's C# scripts to Turu TypeScript, as a first draft to fix by hand.
//
//   cd tools/cs2ts && npm ci
//   node tools/cs2ts/cs2ts.mjs [--scripts ../Scripts] [--force] [--stdout] <C# file or folder>...
//   node tools/cs2ts/cs2ts.mjs --only Name1,Name2 <C# file>   # just those members (stdout), to add
//                                                             # to a partial port by hand
//
// Paths are relative to the C# Scripts repository (`../Scripts` next to Turu by default). Each
// file is written at its port's path (`Nation/Materials/0MaxBags.cs` ->
// `nation/materials/0MaxBags.ts`); an existing file is skipped. --force replaces a draft that
// still has the converter's marker line, never a port that was finished by hand.
// What it couldn't convert is marked `/* cs2ts: ... */`; `tsc --noEmit -p .` shows the rest.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as prettier from "prettier";
import { CsIndex } from "./csindex.mjs";
import { TsIndex } from "./tsindex.mjs";
import { FileConverter, MARKER, tsPathOf } from "./convert.mjs";
import ts from "typescript";

/** The class members (and enums, interfaces) named in `names` from converted text. */
function pickMembers(text, names) {
    const sf = ts.createSourceFile("x.ts", text, ts.ScriptTarget.Latest, true);
    const out = [];
    const visit = (node) => {
        const name = node.name && ts.isIdentifier(node.name) ? node.name.text.toLowerCase() : null;
        if (
            name &&
            names.has(name) &&
            (ts.isClassElement(node) || ts.isEnumDeclaration(node) || ts.isInterfaceDeclaration(node))
        )
            out.push(node.getFullText(sf).replace(/^\n+/, ""));
        ts.forEachChild(node, visit);
    };
    visit(sf);
    return out.join("\n\n") + "\n";
}

const here = path.dirname(fileURLToPath(import.meta.url));
const scriptsDir = path.resolve(here, "../..");

const args = process.argv.slice(2);
let csRepo = path.resolve(scriptsDir, "../../Scripts");
let force = false;
let toStdout = false;
let only = null;
const inputs = [];
for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--scripts") csRepo = path.resolve(args[++i]);
    else if (a === "--force") force = true;
    else if (a === "--stdout") toStdout = true;
    else if (a === "--only") {
        only = new Set(args[++i].split(",").map((n) => n.trim().toLowerCase()));
        toStdout = true;
    } else if (a === "-h" || a === "--help") {
        console.log(
            fs
                .readFileSync(fileURLToPath(import.meta.url), "utf8")
                .split("\n")
                .slice(1, 11)
                .join("\n"),
        );
        process.exit(0);
    } else inputs.push(a);
}
if (!fs.existsSync(path.join(csRepo, "CoreBots.cs"))) {
    console.error(`No C# Scripts repository at ${csRepo} (use --scripts <path>).`);
    process.exit(1);
}

const csx = await new CsIndex(csRepo).load();
const tsx = new TsIndex(scriptsDir);
const prettierConfig = (await prettier.resolveConfig(path.join(scriptsDir, "x.ts"))) ?? {};

const files = [];
for (const input of inputs) {
    const abs = path.resolve(csRepo, input);
    if (fs.statSync(abs).isDirectory()) {
        for (const rel of csx.trees.keys()) if (path.resolve(csRepo, rel).startsWith(abs + path.sep)) files.push(rel);
    } else files.push(csx.resolve(path.relative(csRepo, abs)));
}

let written = 0;
let skipped = 0;
const failures = [];
const report = [];
for (const rel of files.sort()) {
    const outRel = tsPathOf(rel);
    const outFile = path.join(scriptsDir, outRel + ".ts");
    // --force replaces only the converter's own drafts (the marker line), never a finished port.
    if (!toStdout && fs.existsSync(outFile) && (!force || !fs.readFileSync(outFile, "utf8").includes(MARKER))) {
        skipped++;
        continue;
    }
    let text;
    let todos;
    try {
        ({ text, todos } = new FileConverter({ tsx, csx, rel, outRel }).convert());
    } catch (e) {
        failures.push(`${rel}: ${e.stack}`);
        continue;
    }
    try {
        text = await prettier.format(text, { ...prettierConfig, parser: "typescript", filepath: outFile });
    } catch (e) {
        todos.push(`prettier: ${String(e.message).split("\n")[0]}`);
    }
    if (only) {
        // Formatted on their own: a syntax error elsewhere in the file mustn't leave them raw.
        let picked = pickMembers(text, only);
        try {
            const wrapped = await prettier.format(`class Picked {\n${picked}\n}\n`, {
                ...prettierConfig,
                parser: "typescript",
            });
            picked = wrapped.replace(/^class Picked \{\n/, "").replace(/\n\}\n$/, "\n");
        } catch (e) {
            console.error(`prettier (members): ${String(e.message).split("\n")[0]}`);
        }
        process.stdout.write(picked);
    } else if (toStdout) process.stdout.write(text);
    else {
        fs.mkdirSync(path.dirname(outFile), { recursive: true });
        fs.writeFileSync(outFile, text);
    }
    written++;
    report.push({ rel, outRel, todos });
}

for (const r of report) {
    if (r.todos.length) {
        console.error(`${r.outRel}.ts: ${r.todos.length} to check`);
        for (const t of r.todos) console.error(`    ${t}`);
    }
}
for (const f of failures) console.error(`FAILED ${f}`);
console.error(`${written} converted, ${skipped} already ported, ${failures.length} failed`);
