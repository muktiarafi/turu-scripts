/*
name: Core LoneWolf
description: Shared combat mechanics for LoneWolf Ultra scripts.
tags: core, lonewolf, ultra
*/
// Port of CoreLoneWolf.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).

import { bot, type EventMap, type InventoryItem, option, type QuestItem } from "turu";
import { CapeSpecial, EnhancementType, HelmSpecial, WeaponSpecial } from "../core/CoreAdvanced";
import { Core, type QuestData, type RewardItem, rethrowIfStopped, type SpaceItem } from "../core/CoreBots";
import { type TaskStep, tasks } from "../core/CoreTasks";

export enum PotionCategory {
    Tonic = "Tonic",
    Elixir = "Elixir",
    CombatPotion = "CombatPotion",
}

export enum EnhancementSlot {
    Class = "Class",
    Cape = "Cape",
    Helm = "Helm",
    Weapon = "Weapon",
}

export enum UltraRunResult {
    Completed = "Completed",
    AttemptsExhausted = "AttemptsExhausted",
    Failed = "Failed",
}

export enum SkillEngineMode {
    Simple = "Simple",
    Strict = "Strict",
    KingsEcho = "KingsEcho",
    ArcanaInvoker = "ArcanaInvoker",
    Shaman = "Shaman",
    LightCasterHealing = "LightCasterHealing",
    VoidHighlord = "VoidHighlord",
    ChronoShadowHunterStable = "ChronoShadowHunterStable",
    ChronoShadowHunterGunslinger = "ChronoShadowHunterGunslinger",
    ChaosAvengerOptimized = "ChaosAvengerOptimized",
    ScionOfFlames = "ScionOfFlames",
    Guardian = "Guardian",
    ShadowStalkerOfTime = "ShadowStalkerOfTime",
    ArchFiendNoHealing = "ArchFiendNoHealing",
    GreatThief = "GreatThief",
    ArchivistOfTime = "ArchivistOfTime",
    DracoKnight = "DracoKnight",
    MartialArtist = "MartialArtist",
    ChaosShaper = "ChaosShaper",
    KathoolAdeptOptimized = "KathoolAdeptOptimized",
}

export class CoreLoneWolf {
    private static readonly archFiendsMarkAura = "ArchFiend's Mark";

    // Fixed skill-worker polling; Gunslinger retains its faster firing cadence.
    private static readonly skillPollDelay = 100;
    /** The CoreTasks task running the skill engine (C#'s "LoneWolf Skill Engine" thread). */
    private static readonly skillTask = "LoneWolfSkills";
    private static readonly cssGunslingerFirePollDelay = 50;

    private static readonly armyProtocolVersion = "1";
    private static readonly armyPollDelay = 500;
    private static readonly potionShopMap = "alchemyacademy";
    private static readonly potionShopId = 2036;
    private static readonly potionAuraCheckDelay = 1500;
    private static readonly potionSuccessDelay = 2000;
    private static readonly enrageScroll = "Scroll of Enrage";
    private static readonly decayScroll = "Scroll of Decay";
    private static readonly mystifyScroll = "Scroll of Mystify";
    private static readonly spellcraftMap = "spellcraft";
    private static readonly arcaneQuillShopId = 693;
    private static readonly arcaneQuillShopItemId = 7686;
    private static readonly spellInkShopId = 549;
    private static readonly enrageQuestId = 2330;
    private static readonly enrageThreshold = 80;
    private static readonly enrageMaxStack = 1000;
    private static readonly enrageRewardQuantity = 40;
    private static readonly decayQuestId = 2331;
    private static readonly mystifyQuestId = 2344;
    private static readonly optionalScrollThreshold = 10;
    private static readonly arcanaInvokerFoolAura = "0 - The Fool";
    private static readonly arcanaInvokerJudgementAura = "Judgement Day";
    private static readonly arcanaInvokerWorldAura = "XXI - The World";
    private static readonly shamanElementalEmbraceAura = "Elemental Embrace";
    private static readonly chronoShadowHunterRoundsEmptyAura = "Rounds Empty";
    private static readonly chronoShadowHunterGunslingerAura = "Gunslinger Stance";
    private static readonly guardianSpiritAura = "Guardian Spirit";
    private static readonly ssotLoopSkills: number[] = [4, 2, 3, 1, 2, 1];
    private static readonly archivistLoopSkills: number[] = [
        0, 1, 3, 0, 3, 2, 0, 3, 1, 0, 3, 3, 0, 2, 2, 0, 2, 1, 0, 2, 3, 0, 2, 2, 4,
    ];
    private static readonly dracoKnightLoopSkills: number[] = [2, 1, 3, 2, 1, 4, 1, 2, 3];
    private static readonly martialArtistLoopSkills: number[] = [4, 2, 3, 2, 1, 2, 1, 2, 3, 1, 2];
    private static readonly chaosShaperUnitySkills: number[] = [2];
    private static readonly chaosShaperChaosSkills: number[] = [3, 2];

    private static readonly armyAliases: string[] = [
        "playerOne",
        "playerTwo",
        "playerThree",
        "playerFour",
        "playerFive",
        "playerSix",
        "playerSeven",
    ];

    private skillEngineRunning: boolean = false;
    private skillEnginePaused: number = 0;
    private ordinarySkillsSuppressed: number = 0;
    private pendingAbsolutePriorityTauntMapId: number = 0;
    private pendingTauntMapId: number = 0;
    private pendingImmediateTauntMapId: number = 0;
    private pendingSkillFiveMapId: number = 0;
    private pendingImmediateSkillFiveMapId: number = 0;
    private pendingAbsolutePrioritySkill: number = 0;
    private pendingPrioritySkill: number = 0;
    private pendingTargetedPrioritySkill: TargetedPrioritySkillRequest | null = null;
    private pendingLimitedPrioritySkill: LimitedPrioritySkillRequest | null = null;
    private skillIndex: number = 0;
    private skillList: number[] = [];
    private role: string = "";
    private isTaunter: boolean = false;
    private logPrefix: string = "";
    private skillEngineMode: SkillEngineMode = null!;
    private useSurvivalSkill = true;
    private maintainedPotion: string | null = null;
    private kingsEchoManaThreshold = 12;
    private ssotOpeningComplete: boolean = false;
    private archivistOpeningComplete: boolean = false;
    private dracoKnightOpeningComplete: boolean = false;
    private martialArtistOpeningComplete: boolean = false;
    private blockedStrictSkill: number = 0;
    private blockedStrictSkillSelfAura: string = "";
    private blockedStrictSkillTargetAura: string = "";
    private blockedSimpleSkill: number = 0;
    private blockedSimpleSkillTargetAura: string = "";
    private shamanSkillThreeEnabled = true;
    private cssNormalInitialManaCheck: boolean = false;
    private cssNormalNeedsRegeneration: boolean = false;
    private cssGunslingerInitialManaCheck: boolean = false;
    private cssGunslingerWaitingForStance: boolean = false;
    private cssGunslingerFiring: boolean = false;
    private cssGunslingerNeedsRegeneration: boolean = false;
    private packetDetectorRunning: boolean = false;
    private packetCommands: string[] = [];
    private packetSelectedCommand: string = "";
    private packetTexts: string[] = [];
    private packetSelectedPacket: string = "";
    private packetChoiceMode: boolean = false;
    private packetSelectedChoice: string = "";
    private packetSkillPauseChoice: string = "";
    private packetPauseEveryChoice: boolean = false;
    private packetDetectionCount: number = 0;
    private bypassedUltraQuestID: number = 0;

    private armyPlayers: string[] = [];
    private armyUsername: string = "";
    private armySyncPath: string = "";
    private armyLaunchToken: string = "";
    private armySessionId: string = "";
    private armyPlayerIndex: number = -1;
    private nextArmyStepId = 1;
    private lastArmyStepId: number = 0;
    private armyInitialized: boolean = false;
    private armySessionStarted: boolean = false;
    private armySessionFailureLogged: boolean = false;
    private armyStopLogged: boolean = false;
    private armyTransportFailed: boolean = false;
    private armyTransportFailureLogged: boolean = false;
    private reportedFightAttempt: number = 0;
    private reportedFightAlive: boolean | null = null;

    player1 = option.text("player1", "Player 1", "Player 1 is the sync boss.", "");

    player2 = option.text("player2", "Player 2", "Player 2 account name.", "");

    player3 = option.text("player3", "Player 3", "Player 3 account name.", "");

    player4 = option.text("player4", "Player 4", "Player 4 account name.", "");

    player5 = option.text("player5", "Player 5", "Player 5 account name.", "");

    player6 = option.text("player6", "Player 6", "Player 6 account name.", "");

    player7 = option.text("player7", "Player 7", "Player 7 account name.", "");

    setAntiLag(): void {
        // Turu: C# turns off VibeSkua's Streamer Mode here. Turu's only relabels what is drawn
        // (names, the area title, the house sign) and hides gold and the chat log, inside
        // turu.swf: nothing these scripts read, and no lag to kill. It stays as you set it.

        bot.options.hidePlayers = true;
        bot.lite.disableSelfAnimation = true;
        bot.lite.disableMonsterAnimation = true;
        bot.lite.disableSkillAnimation = true;
        bot.lite.disableDamageStrobe = true;

        const monstersHidden = bot.flash.get<boolean>("ui.monsterIcon.redX.visible");
        if (!monstersHidden) {
            bot.flash.callGameFunction("world.toggleMonsters");
        }
    }

