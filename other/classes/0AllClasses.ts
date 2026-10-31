/*
name: All Classes
description: This script will get all of the classes that are currently farmable.
tags: all classes, class, farm, complete, all
*/
// Port of Scripts/Other/Classes/0AllClasses.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { BoostType, bot, defineScriptOptions, type InventoryItem, option } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";
import { Cryomancer } from "../../dailies/Cryomancer";
import { LordOfOrder } from "../../dailies/LordOfOrder";
import { DoomKnight } from "../../evil/DoomKnight[Mem]";
import { ArchPaladin } from "../../good/ArchPaladin";
import { Paladin } from "../../good/Paladin";
import { HBVNonInsig } from "../../hollowborn/HollowbornVindicator(NonInsignia)";
import { CoreLegion } from "../../legion/CoreLegion";
import { InfiniteLegionDC } from "../../legion/InfiniteLegionDarkCaster";
import { CoreLR } from "../../legion/revenant/CoreLR";
import { SwordMaster } from "../../legion/SwordMaster";
import { ExaltedSoulCleaver } from "../../legion/various/ExaltedSoulCleaver";
import { CoreYnR } from "../../legion/yaminoronin/CoreYnR";
import { ArchFiend } from "../../nation/various/Archfiend";
import { CoreVHL } from "../../nation/vhl/CoreVHL";
import { BloodSorceress } from "./BloodSorceress";
import { AbyssalAngelsShadow } from "./curio-classes/AbyssalAngelsShadow";
import { LegendaryElementalWarrior } from "./curio-classes/LegendaryElementalWarrior[mem]";
import { BlazeBinder } from "./daily-classes/BlazeBinder";
import { DeathKnightLord } from "./DeathKnightLord[mem]";
import { DragonOfTime } from "./DragonOfTime";
import { DragonShinobi } from "./DragonShinobi";
import { Dragonslayer } from "./Dragonslayer";
import { DragonslayerGeneral } from "./DragonslayerGeneral";
import { Enforcer } from "./Enforcer";
import { FrostSpiritReaver } from "./FrostSpiritReaver";
import { GrimNecromancer } from "./GrimNecromancer[600kAC]";
import { HighSeasCommander } from "./HighSeasCommander[10y]";
import { KingsEcho } from "./KingsEcho";
import { LegionDoomKnight } from "./LegionDoomKnight[Mem]";
import { LightCaster } from "./LightCaster";
import { MartialArtist } from "./MartialArtist";
import { MechaJouster } from "./MechaJouster";
import { Acolyte } from "./members-classes/Acolyte[Mem]";
import { AlphaOmega } from "./members-classes/AlphaOmega[Mem]";
import { BloodAncient } from "./members-classes/BloodAncient[Mem]";
import { BloodTitan } from "./members-classes/BloodTitan[Mem]";
import { ChronoAssassin } from "./members-classes/ChronoAssassin[Mem]";
import { DrakelWarlord } from "./members-classes/DrakelWarlord[Mem]";
import { Renegade } from "./members-classes/Renegade[Mem]";
import { Necromancer } from "./Necromancer";
import { ProtoSartorium } from "./ProtoSartorium";
import { Arachnomancer } from "./rep-based/Arachnomancer";
import { Bard } from "./rep-based/Bard";
import { BeastMaster } from "./rep-based/BeastMaster[Mem]";
import { ChaosSlayer, CSvariant } from "./rep-based/ChaosSlayer";
import { DarkbloodStormKing } from "./rep-based/DarkbloodStormKing";
import { DeathKnight } from "./rep-based/DeathKnight";
import { ElementalDracomancer } from "./rep-based/ElementalDracomancer";
import { EternalInversionist } from "./rep-based/EternalInversionist";
import { EvolvedShaman } from "./rep-based/EvolvedShaman";
import { GlacialBerserker } from "./rep-based/GlacialBerserker";
import { HorcEvader } from "./rep-based/HorcEvader";
import { ImperialChunin } from "./rep-based/ImperialChunin";
import { Lycan } from "./rep-based/Lycan";
import { MasterRanger } from "./rep-based/MasterRanger";
import { RoyalBattleMage } from "./rep-based/RoyalBattleMage";
import { Shaman } from "./rep-based/Shaman";
import { StoneCrusher } from "./rep-based/StoneCrusher";
import { ThiefOfHours } from "./rep-based/ThiefOfHours";
import { TrollSpellsmith } from "./rep-based/TrollSpellsmith";
import { UndeadSlayer } from "./rep-based/UndeadSlayer[Mem]";
import { Rustbucket } from "./Rustbucket";
import { ScarletSorceress } from "./ScarletSorceress";
import { Sentinel } from "./Sentinel";
import { SkyChargedGrenadier } from "./SkyChargedGrenadier[9yMem]";
import { DoomMetalNecro } from "../concerts/DoomMetalNecro";
import { NeoMetalNecro } from "../concerts/NeoMetalNecro";
import { ShadowDragonShinobi } from "../../seasonal/blackfriday/ShadowDragonShinobi";
import { FrostvalBarbarian } from "../../seasonal/frostvale/FrostvalBarbarian";
import { NorthlandsMonk } from "../../seasonal/frostvale/NorthlandsMonk";
import { EvolvedLeprechaun } from "../../seasonal/luckyday/EvolvedLeprechaun";
import { DarkLord } from "../../seasonal/maythe4th/DarkLord";
import { PumpkinLord } from "../../seasonal/mogloween/PumpkinLord(Class)";
import { VampireLord } from "../../seasonal/mogloween/VampireLord(Class)";
import { ExaltedHarbinger } from "../../seasonal/staffbirthdays/dagetheevil/ExaltedHarbinger";
import { LegionSwordMasterAssassin } from "../../seasonal/staffbirthdays/dagetheevil/LegionSwordMasterAssassin";
import { AlphaPirate } from "../../seasonal/talklikeapirateday/AlphaPirate";
import { PirateClass } from "../../seasonal/talklikeapirateday/PirateClass";

