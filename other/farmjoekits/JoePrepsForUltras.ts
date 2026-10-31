/*
name: JoePrepsForUltras
description: This script will farm all the required items for Ultra Bosses for the Grimoire client ultra scripts made by Insert.
tags: joe, ultra, boss, preparation, farm
*/
// Port of Scripts/Other/FarmJoeKits/JoePrepsForUltras.cs.

import { bot, choices, defineScriptOptions, option } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { LordOfOrder } from "../../dailies/LordOfOrder";
import { UnlockForgeEnhancements } from "../../enhancement/UnlockForgeEnhancements";
import { CoreNSOD } from "../../evil/nsod/CoreNSOD";
import { BuyScrolls, Scrolls } from "../../farm/BuyScrolls";
import { ArchPaladin } from "../../good/ArchPaladin";
import { CoreLR } from "../../legion/revenant/CoreLR";
import { StoneCrusher } from "../classes/rep-based/StoneCrusher";
import { VerusDoomKnightClass } from "../classes/VerusDoomKnight";
import { needYourStrongestPotions } from "../various/Potions";
import { AllStories } from "../../story/0AllStories";

const Adv = new CoreAdvanced();
const Farm = new CoreFarms();
const unlockForgeEnhancements = new UnlockForgeEnhancements();
const AP = new ArchPaladin();
const SC = new StoneCrusher();
const LOO = new LordOfOrder();
const Scroll = new BuyScrolls();
const allStories = new AllStories();
const NSOD = new CoreNSOD();
const LR = new CoreLR();
const VDK = new VerusDoomKnightClass();

export enum PlayerNumber {
    Player1 = "Player1",
    Player2 = "Player2",
    Player3 = "Player3",
    Player4 = "Player4",
}

export class JoePrepsForUltras {
    playerSetup(): void {
        if (!bot.config!.get<boolean>("GetClasses")) {
            bot.log("Class Aquisition disabled, skipping this part.");
            this.otherPrep();
            return;
        }

        const playerNumber = bot.config!.get<PlayerNumber>("Player");
        Core.logger(`Setting up for ${playerNumber}`);

        switch (playerNumber) {
            case PlayerNumber.Player1:
                this.setupPlayerOne();
                break;
            case PlayerNumber.Player2:
                this.setupPlayerTwo();
                break;
            case PlayerNumber.Player3:
                this.setupPlayerThree();
                break;
            case PlayerNumber.Player4:
                this.setupPlayerFour();
                break;
            default:
                Core.logger("Invalid player number selected. Please choose Player1, Player2, Player3, or Player4.");
                break;
        }

        // Common preparations for all players
        this.otherPrep();
    }

    private setupPlayerOne(): void {
        Core.logger("Setting up Player 1 (Tank/Support)");

        // Legion Revenant
        Core.logger("Getting Legion Revenant...");
        LR.getLR(true);

        // ArchPaladin
        Core.logger("Getting ArchPaladin...");
        AP.getAP(true);

        // StoneCrusher
        Core.logger("Getting StoneCrusher...");
        SC.getSC(true);

        // ChaosAvenger (Ultra requirement)
        if (!Core.checkInventory("Chaos Avenger")) {
            Core.logger(
                "Note: Chaos Avenger must be obtained manually as it requires ultras, and Skua does not support this",
            );
        } else {
            Core.logger("Chaos Avenger found!");
        }
    }

    private setupPlayerTwo(): void {
        Core.logger("Setting up Player 2 (DPS/Chrono)");

        // Quantum Chronomancer
        if (!Core.checkInventory("Quantum Chronomancer")) {
            Core.logger(
                "Note: Quantum Chronomancer must be bought for 6k ACs in /heromart or use Arachnomancer instead",
            );
        } else {
            Core.logger("Quantum Chronomancer found!");
        }

        // Legion Revenant
        Core.logger("Getting Legion Revenant...");
        LR.getLR(true);

        // ChaosAvenger
        if (!Core.checkInventory("Chaos Avenger")) {
            Core.logger(
                "Note: Chaos Avenger must be obtained manually as it requires ultras, and Skua does not support this",
            );
        } else {
            Core.logger("Chaos Avenger found!");
        }

        // StoneCrusher
        Core.logger("Getting StoneCrusher...");
        SC.getSC(true);
    }

