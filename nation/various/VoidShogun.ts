/*
name: VoidShogun
description: null
tags: null
*/
// Port of Scripts/Nation/Various/VoidShogun.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreNation } from "../CoreNation";

const Farm = new CoreFarms();
const Nation = new CoreNation();

export class VoidShogun {
    readonly rewards: string[] = [
        "Void Shogun",
        "Void Shogun Mask",
        "Void Shogun Helm",
        "Void Shogun Masked Helm",
        "Void Shogun Banner",
        "Void Shogun Runes",
        "Void Shogun Katana",
        "Void Shogun Naginata",
        "Mini Void Shogun",
        "Mini Void Shogun Battlepet",
        "Void Shogun Katanas on your Hip",
        "Dual Void Shogun Katanas",
    ];

    getShogun(): void {
        Core.addDrop(...Nation.bagDrops);
        Core.addDrop(...this.rewards);

        Core.addDrop("Void Voucher", "Dai Tengu Blade of Wind", "Orochi's Shadow");

        if (!Core.checkInventory("Void Monk of Nulgath")) {
            Core.equipClass(ClassType.Farm);
            Core.killMonster("quibblehunt", "r2", "Left", "*", "Void Voucher", 500, { isTemp: false });
            Core.jumpWait();
            Core.buyItem("quibblehunt", 1421, "Void Monk of Nulgath");
        }

        Farm.yokaiREP();
        Nation.farmVoucher({ member: false });

        for (const item of Core.ensureLoad(6484)
            .rewards.filter((x) => x != null && this.rewards.includes(x.name))
            .map((x) => x)) {
            if (Core.checkInventory(item.id)) {
                Core.logger(`Already have ${item}`);
                continue;
            }

            while (!bot.shouldExit && !Core.checkInventory(item.id, undefined, { toInv: false })) {
                if (Core.checkInventory(item.id)) {
                    Core.logger(`Already have ${item}`);
                    continue;
                }
                Core.ensureAccept(6484);

                Nation.farmUni13(1);
                Nation.farmBloodGem(7);
                Nation.theAssistant("Unidentified 24");

                Core.equipClass(ClassType.Solo);
                Core.huntMonster("hachiko", "Dai Tengu", "Dai Tengu Blade of Wind", undefined, { isTemp: false });
                Core.huntMonster("shogunwar", "Orochi", "Orochi's Shadow", undefined, { isTemp: false });
                Core.huntMonster("necrocavern", "Shadowstone Support", "ShadowStone Rune");

                Core.ensureComplete(6484, item.id);
                bot.wait.forPickup(item.id);
            }
        }
    }
}

export default function main(): void {
    const script = new VoidShogun();
    Core.bankingBlackList.push(...Nation.bagDrops);
    Core.bankingBlackList.push(...script.rewards);
    Core.setOptions();

    script.getShogun();

    Core.setOptions(false);
}