const Adv = new CoreAdvanced();
const Daily = new CoreDailies();
const BB = new BlazeBinder();
const Cryo = new Cryomancer();
const LOO = new LordOfOrder();
const Arach = new Arachnomancer();
const CS = new ChaosSlayer();
const DBSK = new DarkbloodStormKing();
const ED = new ElementalDracomancer();
const EI = new EternalInversionist();
const ES = new EvolvedShaman();
const GB = new GlacialBerserker();
const HE = new HorcEvader();
const IC = new ImperialChunin();
const lycan = new Lycan();
const MR = new MasterRanger();
const Pal = new Paladin();
const RBM = new RoyalBattleMage();
const shaman = new Shaman();
const SC = new StoneCrusher();
const TOH = new ThiefOfHours();
const TS = new TrollSpellsmith();
const Legion = new CoreLegion();
const AO = new AlphaOmega();
const DKL = new DeathKnightLord();
const acolyte = new Acolyte();
const bard = new Bard();
const BM = new BeastMaster();
const BA = new BloodAncient();
const BT = new BloodTitan();
const CA = new ChronoAssassin();
const DK = new DeathKnight();
const DoomK = new DoomKnight();
const DW = new DrakelWarlord();
const LDK = new LegionDoomKnight();
const LEW = new LegendaryElementalWarrior();
const Ren = new Renegade();
const US = new UndeadSlayer();
const APir = new AlphaPirate();
const DL = new DarkLord();
const EL = new EvolvedLeprechaun();
const EH = new ExaltedHarbinger();
const FB = new FrostvalBarbarian();
const LSMA = new LegionSwordMasterAssassin();
const NM = new NorthlandsMonk();
const Pirate = new PirateClass();
const SDS = new ShadowDragonShinobi();
const PL = new PumpkinLord();
const VL = new VampireLord();
const AAS = new AbyssalAngelsShadow();
const AF = new ArchFiend();
const BS = new BloodSorceress();
const DMN = new DoomMetalNecro();
const DS = new Dragonslayer();
const DSG = new DragonslayerGeneral();
const DSS = new DragonShinobi();
const Enf = new Enforcer();
const ESC = new ExaltedSoulCleaver();
const FSR = new FrostSpiritReaver();
const GN = new GrimNecromancer();
const HSC = new HighSeasCommander();
const ILDC = new InfiniteLegionDC();
const MJ = new MechaJouster();
const MA = new MartialArtist();
const Necro = new Necromancer();
const NMN = new NeoMetalNecro();
const PS = new ProtoSartorium();
const RB = new Rustbucket();
const SS = new ScarletSorceress();
const SCG = new SkyChargedGrenadier();
const SM = new SwordMaster();
const sentinel = new Sentinel();
const AP = new ArchPaladin();
const DOT = new DragonOfTime();
const HBV = new HBVNonInsig();
const KE = new KingsEcho();
const LC = new LightCaster();
const LR = new CoreLR();
const VHL = new CoreVHL();
const YNR = new CoreYnR();

