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
| `core/CoreFarms.ts` | Port of `CoreFarms.cs`: gold, experience, alchemy crafting, the Bludrut and Death Pit brawls, Battle Under B, fishing and its boosts, every reputation (`getAllRanks`), Membership Dues and the Swag Tokens. Not yet: `FireWarxp`, `RemainingFactionRepToMax`. |
| `core/CoreStory.ts` | Port of `CoreStory.cs`: `killQuest`, `mapItemQuest`, `buyQuest`, `chainQuest`, `questProgression`, `legacyQuestManager`, `preLoad`. Each script makes its own `new CoreStory()`. |
| `core/CoreDailies.ts` | Port of `CoreDailies.cs`: every daily, weekly and monthly (`checkDailyv2`, `dailyRoutine`, metals, class tokens, boosts, friendships, ...). Each script makes its own `new CoreDailies()`. |
| `core/CoreAdvanced.ts` | The shop, gear and enhancement parts of `CoreAdvanced.cs`: `buyItem` farms the reputation, level, gold, vouchers and runestones a purchase needs; `startBuyAllMerge` is the merge-shop template (with `mergeOptions` and `mergeOptionsEnum`); `enhanceItem`, `enhanceEquipped`, `smartEnhance` (the class library), `gearStore`, `rankUpClass`, `hasMinimalBoost` and the enums `EnhancementType`, `CapeSpecial`, `HelmSpecial`, `WeaponSpecial`, `GenericGearBoost`, `RacialGearBoost`. Not yet: the Kill region. |
| `nation/CoreNation.ts` | Port of `Nation/CoreNation.cs` (the Nulgath materials, Swindles Return and Bulk, The Assistant, the Shadow Blast medals and emblems, the Forge and Carve quests, Fiend Tokens, ...). Not yet: `DiamondEvilWar`, `ForgeDiamondsOfNulgath`, `SwindlesBilk`. |
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

## Story scripts

Every script under the C# `Story/` folder is ported: the 282 left after the merge batch were
converted with cs2ts (they include nothing outside `Story/` that wasn't ported, and nothing from
the Ultras folders). All but `CoreMemet` are drafts with the cs2ts line. They type-check and load,
but none has run in game. A comparison with the C# found the same calls (`KillQuest`,
`MapItemQuest`, `HuntMonster`, `EnsureAccept`/`Complete`, ...) and the same string and number
arguments in every file, and every quest ID they use is in the C# repo's `QuestData.json`.

The four Core files that were partial ports are complete now, with the members cs2ts drafted
from the C# added in C# order (the members ported before are unchanged): `CoreToD` (`completeToD`,
`baconCatFortress`, `laserSharkInvasion`, `deathPit`, `deathPitPVP`, `yasaris`), `CoreDoomwood`
(`completeDoomwood`, `doomwoodPart1`, `doomwoodPart2`, `doomwoodForest`, `choppingMaul`,
`necroTower`, `necroU`, `templeOfTheLight`, `madScientistsLab`, `necropolisDungeon`,
`necropolisCavern`), `Core7DD` (`complete7DD`, `gluttony`, `pride`, `greed`, `lust`, `envy`,
`wrath`) and `CoreSummer` (`doAll`, `livingDungeon`, `lunaCove`, `cyserosSecret`).

cs2ts now writes C#'s `000` as `0` (a leading zero is an octal literal in TS; the
`ShadowsofDoom[Oct 13th]` placeholder scripts have them), and `EnsureLoad` with an array or several
IDs as `Core.ensureLoadMany(...)`.

C# bugs fixed on purpose (still in VibeSkua's Scripts, marked `C#` in the code):

- `CoreMemet.zorbasPalace` passes quests 7476 and 7481 (done earlier in the chain) for the last
  three quests, 7482 to 7484, so `QuestProgression` skips them: Memet, the Lem-or and Zorba are
  never done, and the 7484 check at the top never lets the saga count as done.

