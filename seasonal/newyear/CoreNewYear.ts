/*
name: null
description: null
tags: null
*/
// Port of Scripts/Seasonal/NewYear/CoreNewYear.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class CoreNewYear {
    doAll(): void {
        if (!Core.isSeasonalMapActive("newyear")) {
            return;
        }

        this.newYear();
        this.darkSun();
        this.frostmane();
        this.everfrost();
        this.chronoPhoenix();
        this.timeRitual();
        this.chronoForge();
    }

    newYear(): void {
        if (Core.isCompletedBefore(1531) || !Core.isSeasonalMapActive("newyear")) {
            return;
        }

        Story.preLoad(this.newYear);

        //newyear

        //Circuit Breakers (463)
        Story.killQuest(463, "newyear", "Sneevil");

        //Current Affairs (464)
        Story.killQuest(464, "newyear", ["Sneevil", "Sneevil"]);

        //Not Finished Yet-i (465)
        Story.killQuest(465, "newyear", "Ice Master Yeti");

        //newyearlab

        //Is the Area as Big Inside as Outside? (1524)
        Story.mapItemQuest(1524, "newyearlab", 762);

        //The Final Hour? (1525)
        Story.killQuest(1525, "newyearlab", "Chaos-Saw Sneevil");

        //See-Sawing Through Time (1526)
        Story.mapItemQuest(1526, "newyearlab", 763, 6);

        //A Crack in Time Saves More Than Nine (1527)
        Story.killQuest(1527, "newyearlab", ["Chaos Rhino Beetle", "Chaos Rhino Beetle"]);

        //Time Bashes On (1528)
        Story.killQuest(1528, "newyearlab", "Chaorrupted Polar Bear");

        //SHUTDOWN Sequence (1530)
        Story.mapItemQuest(1530, "newyearlab", [764, 765, 766, 767]);

        //Chronomancy and Chaos (1531)
        Story.killQuest(1531, "newyearlab", "Iadoa");
    }

    darkSun(): void {
        if (Core.isCompletedBefore(2597) || !Core.isSeasonalMapActive("darksun")) {
            return;
        }

        Story.preLoad(this.darkSun);

        //Power the Sun 2589
        Story.mapItemQuest(2589, "darkoviaforest", 1595, 3);
        Story.mapItemQuest(2589, "darksun", 1596, 4);

        //Interrogate Night Creatures 2590
        if (!Story.questProgression(2590)) {
            Core.ensureAccept(2590);
            Core.killMonster("lycanwar", "War", "Left", "*", "Raskar's Location");
            Core.killMonster("lycanwar", "War", "Left", "*", "Jealous Whispers");
            Core.killMonster("vampirewar", "War", "Left", "*", "Knowledge about Jinella");
            Core.killMonster("vampirewar", "War", "Left", "*", "Unfounded Rumors");
            Core.ensureComplete(2590);
        }

        //Nocturan Adept Battle 2591
        Story.killQuest(2591, "darksun", "Aku");

        //Fight the Darkness 2592
        if (!Story.questProgression(2592)) {
            Core.ensureAccept(2592);
            Core.getMapItem(1604, 1, "darkoviaforest");
            Core.huntMonster("darkoviagrave", "Albino Bat ", "Spy Slain", 7);
            Core.ensureComplete(2592);
        }

        //Cloaked in Darkness 2593
        Story.mapItemQuest(2593, "darksun", 1597);

        //Escape to Freedom 2594
        if (!Story.questProgression(2594)) {
            Core.ensureAccept(2594);
            Core.huntMonster("darkoviaforest", "Blood Maggot", "Blood Maggot Slain", 4);
            Core.huntMonster("darkoviaforest", "Dire Wolf", "Dire Wolf Slain", 4);
            Core.ensureComplete(2594);
        }

        //Shine a Light on Truth 2595
        Story.mapItemQuest(2595, "darksun", 1598);

        //Weave Light into Dark 2596
        if (!Story.questProgression(2596)) {
            Core.ensureAccept(2596);
            Core.getMapItem(1599, 6, "darksun");
            Core.huntMonster("darkoviagrave", "Skeletal Fire Mage", "Solar Flare", 5);
            Core.ensureComplete(2596);
        }

        //Battle for a New Start 2597
        Story.killQuest(2597, "darksun", "Raskar");
    }

    frostmane(): void {
        if (Core.isCompletedBefore(3281) || !Core.isSeasonalMapActive("frostmane")) {
            return;
        }

        Story.preLoad(this.frostmane);

        //Wood & Herbs 3271
        if (!Story.questProgression(3271)) {
            Core.ensureAccept(3271);
            Core.huntMonster("frostmane", "Pine Troll", "Lunar Herbs", 5);
            Core.huntMonster("frostmane", "Pine Troll", "Moon Wood", 5);
            Core.ensureComplete(3271);
        }

        //That Should Get His Attention 3272
        Story.killQuest(3272, "frostmane", "Arctic Wolf");

        //Calling Frostmane 3273
        Story.mapItemQuest(3273, "frostmane", 2326);

        //Nightmare Juice, Om Nom Nom 3274
        Story.killQuest(3274, "frostmane", "Abandoned Dolly");

        //Gentle Persuasion 3275
        Story.killQuest(3275, "frostmane", "Abandoned Dolly");

        //Breaking & Entering 3276
        Story.killQuest(3276, "frostmane", "Shadow Person");

        //The Hills Are Alive 3277
        Story.killQuest(3277, "frostmane", "Rock");

        //A Geode for Geo 3278
        Story.killQuest(3278, "frostmane", "Rock");

        //Bribery 3279
        Story.mapItemQuest(3279, "frostmane", 2325);

        //Defeat Frostmane's Nightmare 3280
        Story.killQuest(3280, "frostmane", "Nightmare Frostmane");

        //Defeat Frostmane's Ultra Nightmare 3281
        Story.killQuest(3281, "frostmane", "Ultra Nightmare Frostmane");
    }

    everfrost(): void {
        if (Core.isCompletedBefore(6152) || !Core.isSeasonalMapActive("everfrost")) {
            return;
        }

        Story.preLoad(this.everfrost);

        //Get some Pelts 6144
        Story.killQuest(6144, "everfrost", "Arctic Wolf");

        //Find the Sled 6145
        Story.mapItemQuest(6145, "everfrost", [5565, 5566]);
        Story.mapItemQuest(6145, "everfrost", 5567, 2);

        //It's Sledding Time 6146
        Story.mapItemQuest(6146, "everfrost", 5568);

        //Gather Peppers 6147
        Story.killQuest(6147, "everfrost", "Ice Spitter");

        //Wood for Moknak 6148
        Story.killQuest(6148, "everfrost", "Frozen Treeant");

        //Cross the Ice 6149
        Story.mapItemQuest(6149, "everfrost", 5569);

        //Smash the Shards 6150
        Story.killQuest(6150, "everfrost", "Chill Shard");

        //Make it to the Top 6151
        Story.mapItemQuest(6151, "everfrost", 5570, 4);
        Story.killQuest(6151, "everfrost", "Ice Golem");

        //Defeat Chillbite! 6152
        Story.killQuest(6152, "everfrost", "Chillbite");
    }

    chronoPhoenix(): void {
        if (Core.isCompletedBefore(7275) || !Core.isSeasonalMapActive("chronophoenix")) {
            return;
        }

        Story.preLoad(this.chronoPhoenix);

        //Put out the Fire 7265
        Story.killQuest(7265, "chronophoenix", "Phoenix Fire");

        //Assist the Assistants 7266
        Story.killQuest(7266, "chronophoenix", "Chrono-Assistant");

        //Energy for Repairs 7267
        Story.killQuest(7267, "chronophoenix", "Errant Spacetime Energy");

        //Stabilize the Rift 7268
        Story.mapItemQuest(7268, "chronophoenix", 6905, 5);

        //Freezies 7269
        Story.killQuest(7269, "chronophoenix", "Frost Elemental");

        //Freeze the Energy 7270
        Story.killQuest(7270, "chronophoenix", "Errant Spacetime Energy");

        //More Flames! 7271
        if (!Story.questProgression(7271)) {
            Core.ensureAccept(7271);
            Core.killMonster("chronophoenix", "r5", "Left", "Phoenix Fire", "Fire Extinguished", 10);
            Core.ensureComplete(7271);
        }

        //Find the Phoenix 7272
        Story.mapItemQuest(7272, "chronophoenix", 6906);

        //Close out the Year 7273
        Story.killQuest(7273, "chronophoenix", "2019");

        //Freeze the Phoenix 7274
        Story.killQuest(7274, "chronophoenix", "Chrono-Phoenix");

        //Head Outside 7275
        Story.mapItemQuest(7275, "chronophoenix", 6907);
    }

    timeRitual(): void {
        if (Core.isCompletedBefore(7867) || !Core.isSeasonalMapActive("timeritual")) {
            return;
        }

        Story.preLoad(this.timeRitual);

        //Chronomancing the Stone 7860
        Story.killQuest(7860, "bludrut", "Rock Elemental");

        //Hourglass Half Full 7861
        Story.killQuest(7861, "sandsea", "Bupers Camel");

        //Quartz Past Twelve 7862
        Story.killQuest(7862, "undergroundlabb", "Window");

        //Spring Forward a Few Minutes 7863
        Story.killQuest(7863, "thespan", "Shadowscythe");

        //A Nickel for Everytime That Happened 7864
        Story.killQuest(7864, "mountainpath", "Ore Balboa");

        //Back to the Present 7865
        Story.killQuest(7865, "worldsoul", "Radioactive Hydra");

        //Stop Au'eir 7866
        Story.killQuest(7866, "timeritual", "Au'eir");

        //Defeat Chronocide 7867
        Story.killQuest(7867, "timeritual", "Chronocide");
    }

    chronoForge(): void {
        if (Core.isCompletedBefore(9536) || !Core.isSeasonalMapActive("chronogem")) {
            return;
        }

        Story.preLoad(this.chronoForge);

        Core.equipClass(ClassType.Farm);
        // Raw Gems (9533)
        if (!Story.questProgression(9533)) {
            Core.ensureAccept(9533);
            Core.huntMonster("earthstorm", "Ruby Golem", "Uncut Ruby", 4);
            Core.huntMonster("earthstorm", "Sapphire Golem", "Uncut Sapphire", 4);
            Core.huntMonster("earthstorm", "Diamond Golem", "Uncut Diamond", 4);
            Core.huntMonster("earthstorm", "Emerald Golem", "Uncut Emerald", 4);
            Core.ensureComplete(9533);
        }

        // Rest in Riches (9534)
        if (!Story.questProgression(9534)) {
            Core.ensureAccept(9534);
            Core.huntMonster("battleunderc", "Crystalized Jellyfish", "Jellyfish's Alexandrite", 6);
            Core.huntMonster("battleunderc", "Green Crystalized Undead", "Undead's Peridot", 6);
            Core.ensureComplete(9534);
        }

        // Overclocked and Timed (9535)
        if (!Story.questProgression(9535)) {
            Core.ensureAccept(9535);
            Core.huntMonster("templesiege", "Overdriven Paladin", "Paladin Runes", 6);
            Core.huntMonster("templesiege", "Light Elemental", "Light Gem", 6);
            Core.ensureComplete(9535);
        }

        // Jewel Bug (9536)
        if (!Core.isCompletedBefore(9536)) {
            Core.equipClass(ClassType.Farm);
            Core.equipClass(ClassType.Solo);
            Story.killQuest(9536, "chronogem", "Gem Forgemaster");
        }
    }
}
