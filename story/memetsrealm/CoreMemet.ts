/*
name: null
description: null
tags: null
*/
// Port of Scripts/Story/MemetsRealm/CoreMemet.cs.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class MemetsRealm {
    doAll(): void {
        this.beachParty();
        this.freakiTiki();
        this.moonLab();
        this.spookeasy();
        this.dreamMaster();
        this.nightmareMem();
        this.zorbasPalace();
        this.byroDax();
    }

    beachParty(): void {
        if (Core.isCompletedBefore(7009)) {
            return;
        }

        Story.preLoad(this.beachParty);

        //7000 | Sweat - tastic
        Story.killQuest(7000, "beachparty", "Solar Elemental");

        //7001 | Cool 'em Down
        Story.killQuest(7001, "beachparty", "Boiling Elemental");

        //7002 | Poor Trees.Pour Trees?
        if (!Story.questProgression(7002)) {
            Core.ensureAccept(7002);
            Core.getMapItem(6563, 7, "beachparty");
            Core.huntMonster("beachparty", "Water Elemental", "Refreshing Water", 7);
            Core.ensureComplete(7002);
        }

        //7003 | Put out the Flames
        if (!Story.questProgression(7003)) {
            Core.ensureAccept(7003);
            Core.getMapItem(6564, 8, "beachparty");
            Core.huntMonster("beachparty", "Sun Flare", "Sun Flare Slain", 8);
            Core.ensureComplete(7003);
        }

        //7004 | Sunscream
        Story.killQuest(7004, "beachparty", "Solar Elemental");

        //7005 | Whoops!
        Story.killQuest(7005, "beachparty", "Frozen Water");

        //7006 | Milk From Nuts?
        Story.killQuest(7006, "beachparty", "Palm Treeant");

        //7007 | Free Drinks
        Story.mapItemQuest(7007, "beachparty", 6565, 8);

        //7008 | Ice, Ice Maybe?
        if (!Story.questProgression(7008)) {
            Core.ensureAccept(7008);
            Core.getMapItem(6566, 8, "beachparty");
            Core.huntMonster("beachparty", "Frozen Water", "Elemental Ice Chunks", 8);
            Core.ensureComplete(7008);
        }

        //7009 | Chill Out!
        Story.killQuest(7009, "beachparty", "Steaming Dragon");

        //Quest not required -- Farming Quest
        // //7010 | Find Tokens! Win A Prize!
        // if (!Story.QuestProgression(7010))
        // {
        //     Core.EnsureAccept(7010);
        //     Core.KillMonster("beachparty", "r3", "Left", "*", "Tiki Tokens", 5, false);
        //     Core.EnsureComplete(7010);
        // }
    }

    freakiTiki(): void {
        if (Core.isCompletedBefore(5571)) {
            return;
        }

        Story.preLoad(this.freakiTiki);

        //5558 | Drink #1: the Blue Moglin
        Story.mapItemQuest(5558, "yulgar", 5034);

        //5559 | A Little Something Extra
        Story.killQuest(5559, "thespan", "Minx Fairy");

        //5560 | Mix a Blue Moglin
        Story.mapItemQuest(5560, "freakitiki", 5038);

        //5561 | Drink #2: the El Captain Rhubarb
        if (!Story.questProgression(5561)) {
            Core.ensureAccept(5561);
            Core.getMapItem(5035, 5, "freakitiki");
            Core.huntMonster("freakitiki", "Spineapple", "Crushed Spineapple", 6);
            Core.huntMonster("freakitiki", "Palm Treeant", "Coconut Milk", 3);
            Core.ensureComplete(5561);
        }

        //5562 | Needs a Little Kick
        if (!Story.questProgression(5562)) {
            Core.ensureAccept(5562);
            Core.huntMonster("pirates", "Undead Pirate", "Bone Powder", 5);
            Core.huntMonster("pirates", "Undead Pirate", "Pirate Spice", 5);
            Core.ensureComplete(5562);
        }
        // if (!Story.QuestProgression(5562))
        // {
        //     Core.EnsureAccept(5562);
        //     Core.HuntMonster("pirates", "Undead Pirate", "Pirate Spice", 5);
        //     Core.HuntMonster("pirates", "Undead Pirate", "Bone Powder", 5);
        //     Core.EnsureComplete(5562);
        // }

        //5563 | Mix an El Captain Rhubarb
        Story.mapItemQuest(5563, "freakitiki", 5039);

        //5564 | Drink #3: the Blazing Beard
        if (!Story.questProgression(5564)) {
            Core.ensureAccept(5564);
            Core.getMapItem(5036, 5, "freakitiki");
            Core.huntMonster("freakitiki", "Tiki Sneak", "Tiki Sneak Venom", 3);
            Core.huntMonster("freakitiki", "Palm Treeant", "Bananas", 6);
            Core.ensureComplete(5564);
        }

        //5565 | Let’s Give It Some HEAT
        Story.killQuest(5565, "fotia", "Fotia Spirit");

        //5566 | Mix a Blazing Beard
        Story.mapItemQuest(5566, "freakitiki", 5040);

        //5567 | System Cleanse
        if (!Story.questProgression(5567)) {
            Core.ensureAccept(5567);
            Core.huntMonster("freakitiki", "Sneak Venom", "Sneak Venom Gathered", 3);
            Core.huntMonster("freakitiki", "Sugar Imp", "Sugar Imp Slain", 3);
            Core.huntMonster("freakitiki", "Spicy Heat", "Spicy Heat Slain", 3);
            Core.ensureComplete(5567);
        }

        //5568 | Down the, um, Ear Hole
        Story.mapItemQuest(5568, "freakitiki", 5037);

        //5569 | Tire Him Out!
        if (!Story.questProgression(5569)) {
            Core.ensureAccept(5569);
            Core.huntMonsterMapID("freakitiki", 22, "Subdue Memehano");
            Core.ensureComplete(5569);
            Core.logger('Completed Quest: [5569] - "Tire Him Out!"');
        }

        //5570 | Chase Him Down!
        if (!Story.questProgression(5570)) {
            Core.ensureAccept(5570);
            Core.huntMonsterMapID("freakitiki", 22, "Subdue Memehano");
            Core.ensureComplete(5570);
            Core.logger('Completed Quest: [5570] - "Chase Him Down!"');
        }

        //5571 | Get Him CALM!
        if (!Story.questProgression(5571)) {
            Core.ensureAccept(5571);
            Core.huntMonsterMapID("freakitiki", 32, "Subdue Memehano");
            Core.ensureComplete(5571);
            Core.logger('Completed Quest: [5571] - "Get Him CALM!"');
        }
    }

    moonLab(): void {
        if (Core.isCompletedBefore(6103)) {
            return;
        }

        Story.preLoad(this.moonLab);

        //Needle in a Cedar Stack (6091)
        Story.mapItemQuest(6091, "moonlab", 5523);

        //Pick the Lock (6092)
        Story.mapItemQuest(6092, "moonlab", 5524);

        //Contain the Infection (6093)
        Story.killQuest(6093, "moonlab", "Infected Rodent");

        //Gather the Reagents (6094)
        if (!Story.questProgression(6094)) {
            Core.ensureAccept(6094);
            Core.getMapItem(5527, 5, "moonlab");
            Core.huntMonster("moonlab", "Chlorine Trifluoride", "Chlorine Trifluoride", 1);
            Core.ensureComplete(6094);
        }

        //Flame On! (6095)
        if (!Story.questProgression(6095)) {
            Core.ensureAccept(6095);
            Core.getMapItem(5525, 8, "moonlab");
            Core.getMapItem(5526, 1, "moonlab");
            Core.huntMonster("moonlab", "Slime Mold", "Burn the Wandering Slime Molds", 8);
            Core.ensureComplete(6095);
        }

        //Open the Cages! (6096)
        if (!Story.questProgression(6096)) {
            Core.ensureAccept(6096);
            Core.getMapItem(5528, 8, "moonlab");
            Core.huntMonster("moonlab", "Engorged Slime Mold", "Cage Key", 8);
            Core.ensureComplete(6096);
        }

        //Get Rid of the Blockage! (6097)
        Story.killQuest(6097, "moonlab", "Infected Cat");

        //Keep on Going (6098)
        Story.mapItemQuest(6098, "moonlab", [5529, 5530]);

        //Find the Source (6099)
        if (!Story.questProgression(6099)) {
            Core.ensureAccept(6099);
            Core.getMapItem(5531, 3, "moonlab");
            Core.huntMonster("moonlab", "Mutated Slime Mold", "Mutated Slime Mold Destroyed", 6);
            Core.ensureComplete(6099);
        }

        //Find the Key (6100)
        if (!Story.questProgression(6100)) {
            Core.ensureAccept(6100);
            Core.huntMonster("moonlab", "Infected Scientist", "Infected Scientist Slain", 5);
            Core.huntMonster("moonlab", "Infected Scientist", "Storage Room Key", 1);
            Core.ensureComplete(6100);
        }

        //Clear More Mold (6101)
        Story.mapItemQuest(6101, "moonlab", [5532, 5533]);

        //Defeat the Escapee! (6102)
        Story.killQuest(6102, "moonlab", "Escaped Experiment");

        //Reveal the Nightmare (6103)
        Story.killQuest(6103, "moonlab", "Nightmare Zorbak");
    }

    spookeasy(): void {
        if (Core.isCompletedBefore(6661)) {
            return;
        }

        Story.preLoad(this.spookeasy);

        //No More Tears (6656)
        Story.killQuest(6656, "spookeasy", "Happy Cloud");

        //Everything on it is a Gas (6657)
        Story.killQuest(6657, "spookeasy", "Happy Balloon");

        //Gooooo-d Job (6658)
        Story.killQuest(6658, "spookeasy", "Nightmare Goo");

        //Hiding in the Shade (6659)
        Story.killQuest(6659, "spookeasy", "Nightmare Shade");

        //One Dream, One World (6660)
        if (!Story.questProgression(6660)) {
            Core.ensureAccept(6660);
            Core.killMonster("spookeasy", "r6", "Left", "*", "Dream Dust", 8);
            Core.ensureComplete(6660);
        }

        //A Nocturnal Vacation (6661)
        Story.killQuest(6661, "spookeasy", "Nightmare Goo");
    }

    dreamMaster(): void {
        if (Core.isCompletedBefore(6668)) {
            return;
        }

        this.spookeasy();

        Story.preLoad(this.dreamMaster);

        //Jailbreak! (6662)
        Story.killQuest(6662, "dreammaster", "Prison Wall");

        //Freedom! (6663)
        if (!Story.questProgression(6663)) {
            Core.ensureAccept(6663);
            Core.getMapItem(6176, 1, "dreammaster");
            Core.huntMonster("dreammaster", "Guard Llama", "Guards Defeated", 3);
            Core.ensureComplete(6663);
        }

        //Make the Glitter Fade (6664)
        Story.killQuest(6664, "dreammaster", "Sparkle Guard");

        //Rama Llama Ding Dong! (6665)
        Story.killQuest(6665, "dreammaster", "Guard Llama");

        //Got to get the Key (6666)
        Story.killQuest(6666, "dreammaster", "Sparkle Guard");

        //Open the Door (6667)
        Story.mapItemQuest(6667, "dreammaster", [6177, 6178]);

        //Calico Dreams (6668)
        Story.killQuest(6668, "dreammaster", "Calico Cobby");
    }

    nightmareMem(): void {
        if (Core.isCompletedBefore(4157)) {
            return;
        }

        if (!Core.isMember) {
            Core.logger("You need to be a member for complete the /nightmare questline.");
            return;
        }
        Story.preLoad(this.nightmareMem);

        //Fear of Clowns? 4143
        Story.killQuest(4143, "Nightmare", "Bobble Clown");

        //FEAR OF CLOWNS!!! 4144
        Story.killQuest(4144, "Nightmare", "Crazy Clown");

        //Fear of Spiders 4145
        Story.killQuest(4145, "Nightmare", "Castle Spider");

        //Fear of Snakes? 4146
        if (!Story.questProgression(4146)) {
            Core.ensureAccept(4146);
            Core.huntMonster("nightmare", "Wrasp", "Grappling Hook");
            Core.huntMonster("nightmare", "Sneak", "Rope");
            Core.ensureComplete(4146);
        }

        //Fear of Falling? 4147
        Story.mapItemQuest(4147, "Nightmare", 3262);

        //Fear of Germs? 4148
        Story.killQuest(4148, "Nightmare", "Germs");

        //Fear of Needles? 4149
        Story.killQuest(4149, "Nightmare", "Needle");

        //Fear of Dolls? 4150
        Story.killQuest(4150, "Nightmare", "Broken Toy");

        //Fear of Being Buried Alive? 4151
        if (!Story.questProgression(4151)) {
            Core.ensureAccept(4151);
            Core.huntMonster("nightmare", "Unearthed Skeleton", "Skeleton Deboned", 8);
            Core.huntMonster("nightmare", "Rotfeeder Worm", "Rotfeeder squished", 4);
            Core.ensureComplete(4151);
        }

        //Fear of Burning? 4152
        Story.killQuest(4152, "Nightmare", "Fire Imp");

        //FEAR OF BURNING!!! 4153
        Story.killQuest(4153, "Nightmare", "Flame Elemental");

        //Fear of Drowning? 4154
        if (!Story.questProgression(4154)) {
            Core.ensureAccept(4154);
            Core.huntMonster("nightmare", "Anglerfish", "Anglerfish Defeated", 6);
            Core.huntMonster("nightmare", "Deep Dweller", "Deep Dweller defeated");
            Core.huntMonster("nightmare", "Merdraconian", "Merdraconian Defeated", 6);
            Core.ensureComplete(4154);
        }

        //Fear of Inadequacy? 4155
        Story.killQuest(4155, "Nightmare", "Unearthed Skeleton");

        //Fear of Loneliness? 4156
        Story.killQuest(4156, "Nightmare", "Nothing");

        //Fear of Failure? 4157
        Story.killQuest(4157, "Nightmare", "Devourax");
    }

    zorbasPalace(): void {
        if (Core.isCompletedBefore(7484)) {
            return;
        }

        //7474 | Get me a Drink
        Story.killQuest(7474, "zorbaspalace", "Cactus Creeper");

        //7475 | MonkeyButt Coffee
        Story.killQuest(7475, "zorbaspalace", "Oasis Monkey");

        //7476 | Flyer Time
        Story.mapItemQuest(7476, "zorbaspalace", 7301, 10);

        //7477 | Stop the Enforcers
        Story.killQuest(7477, "zorbaspalace", "Palace Enforcer");

        //7478 | New Clothes
        Story.killQuest(7478, "zorbaspalace", "Cactus Creeper");

        //7479 | Get a Guard
        Story.killQuest(7479, "zorbaspalace", "Thwompcat");

        //7480 | Pickpocket the Pickpockets
        Story.killQuest(7480, "zorbaspalace", "Oasis Monkey");

        //7481 | Get more Enforcers
        Story.killQuest(7481, "zorbaspalace", "Palace Enforcer");

        // C#: passes 7476 and 7481 (done above) for the last three quests, so questProgression skips
        // them: Memet, the Lem-or and Zorba are never done and the 7484 check above never passes.
        //7482 | Find Memet
        Story.mapItemQuest(7482, "zorbaspalace", 7304);

        //7483 | Get the Lem-or
        Story.killQuest(7483, "zorbaspalace", "Lem-or");

        //7484 | Kick Zorba's Butt!
        Story.killQuest(7484, "zorbaspalace", "Zorba the Bakk");
    }

    byroDax(): void {
        if (Core.isCompletedBefore(7535)) {
            return;
        }

        Story.preLoad(this.byroDax);

        //Hack the System (7523)
        Story.mapItemQuest(7523, "byrodax", 7395);

        //Get the Code (7524)
        Story.killQuest(7524, "byrodax", "Security Droid");

        //Unlock the Door (7525)
        Story.mapItemQuest(7525, "byrodax", 7396);

        //Flora and Fauna (7526)
        if (!Story.questProgression(7526)) {
            Core.ensureAccept(7526);
            Core.huntMonster("byrodax", "Mutated Critter", "Mutated Animal Slain", 5);
            Core.huntMonster("byrodax", "Mutated Treeant", "Mutated Plant Slain", 5);
            Core.ensureComplete(7526);
        }

        //Erasertime (7527)
        if (!Story.questProgression(7527)) {
            Core.ensureAccept(7527);
            Core.huntMonster("byrodax", "Mutated Treeant", "Rubber", 8);
            Core.huntMonster("byrodax", "Security Droid", "Oil", 4);
            Core.ensureComplete(7527);
        }

        //Erase it! (7528)
        Story.mapItemQuest(7528, "byrodax", 7397, 10);

        //Gather Samples (7529)
        Story.killQuest(7529, "byrodax", "Mutated Treeant");

        //Parts for a Machine (7530)
        Story.killQuest(7530, "byrodax", "Security Droid");

        //Test the Goop (7531)
        if (!Story.questProgression(7531)) {
            Core.ensureAccept(7531);
            Core.getMapItem(7398, 1, "byrodax");
            Core.huntMonster("byrodax", "Space Goop", "Space Goop", 10);
            Core.ensureComplete(7531);
        }

        //Goop-Be-Gone (7532)
        Story.mapItemQuest(7532, "byrodax", 7399, 10);

        //Cleaning Time (7533)
        if (!Story.questProgression(7533)) {
            Core.ensureAccept(7533);
            Core.huntMonster("byrodax", "Mutated Treeant", "Mutated Beings Cleaned", 5);
            Core.huntMonster("byrodax", "Space Goop", "Space-Goop Cleaned", 5);
            Core.ensureComplete(7533);
        }

        //Chop Chop Fizz Fizz (7534)
        Story.mapItemQuest(7534, "byrodax", 7400);

        //It's THEM! (7535)
        Story.killQuest(7535, "byrodax", "Byro-Dax Monstrosity");
    }
}