    private setupPlayerThree(): void {
        Core.logger("Setting up Player 3 (Support)");

        // Lord of Order
        Core.logger("Getting Lord of Order...");
        LOO.getLoO(true);

        // Legion Revenant
        Core.logger("Getting Legion Revenant...");
        LR.getLR(true);
    }

    private setupPlayerFour(): void {
        Core.logger("Setting up Player 4 (DPS/Support)");

        // ArchPaladin
        Core.logger("Getting ArchPaladin...");
        AP.getAP(true);

        // LightCaster
        if (!Core.checkInventory("LightCaster")) {
            Core.logger("Note: LightCaster requires 1000 ACs to purchase. Pre-farming materials...");
        } else {
            Core.logger("LightCaster found!");
        }

        // Verus DoomKnight
        if (!Core.checkInventory("Verus DoomKnight")) {
            Core.logger("Getting Verus DoomKnight...");
            VDK.getClass();
        } else {
            Core.logger("Verus DoomKnight found!");
        }
    }

    otherPrep(): void {
        Core.logger("Performing general preparations for all players...");

        // Level and gold requirements
        Farm.experience();
        Farm.gold();
        Farm.bladeofAweREP();

        // Check and unlock required enhancements
        this.checkAndUnlockEnhancements();

        // Buy potions and scrolls
        Core.logger("Getting potions and scrolls...");
        needYourStrongestPotions({
            potions: ["Potent Malevolence Elixir"],
            quant: 10,
            buyReagents: true,
            separate: true,
        });
        Scroll.buyScroll(Scrolls.Enrage, 1000);

        if (!Core.checkInventory("Scroll of Life Steal", 99)) {
            Adv.buyItem(
                "terminatemple",
                2328,
                "Scroll of Life Steal",
                99 - bot.inventory.getQuantity("Scroll of Life Steal"),
            );
        }

        // Story completion
        Core.logger("Completing *ALL* storylines...");
        allStories.completeAll();

        // Endgame weapon - Necrotic Sword of Doom (51% damage to all monsters)
        if (!Core.checkInventory("Necrotic Sword of Doom")) {
            Core.logger("Starting Necrotic Sword of Doom farm (51% damage to all monsters)");
            NSOD.getNSOD();

            if (Core.checkInventory("Necrotic Sword of Doom")) {
                Core.logger("Successfully obtained Necrotic Sword of Doom!");
            } else {
                Core.logger("NSOD farm incomplete - consider continuing manually or using a dedicated script");
            }
        } else {
            Core.logger("Necrotic Sword of Doom already obtained!");
        }
    }

