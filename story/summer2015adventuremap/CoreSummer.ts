/*
name: null
description: null
tags: null
*/
// Port of Scripts/Story/Summer2015AdventureMap/CoreSummer.cs.
// Not ported (FarmerJoe's DoAll doesn't reach them): DoAll, DreadSpace, Deadmoor, Beleen, LivingDungeon, LunaCove, CyserosSecret.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();
const Adv = new CoreAdvanced();

export class CoreSummer {
    collector(): void {
        if (Core.isCompletedBefore(1348)) return;

        Story.preLoad(this.collector);

        // This Town in a Desktop Globe
        Story.mapItemQuest(1293, "Terrarium", 586);

        // Dust Bunnies Can't Hide
        Story.killQuest(1294, "Terrarium", "Dustbunny of Doom");

        // Au Contr-air holes
        Story.mapItemQuest(1295, "Terrarium", 587, 10);

        // Hero Eats Everything. Even Pellets
        Story.mapItemQuest(1296, "Terrarium", 588, 12);

        // The Moth Defeats the Man?
        Story.killQuest(1297, "Terrarium", "Death on Wings");

        // Can you find them?
        Story.mapItemQuest(1298, "Terrarium", [589, 590, 591, 592, 593]);

        // You've Been Looking Everywhere!
        Story.mapItemQuest(1299, "Terrarium", [593, 594, 595, 596, 604]);

        // Go for Grease!
        Story.killQuest(1300, "Terrarium", "Death on Wings");

        // Doppelganger Wants to Hit You
        if (!Story.questProgression(1308)) {
            Core.ensureAccept(1308);
            Core.huntMonster("terrarium", "Doppleganger Of Fred", "Doppelganger Demolished!", 1);
            Core.huntMonster("terrarium", "Doppleganger of Will", "Doppelganger Destroyed!", 1);
            Core.ensureComplete(1308);
        }

        // Catapult Climb
        Story.mapItemQuest(1309, "Terrarium", 604);

        // The Treasure that You Seek - 976
        Story.killQuest(1339, "prehistoric", "Gigantosaurus");

        // These Trees - 1340
        Story.mapItemQuest(1340, "prehistoric", 630, 11);

        // Ewwww... Totally Gross - 1341
        Story.killQuest(1341, "prehistoric", "Gigantosaurus");

        // The Eggs, Exciting and New - 1342
        Story.mapItemQuest(1342, "prehistoric", 631, 4);

        // Someday (Today) Their Mother Will Die - 1343
        Story.killQuest(1343, "prehistoric", "Mother TerrorDOOMKill");

        // More Aliens Than You Can Handle?
        Story.killQuest(1344, "Future", "Alien Dino");

        // Spy Eyes
        Story.mapItemQuest(1345, "Future", 632, 2);

        // Smashed to Pieces
        Story.mapItemQuest(1346, "Future", 633, 7);

        // Tired of My Vigilette Dreams
        if (!Story.questProgression(1347)) {
            Core.ensureAccept(1347);
            Core.huntMonster("Future", "Red-Eyed Alien", "Small Fragment Acquired", 5);
            Core.huntMonster("Future", "Red-Eyed Alien", "Medium Piece Acquired", 5);
            Core.ensureComplete(1347);
        }

        // You're Not the Boss of Me Now
        if (!Story.questProgression(1348)) {
            Core.ensureAccept(1348);
            Core.huntMonster("Future", "The Collector", "Collector Vanquished");
            Core.ensureComplete(1348);
        }
    }

