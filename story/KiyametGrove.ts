/*
name: KiyametGrove
description: Completes the quest chain in /kiyametgrove.
tags: kiyametgrove, story, quests, kiyametgrove
*/
// Port of Scripts/Story/KiyametGrove.cs.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class KiyametGrove {
    storyline(): void {
        if (Core.isCompletedBefore(10936)) {
            return;
        }

        Story.preLoad(this.storyline);

        const UseableMonsters = ["Apocalyptic Colossus", "Apocalyptic Golem", "Overcharged Colossus"];

        // 10935 | Arockalyptic
        Story.killQuest(10935, "kiyametgrove", UseableMonsters[1]);
        // Apocalypse Shard x12

        // 10936 | A Colossal Task
        Story.killQuest(10936, "kiyametgrove", UseableMonsters[0]);
        // Colossus Stone x1
    }
}

export default function main(): void {
    const script = new KiyametGrove();
    Core.setOptions();
    script.storyline();
    Core.setOptions(false);
}
