/*
name: null
description: null
tags: null
*/
// Port of Scripts/Story/Legion/DageTheEvilIsland/CoreDageTheEvilIsland.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../../core/CoreBots";
import { CoreStory } from "../../../core/CoreStory";

const Story = new CoreStory();

export class CoreDageTheEvilIsland {
    envyItems: string[] = ["Envy Token V", "Envy Token IV", "Envy Token III", "Envy Token II", "Envy Token I"];

    completeDageTheEvilIslandStory(): void {
        if (Core.isCompletedBefore(5658)) {
            Core.logger("Saga Complete: Dage  the Evil Island");
            return;
        }
        this.darkFortress();
        this.seraph();
        this.legionCrypt();
        this.envyMap();
        this.laken();
    }

    darkFortress(): void {
        if (Core.isCompletedBefore(4092)) {
            Core.logger("StoryLine Complete:   DarkFortress storyline");
            return;
        }
        Story.preLoad(this.darkFortress);

        Core.addDrop("Ultra Dark Mystery Stone Of Evil Animosity");

        //Test 1: Proving Ground 4084
        if (!Story.questProgression(4084)) {
            Core.ensureAccept(4084);
            Core.huntMonster("darkfortress", "Dark Makai", "Dark Makai Slain", 13);
            Core.huntMonster("darkfortress", "Dark Makai", "Cavern Dweller Slain", 13);
            Core.ensureComplete(4084);
        }

        //Test 2: Nulgath's Disdain 4085
        if (!Story.questProgression(4085)) {
            Core.ensureAccept(4085);
            Core.huntMonster("DarkFortress", "Ninja Spy", "Spy Slain", 6);
            Core.huntMonster("DarkFortress", "Cloaked Fiend", "Elemental Slain", 6);
            Core.huntMonster("DarkFortress", "Cloaked Fiend", "Cloaked Fiend Slain", 6);
            Core.ensureComplete(4085);
        }

        //Test 3: Bonesaw Break 4086
        if (!Story.questProgression(4086) || !Core.checkInventory("Ultra Dark Mystery Stone Of Evil Animosity")) {
            Core.addDrop("Ultra Dark Mystery Stone Of Evil Animosity");
            Core.ensureAccept(4086);
            Core.huntMonster("DarkFortress", "Infernalfiend", "Ultra Dark Mystery Stone");
            Core.ensureComplete(4086);
            bot.wait.forPickup("Ultra Dark Mystery Stone Of Evil Animosity");
        }

        //Test 4: Dark Battleground 4088
        if (!Story.questProgression(4088)) {
            Core.ensureAccept(4088);
            Core.huntMonster("darkfortress", "Cloaked Fiend", "Guard Slain", 13);
            Core.ensureComplete(4088);
        }

        //Test 5: Shadows Within Shadows 4089
        Story.killQuest(4089, "DarkFortress", "Dark Elemental");

        //Test 6: Runed Fiends 4090
        if (!Story.questProgression(4090)) {
            Core.ensureAccept(4090);
            Core.huntMonster("darkfortress", "Dark Elemental", "Rune Scroll", 1);
            Core.huntMonster("darkfortress", "Cloaked Fiend", "Fiend Scroll", 1);
            Core.ensureComplete(4090);
        }

        //Surprise Test: Truth Revealed 4091
        Story.killQuest(4091, "DarkFortress", "Wilhelm");

        //Final Exam: Your Own Worst Enemy 4092
        Story.killQuest(4092, "DarkFortress", "Dage The Evil");
    }

    seraph(): void {
        if (bot.quests.isUnlocked(4186)) {
            Core.logger("StoryLine Complete:   Seraph storyline");
            return;
        }
        Story.preLoad(this.seraph);

        //Explore the Order's Headquarters 4181
        Story.mapItemQuest(4181, "Seraph", 3280);

        //Good Secrets are Hard to Find 4182
        Story.killQuest(4182, "Seraph", "Seraphic Recruit");

        //Whispers Rumors and Seraphic Scrolls 4183
        if (!Story.questProgression(4183)) {
            Core.ensureAccept(4183);
            Core.huntMonster("seraph", "Legion Infiltrator", "Spy Rumors", 5);
            Core.huntMonster("seraph", "Legion Infiltrator", "Seraphic Scrolls", 3);
            Core.huntMonster("seraph", "Legion Infiltrator", "Undead Legion Sigil", 7);
            Core.ensureComplete(4183);
        }
        //Me? A Spy? 4184
        Story.killQuest(4184, "Seraph", "Legion Augur");

        //It's War! 4185
        if (!Story.questProgression(4185)) {
            Core.ensureAccept(4185);
            Core.killMonster("Seraph", "r6", "Left", "Legion Infiltrator", "Legion Infiltrators Defeated", 10, {
                log: false,
            });
            Core.ensureComplete(4185);
        }

        Core.logger(
            'if the quest "Finders Keepers" [4186] is not Unlocked, the Bot will then do the previous Quest "It\'s War!" 10x',
        );

        while (!bot.shouldExit && !bot.quests.isUnlocked(4186)) {
            Core.ensureAccept(4185);
            Core.killMonster("Seraph", "r6", "Left", "Legion Infiltrator", "Legion Infiltrators Defeated", 10, {
                log: false,
            });
            Core.ensureComplete(4185);
        }
    }

