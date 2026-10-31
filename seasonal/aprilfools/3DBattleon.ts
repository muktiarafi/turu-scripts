/*
name: 3D Battleon Storyline
description: This script will complete Cysero's quests in aqw3d.
tags: april fools, seasonal, 3d battleon, aqw3d, cysero, story
*/
// Port of Scripts/Seasonal/AprilFools/3DBattleon.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class Battleon3D {
    storyLine(): void {
        const QuestLogic = (): void => {
            switch (Story.legacyQuestId) {
                case 4943:
                    // Scan the Perimeter! 4943
                    Core.getMapItem(4321, 1, "aqw3d");
                    Core.getMapItem(4322, 1, "aqw3d");
                    Core.getMapItem(4323, 1, "aqw3d");
                    Core.getMapItem(4324, 1, "aqw3d");
                    break;
                case 4944:
                    // Clackity Clackity 4944
                    Core.huntMonster("aqw3d", "Slime", "Smack All the Monsters", 5);
                    Core.huntMonster("aqw3d", "Clawg", "Especially the Clawgs", 5);
                    break;
                case 4945:
                    // Calibrations 4945
                    Core.huntMonster("aqw3d", "3D Flying Eye", "Sp-Eye Sample", 2);
                    Core.huntMonster("aqw3d", "Clawg", "Clawg Sample", 2);
                    Core.huntMonster("aqw3d", "Slime", "Slime Sample", 2);
                    Core.huntMonster("aqw3d", "Frogzard", "Frogzard Sample", 2);
                    break;
                case 4946:
                    // Sp-Eye Power 4946
                    Core.huntMonster("aqw3d", "3D Flying Eye", "Sp-Eye Beams", 6);
                    break;
                case 4947:
                    // It's All ADDING Up 4947
                    Core.huntMonster("aqw3d", "Horc Warrior", "Armor Plating", 4);
                    Core.huntMonster("aqw3d", "Slime", "Nuts &amp; Bolts", 6);
                    break;
                case 4948:
                    // Clawg Claws 4948
                    Core.huntMonster("aqw3d", "Clawg", "Clawg Claws", 8);
                    break;
                case 4949:
                    // A Good Case Of Con Rot 4949
                    Core.huntMonster("artistalley", "Con Rot", "Infected With Con Rot", 6);
                    break;
                case 4951:
                    // Trolluk! 4951
                    Core.huntMonster("aqw3d", "Trolluk", "ADDING Machine");
                    break;
            }
        };
        if (Core.checkInventory("Fools Token VIII") || !Core.isSeasonalMapActive("aqw3d")) {
            return;
        }

        Story.legacyQuestManager(QuestLogic, 4943, 4944, 4945, 4946, 4947, 4948, 4949, 4951);
    }
}

export default function main(): void {
    const script = new Battleon3D();
    Core.bankingBlackList.push(
        "Fools Token I",
        "Fools Token II",
        "Fools Token III",
        "Fools Token IV",
        "Fools Token V",
        "Fools Token VI",
        "Fools Token VII",
        "Fools Token VIII",
    );
    Core.setOptions();

    script.storyLine();
    Core.setOptions(false);
}
