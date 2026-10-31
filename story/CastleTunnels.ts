/*
name: Castle Tunnels Story
description: This will complete the Castle Tunnels story.
tags: story, quest, castle-tunnels
*/
// Port of Scripts/Story/CastleTunnels.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class CastleTunnels {
    storyLine(): void {
        if (Core.isCompletedBefore(5255)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Explore the Tunnels 5244
        Story.mapItemQuest(5244, "CastleTunnels", 4597);
        Story.killQuest(5244, "CastleTunnels", ["Vampire Bat", "Blood Maggot"]);

        //Find the Keys 5245
        Story.mapItemQuest(5245, "CastleTunnels", 4598, 4);

        //Open the Treasure Chests 5246
        Story.mapItemQuest(5246, "CastleTunnels", 4599, 4);

        //Gotta get that Blood 5247
        Story.killQuest(5247, "CastleTunnels", "Blood Maggot");

        //Feed the Shrine 5248
        Story.mapItemQuest(5248, "CastleTunnels", 4600);

        //Beat those Ghouls 5249
        Story.killQuest(5249, "CastleTunnels", ["Vampire Ghoul", "Vampire Ghoul"]);

        //Activate the Golden Scepter 5250
        Story.mapItemQuest(5250, "CastleTunnels", 4601);

        //Check out the Basement 5251
        Story.mapItemQuest(5251, "CastleTunnels", [4602, 4603]);

        //Get those Symbiotes 5252
        Story.killQuest(5252, "CastleTunnels", ["Blood Symbiote", "Blood Symbiote"]);

        //Activate the Basement Scepter 5253
        Story.mapItemQuest(5253, "CastleTunnels", 4604);

        //Unlock that Chest! 5254
        Story.mapItemQuest(5254, "CastleTunnels", 4605);

        //Defeat the Blood Dragon! 5255
        Story.killQuest(5255, "CastleTunnels", "Blood Dragon");
    }
}

export default function main(): void {
    const script = new CastleTunnels();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
