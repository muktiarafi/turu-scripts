/*
name: null
description: null
tags: null
*/
// Port of Scripts/Legion/Revenant/CoreLR.cs.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreLegion } from "../CoreLegion";
import { SeraphicWar_Story } from "../../story/legion/SeraphicWar";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const Legion = new CoreLegion();
const Seraph = new SeraphicWar_Story();

export class CoreLR {
    lr: string[] = ["Exalted Crown", "Revenant's Spellscroll", "Conquest Wreath", "Legion Revenant"];
    lf1: string[] = ["Aeacus Empowered", "Tethered Soul", "Darkened Essence", "Dracolich Contract"];
    lf2: string[] = [
        "Grim Cohort Conquered",
        "Ancient Cohort Conquered",
        "Pirate Cohort Conquered",
        "Battleon Cohort Conquered",
        "Mirror Cohort Conquered",
        "Darkblood Cohort Conquered",
        "Vampire Cohort Conquered",
        "Spirit Cohort Conquered",
        "Dragon Cohort Conquered",
        "Doomwood Cohort Conquered",
    ];
    lf3: string[] = [
        "Hooded Legion Cowl",
        "Legion Token",
        "Dage's Favor",
        "Emblem of Dage",
        "Diamond Token of Dage",
        "Dark Token",
    ];

    getLR(rankUpClass: boolean): void {
        // Tests for IODA LR since it does not provide the badge and currently has the same ID as normal LR
        if (Core.checkInventory("Legion Revenant") && Core.badges.some((badge) => badge.name === "Legion Revenant")) {
            if (rankUpClass) {
                Adv.rankUpClass("Legion Revenant");
            }
            return;
        }

        Legion.joinLegion();

        Core.addDrop("Legion Token");
        Core.addDrop(...Legion.legionMedals);
        Core.addDrop(...this.lr);
        Core.addDrop(...this.lf1);
        Core.addDrop(...this.lf2);
        Core.addDrop(...this.lf3);

        this.revenantSpellscroll(1, true);
        this.revenantSpellscroll();
        this.conquestWreath(1, true);
        this.conquestWreath();
        this.exaltedCrown(1, true);
        this.exaltedCrown();

        //if you used insignias other quests arent unlocked(yes people have done this...)
        if (!Core.isCompletedBefore(6900)) {
            this.exaltedCrown(1);
        }

        Core.chainComplete(6900);
        bot.wait.forDrop("Legion Revenant", 20);
        bot.wait.forPickup("Legion Revenant", 20);
        if (rankUpClass) {
            Adv.rankUpClass("Legion Revenant");
        }
    }

    //Legion Fealty 1
    revenantSpellscroll(quant = 20, forquest = false): void {
        if (
            (forquest && Core.isCompletedBefore(6897)) ||
            (!forquest && Core.checkInventory("Revenant's Spellscroll", quant))
        ) {
            return;
        }

        Legion.joinLegion();

        Core.addDrop("Legion Token");
        Core.addDrop(...this.lr);
        Core.addDrop(...this.lf1);

        Farm.evilREP();

        let i = 1;
        Core.farmingLogger("Revenant's Spellscroll", quant);
        bot.quests.updateQuest(2060);
        while (
            !bot.shouldExit &&
            ((forquest && !Core.isCompletedBefore(6897)) ||
                (!forquest && !Core.checkInventory("Revenant's Spellscroll", quant)))
        ) {
            Core.ensureAccept(6897);

            Core.equipClass(ClassType.Solo);
            Core.killMonster("judgement", "r10a", "Left", "Ultra Aeacus", "Aeacus Empowered", 50, {
                isTemp: false,
                publicRoom: Core.publicDifficult,
            });

            Core.equipClass(ClassType.Farm);
            Core.killMonster("revenant", "r2", "Left", "*", "Tethered Soul", 300, { isTemp: false });
            Core.killMonster("shadowrealmpast", "Enter", "Spawn", "*", "Darkened Essence", 500, { isTemp: false });
            Core.killMonster("necrodungeon", "r22", "Down", "*", "Dracolich Contract", 1000, { isTemp: false });

            Core.ensureComplete(6897);
            bot.wait.forPickup("Revenant's Spellscroll");
            Core.logger(`Completed x${i++}`);

            if (forquest) {
                return;
            }
        }
    }

