/*
name: Crash Site story
description: This will finish the Crash Site story.
tags: story, quest, crash-site
*/
// Port of Scripts/Story/CrashSite.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class CrashSite {
    storyLine(): void {
        const QuestLogic = (): void => {
            switch (Story.legacyQuestId) {
                case 4787:
                    //Mug Me Some Dwakels 4787
                    Core.huntMonster("crashsite", "Dwakel Warrior", "Pneumatic Relay");
                    Core.huntMonster("crashsite", "Flamethrower Dwakel", "Sonic Transducer");
                    Core.huntMonster("crashsite", "Dwakel Blaster", "Solenoid Helix");
                    break;
                case 4788:
                    //Mug me One More 4788
                    Core.huntMonster("crashsite", "Mithril Man", "Cosmic Dongle");
                    break;
                case 4789:
                    //Hot Spot 4789
                    Core.getMapItem(4192, 10, "crashsite");
                    break;
                case 4790:
                    //Wibbly Wobbly 4790
                    Core.huntMonster("crashruins", "Spacetime Anomaly", "Anomalies Destroyed", 12);
                    break;
                case 4791:
                    //Indiana Bones 4791
                    Core.huntMonster("crashruins", "Unlucky Explorer", "Rusty Key", 7);
                    break;
                case 4792:
                    //Timey Wimey 4792
                    Core.huntMonster("crashruins", "Spacetime Anomaly", "Space-time Energy", 10);
                    break;
                case 4793:
                    //These Flares Are The Bomb 4793
                    Core.getMapItem(4191, 5, "crashruins");
                    Core.huntMonster("crashruins", "Unlucky Explorer", "Pyrotechnic Flares", 3);
                    Core.huntMonster("crashruins", "Unlucky Explorer", "Matchbook");
                    Core.huntMonster("crashruins", "Dwakel Soldier", "Metal Shrapnel", 10);
                    break;
                case 4794:
                    //Find My Rod! 4794
                    Core.huntMonster("crashruins", "Chest", "Useless Junk", 12);
                    break;
                case 4795:
                    //My Precious 4795
                    Core.getMapItem(4190, 6, "crashruins");
                    break;
                case 4796:
                    //Fried Chicken 4796
                    Core.huntMonster("crashruins", "Cluckmoo Idol", "Cluckmoo Idol Defeated");
                    break;
            }
        };
        if (Core.checkInventory("LastQuestDrop")) {
            return;
        }

        //Add questIDs of the tokenQuests on their right ordre
        Story.legacyQuestManager(QuestLogic, 4787, 4788, 4789, 4790, 4791, 4792, 4793, 4794, 4795, 4796);
    }
}

export default function main(): void {
    const script = new CrashSite();
    Core.bankingBlackList.push(
        "DwaToken I",
        "DwaToken II",
        "DwaToken III",
        "DwaToken IV",
        "DwaToken V",
        "DwaToken VI",
        "DwaToken VII",
        "DwaToken VIII",
        "DwaToken IX",
        "DwaToken X",
    );
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