    dreadSpace(ReplicatorMerge = false): void {
        if (Core.isCompletedBefore(4286)) {
            return;
        }

        Story.preLoad(this.dreadSpace);

        // Ebil Dread Space (4263)
        Core.join("dreadspace");
        Story.chainQuest(4263);

        //1st Contact (4264)
        if (!Story.questProgression(4264)) {
            Core.ensureAccept(4264);
            Core.killMonster("dreadspace", "r4", "Left", "*", "Proof of Undead");
            Core.ensureComplete(4264);
        }

        //SO SLAY WE ALL! (4265)
        if (!Story.questProgression(4265)) {
            Core.ensureAccept(4265);
            Core.killMonster("dreadspace", "r4", "Left", "*", "Space Zombie Gun", 10);
            Core.ensureComplete(4265);
        }

        //Starship Troopers (4266)
        if (!Story.questProgression(4266)) {
            Core.ensureAccept(4266);
            Core.killMonster("dreadspace", "r4", "Left", "*", "Troopers Interrogated", 5);
            Core.ensureComplete(4266);
        }

        //Takai Me On (4267)
        if (!Story.questProgression(4267)) {
            Core.ensureAccept(4267);
            Core.huntMonster("dreadspace", "Defense Turret", "Defense Turret deactivated", 6);
            Core.huntMonster("dreadspace", "Vaderix", "Alien defeated", 6);
            Core.ensureComplete(4267);
        }

        //We are the HORG! (4268)
        Story.killQuest(4268, "dreadspace", "Cyber Horg");

        //Fix the Holodeck (4269)
        if (!Story.questProgression(4269)) {
            Core.ensureAccept(4269);
            Core.huntMonster("dreadspace", "Undead Space Warrior", "Holodeck Force Field", 7);
            Core.huntMonster("dreadspace", "Undead Star Ranger", "Holodeck EbilCorp AI");
            Core.huntMonster("dreadspace", "Undead Space Marine", "Holodeck Projector", 7);
            Core.huntMonster("dreadspace", "Cyber Horg", "Holodeck Power Source");
            Core.ensureComplete(4269);
        }

        //Gorn in 60 Seconds (4270)
        if (!Story.questProgression(4270)) {
            Core.ensureAccept(4270);
            Core.huntMonster("dreadspace", "Dra'gorn", "Bamboo Tube", 1);
            Core.huntMonster("dreadspace", "Dra'gorn", "Pointed Diamonds", 10);
            Core.huntMonster("dreadspace", "Dra'gorn", "Black Powder", 10);
            Core.ensureComplete(4270);
        }

        //Captain Kirkland (4271)
        if (!Story.questProgression(4271)) {
            Core.ensureAccept(4271);
            Core.huntMonster("dreadspace", "Red Trobble", "Red Space Fabric", 6, { isTemp: false, log: false });
            Adv.buyItem("dreadspace", 1010, "Red Space Crew Shirt");
            Core.ensureComplete(4271);
        }

        //Cowboyz vs Alienz (4273)
        if (!Story.questProgression(4273)) {
            Core.ensureAccept(4273);
            Core.huntMonster("dreadspace", "Holo Gunslinger", "Cowboy defeated", 5, { log: false });
            Core.huntMonster("dreadspace", "Vaderix", "Alien defeated", 5, { log: false });
            Core.ensureComplete(4273);
        }
        //Recover J6's Head! (4272)
        if (!Story.questProgression(4272)) {
            Core.ensureAccept(4272);
            Core.huntMonster("dreadspace", "Holo Gunslinger", "J6's Helmet");
            Core.ensureComplete(4272);
            if (ReplicatorMerge) {
                return;
            }
        }

        //Titanic II (4274)
        Story.killQuest(4274, "dreadspace", "Jack");

        //Holo-Yulgar's (4275)
        Story.killQuest(4275, "dreadspace", "Old Twilly");

        //Holodeck Survival Rate (4276)
        Story.killQuest(4276, "dreadspace", "Hologram Turret");

        //Space Paladin Survivors!? (4277)
        Story.mapItemQuest(4277, "dreadspace", 3423, 6);

        //Trouble with Trobbles (4278)
        Story.killQuest(4278, "dreadspace", "Trobble");

        //THEY LIVE! (4279)
        Story.killQuest(4279, "dreadspace", "Defense Turret");

        //AlienZ (4280)
        Story.killQuest(4280, "dreadspace", "Vaderix");

        //DO NOT OPEN - Space Door Codes (4281)
        Story.killQuest(4281, "dreadspace", "Undead Space Marine");

        //The Search for Spork (4282)
        Story.killQuest(4282, "dreadspace", "Undead Space Marine");

        //Crew Cut (4283)
        if (!Story.questProgression(4283)) {
            Core.ensureAccept(4283);
            Core.huntMonster("dreadspace", "Undead Space Marine", "Undead Space Marine defeated", 3);
            Core.huntMonster("dreadspace", "Undead Space Warrior", "Undead Space Warrior defeated", 3);
            Core.huntMonster("dreadspace", "Cyber Horg", "Cyber Horg defeated", 3);
            Core.huntMonster("dreadspace", "Vaderix", "Vaderix defeated", 7);
            Core.ensureComplete(4283);
        }

        //Restore Life Support (4284)
        Story.killQuest(4284, "dreadspace", "Cyber Horg");

        //DREAD SPACE BOSS (4285)
        Story.killQuest(4285, "dreadspace", "Dread Space");

        //DREADER SPACE!!! (4286)
        Story.killQuest(4286, "dreadspace", "Cyborg Beast Core");
    }

    deadmoor(): void {
        if (Core.isCompletedBefore(4307)) {
            return;
        }

        Story.preLoad(this.deadmoor);

        // 4296 A Walking Nightmare
        Story.mapItemQuest(4296, "deadmoor", 3457);

        // 4297 A Ritual is Required
        Story.killQuest(4297, "deadmoor", "Deadmoor Wraith");

        // 4298 A Spider's Finger
        Story.killQuest(4298, "deadmoor", "Toxic Souleater");

        // 4299 Well Done
        Story.mapItemQuest(4299, "deadmoor", 3448);

        // 4300 Fighting A Horse
        Story.killQuest(4300, "deadmoor", "Nightmare");

        // 4301 Wake the Dead
        Story.mapItemQuest(4301, "deadmoor", 3459);

        // 4302 Bone Breaking Bonds
        Story.mapItemQuest(4302, "deadmoor", [3449, 3450, 3451, 3452, 3453, 3454]);

        // 4303 Last Shreds of Humanity
        Story.killQuest(4303, "deadmoor", "Toxic Souleater");

        // 4304 Consecrated Ground
        Story.mapItemQuest(4304, "deadmoor", 3455, 7);

        // 4305 Geist
        Story.killQuest(4305, "deadmoor", "Geist");

        // 4306 The Last Caretaker
        Story.mapItemQuest(4306, "deadmoor", [3458, 3460, 3461, 3462, 3463, 3464, 3465]);

        // 4307 The Confrontation
        Story.killQuest(4307, "deadmoor", "Banshee Mallora");
    }

