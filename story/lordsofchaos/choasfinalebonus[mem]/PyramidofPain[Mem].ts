/*
name: (Chaos Finale Bonus) Pyramid of Pain
description: This will finish the Pyramid of Pain quest.
tags: story, quest, chaos-saga, 13-lords-of-chaos, chaos-finale, bonus, pyramid-of-pain, member
*/
// Port of Scripts/Story/LordsofChaos/ChoasFinaleBonus[Mem]/PyramidofPain[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreStory } from "../../../core/CoreStory";

const Story = new CoreStory();

export class PyramidofPain {
    pyramidofPain_Line(): void {
        if (Core.isCompletedBefore(3659)) {
            return;
        }

        if (!Core.isMember) {
            Core.logger("You need to be a member for complete this questline.");
            return;
        }

        Story.preLoad(this.pyramidofPain_Line);

        // Prove Your Worth
        Story.killQuest(3640, "pyramidpain", ["Cactus Creeper ", "Golden Scarab "]);
        // Still Not Impressed?
        Story.killQuest(3641, "pyramidpain", "Pyramid Vase");
        // A Prickly Situation
        Story.killQuest(3642, "pyramidpain", "Cactus Creeper ");
        // Beetle Battle Armor
        Story.killQuest(3643, "pyramidpain", "Golden Scarab ");
        // Pyramid Pilgrimage
        Story.killQuest(3644, "pyramidpain", ["Cactus Creeper ", "Golden Scarab "]);
        // Blood in the Sand
        Story.killQuest(3645, "pyramidpain", "Sandshark ");
        // Defeat Tribal Traitors
        Story.killQuest(3646, "pyramidpain", "Kalestri Worshipper ");
        // Marking The Territory
        Story.mapItemQuest(3647, "pyramidpain", 2758, 7);
        // Raiders of the Lost Artifact
        Story.killQuest(3648, "pyramidpain", "Tomb Robber ");
        // Surviving the Swarms
        Story.killQuest(3649, "pyramidpain", "Sandshark ");
        // The Legend of Eldo
        Story.killQuest(3650, "pyramidpain", "Pyramid Vase");
        // There's No Point
        Story.killQuest(3651, "pyramidpain", ["Cactus Creeper ", "Golden Scarab "]);
        // Trail of Naan Crumbs
        Story.mapItemQuest(3652, "pyramidpain", 2770, 13);
        // Tricky Trip Wires
        Story.killQuest(3653, "pyramidpain", "Kalestri Worshipper ");
        // Shooing Away Scarabs
        Story.killQuest(3655, "pyramidpain", "Golden Scarab ");
        // Humor is Close to the Heart
        Story.killQuest(3654, "pyramidpain", "Golden Scarab ");
        // Purple is Not Your Color
        Story.killQuest(3656, "pyramidpain", "Chaorrupted Robber ");
        // All Alone
        Story.killQuest(3657, "pyramidpain", "Kalestri Worshipper ");
        // Beginning of the End
        Story.killQuest(3658, "pyramidpain", "Pyramid Vase");
        // The Ultimate Sacrifice
        Story.killQuest(3659, "pyramidpain", "Viridi");
    }
}

export default function main(): void {
    const script = new PyramidofPain();
    Core.setOptions();

    script.pyramidofPain_Line();

    Core.setOptions(false);
}
