/*
name: Atlas Falls Story
description: This will finish Misaru's questline in /atlasfalls.
tags: story, quest, legion,dage,atlas,atlasfalls,atlas-atlasfalls,general slaine,slaine,atlasfalls
*/
// Port of Scripts/Story/Legion/AtlasFalls.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { AtlasKingdom } from "./AtlasKingdom";

const Story = new CoreStory();
const atlasKingdom = new AtlasKingdom();

export class AtlasFalls {
    storyline(): void {
        if (Core.isCompletedBefore(10135)) {
            return;
        }

        atlasKingdom.storyline();

        Story.preLoad(this.storyline);

        //#region Useable Monsters
        const UseableMonsters = [
            "Atlas Knight", // UseableMonsters[0],
            "Atlas Light Magus", // UseableMonsters[1],
            "Atlas Light Mage", // UseableMonsters[2],
            "Ladon", // UseableMonsters[3],
            "Atlas Leo", // UseableMonsters[4],
            "Atlas Elite", // UseableMonsters[5],
            "Atlas Executioner", // UseableMonsters[6],
            "Sundered Soul", // UseableMonsters[7],
            "Princess Arethusa", // UseableMonsters[8],
            "King Zedek", // UseableMonsters[9]
        ];
        //#endregion Useable Monsters
        Core.equipClass(ClassType.Solo);

        // 10127 | Between Two Worlds
        if (!Story.questProgression(10127)) {
            Story.mapItemQuest(10127, "atlasfalls", [14283, 14284]);
        }

        // 10128 | Exodus of Dust
        if (!Story.questProgression(10128)) {
            Core.ensureAccept(10128);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("atlasfalls", "Atlas Knight", "Knight's Skull", 9);
            Core.huntMonster("atlasfalls", "Atlas Light Mage", "Mage's Skull", 9);
            Core.ensureComplete(10128);
        }

        // 10129 | Impeccable Judgement
        if (!Story.questProgression(10129)) {
            Core.ensureAccept(10129);
            Core.huntMonster("atlasfalls", UseableMonsters[3], "Ladon's Shreds", undefined, { publicRoom: true });
            Story.mapItemQuest(10129, "atlasfalls", 14285, 4);
        }

        // 10130 | Koinà Tà Phílon
        if (!Story.questProgression(10130)) {
            Story.mapItemQuest(10130, "atlasfalls", [14286, 14287]);
            bot.wait.forCellChange("r5");
        }

        // 10131 | What Walks Ought to Crawl
        if (!Story.questProgression(10131)) {
            Core.ensureAccept(10131);
            Core.huntMonster("atlasfalls", UseableMonsters[4], "Leo Heart", 8, { publicRoom: true });
            Story.mapItemQuest(10131, "atlasfalls", 14288, 4);
        }

        // 10132 | Vene Vidi Vici
        if (!Story.questProgression(10132)) {
            Core.equipClass(ClassType.Farm);
            Core.ensureAccept(10132);
            Core.killMonster("atlasfalls", "r7", "Right", UseableMonsters[5], "Elite's Skull", 8, { publicRoom: true });
            Story.mapItemQuest(10132, "atlasfalls", 14289);
        }

        // 10133 | Exocannibalism
        if (!Story.questProgression(10133)) {
            Core.huntMonsterQuest(10133, ["atlasfalls", UseableMonsters[6], ClassType.Farm]);
        }

        // 10134 | Condemnatio Purgatorio
        if (!Story.questProgression(10134)) {
            Core.equipClass(ClassType.Farm);
            Core.ensureAccept(10134);
            Core.huntMonster("atlasfalls", UseableMonsters[7], "Soul Condemned", 21, { publicRoom: true });
            Story.mapItemQuest(10134, "atlasfalls", 14290, 4);
        }

        // 10135 | Miserum Votum
        if (!Story.questProgression(10135)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(10135);
            Core.huntMonster("atlasfalls", UseableMonsters[8], "Arethusa's Crown", undefined, { publicRoom: true });
            Story.mapItemQuest(10135, "atlasfalls", 14291);
        }

        // ----- dude isnt soloable. ----- yes he is
        // 10136 | Dante to Beatrice
        if (!Story.questProgression(10136)) {
            if (Core.checkInventory("Chaos Avenger")) {
                Core.useBossClass();
                Story.killQuest(10136, "atlasfalls", UseableMonsters[9]);
            } else {
                Core.logger('You need to have "Chaos Avenger" to kill "King Zedek".');
            }
        }
    }
}

export default function main(): void {
    const script = new AtlasFalls();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
