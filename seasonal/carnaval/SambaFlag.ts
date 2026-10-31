/*
name: SambasFlag Story
description: This will finish the SambasFlag Story.
tags: story, quest, sambasflag
*/
// Port of Scripts/Seasonal/Carnaval/SambaFlag.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class SambasFlag {
    storyLine(): void {
        if (Core.isCompletedBefore(9115) || !Core.isSeasonalMapActive("Sambaflag")) {
            return;
        }

        Story.preLoad(this.storyLine);

        // Bald Spots 9110
        if (!Story.questProgression(9110)) {
            Core.ensureAccept(9110);
            Core.huntMonster("bloodtusk", "Rhison", "Rhison Fur", 8);
            Core.huntMonster("bloodtusk", "Jungle Vulture", "Vulture Feathers", 8);
            Core.ensureComplete(9110);
        }

        // Work Out Glow 9111
        if (!Story.questProgression(9111)) {
            Core.ensureAccept(9111);
            Core.huntMonster("dwarfhold", "Gemrald", "Gem Sequin", 8);
            Core.huntMonster("dwarfhold", "Glow Worm", "Glowing Residue", 8);
            Core.ensureComplete(9111);
        }

        // Burned Forevermore 9112
        if (!Story.questProgression(9112)) {
            Core.ensureAccept(9112);
            Core.huntMonster("fotia", "Femme Cult Worshiper", "Cult Veil", 8);
            Core.huntMonster("fotia", "Fotia Spirit", "Fotia Spirit Dress", 8);
            Core.ensureComplete(9112);
        }

        // Calm Sea and Prosperous Voyage 9113
        if (!Story.questProgression(9113)) {
            Core.ensureAccept(9113);
            Core.huntMonster("shipwreck", "Gilded Merdraconian", "Gilded Draconia Scale", 8);
            Core.huntMonster("shipwreck", "Gilded Crystal Undead", "Gold Crystals", 8);
            Core.ensureComplete(9113);
        }

        // Chaos Cleanse 9114
        if (!Story.questProgression(9114)) {
            Core.ensureAccept(9114);
            Core.huntMonster("falguard", "Chaonslaught Cavalry", "Chaos Cavalry Defeated", 8);
            Core.huntMonster("falguard", "Chaonslaught Caster", "Chaos Caster Defeated", 8);
            Core.ensureComplete(9114);
        }

        // Fly the Standard 9115
        if (!Story.questProgression(9115)) {
            Core.ensureAccept(9115);
            Core.huntMonster("sambaflag", "Flag Bearer", "Flag Standard", 1);
            Core.huntMonster("sambaflag", "Master of Ceremonies", "Ceremony Feather", 1);
            Core.ensureComplete(9115);
        }
    }
}

export default function main(): void {
    const script = new SambasFlag();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