export class AllClasses {
    //#region Class stuffs

    //#region Dailies

    //#endregion Dailies
    //#region Rep

    //#endregion Rep
    //#region Legion

    //#endregion
    //#region Member

    //#endregion Member
    //#region Seasonal

    //#endregion Seasonal
    //#region Various

    //#endregion Various
    //#region End game

    //#endregion End game
    //#endregion

    getAllClasses(): void {
        const rankUpClass = bot.config!.get<boolean>("RankALL");
        // Start off with legion classes as they cost 1200 acs to start with by joining the legion
        this.legionCLasses(rankUpClass);

        //some of these are required for forge enhancements
        this.moreClassesToGet(rankUpClass);

        // then we start the rest.
        this.dailyClasses(rankUpClass);
        this.repClasses(rankUpClass);
        this.memClasses(rankUpClass);
        this.seasonalClasses(rankUpClass);
        this.variousClasses(rankUpClass);
        this.endGameClasses(rankUpClass);
        this.aCorToHardtoGetClasses(rankUpClass);
    }

    moreClassesToGet(rankUpClass: boolean): void {
        Core.logger("=== Buying `beginner` classes start (will help with forge enhancements later)===");
        Adv.gearStore(undefined, { enhAfter: true });
        Core.buyItem("trainers", 170, "Warrior");
        Core.buyItem("trainers", 174, "Mage");
        Core.buyItem("trainers", 176, "Healer");
        Core.buyItem("trainers", 172, "Rogue");
        Core.buyItem("classhalla", 178, "Ninja");
        Core.buyItem(bot.map.name, 299, "Barber");
        Core.buyItem(bot.map.name, 299, "Oracle");
        Core.buyItem(bot.map.name, 222, "Battle Warrior");
        Core.buyItem(bot.map.name, 222, "Battle Healer");
        Core.buyItem(bot.map.name, 222, "No Class");
        Adv.gearStore(true, { enhAfter: true });
        Core.toBank(
            "Warrior",
            "Mage",
            "Healer",
            "Rogue",
            "Ninja",
            "Barber",
            "Oracle",
            "Battle Warrior",
            "Battle Healer",
            "No Class",
        );
        Core.logger("=== `beginner` classes - Bought! ===");
    }

    dailyClasses(rankUpClass: boolean): void {
        Core.logger("=== Doing Daily Classes ===");

        Adv.gearStore(undefined, { enhAfter: true });
        this.checkAndExecute("Blaze Binder", () => BB.getClass(rankUpClass));
        this.checkAndExecute("The Collector", Daily.collectorClass.bind(Daily));
        this.checkAndExecute("Cryomancer", () => Cryo.doCryomancer(rankUpClass));
        this.checkAndExecute("Lord of Order", () => LOO.getLoO(rankUpClass));
        Adv.gearStore(true, { enhAfter: true });
        Core.toBank("Blaze Binder", "The Collector", "Cryomancer", "Death KnightLord", "Lord of Order");

        Core.logger("=== Daily Classes - Completed! ===");
    }

