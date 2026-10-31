/*
name: Lich Class
description: Gets the Lich Class and its pre-requisites.
tags: Lich, class, pre-requisites, necronomicon, nictos, klaatu, verata, necromicon, shadow lich, frozen lair, legion
*/
// Port of Scripts/Other/Classes/Lich.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { Grimgaol } from "../../prototypes/Grimgaol";
import { ColossalWaresMerge } from "../../seasonal/friday13th/mergeshops/ColossalWaresMerge";

const Adv = new CoreAdvanced();
const Farm = new CoreFarms();
const colossalWaresMerge = new ColossalWaresMerge();
const GRunOptions = new Grimgaol();

export class Lich {
    // Create a void for each necropnomicon:
    klaatuNecropnomicon(): void {
        if (Core.checkInventory("Klaatu's Necronomicon")) {
            return;
        }

        Core.ensureAccept(10338);
        Core.equipClass(ClassType.Farm);
        Farm.battleUnderB(undefined, 6666);
        Farm.evilREP();
        Adv.buyItem("Shadowfall", 89, "Shadow Lich");
        Core.equipClass(ClassType.Solo);
        Core.huntMonster("DarkoviaForest", "Lich of the Stone", "Lich Of The Stone", undefined, { isTemp: false });
        Core.equipClass(ClassType.Dodge);
        Core.huntMonster("frozenlair", "Legion Lich Lord", "Sapphire Orb", 113, { isTemp: false });
        Core.getMapItem(14740, 1, "necroproject");
        Core.ensureComplete(10338);
        bot.wait.forPickup("Klaatu's Necronomicon");
    }

    nictosNecropnomicon(): void {
        if (Core.checkInventory("Nicto's Necronomicon")) {
            return;
        }

        colossalWaresMerge.buyAllMerge("Nicto's Necronomicon");
        bot.wait.forPickup("Nicto's Necronomicon");
    }

    veratasNecropnomicon(): void {
        if (Core.checkInventory("Verata's Necromicon")) {
            return;
        }

        if (Farm.factionRank("Grimskull Trolling") < 10) {
            Core.logger("You need to have rank 10 Grimskull Trolling Rep to buy Verata's Necromicon.");
            GRunOptions.doGrimGaol();
        }
        Core.buyItem("gaolcell", 2362, "Verata's Necromicon", undefined, 60505);
        bot.wait.forPickup("Verata's Necromicon");
    }

    lichClass(rankup = true): void {
        // Lich class
        if (Core.checkInventory(94824)) {
            if (rankup && Core.checkClassRank({ currentClass: false, className: "Lich" }) < 10) {
                Core.logger("You have the Lich Class, but not at max rank. Rank up to 10.");
                Adv.gearStore(undefined, { enhAfter: true });
                Adv.smartEnhance("Lich");
                Farm.experience(undefined, true);
                Adv.gearStore(true, { enhAfter: true });
            }
            return;
        }

        // Ensure you have the required necropnomicons
        this.klaatuNecropnomicon();
        this.nictosNecropnomicon();
        this.veratasNecropnomicon();

        // Complete the quest to get the Lich Class
        {
            if (Core.checkInventory(94824)) {
                /* Lich class item ID */
                return;
            }
            /* Lich class item ID */
            Core.addDrop(94824);
            Core.chainComplete(10339);
            bot.wait.forPickup(94824);

            if (rankup && Core.checkClassRank({ currentClass: false, className: "Lich" }) < 10) {
                Core.logger("Ranking up Lich Class.");
                Adv.gearStore(undefined, { enhAfter: true });
                Adv.smartEnhance("Lich");
                Farm.experience(undefined, true);
                Adv.gearStore(true, { enhAfter: true });
            }
        }
    }
}

export const scriptOptions = defineScriptOptions(GRunOptions.optionsStorage, GRunOptions.options, true);

export default function main(): void {
    const script = new Lich();
    Core.setOptions(undefined, { disableClassSwap: true });

    script.lichClass();

    Core.setOptions(false);
}
