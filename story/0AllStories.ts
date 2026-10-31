/*
name: Complete All Stories
description: This will complete all stories.
tags: story, quest, complete, all
*/
// Port of Scripts/Story/0AllStories.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";
import { CoreFriday13th } from "../seasonal/friday13th/story/CoreFriday13th";
import { Core7DD } from "./7deadlydragons/Core7DD";
import { HatchTheEgg } from "./7deadlydragons/extra/HatchTheEgg";
import { Adam1a1Quest } from "./Adam1a1Quests";
import { CoreAOR } from "./ageofruin/CoreAOR";
import { AranxQuests } from "./AranxQuests";
import { Arcangrove } from "./Arcangrove";
import { AriaGreenhouse } from "./AriaGreenhouse";
import { AriaPet } from "./AriaPet[MEM]";
import { Artixpointe } from "./Artixpointe";
import { ArtixWedding } from "./ArtixWedding";
import { Asylum } from "./Asylum";
import { Banished } from "./Banished";
import { BaseCamp } from "./BaseCamp";
import { BattleUnder } from "./BattleUnder";
import { BeleensDream } from "./BeleensDream";
import { BloodMoon } from "./BloodMoon";
import { Bludrut } from "./Bludrut";
import { BoneBreak } from "./BoneBreak";
import { Borgars } from "./Borgars";
import { BrightCrystalStory } from "./BrightCrystalStory";
import { CastleOfGlass } from "./CastleOfGlass";
import { CastleTunnels } from "./CastleTunnels";
import { Cleric } from "./Cleric";
import { Concert } from "./Concert[MEM]";
import { Cornelis } from "./Cornelis[mem]";
import { CrashSite } from "./CrashSite";
import { CruxShip } from "./CruxShip";
import { DarkDungeon } from "./DarkDungeon";
import { DeathsRealm } from "./DeathsRealm";
import { DjinnGateStory } from "./DjinnGate";
import { DjinnGuard } from "./DjinnGuard";
import { DoomVaultA } from "./DoomVault";
import { DoomVaultB } from "./DoomVaultB";
import { CoreDoomwood } from "./doomwood/CoreDoomwood";
import { Downward } from "./Downward";
import { DracoCon } from "./DracoCon";
import { DragonFableOrigins } from "./DragonFableOrigins";
import { DragonRoad } from "./DragonRoad[Upholder]";
import { CoreDOY } from "./dragonsofyokai/CoreDOY";
import { DreamPalace } from "./DreamPalace";
import { Dwarfhold } from "./Dwarfhold";
import { DwarvesVsGiants } from "./DwarvesVsGiants";
import { Eden } from "./Eden";
import { CoreAstravia } from "./elegyofmadness(darkon)/CoreAstravia";
import { EtherStormWastes } from "./EtherstormWastes";
import { ExaltiaTower } from "./ExaltiaTower";
import { Extinction } from "./Extinction";
import { FableForest } from "./FableForest";
import { CoreFireIsland } from "./fireisland/CoreFireisland";
import { Friendship } from "./Friendship";
import { FrozenNorthlands } from "./FrozenNorthlands";
import { Gamehaven } from "./GameHaven";
import { GiantTaleStory } from "./GiantTaleStory";
import { GlaceraStory } from "./Glacera";
import { Guru } from "./Guru";
import { CoreHollowbornStory } from "./hollowborn/CoreHollowbornStory";
import { HuntersMoon } from "./HuntersMoon";
import { IcePlane } from "./IcePlane";
import { CoreIsleOfFotia } from "./isleoffotia/CoreIsleOfFotia";
import { J6Saga } from "./J6Saga";
import { LaeWedding } from "./LaeWedding";
import { Lair } from "./Lair";
import { AtlasFalls } from "./legion/AtlasFalls";
import { AtlasKingdom } from "./legion/AtlasKingdom";
import { AtlasPromenade } from "./legion/AtlasPromenade";
import { DageChallengeStory } from "./legion/DageChallengeStory";
import { CoreDageTheEvilIsland } from "./legion/dagetheevilisland/CoreDageTheEvilIsland";
import { DarkWarLegionandNation } from "./legion/DarkWarLegionandNation";
import { Ravenscar } from "./legion/Ravenscar";
import { SeraphicWar_Story } from "./legion/SeraphicWar";
import { SevenCircles } from "./legion/SevenCircles(War)";
import { WorldSoul } from "./legion/WorldSoul";
import { Lightguard } from "./Lightguard[MEM]";
import { LightoviaCave } from "./LightoviaCave";
import { DeadlyDungeon } from "./lordsofchaos/choasfinalebonus[mem]/DeadlyDungeon[Mem]";
import { KillerCatacombs } from "./lordsofchaos/choasfinalebonus[mem]/KillerCatacombs[Mem]";
import { PyramidofPain } from "./lordsofchaos/choasfinalebonus[mem]/PyramidofPain[Mem]";
import { Core13LoC } from "./lordsofchaos/Core13LoC";
import { LostVilla } from "./LostVilla";
import { CoreLynaria } from "./lynaria/CoreLynaria";
import { Manor } from "./Manor";
import { Marsh2 } from "./Marsh2[MEM]";
import { Mazumi } from "./Mazumi";
import { Mobius } from "./Mobius";
import { MustyCave } from "./MustyCave";
import { Bamboozle } from "./nation/Bamboozle";
import { CitadelRuins } from "./nation/CitadelRuins";
import { DeleuzeTundraStory } from "./nation/DeleuzeTundra";
import { FiendPast } from "./nation/FiendPast";
import { Fiendshard_Story } from "./nation/Fiendshard";
import { FiendVoid } from "./nation/FiendVoid";
import { OblivionTundra } from "./nation/OblivionTundra";
import { Originul_Story } from "./nation/Originul";
import { ShadowBlastArena } from "./nation/ShadowBlastArena";
import { TercesArchive } from "./nation/tercesarchive";
import { TercesInvasion } from "./nation/TercesInvasion";
import { Tercessuinotlim } from "./nation/Tercessuinotlim";
import { VoidChasm } from "./nation/VoidChasm";
import { VoidRefuge } from "./nation/VoidRefuge";
import { NecroProject } from "./NecroProject";
import { Noobshire } from "./Noobshire";
import { Nukemichi } from "./Nukemichi[mem]";
import { NytheraSaga } from "./NytheraSaga";
import { CoreOasis } from "./oasis/CoreOasis";
import { Pirates } from "./Pirates[Member]";
import { PoisonForest } from "./PoisonForest";
import { CoreQOM } from "./queenofmonsters/CoreQoM";
import { BrightOak } from "./queenofmonsters/extra/BrightOak";
import { CelestialArenaQuests } from "./queenofmonsters/extra/CelestialArena";
import { CelestialPast } from "./queenofmonsters/extra/CelestialPast";
import { GoldenArena } from "./queenofmonsters/extra/GoldenArena";
import { InfernalDianoia } from "./queenofmonsters/extra/InfernalDianoia";
import { InfernalParadise } from "./queenofmonsters/extra/InfernalParadise";
import { LivingDungeon } from "./queenofmonsters/extra/LivingDungeon";
import { OrbHunt } from "./queenofmonsters/extra/OrbHunt";
import { QueenBattle } from "./queenofmonsters/extra/QueenBattle";
import { QueenReign } from "./QueenReign";
import { QuibbleHunt } from "./QuibbleHunt";
import { RavenlossSaga } from "./RavenlossSaga";
import { River } from "./River";
import { Safiria } from "./Safiria[Member]";
import { CoreSepulchure } from "./sepulchuresaga/CoreSepulchure";
import { ShadowGates } from "./ShadowGates";
import { ShadowSlayerK } from "./ShadowSlayerK";
import { CoreSoC } from "./shadowsofchaos/CoreSoC";
import { CoreSoW } from "./shadowsofwar/CoreSoW";
import { ShadowVault } from "./ShadowVault";
import { ShadowVoid } from "./ShadowVoid";
import { Shattersword } from "./Shattersword";
import { Shinkansen } from "./Shinkansen";
import { ShipWreck } from "./ShipWreck";
import { SkyGuardSaga } from "./SkyGuardSaga";
import { SpirePast } from "./SpirePast";
import { StarSinc } from "./StarSinc";
import { CoreSummer } from "./summer2015adventuremap/CoreSummer";
import { CoreSunSet } from "./sunsetsaga/CoreSunSet";
import { SuperDeath } from "./SuperDeath";
import { ThirdSpell } from "./ThirdSpell";
import { CoreToD } from "./throneofdarkness/CoreToD";
import { TitanAttackStory } from "./TitanAttack";
import { Tournament } from "./Tournament";
import { Tower } from "./Tower[mem]";
import { TowerOfDoom } from "./TowerOfDoom";
import { Tutorial } from "./Tutorial";
import { Ubear } from "./Ubear";
import { UnderGroundLab } from "./UnderGroundLab";
import { LairWar } from "./VasalkarLairWar";
import { WatchTower } from "./WatchTower";
import { WillowCreek } from "./WillowCreek";
import { XansLair } from "./XansLair";
import { YokaiQuests } from "./Yokai";