    repClasses(rankUpClass: boolean): void {
        Core.logger("=== Doing Reputation Classes ===");

        Adv.gearStore(undefined, { enhAfter: true });
        this.checkAndExecute("Arachnomancer", () => Arach.getArach(rankUpClass));
        this.checkAndExecute("Darkblood StormKing", () => DBSK.getDSK(rankUpClass));
        this.checkAndExecute("Elemental Dracomancer", () => ED.getED(rankUpClass));
        this.checkAndExecute("Eternal Inversionist", () => EI.getEI(rankUpClass));
        this.checkAndExecute("Evolved Shaman", () => ES.getES(rankUpClass));
        this.checkAndExecute("Glacial Berserker", () => GB.getGB(rankUpClass));
        this.checkAndExecute("Horc Evader", () => HE.getHE(rankUpClass));
        this.checkAndExecute("Imperial Chunin", () => IC.getIC(rankUpClass));
        this.checkAndExecute("Lycan", () => lycan.getLycan(rankUpClass));
        this.checkAndExecute("Master Ranger", () => MR.getMR(rankUpClass));
        this.checkAndExecute("Paladin", () => Pal.getPaladin(rankUpClass));
        this.checkAndExecute("Royal BattleMage", () => RBM.getRBM(rankUpClass));
        this.checkAndExecute("Shaman", () => shaman.getShaman(rankUpClass));
        this.checkAndExecute("StoneCrusher", () => SC.getSC(rankUpClass));
        this.checkAndExecute("Thief of Hours", () => TOH.getToH(rankUpClass));
        this.checkAndExecute("Troll Spellsmith", () => TS.getTS(rankUpClass));

        // Chaos Slayer variants
        this.checkAndExecute("Chaos Slayer Mystic", () => CS.getCS(CSvariant.Mystic, rankUpClass));
        this.checkAndExecute("Chaos Slayer Berserker", () => CS.getCS(CSvariant.Berserker, rankUpClass));
        this.checkAndExecute("Chaos Slayer Cleric", () => CS.getCS(CSvariant.Cleric, rankUpClass));
        this.checkAndExecute("Chaos Slayer Thief", () => CS.getCS(CSvariant.Thief, rankUpClass));
        Adv.gearStore(true, { enhAfter: true });
        Core.toBank(
            "Arachnomancer",
            "Darkblood StormKing",
            "Elemental Dracomancer",
            "Eternal Inversionist",
            "Evolved Shaman",
            "Glacial Berserker",
            "Horc Evader",
            "Imperial Chunin",
            "Lycan",
            "Master Ranger",
            "Paladin",
            "Royal BattleMage",
            "Shaman",
            "StoneCrusher",
            "Thief of Hours",
            "Troll Spellsmith",
            "Chaos Slayer Mystic",
            "Chaos Slayer Berserker",
            "Chaos Slayer Cleric",
            "Chaos Slayer Thief",
        );

        Core.logger("=== Reputation Classes - Completed! ===");
    }

    private memClasses(rankUpClass: boolean): void {
        if (!Core.isMember) {
            return;
        }

        Core.logger("=== Doing Member Classes ===");

        Adv.gearStore(undefined, { enhAfter: true });
        this.checkAndExecute("Alpha Omega", () => AO.getAlphaOmega(rankUpClass));
        this.checkAndExecute("Acolyte", () => acolyte.getAcolyte(rankUpClass));
        this.checkAndExecute("Bard", () => bard.getBard(rankUpClass));
        this.checkAndExecute("BeastMaster", () => BM.getBM(rankUpClass));
        this.checkAndExecute("Blood Ancient", () => BA.getBAnc(rankUpClass));
        this.checkAndExecute("Blood Titan", () => BT.getclass(rankUpClass));
        this.checkAndExecute("Chrono Assassin", () => CA.getChronoAss(rankUpClass));
        this.checkAndExecute("DeathKnight", () => DK.getDK(rankUpClass));
        this.checkAndExecute("Death KnightLord", () => DKL.dkl());
        this.checkAndExecute("DoomKnight", () => DoomK.getDoomKnight(rankUpClass));
        this.checkAndExecute("Drakel Warlord", () => DW.getClass(rankUpClass));
        this.checkAndExecute("Legion DoomKnight", () => LDK.getLDK(rankUpClass));
        this.checkAndExecute("Legendary Elemental Warrior", () => LEW.getLEW(rankUpClass));
        this.checkAndExecute("Renegade", () => Ren.getclass(rankUpClass));
        this.checkAndExecute("UndeadSlayer", () => US.getUS(rankUpClass));
        Adv.gearStore(true, { enhAfter: true });
        Core.toBank(
            "Alpha Omega",
            "Acolyte",
            "Bard",
            "BeastMaster",
            "Blood Ancient",
            "Blood Titan",
            "Chrono Assassin",
            "DeathKnight",
            "DoomKnight",
            "Drakel Warlord",
            "Legion DoomKnight",
            "Legendary Elemental Warrior",
            "Renegade",
            "UndeadSlayer",
        );

        Core.logger("=== Member Classes - Completed! ===");
    }

