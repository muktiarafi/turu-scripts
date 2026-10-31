/*
name: AssistingOblivionBlade
description: null
tags: null
*/
// Port of Scripts/Nation/Various/AssistingOblivionBlade.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreNation } from "../CoreNation";

const Farm = new CoreFarms();
const Nation = new CoreNation();

export class AssistingOblivionBlade {
    doit(): void {
        if (!Core.isMember) {
            return;
        }

        if (!Core.checkInventory("The Secret 2")) {
            return;
        }

        if (!Core.checkInventory("Tendurrr The Assistant")) {
            Core.killMonster("tercessuinotlim", "m2", "Left", "*", "Tendurrr The Assistant", undefined, {
                isTemp: false,
            });
        }

        const RewardOptions = Core.ensureLoad(5818).rewards;
        const RewardsList: string[] = [];
        for (const Item of RewardOptions) {
            RewardsList.push(Item.name);
        }
        const Rewards = [...RewardsList];
        Core.addDrop(...Rewards);

        Core.registerQuests(5818);
        for (const item of RewardOptions) {
            while (!bot.shouldExit && !Core.checkInventory(item.id, item.maxStack)) {
                Farm.theSecret4();
                Nation.essenceofNulgath(20);
                Nation.approvalAndFavor(50, 50);
                Core.killMonster("boxes", "Fort2", "Left", "*", "Cubes", 50, { isTemp: false });
                Core.killMonster("shadowblast", "r13", "Left", "*", "Fiend Seal", 10, { isTemp: false });
                Farm.battleUnderB(undefined, 200);
                Core.sleep();
            }
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new AssistingOblivionBlade();
    Core.setOptions();

    script.doit();

    Core.setOptions(false);
}