const Adv = new CoreAdvanced();
const DD = new Core7DD();
const Egg = new HatchTheEgg();
const AOR = new CoreAOR();
const DW = new CoreDoomwood();
const DOY = new CoreDOY();
const CSS = new CoreSunSet();
const coreAstravia = new CoreAstravia();
const FI = new CoreFireIsland();
const HB = new CoreHollowbornStory();
const coreFriday13th = new CoreFriday13th();
const coreIsleOfFotia = new CoreIsleOfFotia();
const DageIsland = new CoreDageTheEvilIsland();
const atlasFalls = new AtlasFalls();
const atlasKingdom = new AtlasKingdom();
const atlasPromenade = new AtlasPromenade();
const dageChallengeStory = new DageChallengeStory();
const DarkWar = new DarkWarLegionandNation();
const ravenscar = new Ravenscar();
const seraphicWar_Story = new SeraphicWar_Story();
const sevenCircles = new SevenCircles();
const worldSoul = new WorldSoul();
const LOC = new Core13LoC();
const deadlyDungeon = new DeadlyDungeon();
const killerCatacombs = new KillerCatacombs();
const pyramidofPain = new PyramidofPain();
const Lynaria = new CoreLynaria();
const bamboozle = new Bamboozle();
const citadelRuins = new CitadelRuins();
const DeleuzeTundra = new DeleuzeTundraStory();
const fiendPast = new FiendPast();
const fiendshard_Story = new Fiendshard_Story();
const fiendVoid = new FiendVoid();
const oblivionTundra = new OblivionTundra();
const originul_Story = new Originul_Story();
const shadowBlastArena = new ShadowBlastArena();
const tercesarchive = new TercesArchive();
const tercesInvasion = new TercesInvasion();
const tercessuinotlim = new Tercessuinotlim();
const voidRefuge = new VoidRefuge();
const voidChasm = new VoidChasm();
const QOM = new CoreQOM();
const brightOak = new BrightOak();
const CelestialArena = new CelestialArenaQuests();
const celestialPast = new CelestialPast();
const goldenArena = new GoldenArena();
const infernalDianoia = new InfernalDianoia();
const infernalParadise = new InfernalParadise();
const livingDungeon = new LivingDungeon();
const orbHunt = new OrbHunt();
const queenBattle = new QueenBattle();
const CoreSS = new CoreSepulchure();
const coreSoC = new CoreSoC();
const SOW = new CoreSoW();
const coreSummer = new CoreSummer();
const TOD = new CoreToD();
const Adam1A1Quest = new Adam1a1Quest();
const aranxQuests = new AranxQuests();
const arcangrove = new Arcangrove();
const ariaGreenhouse = new AriaGreenhouse();
const ariaPet = new AriaPet();
const artixpointe = new Artixpointe();
const artixWedding = new ArtixWedding();
const asylum = new Asylum();
const banished = new Banished();
const baseCamp = new BaseCamp();
const battleUnder = new BattleUnder();
const beleensDream = new BeleensDream();
const bloodMoon = new BloodMoon();
const bludrut = new Bludrut();
const boneBreak = new BoneBreak();
const borgars = new Borgars();
const BrightCrystal = new BrightCrystalStory();
const castleOfGlass = new CastleOfGlass();
const castleTunnels = new CastleTunnels();
const cleric = new Cleric();
const concert = new Concert();
const cornelis = new Cornelis();
const crashSite = new CrashSite();
const cruxShip = new CruxShip();
const darkDungeon = new DarkDungeon();
const deathsRealm = new DeathsRealm();
const djinnGateStory = new DjinnGateStory();
const djinnGuard = new DjinnGuard();
const doomVaultA = new DoomVaultA();
const doomVaultB = new DoomVaultB();
const downward = new Downward();
const dracoCon = new DracoCon();
const dragonFableOrigins = new DragonFableOrigins();
const dragonRoad = new DragonRoad();
const dreamPalace = new DreamPalace();
const dwarfhold = new Dwarfhold();
const dwarvesVsGiants = new DwarvesVsGiants();
const eden = new Eden();
const etherStormWastes = new EtherStormWastes();
const exaltiaTower = new ExaltiaTower();
const extinction = new Extinction();
const fableForest = new FableForest();
const friendship = new Friendship();
const frozenNorthlands = new FrozenNorthlands();
const gamehaven = new Gamehaven();
const giantTaleStory = new GiantTaleStory();
const glaceraStory = new GlaceraStory();
const guru = new Guru();
const huntersMoon = new HuntersMoon();
const icePlane = new IcePlane();
const laeWedding = new LaeWedding();
const lair = new Lair();
const lightguard = new Lightguard();
const lightoviaCave = new LightoviaCave();
const lostVilla = new LostVilla();
const manor = new Manor();
const marsh2 = new Marsh2();
const mazumi = new Mazumi();
const mobius = new Mobius();
const mustyCave = new MustyCave();
const necroProject = new NecroProject();
const noobshire = new Noobshire();
const nukemichi = new Nukemichi();
const nytheraSaga = new NytheraSaga();
const j6Saga = new J6Saga();
const pirates = new Pirates();
const poisonForest = new PoisonForest();
const queenReign = new QueenReign();
const quibbleHunt = new QuibbleHunt();
const ravenlossSaga = new RavenlossSaga();
const river = new River();
const safiria = new Safiria();
const shadowGates = new ShadowGates();
const shadowSlayerK = new ShadowSlayerK();
const shadowVault = new ShadowVault();
const shadowVoid = new ShadowVoid();
const shattersword = new Shattersword();
const shinkansen = new Shinkansen();
const shipWreck = new ShipWreck();
const skyGuardSaga = new SkyGuardSaga();
const spirePast = new SpirePast();
const starSinc = new StarSinc();
const superDeath = new SuperDeath();
const thirdSpell = new ThirdSpell();
const titanAttackStory = new TitanAttackStory();
const tournament = new Tournament();
const tower = new Tower();
const towerOfDoom = new TowerOfDoom();
const tutorial = new Tutorial();
const ubear = new Ubear();
const underGroundLab = new UnderGroundLab();
const lairWar = new LairWar();
const watchTower = new WatchTower();
const COA = new CoreOasis();
const willowCreek = new WillowCreek();
const Xans = new XansLair();
const Yokai = new YokaiQuests();

