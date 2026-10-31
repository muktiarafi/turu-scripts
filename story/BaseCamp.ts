/*
name: Base Camp Storyline
description: This will complete the storyline in /basecamp.
tags: story, quest, base camp,basecamp,puff
*/
// Port of Scripts/Story/BaseCamp.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class BaseCamp {
    storyLine(): void {
        if (Core.isCompletedBefore(10273)) {
            return;
        }

        Story.preLoad(this.storyLine);

        // 10270 | One Brick at a Time
        if (!Story.questProgression(10270)) {
            Core.huntMonsterQuest(
                10270,
                ["cornelis", "Gargoyle", ClassType.Farm],
                ["cornelis", "Stone Golem", ClassType.Solo],
                ["faerie", "Cyclops Warlord", ClassType.Solo],
            );
        }

        // 10271 | Room with a View
        if (!Story.questProgression(10271)) {
            Core.huntMonsterQuest(
                10271,
                ["dwarfhold", "Gemrald", ClassType.Farm],
                ["crashsite", "Mithril Man", ClassType.Farm],
                ["crashsite", "ProtoSartorium", ClassType.Farm],
                ["digitalmaintown", "8-Bit Lionfang", ClassType.Farm],
            );
        }

        // 10272 | Transportalation
        if (!Story.questProgression(10272)) {
            Core.ensureAccept(10272);
            Core.huntMonster("orctown", "General Porkon", "Burlap Sack");
            Core.huntMonster("ubear", "Honey Glob", "Lifetime Subscription to Ubear");
            Core.huntMonster("chaoslab", "Chaorrupted Moglin", "Chauffeur Moglin");
            Story.buyQuest(10272, "arcangrove", 211, "Potion of Sleeping", 15);
        }

        // 10273 | Your First Portal
        if (!Story.questProgression(10273)) {
            Core.huntMonsterQuest(
                10273,
                ["swordhavenbridge", "Slime", ClassType.Farm],
                ["farm", "Scarecrow", ClassType.Farm],
                ["boxes", "Sneeviltron", ClassType.Farm],
            );
        }
    }
}

export default function main(): void {
    const script = new BaseCamp();
    Core.setOptions();
    script.storyLine();
    Core.setOptions(false);
}
