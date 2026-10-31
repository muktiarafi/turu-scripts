/*
name: Alutea Nursery
description: This will finish the Alutea Nursery Quest.
tags: story, quest, alutea-nursery, pirate
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/AluteaNursery.cs.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { LowTideStory } from "./LowTideStory";

const Story = new CoreStory();
const lowTideStory = new LowTideStory();

export class AluteaNursery {
    doAll(): void {
        if (!Core.isSeasonalMapActive("AluteaNursery")) {
            return;
        }

        this.aluteaNurseryStory();
        this.aluteaNurseryRewards();
    }

    aluteaNurseryStory(): void {
        lowTideStory.storyline();

        if (Core.isCompletedBefore(8857)) {
            return;
        }

        Story.preLoad(this.aluteaNurseryStory);

        //Carefree Drifters 8848
        Story.killQuest(8848, "AluteaNursery", "Spectral Jellyfish");

        //Bone Bites 8849
        Story.killQuest(8849, "AluteaNursery", "Bone Crustacean");

        //The Lost Generation 8850
        if (!Story.questProgression(8850)) {
            Core.ensureAccept(8850);
            Core.getMapItem(10557, 5, "AluteaNursery");
            Core.huntMonster("aluteanursery", "Bone Crustacean", "Crustacean Caught", 8);
            Core.ensureComplete(8850);
        }

        //Tender Temple 8851
        if (!Story.questProgression(8851)) {
            Core.ensureAccept(8851);
            Core.getMapItem(10558, 1, "AluteaNursery");
            Core.huntMonster("aluteanursery", "Spectral Jellyfish", "Cold Stingers", 8);
            Core.ensureComplete(8851);
        }

        //Cast Away Buds 8852
        if (!Story.questProgression(8852)) {
            Core.ensureAccept(8852);
            Core.getMapItem(10559, 2, "AluteaNursery");
            Core.huntMonster("aluteanursery", "Spectral Jellyfish", "Jelly Tormentors", 8);
            Core.ensureComplete(8852);
        }

        //Current Catching 8853
        Story.mapItemQuest(8853, "AluteaNursery", 10563, 5);

        //Silent Sea 8854
        if (!Story.questProgression(8854)) {
            Core.ensureAccept(8854);
            Core.getMapItems(
                [
                    [10560, 1],
                    [10561, 1],
                ],
                "AluteaNursery",
            );
            Core.huntMonster("aluteanursery", "Stagnant Water", "Stagnant Water Cleared", 8);
            Core.ensureComplete(8854);
        }

        //Hay! Bale Already! 8855
        if (!Story.questProgression(8855)) {
            Core.ensureAccept(8855);
            Core.getMapItem(10562, 2, "AluteaNursery");
            Core.huntMonster("aluteanursery", "Bone Crustacean", "Shellfish Meat", 8);
            Core.huntMonster("aluteanursery", "Spectral Jellyfish", "Jelly Filling", 8);
            Core.ensureComplete(8855);
        }

        //Abyss to Sun 8856
        if (!Story.questProgression(8856)) {
            Core.ensureAccept(8856);
            Core.getMapItem(10564, 1, "AluteaNursery");
            Core.huntMonster("aluteanursery", "Stagnant Water", "Elemental Defeated", 8);
            Core.ensureComplete(8856);
        }

        //Ebbing Grudges 8857
        Story.killQuest(8857, "AluteaNursery", "Last Alutian");
    }

    aluteaNurseryRewards(): void {
        const RewardOptions = Core.ensureLoad(8858).rewards;
        // C# builds the list from an empty `RewardsList` (the names went into an unused
        // `RewardList`), so CheckInventory of nothing is true and the rewards are never farmed.
        const Rewards = RewardOptions.map((x) => x.name);

        if (Core.checkInventory(Rewards, undefined, { toInv: false })) {
            return;
        }

        Core.checkSpaces(0, ...Rewards);

        Core.addDrop(...Rewards);
        Core.registerQuests(8858);
        while (!bot.shouldExit && !Core.checkInventory(Rewards, undefined, { toInv: false })) {
            //Beach Cleanse 8858
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("aluteanursery", "Last Alutian", "Angler Antena", 1, { log: false });
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("aluteanursery", "Stagnant Water", "Stale Seawater", 6, { log: false });
            Core.huntMonster("aluteanursery", "Bone Crustacean", "Pale Shell", 6, { log: false });
        }
        Core.cancelRegisteredQuests();
        Core.toBank(...Rewards);
    }
}

export default function main(): void {
    const script = new AluteaNursery();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
