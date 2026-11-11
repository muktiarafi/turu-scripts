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
            Core.ensureAccept(10270);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("cornelis", "Gargoyle", "Portal Bricks", 25);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("cornelis", "Stone Golem", "Support Pillars", 4);
            Core.huntMonster("faerie", "Cyclops Warlord", "Magelight", 4);
            Core.ensureComplete(10270);
        }

        // 10271 | Room with a View
        if (!Story.questProgression(10271)) {
            Core.ensureAccept(10271);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("dwarfhold", "Gemrald", "Magic Rocks", 8);
            Core.huntMonster("crashsite", "Mithril Man", "Power Cable");
            Core.huntMonster("crashsite", "ProtoSartorium", "75-inch Ultra-thin 144hz 1ms LED Display");
            Core.huntMonster("digitalmaintown", "8-bit Lionfang", "1080x1920 JPEG of Battleon");
            Core.ensureComplete(10271);
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
            Core.ensureAccept(10273);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("swordhavenbridge", "Slime", "Nontoxic Children's Glue");
            Core.huntMonster("farm", "Scarecrow", "Unused Popsicle Sticks", 10);
            Core.huntMonster("boxes", "Sneeviltron", "Clear Tape");
            Core.ensureComplete(10273);
        }
    }
}

export default function main(): void {
    const script = new BaseCamp();
    Core.setOptions();
    script.storyLine();
    Core.setOptions(false);
}
