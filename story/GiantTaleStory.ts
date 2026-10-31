/*
name: Giant Tale Story
description: This will finish the Giant Tale Story.
tags: story, quest, giant-tale
*/
// Port of Scripts/Story/GiantTaleStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class GiantTaleStory {
    doAll(): void {
        Story.preLoad(this.doAll);
        this.giantQuests();
        this.smuurvilQuests();
        this.tableAndAndreQuests();
    }

    giantQuests(): void {
        if (Core.isCompletedBefore(720)) {
            return;
        }

        //Property Appraiser 717
        Core.equipClass(ClassType.Farm);
        Story.mapItemQuest(717, "giant", 119);

        //Pain in the Grass 718
        Story.killQuest(718, "giant", "Red Ant");

        //Dust Busting 719
        Story.killQuest(719, "giant", "Dust Bunny");

        //Cat-astrophe 720
        Core.equipClass(ClassType.Solo);
        Story.killQuest(720, "giant", "Giant Cat");
    }

    smuurvilQuests(): void {
        if (Core.isCompletedBefore(725)) {
            return;
        }

        //Skynner's List 721
        Core.equipClass(ClassType.Farm);
        Story.killQuest(721, "smuurvil", "Smuurvil");

        //A Mushy Situation 722
        Story.mapItemQuest(722, "smuurvil", 122, 12);

        //W-Tea F 723
        Story.killQuest(723, "smuurvil", "Smuurvil");

        //A Skunkweed By Any Other Name... 724
        Story.killQuest(724, "smuurvil", "Smuurvilette");

        //There Is No Spoon 725
        Core.equipClass(ClassType.Solo);
        Story.killQuest(725, "smuurvil", "Papa Smuurvil");
    }

    tableAndAndreQuests(): void {
        if (Core.isCompletedBefore(749)) {
            return;
        }

        //Spare Parts 737
        Story.mapItemQuest(737, "table", [123, 124, 125, 126, 127, 128]);

        //Race 743
        Story.chainQuest(743);

        //Andre's Foot Defeated 747
        Story.killQuest(747, "andre", "Giant Foot");

        //Flea be Gone 748
        Story.killQuest(748, "andre", "Giant Flea");

        //Free the Key 749
        Story.killQuest(749, "andre", "Giant Necklace");
    }
}

export default function main(): void {
    const script = new GiantTaleStory();
    Core.setOptions();
    script.doAll();
    Core.setOptions(false);
}
