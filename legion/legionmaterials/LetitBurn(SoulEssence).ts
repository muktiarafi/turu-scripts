/*
name: LetitBurn(SoulEssence)
description: null
tags: null
*/
// Port of Scripts/Legion/LegionMaterials/LetitBurn(SoulEssence).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { AnotherOneBitesTheDust } from "./SoulSand";
import { LegionBonfire } from "../various/LegionBonfire";

const Farm = new CoreFarms();
const SSand = new AnotherOneBitesTheDust();
const Bon = new LegionBonfire();

export class LetItBurn {
    private readonly rewards: string[] = [
        "Legion Undead Spawn",
        "Legion Undead Visor",
        "Legion Forge Banisher",
        "Legion Spawn Bonker",
    ];

    soulEssence(quant = 50, ChooseItem = 0): void {
        if (Core.checkInventory("Soul Essence", quant)) {
            return;
        }

        if (ChooseItem > 0 && Core.checkInventory(ChooseItem)) {
            return;
        }

        Core.addDrop("Soul Essence");
        if (ChooseItem > 0) {
            Core.addDrop(ChooseItem);
        } else {
            Core.addDrop(...this.rewards);
        }
        Core.farmingLogger("Soul Essence", quant);

        Farm.experience(65);
        Bon.getLegionBonfire();

        Core.equipClass(ClassType.Solo);

        while (
            !bot.shouldExit &&
            !Core.checkInventory("Soul Essence", quant) &&
            (ChooseItem <= 0 || !Core.checkInventory(ChooseItem))
        ) {
            Core.ensureAccept(7992);
            Core.huntMonster("dagefortress", "Grrrberus", "Grrberus' Flame");
            SSand.soulSand(3);

            if (ChooseItem > 0) {
                if (!this.rewards.every((x) => Core.checkInventory(x, undefined, { toInv: false }))) {
                    Core.ensureCompleteChoose(
                        7992,
                        this.rewards.filter((x) => !Core.checkInventory(x)),
                    );
                } else {
                    Core.ensureComplete(7992);
                }
            } else {
                Core.ensureComplete(7992);
            }

            bot.wait.forPickup("Soul Essence");
        }
    }
}

export default function main(): void {
    const script = new LetItBurn();
    Core.setOptions();

    script.soulEssence();

    Core.setOptions(false);
}