export class AllStories {
    //#region Folder based
    // 7 Deadly Dragons

    // Age Of Ruin

    // Doomwood (all parts)

    // Dragons Of Yokai

    // Sunset Saga

    // Elergy of Madness - Darkon

    //Fire Island

    //Hollowborn

    //Friday 13th

    // Isle Of Fotia

    // Legion

    // 13 Lord of Chaos

    // Lynaria

    // Nation

    // Queen of Monsters

    // Sepulchure Saga

    // Shadows of Chaos

    // Shadow of War

    //Summer 2015 AdventureMap

    // Throne of Darkness

    //MemetsRealm

    //#endregion
    //#region Standalone (sorted alphabetically)

    //VasalkarLairWar.cs

    //#endregion

    completeAll(): void {
        tutorial.badges();
        Core.logger(`Story: Tutorial - Complete`);

        //#region In folders
        //#region 13LOC
        Adv.gearStore(undefined, { enhAfter: true });
        LOC.complete13LOC(true);
        Adv.gearStore(true, { enhAfter: true });
        Core.logger(`Saga: The 13 Lords of Chaos - Complete`);
        if (Core.isMember) {
            deadlyDungeon.deadlyDungeonQuest_Line();
            Core.logger(`Story: Deadly Dungeon - Complete`);

            killerCatacombs.killerCatacombs_Line();
            Core.logger(`Story: Killer Catacombs - Complete`);

            pyramidofPain.pyramidofPain_Line();
            Core.logger(`Story: Pyramid of Pain - Complete`);
        }
        Core.logger(`Saga: The 13 Lords of Chaos (Extra) - Complete`);
        //#endregion
        //#region 7DD
        DD.complete7DD();
        Core.logger(`Saga: 7 Deadly Dragons - Complete`);

        Egg.hatch();
        Core.logger(`Saga: 7 Deadly Dragons (Extra) - Complete`);
        //#endregion
        //#region AOR
        AOR.doAll();
        Core.logger(`Saga: Age Of Ruin - Complete`);
        //#endregion
        //#region Doomwood
        DW.completeDoomwood();
        Core.logger(`Saga: Doomwood - Complete`);
        //#endregion
        //#region DOY
        DOY.doAll();
        Core.logger(`Saga: Dragons Of Yokai - Complete`);
        //#endregion
        //#region Elergy
        coreAstravia.completeCoreAstravia();
        Core.logger(`Saga: Elergy of Madness - Complete`);
        //#endregion
        //#region CoreFireIsland
        FI.completeFireIsland();
        Core.logger(`Saga: Fireisland Maps - Complete`);
        //#endregion
        //#region Hollowborn
        HB.doAll();
        Core.logger(`Saga: Hollowborn - Complete`);
        //#endregion
        //#region CoreFriday13th
        coreFriday13th.completeFriday13th();
        Core.logger(`Saga: Friday 13th - Complete`);
        //#endregion
        //#region IsleOfFotia
        coreIsleOfFotia.completeALL();
        Core.logger(`Saga: Isle of Fotia - Complete`);
        //#endregion
        //#region Legion
        //#region CoreDageTheEvilIsland
        DageIsland.completeDageTheEvilIslandStory();
        Core.logger(`Saga: DageTheEvil island Maps - Complete`);
        //#endregion
        atlasFalls.storyline();
        Core.logger(`Story: Atlas Falls - Complete`);

        atlasKingdom.storyline();
        Core.logger(`Story: Atlas Kingdom - Complete`);

        atlasPromenade.storyline();
        Core.logger(`Story: Atlas Promenade - Complete`);

        dageChallengeStory.dageChallengeQuests();
        Core.logger(`Story: Dage Challenge - Complete`);

        DarkWar.darkWarLegion();
        DarkWar.darkWarNation();
        Core.logger(`Story: Dark War - Complete`);

        ravenscar.storyline();
        Core.logger(`Story: Ravenscar - Complete`);

        seraphicWar_Story.seraphicWar_Questline();
        Core.logger(`Story: Seraphic War - Complete`);

        sevenCircles.circlesWar();
        Core.logger(`Story: Seven Circles - Complete`);

        worldSoul.worldSoulQuests();
        Core.logger(`Story: World Soul - Complete`);
        //#endregion
        //#region Lynaria
        Lynaria.doAll();
        Core.logger(`Story: Lynaria - Complete`);
        //#endregion
        //#region Nation
        bamboozle.bamboozleQuest();
        Core.logger(`Story: Bamboozle - Complete`);

        citadelRuins.doAll();
        Core.logger(`Story: Citadel Ruins - Complete`);

        DeleuzeTundra.deleuzeTundra();
        Core.logger(`Story: Deleuze Tundra - Complete`);

        fiendshard_Story.fiendshard_QuestlineP1();
        Core.logger(`Story: Fiendshard - Complete`);

        fiendPast.doAll();
        Core.logger(`Story: Fiend Past - Complete`);

        fiendVoid.fiendVoid_Questline();
        Core.logger(`Story: Fiend Void - Complete`);

        oblivionTundra.storyline();
        Core.logger(`Story: Oblivion Tundra - Complete`);

        originul_Story.originul_Questline();
        Core.logger(`Story: Originul - Complete`);

        shadowBlastArena.doall();
        Core.logger(`Story: ShadowBlast Arena - Complete`);

        tercesarchive.storyLine();
        Core.logger(`Story: Terces Archive - Complete`);

        tercesInvasion.storyLine();
        Core.logger(`Story: Terces Invasion - Complete`);

        tercessuinotlim.jadziaQuests();
        Core.logger(`Story: Tercessuinotlim - Complete`);

        voidRefuge.storyline();
        Core.logger(`Story: Void Refuge - Complete`);

        voidChasm.storyline();
        Core.logger(`Story: Void Chasm - Complete`);
        //#endregion
        //#region QoM
        QOM.completeEverything();
        Core.logger(`Saga: Queen of Monsters - Complete`);

        brightOak.doall();
        Core.logger(`Story: BrightOak - Complete`);

        CelestialArena.arena1to10();
        CelestialArena.arena11to20();
        CelestialArena.arena21to29();
        Core.logger(`Story: Celestial Arena - Complete`);

        celestialPast.completeCeletialPast();
        Core.logger(`Story: Celestial Past - Complete`);

        goldenArena.storyLine();
        Core.logger(`Story: GoldenArena - Complete`);

        infernalDianoia.storyline();
        Core.logger(`Story: Infernal Dianoia - Complete`);

        infernalParadise.storyline();
        Core.logger(`Story: Infernal Paradise - Complete`);

        livingDungeon.livingDungeonStory();
        Core.logger(`Story: LivingDungeon - Complete`);

        orbHunt.orbHuntSaga();
        Core.logger(`Story: Orb Hunt - Complete`);

        queenBattle.storyLine();
        Core.logger(`Story: QueenBattle - Complete`);
        //#endregion
        //#region Sepulchure Saga
        CoreSS.completeSS();
        Core.logger(`Saga: Sepulchure - Complete`);
        //#endregion
        //#region Shadows Of Chaos
        coreSoC.completeCoreSoC();
        Core.logger(`Saga: Shadows of Chaos - Complete`);
        //#endregion
        //#region Shadow Of War
        SOW.completeCoreSoW();
        Core.logger(`Saga: Shadow of War [Part1&2] - Complete`);
        //#endregion
        //#region Summer 2015 AdventureMap
        coreSummer.doAll();
        Core.logger(`Saga: Summer 2015 AdventureMap - Complete`);
        //#endregion
        //#region ToD
        // Skip rep quests
        TOD.completeToD(false);
        Core.logger(`Saga: Throne of Darkness - Complete`);
        //#endregion
        //#endregion
        //#region Standalone
        Adam1A1Quest.storyline();
        Core.logger(`Story: Adam1a1 - Complete`);

        aranxQuests.storyLine();
        Core.logger(`Story: Aranx - Complete`);

        arcangrove.gravelynandVictoria();
        Core.logger(`Story: Arcangrove - Complete`);

        ariaGreenhouse.doAll();
        Core.logger(`Story: Aria Greenhouse - Complete`);

        if (Core.isMember) {
            ariaPet.storyLine();
            Core.logger(`Story: Aria Pet - Complete`);
        }

        artixpointe.omniArtifact();
        Core.logger(`Story: Artixpointe - Complete`);

        artixWedding.artixWeddingComplete();
        Core.logger(`Story: ArtixWedding - Complete`);

        asylum.storyLine();
        Core.logger(`Story: Asylum - Complete`);

        banished.doall();
        Core.logger(`Story: Banished - Complete`);

        baseCamp.storyLine();
        Core.logger(`Story: Base Camp - Complete`);

        battleUnder.battleUnderAll();
        Core.logger(`Story: BattleUnder - Complete`);

        beleensDream.storyLine();
        Core.logger(`Story: BeleensDream - Complete`);

        bloodMoon.bloodMoonSaga();
        Core.logger(`Story: Blood Moon - Complete`);

        bludrut.storyLine();
        Core.logger(`Story: Bludrut - Complete`);

        if (
            !Core.hasAchievement(30, "ip6") ||
            Core.isCompletedBefore(5981) ||
            !Core.checkInventory(27222) ||
            !Core.isMember
        ) {
            boneBreak.storyLine();
            Core.logger(`Story: BoneBreak - Complete`);
        }

        borgars.storyLine();
        Core.logger(`Story: Borgars - Complete`);

        BrightCrystal.crystalBrightQuests();
        Core.logger(`Story: Bright Crystal - Complete`);

        castleOfGlass.storyLine();
        Core.logger(`Story: CastleOfGlass - Complete`);

        castleTunnels.storyLine();
        Core.logger(`Story: CastleTunnels - Complete`);

        celestialPast.completeCeletialPast();
        Core.logger(`Story: CelestialPast - Complete`);

        cleric.storyLine();
        Core.logger(`Story: Cleric - Complete`);

        if (Core.isMember) {
            concert.doAll();
            Core.logger(`Story: Concert Event - Complete`);
        }

        cornelis.storyLine();
        Core.logger(`Story: Hodan Quests - Complete`);

        crashSite.storyLine();
        Core.logger(`Story: CrashSite - Complete`);

        cruxShip.storyLine();
        Core.logger(`Story: CruxShip - Complete`);

        // DarkCarnax.Storyline();
        // Core.Logger($"Story: Nightmare Carnax - Complete");

        darkDungeon.storyline();
        Core.logger(`Story: Dark Dungeon - Complete`);

        if (Core.isMember) {
            coreFriday13th.deadfly();
            Core.logger(`Story: DeadFly - Complete`);
        }

        deathsRealm.storyLine();
        Core.logger(`Story: Death's Realm - Complete`);

        djinnGateStory.djinnGate();
        Core.logger(`Story: Djinn Gate - Complete`);

        djinnGuard.completeDjinnGuard();
        Core.logger(`Story: Djinn Guard - Complete`);

        doomVaultA.storyLine();
        Core.logger(`Story: Doom Vault B - Complete`);
        doomVaultB.storyLine();

        Core.logger(`Story: Doom Vault A - Complete`);

        downward.storyLine();
        Core.logger(`Story: Downward - Complete`);

        dracoCon.storyLine();
        Core.logger(`Story: Draco Con - Complete`);

        dragonFableOrigins.dragonFableOriginsAll();
        Core.logger(`Saga: Dragon Fable Origins - Complete`);

        if (
            Core.hasAchievement(22, "ip9") ||
            Core.hasAchievement(15, "ip11") ||
            Core.hasAchievement(8, "ip14") ||
            !Core.hasAchievement(10, "ip16") ||
            !Core.hasAchievement(12, "ip17") ||
            !Core.hasAchievement(18, "ip18") ||
            !Core.hasAchievement(2, "ip20")
        ) {
            dragonRoad.storyLine();
            Core.logger(`Story: DragonRoad - Complete`);
        }

        dreamPalace.storyLine();
        Core.logger(`Story: Dream Palace - Complete`);

        dwarfhold.doAll();
        Core.logger(`Story: Dwarfhold - Complete`);

        dwarvesVsGiants.storyLine();
        Core.logger(`Story: Dwarves Vs Giants - Complete`);

        eden.storyLine();
        Core.logger(`Story: Eden - Complete`);

        etherStormWastes.doAll();
        Core.logger(`Saga: Ether Storm Wastes - Complete`);

        exaltiaTower.storyLine();
        Core.logger(`Story: Exaltia Tower - Complete`);

        extinction.storyLine();
        Core.logger(`Story: Extinction - Complete`);

        fableForest.storyLine();
        Core.logger(`Story: FableForest - Complete`);

        friendship.completeStory();
        Core.logger(`Story: Friendship - Complete`);

        frozenNorthlands.storyline();
        Core.logger(`Story: Frozen Northlands - Complete`);

        huntersMoon.storyLine();
        Core.logger(`Story: Hunter's Moon - Complete`);

        if (Core.privateRooms === true) {
            gamehaven.storyline();
            Core.logger(`Story: Game Haven - Complete`);
        }

        giantTaleStory.doAll();
        Core.logger(`Story: Giant Tale - Complete`);

        glaceraStory.doAll();
        Core.logger(`Story: Glacera - Complete`);

        guru.storyLine();
        Core.logger(`Story: Guru - Complete`);

        icePlane.storyLine();
        Core.logger(`Story: Ice Plane - Complete`);

        j6Saga.j6();
        Core.logger(`Sage: J6 - Complete`);

        laeWedding.storyline();
        Core.logger(`Story: Lae's Wedding - Complete`);

        lair.doAll();
        Core.logger(`Story: Lair - Complete`);

        if (Core.isMember) {
            lightguard.storyLine();
            Core.logger(`Story: Lightguard Michem Quests - Complete`);
        }

        lightoviaCave.lightoviaCaveQuests();
        Core.logger(`Story: LightoviaCave - Complete`);

        lostVilla.storyline();
        Core.logger(`Story: Lost Villa - Complete`);

        manor.storyLine();
        Core.logger(`Story: Manor - Complete`);

        mazumi.mazumiQuests();
        Core.logger(`Story: Mazumi Quests - Complete`);

        mobius.doAll();
        Core.logger(`Story: Mobius Quests - Complete`);

        if (Core.isMember) {
            marsh2.storyLine();
            Core.logger(`Story: Marsh 2 - Complete`);
        }

        mustyCave.storyline();
        Core.logger(`Story: MustyCave - Complete`);

        necroProject.storyLine();
        Core.logger(`Story: Necro Project - Complete`);

        noobshire.doAll();
        Core.logger(`Story: Noobshire - Complete`);

        nukemichi.nukemichiQuests();
        Core.logger(`Saga: Nukemichi Quests - Complete`);

        nytheraSaga.doAll();
        Core.logger(`Saga: Nythera - Complete`);

        if (Core.isMember) {
            pirates.storyLine();
            Core.logger(`Story: Pirates - Complete`);
        }

        poisonForest.storyLine();
        Core.logger(`Story: PoisonForest - Complete`);

        queenReign.doAll();
        Core.logger(`Story: QueenReign - Complete`);

        quibbleHunt.storyLine();
        Core.logger(`Story: QuibbleHunt - Complete`);

        ravenlossSaga.doAll();
        Core.logger(`Saga: RavenLoss - Complete`);

        river.storyLine();
        Core.logger(`Saga: River - Complete`);

        if (Core.isMember) {
            safiria.storyLine();
            Core.logger(`Story: Safiria - Complete`);
        }

        shadowGates.storyLine();
        Core.logger(`Story: ShadowGates - Complete`);

        shadowSlayerK.storyline();
        Core.logger(`Story: Shadow Slayer K - Complete`);

        shadowVault.storyLine();
        Core.logger(`Story: ShadowVault - Complete`);

        shadowVoid.shadowVoidQuests();
        Core.logger(`Story: ShadowVoid - Complete`);

        shattersword.storyLine();
        Core.logger(`Story: Shattersword - Complete`);

        shinkansen.storyline();
        Core.logger(`Story: Shinkansen - Complete`);

        shipWreck.storyLine();
        Core.logger(`Story: ShipWreck - Complete`);

        skyGuardSaga.doAll();
        Core.logger(`Saga: SkyGuard Saga - Complete`);

        spirePast.storyline();
        Core.logger(`Story: Spire Past - Complete`);

        starSinc.starSincQuests();
        Core.logger(`Story: Star Sinc - Complete`);

        superDeath.storyLine();
        Core.logger(`Story: SuperDeath - Complete`);

        thirdSpell.storyLine();
        Core.logger(`Story: Third Spell - Complete`);

        titanAttackStory.doAll();
        Core.logger(`Story: Titan Attack - Complete`);

        tournament.storyLine();
        Core.logger(`Story: Tournament - Complete`);

        tower.storyLine();
        Core.logger(`Story: Tower - Complete`);

        towerOfDoom.towerProgress();
        Core.logger(`Story: Tower Of Doom - Complete`);

        ubear.storyLine();
        Core.logger(`Story: Ubear - Complete?`);

        underGroundLab.partofundergroundlabb();
        Core.logger(`Story: Underground Lab - Complete?`);

        lairWar.doAll();
        Core.logger(`Story: Vasalkar Lair War - Complete`);

        watchTower.storyLine();
        Core.logger(`Story: WatchTower - Complete`);

        COA.whitetigerpoint();
        Core.logger(`Story: White Tiger Point - Complete`);

        willowCreek.storyLine();
        Core.logger(`Story: Willow Creek - Complete`);

        Xans.doAll();
        Core.logger(`Story: Xans Lair - Complete`);

        Yokai.quests();
        Core.logger(`Story: Yokai - Complete`);

        CSS.doAll();
        Core.logger(`Sunset Saga - Complete`);

        //#endregion
    }
}

export default function main(): void {
    const script = new AllStories();
    Core.setOptions();

    script.completeAll();

    Core.setOptions(false);
}