    private seasonalClasses(rankUpClass: boolean): void {
        Core.logger("=== Doing Seasonal Classes ===");

        Adv.gearStore(undefined, { enhAfter: true });
        this.checkAndExecute("Alpha Pirate", () => APir.getAlphaPirate(rankUpClass));
        this.checkAndExecute("Dark Lord", () => DL.getDL(rankUpClass));
        this.checkAndExecute("Evolved Leprechaun", () => EL.getClass(rankUpClass));
        this.checkAndExecute("Frostval Barbarian", () => FB.getFB(rankUpClass));
        this.checkAndExecute("Northlands Monk", () => NM.getNlMonk(rankUpClass));
        this.checkAndExecute("Pirate", () => Pirate.getPirate(rankUpClass));
        this.checkAndExecute("Shadow Dragon Shinobi", () => SDS.getClass(rankUpClass));
        this.checkAndExecute("Pumpkin Lord", () => PL.getClass(rankUpClass));
        this.checkAndExecute("Vampire Lord", () => VL.getClass(rankUpClass));
        // CheckAndExecute("No Hollowborn Class", () => NHBC.GetNHBC(rankUpClass));

        Adv.gearStore(true, { enhAfter: true });
        Core.toBank(
            "Alpha Pirate",
            "Dark Lord",
            "Evolved Leprechaun",
            "Exalted Harbinger",
            "Frostval Barbarian",
            "Legion SwordMaster Assassin",
            "Northlands Monk",
            "Pirate",
            "Shadow Dragon Shinobi",
            "Pumpkin Lord",
            "Vampire Lord",
        );

        Core.logger("=== Seasonal Classes - Completed! ===");
    }

    private variousClasses(rankUpClass: boolean): void {
        Core.logger("=== Doing Various Classes ===");

        Adv.gearStore(undefined, { enhAfter: true });
        this.checkAndExecute("Abyssal Angel Shadow", () => AAS.getAbyssal(rankUpClass));
        this.checkAndExecute("Archfiend", () => AF.getArchfiend(rankUpClass));
        this.checkAndExecute("Blood Sorceress", () => BS.getBSorc(rankUpClass));
        this.checkAndExecute("Doom Metal Necro", () => DMN.getClass(rankUpClass));
        this.checkAndExecute("Dragonslayer", () => DS.getDragonslayer(rankUpClass));
        this.checkAndExecute("Dragonslayer General", () => DSG.getDSGeneral(rankUpClass));
        this.checkAndExecute("DragonSoul Shinobi", () => DSS.getDSS(rankUpClass));
        this.checkAndExecute("Enforcer", () => Enf.getClass(rankUpClass));
        this.checkAndExecute("Frost SpititReaver", () => FSR.getFSR(rankUpClass));
        this.checkAndExecute("HighSeas Commander", () => HSC.getHSC(rankUpClass));
        this.checkAndExecute("Martial Artist", () => MA.getMartialArtist(rankUpClass));
        this.checkAndExecute("MechaJouster", () => MJ.getMJ(rankUpClass));
        this.checkAndExecute("Necromancer", () => Necro.getNecromancer(rankUpClass));
        this.checkAndExecute("Neo Metal Necro", () => NMN.getClass(rankUpClass));
        this.checkAndExecute("ProtoSartorium", () => PS.getPS(rankUpClass));
        this.checkAndExecute("Rustbucket", () => RB.getRustbucket(rankUpClass));
        this.checkAndExecute("Scarlet Sorceress", () => SS.getSSorc(rankUpClass));
        Adv.gearStore(true, { enhAfter: true });
        Core.toBank(
            "Abyssal Angel Shadow",
            "Archfiend",
            "Blood Sorceress",
            "Doom Metal Necro",
            "Dragonslayer",
            "Dragonslayer General",
            "DragonSoul Shinobi",
            "Enforcer",
            "Frost SpititReaver",
            "HighSeas Commander",
            "Infinite Legion Dark Caster",
            "MechaJouster",
            "Necromancer",
            "Neo Metal Necro",
            "ProtoSartorium",
            "Rustbucket",
            "Scarlet Sorceress",
            "SwordMaster",
        );

        Core.logger("=== Various Classes - Completed! ===");
    }

    private endGameClasses(rankUpClass: boolean): void {
        Core.logger("=== Doing End Game Classes ===");

        Adv.gearStore(undefined, { enhAfter: true });
        this.checkAndExecute("ArchPaladin", () => AP.getAP(rankUpClass));
        this.checkAndExecute("Dragon of Time", () => DOT.getDoT(rankUpClass, false));
        this.checkAndExecute("Void Highlord", () => VHL.getVHL(rankUpClass));
        this.checkAndExecute("Yami no Ronin", () => YNR.getYnR(rankUpClass));
        Adv.gearStore(true, { enhAfter: true });
        Core.toBank("ArchPaladin", "Dragon of Time", "Void Highlord", "Yami no Ronin");

        Core.logger("=== End Game Classes - Completed! ===");
    }

