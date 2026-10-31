/*
name: Musty Cave Story
description: This will finish the Musty Cave Story.
tags: story, quest, musty-cave
*/
// Port of Scripts/Story/MustyCave.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class MustyCave {
    storyline(): void {
        if (Core.isCompletedBefore(7049)) {
            return;
        }

        Story.preLoad(this.storyline);

        //Killer Robots! (7034)
        Story.killQuest(7034, "redfurvalley", "Guard Drone");
        //Full Bellies (7035)
        Story.killQuest(7035, "redfurvalley", "Harvester Drone");
        //They're Waaatching (7036)
        Story.killQuest(7036, "redfurvalley", "Spy Drone");
        //Gotta Keep Hydrated (7037)
        Story.buyQuest(7037, "nibbleon", 1553, "Makai-Sun");
        //Find Twilly (7038)
        Story.mapItemQuest(7038, "mustycave", 6588);
        //Free Twilly! (7039)
        if (!Story.questProgression(7039)) {
            Core.ensureAccept(7039);
            Core.getMapItem(6589, 1, "mustycave");
            Core.huntMonster("mustycave", "Guard Drone", "Twilly's Cage Code", 1);
            Core.ensureComplete(7039);
        }
        //Free the Moglins (7040)
        Story.mapItemQuest(7040, "mustycave", 6590, 6);
        //Essence-ial (7041)
        Story.killQuest(7041, "mustycave", "Harvester Drone");
        //Drones are a Drag (7042)
        Story.killQuest(7042, "mustycave", "Spy Drone");
        //Souls for Controls (7043)
        Story.killQuest(7043, "nibbleon", "Void Mage");
        //Investigation Time (7044)
        Story.mapItemQuest(7044, "mustycave", [6591, 6592, 6593, 6594]);
        //Get Revenge (7045)
        Story.killQuest(7045, "mustycave", "Guard Drone");
        //Key the Guards (7046)
        Story.killQuest(7046, "mustycave", "Guard Drone");
        //Time to Teleport (7047)
        Story.mapItemQuest(7047, "mustycave", 6595);
        //GET HIM! (7048)
        Story.killQuest(7048, "mustycave", "Mogdring");
        //Doom Regin Doom's Reward (7049)
        if (!Story.questProgression(7049)) {
            Core.ensureAccept(7049);
            Core.huntMonster("mustycave", "Mogdring", "Golden Gear", 5, { isTemp: false });
            Core.huntMonster("mustycave", "Spy Drone", "Aura Core", 25, { isTemp: false });
            Core.huntMonster("mustycave", "Guard Drone", "Dimension Stabilizer", 35, { isTemp: false });
            Core.ensureComplete(7049);
        }
    }
}

export default function main(): void {
    const script = new MustyCave();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
