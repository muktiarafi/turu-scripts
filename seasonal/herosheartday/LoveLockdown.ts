/*
name: Love Lockdown
description: This will complete the Love Lockdown story quest.
tags: love-lockdown, seasonal, hero, heart, story
*/
// Port of Scripts/Seasonal/HerosHeartDay/LoveLockdown.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class LoveLockdown {
    storyLine(): void {
        const QuestLogic = (): void => {
            switch (Story.legacyQuestId) {
                case 4814:
                    // A Fishy Frenzy 4814
                    Core.huntMonster("lovelockdown", "Sweeter Fish", "Sweeter Fish Swished", 6);
                    break;
                case 4815:
                    // Love You To DEATH 4815
                    Core.huntMonster("lovelockdown", "O-Dokurose", "O-DokuROSE Defeated");
                    break;
                case 4816:
                    // Potion Commotion 4816
                    Core.getMapItem(4217, 7, "lovelockdown");
                    break;
                case 4817:
                    // The Melancholy of Alina 4817
                    Core.huntMonster("lovelockdown", "Alchemist’s Sorrow", "Alchemist's Sorrow Slain");
                    break;
                case 4818:
                    // The Escapist 4818
                    Core.getMapItem(4218, undefined, "lovelockdown");
                    Core.getMapItem(4219, undefined, "lovelockdown");
                    break;
                case 4819:
                    // A Wary Library 4819
                    Core.huntMonster("lovelockdown", "Book Swarm", "Book Swarm Defeated", 7);
                    break;
                case 4820:
                    // The More You Glow 4820
                    Core.getMapItem(4220, 6, "lovelockdown");
                    break;
                case 4821:
                    // Socktacular Slayhem 4821
                    Core.huntMonster("lovelockdown", "Sock Wraith", "Sock Wraith Slain", 6);
                    break;
                case 4822:
                    // Socktimus Prime 4822
                    Core.huntMonster("lovelockdown", "Left Socktopus", "Left Socktopus Socked");
                    break;
                case 4823:
                    // Primordial Fear 4823
                    Core.huntMonster("lovelockdown", "Thanotops", "Thanatops Obliterated");
                    break;
                case 4824:
                    // Bunnihilation 4824
                    Core.getMapItem(4221, 6, "lovelockdown");
                    break;
                case 4825:
                    // Bunnihilation, Vol. II 4825
                    Core.huntMonster("lovelockdown", "Ultra Cuddles", "Ultra Cuddles Defeated");
                    break;
                case 4826:
                    // Unrequited Love 4826
                    Core.huntMonster("lovelockdown", "The Unrequited", "Unrequited Love Defeated");
                    break;
            }
        };
        if (Core.checkInventory("Final Heart Token")) {
            return;
        }

        if (!Core.isSeasonalMapActive("lovelockdown")) {
            return;
        }

        Story.legacyQuestManager(
            QuestLogic,
            4814,
            4815,
            4816,
            4817,
            4818,
            4819,
            4820,
            4821,
            4822,
            4823,
            4824,
            4825,
            4826,
        );
        // Or use Core.FromTo(0001, 0009)
    }
}

export default function main(): void {
    const script = new LoveLockdown();
    Core.bankingBlackList.push(
        "Heart Token I",
        "Heart Token II",
        "Heart Token III",
        "Heart Token IV",
        "Heart Token V",
        "Heart Token VI",
        "Heart Token VII",
        "Heart Token VIII",
        "Heart Token IX",
        "Heart Token X",
        "Heart Token XI",
        "Heart Token XII",
        "Final Heart Token",
    );
    Core.setOptions();

    script.storyLine();
    Core.setOptions(false);
}