    private aCorToHardtoGetClasses(rankUpClass: boolean): void {
        Core.logger("=== AC / Special Requirement / Army Classes ===");

        Adv.gearStore(undefined, { enhAfter: true });
        // Why do you own these classes?
        this.checkAndExecute("Grim Necromancer", () => GN.getGN(rankUpClass));
        // 600k ac purchased

        // Classes that require a certain time played:
        this.checkAndExecute("SkyCharged Grenadier", () => SCG.getSCG(rankUpClass));
        // 9 years membership
        this.checkAndExecute("Sentinel", () => sentinel.getSentinel(rankUpClass));
        // 16 years played

        // Classes that Cost ACs / AC badges:
        this.checkAndExecute("LightCaster", () => LC.getLC(rankUpClass));
        // LC gets LM at the same time
        this.checkAndExecute("Exalted Soul Cleaver", () => ESC.getClass(rankUpClass));

        // Classes that require an army or are just to damn hard to solo,
        // these scripts will more then likely just return when they cant farm an item:
        // CheckAndExecute("Chaos Avenger", () => CAV.GetClass(rankUpClass));
        // CheckAndExecute("Archmage", () => AM.GetAM(rankUpClass));
        // CheckAndExecute("Verus DoomKnight", () => VDK.GetClass(rankUpClass));

        // Classes that take to long to farm for a bank class:
        // CheckAndExecute("Arcana Invoker", () => AI.GetAI(rankUpClass));
        this.checkAndExecute("Hollowborn Vindicator", () => HBV.getClass(rankUpClass));
        // Non Insignia
        this.checkAndExecute("King's Echo", () => KE.getKE(rankUpClass));
        // CheckAndExecute("Lich", () => lich.Example(rankUpClass));
        this.checkAndExecute("ShadowScythe General", Daily.shadowScytheClass.bind(Daily));
        // CheckAndExecute("Sovereign of Storms", () => SOS.GetSOS(rankUpClass));
        Adv.gearStore(true, { enhAfter: true });
        Core.toBank(
            "Grim Necromancer",
            "SkyCharged Grenadier",
            "Sentinel",
            "LightCaster",
            "Legion Revenant",
            "Exalted Soul Cleaver",
            "Chaos Avenger",
            "Archmage",
            "Verus DoomKnight",
            "Arcana Invoker",
            "Hollowborn Vindicator",
            "Lich",
            "ShadowScythe General",
            "Sovereign of Storms",
        );

        Core.logger("=== AC / Special Requirement / Army Classes - Completed! ===");
    }

    legionCLasses(rankUpClass: boolean): void {
        if (!bot.config!.get<boolean>("DoLegion")) {
            return;
        }

        Core.logger("=== AC / Join Legion REquired / 1200 acs ===");

        Legion.joinLegion();

        Adv.gearStore(undefined, { enhAfter: true });

        this.checkAndExecute("Legion Revenant", () => LR.getLR(rankUpClass));
        this.checkAndExecute("Exalted Harbinger", () => EH.getEH(rankUpClass));
        this.checkAndExecute("Legion SwordMaster Assassin", () => LSMA.getClass(rankUpClass));
        this.checkAndExecute("Infinite Legion Dark Caster", () => ILDC.getILDC(rankUpClass));
        this.checkAndExecute("SwordMaster", () => SM.getSwordMaster(rankUpClass));
    }

    checkAndExecute(className: string, action: () => void): void {
        const classItem =
            bot.inventory.items
                .concat(...bot.bank.items)
                .find((x) => x.category === "Class" && x.name.toLowerCase() === className.toLowerCase()) ?? null;

        if (classItem == null || classItem.quantity < 302500) {
            action();
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "GetAllClasses",
    [
        option.bool("RankALL", "Rankup All Classes", "wether to Rankup the class to 10 after acquiring it", true),
        option.bool(
            "DoLegion",
            "GetLegionClasses",
            "Join Legion if not( you'll have to stuck around for this one itll be at the top) -- cost 1200acs",
            false,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new AllClasses();
    const GoldBoostID = bot.boosts.getBoostId(BoostType.Gold, true);
    const ClassBoostID = bot.boosts.getBoostId(BoostType.Class, true);
    const ExperienceBoostID = bot.boosts.getBoostId(BoostType.Experience, true);
    const ReputationBoostID = bot.boosts.getBoostId(BoostType.Reputation, true);

    Core.bankingBlackList.push(
        ...(
            bot.inventory.items.filter(
                (x) =>
                    x.id === GoldBoostID ||
                    x.id === ClassBoostID ||
                    x.id === ExperienceBoostID ||
                    x.id === ReputationBoostID,
            ) as InventoryItem[]
        ).map((item) => item.name),
    );

    Core.setOptions();

    script.getAllClasses();

    Core.setOptions(false);
}