    /** Check and unlock enhancements required for the player's role */
    private checkAndUnlockEnhancements(): void {
        // Player-specific enhancements
        const enhancementsByPlayer = new Map([
            [
                "Player1",
                [
                    "ArcanasConcerto",
                    "Ravenous",
                    "Lacerate",
                    "Dauntless",
                    "Vainglory",
                    "Avarice",
                    "Absolution",
                    "Lament",
                    "ForgeHelm",
                ],
            ],
            ["Player2", ["Valiance", "ArcanasConcerto", "Dauntless", "Lament", "Vainglory", "Penitence", "Absolution"]],
            ["Player3", ["Health Vamp/AweBlast", "Dauntless", "Penitence", "Avarice", "Absolution", "ForgeHelm"]],
            [
                "Player4",
                ["Ravenous", "Elysium", "ArcanasConcerto", "Dauntless", "Valiance", "Penitence", "Lament", "ForgeHelm"],
            ],
        ]);

        // Enhancement to Quest ID mapping
        const enhancementToQuestID = new Map([
            ["Health Vamp/AweBlast", 2937],
            ["ForgeWeapon", 8738],
            ["Lacerate", 8739],
            ["Valiance", 8741],
            ["ArcanasConcerto", 8742],
            ["Absolution", 8743],
            ["Vainglory", 8744],
            ["Avarice", 8745],
            ["Elysium", 8821],
            ["Penitence", 8822],
            ["Lament", 8823],
            ["ForgeHelm", 8828],
            ["Dauntless", 9172],
            ["Ravenous", 9560],
        ]);

        // Enhancement to unlock method mapping
        const enhancementActions = new Map([
            ["Health Vamp/AweBlast", () => Farm.bladeofAweREP()],
            ["Lacerate", () => unlockForgeEnhancements.lacerate()],
            ["Valiance", () => unlockForgeEnhancements.herosValiance()],
            ["ArcanasConcerto", () => unlockForgeEnhancements.arcanasConcerto()],
            ["Absolution", () => unlockForgeEnhancements.absolution()],
            ["Vainglory", () => unlockForgeEnhancements.vainglory()],
            ["Avarice", () => unlockForgeEnhancements.avarice()],
            ["Elysium", () => unlockForgeEnhancements.elysium()],
            ["Penitence", () => unlockForgeEnhancements.penitence()],
            ["Lament", () => unlockForgeEnhancements.lament()],
            ["ForgeHelm", () => unlockForgeEnhancements.forgeHelmEnhancement()],
            ["Dauntless", () => unlockForgeEnhancements.dauntLess()],
            ["Ravenous", () => unlockForgeEnhancements.ravenous()],
        ]);

        // Get current player
        const playerNumber = bot.config!.get<PlayerNumber>("Player");
        const playerKey = String(playerNumber) ?? "Player1";

        Core.logger(`Checking enhancements for ${playerKey}:`);

        // Get player-specific enhancements
        const playerEnhancements = enhancementsByPlayer.get(playerKey)!;
        const missingEnhancements: string[] = [];

        // Check status and collect missing enhancements
        for (const enhancement of playerEnhancements) {
            const questID = enhancementToQuestID.get(enhancement);
            if (questID !== undefined) {
                const isCompleted = Core.isCompletedBefore(questID);
                const completionStatus = isCompleted ? "✅" : "❌";
                Core.logger(`${enhancement} - ${completionStatus}`);

                if (!isCompleted) {
                    missingEnhancements.push(enhancement);
                }
            } else {
                Core.logger(`Enhancement ${enhancement} not found in reference list`);
            }
        }

        // Unlock missing enhancements
        if (missingEnhancements.length > 0) {
            Core.logger("Unlocking missing enhancements...");
            for (const enhancement of missingEnhancements) {
                const action = enhancementActions.get(enhancement);
                if (action !== undefined) {
                    Core.logger(`Unlocking: ${enhancement}`);
                    action();
                } else {
                    Core.logger(`Unhandled enhancement: ${enhancement}`);
                }
            }
        } else {
            Core.logger("No missing enhancements for your player role!");
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "JoePrepsForUltras",
    [
        option.bool(
            "GetClasses",
            "Get Classes",
            "Enable to Skip aquiring classes for each player -- and still do the rest of the prep ( faster for those that already own the classes)",
            false,
        ),
        option.choice(
            "Player",
            "Player Number",
            'Which Player number are you in Insert\'s "ALL ULTRAS" bot (for grim) setup?\n' +
                "Player1: Tank/Support (Legion Revenant, ArchPaladin, StoneCrusher, Chaos Avenger)\n" +
                "Player2: DPS/Chrono (Quantum Chronomancer, Legion Revenant, Chaos Avenger, StoneCrusher)\n" +
                "Player3: Support (Lord of Order, Legion Revenant)\n" +
                "Player4: DPS/Support (ArchPaladin, LightCaster, Verus DoomKnight)",
            choices(PlayerNumber),
            PlayerNumber.Player1,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new JoePrepsForUltras();
    Core.setOptions();
    Core.logger(
        "THIS SCRIPT IS MADE TO PREP FOR InsertNameHere ULTRAS!!! \nA.K.A FOR Grimoire ULTRAS!!!\n \n THIS IS NOT MADE FOR Skua ULTRAS!!! \n \nthis script is also old af, it was made before Skua could do ultras lol",
        undefined,
        { messageBox: true },
    );

    script.playerSetup();

    Core.setOptions(false);
}
