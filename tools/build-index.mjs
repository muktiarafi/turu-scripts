#!/usr/bin/env node
// Builds index.json, the list Turu's Search Scripts window reads (turu_bot::repo::Index):
// every script's path, header (name, description, tags), size, sha256, git dates and the files
// it imports. CI publishes it on the `index` branch (.github/workflows/index.yml).
//
//     node tools/build-index.mjs > index.json
//
// Run it from the repository root, in a full clone (the dates come from `git log`).

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { posix } from "node:path";

const INDEX_VERSION = 1;
// Not scripts: the API types and the C# converter. (`tools/` itself holds scripts; this tool
// and the converter are `.mjs`, which isn't listed.)
const SKIP = new Set(["types", "tools/cs2ts"]);

/** The `.ts`/`.js` files under `dir`, as `/`-separated paths. */
function listScripts(dir = "") {
    const out = [];
    for (const name of readdirSync(dir || ".")) {
        const path = dir ? `${dir}/${name}` : name;
        if (name.startsWith(".") || name === "node_modules" || SKIP.has(path)) continue;
        if (statSync(path).isDirectory()) out.push(...listScripts(path));
        else if (/\.(ts|js)$/.test(name)) out.push(path);
    }
    return out;
}

/**
 * The `/* name: ... description: ... tags: ... *\/` block a script starts with. An indented
 * line continues the key above it. Same rules as turu_bot::repo::parse_header.
 */
export function parseHeader(source) {
    const header = { name: "", description: "", tags: [] };
    const text = source.replace(/^﻿/, "").trimStart();
    if (!text.startsWith("/*")) return header;
    const end = text.indexOf("*/", 2);
    if (end < 0) return header;
    const fields = { name: "", description: "", tags: "" };
    let current = null;
    for (const line of text.slice(2, end).split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const match = !/^\s/.test(line) && /^(name|description|tags):(.*)$/.exec(trimmed);
        let key, value;
        if (match) {
            [key, value] = [match[1], match[2].trim()];
            current = key;
        } else if (current) {
            [key, value] = [current, trimmed];
        } else {
            continue;
        }
        if (fields[key] && value) fields[key] += " ";
        fields[key] += value;
    }
    header.name = fields.name;
    header.description = fields.description;
    header.tags = fields.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    return header;
}

/**
 * Whether `source` is a library (CoreBots, CoreFarms, ...): no `export default`, so nothing to
 * run. Search Scripts doesn't list them; they come with the scripts that import them. Same rule
 * as turu_bot::repo::is_library.
 */
export function isLibrary(source) {
    return !/^\s*export\s+default\b/m.test(source);
}

/** Maps scripts only pass through or park in: they would list half the scripts. */
const PASSING = new Set(["whitemap", "battleon", "yulgar", "house"]);

/**
 * The maps `source` names in a call that takes one (`huntMonster("nulgath", ...)`,
 * `killMonster(...)`, `map.join(...)`), lowercase and sorted, a room number dropped: Turu lists
 * the script on those maps. Same rule as turu_bot::map_scripts::maps_in.
 */
export function mapsIn(source) {
    const pattern =
        /\b(?:huntMonster|killMonster|HuntMonster|KillMonster|huntMonsterMapID|killMonsterMapID|join|Join|joinMap|JoinMap|joinSWF|goTo|ensureMap)\(\s*["'`]([A-Za-z][A-Za-z0-9_]*)(?:-[0-9]+)?["'`]/g;
    const maps = new Set();
    for (const m of source.matchAll(pattern)) {
        const map = m[1].toLowerCase();
        if (!PASSING.has(map)) maps.add(map);
    }
    return [...maps].sort();
}

/** The relative imports of `source` (`import ... from "./x"`, `export ... from`, `import "./x"`). */
function imports(source) {
    const out = [];
    const patterns = [
        // The closing quote matches the opening one: file names may hold the other quote.
        /\b(?:import|export)\s[^'"`;]*?\bfrom\s*(["'])(\.{1,2}\/(?:(?!\1).)+)\1/g,
        /\bimport\s*(["'])(\.{1,2}\/(?:(?!\1).)+)\1/g,
    ];
    for (const pattern of patterns) for (const m of source.matchAll(pattern)) out.push(m[2]);
    return out;
}

/** What `./x` names, as the engine resolves it: `x`, `x.ts`, `x.js`, `x/index.ts`. */
function resolve(from, specifier, files) {
    const base = posix.normalize(posix.join(posix.dirname(from), specifier));
    return [base, `${base}.ts`, `${base}.js`, `${base}/index.ts`].find((p) => files.has(p));
}

/** Path -> { added, updated } from one walk of the history (oldest first). */
function gitDates() {
    const log = execFileSync("git", ["log", "--reverse", "--no-renames", "--format=@@%aI", "--name-only"], {
        encoding: "utf8",
        maxBuffer: 256 * 1024 * 1024,
    });
    const dates = new Map();
    let date = null;
    for (const line of log.split("\n")) {
        if (line.startsWith("@@")) date = new Date(line.slice(2)).toISOString().replace(/\.\d{3}Z$/, "Z");
        else if (line && date) {
            const entry = dates.get(line);
            if (entry) entry.updated = date;
            else dates.set(line, { added: date, updated: date });
        }
    }
    return dates;
}

const paths = listScripts().sort();
const files = new Set(paths);
const sources = new Map(paths.map((p) => [p, readFileSync(p)]));
const direct = new Map(
    paths.map((p) => {
        const found = [];
        for (const specifier of imports(sources.get(p).toString("utf8"))) {
            const target = resolve(p, specifier, files);
            if (target) found.push(target);
            else console.error(`warning: ${p}: can't find ${specifier}`);
        }
        return [p, found];
    }),
);

/** Everything `path` imports, directly or not. */
function closure(path) {
    const seen = new Set();
    const stack = [...direct.get(path)];
    while (stack.length) {
        const next = stack.pop();
        if (next === path || seen.has(next)) continue;
        seen.add(next);
        stack.push(...direct.get(next));
    }
    return [...seen].sort();
}

const dates = gitDates();
const index = {
    version: INDEX_VERSION,
    commit: process.env.GITHUB_SHA || execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
    generated: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    scripts: paths.map((path) => {
        const bytes = sources.get(path);
        const header = parseHeader(bytes.toString("utf8"));
        const name = header.name || posix.basename(path).replace(/\.(ts|js)$/, "");
        if (!header.name) console.error(`warning: ${path}: no name in its header`);
        return {
            path,
            name,
            description: header.description,
            tags: header.tags,
            size: bytes.length,
            sha256: createHash("sha256").update(bytes).digest("hex"),
            added: dates.get(path)?.added ?? "",
            updated: dates.get(path)?.updated ?? "",
            deps: closure(path),
            library: isLibrary(bytes.toString("utf8")),
            maps: mapsIn(bytes.toString("utf8")),
        };
    }),
};
process.stdout.write(`${JSON.stringify(index)}\n`);