    legionCrypt(): void {
        if (Core.isCompletedBefore(4195)) {
            Core.logger("StoryLine Complete:   LegionCrypt storyline");
            return;
        }
        Story.preLoad(this.legionCrypt);

        //Finders Keepers 4186
        Story.killQuest(4186, "LegionCrypt", "Gravedigger");

        //Infiltrate the Infantry 4187
        Story.killQuest(4187, "LegionCrypt", "Undead Infantry");

        //You’re Doomed 4188
        Story.killQuest(4188, "LegionCrypt", "Legion Doomknight");

        //Eyes on the Prize 4189
        if (!Story.questProgression(4189)) {
            Core.ensureAccept(4189);
            Core.getMapItem(3295, 5, "LegionCrypt");
            Core.huntMonster("legioncrypt", "Gravedigger", "Gravedigger Gun", 5);
            Core.ensureComplete(4189);
        }

        //Filler Quest 4190
        if (!Story.questProgression(4190)) {
            Core.ensureAccept(4190);
            Core.getMapItem(3296, 5, "LegionCrypt");
            Core.huntMonster("legioncrypt", "Legion DoomKnight", "Dead Doomknight", 6);
            Core.ensureComplete(4190);
        }

        //Insider Information 4191
        Story.mapItemQuest(4191, "LegionCrypt", 3297);

        //Spiky Situation 4192
        if (!Story.questProgression(4192)) {
            Core.ensureAccept(4192);
            Core.huntMonster("legioncrypt", "Gravedigger", "Gravedigger Knife", 6);
            Core.huntMonster("legioncrypt", "Legion DoomKnight", "Legion Weapons", 7);
            Core.ensureComplete(4192);
        }
        //Run it Back Again 4193
        Story.killQuest(4193, "LegionCrypt", "Legion Doomknight");

        //Defeat Vincenzo! 4194
        Story.killQuest(4194, "LegionCrypt", "Vincenzo");

        //Defeat Brutus! 4195
        Story.killQuest(4195, "LegionCrypt", "Brutus");
    }

    envyMap(): void {
        const QuestLogic = (): void => {
            switch (Story.legacyQuestId) {
                case 4884:
                    //An Enviable Army 4884 - Envy Token I
                    Core.huntMonster("Envy", "Legion Defector", "Legion Defectors Beaten", 3);
                    Core.huntMonster("Envy", "Fawning Sycophant", "Fawning Sycophants Beaten", 4);
                    break;
                case 4885:
                    //Where’s Darkon? 4885 - Envy Token II
                    Core.getMapItem(4278, 4, "Envy");
                    break;
                case 4886:
                    //Her Biggest Fans 4886 - Envy Token III
                    Core.huntMonster("Envy", "Fawning Sycophant", "Sycophant Hood");
                    Core.huntMonster("Envy", "Fawning Sycophant", "Sycophant Tunic");
                    Core.huntMonster("Envy", "Fawning Sycophant", "Sycophant Medallion");
                    Core.huntMonster("Envy", "Fawning Sycophant", "Sycophant Boots");
                    break;
            }
        };
        const QuestLogic2 = (): void => {
            switch (Story.legacyQuestId) {
                case 4888:
                    //Higher Up The Totem Pole 4888 - Envy Token IV
                    Core.huntMonster("Envy", "Disciple of Envy", "Disciple Helm");
                    Core.huntMonster("Envy", "Disciple of Envy", "Disciple Chestplate");
                    Core.huntMonster("Envy", "Disciple of Envy", "Disciple Leggings");
                    Core.huntMonster("Envy", "Disciple of Envy", "Disciple Blade");
                    break;
                case 4889:
                    //Fight for Envy 4889 - Envy Token V
                    Core.huntMonster("Envy", "Legion Spy", "Legion Spies Defeated", 8);
                    break;
            }
        };
        if (Core.isCompletedBefore(4893)) {
            Core.logger("StoryLine Complete:   Envy storyline");
            return;
        }
        Story.preLoad(this.envyMap);

        Story.legacyQuestManager(QuestLogic, ...Core.fromTo(4884, 4886));

        //Squee for Envy 4887
        if (!Story.questProgression(4887)) {
            Core.ensureAccept(4887);
            Core.huntMonster("Envy", "Fawning Sycophant", "Clue");
            Core.huntMonster("Envy", "Fawning Sycophant", "Secret");
            Core.huntMonster("Envy", "Fawning Sycophant", "Gossip");
            Core.huntMonster("Envy", "Fawning Sycophant", "Sincere but Unhelpful Praise");
            Core.ensureComplete(4887);
        }

        Story.legacyQuestManager(QuestLogic2, ...Core.fromTo(4888, 4889));

        //Where’s That Employee Lounge Again? 4890
        if (!Story.questProgression(4890)) {
            Core.ensureAccept(4890);
            Core.huntMonster("Envy", "Disciple of Envy", "Semi-Useful Information");
            Core.huntMonster("Envy", "Disciple of Envy", "Cult Propaganda");
            Core.huntMonster("Envy", "Disciple of Envy", "Another Clue");
            Core.huntMonster("Envy", "Disciple of Envy", "Bad Puns");
            Core.ensureComplete(4890);
        }

        //Group Effort 4891
        if (!Story.questProgression(4891)) {
            Core.ensureAccept(4891);
            Core.huntMonster("envy", "Legion Defector", "Part 1", 1);
            Core.huntMonster("envy", "Fawning Sycophant", "Part 2", 1);
            Core.huntMonster("envy", "Disciple of Envy", "Part 3", 1);
            Core.ensureComplete(4891);
        }

        //Defeat Envy 4892
        Story.killQuest(4892, "Envy", "Envy");

        //The Queen of Envy 4893
        Story.killQuest(4893, "Envy", "Queen of Envy");
    }

