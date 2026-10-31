/*
name: Quibble Hunt Story
description: This will finish the Quibble Hunt Story.
tags: story, quest, quibble-hunt
*/
// Port of Scripts/Story/QuibbleHunt.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class QuibbleHunt {
    storyLine(): void {
        if (Core.isCompletedBefore(5891)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Follow Those Fairies! 5878
        Story.killQuest(5878, "quibblehunt", "Void Larva");

        //Aerodu Assault 5879
        if (!Story.questProgression(5879)) {
            Core.ensureAccept(5879);
            Core.huntMonster("quibblehunt", "Aerodu Defense Machine", "Aerodux Crate", 6);
            Core.huntMonster("quibblehunt", "Nimbo", "Ausome Package", 3);
            Core.ensureComplete(5879);
        }

        //Void Travel Battle 5880
        Story.killQuest(5880, "quibblehunt", "Void Elemental");

        //Lost to Entropy? 5881
        Story.killQuest(5881, "quibblehunt", "Entropy Dragon");

        //Void Travel Battle 5882
        Story.killQuest(5882, "quibblehunt", "Void Elemental");

        //The Master Quest 5883
        if (!Story.questProgression(5883)) {
            Core.ensureAccept(5883);
            Core.huntMonster("quibblehunt", "Jimmy the Eye-Pod", "iChest", 3);
            Core.huntMonster("quibblehunt", "Master Twang", "Combat Diploma", 1);
            Core.ensureComplete(5883);
        }

        //Void Travel Battle 5884
        Story.killQuest(5884, "quibblehunt", "Void Elemental");

        //Crystallize This 5885
        Story.killQuest(5885, "quibblehunt", "RogueFiend");

        //Void Travel Battle 5886
        Story.killQuest(5886, "quibblehunt", "Void Elemental");

        //Nauts and Double-crosses 5887
        if (!Story.questProgression(5887)) {
            Core.ensureAccept(5887);
            Core.huntMonster("quibblehunt", "Braken Tentacle", "Soggy Note", 1);
            Core.huntMonster("quibblehunt", "Jellyfish", "Nautican ShellCase", 8);
            Core.huntMonster("quibblehunt", "Braken Tentacle", "Coral Capsule", 5);
            Core.ensureComplete(5887);
        }

        //Void Travel Battle 5888
        Story.killQuest(5888, "quibblehunt", "Void Elemental");

        //Key to the Mystery 5889
        Story.mapItemQuest(5889, "quibblehunt", 5311);

        //Get the Key 5890
        Story.killQuest(5890, "quibblehunt", "Clawg");

        //A Void the Dricken 5891
        Story.killQuest(5891, "quibblehunt", "Dricken");
    }
}

export default function main(): void {
    const script = new QuibbleHunt();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
