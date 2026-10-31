/*
name: Weapon Mastery (AC)
description: This bot does the Weapon Mastery (AC) quest of the "Evolved Warlord Orb", until both the hammer and axe are obtained.
tags: evolved, warlord, orb, hammer, axe, nation, nulgath, underfiend
*/
// Port of Scripts/Nation/Various/WeaponMastery(AC).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreNation } from "../CoreNation";
import { Core13LoC } from "../../story/lordsofchaos/Core13LoC";

const Nation = new CoreNation();
const Farm = new CoreFarms();
const LoC = new Core13LoC();

export class WeaponMasteryAC {
    getWM(): void {
        if (Core.checkInventory(["Evolved Warlord Hammer", "Evolved Warlord Axe"])) {
            Core.logger(`Weapon Mastery archieved!`);
            return;
        }

        if (!Core.checkInventory([33366, 33199], undefined, { any: true })) {
            Core.logger(`Evolved Warlord Orb not found!`);
            return;
        }

        LoC.xiang();
        Core.addDrop(...Nation.bagDrops);
        Core.addDrop("Evolved Warlord Axe", "Evolved Warlord Hammer");

        Core.farmingLogger("Evolved Warlord Hammer", 1);
        Core.farmingLogger("Evolved Warlord Axe", 1);

        // 4786 - Members
        // 4784 - Ac
        while (!bot.shouldExit && !Core.checkInventory(["Evolved Warlord Hammer", "Evolved Warlord Axe"])) {
            Core.ensureAccept(Core.checkInventory(33366, undefined, { toInv: false }) ? 4786 : 4784);
            Nation.farmUni13(1);
            Nation.farmTaintedGem(10);
            Nation.farmDarkCrystalShard(10);
            Nation.farmTotemofNulgath(1);
            Nation.farmGemofNulgath(10);

            if (!Core.checkInventory("Underfriend Blade of Nulgath")) {
                Core.equipClass(ClassType.Solo);
                Core.huntMonsterMapID("mirrorportal", 1, "Mirror Realm Token", 10, { isTemp: false });

                Farm.gold(100000);
                Core.buyItem("mirrorportal", 618, "Underfriend Blade of Nulgath");
            }
            Core.ensureComplete(Core.checkInventory(33366, undefined, { toInv: false }) ? 4786 : 4784);
            bot.wait.forPickup("Evolved Warlord Hammer");
            bot.wait.forPickup("Evolved Warlord Axe");
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new WeaponMasteryAC();
    Core.bankingBlackList.push(...Nation.bagDrops);
    Core.setOptions();

    script.getWM();

    Core.setOptions(false);
}
