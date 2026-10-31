/*
name: Safiria Story (Member)
description: This will finish the Safiria Story.
tags: story, quest, safiria, member
*/
// Port of Scripts/Story/Safiria[Member].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class Safiria {
    storyLine(): void {
        if (Core.isCompletedBefore(1947)) {
            return;
        }

        if (!Core.isMember) {
            Core.logger("Safiria Storyline Is Member Only. Skipping this Script");
            return;
        }

        Story.preLoad(this.storyLine);
        Core.addDrop(
            "Djinn's Magic Trace",
            "Chronomancer's Magic Trace",
            "Darkblood's Magic Trace",
            "Dragon's Magic Trace",
            "Safiria's Blood Sample",
        );

        //The Stolen Ritual 1939
        Story.killQuest(1939, "Safiria", "Chaos Lycan");

        //A Pound Of Flesh 1940
        Story.killQuest(1940, "Safiria", "Blood Maggot");

        //Blood Of The Ancients 1941
        Story.killQuest(1941, "Safiria", "Chaos Lycan");

        //Phinding Phylacteries 1942
        Story.mapItemQuest(1942, "Safiria", 962, 4);

        //The First Phylactery 1943
        if (!Story.questProgression(1943)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(1943);
            Core.killMonster("djinn", "r6", "Up", "Ultra Tibicenas", "Djinn's Magic Trace", 5, { isTemp: false });
            Core.ensureComplete(1943);
        }

        //The Second Phylactery 1944
        if (!Story.questProgression(1944)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(1944);
            Core.huntMonster("mqlesson", "Dragonoid", "Dragonoid of Hours", undefined, { isTemp: false });
            Core.killMonster("ultravoid", "Frame2", "Left", "Ultra Iadoa", "Chronomancer's Magic Trace", 5, {
                isTemp: false,
            });
            Core.ensureComplete(1944);
        }

        //The Third Phylactery 1945
        if (!Story.questProgression(1945)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(1945);
            Core.killMonster("ultralionfang", "Enter", "Spanw", "Ultra Lionfang", "Darkblood's Magic Trace", 5, {
                isTemp: false,
            });
            Core.ensureComplete(1945);
        }

        //The Final Phylactery 1946
        if (!Story.questProgression(1946)) {
            Core.equipClass(ClassType.Solo);
            Core.ensureAccept(1946);
            Core.killMonster("ancienttrigoras", "r2a", "Spawn", "Ancient Trigoras", "Dragon's Magic Trace", 5, {
                isTemp: false,
            });
            Core.ensureComplete(1946);
        }

        //Ancient Vitae 1947
        Story.killQuest(1947, "battledoom", "Shadow Safiria");
    }
}

export default function main(): void {
    const script = new Safiria();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