Kept as C# has them: a saga's completion check that names a quest the method doesn't do
(`SkyGuardSaga.chaosGuard` checks 2488, "Defeat Ultra Exos"), or one before a members-only tail
(`CoreToD.laserSharkInvasion` checks 5120 and then does 5121 to 5131 for members, likewise
`CoreFireisland.embersea` and `fireforge`, `CoreDoomwood.necroU`). The run repeats or skips those
parts the way VibeSkua does. The `ShadowsofDoom[Oct 13th]` `Story1` to `Story5` placeholders are
C#'s templates (quest 0, map `mapname`) and do nothing useful.

## Core content areas

Every script in the C# `Nation`, `Legion`, `Hollowborn`, `Darkon`, `Good`, `Evil`, `Chaos`,
`ShadowsOfWar`, `Farm`, `Dailies` and `Enhancement` folders is ported. The 326 left after the
earlier batches were converted with cs2ts (Nation 88, Farm 61, Legion 46, Hollowborn 41,
Dailies 32, Good 16, Darkon 15, Evil 14, ShadowsOfWar 8, Enhancement 4, Chaos 1), with the 7
scripts outside them that they include and weren't ported (`other/badges/ChaosPuppetMaster`,
`other/classes/rep-based/Bard`, `other/FireAvatarFavorFarm`, `other/TreasureHuntQuestRewards`,
`prototypes/Grimgaol`, `seasonal/staffbirthdays/nulgath/BeetleQuests`, `tools/BankAllItems`).
None of them includes anything from the Ultras folders. They type-check and load, but none has
run in game. These 23 were fixed by hand; the other 310 are drafts with the cs2ts line:
`EnhanceEquipped[Selectable]`, `InventoryEnhancer`, `ItemEnhancementManager`, `SmartEnhance`,
`CavernCelestite`, `CoreHollowbornLichKing`, `PayHomagetoCaladbolgAgain`, `5RolesUnreversed`,
`EmpoweredBladeMasterQuestRewards`, `LegionOverfiendBlade`, `SuppliesToSpinTheWheelofChance`,
`BloodGem`, `CarveTheUnidentifiedGemStone[Member]`, `ContractEnforcer`, `EliteVoid`,
`ImageOfNulgath`, `MawOfTheVoid`, `TarosPrismaticManslayers`, `VoidDestroyer`, `VoidWarlock`,
`ChaosPuppetMaster`, `Grimgaol`, `BankAllItems`.

Core members added from the C# with `cs2ts --only` (the members ported before are unchanged):

- CoreFarms: 36 reputations and farms (`aegisREP` to `yokaiREP`, `getAllRanks`,
  `carcossaCourtRep`, `faerieCourtREP`, `skyeREP`, `darkWarLegion`, `sevenCirclesWar`,
  `theSecret4`, `swagTokenA` with its shop step, `membershipDues` and the `MemberShipsIDS` enum,
  `remainingFactionXp`).
- CoreNation: `swindleBulk`, `voucherItemTotemofNulgath` (and `VoucherItemTotem`),
  `assistingDrudgen`, `feedtheFiend`, `farmFiendToken`, `forgeBloodGems`, `carveUniGemStone`,
  `leeryExchangeGold`, `hireNulgathLarvae`, `dreadrockGemExchange`, `bloodFromTheVoid`.
- CoreNSOD (now complete): `getNSOD`, `getNBOD`, `nsBlade`, `nsHilt`, `nsAura`, `energizedBlade`,
  `energizedHilt`, `barium`, `preFarmSteps`, and the `optionsStorage` its scripts use.