    //Legion Fealty 2
    conquestWreath(quant = 6, forquest = false): void {
        if (
            (forquest && Core.isCompletedBefore(6898)) ||
            (!forquest && Core.checkInventory("Conquest Wreath", quant))
        ) {
            return;
        }

        if (!Core.isCompletedBefore(6898)) {
            this.revenantSpellscroll(1, true);
        }

        Legion.joinLegion();

        Core.addDrop("Legion Token");
        Core.addDrop(...this.lr);
        Core.addDrop(...this.lf2);

        let i = 1;
        Core.equipClass(ClassType.Farm);
        Core.farmingLogger("Conquest Wreath", quant);
        bot.quests.updateQuest(4614);
        while (
            !bot.shouldExit &&
            ((forquest && !Core.isCompletedBefore(6898)) || !Core.checkInventory("Conquest Wreath", quant))
        ) {
            Core.ensureAccept(6898);
            Core.killMonster("mummies", "Enter", "Spawn", "*", "Ancient Cohort Conquered", 400, { isTemp: false });
            Core.killMonster("doomvault", "r1", "Right", "*", "Grim Cohort Conquered", 400, { isTemp: false });

            Core.killMonster("wrath", "r5", "Left", "*", "Pirate Cohort Conquered", 400, { isTemp: false });
            Core.killMonster("doomwar", "r6", "Left", "*", "Battleon Cohort Conquered", 400, { isTemp: false });
            Core.killMonster("overworld", "Enter", "Spawn", "*", "Mirror Cohort Conquered", 400, { isTemp: false });
            Core.killMonster("deathpits", "r1", "Left", "*", "Darkblood Cohort Conquered", 400, { isTemp: false });
            Core.killMonster("maxius", "r2", "Left", "*", "Vampire Cohort Conquered", 400, { isTemp: false });
            Core.killMonster("curseshore", "Enter", "Spawn", "*", "Spirit Cohort Conquered", 400, { isTemp: false });

            Core.killMonster("dragonbone", "Enter", "Spawn", "*", "Dragon Cohort Conquered", 400, { isTemp: false });
            Core.killMonster("doomwood", "r6", "Right", "*", "Doomwood Cohort Conquered", 400, { isTemp: false });

            Core.ensureComplete(6898);
            bot.wait.forPickup("Conquest Wreath");
            Core.logger(`Completed x${i++}`);

            if (forquest) {
                return;
            }
        }
    }

    //Legion Fealty 3
    exaltedCrown(quant = 10, forquest = false): void {
        if ((forquest && Core.isCompletedBefore(6899)) || (!forquest && Core.checkInventory("Exalted Crown", quant))) {
            return;
        }

        if (!Core.isCompletedBefore(6899)) {
            this.conquestWreath(1, true);
        }

        Legion.joinLegion();
        Seraph.seraphicWar_Questline();

        Core.addDrop("Legion Token");
        Core.addDrop(...this.lr);
        Core.addDrop(...this.lf3);

        let i = 1;
        Core.farmingLogger("Exalted Crown", quant);
        while (
            !bot.shouldExit &&
            ((forquest && !Core.isCompletedBefore(6899)) || !Core.checkInventory("Exalted Crown", quant))
        ) {
            Core.ensureAccept(6899);

            Adv.buyItem("underworld", 216, "Hooded Legion Cowl");

            Legion.farmLegionToken(4000);

            Legion.approvalAndFavor(0, 300);

            Legion.emblemofDage(1);

            Legion.diamondTokenofDage(30);

            Legion.darkToken(100);

            Core.ensureComplete(6899);
            bot.wait.forPickup("Exalted Crown");
            Core.logger(`Completed x${i++}`);

            if (forquest) {
                return;
            }
        }
    }
}
