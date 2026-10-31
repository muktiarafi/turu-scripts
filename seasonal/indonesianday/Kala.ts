/*
name: Kala Story
description: This will finish the Kala storyline.
tags: kala-story, kala, seasonal
*/
// Port of Scripts/Seasonal/IndonesianDay/Kala.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { RangdaSeasonal } from "./Rangda";

const Story = new CoreStory();
const Ran = new RangdaSeasonal();

export class KalaSeasonal {
    storyLine(): void {
        if (!Core.isSeasonalMapActive("kala")) {
            return;
        }

        Ran.storyLine();

        if (Core.isCompletedBefore(8214)) {
            Core.logger("StoryLine Complete: Kala");
            return;
        }

        Story.preLoad(this.storyLine);

        // 8205 Thirst Quencher
        Story.killQuest(8205, "kala", "Coconut Treeant");

        // 8206 Gain the Rice Grains
        Story.killQuest(8206, "kala", "Jelangkung");

        // 8207 Finger Lickin' Good
        Story.killQuest(8207, "kala", "Cemani Dricken");

        // 8208 Pulverized Puppets
        if (!Story.questProgression(8208)) {
            Core.ensureAccept(8208);
            Core.huntMonster("kala", "Jelangkung", "Spare Cloth", 4);
            Core.huntMonster("kala", "Coconut Treeant", "Sticks", 3);
            Core.huntMonster("kala", "Coconut Treeant", "Coconut Shell", 3);
            Core.huntMonster("kala", "Cemani Dricken", "Sacred Feet", 4);
            Core.ensureComplete(8208);
        }

        // 8209 Keris-tal Clear
        if (!Story.questProgression(8209)) {
            Core.join("rangda");
            bot.quests.updateQuest(7622);
            Core.sleep(2000);
            Core.ensureAccept(8209);
            Core.killMonster("rangda", "r4", "Left", "Rangda", "Sacred Keris");
            Core.ensureComplete(8209);
        }

        // 8210 Ceremonial Reflection
        Story.killQuest(8210, "kala", "Jelangkung");

        // 8211 An Honorable Offering
        Story.mapItemQuest(8211, "kala", 8765);

        // 8213 Fangs of Fearlessness
        Story.killQuest(8213, "rangda", "Leyak");

        // 8214 Kala-mity time
        Story.killQuest(8214, "kala", "Kala");
    }
}

export default function main(): void {
    const script = new KalaSeasonal();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
