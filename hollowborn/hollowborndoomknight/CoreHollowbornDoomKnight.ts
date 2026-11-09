/*
name: null
description: null
tags: null
*/
// Port of Scripts/Hollowborn/HollowbornDoomKnight/CoreHollowbornDoomKnight.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, option } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreNSOD } from "../../evil/nsod/CoreNSOD";
import { CoreSDKA } from "../../evil/sdka/CoreSDKA";
import { SepulchuresOriginalHelm } from "../../evil/SepulchuresOriginalHelm";
import { CoreHollowborn } from "../CoreHollowborn";
import { CoreHollowbornPaladin } from "../hollowbornpaladin/CoreHollowbornPaladin";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const HB = new CoreHollowborn();
const HBP = new CoreHollowbornPaladin();
const SDKA = new CoreSDKA();
const NSoD = new CoreNSOD();
const SOH = new SepulchuresOriginalHelm();

export class CoreHollowbornDoomKnight {
    adkItems: string[] = [
        "Hollowborn Doom Visage",
        "Hollowborn DoomKnight Helm",
        "Hollowborn DoomKnight Hood",
        "Hollowborn Doom Cloak",
        "Hollowborn Doom Cape",
    ];

    adkRisesItems: string[] = ["Doom Fragment", "Classic Hollowborn DoomKnight"];
    adkFallsItems: string[] = ["Hollowborn Empress' Blade", "Hollowborn DoomBlade"];

    adkReturnsItems: string[] = [
        "Hollowborn DoomKnight",
        "Hollowborn Sepulchure's Helm",
        "Hollowborn Doom Shade",
        "Hollowborn Sword of Doom",
    ];

    // Turu: the C# reads the PreFarm option here, which scripts importing this file for one
    // story part don't declare; the scripts calling getAll pass it instead.
    getAll(preFarm = false): void {
        if (
            Core.checkInventory(this.adkItems, undefined, { toInv: false }) &&
            Core.checkInventory("Classic Hollowborn DoomKnight", undefined, { toInv: false }) &&
            Core.checkInventory(this.adkFallsItems, undefined, { toInv: false }) &&
            Core.checkInventory(this.adkReturnsItems, undefined, { toInv: false })
        ) {
            return;
        }

        if (preFarm) {
            this.adk(130);
            this.adkRises();
        }
        this.adkFalls();
        this.adkReturns();
    }

    adk(quant = 300): void {
        if (Core.checkInventory("Dark Fragment", quant)) {
            return;
        }

        Core.addDrop(...this.adkItems);
        Core.addDrop("Dark Fragment");

        // Requirements
        HB.hardcoreContract();
        Farm.evilREP();

        // Quest
        while (!bot.shouldExit && !Core.checkInventory("Dark Fragment", quant)) {
            Core.ensureAccept(8413);

            Core.equipClass(ClassType.Farm);
            Core.killMonster("shadowrealmpast", "Enter", "Spawn", "*", "Empowered Essence", 10, { isTemp: false });
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("shadowrealmpast", "Shadow Lord", "Shadowworn", 1, { isTemp: false });
            Farm.gold(100000);
            Adv.buyItem("shadowfall", 89, "Shadowscythe Venom Head");
            Core.huntMonster("shadowrealm", "Hollowborn Sentinel", "Hollow Soul", 10, { isTemp: false });
            Core.logger("Bought Shadowscythe Venom Head");
            if (Core.checkInventory(this.adkItems)) {
                Core.ensureComplete(8413);
            } else {
                Core.ensureCompleteChoose(8413, this.adkItems);
            }
        }
        Core.toBank(...this.adkItems);
    }

