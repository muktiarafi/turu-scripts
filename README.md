# Turu scripts

Bot scripts for [Turu](https://github.com/muktiarafi/turu), the cross-platform AdventureQuest
Worlds bot client: TypeScript ports of the C# scripts in [auqw/Scripts](https://github.com/auqw/Scripts),
written for Skua and VibeSkua.

**Using them:** in Turu, open **Scripts > Search Scripts**, pick a script and press **Start**.
Turu downloads it with everything it imports and keeps it up to date. To run a file of your own,
use **Scripts > Script Loader > Load Script**.

> **Status:** about 1,800 scripts are ported, covering almost every C# folder. All of them
> type-check and load in Turu, but most haven't been run in game yet. About 1,600 are still
> machine-converted drafts nobody has reviewed: their first line starts with
> `// Converted by tools/cs2ts`. If one misbehaves, compare it with its C# file and
> [open an issue](https://github.com/muktiarafi/turu-scripts/issues) or a pull request.

## Writing a script

A script is a `.ts` file that exports a `main()` function. Turu strips its types and runs it.

```ts
/*
name: My Script
description: What it does.
tags: nation, example
*/
import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";

export default function main(): void {
    Core.setOptions();

    Core.addDrop("Dark Crystal Shard");
    Core.equipClass(ClassType.Farm);
    Core.killMonster("tercessuinotlim", "m2", "Left", "*", "Dark Crystal Shard", 10, { isTemp: false });
    bot.log("done");

    Core.setOptions(false);
}
```

- **Synchronous:** every call blocks until it's done. There's no `async`/`await`.
- **Stop:** pressing Stop makes the next bot call throw `ScriptStopped`. Never swallow it: call
  `rethrowIfStopped(error)` first in every `catch`.
- **Two layers:** `bot.*` does raw actions ([the API](https://github.com/muktiarafi/turu/blob/main/bot/js/turu.ts)).
  `Core.*` holds the CoreBots helpers you know from C#, with the same names in camelCase.
- **Waiting:** use `Core.sleep()` / `Core.waitForTrue()` in long loops, not `bot.sleep()`. Core's
  background handlers (registered quests, the AFK check) only run while the script waits in Core.
- **Imports:** relative, without the extension (`"../core/CoreBots"`).
- **Header block:** keep it first in the file. Search Scripts shows its `name`, `description`
  and `tags`; an indented line continues the key above it.
- **Settings:** `Core.setOptions()` loads Options > CoreBots, as in VibeSkua. A script's own
  options go in `scriptOptions` and are edited in Scripts > Edit Script Options
  (`other/various/Potions.ts` is an example).

How C# calls map to TypeScript (named arguments become option objects, overloads get their own
names), the merge-script pattern and background tasks are in
[docs/PORTING.md](docs/PORTING.md#conventions). Turu's
[scripting guide](https://github.com/muktiarafi/turu/blob/main/docs/SCRIPTING.md) covers the API
in depth.

## Layout

Folders mirror the C# repository in lower case: `Nation/Materials/0MaxBags.cs` is
`nation/materials/0MaxBags.ts`.

| Path | What |
|---|---|
| `core/` | The shared libraries: `CoreBots` (`Core`), `CoreFarms`, `CoreStory`, `CoreDailies`, `CoreAdvanced`, and `CoreTasks` (background tasks). They hold only what ported scripts use; port more from the C# as needed. |
| `army/`, `ultrasv3/` | Multi-account scripts and the Ultras, on Turu's accounts and `bot.army` ([notes](docs/PORTING.md#army)). |
| `types/turu.ts` | A copy of Turu's script API, for type-checking outside a Turu checkout. Never edit it by hand: it's updated together with Turu. |
| `tools/build-index.mjs` | Builds the list Search Scripts reads (see [The index](#the-index)). |
| `tools/cs2ts/` | The C# to TypeScript converter ([docs/PORTING.md](docs/PORTING.md#cs2ts)). |

## Checking your changes

Turu doesn't type-check scripts when it runs them, so check them here:

```bash
npx -y -p typescript@5.9.3 tsc --noEmit -p .     # type-check
npx -y prettier@3.6.2 --write "**/*.{ts,mjs}"     # format: 4 spaces, 120 columns
```

Inside a Turu checkout (`scripts/`), this type-checks against Turu's current API; on its own, it
uses `types/turu.ts`. CI runs both commands on every pull request. See
[CONTRIBUTING.md](CONTRIBUTING.md) for how to send changes.

To port a C# script, start with a draft from cs2ts, then fix by hand what `tsc` reports:

```bash
cd tools/cs2ts && npm ci && cd ../..                           # once
node tools/cs2ts/cs2ts.mjs Other/MergeShops/BeleensMerge.cs    # a path in ../Scripts
```

## The index

Search Scripts reads `index.json` from the `index` branch
(`https://raw.githubusercontent.com/muktiarafi/turu-scripts/index/index.json`; point Turu at a
fork with `TURU_SCRIPTS_REPO=owner/name`). On every push to `main`, CI builds it with
`tools/build-index.mjs` and replaces the branch, so `main` only holds scripts.

For each script, the index lists its path, header, size, SHA-256, the dates it was added and
last updated (from `git log`), and every file it imports, directly or not. Files with no
`export default` (the `Core*` libraries) are marked `library`: Search Scripts doesn't list
them, and they're downloaded with the scripts that import them. Turu checks every file's
SHA-256 when it downloads. To build the index locally: `node tools/build-index.mjs > index.json`.

## What's ported

| C# folder | Status |
|---|---|
| `Story`, `Seasonal`, `Other`, `Nation`, `Legion`, `Hollowborn`, `Darkon`, `Good`, `Evil`, `Chaos`, `ShadowsOfWar`, `Farm`, `Dailies`, `Enhancement` | Every script, merge scripts included |
| `Other/FarmJoeKits` | `0FarmerJoeDoAll` (levels 1 to 100) and the files it reaches |
| `Army` | `CoreArmyLite`, the army farms and the one-client scripts. Not the templates or the script generator. |
| `Tools` | The in-game tools. Not the developer, generator and file-based ones ([why](docs/PORTING.md#tools)). |
| `Ultras/Ultrasv3` | The engine, the individual Ultras, the challenge bosses, the DoAll scripts and Entwined Eclipse. Not the older `Ultras` and `Ultrasv2` sets. |
| `Prototypes` | Only the files other scripts include |
| `Templates`, `Skills` | Not ported (templates and skill data, not scripts) |

[docs/PORTING.md](docs/PORTING.md) lists, area by area, what each port leaves out or changes,
and the C# bugs fixed on purpose (marked `C#` in the code).

## Credits

- The scripts are ports of [auqw/Scripts](https://github.com/auqw/Scripts), by Tato, wtffidy,
  LordExelot, Vld Mrk, PUNK3DAF, l0newolf12, PapaShokry, BrenoHenrike, SharpTheNightmare and
  [the other contributors](https://github.com/auqw/Scripts/graphs/contributors). Their logic,
  names and structure are theirs; this repository translates them to TypeScript for Turu.
- The script API follows [Skua](https://github.com/auqw/skua) (the auqw team) and
  [VibeSkua](https://github.com/NinjaXz/VibeSkua) (NinjaXz).

auqw/Scripts publishes no license, so its authors keep their rights to the ported scripts. If
you're one of them and want something changed or removed,
[open an issue](https://github.com/muktiarafi/turu-scripts/issues). This project isn't affiliated
with Artix Entertainment or auqw.