    laken(): void {
        if (Core.isCompletedBefore(5658)) {
            Core.logger("StoryLine Complete:   Laken storyline");
            return;
        }
        Story.preLoad(this.laken);

        //Get Rid of the Guards 5648
        if (!Story.questProgression(5648)) {
            Core.ensureAccept(5648);
            Core.huntMonster("laken", "Cyborg Dog", "Cyborg Dogs Slain", 4);
            Core.huntMonster("laken", "Augmented Guard", "Augmented Guards Slain", 4);
            Core.ensureComplete(5648);
        }

        //Get the Data 5649
        Story.killQuest(5649, "Laken", "Mad Scientist");

        //Find the Door Code 5650
        Story.killQuest(5650, "Laken", "Mad Scientist");

        //Find the Lab 5651
        Story.mapItemQuest(5651, "Laken", 5123);

        //Take out Dr. Eisenbacke 5652
        if (!Story.questProgression(5652)) {
            Story.killQuest(5652, "Laken", "Dr Eisenbacke");
            //Wait and Exit Cut Scene cell
            bot.wait.forCellChange("Cut2");
            Core.jumpWait();
        }

        //Find Ada 5653
        if (!Story.questProgression(5653)) {
            Core.ensureAccept(5653);
            Core.getMapItem(5124, 1, "Laken");
            Core.huntMonster("laken", "Dustbunny", "Dustbunny Slain", 5);
            Core.ensureComplete(5653);
        }

        //Keep Looking 5654
        if (!Story.questProgression(5654)) {
            Core.ensureAccept(5654);
            Core.getMapItem(5125, 1, "Laken");
            Core.huntMonster("laken", "Closet Moth", "Closet Moth Slain", 5);
            Core.ensureComplete(5654);
        }

        //Gotcha! 5655
        if (!Story.questProgression(5655)) {
            Story.mapItemQuest(5655, "Laken", 5126);
            //Wait and Exit Cut Scene cell
            bot.wait.forCellChange("Cut3");
            Core.jumpWait();
        }

        //Combat Practice 5656
        if (!Story.questProgression(5656)) {
            Core.ensureAccept(5656);
            if (bot.player.cell !== "r10a") {
                Core.jump("r10a");
            }
            Core.killMonster("Laken", "r10a", "Left", "Ada", "Spar With Ada");
            bot.wait.forQuestComplete(5656);
            // Core.EnsureComplete(5656);
            //Wait and Exit Cut Scene cell
            Core.jumpWait();
        }

        //Round 2 5657
        if (!Story.questProgression(5657)) {
            Core.ensureAccept(5657);
            if (bot.player.cell !== "r11") {
                Core.jump("r11");
            }
            Core.killMonster("Laken", "r11", "Left", "Ada", "Spar Again");
            bot.wait.forQuestComplete(5657);
            //Wait and Exit Cut Scene cell
            Core.jumpWait();
            Core.ensureComplete(5657);
        }

        //Third Time's A Charm 5658
        if (!Story.questProgression(5658)) {
            Core.ensureAccept(5658);
            if (bot.player.cell !== "r12") {
                Core.jump("r12");
            }
            Core.killMonster("Laken", "r12", "Left", "Ada", "Spar One More Time");
            bot.wait.forQuestComplete(5658);
            //Wait and Exit Cut Scene cell
            bot.wait.forCellChange("Cut4");
            Core.jumpWait();
        }
    }
}
