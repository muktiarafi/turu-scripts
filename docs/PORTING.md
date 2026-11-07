# Porting notes

How the C# scripts ([auqw/Scripts](https://github.com/auqw/Scripts)) are ported to TypeScript, and
what each ported area leaves out, changes or fixes. Start with the [README](../README.md); this is
the reference for porting more and for checking why a port differs from its C# file.

Every area below is ported in full unless it says otherwise. Each file type-checks and loads in
Turu (its tests import every script), but most have not run in game yet. A file whose first line
is `// Converted by tools/cs2ts, not yet read through by hand` is a draft nobody has reviewed;
the others were fixed by hand. Deliberate C# bug fixes are marked `C#` in the code.

## Contents

- [Conventions](#conventions): [calls and options](#calls-and-options), [enhancing](#enhancing), [merge scripts](#merge-script-pattern), [background tasks](#background-tasks)
- [Core libraries and reference ports](#core-libraries-and-reference-ports)
- [cs2ts](#cs2ts), the C# to TypeScript converter
- Areas: [Merge scripts](#merge-scripts), [Story scripts](#story-scripts), [Core content areas](#core-content-areas), [Seasonal](#seasonal), [Other](#other), [Army](#army), [Tools](#tools), [FarmerJoe](#farmerjoe), [Ultras](#ultras)

## Conventions

Folders follow the C# repository (`Nation/Materials/0MaxBags.cs` -> `nation/materials/0MaxBags.ts`).
Core files only contain what ported scripts reach; port more members from the C# files as
needed, in the same order and with the same names in camelCase.

### Calls and options

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

### Enhancing

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

### Merge script pattern

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

### Background tasks

C#'s `Task.Run`, `new Thread` and `async`/`await Task.Delay` become tasks of
`core/CoreTasks.ts`. A task is a generator function that a `bot.handlers` timer steps between
the script's bot calls and during `bot.sleep`. VibeSkua sends every Flash call to the UI thread
one at a time, so a C# task never reached the game in parallel; what it bought was not waiting,
and a `yield` gives that:

```ts
_ = Task.Run(async () => { ... }, cts.Token)   ->  tasks.start("name", function* () { ... })
await Task.Delay(ms) / Bot.Sleep(ms) in a task ->  yield ms
Bot.Wait.ForTrue(() => c, n) in a task         ->  const ok = yield until(() => c, n)
cts.Cancel()                                   ->  tasks.cancel("name")   // runs `finally` blocks
task is { IsCompleted: false }                 ->  tasks.running("name")
async Task FooAsync() / void Loop() on a Thread->  *fooAsync(): Generator<TaskStep, void, boolean>
new CancellationTokenSource() / ManualResetEvent -> the same names in core/CoreTasks.ts
```

Inside a task, wait with `yield`: a `bot.sleep` or `bot.wait.*` there blocks the whole script
(handlers never run inside a handler). A one-off call from a packet listener (`_ = Task.Run(() =>
Bot.Player.WalkTo(x, y))`) needs no task: listeners already run on the script thread, so call it
directly. A fire-and-forget `async Task` whose start guards matter (Ultra Speaker's taunts) keeps
the guard in a plain method that then starts the task. Earlier ports turned one-shot walks into
`bot.handlers.once` (DarkCarnax, MoreSkullsBoss, CoreArchMage, WorldBoss[Template],
AutoZoneandAttack); they stay as they are.

## Core libraries and reference ports

What the main libraries cover and what they don't yet, plus the hand ports other scripts copy.

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
| `other/mergeshops/SynderesMerge.ts` | Port of `Other/MergeShops/SynderesMerge.cs`: the pattern for every merge script (see [Merge script pattern](#merge-script-pattern)). |
| `other/various/Potions.ts` | Port of `Other/Various/Potions.cs`. Its options are declared in `scriptOptions` and edited in Scripts > Edit Script Options. |
| `other/farmjoekits/0FarmerJoeDoAll.ts` | Port of `Other/FarmJoeKits/0FarmerJoeDoAll.cs`: the level 1 to 100 progression. `CoreFarmerJoe.ts` next to it holds the steps and the options; the rest of its tree is listed under [FarmerJoe](#farmerjoe). |

## cs2ts

`tools/cs2ts` turns a C# script into a first draft of its port, following the [conventions](#conventions) above.
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

### What it learned, batch by batch

Fixes made while porting each area; re-running cs2ts applies them to every draft.

- **Story scripts:** Writes C#'s `000` as `0` (a leading zero is an octal literal in TS; the `ShadowsofDoom[Oct 13th]` placeholder scripts have them), and `EnsureLoad` with an array or several IDs as `Core.ensureLoadMany(...)`.
- **Core content areas:** Keeps a library's (Core file's) `OptionsStorage`, `Options` and `DontPreconfigure` as class fields; reads `Bot.Config!.Get<NumericEnum>` as `configEnum` (it missed the `!` before); writes a numeric enum's `ToString()` and interpolation as its name (`E[x]`), and a nested enum of another script (`InTheFiendsShadow.Rewards`) as an aliased import, also in types, `typeof` and option defaults; takes whether a ported enum is numeric from its port; turns `new Action(...)` into the lambda, `Array.IndexOf` / `Find` / `FindAll`, `DistinctBy`, `HashSet.UnionWith`, `Enum.GetName`, nullable `HasValue` / `Value`, `QuestRequirements<int>` / `<string>`, Skua's `ItemGroup` / `Wearing` (`equipSlot` / `equipped`), and a local function used as an event handler (it takes the event's data object); types a `Dictionary` of tuples; keeps a `)` after a trailing `// comment` in `AddRange`; aliases start with a letter (`2FiendsPurgatory`); drops imports it asked for and didn't emit. Re-running it over the earlier drafts changed three: `farm/BuyScrolls` reads its scroll with `configEnum` (it passed the option's name as the quest), and `story/Friendship` and `other/mergeshops/FishingGearMerge` type their packet handlers.
- **Seasonal:** Writes `List.Remove(x)` as a statement as `if (list.includes(x)) list.splice(...)` (`splice(indexOf(x), 1)` removed the last item when `x` wasn't there).
- **Other:** Writes a field whose camelCase name is a method's with a suffix (`badge` -> `badgeName`, C#'s `badge` field and `Badge()` in the badge scripts); C# ranges from the end (`s[1..^1]` -> `slice(1, -1)`); `new DateTime(..., DateTimeKind.X)`; `Random.Shared.Next`; LINQ over a dictionary (`[...map].every(...)`); `!string.Equals(a, b)` as `!(a === b)` (it wrote `!a === b`) and `string.Equals(a, b, OrdinalIgnoreCase)` ignoring case; `x is A or B && y` as `(x === A || x === B) && y`; `Func<T>?` as `(() => T) | null`; `Environment.TickCount64`; `ItemCategory.X` as the game's category text; `char.ToUpper`; a handler's extra C# parameters only when it reads them. And C#'s one-argument `Bot.Skills.StartAdvanced("1 | 4")` (the skills overload; the class-name one has no default for `autoEquip`) is `startSkills("1 | 4", -1, SkillUseMode.UseIfAvailable)`, with C#'s defaults written out: it was `startAdvanced`, which looks up a class named "1 | 4". Re-running it changed 3 earlier drafts (`ArchfiendDragonEgg[Mem]`, `CyseroItemUpgradeQuests`, `CelestialPirateCommander[PollyRogers]`); the same call was fixed by hand in `DragonOfTime`, `UnlockForgeEnhancements`, `FireChampionsArmor` and `EliteVoid`.
- **Tools:** Writes `Bot.Map.TryGetPlayer(name, out p)` as `(p = bot.map.getPlayer(name)) != null` and `Core.CBOBool(key, out bool x)` as `Core.cboBool(key) !== null`, declaring the `out` variable before the statement; binds a method used as a value (`["Lacerate", Forge.Lacerate]`, C#'s method groups: an unbound TS method loses `this`; event `+=`/`-=` keep the same reference); fixes `x is not null and "json"` (it wrote `!(x == null && x === "json")`, always true; `story/Friendship` had it); builds `Option<T>` fields declared with `new(...)`; `new { Map = "a" }`; `Split(new[] { ',' }, RemoveEmptyEntries)`; `Convert.ToString` of a packet (its JSON); `Math.Ceiling`; Skua's `CurrentClass.Name` (Turu's `currentClass` is the name). Re-running it changed 3 earlier drafts (`0AllClasses`, `SinoftheUndying(NoInsignia)`, `story/Friendship`).

## Areas

### Merge scripts

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

`LothianTreasuryMerge` fights Queen Iona for its four ingredients with
`ultrasv3/dependenciesmerge/QueenIona` (the Entwined Eclipse engine; see [Ultras](#ultras)).

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

### Story scripts

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

### Core content areas

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

### Seasonal

Every script in the C# `Seasonal/` folder is ported (`Frostvale/CheckForDonatedACs`, which uses
CoreArmyLite, came with the Army scripts). The 235 left after the earlier batches were converted with
cs2ts; they include nothing outside `Seasonal/` that wasn't ported. They type-check and load, but
none has run in game. These 9 were fixed by hand; the rest are drafts with the cs2ts line:
`18thBirthdayHeroBadge`, `NoEgretsBadge`, `NusantaraBossesBadge` (C#'s `badge` field and `Badge()`
method share a name in TS: the field is `badgeName`), `TrobbolierPet[mem]` (`StringBuilder`),
`TreasuresOfAotearoa`, `HeadlessHorsemanGear`, `TwillyTreasurePile`, `Mockingbird`,
`VanquishTheBetrayers`. CoreBots gained `playerAFK` (`GoldenTicket` listens to `playerAFK` with it).

C# bugs fixed on purpose (still in VibeSkua's Scripts, marked `C#` in the code):

- `HeadlessHorsemanGear` jumps to an earlier quest's steps with `goto case`, which runs them with
  the later quest's ID and then breaks: it accepts and turns in the wrong quest and never does the
  later one. The earlier quest is done first with its own ID now, then the later one.
- `Mockingbird` and `VanquishTheBetrayers` `return` from their reward loop at the first reward you
  own, so the rest were never farmed.
- `TwillyTreasurePile` declares its kill counter inside the loop, so it never banks every 5 kills.

### Other

Every script in the C# `Other/` folder is ported. The 187 left after the earlier batches were
converted with cs2ts, with `prototypes/InfernalArenaLW` (VerusDoomKnight includes it). Nothing
else outside the Ultras folders, `Army/` and `Tools/` was left but `Core/TaskExtensions.cs`, which
no script includes and only wraps `Task.Run` (scripts are single-threaded). `0AllClasses`, `Lich`,
`SovereignOfStorms` and `VerusDoomKnight` include Ultras files only for what their included
scripts reach (`LothianTreasuryMerge`'s Queen Iona, see [Ultras](#ultras)). They type-check and
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

C# bugs fixed on purpose (still in VibeSkua's Scripts, marked `C#` in the code):

- `CelestialStarMageSet`, `GrimDarkSet` and `SecurityPlushiesQuestReward` `return` from their
  reward loop at the first reward you own, so the rest were never farmed.
- `FlamesofLove` assigns the quest's reward items to a `string[]` (it doesn't compile); it uses
  their names.

Turu now accepts `%` in an options file name (the `1%Capes`-style storages of `OnePercentDrops`).

### Army

`army/CoreArmyLite.ts` is VibeSkua's `Army/CoreArmyLite.cs`, hand-ported onto Turu's several
accounts (Army > Accounts, tabs and processes; [Turu's STATUS.md](https://github.com/muktiarafi/turu/blob/main/docs/STATUS.md)). Where C# reads files,
the engine's `bot.army` (`bot/src/api/army.rs`) stands in:

- C#'s army log (`ArmyLogging`, a file in Skua's options folder that every client appends to)
  is a shared log in the data folder: `bot.army.readLog` / `appendLog` / `writeLog` /
  `clearLog`. Tabs and the processes Army > Accounts launches share the data folder. Each
  operation holds the log's lock; `bot.army.withLock(name, fn)` holds it across a read, change
  and write (C#'s machine-wide mutex).
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
`ClearSyncFile`, ...) and join through its CoreEngine. Those members are in `army/CoreArmySync.ts`
(the Ultras' `CoreUltrav3` extends it, see [Ultras](#ultras)) (`CoreArmySync`, `CoreArmyEngine`): the sync files are `bot.army`
logs (C#'s machine-wide mutex around `UpdateEntry` is `bot.army.withLock`). `WaitForArmy`, and
`UltraWaitForArmy`'s `WaitForArmySkills` and `NewWaitForArmy`, are `bot.army.barrier`: C# polls
ready lines and the first member through clears the file (`NewWaitForArmy` also clears it on
arrival), which can strand a member that looks late or wipe out the ones already waiting; the
barrier counts rounds instead. Their `tickMs` and stale-age arguments are ignored. `CoreEngine.Join` joins a room that every client of
the machine picks (`bot.army.machineRoomNumber()`, C#'s `GenerateRoomID` hashes the machine
GUID). `CoreEngine.Boot` starts the class's saved rotation instead of the engine's own skill loop.

Ported (cs2ts, then by hand): `CoreArmyLite`, `ArmySpiritOrbs`, `ArmyLR`, `TouchMass`,
`ArmyLeveling`, `ArmyLichWarGoldXp[Mem]`, `ArmyPrismatas`, `ArmySevenCirclesWar`, `ArmyWarMap`,
the one-client scripts (`AccsForAll`, `AllBankAllItems`, `AllDailies`, `AllRankAllClasses`,
`EldersBlood`, `WheelOfDoom`, `TagAllAccounts`; C# disables them all in `ScriptMain`, and so do
the ports) and `seasonal/frostvale/CheckForDonatedACs` (its two log files are `bot.army` logs).
`TagAllAccounts` logs a skip for C#'s `AutoAddTags` (scripts can't edit Army > Accounts).

On the Ultras' engines (cs2ts drafts, fixed until they type-check): `ArmyFarmVoidAuras`
(Ultrasv3's CoreEnginev3, UltraGeneral, UltraEnhancements and ArmyGeneral),
`Dailies/TheEncroachingShadows` and `Dailies/WrongTurnatVoidbuquerque` (the Entwined Eclipse
CoreEngine and CoreUltra). Not ported: `Template` and `OneClient/OneClientTemplate` (templates),
`OneClient/GenerateQueuedOneClientScript` (writes a script with file dialogs).

C# bugs fixed on purpose (still in VibeSkua's Scripts, marked `C#` in the code):

- `CoreArmyLite.AggroMonStart` sends the aggro packet only while the player is in `_cell`, which
  is null when no cell is given (`SmartAggroMonStart`), so it never sent it; it compares with the
  cell it jumped to (`_cell ?? "Enter"`).
- `CoreArmyLite.PartyManagement` stops when a member leaves only `if (stopping)`, which is never
  true; it checks `!stopping`.

### Tools

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

### FarmerJoe

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

### Ultras

The Ultras are ported from the latest set, `Ultrasv3` (the `Ultras/` and `Ultrasv2/` folders are
older versions of the same fights and stay unported). Ported: all of `DependenciesUltras`
(`CoreEnginev3`, `CoreUltrav3`, `UltraGeneral`, `UltraPotions`, `UltraEnhancements`, `GetPotions`
by hand; `UltraAsync`, `UltraDeath`, `UltraQueue`, `UltraWaitForArmy`, `UltraCustomClassSync`,
`UltraCounterAttack`, `UltraPulse`, `GetScrolls`, `PrerequisitesChecker` from cs2ts drafts read
through by hand), `ArmyDependencies/ArmyGeneral`, and, drafted by cs2ts and fixed until they
type-check (their first line says so): the 11 `IndividualUltras`, the `ChallengeBosses` (with
`DeveloperTools`), `DependenciesDailies`, `DoAllUltras`, `DoAllUltrasStorys`,
`DoUltrasDoDailiesDoChallengeBosses`, `FarmGold/ArmyPrismatasv3`, `Weapons/EmpoweredNationItem`
and `TestUltrasOrBossesScripts/Masakadov3`. `NightmareCarnaxv3` was read through by hand.

`Entwined Eclipse` runs on its own, older copies of the engine:
- `CoreEngine.ts` is built from the CoreEnginev3 port with what differs in C#: no singleton,
  Boot starts the drop loop, the stopping handler cancels the skill task, the potion and
  consumable helpers pause the skill task (`UsePotion` presses skill 5 itself), `Cast` only takes
  skills 1-4, `DisableSkills` only cancels the task, `ChooseBestCell` returns nothing, the
  weapon-trait table is renumbered (7 Ravenous ... 99 Forge), the skill task runs every 50 ms, and
  the rotations (taken from the cs2ts draft) are the older ones. `auraRemainingTime` is Skua's
  `Aura.RemainingTime`.
- `CoreUltra.ts` extends the CoreUltrav3 port (whose engine is now an overridable `engine`) with its
  own CoreEngine and its older scroll and taunt helpers; one C# bug fixed on purpose
  (`GetScrollOfDecay` looped while you *had* 10 scrolls).
- The boss scripts (`Masakado`, `MidnightSun`, `SolsticeMoon`, `AscensionoftheEclipse`,
  `0GreatbladeOfTheEntwinedEclipse`, `VictorMatsuriStory`) and `DependenciesMerge/QueenIona` are cs2ts
  drafts fixed until they type-check. Their sync files are `bot.army` logs, each read, change
  and write under the log's lock (`updateSyncLines`), their
  `Bot.Flash.FlashCall` listeners listen to `extensionPacket`, and each script's `ScriptMain` is a
  `scriptMain()` method so the Greatblade can run it. C#'s `TauntCurrentTarget(enrageMessage,
  maxAttempts)` overload is `tauntCurrentTargetForMessage`; `ref` parameters return their value.
  Masakado's quest item uses its name (C# passes `ItemBase.ToString()`).

`TestZone` runs on the old `Ultras/CoreEngine` and stays unported.

What differs from C#:
- `CoreEnginev3`'s skill loop is the `UltraSkills` task, stepped every 100 ms like C#'s
  `skillsDelay`. A rotation that waits (Chrono ShadowSlayer's `Wait.ForTrue`, the 100 ms sleeps)
  pauses the whole script for that long, where C# paused only its skill thread. While the script
  is inside one long engine wait (`bot.wait.forMapLoad`, ...) the skills wait too
  ([Turu's STATUS.md](https://github.com/muktiarafi/turu/blob/main/docs/STATUS.md), "Handlers wait during one engine wait"). The taunt loops
  (`UltraAsync.startTauntLoop`) press every 50 ms with `yield 50`, so during the fight loop's
  `bot.sleep` they press at the handler rate instead of C#'s spin-waited 50 ms.
- `UltraDeath`'s wipe monitor runs `onWipe` (the retreat) inside its task step, holding the
  script meanwhile; C#'s main loop is waiting on `retreatComplete` then anyway.
- The scripts' `Core` (CoreEnginev3) is `Engine`, as `Core` is CoreBots (C#'s `C`); cs2ts now
  does this itself. cs2ts also learned `DateTimeOffset`, LINQ `Append`/`Prepend`, and two fixes
  that apply to every draft: `x is not null && y` (tree-sitter reads it as `x is not (null && y)`;
  one earlier port, FishingGearMerge, had it wrong) and `a.Equals(b ?? "", IgnoreCase)`.
- The FBS plugin mute file (`fbs_mute.sync`, VibeSkua only) isn't written; cs2ts leaves out the
  statements that only touch it.
- `Bot.Flash.FlashCall`'s "pext"/"packetFromServer" listeners (Kathool, Ultra Speaker, Entwined Eclipse) listen to
  `extensionPacket` and read `params.dataObj` (C#'s `b.o`).
- C# overloads are merged: `Engine.killQuest(id, map, monster, cell?, pad?)` or with a
  `KillQuestOptions` object; `owned(key, isTemp)` counts and `ownedAtLeast(key, n)` checks (C#'s
  `bool Owned`); `buyItem(key, shop, map, quantity, { calculateRemaining, ... })`;
  `killWithPriority(...keys)` plus `killWithPriorityNames`/`Ids`/`AtMapId`; `useTaunt(target?)`.
  The wipe helpers' `ref` arguments are the fields of a state object.
- A sync file is `bot.army`'s shared log, so a file's write time is its newest line's time
  (`syncFileAgeMinutes`), and `UltraAsync`'s fight start is stored as Unix milliseconds.
- Quest class and faction requirements (`IsAvailable`) are read from `world.questTree`
  (`iClass`, `iReqCP`, `FactionID`, `iReqRep`); `turu.ts`'s `Quest` doesn't carry them.
- NightmareCarnax doesn't write `fbs_mute.sync`. `EquipClassSync` clears a sync log with no line
  newer than 15 minutes. `GetPotions` reads its options with `configOr`, as UltraPotions calls it
  from scripts that don't declare them.
- New API for them: `bot.player.stats` (VibeSkua `Player.Stats`) and `bot.lite.hidePlayers`.
- C# bug fixed: `CoreEnginev3.ChooseBestCell`'s monster-name filter (an earlier draft's
  precedence slip matched every monster). `KillWithPriority` skips a null key (C# would throw).

None of it has run in game. `bot/tests/core_tasks.rs` tests the tasks, the cancellation token and
reset event against a fake game, and checks that every ported Ultrasv3 script's module tree loads.
