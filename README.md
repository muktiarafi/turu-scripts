# Turu scripts

TypeScript ports of the AQW bot scripts (VibeSkua's C# `Scripts` repo) for
[Turu](https://github.com/muktiarafi/turu). The engine loads a `.ts` file, strips its types
(oxc) and runs its `export default function main()`.

Turu's Scripts > Search Scripts lists, downloads and updates these scripts. In the Turu
repository this one is the `scripts/` submodule.

## Layout

| Path | What |
|---|---|
| `core/CoreBots.ts` | Port of `CoreBots.cs`: `Core` (join, kill/hunt, quests, drops, bank, shops, classes, logging). |
| `core/CoreFarms.ts` | The parts of `CoreFarms.cs` the ported scripts use (gold, experience, alchemy crafting, the Bludrut and Death Pit brawls, Battle Under B, fishing and its boosts, and the Alchemy, Blacksmithing, Blade of Awe, Chaos, ChronoSpan, Death Pit Brawl, DoomWood, Evil, Fishing, Glacera, Good, Loremaster, Mythsong, SpellCrafting, Swordhaven and Vampire reps). |
| `core/CoreStory.ts` | Port of `CoreStory.cs`: `killQuest`, `mapItemQuest`, `buyQuest`, `chainQuest`, `questProgression`, `legacyQuestManager`, `preLoad`. Each script makes its own `new CoreStory()`. |
| `core/CoreDailies.ts` | Port of `CoreDailies.cs`: every daily, weekly and monthly (`checkDailyv2`, `dailyRoutine`, metals, class tokens, boosts, friendships, ...). Each script makes its own `new CoreDailies()`. |
| `core/CoreAdvanced.ts` | The shop, gear and enhancement parts of `CoreAdvanced.cs`: `buyItem` farms the reputation, level, gold, vouchers and runestones a purchase needs; `startBuyAllMerge` is the merge-shop template (with `mergeOptions` and `mergeOptionsEnum`); `enhanceItem`, `enhanceEquipped`, `smartEnhance` (the class library), `gearStore`, `rankUpClass`, `hasMinimalBoost` and the enums `EnhancementType`, `CapeSpecial`, `HelmSpecial`, `WeaponSpecial`, `GenericGearBoost`, `RacialGearBoost`. Not yet: the Kill region. |
| `nation/CoreNation.ts` | The parts of `Nation/CoreNation.cs` that farm the Nulgath materials, Swindles Return, The Assistant and the Shadow Blast medals and emblems. |
| `nation/materials/0MaxBags.ts` | Port of `Nation/Materials/0MaxBags.cs`. |
| `farm/GoldFarm.ts` | Port of `Farm/GoldFarm.cs`. |
| `farm/CombatTrophy.ts` | Port of `Farm/CombatTrophy.cs` (`Farm.bludrutBrawlBoss`). |
| `other/mergeshops/SynderesMerge.ts` | Port of `Other/MergeShops/SynderesMerge.cs`: the pattern for every merge script (see below). |
| `other/various/Potions.ts` | Port of `Other/Various/Potions.cs`. Its options are declared in `scriptOptions` and edited in Scripts > Edit Script Options. |
| `other/farmjoekits/0FarmerJoeDoAll.ts` | Port of `Other/FarmJoeKits/0FarmerJoeDoAll.cs`: the level 1 to 100 progression. `CoreFarmerJoe.ts` next to it holds the steps and the options; the rest of its tree is listed under [FarmerJoe](#farmerjoe). |
| `tsconfig.json` | Type-check config; `"turu"` maps to `../bot/js/turu.ts` (the script API, inside a Turu checkout), else `types/turu.ts`. |
| `types/turu.ts` | A copy of Turu's `bot/js/turu.ts`, for type-checking outside Turu. Copy it again when the API changes (Turu's tests check that it's the same). |
| `.prettierrc.json` | Formatting: Prettier 3.6.2, 4 spaces, 120 columns. CI fails on unformatted code. |
| `tools/build-index.mjs` | Builds `index.json`, the list Search Scripts reads (see [The index](#the-index)). |
| `tools/cs2ts/` | The C# to TypeScript converter (see [Converting with cs2ts](#converting-with-cs2ts)). |

Folders follow the C# repo (`Nation/Materials/0MaxBags.cs` -> `nation/materials/0MaxBags.ts`).
Core files only contain what ported scripts reach; port more members from the C# files as
needed, in the same order and with the same names in camelCase.

## Type-check

```bash
npx -y -p typescript@5.9.3 tsc --noEmit -p .    # here, or in Turu's scripts/
npx -y prettier@3.6.2 --write "**/*.{ts,mjs}"    # format (CI runs --check)
```

The engine doesn't type-check at runtime, so run this after every change.

## Converting with cs2ts

`tools/cs2ts` turns a C# script into a first draft of its port, following the conventions below.
It parses the C# with tree-sitter and asks the TypeScript checker about the ported side (every
`.ts` here and `turu.ts`), so names, types and signatures come from what's already ported:

```bash
cd tools/cs2ts && npm ci && cd ../..                       # once
node tools/cs2ts/cs2ts.mjs Other/MergeShops/BeleensMerge.cs   # paths in ../Scripts (--scripts <dir>)
node tools/cs2ts/cs2ts.mjs Seasonal/Mogloween                 # a whole folder
node tools/cs2ts/cs2ts.mjs --only HollowbornREP,EternalREP CoreFarms.cs   # just these members, to
                                                              # paste into a partial port
npx -y -p typescript@5.9.3 tsc --noEmit -p .                  # what is left to fix by hand
```

What it does: the header block, `//cs_include`s as imports, `Core`/`Farm`/`Adv`-style properties as
module-level instances, `Options`/`MultiOptions` as `scriptOptions`, `ScriptMain` as `main()`, PascalCase
to the ported camelCase (`ID` -> `id`), named and extra positional arguments into the ported options
objects (C# parameter names map to the keys), `params` arrays, LINQ, lists, dictionaries (`Map`),
strings, `DateTime`/`TimeSpan` (milliseconds), `Bot.Random`, string interpolation and its formats,
`///` docs as JSDoc, C# local functions hoisted, event handlers (`Bot.Events.X += Handler`) as bound
arrow properties taking the event's data, `goto` to a loop label as `continue label`, Skua's
`Monster.Alive` and `Quest.Active`, `rethrowIfStopped` first in every `catch`. What it can't
convert is marked `/* cs2ts: ... */` (async code, `out` parameters, patterns, `goto` elsewhere).

A draft starts with the line `// Converted by tools/cs2ts, not yet read through by hand ...`.
An existing file is never overwritten; `--force` replaces only a file that still has that line,
so fixing a draft by hand means removing it. A draft that type-checks may still be wrong where
C# and TS differ in ways the types don't show (integer division, `ItemBase.ToString()`); the
converter flags the ones it knows.

## The index

On every push to `main`, CI (`.github/workflows/index.yml`) type-checks the scripts, runs
`tools/build-index.mjs` and force-pushes the result as the only file of the `index` branch.
Turu reads it from `https://raw.githubusercontent.com/muktiarafi/turu-scripts/index/index.json`
(another repository with `TURU_SCRIPTS_REPO=owner/name`). Nothing is committed to `main`.

Each entry has the script's `path`, the `name`, `description` and `tags` of its header block,
`size`, `sha256`, `added` and `updated` (from `git log`), `deps`, every file it imports
directly or not, and `library`: true for a file with no `export default` (the `Core*` files),
which Search Scripts doesn't list; it comes with the scripts that import it. Turu downloads a script with its `deps`, from the index's `commit`, and checks
each file's sha256. Keep the header block first in the file:

```ts
/*
name: Gold Farm
description: honor hall for members,
    BGE for f2p
tags: gold, battle ground e
*/
```

An indented line continues the key above it. A file without a `name` is listed under its file
name. Imports must be relative (`../core/CoreBots`) so the index can follow them.

To see the index locally: `node tools/build-index.mjs > index.json`.

## Writing a script

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

- Every call is synchronous: no `async`/`await`. Pressing Stop makes the next bot call throw
  `ScriptStopped`; never swallow it (`rethrowIfStopped(error)` first in a `catch`).
- Use `bot.*` (see `bot/js/turu.ts`) for raw actions and `Core.*` for the C# CoreBots helpers.
- Relative imports without extension (`"../core/CoreBots"`).
- C# named arguments for flags become option objects: `KillMonster(..., isTemp: false, log: false)`
  -> `Core.killMonster(..., null, 1, { isTemp: false, log: false })`. So do boolean parameters
  whose meaning a call doesn't show: `CheckInventory(items, 1, true)` ->
  `Core.checkInventory(items, 1, { any: true })`, `FarmVoucher(true)` ->
  `Nation.farmVoucher({ member: true })`. On/off switches stay positional (`Core.setOptions(false)`,
  `Core.toggleAggro(true)`).
- C# overloads whose shapes clash get their own name: `EnsureComplete(params int[])` ->
  `Core.ensureCompleteQuests(...ids)`, `HuntMonsterMulti(map, mon, (item, quant, isTemp)[])` ->
  `Core.huntMonsterMulti(map, mon, [[item, quant, isTemp], ...])`.
- `Bot.UltraBossHelper` is `bot.ultraBossHelper`; `Bot.Combat.StopAttacking` is
  `bot.combat.stopAttacking`.
- Game objects read with `bot.flash.get` get an interface (`GameItem`, `InvCatSettings` in
  CoreBots), not `any`; read their fields with `num` / `text` / `flag`.
- Wait with `Core.sleep()` / `Core.waitForTrue()` rather than `bot.sleep()` in long loops: Core's
  background handlers (registered quests, the AFK check) only run while the script waits in Core.
- Configuration (`soloClass`, `farmClass`, `privateRooms`, ...) are fields on `Core`.
  `Core.setOptions()` fills them from Options > CoreBots (the CBO file), as in VibeSkua. Keys
  read from that file while a script runs can be overridden in `Core.cboValues`
  (e.g. `Core.cboValues["Nation_SellMemVoucher"] = "True"`).

## Enhancing

The specials C# passes positionally or by name become an option object; a list of names is the
same method:

- `Adv.EnhanceItem(cape, EnhancementType.Lucky, CapeSpecial.Vainglory)` ->
  `Adv.enhanceItem(cape, EnhancementType.Lucky, { cSpecial: CapeSpecial.Vainglory })`
- `Adv.EnhanceItem(weapon, EnhancementType.Lucky, wSpecial: WeaponSpecial.Dauntless)` ->
  `Adv.enhanceItem(weapon, EnhancementType.Lucky, { wSpecial: WeaponSpecial.Dauntless })`
- `Adv.EnhanceEquipped(type, cape, helm, weapon, true)` ->
  `Adv.enhanceEquipped(type, { cSpecial: cape, hSpecial: helm, wSpecial: weapon, bypassDisableAutoEnhance: true })`
- `Adv.SmartEnhance(className, true)` -> `Adv.smartEnhance(className, { forceEnh: true })`
- `Adv.GearStore(true, EnhAfter: true)` -> `Adv.gearStore(true, { enhAfter: true })`
- `Adv.RankUpClass("Name", itemid: 36298)` -> `Adv.rankUpClass("Name", { itemId: 36298 })` (or
  `Adv.rankUpClass(36298)`); `RankUpClass(name, false)` -> `rankUpClass(name, { gearRestore: false })`.

## Merge scripts

A C# merge script (`Adv.StartBuyAllMerge` + `MultiOptions = { "Generic", "Select" }`) ports as in
`other/mergeshops/SynderesMerge.ts`:

- The class keeps `buyAllMerge(buyOnlyThis, buyMode)` (other scripts call it) and its
  `findIngredients` switch on `Adv.externalItem.name` / `Adv.externalQuant`.
- `Adv.StartBuyAllMerge(map, shop, findIngredients, buyOnlyThis, buyMode: buyMode)` becomes
  `Adv.startBuyAllMerge(map, shop, () => this.findIngredients(), buyOnlyThis, { buyMode })`.
- The `Select` list becomes a static list of `option.bool("<itemId>", ...)`, and the options are
  `defineScriptOptions(Adv.optionsStorage, [], true, { Generic: Adv.mergeOptions, Select: ... })`.
  VibeSkua's `MergeOptionStorage.cfg` reads as is.
- `Adv.MergeItemisinShopExceptions.AddRange(...)` becomes `Adv.mergeItemisinShopExceptions.push(...)`.

Every merge script outside the Ultras folders is ported (436 converted with cs2ts, besides the 19
earlier hand ports), with the 150 scripts they include that weren't ported yet (story, seasonal and
material scripts, `prototypes/MoreSkullsBoss.ts`). They type-check and load (Turu's
`every_repo_script_declares_its_options_without_error` imports each one), but none has run in game.
Most are drafts with the cs2ts line; these 19 were fixed by hand where the conversion fell short:
`ArcanaInvokerResourceMerge`, `CoreHollowbornPaladin`, `CoreLR`, `NationLoyaltyRewarded`,
`LothianTreasuryMerge`, `MagnumOpusMerge`, `NovaOmiyageMerge`, `SeaVoiceMerge`, `MoreSkullsBoss`,
`EbilMegaMallStory`, `LuckyDayShamrockFairMerge`, `WalpurgaWitchWares`, `CoreDageBirthday`,
`AluteaNursery`, `DoomPirateHaulMerge`, `DarkCarnax`, `VictorMatsuri`, `CoreIsleOfFotia`,
`InfernalArena`. C#'s `Task.Run` movement in `DarkCarnax` and `MoreSkullsBoss` is a
`bot.handlers.once` timer here (scripts are single-threaded).

The Core members they need were added from the C# with `cs2ts --only` and checked by hand:
CoreBots (`checkSpaces`, which returns the counter C# passes by `ref`; `huntMonsterQuestChoose`, one
overload-dispatching method for C#'s four; `killBossWithSecondary`, `questRequirements` /
`questRequirementIds` for C#'s `<string>` / `<int>`, `cutSceneFixer`, `getMonsterHP`, `isUpholder`,
`useDodgeClass`), CoreFarms (Arcangrove, CraggleRock, Elemental Master, Eternal, Hollowborn,
Mysterious Dungeon and TreasureHunter reps), and members of CoreLegion, CoreHollowborn, CoreNation,
CoreNSOD, CoreQoM, CoreToD, CoreSummer and CoreSepulchure. `ShopRequirement`, `RewardItem` and
turu's `QuestItem` gained `upgrade` (and `QuestItem` `maxStack`), and turu `bot.map.cellPlayers`.

Not ported: `LothianTreasuryMerge`'s Queen Iona ingredients (C# fights her with the Ultra engine;
the merge logs and skips them).

C# bugs fixed on purpose (still in VibeSkua's Scripts, marked `C#` in the code):

- `AluteaNursery.AluteaNurseryRewards` builds its reward list from an empty list, so the check of
  nothing passes and the rewards are never farmed.
- `VictorMatsuri` passes the requirement's `ItemBase.ToString()` ("[ID]\t(Item) Name x1") as the item
  to `KillMasakado`, which no item matches, so the kill loop never ends.
- `NationLoyaltyRewarded` blacklists the `ToString()` of the quest's items instead of their names,
  so they were banked anyway.
- `InfernalArena`'s class check falls back to `"Void Highlord" ?? ""`, never empty: without either
  Void Highlord it equipped Void Highlord instead of the solo class.
- `BeleensMerge` lists item 59359 twice in its options (Turu refuses duplicate option names).

Fixed in the earlier port: `Potions.needYourStrongestPotions` read `BuyReagents` and `MaxAll` with
`bot.config.get`, which throws when another script (a merge) calls it; it reads them with
`configOr` now, like C#'s `Config.Get` returning the default.

## FarmerJoe

`other/farmjoekits/0FarmerJoeDoAll.ts` and everything its `DoAll` reaches are ported: 128 files
under `chaos/`, `dailies/`, `darkon/`, `enhancement/`, `evil/`, `good/`, `hollowborn/`, `legion/`,
`nation/`, `other/`, `seasonal/`, `shadowsofwar/` and `story/`, each at its C# path. None of it
has run in game yet; it type-checks, and `bot/tests/runtime.rs` loads DoAll against a fake game.

- A file holds the methods DoAll reaches plus what its own `ScriptMain` reaches (its `main()`);
  its header lists the C# methods it leaves out. Port those from the C# file when another
  script needs them.
- Not ported: the classes the C# tree includes but DoAll never calls. `Dailies/0AllDailies`,
  `Dailies/MineCrafting`, `Enhancement/InventoryEnhancer`, `Tools/BankAllItems` (only in a
  commented-out line of DoAll), `Story/Friendship`, `Story/Hollowborn/CoreHollowbornStory`,
  `Story/ElegyofMadness(Darkon)/DarkonGarden`, `Story/TowerOfDoom`,
  `Story/QueenofMonsters/Extra/BrightOak`, `Nation/NationLoyaltyRewarded`,
  `Nation/MergeShops/NationMerge`, `Nation/Various/DragonBlade[mem]`, `Other/Classes/Necromancer`,
  `Other/Classes/REP-based/{EternalInversionist,StoneCrusher,DarkbloodStormKing}`,
  `Other/MergeShops/CelestialChampMerge`, `Other/Weapons/{DualChainSawKatanas,EnchantedVictoryBladeWeapons}`.
- Options another script reads (C# `Bot.Config.Get<T>(name)` in a content script, which DoAll
  calls with its own options loaded) go through `configOr(name, fallback)` from CoreBots: the
  fallback is C#'s `default(T)`. Enums whose members are item or quest IDs (the reward choices of
  JuggernautItems, TheLeeryContract, ArchfiendDeathLord, AssistingCragAndBamboozle, CoreSDKA's
  quest) stay numeric and are read with `configEnum(name, MyEnum, fallback)`; the other option
  enums are string enums.
- C# local functions are closures at the top of their method (`const findIngredients = ...`).
  Packet and flash-call listeners use `bot.events.on("extensionPacket", ...)` / `off`.
- Fixed C# bugs (each marked in the code): `CoreFarmerJoe.pets()` read the undeclared option
  `"Pets"` and never ran (it reads `"PetChoice"` now); `TheLeeryContract.questItems(reward)`
  ignored `reward` for the option (its `main()` passes the option now); `CoreLegion.dagePvP`
  took `canSoloBoss` from whether the CBO key is set (it takes the key's value now).
  Nation (still in VibeSkua's C#): the voucher turn-ins (quest 4778) checked the Diamonds' stack
  before taking Gems of Nulgath (they check the Gems now); `kisstheVoid` sold the voucher when
  told to keep it, and `bambloozevsDrudgen` ignored `keepVoucher`; `NulgathDemandsWork` and
  `gemStoneReceiptOfNulgath` farmed the member voucher before steps that sell it (it's farmed
  last now); the Dwobo shop was bought from the map "crashedruins" (now `crashruins`);
  `gemStonesOfnulgath` needed the Gemstone *or* membership (now both); `approvalAndFavor`
  ignored Stop for the Favors; `uni27` didn't farm quest 584's Tainted Gems; PrimeFiendShard's
  finale unbanked quest 8916's items; `VoidPaladin.cyberSet` accepted 6625 without its items;
  `assistingCandB` tried several turn-ins per farm round (now one). Changed: the "You will not
  resist!" watch in `CoreAOR.fightVoiceInTheSea` reads the parsed packet instead of the raw
  `pext` flash call.

A fuller guide is in `docs/turu/SCRIPTING.md`.
