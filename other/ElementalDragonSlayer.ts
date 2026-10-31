/*
name: Elemental Dragon Slayer set
description: farms the "Elemental Dragon Slayer" set from Quest: "Mysterious Chest".
tags: elemental dragon slayer, set
*/
// Port of Scripts/Other/ElementalDragonSlayer.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../core/CoreBots";
import { Core7DD } from "../story/7deadlydragons/Core7DD";

const DD = new Core7DD();

export class ElementalDragonSlayer {
    getAll(): void {
        const Rewards = Core.ensureLoad(6171).rewards.map((x) => x.name);
        if (Rewards.includes("Mysterious Egg")) Rewards.splice(Rewards.indexOf("Mysterious Egg"), 1);
        const SetItems = [...Rewards];

        bot.drops.add(...SetItems);

        if (Core.checkInventory(SetItems, undefined, { toInv: false })) {
            return;
        }

        for (let i = 0; i < SetItems.length; i++) {
            if (!Core.checkInventory(SetItems[i], undefined, { toInv: false })) {
                Core.logger(`Farming "${SetItems[i]}"`);

                //Mysterious Chest 6171
                Core.ensureAccept(6171);

                Core.killMonster("pride", "r13", "Left", "Valsarian", "Key of Pride", undefined, { isTemp: false });
                Core.killMonster("gluttony", "Enter2", "Top", "Deflated Glutus", "Key of Gluttony", undefined, {
                    isTemp: false,
                });
                Core.killMonster("greed", "r16", "Left", "Goregold", "Key of Greed", undefined, { isTemp: false });

                if (!Core.checkInventory("Key of Sloth")) {
                    DD.hazMatSuit();
                    Core.huntMonster("sloth", "Phlegnn", "Key of Sloth", undefined, { isTemp: false });
                }

                Core.huntMonster("lust", "Lascivia", "Key of Lust", undefined, { isTemp: false });
                bot.quests.updateQuest(6000);
                Core.huntMonster("maloth", "Maloth", "Key of Envy", undefined, { isTemp: false });
                Core.huntMonster("wrath", "Gorgorath", "Key of Wrath", undefined, { isTemp: false });

                Core.ensureCompleteChoose(6171, [SetItems[i]]);
                bot.wait.forPickup(SetItems[i]);
            }
        }
    }
}

export default function main(): void {
    const script = new ElementalDragonSlayer();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}