    legionRevenant(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Legion Revenant",
            skills: [3, 4, 2, 1],
            baseEnhancement: EnhancementType.Wizard,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Arcanas_Concerto,
            weaponEnhancementFallbacks: [WeaponSpecial.Ravenous, WeaponSpecial.Valiance, WeaponSpecial.Health_Vamp],
            tonic: "Sage Tonic",
            elixir: "Potent Malevolence Elixir",
            combatPotion: "Potent Honor Potion",
        });
    }

    lightCaster(healingMode = false): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "LightCaster",
            skills: healingMode ? [2, 1, 4] : [2, 1, 3, 4],
            skillMode: healingMode ? SkillEngineMode.LightCasterHealing : SkillEngineMode.Simple,
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Lament,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Ravenous,
            tonic: "Fate Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    archFiend(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "ArchFiend",
            skills: [3, 4, 1, 2],
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Ravenous,
            tonic: "Fate Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Potent Honor Potion",
        });
    }

    arachnomancer(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Arachnomancer",
            skills: [1, 3, 2, 4],
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Ravenous,
            weaponEnhancementFallbacks: [WeaponSpecial.Praxis, WeaponSpecial.Lacerate, WeaponSpecial.Health_Vamp],
            tonic: "Fate Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    greatThief(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Great Thief",
            skills: [4, 1, 3],
            skillMode: SkillEngineMode.GreatThief,
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Arcanas_Concerto,
            weaponEnhancementFallbacks: [WeaponSpecial.Praxis, WeaponSpecial.Health_Vamp],
            tonic: "Fate Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    glaceranWarlord(healingMode = false): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Glaceran Warlord",
            alternateClassNames: ["Glacial Warlord", "Dark Glaceran Warlord", "Savage Glaceran Warlord"],
            skills: healingMode ? [1, 2, 1, 1, 3, 1, 4] : [1, 2, 1, 1, 3, 1, 1, 4, 2, 1],
            skillMode: SkillEngineMode.Strict,
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: healingMode ? CapeSpecial.Penitence : CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Ravenous,
            tonic: "Might Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    archivistOfTime(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Archivist of Time",
            alternateClassNames: ["Archivist of Temporis"],
            skills: [0, 1, 3, 0, 3, 2, 0, 3, 1, 0, 2, 2, 0, 2, 1, 0, 2, 3, 0, 3, 3, 0, 2, 2, 4],
            skillMode: SkillEngineMode.ArchivistOfTime,
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Ravenous,
            tonic: "Fate Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    dracoKnight(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Draco Knight",
            alternateClassNames: ["Dragon Knight", "Drakkar Knight"],
            skills: [2, 3, 1, 4, 2, 1, 2, 3, 1, 4, 2, 1, 2, 3, 1, 4, 2, 1],
            skillMode: SkillEngineMode.DracoKnight,
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Valiance,
            tonic: "Sage Tonic",
            elixir: "Potent Destruction Elixir",
            combatPotion: "Potent Honor Potion",
        });
    }

    phantomChronomancer(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Phantom Chronomancer",
            alternateClassNames: ["Phantasm Chronomancer"],
            skills: [3, 1, 2, 1, 2, 3, 2, 1, 2, 1, 2, 3, 1, 3, 2, 1, 2, 1, 3, 4],
            skillMode: SkillEngineMode.Strict,
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Examen,
            weaponEnhancement: WeaponSpecial.Ravenous,
            tonic: "Fate Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    interstellarKnight(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Interstellar Knight",
            alternateClassNames: ["Infinity Knight"],
            skills: [2, 4, 1, 2, 1, 4, 1, 1, 2, 1, 1, 2, 3],
            skillMode: SkillEngineMode.Strict,
            baseEnhancement: EnhancementType.Wizard,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Pneuma,
            weaponEnhancement: WeaponSpecial.Acheron,
            weaponEnhancementFallbacks: [WeaponSpecial.Ravenous, WeaponSpecial.Valiance, WeaponSpecial.Health_Vamp],
            tonic: "Sage Tonic",
            elixir: "Potent Malevolence Elixir",
            combatPotion: "Potent Honor Potion",
        });
    }

    martialArtist(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Martial Artist",
            alternateClassNames: ["Master Martial Artist"],
            skills: [1, 2, 1, 2, 2, 3, 2, 1],
            skillMode: SkillEngineMode.MartialArtist,
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Ravenous,
            tonic: "Fate Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    chaosShaper(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Chaos Shaper",
            skills: [1],
            skillMode: SkillEngineMode.ChaosShaper,
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Ravenous,
            tonic: "Fate Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    imperialChunin(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Imperial Chunin",
            alternateClassNames: ["Chunin"],
            skills: [2, 3, 1, 4],
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Lament,
            helmEnhancement: HelmSpecial.Vim,
            weaponEnhancement: WeaponSpecial.Valiance,
            tonic: "Fate Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    ssot(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "ShadowStalker of Time",
            alternateClassNames: ["ShadowWalker of Time", "ShadowWeaver of Time"],
            skills: [3, 2, 1, 4, 2, 1, 2, 1],
            skillMode: SkillEngineMode.ShadowStalkerOfTime,
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Vim,
            weaponEnhancement: WeaponSpecial.Elysium,
            tonic: "Fate Tonic",
            elixir: "Potent Malevolence Elixir",
            combatPotion: "Potent Honor Potion",
        });
    }

    paladinChronomancer(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Paladin Chronomancer",
            alternateClassNames: ["Obsidian Paladin Chronomancer"],
            skills: [2, 1, 1, 3, 1, 1, 1, 4, 2, 1, 1, 1, 1, 1, 4],
            skillMode: SkillEngineMode.Strict,
            baseEnhancement: EnhancementType.Fighter,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Hearty,
            weaponEnhancement: WeaponSpecial.Mana_Vamp,
            weaponEnhancementFallbacks: [],
            tonic: "Might Tonic",
            elixir: "Divine Elixir",
            combatPotion: "Potent Honor Potion",
        });
    }

    voidHighlord(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Void Highlord",
            alternateClassNames: ["Debris Highlord", "Void Highlord (IoDA)"],
            skills: [1, 2, 4],
            skillMode: SkillEngineMode.VoidHighlord,
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Ravenous,
            tonic: "Fate Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    hollowbornVindicator(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Hollowborn Vindicator",
            skills: [3, 4, 1, 4, 1, 3, 1, 3, 1, 2],
            skillMode: SkillEngineMode.Strict,
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Penitence,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Ravenous,
            tonic: "Fate Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    verusDoomKnight(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Verus DoomKnight",
            skills: [1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 1, 2, 4, 3, 1, 2, 3],
            skillMode: SkillEngineMode.Strict,
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Ravenous,
            tonic: "Fate Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    dragonOfTime(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Dragon of Time",
            skills: [3, 2, 1, 2, 4, 2],
            skillMode: SkillEngineMode.Strict,
            baseEnhancement: EnhancementType.Wizard,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Pneuma,
            weaponEnhancement: WeaponSpecial.Elysium,
            tonic: "Sage Tonic",
            elixir: "Potent Malevolence Elixir",
            combatPotion: "Potent Honor Potion",
        });
    }

    kathoolAdept(optimizedMode = false): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Kathool Adept",
            skills: optimizedMode ? [3, 3, 1, 2, 4] : [3, 1, 2, 3, 1, 3, 1, 3, 1, 2, 4],
            skillMode: optimizedMode ? SkillEngineMode.KathoolAdeptOptimized : SkillEngineMode.Strict,
            baseEnhancement: EnhancementType.Wizard,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Pneuma,
            weaponEnhancement: WeaponSpecial.Valiance,
            tonic: "Sage Tonic",
            elixir: "Potent Malevolence Elixir",
            combatPotion: "Potent Honor Potion",
        });
    }

    lich(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Lich",
            skills: [4, 3, 4, 2, 4, 1, 3, 2, 4, 1],
            skillMode: SkillEngineMode.Strict,
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Ravenous,
            tonic: "Fate Tonic",
            elixir: "Potent Malevolence Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    bard(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Bard",
            alternateClassNames: ["Troubador of Love"],
            skills: [1, 4, 2, 3, 1, 2, 3, 4, 1, 3, 4, 2],
            skillMode: SkillEngineMode.Strict,
            baseEnhancement: EnhancementType.Wizard,
            capeEnhancement: CapeSpecial.Absolution,
            helmEnhancement: HelmSpecial.Pneuma,
            weaponEnhancement: WeaponSpecial.Valiance,
            tonic: "Sage Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Potent Honor Potion",
        });
    }

    kingsEcho(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "King's Echo",
            skills: [1, 2],
            skillMode: SkillEngineMode.KingsEcho,
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Examen,
            weaponEnhancement: WeaponSpecial.Ravenous,
            weaponEnhancementFallbacks: [WeaponSpecial.Elysium, WeaponSpecial.Valiance, WeaponSpecial.Health_Vamp],
            tonic: "Fate Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    arcanaInvoker(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Arcana Invoker",
            skills: [2, 3, 4],
            skillMode: SkillEngineMode.ArcanaInvoker,
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Examen,
            weaponEnhancement: WeaponSpecial.Ravenous,
            tonic: "Fate Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    chronoShadowHunter(gunslingerMode = false): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Chrono ShadowHunter",
            alternateClassNames: ["Chrono ShadowSlayer"],
            skillMode: gunslingerMode
                ? SkillEngineMode.ChronoShadowHunterGunslinger
                : SkillEngineMode.ChronoShadowHunterStable,
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Arcanas_Concerto,
            tonic: "Fate Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    chaosSlayer(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Chaos Slayer Berserker",
            alternateClassNames: [
                "Chaos Slayer Mystic",
                "Chaos Slayer Cleric",
                "Chaos Slayer Thief",
                "Chaos Champion Prime",
                "Dark Chaos Berserker",
            ],
            skills: [3, 2, 4, 1],
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Ravenous,
            tonic: "Fate Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    chaosAvenger(optimizedMode = false): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Chaos Avenger",
            skills: [3, 4, 1, 2],
            skillMode: optimizedMode ? SkillEngineMode.ChaosAvengerOptimized : SkillEngineMode.Simple,
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Valiance,
            tonic: "Fate Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    scionOfFlames(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Scion of Flames",
            skills: [1, 0, 4, 3, 1, 2, 1, 1, 1, 0, 2, 3, 1, 4, 1, 2, 1, 1, 1, 0, 3, 1, 2, 1, 1, 1, 2, 1],
            skillMode: SkillEngineMode.Strict,
            baseEnhancement: EnhancementType.Wizard,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Valiance,
            tonic: "Sage Tonic",
            elixir: "Potent Malevolence Elixir",
            combatPotion: "Potent Honor Potion",
        });
    }

    shaman(farmMode = false): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Shaman",
            skills: [1, 2],
            skillMode: farmMode ? SkillEngineMode.Simple : SkillEngineMode.Shaman,
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Ravenous,
            weaponEnhancementFallbacks: [WeaponSpecial.Elysium, WeaponSpecial.Valiance, WeaponSpecial.Health_Vamp],
            tonic: "Fate Tonic",
            elixir: "Potent Malevolence Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    stoneCrusher(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "StoneCrusher",
            alternateClassNames: ["Infinity Titan"],
            skills: [3, 2, 4, 1],
            baseEnhancement: EnhancementType.Fighter,
            capeEnhancement: CapeSpecial.Absolution,
            helmEnhancement: HelmSpecial.None,
            weaponEnhancement: WeaponSpecial.Valiance,
            tonic: "Might Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Potent Honor Potion",
        });
    }

    archPaladin(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "ArchPaladin",
            skills: [3, 2, 1, 4],
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Vainglory,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Valiance,
            tonic: "Fate Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    lordOfOrder(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Lord of Order",
            alternateClassNames: ["Lord Of Order"],
            skills: [2, 3, 1, 4],
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Penitence,
            helmEnhancement: HelmSpecial.None,
            weaponEnhancement: WeaponSpecial.Awe_Blast,
            tonic: "Fate Tonic",
            elixir: "Potent Destruction Elixir",
            combatPotion: "Potent Honor Potion",
        });
    }

    oracle(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Oracle",
            skills: [4, 2, 3, 1],
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Penitence,
            helmEnhancement: HelmSpecial.Forge,
            weaponEnhancement: WeaponSpecial.Valiance,
            tonic: "Fate Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Potent Honor Potion",
        });
    }

    guardian(): ClassPreset {
        return Object.assign(new ClassPreset(), {
            className: "Guardian",
            skills: [1, 2],
            skillMode: SkillEngineMode.Guardian,
            baseEnhancement: EnhancementType.Lucky,
            capeEnhancement: CapeSpecial.Lament,
            helmEnhancement: HelmSpecial.Vim,
            weaponEnhancement: WeaponSpecial.Ravenous,
            weaponEnhancementFallbacks: [WeaponSpecial.Spiral_Carve],
            tonic: "Fate Tonic",
            elixir: "Potent Battle Elixir",
            combatPotion: "Felicitous Philtre",
        });
    }

    explainFailure(message: string, includeCombat = false): string {
        if (bot.shouldExit) {
            return message;
        }

        try {
            const detail = bot.player.kicked
                ? "Kicked from the server."
                : !bot.player.loggedIn
                  ? "Disconnected."
                  : !bot.player.alive
                    ? "The player is dead."
                    : bot.map.loading
                      ? "The map is still loading."
                      : !bot.map.loaded
                        ? "The map is not fully loaded."
                        : !bot.player.loaded
                          ? "Player data is not loaded."
                          : includeCombat && bot.player.inCombat
                            ? "Still in combat."
                            : null;
            return detail == null ? message : `${message} ${detail}`;
        } catch (error) {
            rethrowIfStopped(error);

            return message;
        }
    }

    moveToHouse(logPrefix = "CoreLoneWolf", playerAlias: string | null = null): boolean {
        if (bot.shouldExit) {
            return false;
        }

        playerAlias ??= this.logArmyName(bot.player.username);
        let failure = bot.player.kicked
            ? `${playerAlias} cannot move to the house because the account was kicked.`
            : !bot.player.loggedIn
              ? `${playerAlias} cannot move to the house because the account is disconnected.`
              : null;
        const startedAt = Date.now();
        let attempts = 0;

        if (failure == null) {
            while (!bot.shouldExit && attempts < 2) {
                if (bot.player.kicked) {
                    failure = `${playerAlias} was kicked while waiting for the house.`;
                    break;
                }
                if (!bot.player.loggedIn) {
                    failure = `${playerAlias} disconnected while waiting for the house.`;
                    break;
                }
                if (attempts > 0 && !bot.player.alive) {
                    break;
                }

                const attemptStartedAt = Date.now();
                attempts++;
                bot.send.packet(`%xt%zm%house%1%${bot.player.username}%`);
                while (!bot.shouldExit) {
                    if (bot.player.kicked) {
                        failure = `${playerAlias} was kicked while waiting for the house.`;
                        break;
                    }
                    if (!bot.player.loggedIn) {
                        failure = `${playerAlias} disconnected while waiting for the house.`;
                        break;
                    }
                    if (bot.map.name?.toLowerCase() === "house"?.toLowerCase() && bot.map.loaded) {
                        if (bot.shouldExit) {
                            return false;
                        }
                        Core.logger(
                            `${playerAlias} reached the loaded house map after ${Date.now() - startedAt} ms.`,
                            logPrefix,
                        );
                        return true;
                    }
                    if (Date.now() - attemptStartedAt >= 10000) {
                        break;
                    }
                    bot.sleep(100);
                }

                if (bot.shouldExit || failure != null) {
                    break;
                }
                if (bot.map.name?.toLowerCase() === "house"?.toLowerCase() && bot.map.loaded) {
                    if (bot.shouldExit) {
                        return false;
                    }
                    Core.logger(
                        `${playerAlias} reached the loaded house map after ${Date.now() - startedAt} ms.`,
                        logPrefix,
                    );
                    return true;
                }
                if (attempts === 2) {
                    break;
                }

                const mapName = bot.map.name;
                if (
                    !mapName ||
                    mapName?.toLowerCase() === "house"?.toLowerCase() ||
                    mapName?.toLowerCase() === "buyhouse"?.toLowerCase() ||
                    bot.player.kicked ||
                    !bot.player.loggedIn ||
                    !bot.player.alive ||
                    bot.map.loading ||
                    !bot.map.loaded
                ) {
                    break;
                }

                const cell = bot.player.cell;
                const pad = bot.player.pad;
                if (!cell || !pad || bot.shouldExit) {
                    break;
                }
                try {
                    bot.map.jump(cell, pad, false, false);
                } catch (error) {
                    rethrowIfStopped(error);

                    failure = `${playerAlias} could not refresh the current cell before retrying the house.`;
                    break;
                }
            }
        }

        if (bot.shouldExit) {
            return false;
        }

        if (failure == null) {
            if (bot.player.kicked) {
                failure = `${playerAlias} was kicked while waiting for the house.`;
            } else if (!bot.player.loggedIn) {
                failure = `${playerAlias} disconnected while waiting for the house.`;
            } else if (bot.map.name?.toLowerCase() === "house"?.toLowerCase() && bot.map.loaded) {
                if (bot.shouldExit) {
                    return false;
                }
                Core.logger(
                    `${playerAlias} reached the loaded house map after ${Date.now() - startedAt} ms.`,
                    logPrefix,
                );
                return true;
            } else {
                const mapName = bot.map.name;
                failure =
                    mapName?.toLowerCase() === "buyhouse"?.toLowerCase()
                        ? `${playerAlias} reached buyhouse instead of house.`
                        : mapName?.toLowerCase() === "house"?.toLowerCase()
                          ? attempts === 2
                              ? `${playerAlias} reached the house map, but loading did not finish within 10 seconds on the retry.`
                              : `${playerAlias} reached the house map, but loading did not finish within 10 seconds.`
                          : attempts === 2
                            ? `${playerAlias} did not reach the house after 2 attempts.`
                            : `${playerAlias} did not reach the house within 10 seconds.`;

                if (
                    !(mapName?.toLowerCase() === "buyhouse"?.toLowerCase()) &&
                    !(mapName?.toLowerCase() === "house"?.toLowerCase())
                ) {
                    try {
                        if (!bot.player.alive) {
                            failure += " The player is dead.";
                        } else if (bot.player.inCombat) {
                            failure += " Still in combat.";
                        }
                    } catch (error) {
                        rethrowIfStopped(error);

                        // A diagnostic read must not replace the arrival failure.
                    }
                }
            }
        }

        Core.logger(failure, logPrefix, { messageBox: true, stopBot: true });
        return false;
    }

    equipClass(preset: ClassPreset): void {
        if (bot.shouldExit) {
            return;
        }

        if (preset == null || !preset.className?.trim()) {
            Core.logger("Class preset is invalid.", "EquipClass", { messageBox: true, stopBot: true });
            return;
        }

        const className = this.resolveClassName(preset);
        if (className == null) {
            Core.logger(
                `${[...[preset.className], ...preset.alternateClassNames].join(" or ")} is not in inventory or bank.`,
                "EquipClass",
                { messageBox: true, stopBot: true },
            );
            return;
        }

        if (bot.player.currentClass?.toLowerCase() === className?.toLowerCase()) {
            Core.logger(`${className} already equipped.`, "EquipClass");
            return;
        }

        if (!bot.inventory.contains(className)) {
            if (bot.flash.get<string>("ui.mcPopup.currentLabel") !== "Bank") {
                bot.bank.open();
            }

            bot.bank.load(false);
            bot.wait.forTrue(() => bot.bank.contains(className), 20);

            if (!bot.bank.contains(className)) {
                Core.logger(`${className} is not in inventory or bank.`, "EquipClass", {
                    messageBox: true,
                    stopBot: true,
                });
                return;
            }

            if (!Core.hasSpaceFor(bot.bank.getItem(className))) {
                Core.logger(
                    `${className} could not be moved from bank because no inventory slot is available.`,
                    "EquipClass",
                    { messageBox: true, stopBot: true },
                );
                return;
            }

            bot.bank.ensureToInventory(className);
            bot.wait.forTrue(() => bot.inventory.contains(className), 14);

            if (!bot.inventory.contains(className)) {
                Core.logger(this.explainFailure(`${className} could not be moved from bank.`), "EquipClass", {
                    messageBox: true,
                    stopBot: true,
                });
                return;
            }
        }

        Core.equip(className);
        bot.wait.forTrue(() => bot.player.currentClass?.toLowerCase() === className?.toLowerCase(), 40);

        if (bot.player.currentClass?.toLowerCase() === className?.toLowerCase()) {
            Core.logger(`${className} equipped.`, "EquipClass");
            return;
        }

        Core.logger(this.explainFailure(`${className} could not be equipped.`, true), "EquipClass", {
            messageBox: true,
            stopBot: true,
        });
    }

    private resolveClassName(preset: ClassPreset): string | null {
        const primaryClassName = preset.className;
        const alternateClassNames = preset.alternateClassNames;

        if (alternateClassNames.length === 0) {
            return primaryClassName;
        }

        if (
            bot.player.currentClass?.toLowerCase() === primaryClassName?.toLowerCase() ||
            bot.inventory.contains(primaryClassName)
        ) {
            return primaryClassName;
        }

        if (bot.flash.get<string>("ui.mcPopup.currentLabel") !== "Bank") {
            bot.bank.open();
        }

        bot.bank.load(false);
        bot.wait.forTrue(
            () => bot.bank.contains(primaryClassName) || alternateClassNames.some((name) => bot.bank.contains(name)),
            20,
        );

        if (bot.bank.contains(primaryClassName)) {
            return primaryClassName;
        }

        for (const alternateClassName of alternateClassNames) {
            if (
                bot.player.currentClass?.toLowerCase() === alternateClassName?.toLowerCase() ||
                bot.inventory.contains(alternateClassName) ||
                bot.bank.contains(alternateClassName)
            ) {
                return alternateClassName;
            }
        }

        return null;
    }

    startSkillEngine(
        skills: number[],
        roleName: string,
        taunter: boolean,
        logPrefix: string,
        mode: SkillEngineMode = SkillEngineMode.Simple,
        useSurvivalSkill = true,
        maintainedPotion: string | null = null,
        kingsEchoManaThreshold = 12,
        blockedStrictSkill = 0,
        blockedStrictSkillSelfAura = "",
        blockedSimpleSkill = 0,
        blockedSimpleSkillTargetAura = "",
        blockedStrictSkillTargetAura = "",
    ): void {
        if (!this.validateFunctionBasedSkillsDisabled()) {
            return;
        }

        if (this.skillEngineRunning) {
            return;
        }

        this.skillList = skills;
        this.role = roleName;
        this.isTaunter = taunter;
        this.logPrefix = logPrefix;
        this.skillEngineMode = mode;
        this.useSurvivalSkill = useSurvivalSkill;
        this.maintainedPotion = maintainedPotion;
        this.kingsEchoManaThreshold = kingsEchoManaThreshold;
        this.blockedStrictSkill = blockedStrictSkill;
        this.blockedStrictSkillSelfAura = blockedStrictSkillSelfAura;
        this.blockedStrictSkillTargetAura = blockedStrictSkillTargetAura;
        this.blockedSimpleSkill = blockedSimpleSkill;
        this.blockedSimpleSkillTargetAura = blockedSimpleSkillTargetAura;
        this.skillIndex = 0;
        if (mode === SkillEngineMode.ShadowStalkerOfTime) {
            this.resetSSOT();
        }
        if (mode === SkillEngineMode.ArchivistOfTime) {
            this.resetArchivist();
        }
        if (mode === SkillEngineMode.DracoKnight) {
            this.resetDracoKnight();
        }
        if (mode === SkillEngineMode.MartialArtist) {
            this.resetMartialArtist();
        }
        if (mode === SkillEngineMode.ChronoShadowHunterStable) {
            this.resetCSSNormalMode();
        }
        if (mode === SkillEngineMode.ChronoShadowHunterGunslinger) {
            this.resetCSSGunslingerMode();
        }
        this.skillEnginePaused = 0;
        this.ordinarySkillsSuppressed = 0;
        this.pendingAbsolutePriorityTauntMapId = 0;
        this.pendingTauntMapId = 0;
        this.pendingImmediateTauntMapId = 0;
        this.pendingSkillFiveMapId = 0;
        this.pendingImmediateSkillFiveMapId = 0;
        this.pendingAbsolutePrioritySkill = 0;
        this.pendingPrioritySkill = 0;
        this.pendingTargetedPrioritySkill = null;
        this.pendingLimitedPrioritySkill = null;
        this.shamanSkillThreeEnabled = true;
        this.skillEngineRunning = true;

        bot.events.off("scriptStopping", this.onScriptStopping);
        bot.events.on("scriptStopping", this.onScriptStopping);

        tasks.start(CoreLoneWolf.skillTask, () => this.skillEngineLoop());
    }

    stopSkillEngine(): void {
        this.skillEngineRunning = false;
        bot.events.off("scriptStopping", this.onScriptStopping);

        // C# joins the skill thread (up to 2 s); the task ends here, running its `finally`.
        tasks.cancel(CoreLoneWolf.skillTask);
        this.skillEnginePaused = 0;
        this.ordinarySkillsSuppressed = 0;
        this.pendingAbsolutePriorityTauntMapId = 0;
        this.pendingTauntMapId = 0;
        this.pendingImmediateTauntMapId = 0;
        this.pendingSkillFiveMapId = 0;
        this.pendingImmediateSkillFiveMapId = 0;
        this.pendingAbsolutePrioritySkill = 0;
        this.pendingPrioritySkill = 0;
        this.pendingTargetedPrioritySkill = null;
        this.pendingLimitedPrioritySkill = null;
        this.shamanSkillThreeEnabled = true;
        this.maintainedPotion = null;
        this.blockedStrictSkill = 0;
        this.blockedStrictSkillSelfAura = "";
        this.blockedStrictSkillTargetAura = "";
        this.blockedSimpleSkill = 0;
        this.blockedSimpleSkillTargetAura = "";
    }

    setSkillEngineSkills(skills: number[]): void {
        if (skills.length === 0) {
            return;
        }

        this.skillList = skills;
        this.skillIndex = 0;
    }

    /**
     * Counts the server packets of one of `commands` that hold every text of `texts`
     * (`hasPacketDetection`). C#'s four overloads (a command or commands, a text or texts) are one.
     */
    startPacketDetector(commands: string | string[], texts: string | string[]): boolean {
        return this.startPacketDetectorWith(
            typeof commands === "string" ? [commands] : commands,
            typeof texts === "string" ? [texts] : texts,
            false,
        );
    }

    startPacketChoiceDetector(
        command: string,
        choices: string[],
        pauseSkillChoice = "",
        pauseEveryChoice = false,
    ): boolean {
        return this.startPacketDetectorWith([command], choices, true, pauseSkillChoice, pauseEveryChoice);
    }

    private startPacketDetectorWith(
        commands: string[],
        texts: string[],
        choiceMode: boolean,
        pauseSkillChoice = "",
        pauseEveryChoice = false,
    ): boolean {
        this.stopPacketDetector();

        const validCommands = [
            ...new Set((commands ?? []).filter((command) => !!command?.trim()).map((command) => command.trim())),
        ];

        const validTexts = [...new Set((texts ?? []).filter((text) => !!text?.trim()))];

        if (validCommands.length === 0 || validTexts.length === 0) {
            Core.logger("Packet detector command and text are required.", "CoreLoneWolf");
            return false;
        }

        this.packetCommands = validCommands;
        this.packetSelectedCommand = "";
        this.packetTexts = validTexts;
        this.packetSelectedPacket = "";
        this.packetChoiceMode = choiceMode;
        this.packetSelectedChoice = "";
        this.packetSkillPauseChoice = choiceMode && validTexts.includes(pauseSkillChoice) ? pauseSkillChoice : "";
        this.packetPauseEveryChoice = choiceMode && pauseEveryChoice;
        exchange(this.packetDetectionCount, (v) => (this.packetDetectionCount = v), 0);
        this.packetDetectorRunning = true;

        bot.events.off("extensionPacket", this.packetDetectorFlashCall);
        bot.events.on("extensionPacket", this.packetDetectorFlashCall);
        bot.events.off("scriptStopping", this.onPacketDetectorStopping);
        bot.events.on("scriptStopping", this.onPacketDetectorStopping);
        return true;
    }

    hasPacketDetection(detectionNumber: number): boolean {
        return this.packetDetectorRunning && detectionNumber > 0 && this.packetDetectionCount >= detectionNumber;
    }

    getPacketDetectorCommand(): string {
        return this.packetSelectedCommand;
    }

    getPacketDetectorPacket(): string {
        return this.packetSelectedPacket;
    }

    getPacketDetectorChoice(): string {
        return this.packetChoiceMode ? this.packetSelectedChoice : "";
    }

    stopPacketDetector(): void {
        this.packetDetectorRunning = false;
        bot.events.off("extensionPacket", this.packetDetectorFlashCall);
        bot.events.off("scriptStopping", this.onPacketDetectorStopping);
        this.packetCommands = [];
        this.packetSelectedCommand = "";
        this.packetTexts = [];
        this.packetSelectedPacket = "";
        this.packetChoiceMode = false;
        this.packetSelectedChoice = "";
        this.packetSkillPauseChoice = "";
        this.packetPauseEveryChoice = false;
        this.skillEnginePaused = 0;
        exchange(this.packetDetectionCount, (v) => (this.packetDetectionCount = v), 0);
    }

    resumeSkillEngine(): void {
        this.skillEnginePaused = 0;
    }

    setOrdinarySkillsSuppressed(suppressed: boolean): void {
        this.ordinarySkillsSuppressed = suppressed ? 1 : 0;
    }

    requestTaunt(mapId: number): void {
        if (mapId > 0) {
            this.pendingTauntMapId = mapId;
        }
    }

    requestAbsolutePriorityTaunt(mapId: number): void {
        if (mapId > 0) {
            this.pendingAbsolutePriorityTauntMapId = mapId;
        }
    }

    hasPendingAbsolutePriorityTaunt(): boolean {
        return this.pendingAbsolutePriorityTauntMapId > 0;
    }

    requestImmediateTaunt(mapId: number): boolean {
        if (
            !bot.player.alive ||
            !this.isTaunterRole() ||
            mapId <= 0 ||
            this.getMonsterHP(mapId) <= 0 ||
            !bot.skills.canUseSkill(5)
        ) {
            return false;
        }

        this.pendingImmediateTauntMapId = mapId;
        return true;
    }

    requestSkillFive(mapId: number): void {
        if (mapId > 0) {
            this.pendingSkillFiveMapId = mapId;
        }
    }

    requestAbsolutePrioritySkill(skill: number): void {
        if (skill >= 1 && skill <= 5) {
            this.pendingAbsolutePrioritySkill = skill;
        }
    }

    hasPendingAbsolutePrioritySkill(): boolean {
        return this.pendingAbsolutePrioritySkill > 0;
    }

    requestPrioritySkill(skill: number): void {
        if (skill >= 1 && skill <= 4) {
            this.pendingPrioritySkill = skill;
        }
    }

    hasPendingPrioritySkill(): boolean {
        return this.pendingPrioritySkill > 0;
    }

    requestLimitedPrioritySkill(skill: number, uses: number): void {
        if (skill < 1 || skill > 4 || uses <= 0) {
            return;
        }

        this.pendingLimitedPrioritySkill = new LimitedPrioritySkillRequest(skill, uses);
    }

    hasPendingLimitedPrioritySkill(): boolean {
        return this.pendingLimitedPrioritySkill != null;
    }

    requestTargetedPrioritySkill(skill: number, targetMapId: number, returnMapId: number): boolean {
        if (skill < 1 || skill > 4 || targetMapId <= 0 || returnMapId <= 0) {
            return false;
        }

        const request = new TargetedPrioritySkillRequest(skill, targetMapId, returnMapId);
        const accepted =
            compareExchange(
                this.pendingTargetedPrioritySkill,
                (v) => (this.pendingTargetedPrioritySkill = v),
                request,
                null,
            ) == null;
        return accepted;
    }

    hasPendingTargetedPrioritySkill(): boolean {
        return this.pendingTargetedPrioritySkill != null;
    }

    setShamanSkillThreeEnabled(enabled: boolean): void {
        this.shamanSkillThreeEnabled = enabled;
    }

    requestImmediateSkillFive(mapId: number): boolean {
        if (!bot.player.alive || mapId <= 0 || this.getMonsterHP(mapId) <= 0 || !bot.skills.canUseSkill(5)) {
            return false;
        }

        this.pendingImmediateSkillFiveMapId = mapId;
        return true;
    }

    private onScriptStopping = (exception: EventMap["scriptStopping"]): boolean => {
        this.stopSkillEngine();
        return true;
    };

    private onPacketDetectorStopping = (exception: EventMap["scriptStopping"]): boolean => {
        this.stopPacketDetector();
        return true;
    };

    /**
     * C# listens to `Bot.Flash.FlashCall`'s "pext" and searches the raw packet; Turu's
     * `extensionPacket` event is that packet (`{"params":{"type","dataObj"}}`), searched as JSON.
     * The texts are matched against `JSON.stringify` of it, so `"cmd":"x"` markers match as in C#.
     */
    private packetDetectorFlashCall = (event: EventMap["extensionPacket"]): void => {
        if (!this.packetDetectorRunning || event == null) {
            return;
        }
        const packet = JSON.stringify(event);

        const texts = this.packetTexts;
        const choiceMode = this.packetChoiceMode;
        let selectedChoice = "";

        if (texts.length === 0) {
            return;
        }

        if (choiceMode) {
            for (const text of texts) {
                if (!packet.includes(text)) {
                    continue;
                }

                selectedChoice = text;
                break;
            }

            if (selectedChoice.length === 0) {
                return;
            }
        } else if (texts.some((text) => !packet.includes(text))) {
            return;
        }

        if (!this.packetDetectorRunning) {
            return;
        }

        let selectedCommand = this.packetSelectedCommand;
        if (selectedCommand.length === 0) {
            for (const command of this.packetCommands) {
                const commandMarker = `"cmd":"${command}"`;
                if (!packet.includes(commandMarker)) {
                    continue;
                }

                compareExchange(this.packetSelectedCommand, (v) => (this.packetSelectedCommand = v), command, "");
                selectedCommand = this.packetSelectedCommand;
                break;
            }
        }

        if (
            selectedCommand.length === 0 ||
            !packet.includes(`"cmd":"${selectedCommand}"`) ||
            !this.packetDetectorRunning
        ) {
            return;
        }

        if (choiceMode) {
            if (this.packetPauseEveryChoice || selectedChoice === this.packetSkillPauseChoice) {
                this.skillEnginePaused = 1;
            }

            this.packetSelectedChoice = selectedChoice;
        }

        this.packetSelectedPacket = packet;
        ++this.packetDetectionCount;
    };

    /** The skill engine: C#'s `SkillEngineLoop` thread, here the `LoneWolfSkills` task. */
    private *skillEngineLoop(): Generator<TaskStep, void, boolean> {
        try {
            while (this.skillEngineRunning && !bot.shouldExit) {
                if (!bot.player.alive) {
                    if (this.skillEngineMode === SkillEngineMode.ShadowStalkerOfTime) {
                        this.resetSSOT();
                    }
                    if (this.skillEngineMode === SkillEngineMode.ArchivistOfTime) {
                        this.resetArchivist();
                    }
                    if (this.skillEngineMode === SkillEngineMode.DracoKnight) {
                        this.resetDracoKnight();
                    }
                    if (this.skillEngineMode === SkillEngineMode.MartialArtist) {
                        this.resetMartialArtist();
                    }

                    if (
                        this.skillEngineMode === SkillEngineMode.Simple ||
                        this.skillEngineMode === SkillEngineMode.LightCasterHealing ||
                        this.skillEngineMode === SkillEngineMode.ArchFiendNoHealing ||
                        this.skillEngineMode === SkillEngineMode.VoidHighlord ||
                        this.skillEngineMode === SkillEngineMode.ChaosAvengerOptimized ||
                        this.skillEngineMode === SkillEngineMode.ScionOfFlames ||
                        this.skillEngineMode === SkillEngineMode.GreatThief ||
                        this.skillEngineMode === SkillEngineMode.ChaosShaper ||
                        this.skillEngineMode === SkillEngineMode.KathoolAdeptOptimized
                    ) {
                        this.skillIndex = 0;
                    }

                    this.pendingAbsolutePrioritySkill = 0;
                    this.pendingPrioritySkill = 0;
                    this.pendingLimitedPrioritySkill = null;
                }

                const absolutePriorityTauntMapId = this.pendingAbsolutePriorityTauntMapId;
                if (absolutePriorityTauntMapId > 0) {
                    if (
                        !bot.player.alive ||
                        !this.isTaunterRole() ||
                        this.getMonsterHP(absolutePriorityTauntMapId) <= 0
                    ) {
                        compareExchange(
                            this.pendingAbsolutePriorityTauntMapId,
                            (v) => (this.pendingAbsolutePriorityTauntMapId = v),
                            0,
                            absolutePriorityTauntMapId,
                        );
                        this.skillEnginePaused = 0;
                    } else {
                        const target = bot.player.target;
                        if (!bot.player.hasTarget || target?.mapId !== absolutePriorityTauntMapId || target?.hp <= 0) {
                            bot.combat.attack(absolutePriorityTauntMapId);
                        } else if (bot.skills.canUseSkill(5) && bot.skills.useSkill(5)) {
                            compareExchange(
                                this.pendingAbsolutePriorityTauntMapId,
                                (v) => (this.pendingAbsolutePriorityTauntMapId = v),
                                0,
                                absolutePriorityTauntMapId,
                            );
                            this.skillEnginePaused = 0;
                            Core.logger(`${this.logPrefix} ${this.role} used absolute priority taunt.`);
                        }
                    }

                    yield CoreLoneWolf.skillPollDelay;
                    continue;
                }

                if (this.skillEnginePaused > 0) {
                    yield CoreLoneWolf.skillPollDelay;
                    continue;
                }

                if (bot.combat.stopAttacking) {
                    yield CoreLoneWolf.skillPollDelay;
                    continue;
                }

                const absolutePrioritySkill = this.pendingAbsolutePrioritySkill;
                const absolutePrioritySkillPending = absolutePrioritySkill > 0;
                const absolutePrioritySkillUsed =
                    absolutePrioritySkillPending &&
                    bot.skills.canUseSkill(absolutePrioritySkill) &&
                    bot.skills.useSkill(absolutePrioritySkill);

                if (absolutePrioritySkillUsed) {
                    compareExchange(
                        this.pendingAbsolutePrioritySkill,
                        (v) => (this.pendingAbsolutePrioritySkill = v),
                        0,
                        absolutePrioritySkill,
                    );
                    Core.logger(
                        `${this.logPrefix} ${this.role} used absolute priority skill ${absolutePrioritySkill}.`,
                    );
                }

                if (absolutePrioritySkillPending) {
                    yield CoreLoneWolf.skillPollDelay;
                    continue;
                }

                const tauntMapId = exchange(this.pendingTauntMapId, (v) => (this.pendingTauntMapId = v), 0);

                if (tauntMapId > 0) {
                    yield* this.tauntMonster(tauntMapId);
                } else {
                    const immediateTauntMapId = exchange(
                        this.pendingImmediateTauntMapId,
                        (v) => (this.pendingImmediateTauntMapId = v),
                        0,
                    );
                    const immediateTauntUsed =
                        immediateTauntMapId > 0 && (yield* this.immediateTaunt(immediateTauntMapId));

                    if (this.ordinarySkillsSuppressed > 0) {
                        yield CoreLoneWolf.skillPollDelay;
                        continue;
                    }

                    const skillFiveMapId = immediateTauntUsed
                        ? 0
                        : exchange(this.pendingSkillFiveMapId, (v) => (this.pendingSkillFiveMapId = v), 0);
                    const skillFiveUsed =
                        !immediateTauntUsed && skillFiveMapId > 0 && (yield* this.useSkillFive(skillFiveMapId));

                    const immediateSkillFiveMapId =
                        immediateTauntUsed || skillFiveUsed
                            ? 0
                            : exchange(
                                  this.pendingImmediateSkillFiveMapId,
                                  (v) => (this.pendingImmediateSkillFiveMapId = v),
                                  0,
                              );
                    const immediateSkillFiveUsed =
                        !immediateTauntUsed &&
                        !skillFiveUsed &&
                        immediateSkillFiveMapId > 0 &&
                        (yield* this.immediateSkillFive(immediateSkillFiveMapId));

                    const targetedPrioritySkill = this.pendingTargetedPrioritySkill;
                    const targetedPrioritySkillPending = targetedPrioritySkill != null;
                    const targetedPrioritySkillUsed =
                        !immediateTauntUsed &&
                        !skillFiveUsed &&
                        !immediateSkillFiveUsed &&
                        targetedPrioritySkill != null &&
                        (yield* this.useTargetedPrioritySkill(targetedPrioritySkill));

                    if (targetedPrioritySkillUsed) {
                        compareExchange(
                            this.pendingTargetedPrioritySkill,
                            (v) => (this.pendingTargetedPrioritySkill = v),
                            null,
                            targetedPrioritySkill,
                        );
                    }

                    const prioritySkill = this.pendingPrioritySkill;
                    const prioritySkillPending = prioritySkill > 0;
                    const prioritySkillUsed =
                        !immediateTauntUsed &&
                        !skillFiveUsed &&
                        !immediateSkillFiveUsed &&
                        !targetedPrioritySkillPending &&
                        prioritySkillPending &&
                        bot.skills.canUseSkill(prioritySkill) &&
                        bot.skills.useSkill(prioritySkill);

                    if (prioritySkillUsed) {
                        compareExchange(
                            this.pendingPrioritySkill,
                            (v) => (this.pendingPrioritySkill = v),
                            0,
                            prioritySkill,
                        );
                        Core.logger(`${this.logPrefix} ${this.role} used priority skill ${prioritySkill}.`);
                    }

                    const limitedPrioritySkill = this.pendingLimitedPrioritySkill;
                    const limitedPrioritySkillUsed =
                        !immediateTauntUsed &&
                        !skillFiveUsed &&
                        !immediateSkillFiveUsed &&
                        !targetedPrioritySkillPending &&
                        !prioritySkillPending &&
                        limitedPrioritySkill != null &&
                        bot.skills.canUseSkill(limitedPrioritySkill.skill) &&
                        bot.skills.useSkill(limitedPrioritySkill.skill);

                    if (limitedPrioritySkillUsed && limitedPrioritySkill != null) {
                        const replacement =
                            limitedPrioritySkill.remainingUses > 1
                                ? new LimitedPrioritySkillRequest(
                                      limitedPrioritySkill.skill,
                                      limitedPrioritySkill.remainingUses - 1,
                                  )
                                : null;
                        const observed = compareExchange(
                            this.pendingLimitedPrioritySkill,
                            (v) => (this.pendingLimitedPrioritySkill = v),
                            replacement,
                            limitedPrioritySkill,
                        );
                        const remainingUses =
                            observed === limitedPrioritySkill
                                ? (replacement?.remainingUses ?? 0)
                                : (this.pendingLimitedPrioritySkill?.remainingUses ?? 0);
                        Core.logger(
                            `${this.logPrefix} ${this.role} used limited priority skill ${limitedPrioritySkill.skill}. ${remainingUses} uses remain.`,
                        );
                    }

                    const potionUsed =
                        !immediateTauntUsed &&
                        !skillFiveUsed &&
                        !immediateSkillFiveUsed &&
                        !targetedPrioritySkillPending &&
                        !prioritySkillPending &&
                        !limitedPrioritySkillUsed &&
                        !!this.maintainedPotion?.trim() &&
                        this.maintainPotion(this.maintainedPotion);

                    if (
                        !immediateTauntUsed &&
                        !skillFiveUsed &&
                        !immediateSkillFiveUsed &&
                        !targetedPrioritySkillPending &&
                        !prioritySkillPending &&
                        !limitedPrioritySkillUsed &&
                        !potionUsed
                    ) {
                        if (this.skillEngineMode === SkillEngineMode.Strict) {
                            this.skillIndex = this.strictSkillEngine(this.skillList, this.skillIndex);
                        } else if (this.skillEngineMode === SkillEngineMode.KingsEcho) {
                            this.kingsEchoSkillEngine(this.useSurvivalSkill);
                        } else if (this.skillEngineMode === SkillEngineMode.ArcanaInvoker) {
                            this.arcanaInvokerSkillEngine();
                        } else if (this.skillEngineMode === SkillEngineMode.ChronoShadowHunterStable) {
                            this.cssNormalMode();
                        } else if (this.skillEngineMode === SkillEngineMode.ChronoShadowHunterGunslinger) {
                            this.cssGunslingerMode();
                        } else if (this.skillEngineMode === SkillEngineMode.Shaman) {
                            this.shamanSkillEngine();
                        } else if (this.skillEngineMode === SkillEngineMode.LightCasterHealing) {
                            this.lightCasterHealingSkillEngine();
                        } else if (this.skillEngineMode === SkillEngineMode.ArchFiendNoHealing) {
                            this.archFiendNoHealingSkillEngine();
                        } else if (this.skillEngineMode === SkillEngineMode.VoidHighlord) {
                            this.voidHighlordSkillEngine();
                        } else if (this.skillEngineMode === SkillEngineMode.ChaosAvengerOptimized) {
                            this.chaosAvengerOptimizedSkillEngine();
                        } else if (this.skillEngineMode === SkillEngineMode.ScionOfFlames) {
                            this.scionOfFlamesSkillEngine();
                        } else if (this.skillEngineMode === SkillEngineMode.Guardian) {
                            this.guardianSkillEngine();
                        } else if (this.skillEngineMode === SkillEngineMode.ShadowStalkerOfTime) {
                            this.ssotSkillEngine();
                        } else if (this.skillEngineMode === SkillEngineMode.GreatThief) {
                            this.greatThiefSkillEngine();
                        } else if (this.skillEngineMode === SkillEngineMode.ArchivistOfTime) {
                            this.archivistSkillEngine();
                        } else if (this.skillEngineMode === SkillEngineMode.DracoKnight) {
                            this.dracoKnightSkillEngine();
                        } else if (this.skillEngineMode === SkillEngineMode.MartialArtist) {
                            this.martialArtistSkillEngine();
                        } else if (this.skillEngineMode === SkillEngineMode.ChaosShaper) {
                            this.chaosShaperSkillEngine();
                        } else if (this.skillEngineMode === SkillEngineMode.KathoolAdeptOptimized) {
                            this.kathoolAdeptOptimizedSkillEngine();
                        } else if (
                            this.skillEngineMode === SkillEngineMode.Simple &&
                            this.blockedSimpleSkill >= 1 &&
                            this.blockedSimpleSkill <= 4 &&
                            !!this.blockedSimpleSkillTargetAura?.trim()
                        ) {
                            this.auraBlockedSimpleSkillEngine();
                        } else {
                            this.customSkillEngine();
                        }
                    }
                }

                yield this.skillEngineMode === SkillEngineMode.ChronoShadowHunterGunslinger && this.cssGunslingerFiring
                    ? CoreLoneWolf.cssGunslingerFirePollDelay
                    : CoreLoneWolf.skillPollDelay;
            }
        } catch (ex) {
            rethrowIfStopped(ex);

            Core.logger(`${this.logPrefix} skill engine stopped: ${String(ex)}`);
        } finally {
            this.skillEngineRunning = false;
            this.skillEnginePaused = 0;
            this.ordinarySkillsSuppressed = 0;
            this.pendingAbsolutePriorityTauntMapId = 0;
            this.pendingTauntMapId = 0;
            this.pendingImmediateTauntMapId = 0;
            this.pendingSkillFiveMapId = 0;
            this.pendingImmediateSkillFiveMapId = 0;
            this.pendingAbsolutePrioritySkill = 0;
            this.pendingPrioritySkill = 0;
            this.pendingTargetedPrioritySkill = null;
            this.pendingLimitedPrioritySkill = null;
            this.shamanSkillThreeEnabled = true;
            this.maintainedPotion = null;
        }
    }

    private *useTargetedPrioritySkill(request: TargetedPrioritySkillRequest): Generator<TaskStep, boolean, boolean> {
        if (!bot.player.alive || request.targetMapId <= 0 || this.getMonsterHP(request.targetMapId) <= 0) {
            return false;
        }

        bot.combat.attack(request.targetMapId);
        yield 100;

        if (
            !bot.player.alive ||
            !bot.player.hasTarget ||
            bot.player.target?.mapId !== request.targetMapId ||
            (bot.player.target?.hp ?? 1) <= 0 ||
            !bot.skills.canUseSkill(request.skill) ||
            !bot.skills.useSkill(request.skill)
        ) {
            return false;
        }

        Core.logger(
            `${this.logPrefix} ${this.role} used targeted priority skill ${request.skill} on MapID ${request.targetMapId}.`,
        );

        if (this.getMonsterHP(request.returnMapId) > 0) {
            bot.combat.attack(request.returnMapId);
        }

        return true;
    }

    private *immediateTaunt(mapId: number): Generator<TaskStep, boolean, boolean> {
        if (
            !bot.player.alive ||
            !this.isTaunterRole() ||
            mapId <= 0 ||
            this.getMonsterHP(mapId) <= 0 ||
            !bot.skills.canUseSkill(5)
        ) {
            return false;
        }

        bot.combat.attack(mapId);
        yield 100;

        if (
            !bot.player.hasTarget ||
            bot.player.target?.mapId !== mapId ||
            (bot.player.target?.hp ?? 1) <= 0 ||
            !bot.skills.canUseSkill(5)
        ) {
            return false;
        }

        if (!bot.skills.useSkill(5)) {
            return false;
        }

        Core.logger(`${this.logPrefix} ${this.role} used immediate taunt.`);
        return true;
    }

    private *useSkillFive(mapId: number): Generator<TaskStep, boolean, boolean> {
        if (!bot.player.alive || mapId <= 0 || this.getMonsterHP(mapId) <= 0) {
            return false;
        }

        bot.combat.attack(mapId);
        yield 100;

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return false;
        }

        if (bot.skills.canUseSkill(5)) {
            bot.skills.useSkill(5);
            Core.logger(`${this.logPrefix} ${this.role} used skill 5 immediately.`);
            yield 150;
            bot.combat.attack(mapId);
            return true;
        }

        Core.logger(`${this.logPrefix} ${this.role} waiting 750ms for skill 5.`);
        yield 750;

        if (!bot.player.alive || this.getMonsterHP(mapId) <= 0) {
            return false;
        }

        bot.combat.attack(mapId);
        yield 100;

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return false;
        }

        if (bot.skills.canUseSkill(5)) {
            bot.skills.useSkill(5);
            Core.logger(`${this.logPrefix} ${this.role} used skill 5 after 750ms.`);
            yield 150;
            bot.combat.attack(mapId);
            return true;
        }

        Core.logger(`${this.logPrefix} ${this.role} could not use skill 5 after 750ms.`);
        bot.combat.attack(mapId);
        return false;
    }

    private *immediateSkillFive(mapId: number): Generator<TaskStep, boolean, boolean> {
        if (!bot.player.alive || mapId <= 0 || this.getMonsterHP(mapId) <= 0 || !bot.skills.canUseSkill(5)) {
            return false;
        }

        bot.combat.attack(mapId);
        yield 100;

        if (
            !bot.player.hasTarget ||
            bot.player.target?.mapId !== mapId ||
            (bot.player.target?.hp ?? 1) <= 0 ||
            !bot.skills.canUseSkill(5)
        ) {
            return false;
        }

        if (!bot.skills.useSkill(5)) {
            return false;
        }

        Core.logger(`${this.logPrefix} ${this.role} used immediate skill 5.`);
        return true;
    }

    /** C#'s `TauntMonster`: a step of the skill task (it waits with `yield`). */
    *tauntMonster(mapId: number): Generator<TaskStep, boolean, boolean> {
        if (!bot.player.alive || !this.isTaunterRole() || mapId <= 0 || this.getMonsterHP(mapId) <= 0) {
            return false;
        }

        bot.combat.attack(mapId);
        yield 100;

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return false;
        }

        if (bot.skills.canUseSkill(5)) {
            bot.skills.useSkill(5);
            Core.logger(`${this.logPrefix} ${this.role} used taunt immediately.`);
            yield 150;
            bot.combat.attack(mapId);
            return true;
        }

        Core.logger(`${this.logPrefix} ${this.role} waiting 750ms for skill 5.`);
        yield 750;

        if (!bot.player.alive || this.getMonsterHP(mapId) <= 0) {
            return false;
        }

        bot.combat.attack(mapId);
        yield 100;

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return false;
        }

        if (bot.skills.canUseSkill(5)) {
            bot.skills.useSkill(5);
            Core.logger(`${this.logPrefix} ${this.role} used taunt after 750ms.`);
            yield 150;
            bot.combat.attack(mapId);
            return true;
        }

        Core.logger(`${this.logPrefix} ${this.role} could not use skill 5 after 750ms.`);
        bot.combat.attack(mapId);
        return false;
    }

    customSkillEngine(): void {
        if (!bot.player.alive) {
            return;
        }

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return;
        }

        const skillList = this.getSkillList();

        if (skillList.length === 0) {
            return;
        }

        for (let offset = 0; offset < skillList.length; offset++) {
            const index = (this.skillIndex + offset) % skillList.length;
            const skill = skillList[index];

            if (!bot.skills.canUseSkill(skill)) {
                continue;
            }

            bot.skills.useSkill(skill);
            this.skillIndex = (index + 1) % skillList.length;
            return;
        }
    }

    private kathoolAdeptOptimizedSkillEngine(): void {
        if (!bot.player.alive) {
            return;
        }

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return;
        }

        const skills = this.getSkillList();

        if (skills.length === 0) {
            return;
        }

        const feedingStacks = bot.self.getAuraStacks("Feeding");

        for (let offset = 0; offset < skills.length; offset++) {
            const index = (this.skillIndex + offset) % skills.length;
            const skill = skills[index];

            if ((index === 0 && feedingStacks > 0) || (index === 1 && feedingStacks < 10)) {
                continue;
            }

            if (!bot.skills.canUseSkill(skill)) {
                continue;
            }

            bot.skills.useSkill(skill);
            this.skillIndex = (index + 1) % skills.length;
            return;
        }
    }

    private auraBlockedSimpleSkillEngine(): void {
        if (!bot.player.alive) {
            return;
        }

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return;
        }

        const skills = this.getSkillList();

        if (skills.length === 0) {
            return;
        }

        const blockSkill = bot.target.getAura(this.blockedSimpleSkillTargetAura) != null;

        for (let offset = 0; offset < skills.length; offset++) {
            const index = (this.skillIndex + offset) % skills.length;
            const skill = skills[index];

            if (blockSkill && skill === this.blockedSimpleSkill) {
                continue;
            }

            if (!bot.skills.canUseSkill(skill)) {
                continue;
            }

            bot.skills.useSkill(skill);
            this.skillIndex = (index + 1) % skills.length;
            return;
        }
    }

    private guardianSkillEngine(): void {
        if (!bot.player.alive) {
            return;
        }

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return;
        }

        const guardianSpirit = Math.max(
            0,
            ...bot.self.auras
                .filter((aura) => aura.name.toLowerCase() === CoreLoneWolf.guardianSpiritAura.toLowerCase())
                .map((aura) => aura.value),
        );
        const skillFourBlocked =
            this.blockedSimpleSkill === 4 &&
            !!this.blockedSimpleSkillTargetAura?.trim() &&
            bot.target.getAura(this.blockedSimpleSkillTargetAura) != null;

        if (guardianSpirit >= 15 && !skillFourBlocked) {
            if (bot.skills.canUseSkill(4)) {
                bot.skills.useSkill(4);
            }

            return;
        }

        this.customSkillEngine();
    }

    private chaosAvengerOptimizedSkillEngine(): void {
        if (!bot.player.alive) {
            return;
        }

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return;
        }

        if (bot.target.getAura("Branded") != null) {
            return;
        }

        this.customSkillEngine();
    }

    private scionOfFlamesSkillEngine(): void {
        if (!bot.player.alive) {
            return;
        }

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return;
        }

        if (bot.self.hasActiveAura("Fuel The Flame")) {
            if (bot.skills.canUseSkill(4)) {
                bot.skills.useSkill(4);
            }

            return;
        }

        this.customSkillEngine();
    }

    private greatThiefSkillEngine(): void {
        if (!bot.player.alive) {
            return;
        }

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return;
        }

        const stealth = bot.self.getAuraSnapshot("Stealth");
        if (stealth == null || stealth.remainingTime <= 1) {
            if (bot.skills.canUseSkill(2)) {
                bot.skills.useSkill(2);
            }

            return;
        }

        this.customSkillEngine();
    }

    private lightCasterHealingSkillEngine(): void {
        if (bot.skills.canUseSkill(3)) {
            bot.skills.useSkill(3);
            return;
        }

        this.customSkillEngine();
    }

    private archFiendNoHealingSkillEngine(): void {
        if (!bot.self.hasActiveAura(CoreLoneWolf.archFiendsMarkAura) && bot.skills.canUseSkill(3)) {
            bot.skills.useSkill(3);
            return;
        }

        this.customSkillEngine();
    }

    private voidHighlordSkillEngine(): void {
        const healthPercentage = bot.player.maxHealth > 0 ? (bot.player.health / bot.player.maxHealth) * 100 : 0;

        if (healthPercentage > 90 && bot.skills.canUseSkill(3) && bot.skills.useSkill(3)) {
            return;
        }

        this.customSkillEngine();
    }

    directSkillEngine(): void {
        if (!bot.player.alive) {
            return;
        }

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return;
        }

        const skillList = this.getSkillList();

        if (skillList.length === 0) {
            return;
        }

        for (let offset = 0; offset < skillList.length; offset++) {
            const index = (this.skillIndex + offset) % skillList.length;

            if (!bot.skills.useSkill(skillList[index])) {
                continue;
            }

            this.skillIndex = (index + 1) % skillList.length;
            return;
        }
    }

    /** Uses `skills[index]` when it can; returns the next index (C# takes `ref int index`). */
    strictSkillEngine(skills: number[], index: number): number {
        if (!bot.player.alive) {
            return 0;
        }

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return index;
        }

        if (skills.length === 0) {
            return index;
        }

        const skill = skills[index];

        if (
            skill === this.blockedStrictSkill &&
            ((!!this.blockedStrictSkillSelfAura?.trim() && bot.self.hasActiveAura(this.blockedStrictSkillSelfAura)) ||
                (!!this.blockedStrictSkillTargetAura?.trim() &&
                    bot.target.getAura(this.blockedStrictSkillTargetAura) != null))
        ) {
            return (index + 1) % skills.length;
        }

        if (!bot.skills.canUseSkill(skill)) {
            return index;
        }

        if (!bot.skills.useSkill(skill)) {
            return index;
        }

        return (index + 1) % skills.length;
    }

    private resetSSOT(): void {
        this.ssotOpeningComplete = false;
        this.skillIndex = 0;
    }

    private ssotSkillEngine(): void {
        if (!bot.player.alive) {
            this.resetSSOT();
            return;
        }

        if (this.ssotOpeningComplete) {
            this.skillIndex = this.strictSkillEngine(CoreLoneWolf.ssotLoopSkills, this.skillIndex);
            return;
        }

        if (this.skillList.length === 0) {
            return;
        }

        const finalOpeningSkill = this.skillIndex === this.skillList.length - 1;
        this.skillIndex = this.strictSkillEngine(this.skillList, this.skillIndex);

        if (finalOpeningSkill && this.skillIndex === 0) {
            this.ssotOpeningComplete = true;
        }
    }

    private resetArchivist(): void {
        this.archivistOpeningComplete = false;
        this.skillIndex = 0;
    }

    private archivistSkillEngine(): void {
        if (!bot.player.alive) {
            this.resetArchivist();
            return;
        }

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return;
        }

        if (this.archivistOpeningComplete) {
            // Repeat the final full spell only at a spell boundary while Rewrite Time is unavailable.
            if (this.skillIndex === CoreLoneWolf.archivistLoopSkills.length - 1 && !bot.skills.canUseSkill(4)) {
                if (!bot.skills.canUseSkill(0)) {
                    return;
                }

                this.skillIndex = CoreLoneWolf.archivistLoopSkills.length - 4;
            }

            this.skillIndex = this.strictSkillEngine(CoreLoneWolf.archivistLoopSkills, this.skillIndex);
            return;
        }

        if (this.skillList.length === 0) {
            return;
        }

        const finalOpeningSkill = this.skillIndex === this.skillList.length - 1;
        this.skillIndex = this.strictSkillEngine(this.skillList, this.skillIndex);

        if (finalOpeningSkill && this.skillIndex === 0) {
            this.archivistOpeningComplete = true;
        }
    }

    private resetDracoKnight(): void {
        this.dracoKnightOpeningComplete = false;
        this.skillIndex = 0;
    }

    private dracoKnightSkillEngine(): void {
        if (!bot.player.alive) {
            this.resetDracoKnight();
            return;
        }

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return;
        }

        if (this.dracoKnightOpeningComplete) {
            this.skillIndex = this.strictSkillEngine(CoreLoneWolf.dracoKnightLoopSkills, this.skillIndex);
            return;
        }

        if (this.skillList.length === 0) {
            return;
        }

        const finalOpeningSkill = this.skillIndex === this.skillList.length - 1;
        this.skillIndex = this.strictSkillEngine(this.skillList, this.skillIndex);

        if (finalOpeningSkill && this.skillIndex === 0) {
            this.dracoKnightOpeningComplete = true;
        }
    }

    private resetMartialArtist(): void {
        this.martialArtistOpeningComplete = false;
        this.skillIndex = 0;
    }

    private hasMartialArtistMana(skill: number): boolean {
        try {
            // C# reads the whole skill and dataLeaf objects; one getMany reads the three values.
            const { cost, mana, modifier } = bot.flash.getMany({
                cost: `world.actions.active[${skill}].mp`,
                mana: "world.myAvatar.dataLeaf.intMP",
                modifier: "world.myAvatar.dataLeaf.sta.$cmc",
            });
            if (typeof cost !== "number" || typeof mana !== "number" || typeof modifier !== "number") {
                return false;
            }

            // AS3 Math.round resolves half ties toward positive infinity.
            const requiredMana = Math.floor(cost * modifier + 0.5);
            return (
                Number.isFinite(cost) &&
                Number.isFinite(mana) &&
                Number.isFinite(modifier) &&
                Number.isFinite(requiredMana) &&
                mana >= requiredMana
            );
        } catch (error) {
            rethrowIfStopped(error);

            return false;
        }
    }

    private martialArtistSkillEngine(): void {
        if (!bot.player.alive) {
            this.resetMartialArtist();
            return;
        }

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return;
        }

        if (this.martialArtistOpeningComplete) {
            if (this.skillIndex === 0 && !bot.skills.canUseSkill(4)) {
                if (bot.skills.canUseSkill(2) && this.hasMartialArtistMana(2)) {
                    bot.skills.useSkill(2);
                }
                return;
            }

            const skill = CoreLoneWolf.martialArtistLoopSkills[this.skillIndex];
            if (!bot.skills.canUseSkill(skill) || !this.hasMartialArtistMana(skill)) {
                return;
            }

            this.skillIndex = this.strictSkillEngine(CoreLoneWolf.martialArtistLoopSkills, this.skillIndex);
            return;
        }

        if (this.skillList.length === 0) {
            return;
        }

        const openingSkill = this.skillList[this.skillIndex];
        if (!bot.skills.canUseSkill(openingSkill) || !this.hasMartialArtistMana(openingSkill)) {
            return;
        }

        const finalOpeningSkill = this.skillIndex === this.skillList.length - 1;
        this.skillIndex = this.strictSkillEngine(this.skillList, this.skillIndex);

        if (finalOpeningSkill && this.skillIndex === 0) {
            this.martialArtistOpeningComplete = true;
        }
    }

    private chaosShaperSkillEngine(): void {
        if (!bot.player.alive) {
            this.skillIndex = 0;
            return;
        }

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return;
        }

        if (this.skillIndex > 0) {
            this.skillIndex = this.strictSkillEngine(CoreLoneWolf.chaosShaperChaosSkills, this.skillIndex);
            return;
        }

        const auras = bot.self.auras;
        if (auras.some((aura) => aura.name?.toLowerCase() === "Unity"?.toLowerCase())) {
            this.skillIndex = this.strictSkillEngine(CoreLoneWolf.chaosShaperUnitySkills, this.skillIndex);
        } else if (auras.some((aura) => aura.name?.toLowerCase() === "Chaos"?.toLowerCase())) {
            this.skillIndex = this.strictSkillEngine(CoreLoneWolf.chaosShaperChaosSkills, this.skillIndex);
        } else {
            this.skillIndex = this.strictSkillEngine(this.skillList, this.skillIndex);
        }
    }

    kingsEchoSkillEngine(useSurvivalSkill: boolean): void {
        if (!bot.player.alive) {
            this.skillIndex = 0;
            return;
        }

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return;
        }

        const residualEnergy = bot.self.getAura("Residual Energy")?.value ?? 0;

        if (
            (residualEnergy >= 24 || bot.player.mana < this.kingsEchoManaThreshold) &&
            bot.skills.canUseSkill(4) &&
            bot.skills.useSkill(4)
        ) {
            return;
        }

        const healthPercentage = bot.player.maxHealth > 0 ? (bot.player.health / bot.player.maxHealth) * 100 : 0;
        const manaPercentage = bot.player.maxMana > 0 ? (bot.player.mana / bot.player.maxMana) * 100 : 0;

        if (
            useSurvivalSkill &&
            healthPercentage < 50 &&
            manaPercentage > 24 &&
            bot.skills.canUseSkill(3) &&
            bot.skills.useSkill(3)
        ) {
            return;
        }

        this.customSkillEngine();
    }

    private arcanaInvokerSkillEngine(): void {
        if (!bot.player.alive) {
            this.skillIndex = 0;
            return;
        }

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return;
        }

        const worldAura = bot.self.getAura(CoreLoneWolf.arcanaInvokerWorldAura);
        if (worldAura != null) {
            if (worldAura.remainingTime > 1) {
                this.directSkillEngine();
            } else {
                this.skillIndex = 0;
                if (bot.skills.canUseSkill(1)) {
                    bot.skills.useSkill(1);
                }
            }

            return;
        }

        if (
            bot.self.hasActiveAura(CoreLoneWolf.arcanaInvokerFoolAura) &&
            !bot.self.hasActiveAura(CoreLoneWolf.arcanaInvokerJudgementAura)
        ) {
            this.directSkillEngine();
            return;
        }

        this.skillIndex = 0;
        if (bot.skills.canUseSkill(1)) {
            bot.skills.useSkill(1);
        }
    }

    private shamanSkillEngine(): void {
        if (!bot.player.alive) {
            this.skillIndex = 0;
            return;
        }

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return;
        }

        const elementalEmbrace = bot.target.getAura(CoreLoneWolf.shamanElementalEmbraceAura);
        if (
            (elementalEmbrace == null || elementalEmbrace.remainingTime <= 30) &&
            bot.skills.canUseSkill(4) &&
            bot.skills.useSkill(4)
        ) {
            return;
        }

        if (
            this.shamanSkillThreeEnabled &&
            bot.player.mana > 70 &&
            bot.skills.canUseSkill(3) &&
            bot.skills.useSkill(3)
        ) {
            return;
        }

        this.customSkillEngine();
    }

    private cssNormalMode(): void {
        if (!bot.player.alive) {
            this.resetCSSNormalMode();
            return;
        }

        if (this.cssNormalInitialManaCheck) {
            if (bot.player.mana < 100) {
                if (bot.skills.useSkill(1)) {
                    this.cssNormalInitialManaCheck = false;
                }
                return;
            }

            this.cssNormalInitialManaCheck = false;
        }

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return;
        }

        if (this.cssNormalNeedsRegeneration) {
            if (bot.skills.useSkill(1)) {
                this.cssNormalNeedsRegeneration = false;
            }
            return;
        }

        if (bot.player.mana < 5 || bot.self.hasActiveAura(CoreLoneWolf.chronoShadowHunterRoundsEmptyAura)) {
            if (bot.skills.useSkill(4)) {
                this.cssNormalNeedsRegeneration = true;
            }
            return;
        }

        bot.skills.useSkill(3);
    }

    private resetCSSNormalMode(): void {
        this.cssNormalInitialManaCheck = true;
        this.cssNormalNeedsRegeneration = false;
    }

    private cssGunslingerMode(): void {
        if (!bot.player.alive) {
            this.resetCSSGunslingerMode();
            return;
        }

        if (this.cssGunslingerInitialManaCheck) {
            if (bot.player.mana < 100) {
                if (bot.skills.useSkill(1)) {
                    this.cssGunslingerInitialManaCheck = false;
                }
                return;
            }

            this.cssGunslingerInitialManaCheck = false;
        }

        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return;
        }

        if (this.cssGunslingerNeedsRegeneration) {
            if (bot.skills.useSkill(1)) {
                this.cssGunslingerNeedsRegeneration = false;
            }
            return;
        }

        if (this.cssGunslingerWaitingForStance) {
            if (!bot.self.hasActiveAura(CoreLoneWolf.chronoShadowHunterGunslingerAura)) {
                return;
            }

            this.cssGunslingerWaitingForStance = false;
            this.cssGunslingerFiring = true;
        }

        if (this.cssGunslingerFiring) {
            if (bot.player.mana < 10) {
                if (bot.skills.useSkill(4)) {
                    this.cssGunslingerFiring = false;
                    this.cssGunslingerNeedsRegeneration = true;
                }
                return;
            }

            bot.skills.useSkill(0);
            return;
        }

        if (bot.player.mana < 5 || bot.self.hasActiveAura(CoreLoneWolf.chronoShadowHunterRoundsEmptyAura)) {
            if (bot.skills.useSkill(1)) {
                this.cssGunslingerWaitingForStance = true;
            }
            return;
        }

        bot.skills.useSkill(3);
    }

    private resetCSSGunslingerMode(): void {
        this.cssGunslingerInitialManaCheck = true;
        this.cssGunslingerWaitingForStance = false;
        this.cssGunslingerFiring = false;
        this.cssGunslingerNeedsRegeneration = false;
    }

    private isTaunterRole(): boolean {
        return this.isTaunter;
    }

    private getSkillList(): number[] {
        return this.skillList;
    }

    getMonsterHP(mapId: number): number {
        const monsters = bot.monsters?.mapMonsters;
        if (mapId <= 0 || monsters == null) {
            return 0;
        }

        for (const monster of monsters) {
            if (monster != null && monster.mapId === mapId) {
                return monster.hp;
            }
        }

        return 0;
    }

    isMonsterAlive(mapId: number): boolean {
        return this.getMonsterHP(mapId) > 0;
    }

    maintainTarget(mapId: number): void {
        if (!bot.player.alive || mapId <= 0 || !this.isMonsterAlive(mapId)) {
            return;
        }

        const target = bot.player.target;
        if (!bot.player.hasTarget || target?.mapId !== mapId || target?.hp <= 0) {
            bot.combat.attack(mapId);
        }
    }

    genericPrebuff(): void {
        if (bot.player.currentClass?.toLowerCase() === "Guardian"?.toLowerCase()) {
            bot.sleep(2250);
            return;
        }

        bot.skills.useSkill(3);
        bot.sleep(750);
        bot.skills.useSkill(2);
        bot.sleep(750);
        bot.skills.useSkill(1);
        bot.sleep(750);
    }

    getDivineElixir(preset: ClassPreset, roleName: string, logPrefix: string): string {
        const divineElixir = "Divine Elixir";
        const unstableDivineElixir = "Unstable Divine Elixir";

        if (!bot.inventory.contains(unstableDivineElixir)) {
            if (!bot.bank.loaded) {
                if (bot.flash.get<string>("ui.mcPopup.currentLabel") !== "Bank") {
                    bot.bank.open();
                }

                bot.bank.load(false);
                bot.wait.forBankLoad(20);
            }

            if (bot.bank.contains(unstableDivineElixir)) {
                if (this.moveBankItemToInventory(unstableDivineElixir)) {
                    Core.logger(`${unstableDivineElixir} moved from bank.`, "GetDivineElixir");
                } else {
                    Core.logger(
                        this.explainFailure(`${unstableDivineElixir} could not be moved from bank.`),
                        "GetDivineElixir",
                    );
                }
            }
        }

        if (bot.inventory.contains(unstableDivineElixir)) {
            Core.logger(`${unstableDivineElixir} already available.`, "GetDivineElixir");
            return unstableDivineElixir;
        }

        if (bot.inventory.contains(divineElixir) || bot.bank.contains(divineElixir)) {
            return divineElixir;
        }

        const divineElixirItem =
            Core.ensureLoad(1854)?.rewards.find((item) => item.name.toLowerCase() === divineElixir.toLowerCase()) ??
            null;
        if (!Core.hasSpaceFor(divineElixirItem, 10)) {
            Core.logger(`${divineElixir} skipped because no free inventory slot is available.`, "GetDivineElixir");
            return divineElixir;
        }

        const dropGrabberWasEnabled = bot.drops.running;

        try {
            if (!dropGrabberWasEnabled) {
                bot.drops.start();
            }

            this.startSkillEngine(preset.skills, roleName, false, logPrefix, preset.skillMode);

            Core.killMonster("poisonforest", "r15", "Left", 41, divineElixir, 10, { isTemp: false });
        } finally {
            this.stopSkillEngine();

            if (!dropGrabberWasEnabled) {
                bot.drops.stop();
            }
        }

        return divineElixir;
    }

    preparePotions(tonicName: string, elixirName: string, potionName: string | null = null): void {
        this.preparePotion(tonicName, PotionCategory.Tonic);
        this.preparePotion(elixirName, PotionCategory.Elixir);

        if (!!potionName?.trim()) {
            this.preparePotion(potionName, PotionCategory.CombatPotion);
        }
    }

    usePotions(tonicName: string, elixirName: string, potionName: string | null = null): void {
        this.usePotion(tonicName, PotionCategory.Tonic);
        this.usePotion(elixirName, PotionCategory.Elixir);

        if (!!potionName?.trim()) {
            this.usePotion(potionName, PotionCategory.CombatPotion);
        }
    }

    maintainPotion(potionName: string): boolean {
        if (
            !bot.player.alive ||
            !CoreLoneWolf.isSupportedPotion(potionName, PotionCategory.CombatPotion) ||
            !bot.inventory.isEquipped(potionName) ||
            !bot.skills.canUseSkill(5)
        ) {
            return false;
        }

        const aura = bot.self.getAura(CoreLoneWolf.getPotionAuraName(potionName));
        if (aura != null && aura.expiresAt - Date.now() > 5 * 1000) {
            return false;
        }

        return bot.skills.useSkill(5);
    }

    equipScroll(scrollName: string): void {
        if (bot.shouldExit) {
            return;
        }

        if (!scrollName?.trim()) {
            Core.logger("Scroll equipping skipped because no scroll was specified.", "EquipScroll");
            return;
        }

        const required = scrollName?.toLowerCase() === CoreLoneWolf.enrageScroll?.toLowerCase();

        try {
            if (!bot.inventory.contains(scrollName)) {
                Core.logger(`${scrollName} is not in inventory.`, "EquipScroll", {
                    messageBox: required,
                    stopBot: required,
                });
                return;
            }

            if (bot.inventory.isEquipped(scrollName)) {
                Core.logger(`${scrollName} already equipped.`, "EquipScroll");
                return;
            }

            bot.inventory.equipUsableItem(scrollName);
            bot.wait.forItemEquip(scrollName);

            if (!bot.inventory.isEquipped(scrollName)) {
                Core.logger(this.explainFailure(`${scrollName} could not be equipped.`, true), "EquipScroll", {
                    messageBox: required,
                    stopBot: required,
                });
                return;
            }

            bot.sleep(2000);
            Core.logger(`${scrollName} equipped.`, "EquipScroll");
        } catch (ex) {
            rethrowIfStopped(ex);

            bot.log(`CoreLoneWolf scroll equip failed for ${scrollName}: ${ex}`);
            Core.logger(this.explainFailure(`${scrollName} could not be equipped.`, true), "EquipScroll", {
                messageBox: required,
                stopBot: required,
            });
        }
    }

    private preparePotion(itemName: string, category: PotionCategory): void {
        if (bot.shouldExit) {
            return;
        }

        if (!CoreLoneWolf.isSupportedPotion(itemName, category)) {
            Core.logger(
                `${itemName} is not supported as a ${CoreLoneWolf.getPotionCategoryName(category)}.`,
                "PreparePotions",
            );
            return;
        }

        try {
            if (bot.inventory.contains(itemName)) {
                Core.logger(`${itemName} already available.`, "PreparePotions");
                return;
            }

            if (bot.bank.contains(itemName)) {
                if (!this.moveBankItemToInventory(itemName)) {
                    Core.logger(this.explainFailure(`${itemName} could not be moved from bank.`), "PreparePotions");
                } else {
                    Core.logger(`${itemName} moved from bank.`, "PreparePotions");
                }
                return;
            }

            const recipe = CoreLoneWolf.tryGetPotionRecipe(itemName);
            if (recipe === null) {
                Core.logger(`${itemName} skipped because no purchase recipe is configured.`, "PreparePotions");
                return;
            }

            if (recipe.factionName != null && !bot.reputation.hasRank(recipe.factionName, recipe.factionRank)) {
                Core.logger(
                    `${itemName} skipped because ${recipe.factionName} rank ${recipe.factionRank} is required.`,
                    "PreparePotions",
                );
                return;
            }

            if (bot.bank.contains(recipe.voucherName) && !this.moveBankItemToInventory(recipe.voucherName)) {
                Core.logger(
                    this.explainFailure(
                        `${itemName} skipped because ${recipe.voucherName} could not be moved from bank.`,
                    ),
                    "PreparePotions",
                );
                return;
            }

            const missingVouchers = Math.max(0, recipe.voucherQuantity - bot.inventory.getQuantity(recipe.voucherName));
            const requiredGold = missingVouchers * recipe.voucherCost;

            if (bot.player.gold < requiredGold) {
                Core.logger(`${itemName} skipped because ${requiredGold} gold is required.`, "PreparePotions");
                return;
            }

            if (missingVouchers > 0) {
                if (
                    !this.hasPurchaseSpace(
                        CoreLoneWolf.potionShopMap,
                        CoreLoneWolf.potionShopId,
                        recipe.voucherName,
                        recipe.voucherQuantity,
                    )
                ) {
                    Core.logger(`${itemName} skipped because no free inventory slot is available.`, "PreparePotions");
                    return;
                }

                Core.buyItem(
                    CoreLoneWolf.potionShopMap,
                    CoreLoneWolf.potionShopId,
                    recipe.voucherName,
                    recipe.voucherQuantity,
                );

                if (bot.inventory.getQuantity(recipe.voucherName) < recipe.voucherQuantity) {
                    Core.logger(
                        this.explainFailure(`${itemName} skipped because the required vouchers could not be obtained.`),
                        "PreparePotions",
                    );
                    return;
                }
            }

            if (
                !this.hasPurchaseSpace(
                    CoreLoneWolf.potionShopMap,
                    CoreLoneWolf.potionShopId,
                    itemName,
                    recipe.potionQuantity,
                )
            ) {
                Core.logger(`${itemName} skipped because no free inventory slot is available.`, "PreparePotions");
                return;
            }

            Core.buyItem(CoreLoneWolf.potionShopMap, CoreLoneWolf.potionShopId, itemName, recipe.potionQuantity);

            if (!bot.inventory.contains(itemName)) {
                Core.logger(this.explainFailure(`${itemName} could not be purchased.`), "PreparePotions");
                return;
            }

            Core.logger(`${itemName} purchased.`, "PreparePotions");
        } catch (ex) {
            rethrowIfStopped(ex);

            bot.log(`CoreLoneWolf potion preparation failed for ${itemName}: ${ex}`);
            Core.logger(this.explainFailure(`${itemName} preparation failed.`), "PreparePotions");
        }
    }

    private usePotion(itemName: string, category: PotionCategory): void {
        if (bot.shouldExit) {
            return;
        }

        if (!CoreLoneWolf.isSupportedPotion(itemName, category)) {
            Core.logger(
                `${itemName} is not supported as a ${CoreLoneWolf.getPotionCategoryName(category)}.`,
                "UsePotions",
            );
            return;
        }

        try {
            const auraName = CoreLoneWolf.getPotionAuraName(itemName);
            const auraActive = bot.self.hasActiveAura(auraName);

            if (auraActive && category !== PotionCategory.CombatPotion) {
                Core.logger(`${itemName} already active.`, "UsePotions");
                return;
            }

            if (!bot.inventory.contains(itemName)) {
                Core.logger(`${itemName} skipped because it is not in inventory.`, "UsePotions");
                return;
            }

            if (!this.equipPotion(itemName)) {
                return;
            }

            bot.sleep(CoreLoneWolf.potionSuccessDelay);

            if (auraActive) {
                Core.logger(`${itemName} already active and equipped.`, "UsePotions");
                return;
            }

            bot.skills.useSkill(5);
            bot.sleep(CoreLoneWolf.potionAuraCheckDelay);

            if (!bot.self.hasActiveAura(auraName)) {
                Core.logger(this.explainFailure(`${itemName} was not verified after use.`, true), "UsePotions");
                return;
            }

            Core.logger(`${itemName} applied.`, "UsePotions");
            bot.sleep(CoreLoneWolf.potionSuccessDelay);
        } catch (ex) {
            rethrowIfStopped(ex);

            bot.log(`CoreLoneWolf potion use failed for ${itemName}: ${ex}`);
            Core.logger(this.explainFailure(`${itemName} use failed.`, true), "UsePotions");
        }
    }

    private equipPotion(itemName: string): boolean {
        if (bot.inventory.isEquipped(itemName)) {
            return true;
        }

        bot.inventory.equipUsableItem(itemName);
        bot.wait.forItemEquip(itemName);

        if (bot.inventory.isEquipped(itemName)) {
            return true;
        }

        Core.logger(this.explainFailure(`${itemName} could not be equipped.`, true), "UsePotions");
        return false;
    }

    private moveBankItemToInventory(itemName: string): boolean {
        if (!bot.bank.contains(itemName)) {
            return false;
        }

        if (!Core.hasSpaceFor(bot.bank.getItem(itemName))) {
            return false;
        }

        const inventoryQuantity = bot.inventory.getQuantity(itemName);
        bot.bank.ensureToInventory(itemName);
        bot.wait.forTrue(() => bot.inventory.getQuantity(itemName) > inventoryQuantity, 14);
        return bot.inventory.getQuantity(itemName) > inventoryQuantity;
    }

    private hasPurchaseSpace(
        map: string,
        shopId: number,
        itemName: string,
        quantity: number,
        shopItemId = 0,
        index = 0,
    ): boolean {
        const items = Core.getShopItems(map, shopId);
        let item = Core.parseShopItem(items, shopId, itemName, shopItemId);
        if (item == null) {
            return false;
        }

        // Match Core.BuyItem's final ItemID/index selection and purchase quantity.
        const itemId = item.id;
        const matches = items.filter((candidate) => candidate.id === itemId);
        item = matches.length > index ? matches[index] : (matches[0] ?? null);
        return item != null && Core.hasSpaceFor(item, Core._calcBuyQuantity(item, quantity));
    }

    private static isSupportedPotion(itemName: string, category: PotionCategory): boolean {
        return category === PotionCategory.Tonic
            ? itemName === "Might Tonic" ||
                  itemName === "Sage Tonic" ||
                  itemName === "Fate Tonic" ||
                  itemName === "Body Tonic"
            : category === PotionCategory.Elixir
              ? itemName === "Potent Battle Elixir" ||
                itemName === "Potent Malevolence Elixir" ||
                itemName === "Potent Destruction Elixir" ||
                itemName === "Potent Revitalize Elixir" ||
                itemName === "Divine Elixir" ||
                itemName === "Unstable Divine Elixir"
              : category === PotionCategory.CombatPotion
                ? itemName === "Potent Honor Potion" || itemName === "Felicitous Philtre"
                : false;
    }

    private static getPotionCategoryName(category: PotionCategory): string {
        return category === PotionCategory.Tonic
            ? "tonic"
            : category === PotionCategory.Elixir
              ? "elixir"
              : category === PotionCategory.CombatPotion
                ? "combat potion"
                : "potion";
    }

    private static getPotionAuraName(itemName: string): string {
        return itemName === "Sage Tonic"
            ? "Sage"
            : itemName === "Might Tonic"
              ? "Might"
              : itemName === "Fate Tonic"
                ? "Fate"
                : itemName === "Body Tonic"
                  ? "Body"
                  : itemName === "Potent Honor Potion"
                    ? "Potent Honor Malice"
                    : itemName === "Felicitous Philtre"
                      ? "Felicitous Philtre"
                      : itemName;
    }

    /** How a potion is bought, or null when it has no recipe (C#'s bool with six `out` values). */
    private static tryGetPotionRecipe(itemName: string): PotionRecipe | null {
        const recipe: PotionRecipe = {
            voucherName: "Gold Voucher 500k",
            voucherQuantity: 0,
            voucherCost: 500000,
            potionQuantity: 0,
            factionName: null,
            factionRank: 0,
        };

        switch (itemName) {
            case "Sage Tonic":

            case "Might Tonic":

            case "Body Tonic":
                recipe.voucherQuantity = 2;
                recipe.potionQuantity = 10;
                recipe.factionName = "Alchemy";
                recipe.factionRank = 8;
                return recipe;
            case "Fate Tonic":
                recipe.voucherQuantity = 4;
                recipe.potionQuantity = 10;
                recipe.factionName = "Alchemy";
                recipe.factionRank = 8;
                return recipe;
            case "Potent Battle Elixir":

            case "Potent Malevolence Elixir":
                recipe.voucherQuantity = 4;
                recipe.potionQuantity = 8;
                return recipe;
            case "Potent Destruction Elixir":

            case "Potent Revitalize Elixir":
                recipe.voucherQuantity = 2;
                recipe.potionQuantity = 8;
                return recipe;
            case "Potent Honor Potion":
                recipe.voucherQuantity = 1;
                recipe.potionQuantity = 5;
                recipe.factionName = "Good";
                recipe.factionRank = 10;
                return recipe;
            case "Felicitous Philtre":
                recipe.voucherName = "Gold Voucher 100k";
                recipe.voucherQuantity = 2;
                recipe.voucherCost = 100000;
                recipe.potionQuantity = 25;
                return recipe;
            default:
                return null;
        }
    }

    prepareScrolls(scrollName: string): void {
        if (bot.shouldExit) {
            return;
        }

        if (!scrollName?.trim()) {
            Core.logger("Scroll preparation skipped because no scroll was specified.", "PrepareScrolls");
            return;
        }

        if (
            scrollName?.toLowerCase() === CoreLoneWolf.decayScroll?.toLowerCase() ||
            scrollName?.toLowerCase() === CoreLoneWolf.mystifyScroll?.toLowerCase()
        ) {
            this.prepareOptionalScroll(
                scrollName?.toLowerCase() === CoreLoneWolf.decayScroll?.toLowerCase()
                    ? CoreLoneWolf.decayScroll
                    : CoreLoneWolf.mystifyScroll,
            );
            return;
        }

        if (!(scrollName?.toLowerCase() === CoreLoneWolf.enrageScroll?.toLowerCase())) {
            Core.logger(`${scrollName} preparation skipped because it is not supported.`, "PrepareScrolls");
            return;
        }

        scrollName = CoreLoneWolf.enrageScroll;

        try {
            if (!bot.reputation.hasRank("SpellCrafting", 5)) {
                this.scrollPreparationFailed(scrollName, "SpellCrafting rank 5 is required");
                return;
            }

            if (bot.inventory.getQuantity(scrollName) >= CoreLoneWolf.enrageThreshold) {
                Core.logger(`${scrollName} already available.`, "PrepareScrolls");
                return;
            }

            if (!bot.bank.loaded) {
                if (bot.flash.get<string>("ui.mcPopup.currentLabel") !== "Bank") {
                    bot.bank.open();
                }

                bot.bank.load(false);
                bot.wait.forBankLoad(20);
            }

            const scrollWasBanked = bot.bank.contains(scrollName);
            if (scrollWasBanked && !this.moveBankedScrollItem(scrollName, scrollName, CoreLoneWolf.enrageThreshold)) {
                return;
            }

            if (bot.inventory.getQuantity(scrollName) >= CoreLoneWolf.enrageThreshold) {
                Core.logger(`${scrollName} moved from bank.`, "PrepareScrolls");
                return;
            }

            const useGold = bot.player.gold >= 1000000;
            const prepared = useGold ? this.prepareEnrageWithGold() : this.prepareEnrageByFarming();

            if (!prepared || bot.shouldExit) {
                return;
            }

            Core.logger(`${scrollName} prepared ${useGold ? "with gold" : "by farming"}.`, "PrepareScrolls");
        } catch (ex) {
            rethrowIfStopped(ex);

            bot.log(`CoreLoneWolf scroll preparation failed for ${scrollName}: ${ex}`);
            this.scrollPreparationFailed(
                scrollName,
                this.explainFailure("an unexpected error occurred.").replace(/\.+$/, ""),
            );
        }
    }

    private prepareEnrageWithGold(): boolean {
        const voucher = "Gold Voucher 500k";
        const quill = "Arcane Quill";
        const ink = "Zealous Ink";

        const requiredTurnIns = Math.trunc(
            (CoreLoneWolf.enrageMaxStack - bot.inventory.getQuantity(CoreLoneWolf.enrageScroll)) /
                CoreLoneWolf.enrageRewardQuantity,
        );

        Core.join(CoreLoneWolf.spellcraftMap);

        if (bot.shouldExit) {
            return false;
        }

        if (
            !this.moveBankedScrollItem(CoreLoneWolf.enrageScroll, voucher, 2) ||
            !this.moveBankedScrollItem(CoreLoneWolf.enrageScroll, quill, 10) ||
            !this.moveBankedScrollItem(CoreLoneWolf.enrageScroll, ink, requiredTurnIns)
        ) {
            return false;
        }

        if (
            !this.prepareGoldScrollMaterial(voucher, 2) ||
            !this.prepareGoldScrollMaterial(quill, 10, CoreLoneWolf.arcaneQuillShopItemId, 1) ||
            !this.prepareGoldScrollMaterial(ink, requiredTurnIns)
        ) {
            return false;
        }

        if (!this.completeEnrageQuest(requiredTurnIns)) {
            return false;
        }

        return !bot.shouldExit && bot.inventory.getQuantity(CoreLoneWolf.enrageScroll) >= CoreLoneWolf.enrageThreshold;
    }

    private prepareEnrageByFarming(): boolean {
        const parchment = "Mystic Parchment";
        const ink = "Zealous Ink";

        Core.join(CoreLoneWolf.spellcraftMap);

        if (bot.shouldExit || !this.moveBankedScrollItem(CoreLoneWolf.enrageScroll, ink, 1)) {
            return false;
        }

        if (bot.inventory.getQuantity(ink) < 1) {
            if (!this.moveBankedScrollItem(CoreLoneWolf.enrageScroll, parchment, 2)) {
                return false;
            }

            if (bot.inventory.getQuantity(parchment) < 2) {
                const parchmentItem =
                    Core.ensureLoad(2260)?.rewards.find(
                        (item) => item.name.toLowerCase() === parchment.toLowerCase(),
                    ) ?? null;
                if (!this.ensureScrollOutputSpace(CoreLoneWolf.enrageScroll, parchmentItem, 2)) {
                    return false;
                }

                Core.addDrop(parchment);
                Core.join("underworld");
                Core.jump("r2", "Up");
                bot.kill.forItem("*", parchment, 2, false);

                if (bot.shouldExit) {
                    return false;
                }

                if (bot.inventory.getQuantity(parchment) < 2) {
                    return this.scrollPreparationFailed(
                        CoreLoneWolf.enrageScroll,
                        this.explainFailure(`2 ${parchment} could not be obtained.`).replace(/\.+$/, ""),
                    );
                }
            }

            Core.join(CoreLoneWolf.spellcraftMap);

            if (!this.ensureScrollPurchaseSpace(CoreLoneWolf.enrageScroll, ink, CoreLoneWolf.spellInkShopId, 5)) {
                return false;
            }

            Core.buyItem(CoreLoneWolf.spellcraftMap, CoreLoneWolf.spellInkShopId, ink, 5);

            if (bot.shouldExit) {
                return false;
            }

            if (bot.inventory.getQuantity(ink) < 5) {
                return this.scrollPreparationFailed(
                    CoreLoneWolf.enrageScroll,
                    this.explainFailure(`${ink} could not be crafted.`).replace(/\.+$/, ""),
                );
            }
        }

        return this.completeEnrageQuest(1);
    }

    private prepareGoldScrollMaterial(itemName: string, quantity: number, shopItemID = 0, index = 0): boolean {
        if (bot.inventory.getQuantity(itemName) >= quantity) {
            return true;
        }

        if (
            !this.ensureScrollPurchaseSpace(
                CoreLoneWolf.enrageScroll,
                itemName,
                CoreLoneWolf.arcaneQuillShopId,
                quantity,
                shopItemID,
                index,
            )
        ) {
            return false;
        }

        Core.buyItem(CoreLoneWolf.spellcraftMap, CoreLoneWolf.arcaneQuillShopId, itemName, quantity, shopItemID, index);

        if (bot.shouldExit) {
            return false;
        }

        if (bot.inventory.getQuantity(itemName) < quantity) {
            return this.scrollPreparationFailed(
                CoreLoneWolf.enrageScroll,
                this.explainFailure(`${itemName} could not be obtained.`).replace(/\.+$/, ""),
            );
        }

        return true;
    }

    private completeEnrageQuest(amount: number): boolean {
        const ConfirmedTurnIns = (): number => {
            return Math.min(
                amount,
                Math.max(completed, Math.max(0, previousInkQuantity - bot.inventory.getQuantity(ink))),
            );
        };
        const HasCompletionEvidence = (): boolean => {
            return (
                bot.inventory.getQuantity(CoreLoneWolf.enrageScroll) >= expectedQuantity || ConfirmedTurnIns() >= amount
            );
        };
        const ink = "Zealous Ink";

        if (bot.shouldExit) {
            return false;
        }

        const reward =
            Core.ensureLoad(CoreLoneWolf.enrageQuestId)?.rewards.find(
                (item) => item.name.toLowerCase() === CoreLoneWolf.enrageScroll.toLowerCase(),
            ) ?? null;
        if (
            !this.ensureScrollOutputSpace(CoreLoneWolf.enrageScroll, reward, amount * CoreLoneWolf.enrageRewardQuantity)
        ) {
            return false;
        }

        const previousQuantity = bot.inventory.getQuantity(CoreLoneWolf.enrageScroll);
        const previousInkQuantity = bot.inventory.getQuantity(ink);
        const expectedQuantity = Math.min(
            CoreLoneWolf.enrageMaxStack,
            previousQuantity + amount * CoreLoneWolf.enrageRewardQuantity,
        );

        if (previousQuantity === 0) {
            Core.addDrop(CoreLoneWolf.enrageScroll);
        }

        if (!this.prepareScrollQuestTurnIn(CoreLoneWolf.enrageQuestId)) {
            return this.scrollPreparationFailed(
                CoreLoneWolf.enrageScroll,
                this.explainFailure(
                    `quest ${CoreLoneWolf.enrageQuestId} could not be prepared for completion.`,
                ).replace(/\.+$/, ""),
            );
        }

        let completed = Core.ensureCompleteMulti(CoreLoneWolf.enrageQuestId, amount);

        if (bot.shouldExit) {
            return false;
        }

        if (completed < amount) {
            bot.wait.forTrue(HasCompletionEvidence, 3);

            if (HasCompletionEvidence()) {
                completed = amount;
            } else if (amount === 1) {
                Core.logger(
                    `${CoreLoneWolf.enrageScroll} multi completion was not confirmed. Retrying one turn-in with normal completion.`,
                    "PrepareScrolls",
                );

                if (!this.prepareScrollQuestTurnIn(CoreLoneWolf.enrageQuestId)) {
                    return this.scrollPreparationFailed(
                        CoreLoneWolf.enrageScroll,
                        this.explainFailure(
                            `quest ${CoreLoneWolf.enrageQuestId} could not be prepared for the normal completion fallback.`,
                        ).replace(/\.+$/, ""),
                    );
                }

                const fallbackCompleted = Core.ensureComplete(CoreLoneWolf.enrageQuestId);
                bot.wait.forTrue(HasCompletionEvidence, 3);

                if (fallbackCompleted || HasCompletionEvidence()) {
                    completed = amount;
                }
            }
        }

        if (completed < amount && !HasCompletionEvidence()) {
            const remainingTurnIns = amount - ConfirmedTurnIns();
            Core.logger(
                `${CoreLoneWolf.enrageScroll} completion is still unconfirmed. Retrying ${remainingTurnIns} remaining turn-in${remainingTurnIns === 1 ? "" : "s"} after stabilization.`,
                "PrepareScrolls",
            );

            if (!this.prepareScrollQuestTurnIn(CoreLoneWolf.enrageQuestId)) {
                return this.scrollPreparationFailed(
                    CoreLoneWolf.enrageScroll,
                    this.explainFailure(
                        `quest ${CoreLoneWolf.enrageQuestId} could not be prepared for the final completion fallback.`,
                    ).replace(/\.+$/, ""),
                );
            }

            const finalCompleted = Core.ensureCompleteMulti(CoreLoneWolf.enrageQuestId, remainingTurnIns);
            bot.wait.forTrue(HasCompletionEvidence, 3);

            if (finalCompleted >= remainingTurnIns || HasCompletionEvidence()) {
                completed = amount;
            } else {
                return this.scrollPreparationFailed(
                    CoreLoneWolf.enrageScroll,
                    this.explainFailure(
                        `all bounded completion attempts failed; ${ConfirmedTurnIns()} of ${amount} requested turn-ins were confirmed.`,
                    ).replace(/\.+$/, ""),
                );
            }
        }

        if (completed < amount) {
            return this.scrollPreparationFailed(
                CoreLoneWolf.enrageScroll,
                this.explainFailure(`the quest completed ${completed} of ${amount} requested turn-ins.`).replace(
                    /\.+$/,
                    "",
                ),
            );
        }

        if (previousQuantity === 0) {
            bot.wait.forDrop(CoreLoneWolf.enrageScroll, 10);
            bot.drops.pickup(CoreLoneWolf.enrageScroll);
            bot.wait.forPickup(CoreLoneWolf.enrageScroll, 10);
        }

        bot.wait.forTrue(() => bot.inventory.getQuantity(CoreLoneWolf.enrageScroll) >= expectedQuantity, 10);

        if (bot.shouldExit) {
            return false;
        }

        if (bot.inventory.getQuantity(CoreLoneWolf.enrageScroll) < expectedQuantity) {
            return this.scrollPreparationFailed(
                CoreLoneWolf.enrageScroll,
                this.explainFailure(`the quest produced fewer than ${expectedQuantity} total scrolls.`).replace(
                    /\.+$/,
                    "",
                ),
            );
        }

        return true;
    }

    private prepareScrollQuestTurnIn(questId: number): boolean {
        if (bot.shouldExit || !Core.ensureAccept(questId)) {
            return false;
        }

        bot.wait.forTrue(() => bot.quests.isInProgress(questId), 10);
        if (bot.shouldExit || !bot.quests.isInProgress(questId) || !bot.wait.forActionCooldown("tryQuestComplete")) {
            return false;
        }

        bot.sleep(3000);
        return !bot.shouldExit;
    }

    private prepareOptionalScroll(scrollName: string): void {
        const questId =
            scrollName?.toLowerCase() === CoreLoneWolf.decayScroll?.toLowerCase()
                ? CoreLoneWolf.decayQuestId
                : CoreLoneWolf.mystifyQuestId;
        const requiredRank = questId === CoreLoneWolf.decayQuestId ? 5 : 8;
        const startingQuantity = bot.inventory.getQuantity(scrollName);

        try {
            if (startingQuantity >= CoreLoneWolf.optionalScrollThreshold) {
                Core.logger(`${scrollName} already available.`, "PrepareScrolls");
                return;
            }

            const scrollWasBanked = bot.bank.contains(scrollName);
            if (
                scrollWasBanked &&
                !this.moveBankedScrollItem(scrollName, scrollName, CoreLoneWolf.optionalScrollThreshold)
            ) {
                return;
            }

            if (bot.inventory.getQuantity(scrollName) >= CoreLoneWolf.optionalScrollThreshold) {
                Core.logger(`${scrollName} moved from bank.`, "PrepareScrolls");
                return;
            }

            if (!bot.reputation.hasRank("SpellCrafting", requiredRank)) {
                this.scrollPreparationFailed(scrollName, `SpellCrafting rank ${requiredRank} is required`);
                return;
            }

            const useGold = bot.player.gold >= 1000000;
            if (!useGold && questId === CoreLoneWolf.mystifyQuestId) {
                this.scrollPreparationFailed(scrollName, "the gold route requires at least 1,000,000 gold");
                return;
            }

            Core.join(CoreLoneWolf.spellcraftMap);
            if (bot.shouldExit || !(bot.map.name?.toLowerCase() === CoreLoneWolf.spellcraftMap?.toLowerCase())) {
                this.scrollPreparationFailed(
                    scrollName,
                    this.explainFailure(`${CoreLoneWolf.spellcraftMap} could not be joined.`, true).replace(/\.+$/, ""),
                );
                return;
            }

            const quest = Core.initializeWithRetries(() => Core.ensureLoad(questId));
            const requirement = quest?.requirements[0] ?? null;
            const reward = quest?.rewards[0] ?? null;

            if (
                quest == null ||
                requirement == null ||
                reward == null ||
                requirement.quantity <= 0 ||
                reward.quantity <= 0 ||
                reward.maxStack <= 0 ||
                !(reward.name?.toLowerCase() === scrollName?.toLowerCase())
            ) {
                this.scrollPreparationFailed(
                    scrollName,
                    this.explainFailure(`quest ${questId} did not provide valid recipe data.`).replace(/\.+$/, ""),
                );
                return;
            }

            const targetQuantity = useGold ? reward.maxStack : CoreLoneWolf.optionalScrollThreshold;
            const turnIns = Math.trunc(
                (targetQuantity - bot.inventory.getQuantity(scrollName) + reward.quantity - 1) / reward.quantity,
            );

            const prepared = useGold
                ? this.prepareOptionalScrollWithGold(scrollName, quest, requirement, reward, turnIns)
                : this.prepareDecayByFarming(scrollName, quest, requirement, reward, turnIns);

            if (!prepared || bot.shouldExit) {
                return;
            }

            Core.logger(
                `${scrollName} prepared ${useGold ? "with gold" : "by farming"} (${startingQuantity} -> ${bot.inventory.getQuantity(scrollName)}).`,
                "PrepareScrolls",
            );
        } catch (ex) {
            rethrowIfStopped(ex);

            bot.log(`CoreLoneWolf scroll preparation failed for ${scrollName}: ${ex}`);
            this.scrollPreparationFailed(
                scrollName,
                this.explainFailure("an unexpected error occurred.").replace(/\.+$/, ""),
            );
        }
    }

    private prepareOptionalScrollWithGold(
        scrollName: string,
        quest: QuestData,
        requirement: QuestItem,
        reward: RewardItem,
        turnIns: number,
    ): boolean {
        const voucher = "Gold Voucher 500k";
        const quill = "Arcane Quill";
        const requiredInk = turnIns * requirement.quantity;

        if (
            !this.moveBankedScrollItem(scrollName, voucher, 2) ||
            !this.moveBankedScrollItem(scrollName, quill, 10) ||
            !this.moveBankedScrollItem(scrollName, requirement.name, requiredInk)
        ) {
            return false;
        }

        if (
            !this.prepareOptionalGoldScrollMaterial(scrollName, voucher, 2) ||
            !this.prepareOptionalGoldScrollMaterial(scrollName, quill, 10, CoreLoneWolf.arcaneQuillShopItemId, 1) ||
            !this.prepareOptionalGoldScrollMaterial(scrollName, requirement.name, requiredInk)
        ) {
            return false;
        }

        return this.completeOptionalScrollQuest(scrollName, quest, requirement, reward, turnIns, reward.maxStack);
    }

    private prepareDecayByFarming(
        scrollName: string,
        quest: QuestData,
        requirement: QuestItem,
        reward: RewardItem,
        turnIns: number,
    ): boolean {
        const parchment = "Mystic Parchment";
        const requiredInk = turnIns * requirement.quantity;

        if (!this.moveBankedScrollItem(scrollName, requirement.name, requiredInk)) {
            return false;
        }

        if (bot.inventory.getQuantity(requirement.name) < requiredInk) {
            if (!this.moveBankedScrollItem(scrollName, parchment, 2)) {
                return false;
            }

            if (bot.inventory.getQuantity(parchment) < 2) {
                const parchmentItem =
                    Core.ensureLoad(2260)?.rewards.find(
                        (item) => item.name.toLowerCase() === parchment.toLowerCase(),
                    ) ?? null;
                if (!this.ensureScrollOutputSpace(scrollName, parchmentItem, 2)) {
                    return false;
                }

                Core.addDrop(parchment);
                Core.join("underworld");
                Core.jump("r2", "Up");
                bot.kill.forItem("*", parchment, 2, false);

                if (bot.shouldExit) {
                    return false;
                }

                if (bot.inventory.getQuantity(parchment) < 2) {
                    return this.scrollPreparationFailed(
                        scrollName,
                        this.explainFailure(`2 ${parchment} could not be obtained.`).replace(/\.+$/, ""),
                    );
                }
            }

            Core.join(CoreLoneWolf.spellcraftMap);
            if (bot.shouldExit || !(bot.map.name?.toLowerCase() === CoreLoneWolf.spellcraftMap?.toLowerCase())) {
                return this.scrollPreparationFailed(
                    scrollName,
                    this.explainFailure(`${CoreLoneWolf.spellcraftMap} could not be joined.`, true).replace(/\.+$/, ""),
                );
            }

            if (!this.ensureScrollPurchaseSpace(scrollName, requirement.name, CoreLoneWolf.spellInkShopId, 5)) {
                return false;
            }

            Core.buyItem(CoreLoneWolf.spellcraftMap, CoreLoneWolf.spellInkShopId, requirement.name, 5);

            if (bot.shouldExit) {
                return false;
            }

            if (bot.inventory.getQuantity(requirement.name) < requiredInk) {
                return this.scrollPreparationFailed(
                    scrollName,
                    this.explainFailure(`${requirement.name} could not be crafted.`).replace(/\.+$/, ""),
                );
            }
        }

        return this.completeOptionalScrollQuest(
            scrollName,
            quest,
            requirement,
            reward,
            turnIns,
            CoreLoneWolf.optionalScrollThreshold,
        );
    }

    private prepareOptionalGoldScrollMaterial(
        scrollName: string,
        itemName: string,
        quantity: number,
        shopItemID = 0,
        index = 0,
    ): boolean {
        if (bot.inventory.getQuantity(itemName) >= quantity) {
            return true;
        }

        if (
            !this.ensureScrollPurchaseSpace(
                scrollName,
                itemName,
                CoreLoneWolf.arcaneQuillShopId,
                quantity,
                shopItemID,
                index,
            )
        ) {
            return false;
        }

        Core.buyItem(CoreLoneWolf.spellcraftMap, CoreLoneWolf.arcaneQuillShopId, itemName, quantity, shopItemID, index);

        if (bot.shouldExit) {
            return false;
        }

        if (bot.inventory.getQuantity(itemName) < quantity) {
            return this.scrollPreparationFailed(
                scrollName,
                this.explainFailure(`${itemName} could not be obtained.`).replace(/\.+$/, ""),
            );
        }

        return true;
    }

    private completeOptionalScrollQuest(
        scrollName: string,
        quest: QuestData,
        requirement: QuestItem,
        reward: RewardItem,
        amount: number,
        targetQuantity: number,
    ): boolean {
        const ConfirmedTurnIns = (): number => {
            return Math.min(
                amount,
                Math.max(
                    completed,
                    Math.trunc(
                        Math.max(0, previousRequirementQuantity - bot.inventory.getQuantity(requirement.name)) /
                            Math.max(1, requirement.quantity),
                    ),
                ),
            );
        };
        const HasCompletionEvidence = (): boolean => {
            return bot.inventory.getQuantity(scrollName) >= expectedQuantity || ConfirmedTurnIns() >= amount;
        };
        if (bot.shouldExit || amount <= 0) {
            return false;
        }

        Core.join(CoreLoneWolf.spellcraftMap);
        if (bot.shouldExit || !(bot.map.name?.toLowerCase() === CoreLoneWolf.spellcraftMap?.toLowerCase())) {
            return this.scrollPreparationFailed(
                scrollName,
                this.explainFailure(`${CoreLoneWolf.spellcraftMap} could not be joined.`, true).replace(/\.+$/, ""),
            );
        }

        if (!this.ensureScrollOutputSpace(scrollName, reward, amount * reward.quantity)) {
            return false;
        }

        const previousQuantity = bot.inventory.getQuantity(scrollName);
        const previousRequirementQuantity = bot.inventory.getQuantity(requirement.name);
        const expectedQuantity = Math.min(reward.maxStack, previousQuantity + amount * reward.quantity);

        if (previousQuantity === 0) {
            Core.addDrop(scrollName);
        }

        if (!this.prepareScrollQuestTurnIn(quest.id)) {
            return this.scrollPreparationFailed(
                scrollName,
                this.explainFailure(`quest ${quest.id} could not be prepared for completion.`).replace(/\.+$/, ""),
            );
        }

        let completed = Core.ensureCompleteMulti(quest.id, amount);
        if (bot.shouldExit) {
            return false;
        }

        if (completed < amount) {
            bot.wait.forTrue(HasCompletionEvidence, 3);

            if (HasCompletionEvidence()) {
                completed = amount;
            } else if (amount === 1) {
                Core.logger(
                    `${scrollName} multi completion was not confirmed. Retrying one turn-in with normal completion.`,
                    "PrepareScrolls",
                );

                if (!this.prepareScrollQuestTurnIn(quest.id)) {
                    return this.scrollPreparationFailed(
                        scrollName,
                        this.explainFailure(
                            `quest ${quest.id} could not be prepared for the normal completion fallback.`,
                        ).replace(/\.+$/, ""),
                    );
                }

                const fallbackCompleted = Core.ensureComplete(quest.id);
                bot.wait.forTrue(HasCompletionEvidence, 3);

                if (fallbackCompleted || HasCompletionEvidence()) {
                    completed = amount;
                }
            }
        }

        if (completed < amount && !HasCompletionEvidence()) {
            const remainingTurnIns = amount - ConfirmedTurnIns();
            Core.logger(
                `${scrollName} completion is still unconfirmed. Retrying ${remainingTurnIns} remaining turn-in${remainingTurnIns === 1 ? "" : "s"} after stabilization.`,
                "PrepareScrolls",
            );

            if (!this.prepareScrollQuestTurnIn(quest.id)) {
                return this.scrollPreparationFailed(
                    scrollName,
                    this.explainFailure(
                        `quest ${quest.id} could not be prepared for the final completion fallback.`,
                    ).replace(/\.+$/, ""),
                );
            }

            const finalCompleted = Core.ensureCompleteMulti(quest.id, remainingTurnIns);
            bot.wait.forTrue(HasCompletionEvidence, 3);

            if (finalCompleted >= remainingTurnIns || HasCompletionEvidence()) {
                completed = amount;
            } else {
                return this.scrollPreparationFailed(
                    scrollName,
                    this.explainFailure(
                        `all bounded completion attempts failed; ${ConfirmedTurnIns()} of ${amount} requested turn-ins were confirmed.`,
                    ).replace(/\.+$/, ""),
                );
            }
        }

        if (completed < amount) {
            return this.scrollPreparationFailed(
                scrollName,
                this.explainFailure(`the quest completed ${completed} of ${amount} requested turn-ins.`).replace(
                    /\.+$/,
                    "",
                ),
            );
        }

        if (previousQuantity === 0) {
            bot.wait.forDrop(scrollName, 10);
            bot.drops.pickup(scrollName);
            bot.wait.forPickup(scrollName, 10);
        }

        bot.wait.forTrue(() => bot.inventory.getQuantity(scrollName) >= expectedQuantity, 10);

        if (bot.shouldExit) {
            return false;
        }

        if (bot.inventory.getQuantity(scrollName) < targetQuantity) {
            return this.scrollPreparationFailed(
                scrollName,
                this.explainFailure(`the quest produced fewer than ${targetQuantity} total scrolls.`).replace(
                    /\.+$/,
                    "",
                ),
            );
        }

        return true;
    }

    private moveBankedScrollItem(scrollName: string, itemName: string, quantity: number): boolean {
        if (bot.inventory.getQuantity(itemName) >= quantity) {
            return true;
        }

        if (!bot.bank.contains(itemName)) {
            return true;
        }

        if (!Core.hasSpaceFor(bot.bank.getItem(itemName))) {
            return this.scrollPreparationFailed(scrollName, `no free inventory slot is available for ${itemName}`);
        }

        if (this.moveBankItemToInventory(itemName)) {
            return true;
        }

        if (bot.shouldExit) {
            return false;
        }

        return this.scrollPreparationFailed(
            scrollName,
            this.explainFailure(`${itemName} could not be moved from bank.`).replace(/\.+$/, ""),
        );
    }

    private ensureScrollPurchaseSpace(
        scrollName: string,
        itemName: string,
        shopId: number,
        quantity: number,
        shopItemId = 0,
        index = 0,
    ): boolean {
        if (this.hasPurchaseSpace(CoreLoneWolf.spellcraftMap, shopId, itemName, quantity, shopItemId, index)) {
            return true;
        }

        return this.scrollPreparationFailed(
            scrollName,
            `destination inventory space or shop item data is unavailable for ${itemName}`,
        );
    }

    private ensureScrollOutputSpace(scrollName: string, item: SpaceItem | null, quantity = 1): boolean {
        if (Core.hasSpaceFor(item, quantity)) {
            return true;
        }

        return this.scrollPreparationFailed(
            scrollName,
            item == null
                ? "item data for the inventory space check could not be loaded"
                : `no destination inventory slot is available for ${item.name}`,
        );
    }

    private scrollPreparationFailed(scrollName: string, reason: string): boolean {
        const required = scrollName?.toLowerCase() === CoreLoneWolf.enrageScroll?.toLowerCase();

        Core.logger(`${scrollName} preparation failed: ${reason}.`, "PrepareScrolls", {
            messageBox: required,
            stopBot: required,
        });
        return false;
    }

    prepareEnhancements(
        type: EnhancementType,
        capeSpecial: CapeSpecial,
        helmSpecial: HelmSpecial,
        weaponSpecial: WeaponSpecial,
        warnForElysiumUnlock = false,
        weaponFallbacks: WeaponSpecial[] | null = null,
    ): void {
        if (bot.shouldExit) {
            return;
        }

        const checkEquipped = bot.player.level === 100;
        const classPrepared = checkEquipped && this.isEquippedEnhancementPrepared(EnhancementSlot.Class, type);
        const capePrepared =
            checkEquipped && this.isEquippedEnhancementPrepared(EnhancementSlot.Cape, type, capeSpecial);
        const helmPrepared =
            checkEquipped && this.isEquippedEnhancementPrepared(EnhancementSlot.Helm, type, undefined, helmSpecial);
        const weaponPrepared =
            checkEquipped &&
            this.isEquippedEnhancementPrepared(EnhancementSlot.Weapon, type, undefined, undefined, weaponSpecial);

        if (classPrepared && capePrepared && helmPrepared && weaponPrepared) {
            Core.logger("All enhancements already prepared.", "PrepareEnhancements");
            return;
        }

        if (classPrepared) {
            this.logEnhancementResult(
                EnhancementSlot.Class,
                CoreLoneWolf.getRequestedEnhancementName(
                    EnhancementSlot.Class,
                    type,
                    CapeSpecial.None,
                    HelmSpecial.None,
                    WeaponSpecial.None,
                ),
                "already prepared",
            );
        } else {
            this.prepareEnhancementSlot(EnhancementSlot.Class, type);
        }

        if (bot.shouldExit) {
            return;
        }

        if (capePrepared) {
            this.logEnhancementResult(
                EnhancementSlot.Cape,
                CoreLoneWolf.getRequestedEnhancementName(
                    EnhancementSlot.Cape,
                    type,
                    capeSpecial,
                    HelmSpecial.None,
                    WeaponSpecial.None,
                ),
                "already prepared",
            );
        } else {
            this.prepareEnhancementSlot(EnhancementSlot.Cape, type, capeSpecial);
        }

        if (bot.shouldExit) {
            return;
        }

        if (helmPrepared) {
            this.logEnhancementResult(
                EnhancementSlot.Helm,
                CoreLoneWolf.getRequestedEnhancementName(
                    EnhancementSlot.Helm,
                    type,
                    CapeSpecial.None,
                    helmSpecial,
                    WeaponSpecial.None,
                ),
                "already prepared",
            );
        } else {
            this.prepareEnhancementSlot(EnhancementSlot.Helm, type, undefined, helmSpecial);
        }

        if (bot.shouldExit) {
            return;
        }

        if (weaponPrepared) {
            this.logEnhancementResult(
                EnhancementSlot.Weapon,
                CoreLoneWolf.getRequestedEnhancementName(
                    EnhancementSlot.Weapon,
                    type,
                    CapeSpecial.None,
                    HelmSpecial.None,
                    weaponSpecial,
                ),
                "already prepared",
            );
        } else {
            this.prepareEnhancementSlot(
                EnhancementSlot.Weapon,
                type,
                undefined,
                undefined,
                weaponSpecial,
                warnForElysiumUnlock,
                weaponFallbacks,
            );
        }
    }

    private prepareEnhancementSlot(
        slot: EnhancementSlot,
        type: EnhancementType,
        capeSpecial: CapeSpecial = CapeSpecial.None,
        helmSpecial: HelmSpecial = HelmSpecial.None,
        weaponSpecial: WeaponSpecial = WeaponSpecial.None,
        warnForElysiumUnlock = false,
        weaponFallbacks: WeaponSpecial[] | null = null,
    ): void {
        if (bot.shouldExit) {
            return;
        }

        const requestedEnhancement = CoreLoneWolf.getRequestedEnhancementName(
            slot,
            type,
            capeSpecial,
            helmSpecial,
            weaponSpecial,
        );

        try {
            const shop = this.tryGetEnhancementShop(slot, type, capeSpecial, helmSpecial, weaponSpecial);
            if (shop === null) {
                Core.logger(`${slot}: requested enhancement is invalid.`, "PrepareEnhancements");
                return;
            }

            if (shop.forgeShop) {
                Core.join("forge");
                if (bot.shouldExit) {
                    return;
                }
            }

            const mapName = bot.map?.name ?? "whitemap";
            // Highest level first, then the member one (C# OrderByDescending(Level).ThenByDescending(Upgrade)).
            const enhancement =
                Core.getShopItems(mapName, shop.shopId)
                    .filter(
                        (item) =>
                            item.category === "Enhancement" &&
                            item.level <= bot.player.level &&
                            (!item.upgrade || bot.player.isMember) &&
                            CoreLoneWolf.normalizeEnhancementName(item.name).includes(shop.enhancementName),
                    )
                    .sort((a, b) => b.level - a.level || Number(b.upgrade) - Number(a.upgrade))[0] ?? null;

            if (enhancement == null) {
                if (
                    slot === EnhancementSlot.Weapon &&
                    !this.isEnhancementUnlocked(slot, capeSpecial, helmSpecial, weaponSpecial) &&
                    this.tryPrepareWeaponFallback(type, weaponSpecial, weaponFallbacks, warnForElysiumUnlock)
                ) {
                    return;
                }

                this.logEnhancementResult(
                    slot,
                    requestedEnhancement,
                    this.explainFailure("skipped because no usable enhancement was found.").replace(/\.+$/, ""),
                );
                return;
            }

            const candidate = this.findEnhancedCandidate(
                slot,
                type,
                capeSpecial,
                helmSpecial,
                weaponSpecial,
                enhancement.level,
            );

            if (candidate != null) {
                if (bot.inventory.isEquipped(candidate.id)) {
                    this.logEnhancementResult(slot, requestedEnhancement, "already prepared");
                    return;
                }

                const equippedWeapon =
                    slot === EnhancementSlot.Weapon ? this.getEquippedEnhancementItem(EnhancementSlot.Weapon) : null;
                const candidateIsWeaker =
                    equippedWeapon != null &&
                    Core.getBoostFloat(candidate, "dmgAll") < Core.getBoostFloat(equippedWeapon, "dmgAll");

                if (candidateIsWeaker) {
                    this.logEnhancementResult(
                        slot,
                        requestedEnhancement,
                        "will be applied to the stronger equipped weapon",
                    );
                } else {
                    Core.equip(candidate.id);
                    if (bot.inventory.isEquipped(candidate.id)) {
                        this.logEnhancementResult(slot, requestedEnhancement, "equipped from inventory");
                        return;
                    }

                    this.logEnhancementResult(
                        slot,
                        requestedEnhancement,
                        this.explainFailure(
                            `could not be equipped from inventory. Using the current ${CoreLoneWolf.getEnhancementSlotName(slot)}.`,
                            true,
                        ).replace(/\.+$/, ""),
                    );
                }
            }

            const equippedItem = this.getEquippedEnhancementItem(slot);
            if (equippedItem == null) {
                this.logEnhancementResult(
                    slot,
                    requestedEnhancement,
                    `skipped because no ${CoreLoneWolf.getEnhancementSlotName(slot)} is equipped`,
                );
                return;
            }

            if (
                CoreLoneWolf.isRequestedEnhancement(
                    equippedItem,
                    slot,
                    type,
                    capeSpecial,
                    helmSpecial,
                    weaponSpecial,
                    enhancement.level,
                )
            ) {
                this.logEnhancementResult(slot, requestedEnhancement, "already prepared");
                return;
            }

            if (!this.isEnhancementUnlocked(slot, capeSpecial, helmSpecial, weaponSpecial)) {
                if (
                    slot === EnhancementSlot.Weapon &&
                    this.tryPrepareWeaponFallback(type, weaponSpecial, weaponFallbacks, warnForElysiumUnlock)
                ) {
                    return;
                }

                if (CoreLoneWolf.isMandatoryEnhancementUnlock(slot, capeSpecial, helmSpecial, weaponSpecial)) {
                    Core.logger(
                        `${slot}: ${requestedEnhancement} is not unlocked and is required.`,
                        "PrepareEnhancements",
                        { messageBox: true, stopBot: true },
                    );
                    return;
                }

                if (
                    warnForElysiumUnlock &&
                    slot === EnhancementSlot.Weapon &&
                    weaponSpecial === WeaponSpecial.Elysium
                ) {
                    Core.logger(
                        "Weapon: Elysium is not unlocked on Shaman. Ultra Gramiel may fail.",
                        "PrepareEnhancements",
                        { messageBox: true },
                    );
                    return;
                }

                this.logEnhancementResult(slot, requestedEnhancement, "skipped because it is not unlocked");
                return;
            }

            const roomId = bot.map?.roomId ?? 1;
            bot.send.packet(`%xt%zm%enhanceItemShop%${roomId}%${equippedItem.id}%${enhancement.id}%${shop.shopId}%`);
            Core.sleep();

            const updatedItem =
                bot.inventory.items.find((item) => item.id === equippedItem.id && item.equipped) ?? null;

            if (
                updatedItem == null ||
                !CoreLoneWolf.isRequestedEnhancement(
                    updatedItem,
                    slot,
                    type,
                    capeSpecial,
                    helmSpecial,
                    weaponSpecial,
                    enhancement.level,
                )
            ) {
                this.logEnhancementResult(
                    slot,
                    requestedEnhancement,
                    this.explainFailure("was not verified after application.", true).replace(/\.+$/, ""),
                );
                return;
            }

            this.logEnhancementResult(slot, requestedEnhancement, "applied");
        } catch (ex) {
            rethrowIfStopped(ex);

            bot.log(
                `CoreLoneWolf enhancement preparation failed for ${CoreLoneWolf.getEnhancementSlotName(slot)}: ${ex}`,
            );
            this.logEnhancementResult(
                slot,
                requestedEnhancement,
                this.explainFailure("preparation failed.").replace(/\.+$/, ""),
            );
        }
    }

    private tryPrepareWeaponFallback(
        type: EnhancementType,
        requestedWeapon: WeaponSpecial,
        weaponFallbacks: WeaponSpecial[] | null,
        warnForElysiumUnlock: boolean,
    ): boolean {
        if (weaponFallbacks == null || weaponFallbacks.length === 0) {
            return false;
        }

        const checkedWeapons = new Set([requestedWeapon]);

        for (const fallback of weaponFallbacks) {
            if (
                fallback === WeaponSpecial.None ||
                !checkedWeapons.add(fallback) ||
                !this.isEnhancementUnlocked(EnhancementSlot.Weapon, CapeSpecial.None, HelmSpecial.None, fallback)
            ) {
                continue;
            }
            const shop = this.tryGetEnhancementShop(
                EnhancementSlot.Weapon,
                type,
                CapeSpecial.None,
                HelmSpecial.None,
                fallback,
            );
            if (shop === null) {
                continue;
            }

            if (shop.forgeShop) {
                Core.join("forge");
                if (bot.shouldExit) {
                    return true;
                }
            }

            const mapName = bot.map?.name ?? "whitemap";
            const usable = Core.getShopItems(mapName, shop.shopId).some(
                (item) =>
                    item.category === "Enhancement" &&
                    item.level <= bot.player.level &&
                    (!item.upgrade || bot.player.isMember) &&
                    CoreLoneWolf.normalizeEnhancementName(item.name).includes(shop.enhancementName),
            );

            if (!usable) {
                continue;
            }

            const requestedName = CoreLoneWolf.getRequestedEnhancementName(
                EnhancementSlot.Weapon,
                type,
                CapeSpecial.None,
                HelmSpecial.None,
                requestedWeapon,
            );
            const fallbackName = CoreLoneWolf.getRequestedEnhancementName(
                EnhancementSlot.Weapon,
                type,
                CapeSpecial.None,
                HelmSpecial.None,
                fallback,
            );
            const isHealthVampFallback = fallback === WeaponSpecial.Health_Vamp;
            let fallbackMessage = `Weapon: ${requestedName} is not unlocked. Using ${fallbackName}.`;

            if (isHealthVampFallback) {
                const playerAlias = this.armyPlayerIndex >= 0 ? `Player ${this.armyPlayerIndex + 1}` : "Current Player";
                const currentClassName = bot.player.currentClass ?? "Unknown Class";
                fallbackMessage = `Weapon: ${requestedName} is not unlocked on ${playerAlias} (${currentClassName}). Using Health Vamp as fallback. The script may fail`;
            }

            Core.logger(fallbackMessage, "PrepareEnhancements", { messageBox: isHealthVampFallback });
            this.prepareEnhancementSlot(
                EnhancementSlot.Weapon,
                type,
                undefined,
                undefined,
                fallback,
                warnForElysiumUnlock,
                [],
            );
            return true;
        }

        return false;
    }

    private static isMandatoryEnhancementUnlock(
        slot: EnhancementSlot,
        capeSpecial: CapeSpecial,
        helmSpecial: HelmSpecial,
        weaponSpecial: WeaponSpecial,
    ): boolean {
        return slot === EnhancementSlot.Cape
            ? capeSpecial === CapeSpecial.Absolution ||
                  capeSpecial === CapeSpecial.Lament ||
                  capeSpecial === CapeSpecial.Penitence ||
                  capeSpecial === CapeSpecial.Vainglory
            : slot === EnhancementSlot.Helm
              ? helmSpecial === HelmSpecial.Vim ||
                helmSpecial === HelmSpecial.Examen ||
                helmSpecial === HelmSpecial.Forge ||
                helmSpecial === HelmSpecial.Pneuma
              : slot === EnhancementSlot.Weapon
                ? weaponSpecial === WeaponSpecial.Awe_Blast || weaponSpecial === WeaponSpecial.Health_Vamp
                : false;
    }

    /** The shop selling the enhancement, or null when the request is invalid (C#'s bool with `out` values). */
    private tryGetEnhancementShop(
        slot: EnhancementSlot,
        type: EnhancementType,
        capeSpecial: CapeSpecial,
        helmSpecial: HelmSpecial,
        weaponSpecial: WeaponSpecial,
    ): EnhancementShop | null {
        let shopId = 0;
        let enhancementName = "";
        let forgeShop = false;
        const found = (): EnhancementShop | null => (shopId > 0 ? { shopId, enhancementName, forgeShop } : null);

        if (EnhancementType[type] === undefined) {
            return null;
        }

        switch (slot) {
            case EnhancementSlot.Class:
                shopId = this.getNormalEnhancementShop(type);
                enhancementName = "armor";
                return found();
            case EnhancementSlot.Cape:
                if (CapeSpecial[capeSpecial] === undefined) {
                    return null;
                }
                shopId = capeSpecial === CapeSpecial.None ? this.getNormalEnhancementShop(type) : 2143;
                enhancementName =
                    capeSpecial === CapeSpecial.None
                        ? "cape"
                        : CoreLoneWolf.normalizeEnhancementName(CapeSpecial[capeSpecial]);
                forgeShop = capeSpecial !== CapeSpecial.None;
                return found();
            case EnhancementSlot.Helm:
                if (HelmSpecial[helmSpecial] === undefined) {
                    return null;
                }
                shopId = helmSpecial === HelmSpecial.None ? this.getNormalEnhancementShop(type) : 2164;
                enhancementName =
                    helmSpecial === HelmSpecial.None
                        ? "helm"
                        : CoreLoneWolf.normalizeEnhancementName(HelmSpecial[helmSpecial]);
                forgeShop = helmSpecial !== HelmSpecial.None;
                return found();
            case EnhancementSlot.Weapon:
                if (WeaponSpecial[weaponSpecial] === undefined) {
                    return null;
                }
                if (weaponSpecial === WeaponSpecial.None) {
                    shopId = this.getNormalEnhancementShop(type);
                    enhancementName = "weapon";
                } else if (weaponSpecial >= 2 && weaponSpecial <= 6) {
                    shopId = CoreLoneWolf.getAweEnhancementShop(type);
                    enhancementName = CoreLoneWolf.normalizeEnhancementName(WeaponSpecial[weaponSpecial]);
                } else {
                    shopId = 2142;
                    enhancementName = CoreLoneWolf.normalizeEnhancementName(WeaponSpecial[weaponSpecial]);
                    forgeShop = true;
                }
                return found();
            default:
                return null;
        }
    }

    private getNormalEnhancementShop(type: EnhancementType): number {
        const levelFifty = bot.player.level >= 50;
        return type === EnhancementType.Fighter
            ? levelFifty
                ? 768
                : 141
            : type === EnhancementType.Thief
              ? levelFifty
                  ? 767
                  : 142
              : type === EnhancementType.Hybrid
                ? levelFifty
                    ? 766
                    : 143
                : type === EnhancementType.Wizard
                  ? levelFifty
                      ? 765
                      : 144
                  : type === EnhancementType.Healer
                    ? levelFifty
                        ? 762
                        : 145
                    : type === EnhancementType.SpellBreaker
                      ? levelFifty
                          ? 764
                          : 146
                      : type === EnhancementType.Lucky
                        ? levelFifty
                            ? 763
                            : 147
                        : 0;
    }

    private static getAweEnhancementShop(type: EnhancementType): number {
        return type === EnhancementType.Fighter
            ? 635
            : type === EnhancementType.Thief
              ? 637
              : type === EnhancementType.Hybrid
                ? 633
                : type === EnhancementType.Wizard
                  ? 636
                  : type === EnhancementType.SpellBreaker
                    ? 636
                    : type === EnhancementType.Healer
                      ? 638
                      : type === EnhancementType.Lucky
                        ? 639
                        : 0;
    }

    private findEnhancedCandidate(
        slot: EnhancementSlot,
        type: EnhancementType,
        capeSpecial: CapeSpecial,
        helmSpecial: HelmSpecial,
        weaponSpecial: WeaponSpecial,
        enhancementLevel: number,
    ): InventoryItem | null {
        if (slot === EnhancementSlot.Class) {
            return null;
        }

        const candidates = bot.inventory.items.filter(
            (item) =>
                (!item.upgrade || bot.player.isMember) &&
                CoreLoneWolf.isItemInEnhancementSlot(item, slot) &&
                CoreLoneWolf.isRequestedEnhancement(
                    item,
                    slot,
                    type,
                    capeSpecial,
                    helmSpecial,
                    weaponSpecial,
                    enhancementLevel,
                ),
        );

        return slot === EnhancementSlot.Weapon
            ? ([...candidates].sort((a, b) => Core.getBoostFloat(b, "dmgAll") - Core.getBoostFloat(a, "dmgAll"))[0] ??
                  null)
            : (candidates[0] ?? null);
    }

    private getEquippedEnhancementItem(slot: EnhancementSlot): InventoryItem | null {
        return (
            bot.inventory.items.find((item) => item.equipped && CoreLoneWolf.isItemInEnhancementSlot(item, slot)) ??
            null
        );
    }

    private isEquippedEnhancementPrepared(
        slot: EnhancementSlot,
        type: EnhancementType,
        capeSpecial: CapeSpecial = CapeSpecial.None,
        helmSpecial: HelmSpecial = HelmSpecial.None,
        weaponSpecial: WeaponSpecial = WeaponSpecial.None,
    ): boolean {
        const item = this.getEquippedEnhancementItem(slot);
        return (
            item != null &&
            CoreLoneWolf.isRequestedEnhancement(item, slot, type, capeSpecial, helmSpecial, weaponSpecial, 100)
        );
    }

    private static isItemInEnhancementSlot(item: InventoryItem, slot: EnhancementSlot): boolean {
        return slot === EnhancementSlot.Class
            ? item.category === "Class"
            : slot === EnhancementSlot.Cape
              ? item.category === "Cape"
              : slot === EnhancementSlot.Helm
                ? item.category === "Helm"
                : slot === EnhancementSlot.Weapon
                  ? item.equipSlot?.toLowerCase() === "Weapon"?.toLowerCase()
                  : false;
    }

    private static isRequestedEnhancement(
        item: InventoryItem,
        slot: EnhancementSlot,
        type: EnhancementType,
        capeSpecial: CapeSpecial,
        helmSpecial: HelmSpecial,
        weaponSpecial: WeaponSpecial,
        enhancementLevel: number,
    ): boolean {
        if (item.enhancementLevel !== enhancementLevel) {
            return false;
        }

        return slot === EnhancementSlot.Class
            ? item.enhancementPatternId === type
            : slot === EnhancementSlot.Cape
              ? item.enhancementPatternId === (capeSpecial === CapeSpecial.None ? type : capeSpecial)
              : slot === EnhancementSlot.Helm
                ? item.enhancementPatternId === (helmSpecial === HelmSpecial.None ? type : helmSpecial)
                : slot === EnhancementSlot.Weapon && weaponSpecial === WeaponSpecial.None
                  ? item.enhancementPatternId === type
                  : slot === EnhancementSlot.Weapon && weaponSpecial === WeaponSpecial.Forge
                    ? item.procId === 0 && (item.enhancementPatternId === type || item.enhancementPatternId === 10)
                    : slot === EnhancementSlot.Weapon && weaponSpecial <= 6
                      ? item.enhancementPatternId === type && item.procId === weaponSpecial
                      : slot === EnhancementSlot.Weapon
                        ? item.procId === weaponSpecial
                        : false;
    }

    private isEnhancementUnlocked(
        slot: EnhancementSlot,
        capeSpecial: CapeSpecial,
        helmSpecial: HelmSpecial,
        weaponSpecial: WeaponSpecial,
    ): boolean {
        const questId =
            slot === EnhancementSlot.Cape
                ? capeSpecial === CapeSpecial.None
                    ? 0
                    : capeSpecial === CapeSpecial.Forge
                      ? 8758
                      : capeSpecial === CapeSpecial.Absolution
                        ? 8743
                        : capeSpecial === CapeSpecial.Avarice
                          ? 8745
                          : capeSpecial === CapeSpecial.Vainglory
                            ? 8744
                            : capeSpecial === CapeSpecial.Penitence
                              ? 8822
                              : capeSpecial === CapeSpecial.Lament
                                ? 8823
                                : -1
                : slot === EnhancementSlot.Helm
                  ? helmSpecial === HelmSpecial.None
                      ? 0
                      : helmSpecial === HelmSpecial.Forge
                        ? 8828
                        : helmSpecial === HelmSpecial.Vim
                          ? 8824
                          : helmSpecial === HelmSpecial.Examen
                            ? 8825
                            : helmSpecial === HelmSpecial.Anima
                              ? 8826
                              : helmSpecial === HelmSpecial.Pneuma
                                ? 8827
                                : helmSpecial === HelmSpecial.Hearty
                                  ? 9466
                                  : -1
                  : slot === EnhancementSlot.Weapon && weaponSpecial === WeaponSpecial.None
                    ? 0
                    : slot === EnhancementSlot.Weapon && weaponSpecial >= 2 && weaponSpecial <= 6
                      ? 2937
                      : slot === EnhancementSlot.Weapon
                        ? weaponSpecial === WeaponSpecial.Forge
                            ? 8738
                            : weaponSpecial === WeaponSpecial.Lacerate
                              ? 8739
                              : weaponSpecial === WeaponSpecial.Smite
                                ? 8740
                                : weaponSpecial === WeaponSpecial.Valiance
                                  ? 8741
                                  : weaponSpecial === WeaponSpecial.Arcanas_Concerto
                                    ? 8742
                                    : weaponSpecial === WeaponSpecial.Acheron
                                      ? 8820
                                      : weaponSpecial === WeaponSpecial.Elysium
                                        ? 8821
                                        : weaponSpecial === WeaponSpecial.Praxis
                                          ? 9171
                                          : weaponSpecial === WeaponSpecial.Dauntless
                                            ? 9172
                                            : weaponSpecial === WeaponSpecial.Ravenous
                                              ? 9560
                                              : -1
                        : 0;

        if (questId < 0) {
            return false;
        }
        if (questId === 0) {
            return true;
        }
        if (!Core.isCompletedBefore(questId)) {
            return false;
        }

        return (
            slot !== EnhancementSlot.Helm ||
            helmSpecial !== HelmSpecial.Hearty ||
            bot.reputation.hasRank("Grimskull Trolling", 7)
        );
    }

    private static normalizeEnhancementName(name: string): string {
        return name.replaceAll(" ", "").replaceAll("'", "").replaceAll("_", "").toLowerCase();
    }

    private static getEnhancementSlotName(slot: EnhancementSlot): string {
        return String(slot).toLowerCase();
    }

    private static getRequestedEnhancementName(
        slot: EnhancementSlot,
        type: EnhancementType,
        capeSpecial: CapeSpecial,
        helmSpecial: HelmSpecial,
        weaponSpecial: WeaponSpecial,
    ): string {
        const name =
            slot === EnhancementSlot.Class
                ? EnhancementType[type]
                : slot === EnhancementSlot.Cape && capeSpecial === CapeSpecial.None
                  ? EnhancementType[type]
                  : slot === EnhancementSlot.Cape
                    ? CapeSpecial[capeSpecial]
                    : slot === EnhancementSlot.Helm && helmSpecial === HelmSpecial.None
                      ? EnhancementType[type]
                      : slot === EnhancementSlot.Helm
                        ? HelmSpecial[helmSpecial]
                        : slot === EnhancementSlot.Weapon && weaponSpecial === WeaponSpecial.None
                          ? EnhancementType[type]
                          : slot === EnhancementSlot.Weapon && weaponSpecial >= 2 && weaponSpecial <= 6
                            ? `${EnhancementType[type]} ${WeaponSpecial[weaponSpecial]}`
                            : slot === EnhancementSlot.Weapon
                              ? WeaponSpecial[weaponSpecial]
                              : EnhancementType[type];

        return name.replaceAll("_", " ");
    }

    private logEnhancementResult(slot: EnhancementSlot, requestedEnhancement: string, result: string): void {
        Core.logger(`${slot}: ${requestedEnhancement} ${result}.`, "PrepareEnhancements");
    }

    /**
     * The LW scripts run their own skill engine, which another skill driver would fight. C# stops
     * the script when Skua's "Function Based Skills" plugin is on; Turu has no such plugin, so this
     * stops Turu's own skill timer (Advanced Skills) when something left it running.
     */
    validateFunctionBasedSkillsDisabled(): boolean {
        if (bot.skills.timerRunning) {
            bot.skills.stop();
            Core.logger(
                "Stopped the skill timer: the LW scripts use their own skill engine.",
                "ValidateFunctionBasedSkillsDisabled",
            );
        }
        return true;
    }

    validatePrivateRoomNumber(roomNumber: number): boolean {
        if (roomNumber >= 1001 && roomNumber <= 99999) {
            return true;
        }

        Core.logger(
            `Private room number ${roomNumber} is invalid. Use 1001 through 99999.`,
            "ValidatePrivateRoomNumber",
            { messageBox: true, stopBot: true },
        );
        return false;
    }

    acceptUltraQuest(questID: number): boolean {
        if (questID <= 0) {
            Core.logger(`Warning: Ultra quest ID ${questID} is invalid. Continuing.`, "AcceptUltraQuest");
            return false;
        }

        if (bot.quests.isInProgress(questID)) {
            Core.logger(`Ultra quest ${questID} is already accepted.`, "AcceptUltraQuest");
            return true;
        }

        if (bot.quests.isDailyComplete(questID)) {
            Core.logger(`Ultra quest ${questID} is already completed for the current reset.`, "AcceptUltraQuest");
            return false;
        }

        if (!bot.quests.isAvailable(questID)) {
            Core.logger(`Warning: Ultra quest ${questID} is unavailable. Continuing.`, "AcceptUltraQuest");
            return false;
        }

        Core.ensureAccept(questID);

        if (bot.quests.isInProgress(questID)) {
            Core.logger(`Ultra quest ${questID} accepted.`, "AcceptUltraQuest");
            return true;
        }

        Core.logger(
            this.explainFailure(`Warning: Ultra quest ${questID} could not be accepted. Continuing.`),
            "AcceptUltraQuest",
        );
        return false;
    }

    completeUltraQuest(questID: number): boolean {
        if (questID <= 0) {
            Core.logger(`Warning: Ultra quest ID ${questID} is invalid. Continuing.`, "CompleteUltraQuest");
            return false;
        }

        if (questID === this.bypassedUltraQuestID) {
            Core.logger(
                `Ultra quest ${questID} completion skipped because this account used the questline bypass.`,
                "CompleteUltraQuest",
            );
            return false;
        }

        if (bot.quests.isDailyComplete(questID)) {
            Core.logger(`Ultra quest ${questID} is already completed for the current reset.`, "CompleteUltraQuest");
            return true;
        }

        if (!bot.quests.isInProgress(questID)) {
            Core.logger(`Warning: Ultra quest ${questID} is not accepted. Completion skipped.`, "CompleteUltraQuest");
            return false;
        }

        Core.ensureComplete(questID);

        if (bot.quests.isDailyComplete(questID) && !bot.quests.isInProgress(questID)) {
            Core.logger(`Ultra quest ${questID} completed.`, "CompleteUltraQuest");
            return true;
        }

        Core.logger(
            this.explainFailure(`Warning: Ultra quest ${questID} could not be completed. Continuing.`),
            "CompleteUltraQuest",
        );
        return false;
    }

    validateUltraAccess(
        ultraQuestID: number,
        prerequisiteQuestID: number,
        prerequisiteQuestName: string,
        minimumLevel: number,
        ultraName: string,
        className: string,
    ): boolean {
        this.bypassedUltraQuestID = 0;

        if (!this.validateArmyRequirements(minimumLevel, ultraName)) {
            return false;
        }

        if (
            prerequisiteQuestID > 0 &&
            (!bot.quests.isUnlocked(ultraQuestID) || !bot.quests.hasBeenCompleted(prerequisiteQuestID))
        ) {
            Core.logger(
                `${ultraName} requires quest "${prerequisiteQuestName}" to be completed for Player ${this.armyPlayerIndex + 1} (${className}). The quest will be bypassed so this account can continue.`,
                "ValidateUltraAccess",
                { messageBox: true },
            );
            bot.quests.updateQuest(prerequisiteQuestID);
            this.bypassedUltraQuestID = ultraQuestID;
        }

        return !bot.shouldExit;
    }

    startArmySync(syncFileName: string, playerCount: number, optionCategory: string | null = null): boolean {
        if (!this.validateFunctionBasedSkillsDisabled()) {
            return false;
        }

        this.resetArmyState();

        // The sync file is a `bot.army` log named after it (C#: a file in Skua's options folder).
        if (!syncFileName?.trim() || /[\\/]/.test(syncFileName) || !syncFileName.toLowerCase().endsWith(".sync")) {
            return this.armyInitializationFailure("Sync file must be a filename ending in .sync.");
        }

        if (playerCount < 2 || playerCount > 7) {
            return this.armyInitializationFailure("Army player count must be from 2 through 7.");
        }

        if (bot.config == null) {
            return this.armyInitializationFailure("Army player configuration is unavailable.");
        }

        const players: string[] = new Array(playerCount).fill("");
        for (let index = 0; index < playerCount; index++) {
            const optionName = `player${index + 1}`;
            players[index] = CoreLoneWolf.normalizeArmyUsername(
                !optionCategory
                    ? bot.config.get<string>(optionName)
                    : bot.config.get<string>(optionCategory, optionName),
            );
        }

        if (players.some((player) => !player)) {
            return this.armyInitializationFailure("Every requested Army player name is required.");
        }

        if ([...new Set(players)].length !== players.length) {
            return this.armyInitializationFailure("Army player names must be unique.");
        }

        const username = CoreLoneWolf.normalizeArmyUsername(Core.username());
        const playerIndex = players.findIndex((player) => player.toLowerCase() === username.toLowerCase());
        if (playerIndex < 0) {
            return this.armyInitializationFailure("Current account is not in the Army roster.");
        }

        this.armyPlayers = players;
        this.armyUsername = username;
        this.armyPlayerIndex = playerIndex;
        this.armyLaunchToken = newToken();
        this.armySessionId = this.armyPlayerIndex === 0 ? newToken() : "";
        this.armySyncPath = syncFileName.slice(0, -".sync".length);
        this.armyInitialized = true;

        const started = this.armyPlayerIndex === 0 ? this.startLeaderArmySession() : this.joinFollowerArmySession();
        this.armySessionStarted = started;
        return started;
    }

    validateHouseRequirements(): boolean {
        return this.validateArmyRequirements();
    }

    private validateArmyRequirements(minimumLevel: number | null = null, ultraName = ""): boolean {
        // The game's raw house items (`sType`, `bEquip`): C# reads them into InventoryItem.
        let houseItems: { sType?: unknown; bEquip?: unknown }[] | null = null;
        let requestedHouseInventory = false;
        try {
            bot.wait.forTrue(() => {
                if (!bot.player.loaded) {
                    return false;
                }

                houseItems = bot.flash.get<{ sType?: unknown; bEquip?: unknown }[] | null>("world.myAvatar.houseitems");
                if (houseItems != null) {
                    return true;
                }

                if (!requestedHouseInventory) {
                    requestedHouseInventory = true;
                    bot.flash.callGameFunction("world.loadHouseInventory");
                }

                return false;
            }, 40);
        } catch (error) {
            rethrowIfStopped(error);

            houseItems = null;
        }

        if (bot.shouldExit) {
            return false;
        }

        if (minimumLevel != null) {
            if (bot.player.level < minimumLevel && !this.sendArmySignal("ULTRA_LEVEL_INVALID")) {
                return false;
            }

            const hasRequiredDamageBoost = bot.inventory.items.some(
                (item) =>
                    item.equipped &&
                    (!Core.noneEnhancableFilter(item) || item.category === "Armor") &&
                    Core.getBoostFloat(item, "dmgAll") >= 1.3,
            );

            if (!hasRequiredDamageBoost && !this.sendArmySignal("ULTRA_WEAPON_INVALID")) {
                return false;
            }
        }

        const failureSignal =
            houseItems == null
                ? "HOUSE_REQUIREMENT_UNAVAILABLE"
                : (houseItems as { sType?: unknown; bEquip?: unknown }[]).some(
                        (item) =>
                            item != null &&
                            item.sType === "House" &&
                            (item.bEquip === true || item.bEquip === 1 || item.bEquip === "1"),
                    )
                  ? null
                  : "HOUSE_REQUIREMENT_INVALID";

        if (failureSignal != null && !this.sendArmySignal(failureSignal)) {
            return false;
        }

        if (!this.syncArmy(minimumLevel != null ? "ULTRA_ACCESS_CHECK" : "HOUSE_REQUIREMENTS")) {
            return false;
        }

        if (minimumLevel != null) {
            const playersBelowLevel: string[] = [];
            const playersMissingDamageBoost: string[] = [];
            for (let playerNumber = 1; playerNumber <= this.armyPlayers.length; playerNumber++) {
                if (this.hasArmySignal("ULTRA_LEVEL_INVALID", playerNumber)) {
                    playersBelowLevel.push(`Player ${playerNumber}`);
                }

                if (this.hasArmySignal("ULTRA_WEAPON_INVALID", playerNumber)) {
                    playersMissingDamageBoost.push(`Player ${playerNumber}`);
                }
            }

            if (playersBelowLevel.length > 0) {
                Core.logger(
                    `${ultraName} requires every player to be at least level ${minimumLevel}. Players below the requirement: ${playersBelowLevel.join(", ")}.`,
                    "ValidateUltraAccess",
                    { messageBox: true, stopBot: true },
                );
                return false;
            }

            if (playersMissingDamageBoost.length > 0) {
                Core.logger(
                    `${ultraName} requires every player to equip a weapon or armor with at least a 30% damage boost to all before starting. Players missing the equipped boost: ${playersMissingDamageBoost.join(", ")}. Equip a qualifying weapon or armor and restart the script.`,
                    "ValidateUltraAccess",
                    { messageBox: true, stopBot: true },
                );
                return false;
            }
        }

        const lines = this.readArmyLines();
        if (bot.shouldExit || this.armyTransportFailed || !this.canContinueArmySync(lines)) {
            return false;
        }

        const reports = lines
            .map((line) => line.split("|"))
            .filter(
                (parts) =>
                    parts.length === 5 &&
                    parts[0] === "SIGNAL" &&
                    parts[1] === CoreLoneWolf.armyProtocolVersion &&
                    parts[2] === this.armySessionId,
            );

        const playersMissingHouse: string[] = [];
        const playersUnavailable: string[] = [];
        for (let index = 0; index < this.armyPlayers.length; index++) {
            for (const report of reports) {
                if (
                    !(
                        CoreLoneWolf.normalizeArmyUsername(report[4])?.toLowerCase() ===
                        this.armyPlayers[index]?.toLowerCase()
                    )
                ) {
                    continue;
                }

                if (report[3] === "HOUSE_REQUIREMENT_INVALID") {
                    playersMissingHouse.push(`Player ${index + 1}`);
                    break;
                }

                if (report[3] === "HOUSE_REQUIREMENT_UNAVAILABLE") {
                    playersUnavailable.push(`Player ${index + 1}`);
                    break;
                }
            }
        }

        const failures: string[] = [];
        if (playersMissingHouse.length > 0) {
            failures.push(
                `Every player must own and equip a house before starting. Players missing an equipped house: ${playersMissingHouse.join(", ")}. Buy or equip a house and restart the script.`,
            );
        }
        if (playersUnavailable.length > 0) {
            failures.push(
                `House requirement could not be verified for: ${playersUnavailable.join(", ")}. Wait for the account to finish loading and restart the script.`,
            );
        }

        if (failures.length === 0) {
            return !bot.shouldExit;
        }

        Core.logger(failures.join(" "), "ValidateEquippedHouseRequirement", { messageBox: true, stopBot: true });
        return false;
    }

    syncArmy(step: string): boolean {
        if (!this.requireArmySession()) {
            return false;
        }

        if (!this.canContinueArmySync(this.readArmyLines())) {
            return false;
        }

        const stepName = CoreLoneWolf.normalizeArmyRecordName(step);
        if (!stepName) {
            Core.logger("Army sync step name is invalid.", "CoreLoneWolf");
            return false;
        }

        return this.armyPlayerIndex === 0 ? this.runLeaderArmySync(stepName) : this.runFollowerArmySync(stepName);
    }

    sendArmySignal(signal: string): boolean {
        if (!this.requireArmySession()) {
            return false;
        }

        const lines = this.readArmyLines();
        if (!this.canContinueArmySync(lines)) {
            return false;
        }

        const signalName = CoreLoneWolf.normalizeArmyRecordName(signal);
        if (!signalName) {
            Core.logger("Army signal name is invalid.", "CoreLoneWolf");
            return false;
        }

        return this.appendArmyRecord([
            "SIGNAL",
            CoreLoneWolf.armyProtocolVersion,
            this.armySessionId,
            signalName,
            this.armyUsername,
        ]);
    }

    hasArmySignal(signal: string, senderPlayerNumber: number): boolean {
        if (!this.requireArmySession()) {
            return false;
        }

        const signalName = CoreLoneWolf.normalizeArmyRecordName(signal);
        if (!signalName) {
            Core.logger("Army signal name is invalid.", "CoreLoneWolf");
            return false;
        }

        if (senderPlayerNumber < 1 || senderPlayerNumber > this.armyPlayers.length) {
            Core.logger("Army signal sender player number is invalid.", "CoreLoneWolf");
            return false;
        }

        const lines = this.readArmyLines();
        if (!this.canContinueArmySync(lines)) {
            return false;
        }

        const expectedSender = this.armyPlayers[senderPlayerNumber - 1];
        for (const line of lines) {
            const parts = line.split("|");
            if (
                parts.length === 5 &&
                parts[0] === "SIGNAL" &&
                parts[1] === CoreLoneWolf.armyProtocolVersion &&
                parts[2] === this.armySessionId &&
                CoreLoneWolf.isArmyRecordName(parts[3]) &&
                parts[3] === signalName &&
                CoreLoneWolf.normalizeArmyUsername(parts[4])?.toLowerCase() === expectedSender?.toLowerCase()
            ) {
                return true;
            }
        }

        return false;
    }

    shouldResetFight(fightAttempt: number, deadPlayerThreshold = 2): boolean {
        if (!this.requireArmySession()) {
            return false;
        }

        if (fightAttempt <= 0) {
            Core.logger("Fight attempt must be greater than zero.", "CoreLoneWolf");
            return false;
        }

        const lines = this.readArmyLines();
        if (!this.canContinueArmySync(lines)) {
            return false;
        }

        const deadSignal = `FIGHT_DEAD_${fightAttempt}`;
        const aliveSignal = `FIGHT_ALIVE_${fightAttempt}`;
        const resetSignal = `FIGHT_RESET_${fightAttempt}`;
        const playerAlive = bot.player.alive;

        if (this.reportedFightAttempt !== fightAttempt) {
            this.reportedFightAttempt = fightAttempt;
            this.reportedFightAlive = true;
        }

        if (this.reportedFightAlive !== playerAlive) {
            const stateSignal = playerAlive ? aliveSignal : deadSignal;
            if (
                !this.appendArmyRecord([
                    "SIGNAL",
                    CoreLoneWolf.armyProtocolVersion,
                    this.armySessionId,
                    stateSignal,
                    this.armyUsername,
                ])
            ) {
                return false;
            }

            this.reportedFightAlive = playerAlive;
        }

        const playerOne = this.armyPlayers[0];
        for (const line of lines) {
            const parts = line.split("|");
            if (
                parts.length === 5 &&
                parts[0] === "SIGNAL" &&
                parts[1] === CoreLoneWolf.armyProtocolVersion &&
                parts[2] === this.armySessionId &&
                parts[3] === resetSignal &&
                CoreLoneWolf.normalizeArmyUsername(parts[4])?.toLowerCase() === playerOne?.toLowerCase()
            ) {
                return true;
            }
        }

        const latestAlive: Map<string, boolean> = new Map();
        for (let index = lines.length - 1; index >= 0; index--) {
            const parts = lines[index].split("|");
            if (
                parts.length !== 5 ||
                parts[0] !== "SIGNAL" ||
                parts[1] !== CoreLoneWolf.armyProtocolVersion ||
                !(parts[2] === this.armySessionId) ||
                (!(parts[3] === deadSignal) && !(parts[3] === aliveSignal))
            ) {
                continue;
            }

            const sender = CoreLoneWolf.normalizeArmyUsername(parts[4]);
            if (!this.armyPlayers.includes(sender) || latestAlive.has(sender)) {
                continue;
            }

            latestAlive.set(sender, parts[3] === aliveSignal);
        }

        latestAlive.set(this.armyUsername, playerAlive);
        if ([...latestAlive].filter((state) => !state[1]).length < deadPlayerThreshold || this.armyPlayerIndex !== 0) {
            return false;
        }

        return this.appendArmyRecord([
            "SIGNAL",
            CoreLoneWolf.armyProtocolVersion,
            this.armySessionId,
            resetSignal,
            this.armyUsername,
        ]);
    }

    sendArmyTimestamp(signal: string, unixMilliseconds: number): boolean {
        if (!this.requireArmySession()) {
            return false;
        }

        const lines = this.readArmyLines();
        if (!this.canContinueArmySync(lines)) {
            return false;
        }

        const signalName = CoreLoneWolf.normalizeArmyRecordName(signal);
        if (!signalName) {
            Core.logger("Army timestamp name is invalid.", "CoreLoneWolf");
            return false;
        }

        if (unixMilliseconds <= 0) {
            Core.logger("Army timestamp value is invalid.", "CoreLoneWolf");
            return false;
        }

        return this.appendArmyRecord([
            "TIMESTAMP",
            CoreLoneWolf.armyProtocolVersion,
            this.armySessionId,
            signalName,
            this.armyUsername,
            String(unixMilliseconds),
        ]);
    }

    getArmyTimestamp(signal: string, senderPlayerNumber: number): number {
        if (!this.requireArmySession()) {
            return 0;
        }

        const signalName = CoreLoneWolf.normalizeArmyRecordName(signal);
        if (!signalName) {
            Core.logger("Army timestamp name is invalid.", "CoreLoneWolf");
            return 0;
        }

        if (senderPlayerNumber < 1 || senderPlayerNumber > this.armyPlayers.length) {
            Core.logger("Army timestamp sender player number is invalid.", "CoreLoneWolf");
            return 0;
        }

        const lines = this.readArmyLines();
        if (!this.canContinueArmySync(lines)) {
            return 0;
        }

        const expectedSender = this.armyPlayers[senderPlayerNumber - 1];
        for (let index = lines.length - 1; index >= 0; index--) {
            const parts = lines[index].split("|");
            if (
                parts.length === 6 &&
                parts[0] === "TIMESTAMP" &&
                parts[1] === CoreLoneWolf.armyProtocolVersion &&
                parts[2] === this.armySessionId &&
                CoreLoneWolf.isArmyRecordName(parts[3]) &&
                parts[3] === signalName &&
                CoreLoneWolf.normalizeArmyUsername(parts[4])?.toLowerCase() === expectedSender?.toLowerCase() &&
                /^\d+$/.test(parts[5]) &&
                Number(parts[5]) > 0
            ) {
                return Number(parts[5]);
            }
        }

        return 0;
    }

    isArmyPlayer(playerNumber: number): boolean {
        return (
            this.armyInitialized &&
            playerNumber >= 1 &&
            playerNumber <= this.armyPlayers.length &&
            this.armyPlayerIndex === playerNumber - 1
        );
    }

    stopArmySync(reason = ""): boolean {
        if (!this.requireArmySession()) {
            return false;
        }

        if (!this.canContinueArmySync(this.readArmyLines())) {
            return false;
        }

        if (this.armyPlayerIndex !== 0) {
            Core.logger("Only playerOne may stop Army sync.", "CoreLoneWolf");
            return false;
        }

        if (!CoreLoneWolf.isSafeArmyField(reason)) {
            Core.logger("Army stop reason contains invalid data.", "CoreLoneWolf");
            return false;
        }

        return this.appendArmyRecord(["STOP", CoreLoneWolf.armyProtocolVersion, this.armySessionId, reason]);
    }

    private startLeaderArmySession(): boolean {
        if (!this.clearArmyFile()) {
            return false;
        }

        if (
            !this.appendArmyRecord(["RESET", CoreLoneWolf.armyProtocolVersion, this.armySessionId]) ||
            !this.writeArmyReady(this.armySessionId)
        ) {
            return false;
        }

        const launchTokens = this.waitForArmyReady(this.armySessionId);
        if (launchTokens == null) {
            return false;
        }

        const start = ["START", CoreLoneWolf.armyProtocolVersion, this.armySessionId];
        start.push(...this.armyPlayers.map((player) => launchTokens.get(player)!));
        return this.appendArmyRecord(start);
    }

    private joinFollowerArmySession(): boolean {
        Core.logger("Waiting for playerOne to start Army sync.", "CoreLoneWolf");
        let readySession = "";

        while (!bot.shouldExit && !this.armyTransportFailed) {
            const lines = this.readArmyLines();
            const sessionId = CoreLoneWolf.findLatestArmyReset(lines);
            if (sessionId == null) {
                bot.sleep(CoreLoneWolf.armyPollDelay);
                continue;
            }

            if (!(readySession === sessionId)) {
                if (!this.writeArmyReady(sessionId)) {
                    return false;
                }

                readySession = sessionId;
            }

            if (this.hasMatchingArmyStart(lines, sessionId)) {
                if (CoreLoneWolf.hasArmyStop(lines, sessionId)) {
                    return false;
                }

                this.armySessionId = sessionId;
                return true;
            }

            bot.sleep(CoreLoneWolf.armyPollDelay);
        }

        return false;
    }

    private writeArmyReady(sessionId: string): boolean {
        return this.appendArmyRecord([
            "READY",
            CoreLoneWolf.armyProtocolVersion,
            sessionId,
            this.armyUsername,
            this.armyLaunchToken,
        ]);
    }

    private waitForArmyReady(sessionId: string): Map<string, string> | null {
        let previousMissing = "";
        while (!bot.shouldExit && !this.armyTransportFailed) {
            const tokens: Map<string, string> = new Map();
            for (const line of this.readArmyLines()) {
                const parts = line.split("|");
                if (
                    parts.length !== 5 ||
                    parts[0] !== "READY" ||
                    parts[1] !== CoreLoneWolf.armyProtocolVersion ||
                    !(parts[2] === sessionId)
                ) {
                    continue;
                }

                const username = CoreLoneWolf.normalizeArmyUsername(parts[3]);
                if (this.armyPlayers.includes(username) && isToken(parts[4])) {
                    tokens.set(username, parts[4]);
                }
            }

            if (this.armyPlayers.every((player) => tokens.has(player))) {
                return tokens;
            }

            const missing = this.logArmyNames(this.armyPlayers.filter((player) => !tokens.has(player)));
            if (!(missing === previousMissing)) {
                Core.logger(`Waiting for Army players: ${missing}.`, "CoreLoneWolf");
                previousMissing = missing;
            }

            bot.sleep(CoreLoneWolf.armyPollDelay);
        }

        return null;
    }

    private hasMatchingArmyStart(lines: string[], sessionId: string): boolean {
        for (let index = lines.length - 1; index >= 0; index--) {
            const parts = lines[index].split("|");
            if (
                parts.length !== 3 + this.armyPlayers.length ||
                parts[0] !== "START" ||
                parts[1] !== CoreLoneWolf.armyProtocolVersion ||
                !(parts[2] === sessionId)
            ) {
                continue;
            }

            const tokens = parts.slice(3);
            return tokens.every((token) => isToken(token)) && tokens[this.armyPlayerIndex] === this.armyLaunchToken;
        }

        return false;
    }

    private runLeaderArmySync(stepName: string): boolean {
        const stepId = this.nextArmyStepId;
        if (
            !this.appendArmyRecord([
                "STEP",
                CoreLoneWolf.armyProtocolVersion,
                this.armySessionId,
                String(stepId),
                stepName,
            ])
        ) {
            return false;
        }

        this.nextArmyStepId++;
        if (!this.writeArmyArrived(stepId)) {
            return false;
        }

        let previousMissing = "";
        while (!bot.shouldExit && !this.armyTransportFailed) {
            const lines = this.readArmyLines();
            if (!this.canContinueArmySync(lines)) {
                return false;
            }

            const arrived = this.getArmyArrivals(lines, stepId);
            if (this.armyPlayers.every((player) => arrived.has(player))) {
                if (
                    !this.appendArmyRecord([
                        "CONTINUE",
                        CoreLoneWolf.armyProtocolVersion,
                        this.armySessionId,
                        String(stepId),
                    ])
                ) {
                    return false;
                }

                this.lastArmyStepId = stepId;
                return true;
            }

            const missing = this.logArmyNames(this.armyPlayers.filter((player) => !arrived.has(player)));
            if (!(missing === previousMissing)) {
                Core.logger(`Waiting for Army players: ${missing}.`, "CoreLoneWolf");
                previousMissing = missing;
            }

            bot.sleep(CoreLoneWolf.armyPollDelay);
        }

        return false;
    }

    private runFollowerArmySync(expectedStepName: string): boolean {
        while (!bot.shouldExit && !this.armyTransportFailed) {
            const lines = this.readArmyLines();
            if (!this.canContinueArmySync(lines)) {
                return false;
            }

            const step = this.tryFindNextArmyStep(lines);
            if (step === null) {
                bot.sleep(CoreLoneWolf.armyPollDelay);
                continue;
            }
            const { stepId, stepName } = step;

            if (!(stepName === expectedStepName)) {
                Core.logger("Army sync step does not match playerOne.", "CoreLoneWolf");
                return false;
            }

            if (!this.writeArmyArrived(stepId)) {
                return false;
            }

            while (!bot.shouldExit && !this.armyTransportFailed) {
                const continueLines = this.readArmyLines();
                if (!this.canContinueArmySync(continueLines)) {
                    return false;
                }

                if (this.hasArmyContinue(continueLines, stepId)) {
                    this.lastArmyStepId = stepId;
                    return true;
                }

                bot.sleep(CoreLoneWolf.armyPollDelay);
            }
        }

        return false;
    }

    private writeArmyArrived(stepId: number): boolean {
        return this.appendArmyRecord([
            "ARRIVED",
            CoreLoneWolf.armyProtocolVersion,
            this.armySessionId,
            String(stepId),
            this.armyUsername,
        ]);
    }

    private getArmyArrivals(lines: string[], stepId: number): Set<string> {
        const arrived: Set<string> = new Set();
        for (const line of lines) {
            const parts = line.split("|");
            if (
                parts.length !== 5 ||
                parts[0] !== "ARRIVED" ||
                parts[1] !== CoreLoneWolf.armyProtocolVersion ||
                !(parts[2] === this.armySessionId) ||
                parseArmyStepId(parts[3]) !== stepId
            ) {
                continue;
            }

            const username = CoreLoneWolf.normalizeArmyUsername(parts[4]);
            if (this.armyPlayers.includes(username)) {
                arrived.add(username);
            }
        }

        return arrived;
    }

    /** The lowest STEP after the last one done, or null (C#'s bool with two `out` values). */
    private tryFindNextArmyStep(lines: string[]): { stepId: number; stepName: string } | null {
        let nextStepId = Number.MAX_SAFE_INTEGER;
        let nextStepName = "";

        for (const line of lines) {
            const parts = line.split("|");
            const stepId = parts.length === 5 ? parseArmyStepId(parts[3]) : null;
            if (
                stepId === null ||
                parts[0] !== "STEP" ||
                parts[1] !== CoreLoneWolf.armyProtocolVersion ||
                parts[2] !== this.armySessionId ||
                stepId <= this.lastArmyStepId ||
                stepId >= nextStepId ||
                !CoreLoneWolf.isArmyRecordName(parts[4])
            ) {
                continue;
            }

            nextStepId = stepId;
            nextStepName = parts[4];
        }

        return nextStepId !== Number.MAX_SAFE_INTEGER ? { stepId: nextStepId, stepName: nextStepName } : null;
    }

    private hasArmyContinue(lines: string[], stepId: number): boolean {
        for (const line of lines) {
            const parts = line.split("|");
            if (
                parts.length === 4 &&
                parts[0] === "CONTINUE" &&
                parts[1] === CoreLoneWolf.armyProtocolVersion &&
                parts[2] === this.armySessionId &&
                parseArmyStepId(parts[3]) === stepId
            ) {
                return true;
            }
        }

        return false;
    }

    private canContinueArmySync(lines: string[]): boolean {
        const latestSessionId = CoreLoneWolf.findLatestArmyReset(lines);
        if (latestSessionId != null && !(latestSessionId === this.armySessionId)) {
            if (!this.armySessionFailureLogged) {
                Core.logger("Army sync session was replaced.", "CoreLoneWolf", { messageBox: true, stopBot: true });
                this.armySessionFailureLogged = true;
            }

            return false;
        }

        if (CoreLoneWolf.hasArmyStop(lines, this.armySessionId)) {
            if (!this.armyStopLogged) {
                Core.logger("Army sync was stopped by playerOne.", "CoreLoneWolf");
                this.armyStopLogged = true;
            }

            return false;
        }

        return true;
    }

    private static findLatestArmyReset(lines: string[]): string | null {
        for (let index = lines.length - 1; index >= 0; index--) {
            const parts = lines[index].split("|");
            if (
                parts.length === 3 &&
                parts[0] === "RESET" &&
                parts[1] === CoreLoneWolf.armyProtocolVersion &&
                isToken(parts[2])
            ) {
                return parts[2];
            }
        }

        return null;
    }

    private static hasArmyStop(lines: string[], sessionId: string): boolean {
        for (const line of lines) {
            const parts = line.split("|");
            if (
                parts.length === 4 &&
                parts[0] === "STOP" &&
                parts[1] === CoreLoneWolf.armyProtocolVersion &&
                parts[2] === sessionId &&
                CoreLoneWolf.isSafeArmyField(parts[3])
            ) {
                return true;
            }
        }

        return false;
    }

    // C# keeps the sync records in a file in Skua's options folder and retries on IOException;
    // Turu keeps them in a `bot.army` log (`armySyncPath` is its name), whose calls hold the log's
    // lock and wait for it themselves, so any error is a transport failure.
    private appendArmyRecord(fields: string[]): boolean {
        if (fields.length === 0 || fields.some((field) => !CoreLoneWolf.isSafeArmyField(field))) {
            Core.logger("Army sync record contains invalid data.", "CoreLoneWolf");
            return false;
        }

        if (bot.shouldExit || this.armyTransportFailed) {
            return false;
        }
        try {
            bot.army.appendLog(this.armySyncPath, fields.join("|"));
            this.logArmyRecord(fields);
            return true;
        } catch (error) {
            rethrowIfStopped(error);
            this.setArmyTransportFailure(error);
            return false;
        }
    }

    private readArmyLines(): string[] {
        if (bot.shouldExit || this.armyTransportFailed) {
            return [];
        }
        try {
            return bot.army.readLog(this.armySyncPath);
        } catch (error) {
            rethrowIfStopped(error);
            this.setArmyTransportFailure(error);
            return [];
        }
    }

    private clearArmyFile(): boolean {
        if (bot.shouldExit || this.armyTransportFailed) {
            return false;
        }
        try {
            bot.army.clearLog(this.armySyncPath);
            return true;
        } catch (error) {
            rethrowIfStopped(error);
            this.setArmyTransportFailure(error);
            return false;
        }
    }

    private logArmyRecord(fields: string[]): void {
        switch (fields[0]) {
            case "RESET":
                Core.logger("Army sync reset.", "CoreLoneWolf");
                break;
            case "START":
                Core.logger("Army sync started.", "CoreLoneWolf");
                break;
            case "STEP":
                if (fields.length > 4) {
                    Core.logger(`Army sync step ${fields[4]}.`, "CoreLoneWolf");
                }
                break;
            case "CONTINUE":
                Core.logger("Army sync continuing.", "CoreLoneWolf");
                break;
            case "STOP":
                Core.logger("Army sync stop sent.", "CoreLoneWolf");
                break;
        }
    }

    private setArmyTransportFailure(exception: unknown): void {
        this.armyTransportFailed = true;
        bot.log(`CoreLoneWolf Army sync log access failed: ${String(exception)}`);
        if (!this.armyTransportFailureLogged) {
            Core.logger("Army sync log access failed.", "CoreLoneWolf", { messageBox: true, stopBot: true });
            this.armyTransportFailureLogged = true;
        }
    }

    private requireArmySession(): boolean {
        if (!this.armyInitialized) {
            Core.logger("Army sync has not been initialized.", "CoreLoneWolf", { messageBox: true, stopBot: true });
            return false;
        }

        if (this.armySessionStarted && !!this.armySessionId) {
            return true;
        }

        Core.logger("Army sync session has not started.", "CoreLoneWolf", { messageBox: true, stopBot: true });
        return false;
    }

    private armyInitializationFailure(message: string): boolean {
        Core.logger(message, "CoreLoneWolf", { messageBox: true, stopBot: true });
        return false;
    }

    private logArmyNames(usernames: string[]): string {
        return usernames.map(this.logArmyName.bind(this)).join(", ");
    }

    private logArmyName(username: string): string {
        const normalized = CoreLoneWolf.normalizeArmyUsername(username);
        const index = this.armyPlayers.findIndex((player) => player.toLowerCase() === normalized.toLowerCase());
        return index >= 0 && index < CoreLoneWolf.armyAliases.length
            ? CoreLoneWolf.armyAliases[index]
            : "unknownPlayer";
    }

    private resetArmyState(): void {
        this.armyPlayers = [];
        this.armyUsername = "";
        this.armySyncPath = "";
        this.armyLaunchToken = "";
        this.armySessionId = "";
        this.armyPlayerIndex = -1;
        this.nextArmyStepId = 1;
        this.lastArmyStepId = 0;
        this.armyInitialized = false;
        this.armySessionStarted = false;
        this.armySessionFailureLogged = false;
        this.armyStopLogged = false;
        this.armyTransportFailed = false;
        this.armyTransportFailureLogged = false;
        this.reportedFightAttempt = 0;
        this.reportedFightAlive = null;
    }

    private static normalizeArmyUsername(username: string | null): string {
        return username?.trim().toLowerCase() ?? "";
    }

    private static normalizeArmyRecordName(name: string | null): string {
        const normalized = name?.trim().toUpperCase() ?? "";
        return CoreLoneWolf.isArmyRecordName(normalized) ? normalized : "";
    }

    private static isArmyRecordName(name: string): boolean {
        return /^[A-Z0-9_]+$/.test(name);
    }

    private static isSafeArmyField(value: string | null): boolean {
        return (
            value != null &&
            !value.includes("|") &&
            !value.includes("\r") &&
            !value.includes("\n") &&
            !value.includes("\0")
        );
    }
}