    beleen(ChaosFuzzyUnlockOnly = false): void {
        //Quest Progress Check
        if (Core.isCompletedBefore(4330)) {
            return;
        }

        //Needed AddDrop
        Core.addDrop("Chaos Fuzzies");

        //Drearia on Demand - 4312
        if (!Story.questProgression(4312)) {
            Story.mapItemQuest(4312, "Drearia", 3485);
            Core.killMonster("drearia", "r6", "Left", "Dark Makai", "Dark Makai Notes");
            Core.killMonster("drearia", "r6", "Left", "Evil Elemental", "Evil Elemental Notes");
            Core.killMonster("drearia", "r6", "Left", "Green Rat", "Green Rat Notes");
            Core.ensureComplete(4312);
        }
        //Plant a Little Seed and Nature Grows - 4313
        Story.killQuest(4313, "Drearia", "Dark Makai");

        //A Key Discovery - 4314
        if (!Story.questProgression(4314)) {
            Core.ensureAccept(4314);
            Core.getMapItem(3466, 1, "Drearia");
            Core.huntMonster("drearia", "Dark Makai", "Front Door Key", 1);
            Core.ensureComplete(4314);
        }

        //Creepy House... Yay! - 4315
        if (!Story.questProgression(4315)) {
            Core.ensureAccept(4315);
            Core.getMapItem(3467, 1, "Drearia");
            Core.huntMonster("drearia", "Green Rat", "Defeated Varmint", 3);
            Core.ensureComplete(4315);
        }

        //Sparkling Books - 4316
        Story.mapItemQuest(4316, "Drearia", 3468);

        //A Paladin in Peril - 4317
        Story.mapItemQuest(4317, "SwordHavenPink", 3469);

        //Pink Stinks! - 4318
        if (!Story.questProgression(4318)) {
            Core.ensureAccept(4318);
            Core.getMapItem(3486, 5, "SwordHavenPink");
            Core.huntMonster("swordhavenpink", "Pink Slime", "Squished Pink Slime", 8);
            Core.ensureComplete(4318);
        }

        //Rats, RATS! - 4319
        Story.killQuest(4319, "SewerPink", "Pink Rat");

        //AdventureQuest Worm - 4320
        Story.killQuest(4320, "SewerPink", "Cutie Grumbley");

        //UnBEARable Sight - 4321
        if (!Story.questProgression(4321)) {
            Core.ensureAccept(4321);
            Core.getMapItem(3470, 1, "PineWoodPink");
            Core.huntMonster("pinewoodpink", "Pink Grizzly", "Pink Teddy Bear", 5);
            Core.ensureComplete(4321);
        }

        //Too Much Pink in Pinewood! - 4322
        if (!Story.questProgression(4322)) {
            Core.ensureAccept(4322);
            Core.getMapItem(3471, 5, "PineWoodPink");
            Core.huntMonster("pinewoodpink", "Pink Shell Turtle", "Bows", 5);
            Core.ensureComplete(4322);
        }

        //Kill Sparkletooth - 4323
        Story.killQuest(4323, "PineWoodPink", "Sparkletooth");

        //The Citadorable Plot - 4324
        Story.mapItemQuest(4324, "Citadel", 3472);
        if (ChaosFuzzyUnlockOnly) {
            return;
        }

        //Fuzzy Run Minigame - 4325
        if (!Core.isCompletedBefore(4325)) {
            Core.ensureAccept(4325);
            while (!bot.shouldExit && !Core.checkInventory("Chaos Fuzzies", 30)) {
                Core.getMapItem(3481, undefined, "Citadel");
            }
            Core.ensureComplete(4325);
        }

        //Fluffy Clouds - 4326
        Story.killQuest(4326, "Pastelia", "Happy Cloud");

        //Super Model Makai Hair - 4327
        Story.killQuest(4327, "Pastelia", "Cutie Makai");

        //Squeaky Business - 4328
        Story.killQuest(4328, "Pastelia", "Pink Rat");

        //The Queen's Offering - 4329
        Story.mapItemQuest(4329, "Pastelia", 3473);

        //Boss Fight Beleen! - 4330
        Story.killQuest(4330, "Pastelia", "Chaos Queen Beleen");
    }
}
