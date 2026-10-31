/*
name: Poison Forest Story
description: This will finish the Poison Forest Story.
tags: story, quest, poison-forest
*/
// Port of Scripts/Story/PoisonForest.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";
import { Manor } from "./Manor";

const Story = new CoreStory();
const manor = new Manor();

export class PoisonForest {
    storyLine(): void {
        manor.storyLine();

        if (Core.isCompletedBefore(1955)) {
            return;
        }

        Story.preLoad(this.storyLine);

        //Poison Creation 1948
        if (!Story.questProgression(1948)) {
            Core.ensureAccept(1948);
            Core.getMapItem(964, 3, "PoisonForest");
            Core.getMapItem(965, 3, "PoisonForest");
            Core.huntMonster("poisonforest", "Marsh Lurker", "Toxic Gallstones", 3);
            Core.huntMonster("poisonforest", "Traitor Knight", "Traitor's Sweat", 8);
            Core.ensureComplete(1948);
        }

        //Vegetal Decay 1949
        if (
            !Story.questProgression(1949) ||
            (!Core.checkInventory("Combustible Krialo Moss") && !Core.isCompletedBefore(1954))
        ) {
            Core.ensureAccept(1949);
            const Q = Core.initializeWithRetries(() => Core.ensureLoad(1949));
            if ((Q?.requirements?.find((x) => x != null && x.id === 11803) ?? null)?.quantity !== 9) {
                Core.logger(
                    "This Quest is literaly impossible until AE fixes the quest ( when fixed will autoprogress and this message wont appear anymopre)",
                    "PosionForest - AE Broke it",
                );
                return;
            } else {
                Core.getMapItem(963, 9, "PoisonForest");
            }
            Core.getMapItem(971, 1, "PoisonForest");
            Core.huntMonster("PoisonForest", "Marsh Lurker", "Toxic Gallstones");
            Core.ensureComplete(1949);
        }

        //Recycle, Rebuild, Rescue 1950
        if (!Story.questProgression(1950) || (!Core.checkInventory("Sour Sap") && !Core.isCompletedBefore(1954))) {
            Core.ensureAccept(1950);
            Core.getMapItem(966, 1, "PoisonForest");
            Core.huntMonster("PoisonForest", "Traitor Knight", "Unbent Nail", 6);
            Core.huntMonster("PoisonForest", "Treeant", "Sturdy Vine", 6);
            Core.ensureComplete(1950);
        }

        //Corrosive Philtre 1951
        if (!Story.questProgression(1951) || (!Core.checkInventory("Burning Ember") && !Core.isCompletedBefore(1954))) {
            Core.ensureAccept(1951);
            Core.getMapItem(967, 5, "PoisonForest");
            Core.huntMonster("PoisonForest", "Burning Loyalist", "Burning Loyalist Ember", 15);
            Core.ensureComplete(1951);
        }

        //Loyalty Rewarded, Wounds Salved 1952
        Story.killQuest(1952, "PoisonForest", "Burning Loyalist");

        //Storm the Fort 1953
        if (
            !Story.questProgression(1953) ||
            (!Core.checkInventory("Flakes of Rust") && !Core.isCompletedBefore(1954))
        ) {
            Core.ensureAccept(1953);
            Core.getMapItem(968, 1, "PoisonForest");
            Core.huntMonster("PoisonForest", "Traitor Knight", "Guard Slain", 8);
            Core.ensureComplete(1953);
        }

        //Termination Tonic 1954
        if (!Story.questProgression(1954)) {
            Core.ensureAccept(1954);
            Core.getMapItem(970, 1, "PoisonForest");
            Core.huntMonster("poisonforest", "Traitor Knight", "Enraged Blood", 11);
            Core.ensureComplete(1954);
        }

        //Burn ALL the Things! 1955
        if (!Story.questProgression(1955)) {
            Core.ensureAccept(1955);
            Core.getMapItem(969, 11, "PoisonForest");
            Core.huntMonster("poisonforest", "Xavier Lionfang", "Xavier Lionfang Slain", 1);
            Core.ensureComplete(1955);
        }
    }
}

export default function main(): void {
    const script = new PoisonForest();
    Core.setOptions();

    script.storyLine();

    Core.setOptions(false);
}
