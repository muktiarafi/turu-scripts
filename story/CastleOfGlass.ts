/*
name: Castle of Glass Story
description: This will complete the Castle of Glass story.
tags: story, quest, castle-of-glass
*/
// Port of Scripts/Story/CastleOfGlass.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class CastleOfGlass {
    storyLine(): void {
        if (Core.isCompletedBefore(5356)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Where’s Tiffany? 5339
        Story.mapItemQuest(5339, "castleofglass", 4698);

        //Trapped! 5340
        if (!Story.questProgression(5340)) {
            Core.ensureAccept(5340);
            Core.getMapItems(
                [
                    [4699, 1],
                    [4710, 1],
                ],
                "castleofglass",
            );
            Core.huntMonster("castleofglass", "Glass Wyvern", "Glass Wyvern Slain", 3);
            Core.ensureComplete(5340);
        }

        //If At First You Don’t Succeed... 5341
        if (!Story.questProgression(5341)) {
            Core.ensureAccept(5341);
            Core.getMapItems(
                [
                    [4700, 1],
                    [4711, 1],
                ],
                "castleofglass",
            );
            Core.huntMonster("castleofglass", "Glass Panther", "Glass Panther Slain", 2);
            Core.ensureComplete(5341);
        }

        //Try, Try Again 5342
        if (!Story.questProgression(5342)) {
            Core.ensureAccept(5342);
            Core.getMapItems(
                [
                    [4701, 1],
                    [4712, 1],
                ],
                "castleofglass",
            );
            Core.huntMonster("castleofglass", "Mirror Knight", "Mirror Knight Slain", 1);
            Core.ensureComplete(5342);
        }

        //Escape! 5343
        Story.mapItemQuest(5343, "castleofglass", 4702);

        //Smash It Up 5344
        Story.killQuest(5344, "castleofglass", "Glass Golem");

        //Find the Pieces 5345
        Story.killQuest(5345, "castleofglass", "Glass Wyvern");

        //Finish the First Mosaic 5346
        Story.mapItemQuest(5346, "castleofglass", 4703);

        //Find More Pieces 5347
        if (!Story.questProgression(5347)) {
            Core.ensureAccept(5347);
            Core.huntMonster("castleofglass", "Glass Golem", "Green Mosaic Piece", 4);
            Core.huntMonster("castleofglass", "Glass Panther", "Blue Mosaic Piece", 2);
            Core.ensureComplete(5347);
        }

        //Finish the Second Mosaic 5348
        Story.mapItemQuest(5348, "castleofglass", 4704);

        //Even  More Pieces 5349
        if (!Story.questProgression(5349)) {
            Core.ensureAccept(5349);
            Core.huntMonster("castleofglass", "Glass Panther", "Blue Mosaic Piece", 4);
            Core.huntMonster("castleofglass", "Glass Golem", "Green Mosaic Piece", 2);
            Core.huntMonster("castleofglass", "Glass Wyvern", "Red Mosaic Piece", 6);
            Core.ensureComplete(5349);
        }

        //Finish the Third Mosaic 5350
        Story.mapItemQuest(5350, "castleofglass", 4705);

        //Cut and Run 5351
        Story.mapItemQuest(5351, "castleofglass", 4706);

        //The Shard Golem 5352
        Story.killQuest(5352, "castleofglass", "Shard Golem");

        //The Shardy Boys 5353
        if (!Story.questProgression(5353)) {
            Core.ensureAccept(5353);
            Core.getMapItem(4707, 5, "castleofglass");
            Core.huntMonster("castleofglass", "Glass Golem ", "Golem Interrogated", 5);
            Core.ensureComplete(5353);
        }

        //Cold Iron 5354
        Story.mapItemQuest(5354, "castleofglass", 4708);

        //Smash It Up Again 5355
        Story.mapItemQuest(5355, "castleofglass", 4709, 7);

        //What The Heck Is This Thing?! 5356
        Story.killQuest(5356, "castleofglass", "Chihuly");
    }
}

export default function main(): void {
    const script = new CastleOfGlass();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
