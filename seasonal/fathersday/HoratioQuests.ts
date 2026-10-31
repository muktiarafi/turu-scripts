/*
name: HoratioQuests.cs
description: This Script Will Finish All Quests in /nursery
tags: hotario, quests, clatter, tidy, snackies
*/
// Port of Scripts/Seasonal/FathersDay/HoratioQuests.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class HoratioQuests {
    horatio(): void {
        if (Core.isCompletedBefore(6947)) {
            return;
        }

        Story.preLoad(this.horatio);

        //Hear the Clatter (6936)
        Story.killQuest(6936, "nursery", "Skeletal Minion");

        //Tidy Up (6937)
        Story.mapItemQuest(6937, "nursery", [6466, 6467], 2);
        Story.mapItemQuest(6937, "nursery", [6468, 6469], 4);

        //Snackies (6938)
        Story.killQuest(6938, "nursery", "Pablum");

        //Find the Progeny (6939)
        Story.mapItemQuest(6939, "nursery", 6470);

        //Houston, We Have A Pablum (6940)
        Story.killQuest(6940, "nursery", "Pablongous");

        //Rattle the Bones (6941)
        Story.killQuest(6941, "nursery", "Rattlebones");

        //Boost Time (6942)
        Story.killQuest(6942, "nursery", "Skeletal Minion");

        //Conduction Function (6943)
        if (!Story.questProgression(6943)) {
            Core.ensureAccept(6943);
            Core.getMapItem(6471, 6, "nursery");
            Core.huntMonster("nursery", "Skeletal Minion", "Nice Long Femur", 6);
            Core.ensureComplete(6943);
        }

        //Gross (6944)
        Story.killQuest(6944, "nursery", "Flesh Golem");

        //Time to Clean (6945)
        if (!Story.questProgression(6945)) {
            Core.ensureAccept(6945);
            Core.getMapItems(
                [
                    [6473, 1],
                    [6474, 1],
                ],
                "nursery",
            );
            Core.huntMonster("nursery", "Spilled Ink", "Spilled Ink", 2);
            Core.ensureComplete(6945);
        }

        //Find the Progeny (Again) (6946)
        Story.mapItemQuest(6946, "nursery", 6472);

        //Gleeble the Garble! (6947)
        Story.killQuest(6947, "nursery", "GleebleGlarble");
    }
}

export default function main(): void {
    const script = new HoratioQuests();
    Core.setOptions();

    script.horatio();
    Core.setOptions(false);
}
