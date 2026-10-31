/*
name: null
description: null
tags: null
*/
// Port of Scripts/Story/7DeadlyDragons/Core7DD.cs.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class Core7DD {
    complete7DD(): void {
        this.gluttony();
        this.pride();
        this.greed();
        this.sloth();
        this.lust();
        this.envy();
        this.wrath();
    }

    //#region Gluttony
    gluttony(): void {
        if (Core.isCompletedBefore(5915)) {
            return;
        }
        Core.logger("Hunting the Fire Dragon of Gluttony!");

        Story.preLoad(this.gluttony);

        // Guts for Glutes 5903
        Story.killQuest(5903, "Gluttony", "Glutus");

        // Mucus be Joking 5904
        Story.killQuest(5904, "Gluttony", "Mucus");

        // Build a Bone-a-fied Ladder 5905]
        if (!Story.questProgression(5905)) {
            Core.ensureAccept(5905);
            Core.getMapItem(5346, 2, "Gluttony");
            Core.huntMonster("gluttony", "Skeletal Slayer", "Nice Long Bones", 10);
            Core.ensureComplete(5905);
        }

        // Talk About Reflux 5906
        Story.mapItemQuest(5906, "Gluttony", 5344);

        // How'd HE get here? 5907
        Story.mapItemQuest(5907, "Gluttony", 5345);

        // Glowworms not Glowsticks 5908
        if (!Story.questProgression(5908)) {
            Core.ensureAccept(5908);
            Core.getMapItem(5347, 10, "Gluttony");
            Core.killMonster("Gluttony", "r7", "Left", "Bowel Worm", "Agitated Bowel Worm", 10);
            Core.ensureComplete(5908);
        }

        // Ossification Needed 5909
        if (!Story.questProgression(5909)) {
            Core.ensureAccept(5909);
            Core.killMonster("Gluttony", "r6", "Left", "Bile", "Falgar's Bones", 9);
            Core.ensureComplete(5909);
        }

        // Eye Need Bones 5910
        if (!Story.questProgression(5910)) {
            Core.ensureAccept(5910);
            Core.getMapItem(5348, 5, "Gluttony");
            Core.huntMonster("gluttony", "Skeletal Slayer", "Replacement Eyes", 2);
            Core.ensureComplete(5910);
        }

        // Bile Burns 5911
        if (!Story.questProgression(5911)) {
            Core.ensureAccept(5911);
            Core.huntMonster("gluttony", "Bowel Worm", "Bowel Worm Slain", 5);
            Core.huntMonster("gluttony", "Bile", "Bile Slain", 5);
            Core.ensureComplete(5911);
        }

        // Find the Chest 5912
        Story.mapItemQuest(5912, "Gluttony", 5349);

        // We Need the Key 5913
        Story.killQuest(5913, "Gluttony", "Giant Tapeworm");

        // Cha Cha Cha 5914
        Story.mapItemQuest(5914, "Gluttony", 5350);

        // Glutus, Take 2 5915
        Story.killQuest(5915, "Gluttony", "Deflated Glutus");
    }
    //#endregion Gluttony
    //#region Pride
    pride(): void {
        if (Core.isCompletedBefore(5926)) {
            return;
        }

        Core.logger("Hunting the Energy Dragon of Pride!");

        Story.preLoad(this.pride);

        // Defeat the Drakel 5917
        Story.killQuest(5917, "Pride", "Storm Drakel");

        // Don’t Get Zapped! 5918
        Story.killQuest(5918, "Pride", "Ball Lightning");

        // Get Grounded 5919
        Story.killQuest(5919, "Pride", "Rubber Treeant");

        // Get the Key 5920
        Story.killQuest(5920, "Pride", "Cellar Guard");

        // Get the Boots 5921
        Story.mapItemQuest(5921, "Pride", 5351);
        Story.mapItemQuest(5921, "Pride", 5352, 6);

        // Make Lightning Rods 5922
        if (!Story.questProgression(5922)) {
            Core.ensureAccept(5922);
            Core.getMapItem(5353, 8, "Pride");
            Core.huntMonster("pride", "Storm Drakel", "Electric Prod", 8);
            Core.ensureComplete(5922);
        }

        // Free the Villagers 5923
        if (!Story.questProgression(5923)) {
            Core.ensureAccept(5923);
            Core.getMapItem(5354, 4, "Pride");
            Core.huntMonster("pride", "Drakel Guard", "Drakel Key", 4);
            Core.ensureComplete(5923);
        }

        // Open the Gate 5924
        if (!Story.questProgression(5924)) {
            Core.ensureAccept(5924);
            Core.getMapItem(5355, 1, "Pride");
            Core.huntMonster("pride", "Elite Guard", "Gate Key", 1);
            Core.ensureComplete(5924);
        }

        // Fight Your Way Throug 5925
        if (!Story.questProgression(5925)) {
            Core.ensureAccept(5925);
            Core.getMapItem(5356, 1, "Pride");
            Core.huntMonster("pride", "Storm Drakel", "Storm Drakel Slain", 12);
            Core.ensureComplete(5925);
        }

        // Defeat Valsarian 5926
        Story.killQuest(5926, "Pride", "Valsarian");
    }
    //#endregion Pride
    //#region Greed
    greed(): void {
        if (Core.isCompletedBefore(5943)) {
            return;
        }

        Core.logger("Hunting the Ice Dragon of Greed!");

        Story.preLoad(this.greed);

        // Looting is for Sneevils 5934
        Story.killQuest(5934, "Greed", "Sneevil Looter");

        // Jumping in Puddles 5935
        Story.mapItemQuest(5935, "Greed", 5372, undefined, { autoCompleteQuest: false });

        // Pick the Right Chest 5936
        Story.mapItemQuest(5936, "Greed", 5373);

        // Gelatin is Nasty 5937
        Story.killQuest(5937, "Greed", "Jelly-Like Cube");

        // Explore the Cave 5938
        Story.mapItemQuest(5938, "Greed", 5374, 5);

        // Disarm the Trap 5939
        Story.mapItemQuest(5939, "Greed", [5377, 5378]);

        // Crystal-eyes 5940
        if (!Story.questProgression(5940)) {
            Core.ensureAccept(5940);
            Core.huntMonster("greed", "Ice Crystal", "Ice Crystal Slain", 5);
            Core.huntMonster("greed", "Glacial Horror", "Glacial Horror Slain", 10);
            Core.ensureComplete(5940);
        }

        // Go-bolds? 5941
        if (!Story.questProgression(5941)) {
            Core.ensureAccept(5941);
            Core.getMapItem(5375, 5, "Greed");
            Core.huntMonster("greed", "Kobold", "Recovered Gold", 10);
            Core.ensureComplete(5941);
        }

        // Follow the Trail 5942
        Story.mapItemQuest(5942, "Greed", 5376, 3);

        // Get Rid of Greed 5943
        Story.killQuest(5943, "Greed", "Goregold");
    }
    sloth(): void {
        if (Core.isCompletedBefore(5959)) return;

        Core.logger("Hunting the Slime Dragon of Sloth!");

        Story.preLoad(this.sloth);

        this.hazMatSuit();

        // Are There Any Survivors? 5945
        if (!Story.questProgression(5945)) {
            Core.ensureAccept(5945);
            Core.getMapItem(5382, 1, "Sloth");
            Core.huntMonster("sloth", "Plague Zombie", "Plague Zombie Defeated", 10);
            Core.ensureComplete(5945);
        }

        // Gathering Samples 5946
        if (!Story.questProgression(5946)) {
            Core.ensureAccept(5946);
            Core.huntMonster("sloth", "SnotGoblin", "Snot Sample", 6);
            Core.huntMonster("sloth", "Wandering Plague", "Plague Sample", 6);
            Core.ensureComplete(5946);
        }

        // Find a ‘Volunteer’ 5947
        Story.killQuest(5947, "Sloth", "Plague Zombie");

        // Cure the Volunteer 5948
        Story.mapItemQuest(5948, "Sloth", 5387);

        // Herbal Help 5949
        Story.killQuest(5949, "Sloth", "Marsh Thing");

        // Re-heal 5950
        Story.mapItemQuest(5950, "Sloth", 5383, 8);

        // Let's Try That Again 5951
        Story.mapItemQuest(5951, "Sloth", 5389);

        // One More Time 5952
        if (!Story.questProgression(5952)) {
            Core.ensureAccept(5952);
            Core.buyItem("Dragonhame", 865, "Airther Vitae");
            Core.buyItem("embersea", 1100, 1749);
            Core.ensureComplete(5952);
        }

        // Who’s Up for Round 3 5953
        Story.mapItemQuest(5953, "Sloth", 5391);

        // Cure the Villagers 5954
        Story.killQuest(5954, "Sloth", "Plague Zombie");

        // Gotta Clean Up 5955
        Story.mapItemQuest(5955, "Sloth", 5384, 10);

        // Clear the Castellum 5956
        if (!Story.questProgression(5956)) {
            Core.ensureAccept(5956);
            Core.getMapItem(5385, 1, "Sloth");
            Core.huntMonster("sloth", "SnotGoblin Prime", "Snotgoblin Prime Defeated", 1);
            Core.ensureComplete(5956);
        }

        // Get rid of Phlegnn 5957
        Story.killQuest(5957, "Sloth", "Phlegnn");

        // Cured is NOT GOOD 5958
        Story.killQuest(5958, "Sloth", "Cured Phlegnn");

        // Actual Sloth Dragon 5960
        Story.killQuest(5960, "Sloth", "Actual Sloth Dragon");

        // Mutated Plague 5959
        Story.killQuest(5959, "Sloth", "Mutated Plague");
    }
    //#endregion Sloth
    //#region Lust
    lust(): void {
        if (Core.isCompletedBefore(5976)) {
            return;
        }

        Core.logger("Hunting the Dragon of Lust!");

        Story.preLoad(this.lust);

        // Hopelessly Devoted 5961
        Story.killQuest(5961, "Lust", "Devoted Admirer");

        // Fighting the Feeling 5962
        Story.mapItemQuest(5962, "Lust", [5405, 5406, 5407, 5408, 5409]);

        // Love Potion #9.1 5963
        Story.killQuest(5963, "Lust", "Golden Vase");

        // Leather is Better 5964
        Story.killQuest(5964, "Lust", "Enamored Guard");

        // Gird your Loins 5965
        if (!Story.questProgression(5965)) {
            Core.ensureAccept(5965);
            Core.getMapItems(
                [
                    [5410, 1],
                    [5411, 1],
                ],
                "Lust",
            );
            Core.huntMonster("lust", "Devoted Admirer", "Spell Broken", 8);
            Core.ensureComplete(5965);
        }

        // Get the Keys 5966
        Story.killQuest(5966, "Lust", "Enamored Guard");

        // Open the Cages 5967
        Story.mapItemQuest(5967, "Lust", 5412, 5);

        // Get Past the Guards 5968
        if (!Story.questProgression(5968)) {
            Core.ensureAccept(5968);
            Core.getMapItem(5413, 1, "Lust");
            Core.huntMonster("lust", "Elite Guard", "Elite Guards Defeated", 9);
            Core.ensureComplete(5968);
        }

        // Viscyra’lly Yours 5969
        if (!Story.questProgression(5969)) {
            Core.ensureAccept(5969);
            Core.getMapItem(5414, 1, "Lust");
            Core.huntMonster("lust", "Viscyra", "Viscyra's Key", 1);
            Core.ensureComplete(5969);
        }

        // Lascivia’sness 5970
        Story.killQuest(5970, "Lust", "Lascivia");

        // Talk to the Guards 5971
        Story.killQuest(5971, "Lust", "Elite Guard");

        // Lascivia Stunk Pretty 5972
        if (!Story.questProgression(5972)) {
            Core.ensureAccept(5972);
            Core.huntMonster("lust", "Golden Vase", "Gold Vase", 1);
            Core.huntMonster("lust", "Golden Vase", 'Lascivia\'s "Smell-Good"', 5);
            Core.ensureComplete(5972);
        }

        // You Broke It, You Fix It 5973
        Story.killQuest(5973, "Lust", "Devoted Admirer");

        // Elite Energy 5974
        if (!Story.questProgression(5974)) {
            Core.ensureAccept(5974);
            Core.getMapItem(5415, 8, "Lust");
            Core.huntMonster("lust", "Elite Guard", "Special Energy Drink", 3);
            Core.ensureComplete(5974);
        }

        // No Pillow Unturned 5975
        Story.mapItemQuest(5975, "Lust", [5416, 5417]);

        // Take Down Killek 5976
        Story.killQuest(5976, "Lust", "Killek Deadchewer");
    }
    //#endregion Lust
    //#region Envy
    envy(): void {
        if (Core.isCompletedBefore(6005)) {
            return;
        }

        Core.logger("Hunting the Darkness Dragon of Envy!");

        Story.preLoad(this.envy);

        // Talk to the Guard 5983
        Story.mapItemQuest(5983, "DragonCrown", 5420);

        // Talk to the Villager 5984
        Story.mapItemQuest(5984, "DragonCrown", 5421);

        // Fire and Ice 5985
        if (!Story.questProgression(5985)) {
            Core.ensureAccept(5985);
            Core.getMapItem(5422, 6, "DragonCrown");
            Core.huntMonster("dragoncrown", "Fire Sprite", "Fire Sprites Slain", 6);
            Core.ensureComplete(5985);
        }

        // Round ‘em Up 5986
        if (!Story.questProgression(5986)) {
            Core.ensureAccept(5986);
            Core.huntMonster("dragoncrown", "Llama", "Llamas Rustled", 5);
            Core.huntMonster("dragoncrown", "Rampaging Boar", "Boars Rustled", 5);
            Core.ensureComplete(5986);
        }

        // Get Rockin’ 5987
        if (!Story.questProgression(5987)) {
            Core.ensureAccept(5987);
            Core.huntMonster("dragoncrown", "Rock Elemental", "Strong Rocks", 10);
            Core.huntMonster("dragoncrown", "Earth Elemental", "Sticky Mud", 5);
            Core.ensureComplete(5987);
        }

        // Stop Fightin’ 5988
        Story.mapItemQuest(5988, "DragonCrown", 5423);

        // Find Riddrug 5989
        Story.mapItemQuest(5989, "DragonCrown", 5424);

        // Defeat The Red Champion 5990
        Story.killQuest(5990, "DragonCrown", "Torgat");

        // Defeat The Ice Champion 5991
        Story.killQuest(5991, "DragonCrown", "Fressa");

        // Defeat The Undead Champion 5992
        Story.killQuest(5992, "DragonCrown", "Radroth");

        // Defeat The Water Champion 5993
        Story.killQuest(5993, "DragonCrown", "Nizex");

        // Defeat The Wind Champion 5994
        Story.killQuest(5994, "DragonCrown", "Tathu");

        // Defeat The Yokai Champion 5995
        Story.killQuest(5995, "DragonCrown", "Lanshen");

        // Defeat The Green Champion 5996
        Story.killQuest(5996, "DragonCrown", "Ashax");

        // Defeat The Faerie Champion 5997
        Story.killQuest(5997, "DragonCrown", "Letori");

        // Defeat The Chaos Champion 5998
        Story.killQuest(5998, "DragonCrown", "Nayzol");

        // Defeat the Void Champion 5999
        Story.killQuest(5999, "DragonCrown", "Zathas");

        // Argo’s Not Stopping Us! 6000
        bot.log("please wait whilst it hunts out of the cutscene cell...");
        Story.killQuest(6000, "DragonCrown", "Argo");

        // Defeat Ukki, The 1st Sentinel 6001
        Story.killQuest(6001, "Maloth", "Ukki");

        // Defeat Kagan, The 2nd Guardian 6002
        Story.killQuest(6002, "Maloth", "Kagan");

        // Defeat Golgar, The 3rd Guardian 6003
        Story.killQuest(6003, "Maloth", "Golgar");

        // Hand over the Entry Code 6004
        if (!Story.questProgression(6004)) {
            Core.ensureAccept(6004);
            Core.huntMonster("maloth", "Golgar", "Final Word", 1);
            Core.huntMonster("maloth", "Castle Guard", "First Word", 1);
            Core.huntMonster("maloth", "Scroll Keeper", "Second Word", 1);
            Core.huntMonster("maloth", "Nervous Serf", "Third Word", 1);
            Core.huntMonster("maloth", "Locked Chest", "Fourth Word", 1);
            Core.ensureComplete(6004);
        }

        // Confront the Dragon King 6005
        Story.killQuest(6005, "Maloth", "Maloth");
    }
    //#endregion Envy
    //#region Wrath
    wrath(): void {
        if (Core.isCompletedBefore(6170)) {
            return;
        }

        Core.logger("Hunting the Dracolich of Wrath!");

        Story.preLoad(this.wrath);

        // Decimate the Horde 6110
        if (!Story.questProgression(6110)) {
            Core.ensureAccept(6110);
            Core.huntMonster("wrath", "Fishbones", "Fishbones Slain", 5);
            Core.huntMonster("wrath", "Bone Terror", "Bone Terror Slain", 5);
            Core.ensureComplete(6110);
        }

        // Douse with Flames 6111
        Story.killQuest(6111, "Wrath", "Dark Fire");

        // Grenades of AWE 6112
        if (!Story.questProgression(6112)) {
            Core.ensureAccept(6112);
            Core.getMapItem(5541, 6, "Wrath");
            Core.huntMonster("wrath", "Bone Terror", "Bone Shrapnel", 6);
            Core.ensureComplete(6112);
        }

        // The Final Ingredient 6113
        if (!Story.questProgression(6113)) {
            if (!Core.checkInventory("Holy Wasabi")) {
                Core.addDrop("Holy Wasabi");
                Core.ensureAccept(1075);

                Core.equipClass(ClassType.Farm);
                Core.huntMonster("doomwood", "Doomwood Ectomancer", "Dried Wasabi Powder", 4);
                Core.getMapItem(428, 1, "lightguard");
                Core.join("lightguard");

                Core.ensureComplete(1075);
                bot.wait.forPickup("Holy Wasabi");
            }
            Core.ensureComplete(6113);
        }

        // Count Not to Four 6114
        Story.mapItemQuest(6114, "Wrath", 5542, 6);

        // Talk to Captain Rhubarb 6115
        Story.mapItemQuest(6115, "Wrath", 5540);

        // Find the Manifest 6116
        if (!Story.questProgression(6116)) {
            Core.ensureAccept(6116);
            Core.getMapItem(5544, 1, "Wrath");
            Core.huntMonster("wrath", "Undead Pirate", "Undead Pirates Slain", 8);
            Core.ensureComplete(6116);
        }

        // Get the Cargo Hold Key 6117
        if (!Story.questProgression(6117)) {
            Core.ensureAccept(6117);
            Core.huntMonster("wrath", "Mutineer", "Mutineers Slain", 8);
            Core.huntMonster("wrath", "Mutineer", "Cargo Hold Key", 1);
            Core.ensureComplete(6117);
        }

        // Find the Jewel 6118
        Story.mapItemQuest(6118, "Wrath", 5545);

        // Defeat Droghor the Screecher! 6119
        Story.killQuest(6119, "Wrath", "Droghor");

        // Defeat Gorhorath! 6120
        Story.killQuest(6120, "Wrath", "Gorgorath");

        // Navigate the Maze 6163
        if (!Story.questProgression(6163)) {
            Core.ensureAccept(6163);
            Core.getMapItem(5587, 1, "Dragonbone");
            Core.huntMonster("dragonbone", "Bone Dragonling", "Bone Dragonlings Slain", 5);
            Core.huntMonster("dragonbone", "Dark Fire", "Dark Fire Extinguished", 5);
            Core.ensureComplete(6163);
        }

        // Get a Clue 6164
        Story.killQuest(6164, "Dragonbone", "Bone Terror");

        // Heart of a Dracolich 6165
        Story.killQuest(6165, "Dragonbone", "Bone Wyvern");

        // Open the Door 6166
        Story.mapItemQuest(6166, "Dragonbone", 5588);

        // Find the Jewel 6167
        Story.mapItemQuest(6167, "Dragonbone", 5589);

        // Get to the Lair 6168
        Story.mapItemQuest(6168, "Dragonbone", 5590);

        // Unlock the Door 6169
        if (!Story.questProgression(6169)) {
            Core.ensureAccept(6169);
            Core.getMapItem(5591, 1, "Dragonbone");
            Core.huntMonster("dragonbone", "DragonShade", "Key to the Lair", 1);
            Core.ensureComplete(6169);
        }

        // Slay Gorgorath 6170
        Story.killQuest(6170, "Dragonbone", "Gorgorath");
    }

    hazMatSuit(): void {
        if (!bot.tempInv.contains(40710)) {
            Core.logger("Suit not found");
            Core.ensureAccept(5944);
            Core.getMapItems(
                [
                    [5381, 1],
                    [5380, 1],
                ],
                "Sloth",
            );
            Core.ensureComplete(5944);
            bot.wait.forDrop("Hazmat Suit (Temp)");
            bot.wait.forPickup("Hazmat Suit (Temp)");
            bot.sleep(2500);
        } else {
            Core.logger("Suit found in Temp Inventory");
            bot.send.packet(`%xt%zm%equipItem%${bot.map.roomId}%40710%`);
            bot.sleep(2500);
        }
    }
}