    adkRises(quant = 15): void {
        if (Core.checkInventory("Doom Fragment", quant)) {
            return;
        }

        Core.addDrop(...this.adkRisesItems);

        // Requirements
        HB.hardcoreContract();

        // Quest
        while (!bot.shouldExit && !Core.checkInventory("Doom Fragment", quant)) {
            Core.ensureAccept(8414);

            this.adk(5);
            Adv.buyItem("tercessuinotlim", 1951, "Doomatter", 10);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("shadowrealmpast", "Shadow Lord", "Shadow DoomReaver", 1, { isTemp: false });
            Core.huntMonster("lumafortress", "Corrupted Luma", "Worshipper of Doom", 1, { isTemp: false });
            bot.quests.updateQuest(3008);
            if (Core.isMember) {
                Core.huntMonster("ultravoid", "Ultra Kathool", "Ingredients?", 10, { isTemp: false, log: false });
            } else {
                Core.killMonster("doomvault", "r5", "Left", "Binky", "Ingredients?", 10, { isTemp: false, log: false });
            }

            Core.ensureComplete(8414);
        }
    }

    adkFalls(RGRoW = false): void {
        if (Core.checkInventory(this.adkFallsItems)) {
            return;
        }

        Core.addDrop(...this.adkFallsItems);
        if (RGRoW) {
            Core.addDrop("Hollowborn DoomBlade", "Hollowborn Empress' Blade");
        }

        // Requirements
        HB.hardcoreContract();
        Core.ensureAccept(8415);

        // Quest
        this.adkRises(5);
        this.adk(20);
        if (!Core.checkInventory("Unidentified 25")) {
            Farm.gold(15000100);
            Core.buyItem("tercessuinotlim", 1951, "Unmoulded Fiend Essence");
            Core.buyItem("tercessuinotlim", 1951, "Unidentified 25");
        }
        if (!Core.checkInventory("Royal ShadowScythe Blade")) {
            Farm.gold(1000000);
            Farm.evilREP(10);
            Core.buyItem("shadowfall", 1639, "Royal ShadowScythe Blade");
        }

        Core.equipClass(ClassType.Solo);
        Core.huntMonster("epicvordred", "Ultra Vordred", "(Necro) Scroll of Dark Arts", 1, {
            isTemp: false,
            publicRoom: true,
        });
        bot.quests.updateQuest(3008);
        Core.setAchievement(18);
        bot.quests.updateQuest(3004);
        Core.equipClass(ClassType.Solo);
        Core.killMonster("doomvaultb", "r26", "Left", "Undead Raxgore", "Weapon Imprint", 1, { isTemp: false });

        Core.ensureComplete(8415);
    }

    adkReturns(): void {
        if (Core.checkInventory(this.adkReturnsItems)) {
            return;
        }

        Core.addDrop(...this.adkReturnsItems);

        Core.ensureAccept(8416);

        const cantcomplete = !Core.isCompletedBefore(2090) && !bot.player.isMember;
        if (cantcomplete) {
            Core.logger(
                'Completion of the quest "Dark Spirit Donation" is required for the "Dark Energy" to drop, which is members only, we cannot complete this.',
            );
            return;
        }

        // Requirements
        SDKA.doAll();
        SOH.doAll();
        NSoD.getNSOD();
        HB.hardcoreContract();
        HBP.hbShadowOfFate();
        Farm.experience();

        // Quest
        this.adkRises(10);
        this.adk(30);
        Core.equipClass(ClassType.Farm);
        NSoD.bonesVoidRealm(1);
        Core.killMonster("dwarfhold", "r2", "Left", "Chaos Drow", "Dark Energy", 10000, { isTemp: false });

        Core.equipClass(ClassType.Solo);
        Core.huntMonster("epicvordred", "Ultra Vordred", "(Necro) Scroll of Dark Arts", 3, {
            isTemp: false,
            publicRoom: true,
        });
        Core.huntMonster("sepulchurebattle", "ULTRA Sepulchure", "Doom Heart", 1, { isTemp: false });
        bot.quests.updateQuest(3008);
        Core.setAchievement(18);
        bot.quests.updateQuest(3004);
        Core.killMonster("doomvaultb", "r26", "Left", "Undead Raxgore", "Weapon Imprint", 12, { isTemp: false });
        Core.huntMonster("Desolich", "Desolich", "Desolich's Dark Horn", 3, { isTemp: false, publicRoom: true });
        Core.ensureComplete(8416);
    }

    optionsStorage = "HollowbornDoomKnightOptions";
    dontPreconfigure = true;
    options = [
        option.bool("PreFarm", "Pre Farm Dark-/Doom Fragments", "Recommended setting: False", false),
        Core.skipOptions,
    ];
}
