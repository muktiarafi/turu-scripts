/*
name: UnundeadGoat
description: This script will do the `Extended Vacation` Quest to acess the `UnundeadGoat`, get the class and rank it.
tags: UnundeadGoat, goatfield, class, rank, farm, seasonal, aprilfools
*/
// Port of Scripts/Seasonal/AprilFools/UnundeadGoat.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { DragonOfTime } from "../../other/classes/DragonOfTime";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const DoT = new DragonOfTime();

export class UnundeadGoat {
    getthestuff(rankUpClass = true): void {
        if (Core.checkInventory("UnUnundead Goat")) {
            if (rankUpClass) {
                Adv.rankUpClass("Unundead Goat");
            }
            return;
        }

        if (!Core.isSeasonalMapActive("goatfield")) {
            return;
        }

        if (!Core.isCompletedBefore(10139)) {
            Core.addDrop(92935);
            Core.ensureAccept(10139);

            if (!bot.house.items.concat(...bot.bank.items).some((i) => i.id === 1286)) {
                Core.buyItem("buyhouse", 71, 1286, 1, 1401);
            }

            if (!Core.checkInventory(17585)) {
                Farm.bladeofAweREP(1, true);
            }

            if (!Core.checkInventory(56723)) {
                Core.farmingLogger("Dragon of Time Armor");
                DoT.getDoT(false, false, true);
            }

            if (!Core.checkInventory("Gold Voucher 500k", 2)) {
                Farm.voucher("Gold Voucher 500k", 2);
            }

            Core.equipClass(ClassType.Farm);
            Core.killMonster("j6cruise", "Frame1", "Left", "Chaos Goat", "Goat Bone", 189, { isTemp: false });
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("warundead", "Lich King", "Necronomnomicon", undefined, { isTemp: false });

            Core.ensureComplete(10139);
            bot.wait.forPickup(92935);
        }

        Core.join("goatfield");

        // Load shop data
        let retry = 0;
        while (!bot.shouldExit && bot.shops.id !== 2569) {
            bot.shops.load(2569);
            bot.wait.forActionCooldown("loadShop");
            bot.wait.forTrue(() => bot.shops.isLoaded && bot.shops.id === 2569, 20);
            Core.sleep(1000);
            if (bot.shops.id === 2569 || retry === 20) {
                break;
            } else {
                retry++;
            }
        }
        retry = 0;

        for (const x of [...bot.shops.items]) {
            if (Core.checkInventory(x.name, 1, { toInv: false })) {
                continue;
            }

            Core.buyItem("goatfield", 2569, x.id, 1, x.shopItemId);
            if (x.name !== "Unundead Goat") {
                Core.toBank(x.id);
            }
        }

        if (rankUpClass) {
            Adv.rankUpClass("Unundead Goat");
        }
    }
}

export default function main(): void {
    const script = new UnundeadGoat();
    Core.setOptions();

    script.getthestuff();

    Core.setOptions(false);
}
