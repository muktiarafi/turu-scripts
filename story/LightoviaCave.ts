/*
name: Lightovia Cave Story
description: This will finish the Lightovia Cave Story.
tags: story, quest, lightovia-cave
*/
// Port of Scripts/Story/LightoviaCave.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";
import { ShadowVoid } from "./ShadowVoid";

const Story = new CoreStory();
const shadowVoid = new ShadowVoid();

export class LightoviaCave {
    lightoviaCaveQuests(): void {
        if (!bot.quests.isUnlocked(7132)) {
            if (bot.quests.isUnlocked(7123)) {
                Core.logger(
                    "Quests are locked Shadowvoid quests should be completed first. Starting Shadowvoid script",
                );
                shadowVoid.shadowVoidQuests();
            } else {
                Core.logger("Quests are locked You Should Finish Lords Of Chaos story script first");
                return;
            }
        }

        if (Core.isCompletedBefore(7136)) {
            return;
        }

        Story.preLoad(this.lightoviaCaveQuests);

        //Defeat the Imbalanced 7132
        Story.killQuest(7132, "LightoviaCave", "Imbalanced Knight");

        //Free the Lycans 7133
        if (!Story.questProgression(7133)) {
            Core.ensureAccept(7133);
            Core.getMapItem(6767, 6, "LightoviaCave");
            Core.huntMonster("lightoviacave", "Imbalanced Mage", "Enchanted Key", 6);
            Core.ensureComplete(7133);
        }

        //Cleanse the Land 7134
        Story.mapItemQuest(7134, "LightoviaCave", 6768, 6);

        //Defeat the Knights 7135
        Story.killQuest(7135, "LightoviaCave", "Imbalanced Knight");

        //Defeat ArchMage Brentan 7136
        Story.killQuest(7136, "LightoviaCave", "Evil ArchMage Brentan");
    }
}

export default function main(): void {
    const script = new LightoviaCave();
    Core.setOptions();

    script.lightoviaCaveQuests();

    Core.setOptions(false);
}
