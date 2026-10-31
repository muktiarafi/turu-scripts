/*
name: SkyGuard Saga Story
description: This will finish the SkyGuard Saga Story.
tags: story, quest, skyguard-saga
*/
// Port of Scripts/Story/SkyGuardSaga.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class SkyGuardSaga {
    doAll(): void {
        if (!Core.isMember) {
            return;
        }

        if (Core.isCompletedBefore(2488)) {
            return;
        }

        this.airShip();
        this.academy();
        this.anders();
        this.dreamMaze();
        this.strategy();
        this.pirateBase();
        this.highCommand();
        this.bunker();
        this.chaosGuard();
    }

    airShip(): void {
        if (Core.isCompletedBefore(888)) {
            return;
        }

        Story.preLoad(this.airShip);

        // Fiends in High Places 883
        Story.killQuest(883, "airship", "Sky Pirate Draconian");

        // A Whirled Wide Traveler 884
        if (!Story.questProgression(884)) {
            Story.mapItemQuest(884, "airship", 217, 10, { autoCompleteQuest: false });
            Core.chainComplete(889);
            Story.chainQuest(884);
        }

        // Boiler Spoiler 885
        Story.killQuest(885, "airship", "Rehydrated Gell Oh No");

        // This Fight Will Dragon 886
        Story.killQuest(886, "airship", "Sky Pirate Dragon");

        // Things Are Looking Up 887
        if (!Story.questProgression(887)) {
            Core.ensureAccept(887);
            Core.huntMonster("airship", "Sky Pirate Draconian", "Sky Pirate Medal of Dishonor", 8);
            Core.huntMonster("airship", "Rehydrated Gell Oh No", "Gel-O-No Medal of Dishonor", 1);
            Core.huntMonster("airship", "Sky Pirate Dragon", "Sky Dragon Medal of Dishonor", 1);
            Core.ensureComplete(887);
        }

        // Don't Get Mad, Get Gladius 888
        Story.killQuest(888, "airship", "Gladius");
    }

    academy(): void {
        if (Core.isCompletedBefore(1041)) {
            return;
        }

        Story.preLoad(this.academy);

        // School's Out for the Invasion 1038
        Story.mapItemQuest(1038, "academy", 399);

        // Chaobold Bullies 1039
        Story.mapItemQuest(1039, "academy", 400, 5);
        Story.killQuest(1039, "academy", ["Chaobold", "Bronze Sky Pirate"]);

        // Trip the Traps 1040
        Story.mapItemQuest(1040, "academy", 401, 15);

        // Wreck the Warder 1041
        Story.killQuest(1041, "academy", "Inbunche");
    }

    anders(): void {
        if (Core.isCompletedBefore(1107)) {
            return;
        }

        Story.preLoad(this.anders);

        // Banditing Together 1104
        Story.killQuest(1104, "anders", ["Dravir", "Copper Sky Pirate"]);

        // Booty Becomes Barrier 1105
        Story.mapItemQuest(1105, "anders", 439, 10);
        Story.mapItemQuest(1105, "anders", 440, 2);
        Story.killQuest(1105, "anders", ["Dravir", "Copper Sky Pirate"]);

        // We Didn't Start The Fire (Oh, Wait...) 1106
        Story.mapItemQuest(1106, "anders", 441);
        Story.killQuest(1106, "anders", ["Copper Sky Pirate", "Copper Sky Pirate", "Dravir"]);

        // Granny's Final Request 1107
        Story.killQuest(1107, "anders", "Iron Hoof");
    }

    dreamMaze(): void {
        if (Core.isCompletedBefore(1222)) {
            return;
        }

        // Sweet Dreamlands are Made Like This 1215
        Story.mapItemQuest(1215, "dreammaze", 519);

        // Through the Gates of the Silver Portal 1222
        Story.killQuest(1222, "dreammaze", "Nightmare Lieutenant");
    }

    strategy(): void {
        if (Core.isCompletedBefore(1290)) {
            return;
        }

        Story.preLoad(this.strategy);

        // SkyPirates Slaying Strategies 1286
        Story.killQuest(1286, "strategy", "Dravir Pirate");

        // Strategic Alarm Sequence 1287
        Story.mapItemQuest(1287, "strategy", 558);

        // SkyShip Chase Scene 1288
        Story.mapItemQuest(1288, "strategy", 559);

        // SkyPirate Shot-caller Neutralized 1289
        Story.killQuest(1289, "strategy", "Dravir Pirate Captain");

        // SkyPirate Map Hunt 1290
        Story.killQuest(1290, "strategy", [
            "Dravir Pirate",
            "Dravir Pirate",
            "Dravir Pirate",
            "Dravir Pirate",
            "Dravir Pirate",
        ]);
    }

    pirateBase(): void {
        if (Core.isCompletedBefore(1700)) {
            return;
        }

        Story.preLoad(this.pirateBase);

        // Deserter in the Ranks 1696
        if (!Story.questProgression(1696)) {
            Core.ensureAccept(1696);
            Core.huntMonster("lair", "Golden Draconian", "SkyPirate Base Key");
            Core.ensureComplete(1696);
        }

        // Secure the Ship 1697
        Story.mapItemQuest(1697, "piratebase", 896, 14);
        Story.mapItemQuest(1697, "piratebase", 895);
        Story.killQuest(1697, "piratebase", "Security Sky Pirate");

        // Infiltration is a Go 1698
        Story.mapItemQuest(1698, "piratebase", 897, 10);
        Story.killQuest(1698, "piratebase", "Chaorrupted Sky Pirate");

        // Eluding Capture is not an Option 1699
        Story.killQuest(1699, "piratebase", "Chaorrupted Sky Pirate");

        // Don't Get Caught Weak in the Knees 1700
        Story.killQuest(1700, "piratebase", "Chaorrupted SkyGeneral");
    }

    highCommand(): void {
        if (Core.isCompletedBefore(2042)) {
            return;
        }

        Story.preLoad(this.highCommand);

        // Bridge the Gap 2038
        Story.mapItemQuest(2038, "highcommand", 997, 4);
        Story.killQuest(2038, "highcommand", ["Storagebox", "Bronze Sky Pirate"]);

        // Crack the Code 2039
        Story.mapItemQuest(2039, "highcommand", 1000);

        // Comm Module 4dX 2040
        Story.killQuest(2040, "highcommand", ["Bronze Sky Pirate", "Chaorrupted Invader"]);

        // Can You Hear Me Now? 2043
        Story.mapItemQuest(2043, "highcommand", 996, 10);
        Story.mapItemQuest(2043, "highcommand", [998, 999]);

        // Back to Base-ics 2041
        Story.killQuest(2041, "piratebase", ["Chaorrupted Sky Pirate", "Chaorrupted Sky Pirate"]);

        // Secret Weapon Mecha-Death! 2042
        Story.killQuest(2042, "highcommand", "M3CH4-D34TH");
    }

    bunker(): void {
        if (Core.isCompletedBefore(2252)) {
            return;
        }

        Story.preLoad(this.bunker);

        if (!Core.checkInventory("Bag of Gross Supplies")) {
            // Hoof it til it Beaks 2248
            if (!Core.checkInventory(["Tanned Skin", "Hootbeak Piercer"])) {
                Core.addDrop("Tanned Skin", "Hootbeak Piercer");
                Core.ensureAccept(2248);
                Core.getMapItem(1410, 5, "bunker");
                Core.huntMonster("bunker", "Subrysa", "Subrysa Skin", 5);
                Core.huntMonster("bunker", "Hootbear", "Hootbeak", 5);
                Core.ensureComplete(2248);
            }

            // Bind it with Twine 2249
            if (!Core.checkInventory(["Emu Egg Binder", "Medical Twine"])) {
                Core.addDrop("Emu Egg Binder", "Medical Twine");
                Core.ensureAccept(2249);
                Core.getMapItem(1411, 7, "bunker");
                Core.getMapItem(1412, 3, "bunker");
                Core.huntMonster("bunker", "Tainted Emu", "Emu Spine", 3);
                Core.huntMonster("bunker", "Koalion", "Koalion Claw", 6);
                Core.ensureComplete(2249);
            }

            // Hold it Together 2250
            if (!Core.checkInventory("Rhison Glue")) {
                Core.addDrop("Rhison Glue");
                Core.ensureAccept(2250);
                Core.huntMonster("bloodtusk", "Rhison", "Rhison Hoof", 10);
                Core.ensureComplete(2250);
            }

            Core.buyItem("bunker", 467, "Bag of Gross Supplies");
        }

        // Build a Beast! 2251
        if (!Story.questProgression(2251)) {
            Core.ensureAccept(2251);
            Core.huntMonster("palace", "Subrysa", "Subrysa Corpse", 3);
            Core.huntMonster("bunker", "Koalion", "Koalion Corpse", 3);
            Core.huntMonster("bunker", "Tainted Emu", "Tainted Emu Corpse", 3);
            Core.huntMonster("bunker", "Hootbear", "Hootbear Corpse", 3);
            Core.ensureComplete(2251);
        }

        // Break a Beast! 2252
        Story.killQuest(2252, "bunker", "Chaos Beast Attempt");
    }

    chaosGuard(): void {
        if (Core.isCompletedBefore(2488)) {
            return;
        }

        Story.preLoad(this.chaosGuard);

        // Break the Chains 2484
        if (!Core.checkInventory("All the Guards Defeated")) {
            Core.ensureAccept(2484);
            Core.huntMonster("chaosguard", "Chaos Skylord", "Defeated SkyLord", 2);
            Core.huntMonster("chaosguard", "Chaos Commander", "Defeated Commander", 5);
            Core.ensureComplete(2484);
        }

        // Eye Spy Victory! 2486
        if (!Core.checkInventory("No Spy-eyes on me")) {
            Core.ensureAccept(2486);
            Core.huntMonster("chaosguard", "Sky Spy-Eye", "Defeated Sky Spy-Eye", 8);
            Core.ensureComplete(2486);
        }

        // Discover the Passage 2489
        if (!Core.checkInventory("Explore the passage")) {
            Core.ensureAccept(2489);
            Core.getMapItem(1553, 1, "chaosguard");
            Core.huntMonster("chaosguard", "Chaos Skywatcher", "SkyWatcher Defeated");
            Core.ensureComplete(2489);
        }

        // Master Exos' Keep 2482
        Story.chainQuest(2482);

        // Defeat Exos 2487
        Story.killQuest(2487, "chaosguard", "Exos");
    }
}

export default function main(): void {
    const script = new SkyGuardSaga();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
