/*
name: Dark Witchy and Cursted Jester
description: This will complete the Dark Witchy and Cursted Jester story.
tags: story, quest, seasonal, mogloween, dark, witchy, cursed, jester
*/
// Port of Scripts/Seasonal/Mogloween/Dark&WitchySetAndCursedJesterSet.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class DarkWitchyAndCurstedJester {
    getAll(): void {
        // List<string> RewardsList = new List<string>();
        const RewardOptions = [...Core.ensureLoad(8375).rewards];
        // RewardsList.AddRange(Core.EnsureLoad(8375).Rewards.Select(x => x.Name).ToArray());
        bot.drops.add(...Core.ensureLoad(8375).rewards.map((x) => x.id));

        coreMogloween.necroCarnival();

        for (const item of RewardOptions) {
            // if (item.Name.Contains($"&"))
            //     item.Name.Replace($"&", "and");
            // if (item.Name.Contains($"&amp;"))
            //     item.Name.Replace($"&amp;", "and");

            if (!Core.checkInventory(item.id, undefined, { toInv: false })) {
                Core.farmingLogger(`${item.name}`, 1);

                //Scare Uniforms 8375
                Core.ensureAccept(8375);

                Core.equipClass(ClassType.Farm);
                Core.huntMonster("necrocarnival", "Mooch Treeant", "Cherry Lemonade", 10, { log: false });
                Core.huntMonster("necrocarnival", "Gummy Tapeworm", "Crunchy Fried Clusters", 5, { log: false });
                Core.equipClass(ClassType.Solo);
                Core.huntMonster("necrocarnival", "Deva", "Felt Patch", undefined, { log: false });

                Core.ensureComplete(8375, item.id);
                bot.wait.forPickup(item.id);
            } else {
                Core.logger(`${item.name} Found`);
            }
            Core.toBank(item.name);
        }
    }
}

export default function main(): void {
    const script = new DarkWitchyAndCurstedJester();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}
