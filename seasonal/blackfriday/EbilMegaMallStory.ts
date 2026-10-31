/*
name: Ebil Mega Mall Story
description: This will complete the Ebil Mega Mall story.
tags: story, quest, ebil mega mall, black friday, seasonal, yes ma'am, yes maam,ebilmegamall
*/
// Port of Scripts/Seasonal/BlackFriday/EbilMegaMallStory.cs.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class EbilMegaMall {
    storyLine(): void {
        if (Core.isCompletedBefore(10508) || !Core.isSeasonalMapActive("ebilmegamall")) {
            return;
        }

        Story.preLoad(this.storyLine);

        //#region Useable Monsters
        const UseableMonsters = [
            "Vending Machine", // UseableMonsters[0],
            "Mogugu", // UseableMonsters[1],
            "Deal Hunter", // UseableMonsters[2],
            "Scalper", // UseableMonsters[3],
            "Customer Support", // UseableMonsters[4],
            "Mogugudra", // UseableMonsters[5],
            "Black BOGOdrone Prime", // UseableMonsters[6]
        ];
        //#endregion Useable Monsters
        // 10500 | Vendebils
        if (!Story.questProgression(10500)) {
            Core.huntMonsterQuest(10500, ["ebilmegamall", UseableMonsters[0], ClassType.Farm]);
        }

        // 10501 | Bad Batch
        if (!Story.questProgression(10501)) {
            Core.huntMonsterQuest(10501, ["ebilmegamall", UseableMonsters[1], ClassType.Farm]);
        }

        // 10502 | Deal Camper
        if (!Story.questProgression(10502)) {
            Core.huntMonsterQuest(10502, ["ebilmegamall", UseableMonsters[2], ClassType.Farm]);
        }

        // 10503 | Questing Quencher
        if (!Story.questProgression(10503)) {
            Story.mapItemQuest(10503, "ebilmegamall", 15186, 6);
        }

        // 10504 | Free PR
        if (!Story.questProgression(10504)) {
            Core.huntMonsterQuest(
                10504,
                ["ebilmegamall", UseableMonsters[1], ClassType.Farm],
                ["ebilmegamall", UseableMonsters[2], ClassType.Farm],
            );
        }

        // 10505 | Artificial Demand
        if (!Story.questProgression(10505)) {
            Core.huntMonsterQuest(10505, ["ebilmegamall", UseableMonsters[3], ClassType.Farm]);
        }

        // 10506 | Instant Euphoria
        if (!Story.questProgression(10506)) {
            Core.ensureAccept(10506);
            Core.killMonster("ebilmegamall", "r6", "Left", "*", Core.questRequirements(10506)[0]);
            Core.ensureComplete(10506);
        }

        // 10507 | Please Hold
        if (!Story.questProgression(10507)) {
            Core.huntMonsterQuest(10507, ["ebilmegamall", UseableMonsters[4], ClassType.Farm]);
        }

        // 10508 | De-unioned
        if (!Story.questProgression(10508)) {
            Core.huntMonsterQuest(10508, ["ebilmegamall", UseableMonsters[5], ClassType.Solo]);
        }
    }
}

export default function main(): void {
    const script = new EbilMegaMall();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