- CoreDarkon `secondErrand`, `thirdErrand`; CoreLegion `ltCastle`; CoreSoWMats `dragonsTear`;
  DragonOfTime `dotArmor`; CoreAdvanced `boostKillMonster` (the start of the Kill region, one
  method for C#'s name and ID overloads); CoreBots `questRewardsInt`.
- CoreSDKA and CoreVHL keep their `optionsStorage` / `options` as fields, as C# does, since the
  scripts that include them pass those to their own `defineScriptOptions`.

cs2ts now: keeps a library's (Core file's) `OptionsStorage`, `Options` and `DontPreconfigure` as
class fields; reads `Bot.Config!.Get<NumericEnum>` as `configEnum` (it missed the `!` before);
writes a numeric enum's `ToString()` and interpolation as its name (`E[x]`), and a nested enum of
another script (`InTheFiendsShadow.Rewards`) as an aliased import, also in types, `typeof` and
option defaults; takes whether a ported enum is numeric from its port; turns `new Action(...)` into
the lambda, `Array.IndexOf` / `Find` / `FindAll`, `DistinctBy`, `HashSet.UnionWith`,
`Enum.GetName`, nullable `HasValue` / `Value`, `QuestRequirements<int>` / `<string>`, Skua's
`ItemGroup` / `Wearing` (`equipSlot` / `equipped`), and a local function used as an event
handler (it takes the event's data object); types a `Dictionary` of tuples; keeps a `)` after a
trailing `// comment` in `AddRange`; aliases start with a letter (`2FiendsPurgatory`); drops
imports it asked for and didn't emit. Re-running it over the earlier drafts changed three:
`farm/BuyScrolls` reads its scroll with `configEnum` (it passed the option's name as the quest),
and `story/Friendship` and `other/mergeshops/FishingGearMerge` type their packet handlers.

C# bugs fixed on purpose (still in VibeSkua's Scripts, marked `C#` in the code):

- `CoreFarms.brightoakREP` waits for the puzzle `while (Bot.ShouldExit && ...)`, so it never
  waited; likewise `EliteVoid`'s three loops never farmed the Elite Void Sword, Broadsword and pet.
- `CoreNation.carveUniGemStone` with no item loops while `item == null`, so it never stopped; it
  stops once every quest drop is at the quantity.
- `CarveTheUnidentifiedGemStone[Member]` passes the enum name (`Dark_Crystal_Shard`) as the item,
  which no item matches.
- `CoreHollowbornLichKing.draftless` and `flowStress` test `!= All || != <fragment>` (always true),
  so with every reward owned they turned the quest in for the reward "All".
- `EmpoweredBladeMasterQuestRewards`, `PayHomagetoCaladbolgAgain`, `ImageOfNulgath` and
  `MawOfTheVoid` `return` from their reward loop at the first reward you own, so the rest were
  never farmed.

Differs from C# where Turu can't do the same: `Grimgaol` keeps its personal best for the session
(scripts can't write files; C# appends to `GrimGaolRunTimes.txt`), and its IoDA class names are
getters (C# reads the inventory when the class is made, which here is at load, before the game
can be asked); `CavernCelestite`'s default quantity is the max stack from the quest data (1600)
for the same reason. `CoreFarms.handleShopPurchases` and `membershipDues` truncate C#'s integer
divisions. Turu now accepts `[` and `]` in an options file name (`HardCoreMetals[mem](Daily)`).

## Seasonal

Every script in the C# `Seasonal/` folder is ported (`Frostvale/CheckForDonatedACs`, which uses
CoreArmyLite, came with the Army scripts). The 235 left after the earlier batches were converted with
cs2ts; they include nothing outside `Seasonal/` that wasn't ported. They type-check and load, but
none has run in game. These 9 were fixed by hand; the rest are drafts with the cs2ts line:
`18thBirthdayHeroBadge`, `NoEgretsBadge`, `NusantaraBossesBadge` (C#'s `badge` field and `Badge()`
method share a name in TS: the field is `badgeName`), `TrobbolierPet[mem]` (`StringBuilder`),
`TreasuresOfAotearoa`, `HeadlessHorsemanGear`, `TwillyTreasurePile`, `Mockingbird`,
`VanquishTheBetrayers`. CoreBots gained `playerAFK` (`GoldenTicket` listens to `playerAFK` with it).

cs2ts now writes `List.Remove(x)` as a statement as `if (list.includes(x)) list.splice(...)`
(`splice(indexOf(x), 1)` removed the last item when `x` wasn't there).

C# bugs fixed on purpose (still in VibeSkua's Scripts, marked `C#` in the code):

- `HeadlessHorsemanGear` jumps to an earlier quest's steps with `goto case`, which runs them with
  the later quest's ID and then breaks: it accepts and turns in the wrong quest and never does the
  later one. The earlier quest is done first with its own ID now, then the later one.
- `Mockingbird` and `VanquishTheBetrayers` `return` from their reward loop at the first reward you
  own, so the rest were never farmed.
- `TwillyTreasurePile` declares its kill counter inside the loop, so it never banks every 5 kills.

## Other

Every script in the C# `Other/` folder is ported. The 187 left after the earlier batches were
converted with cs2ts, with `prototypes/InfernalArenaLW` (VerusDoomKnight includes it). Nothing
else outside the Ultras folders, `Army/` and `Tools/` was left but `Core/TaskExtensions.cs`, which
no script includes and only wraps `Task.Run` (scripts are single-threaded). `0AllClasses`, `Lich`,
`SovereignOfStorms` and `VerusDoomKnight` include Ultras files only for what their included
scripts reach (`LothianTreasuryMerge`'s Queen Iona, already a logged skip). They type-check and
load, but none has run in game. These 18 were fixed by hand; the rest are drafts with the cs2ts line:
`InfernalArenaLW`, `0CurrentDailyGifts`, `WorldBoss[Template]`, `CoreArchMage`, `0ArchMage`,
`ArcanaInvoker[Non-Insignia]`, `JoePrepsForUltras`, `BetaBerserkerQuest`, `BringTheCheer`,
`FlamesofLove`, `GenerosityCoin`, `VampireofVokun`, `LoreMasterUniversityHouse`,
`LegionDoomKnight[Mem]`, `1MemberFarmsKit`, `CelestialStarMageSet`, `GrimDarkSet`,
`SecurityPlushiesQuestReward`.

- `InfernalArenaLW`: C#'s `out` results are return values (`equipClass` returns the class name or
  null), the rotation switch (C# `LoadAdvanced` into the running timer) restarts the rotation with
  `startSkills`, and the private `AutoEnhance` C# calls by reflection is called by name.
- `CoreArchMage` and `WorldBoss[Template]`: C#'s `Task.Run` walks are a `bot.handlers.once`
  timer and a walk inside the packet listener. `0ArchMage` exports CoreArchMage's options.
- `0CurrentDailyGifts`: C#'s two `GetGift` overloads (monster by name or map ID) are one method.

Core members added: CoreBots `ghostItem` (the client-side item C#'s `GhostItem` adds;
`category` is the `ItemCategory` name), and `QuestData.requiredFactionRep` (`iReqRep`, read
when asked).

cs2ts now: writes a field whose camelCase name is a method's with a suffix (`badge` ->
`badgeName`, C#'s `badge` field and `Badge()` in the badge scripts); C# ranges from the end
(`s[1..^1]` -> `slice(1, -1)`); `new DateTime(..., DateTimeKind.X)`; `Random.Shared.Next`;
LINQ over a dictionary (`[...map].every(...)`); `!string.Equals(a, b)` as `!(a === b)` (it wrote
`!a === b`) and `string.Equals(a, b, OrdinalIgnoreCase)` ignoring case; `x is A or B && y` as
`(x === A || x === B) && y`; `Func<T>?` as `(() => T) | null`; `Environment.TickCount64`;
`ItemCategory.X` as the game's category text; `char.ToUpper`; a handler's extra C# parameters
only when it reads them. And C#'s one-argument `Bot.Skills.StartAdvanced("1 | 4")` (the
skills overload; the class-name one has no default for `autoEquip`) is `startSkills("1 | 4", -1,
SkillUseMode.UseIfAvailable)`, with C#'s defaults written out: it was `startAdvanced`, which looks
up a class named "1 | 4". Re-running it changed 3 earlier drafts (`ArchfiendDragonEgg[Mem]`,
`CyseroItemUpgradeQuests`, `CelestialPirateCommander[PollyRogers]`); the same call was fixed by
hand in `DragonOfTime`, `UnlockForgeEnhancements`, `FireChampionsArmor` and `EliteVoid`.

C# bugs fixed on purpose (still in VibeSkua's Scripts, marked `C#` in the code):

- `CelestialStarMageSet`, `GrimDarkSet` and `SecurityPlushiesQuestReward` `return` from their
  reward loop at the first reward you own, so the rest were never farmed.
- `FlamesofLove` assigns the quest's reward items to a `string[]` (it doesn't compile); it uses
  their names.

Turu now accepts `%` in an options file name (the `1%Capes`-style storages of `OnePercentDrops`).

## Army

`army/CoreArmyLite.ts` is VibeSkua's `Army/CoreArmyLite.cs`, hand-ported onto Turu's several
accounts (Army > Accounts, tabs and processes; `docs/turu/STATUS.md`). Where C# reads files,
the engine's `bot.army` (`bot/src/api/army.rs`) stands in:

- C#'s army log (`ArmyLogging`, a file in Skua's options folder that every client appends to)
  is a shared log in the data folder: `bot.army.readLog` / `appendLog` / `writeLog` /
  `clearLog`. Tabs and the processes Army > Accounts launches share the data folder.
- `doForAll` (the one-client scripts that log in each account in turn) goes through the accounts
  of Army > Accounts (`bot.army.accounts()`) and logs in with `bot.army.login(username)`, which
  reads the password from the system keychain; scripts never see it (C# reads the passwords
  from Skua Manager's settings). An account without a saved password is skipped.
- `getRoomNr` is `bot.army.roomNumber()`: C#'s hash of the machine name, user name and hour,
  with the data folder in place of the machine name.
- `Bot.Map.TryGetPlayer` / `PlayerExists` are `bot.map.getPlayer(name)` / `playerExists(name)`
  (new: another player's `world.uoTree` entry, VibeSkua `PlayerInfo`).
- The aggro packet loops (C# `Task.Run`) are `bot.handlers` timers; `tryGoto`'s `out
  playerObject` is `gotoPlayer` after the call.
- Not ported: the Butler's communication files (C# writes `<me>~!<leader>.txt` so the leader's
  CoreBots writes its locked map, `ButlerOnMe`); `lockedMaps` searches the locked maps as C#
  does when that file is missing.
- `Players()` reads `player1` to `player20` with `configOr`: Turu's `bot.config.get` throws for
  an option the script doesn't declare (most declare fewer), C#'s returns null.

The Army scripts sync through the Ultras' CoreUltra (`WaitForArmy`, `CheckArmyProgressBool`,
`ClearSyncFile`, ...) and join through its CoreEngine. The Ultras aren't ported, so those members
are in `army/CoreArmySync.ts` (`CoreArmySync`, `CoreArmyEngine`): the sync files are `bot.army`
logs (C# guards updates with a machine-wide mutex; each member rewrites its line on every
check, so a lost update comes back), and `CoreEngine.Join` joins a room that every client of
the machine picks (`bot.army.machineRoomNumber()`, C#'s `GenerateRoomID` hashes the machine
GUID). `CoreEngine.Boot` starts the class's saved rotation instead of the engine's own skill loop.

Ported (cs2ts, then by hand): `CoreArmyLite`, `ArmySpiritOrbs`, `ArmyLR`, `TouchMass`,
`ArmyLeveling`, `ArmyLichWarGoldXp[Mem]`, `ArmyPrismatas`, `ArmySevenCirclesWar`, `ArmyWarMap`,
the one-client scripts (`AccsForAll`, `AllBankAllItems`, `AllDailies`, `AllRankAllClasses`,
`EldersBlood`, `WheelOfDoom`, `TagAllAccounts`; C# disables them all in `ScriptMain`, and so do
the ports) and `seasonal/frostvale/CheckForDonatedACs` (its two log files are `bot.army` logs).
`TagAllAccounts` logs a skip for C#'s `AutoAddTags` (scripts can't edit Army > Accounts).

Logged skips (they run on the Ultras' engine): `ArmyFarmVoidAuras` (Ultrasv3's CoreEnginev3,
UltraGeneral, UltraEnhancements and ArmyGeneral), `Dailies/TheEncroachingShadows` and
`Dailies/WrongTurnatVoidbuquerque` (CoreEngine's boss fights, CoreUltra's potions and charge
listener). Not ported: `Template` and `OneClient/OneClientTemplate` (templates),
`OneClient/GenerateQueuedOneClientScript` (writes a script with file dialogs).

C# bugs fixed on purpose (still in VibeSkua's Scripts, marked `C#` in the code):

- `CoreArmyLite.AggroMonStart` sends the aggro packet only while the player is in `_cell`, which
  is null when no cell is given (`SmartAggroMonStart`), so it never sent it; it compares with the
  cell it jumped to (`_cell ?? "Enter"`).
- `CoreArmyLite.PartyManagement` stops when a member leaves only `if (stopping)`, which is never
  true; it checks `!stopping`.

## Tools

Ported: `BankAllClasses`, `BankAllItems` (earlier), `RankUpAllClasses`, `RankUpEquippedClass`,
`BuyOut`, `CheckArmyRoles`, `EvaluateAccount`, `ChooseBestGear(Generic)`,
`ChooseBestGear(Racial)`, `AutoZoneandAttack`, `YandereStalker`, `InsertNameHeresUltraPrep`,
`NooneAskeforThese/BuyAllGoldVouchers`, `TreasureChestSpam`, `WheelOfDoomSpam`. All but
`YandereStalker` and `BuyAllGoldVouchers` were fixed by hand. Differences from C#:
`TreasureChestSpam` and `WheelOfDoomSpam` ask for the amount in an `Amount` option and open the
Script Options window there (C# uses Skua's text-input dialog, which Turu doesn't have);
`AutoZoneandAttack`'s `Task.Run` moves are `bot.handlers` timers. The `ChooseBestGear` tools
never equip the boost they're given, as in C# (they check the CBO and enhance the class).

Skipped, and why:

| Tool | Why |
|---|---|
| `Butlerv3`, `Butlerv4/Butlerv4` | Old Butler versions; Turu has Butler built in (Plugins > Butler). v4 also talks to a leader plugin over TCP. |
| `Butlerv4/DownloadDLL` | Downloads a plugin DLL into Skua's folder (HTTP, files). |
| `ForDevelopers/*` (`CaseStorage`, `GenerateQuestFilesv4`, `GeneratorHelpers/*`, `MergeTemplateHelperV2`, `ScriptMainCleaner`, `ShopAcheivmentandIOGrabber`, `SummarizeStatistics`, `UpdateTags`, `WeeklyReleaseGeneratorV2`, `WeeklyReleaseGeneratorV3`) | Developer and generator tools: they write scripts and data files or read the scripts folder. |
| `GenerateQueuedScript` | A generator: writes a script file, with file dialogs. |
| `BestGearAttemptX` | A developer test of CoreBots' `EquipBestItemsForMeta`. |
| `FindBestPing` | Pings the servers with System.Net, which scripts don't have. |
| `KPHandItemCounter` | Writes its counts to log files and opens them (file I/O, `Process.Start`). |
| `MemoryLeakAudit/MemoryLeakAudit` | A developer diagnostic reading Skua's files. |
| `NooneAskeforThese/PickAScript4Me`, `PickFiveMergeShopsforme` | Pick from the files of Skua's scripts folder. |

C# bugs fixed on purpose (marked `C#` in the code):

- `EvaluateAccount` maps May to month 4 and April to 5, so the account age was a month off for
  accounts made in either.
- `WheelOfDoomSpam` logs the Treasure Potions it earned as `before - after` (negative).

cs2ts now also: writes `Bot.Map.TryGetPlayer(name, out p)` as `(p = bot.map.getPlayer(name)) !=
null` and `Core.CBOBool(key, out bool x)` as `Core.cboBool(key) !== null`, declaring the `out`
variable before the statement; binds a method used as a value (`["Lacerate",
Forge.Lacerate]`, C#'s method groups: an unbound TS method loses `this`; event `+=`/`-=` keep the
same reference); fixes `x is not null and "json"` (it wrote `!(x == null && x === "json")`,
always true; `story/Friendship` had it); builds `Option<T>` fields declared with `new(...)`;
`new { Map = "a" }`; `Split(new[] { ',' }, RemoveEmptyEntries)`; `Convert.ToString` of a packet
(its JSON); `Math.Ceiling`; Skua's `CurrentClass.Name` (Turu's `currentClass` is the name).
Re-running it changed 3 earlier drafts (`0AllClasses`, `SinoftheUndying(NoInsignia)`,
`story/Friendship`).

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
