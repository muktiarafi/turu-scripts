/*
name: Fausto's and Lengjin's Quests
description: Storyline for the map: "Parades"
tags: seasonal, yokai, akibacny, akiba new year, story, fausto, lengjin
*/
// Port of Scripts/Seasonal/AkibaNewYear/Parades.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class Parades {
    storyline(): void {
        const QuestLogic = (): void => {
            switch (Story.legacyQuestId) {
                //#region  Fausto
                case 4830:
                    //Two Parades! 4830
                    if (!Core.checkInventory("Cool Lemonade")) {
                        Core.ensureAccept(4830);
                        Core.getMapItem(4226, 1, "parades");
                        Core.ensureComplete(4830);
                        bot.wait.forPickup("Cool Lemonade");
                    }
                    break;
                // Un-decorate Yokai 4831
                case 4831:
                    Core.huntMonster("parades", "Paper Lantern", "Paper Lantern Destroyed", 6, { log: false });
                    Core.getMapItem(4232, 5, "parades");
                    break;
                // Naughty Fairies 4832
                case 4832:
                    Core.huntMonster("parades", "Xingzhi", "Xingzhi Slain", 8, { log: false });
                    break;
                // Dancers Love “Flours” 4833
                case 4833:
                    Core.getMapItem(4227, 1, "parades");
                    Core.getMapItem(4228, 6, "parades");
                    break;
                //Spooky Ghosties 4834
                case 4834:
                    Core.huntMonster("parades", "Shushen", "Shushen Slain", 10, { log: false });
                    break;
                // Plan B 4835
                case 4835:
                    Core.huntMonster("parades", "Raven", "Raven Feathers", 5, { log: false });
                    Core.huntMonster("parades", "Lingzhi", "Lingzhi Spores", 5, { log: false });
                    break;
                // A Gift For Lengjing 4836
                case 4836:
                    Core.getMapItem(4233, 1, "parades");
                    bot.wait.forPickup("Sleepytime Necklace");
                    break;
                //#endregion Fausto
                //#region  Lengjing
                // I'm Not That Stupid 4837
                case 4837:
                    Core.getMapItem(4229, 8, "parades");
                    Core.huntMonster("parades", "Carnaval Mask", "Carnaval Mask Destroyed", 6, { log: false });
                    break;
                // Why Did It Have To Be Snakes 4838
                case 4838:
                    Core.huntMonster("parades", "Boiuna", "Boiuna Slain", 10, { log: false });
                    break;
                // Flash! Bang! 4839
                case 4839:
                    Core.getMapItem(4230, 8, "parades");
                    break;
                // I Don't Retaliate, I Escalate 4840
                case 4840:
                    Core.huntMonster("parades", "Shushen", "Spectral Essence", 8, { log: false });
                    Core.huntMonster("parades", "Raven", "Raven's Blood", 4, { log: false });
                    break;
                // One Last Thing 4841
                case 4841:
                    Core.huntMonster("hachiko", "Ninja Nopperabo", "Scroll of Summoning", undefined, { log: false });
                    break;
                // Defeat the Oni 4842
                case 4842:
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("parades", "Oni", "Oni Defeated", undefined, { log: false });
                    break;
                //#endregion  Lengjing
            }
        };
        if (Core.checkInventory("Parades Token XI") || !Core.isSeasonalMapActive("parades")) {
            return;
        }

        Core.equipClass(ClassType.Farm);

        Story.legacyQuestManager(
            QuestLogic,
            4830,
            4831,
            4832,
            4833,
            4834,
            4835,
            4836,
            4837,
            4838,
            4839,
            4840,
            4841,
            4842,
        );
    }
}

export default function main(): void {
    const script = new Parades();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
