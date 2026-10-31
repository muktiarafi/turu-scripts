/*
name: Love Spell Story
description: This will complete the Love Spell story.
tags: story, quest, hero, heart, love, spell, seasonal
*/
// Port of Scripts/Seasonal/HerosHeartDay/LoveSpellStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class LoveSpell {
    loveSpellScript(): void {
        if (!Core.isSeasonalMapActive("lovespell")) {
            return;
        }
        if (Core.isCompletedBefore(7934)) {
            return;
        }

        Story.preLoad(this.loveSpellScript);

        // Something Soft
        Story.killQuest(7925, "lovespell", "Chinchilla");

        // A Shrubbery!
        Story.killQuest(7926, "lovespell", "Love Shrub");

        // The Eyes Have It
        Story.killQuest(7927, "lovespell", "Spring Tog");

        // Pollenate Love
        Story.killQuest(7928, "lovespell", "Love Shrub");

        // Whiskers on... Chinchillas?
        Story.killQuest(7929, "lovespell", "Chinchilla");

        // Smooth Mood
        Story.killQuest(7930, "lovespell", "Mood Slime");

        // Scale it up
        Story.killQuest(7931, "lovespell", "Spring Tog");

        // Fruitful
        Story.killQuest(7932, "lovespell", "Love Shrub");

        // Very... heart-y
        Story.killQuest(7933, "lovespell", "Mood Slime");

        // Break that Heart
        Story.killQuest(7934, "lovespell", "Stolen Heart");
    }
}

export default function main(): void {
    const script = new LoveSpell();
    Core.setOptions();

    script.loveSpellScript();

    Core.setOptions(false);
}