export class TargetedPrioritySkillRequest {
    constructor(skill: number, targetMapId: number, returnMapId: number) {
        this.skill = skill;
        this.targetMapId = targetMapId;
        this.returnMapId = returnMapId;
    }

    skill!: number;
    targetMapId!: number;
    returnMapId!: number;
}

export class LimitedPrioritySkillRequest {
    constructor(skill: number, remainingUses: number) {
        this.skill = skill;
        this.remainingUses = remainingUses;
    }

    skill!: number;
    remainingUses!: number;
}

/** How a potion is bought at the alchemy shop (C# `TryGetPotionRecipe`'s `out` values). */
/** Where an enhancement is sold (C# `TryGetEnhancementShop`'s `out` values). */
interface EnhancementShop {
    shopId: number;
    enhancementName: string;
    forgeShop: boolean;
}

interface PotionRecipe {
    voucherName: string;
    voucherQuantity: number;
    voucherCost: number;
    potionQuantity: number;
    factionName: string | null;
    factionRank: number;
}

export class ClassPreset {
    className: string = "";
    alternateClassNames: string[] = [];
    skills: number[] = [];
    skillMode: SkillEngineMode = SkillEngineMode.Simple;
    baseEnhancement: EnhancementType = EnhancementType.Lucky;
    capeEnhancement: CapeSpecial = CapeSpecial.None;
    helmEnhancement: HelmSpecial = HelmSpecial.None;
    weaponEnhancement: WeaponSpecial = WeaponSpecial.None;
    weaponEnhancementFallbacks: WeaponSpecial[] = [WeaponSpecial.Valiance, WeaponSpecial.Health_Vamp];
    tonic: string = "";
    elixir: string = "";
    combatPotion!: string | null;
}

/** C#'s `Interlocked.Exchange` on a field: the engine runs on the script thread, so a plain swap. */
function exchange<T>(current: T, write: (value: T) => void, value: T): T {
    write(value);
    return current;
}

/** C#'s `Interlocked.CompareExchange` on a field: sets `value` when it holds `comparand`; returns what it held. */
function compareExchange<T>(current: T, write: (value: T) => void, value: T, comparand: T): T {
    if (current === comparand) write(value);
    return current;
}

/** A random token as C#'s `Guid.NewGuid().ToString("N")` prints one: 32 hex digits. */
function newToken(): string {
    let token = "";
    for (let i = 0; i < 32; i++) token += Math.floor(Math.random() * 16).toString(16);
    return token;
}

/** C#'s `Guid.TryParseExact(text, "N", out _)`. */
function isToken(text: string): boolean {
    return /^[0-9a-f]{32}$/i.test(text);
}

/** C#'s `long.TryParse` of an army step ID: the number, or null for anything else. */
function parseArmyStepId(text: string): number | null {
    return /^-?\d+$/.test(text) ? Number(text) : null;
}
