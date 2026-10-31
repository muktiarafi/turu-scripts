/*
name: Living Dungeon (Extra)
description: This will finish the Living Dungeon quest.
tags: story, quest, queen-of-monsters, living-dungeon, extra
*/
// Port of Scripts/Story/QueenofMonsters/Extra/LivingDungeon.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../../core/CoreBots";
import { CoreStory } from "../../../core/CoreStory";

const Story = new CoreStory();

export class LivingDungeon {
    livingDungeonStory(): void {
        if (Core.isCompletedBefore(4384)) {
            return;
        }

        Story.preLoad(this.livingDungeonStory);

        // Titan Hollow
        Story.chainQuest(4348);

        // Roots of all Evil
        Story.killQuest(4349, "livingdungeon", "Root of Evil");

        // Venus Hero Trap
        Story.killQuest(4350, "livingdungeon", "Seed Spitter");

        // Bark is worse than its bite
        if (!Story.questProgression(4351)) {
            Core.ensureAccept(4351);
            Core.huntMonster("livingdungeon", "Evil Plant Horror", "It's a CLUE!", 10);
            Core.ensureComplete(4351);
        }

        // Knot what you expected
        Story.killQuest(4352, "livingdungeon", "Weeping Widowmaker");

        // Cha Cha Cha Chia!
        Story.killQuest(4353, "livingdungeon", "Chia Warrior");

        // Leaf me alone!
        if (!Story.questProgression(4354)) {
            Core.ensureAccept(4354);
            Core.huntMonster("livingdungeon", "Titan Decay", "Titan Decay defeated", 5);
            Core.huntMonster("livingdungeon", "Seed Spitter", "Seed Spitter de-seeded", 5);
            Core.huntMonster("livingdungeon", "Evil Plant Horror", "Evil Plant Horror defeated", 5);
            Core.ensureComplete(4354);
        }

        // Evil Faerie Ambush!
        Story.killQuest(4355, "livingdungeon", "Evil Tree Faerie");

        // Check the Trunk
        Story.killQuest(4356, "livingdungeon", "Vulchurion");

        // Committing Tree-son
        if (!Story.questProgression(4357)) {
            Core.ensureAccept(4357);
            Core.huntMonster("livingdungeon", "Evil Plant Horror", "Magic Tree Bark", 10);
            Core.ensureComplete(4357);
        }

        // Heartwood
        if (!Story.questProgression(4358)) {
            Core.ensureAccept(4358);
            Core.huntMonster("livingdungeon", "Evil Plant Horror", "Titan's Heart", 1);
            Core.ensureComplete(4358);
        }

        // Drayko BOSS FIGHT!
        Story.killQuest(4359, "livingdungeon", "Drayko");

        // Foilaged again!
        if (!Story.questProgression(4360)) {
            Core.ensureAccept(4360);
            Core.huntMonster("livingdungeon", "Evil Plant Horror", "Monsters defeated", 15);
            Core.ensureComplete(4360);
        }

        // Mind Games
        if (!Story.questProgression(4361)) {
            Core.ensureAccept(4361);
            Core.huntMonster("livingdungeon", "Evil Plant Horror", "Tree Titan Brain Chunk", 10);
            Core.ensureComplete(4361);
        }

        // DRAGON vs TITAN
        Story.killQuest(4362, "treetitanbattle", "Dakka the Dire Dragon");

        // Smells like trouble!
        Story.killQuest(4363, "livingdungeon", "Lil' Poot");

        // EPIC DROP!
        Story.killQuest(4364, "livingdungeon", "Epic Drop");

        Core.addDrop(
            "Wooden Ring",
            "Salad!",
            "Weeping Widowmaker Bone",
            "Chia in a pot!",
            "Fairy Phone",
            "Vulchurion Quill",
            "Drayko's Medallion",
            "Giant Dakka Fang",
        );
        // ------------------------------------------
        // Drayko Battle!
        if (!Core.checkInventory("Drayko's Medallion")) {
            Core.logger("Drayko's Medallion not found, finding it for you");
            Core.ensureAccept(4383);

            // Vulchurions
            if (!Core.checkInventory("Vulchurion Quill")) {
                Core.logger("Vulchurion Quill not found, finding it for you");
                Core.ensureAccept(4382);

                // Evil Tree Faeries
                if (!Core.checkInventory("Fairy Phone")) {
                    Core.logger("Fairy Phone not found, finding it for you");
                    Core.ensureAccept(4381);

                    // Chia Warriors
                    if (!Core.checkInventory("Chia in a pot!")) {
                        Core.logger("Chia in a pot! not found, finding it for you");
                        Core.ensureAccept(4380);

                        if (!Core.checkInventory("Weeping Widowmaker Bone")) {
                            Core.logger("Weeping Widowmaker Bone not found, finding it for you");
                            Core.ensureAccept(4379);

                            if (!Core.checkInventory("Salad!")) {
                                Core.logger("Salad! not found, finding it for you");
                                Core.ensureAccept(4378);

                                if (!Core.checkInventory("Wooden Ring")) {
                                    Core.logger("Wooden Ring not found, finding it for you");
                                    Core.ensureAccept(4377);
                                    Core.huntMonster("livingdungeon", "Root of Evil", "Wooden Ring Piece", 5);
                                    Core.ensureComplete(4377);
                                    bot.wait.forPickup("Wooden Ring");
                                    Core.sleep(1000);
                                }
                                Core.huntMonster("livingdungeon", "Evil Plant Horror", "Evil Plant Horror Leaf", 6);
                                Core.ensureComplete(4378);
                                bot.wait.forPickup("Salad!");
                                Core.sleep(1000);
                            }
                            Core.huntMonster("livingdungeon", "Weeping Widowmaker", "Widowmaker deboned", 5);
                            Core.ensureComplete(4379);
                            bot.wait.forPickup("Weeping Widowmaker Bone");
                            Core.sleep(1000);
                        }
                        Core.huntMonster("livingdungeon", "Chia Warrior", "Chia Warrior defeated", 3);
                        Core.ensureComplete(4380);
                        bot.wait.forPickup("Chia in a pot!");
                        Core.sleep(1000);
                    }
                    Core.huntMonster("livingdungeon", "Evil Tree Faerie", "Fairy Purse", 5);
                    Core.ensureComplete(4381);
                    bot.wait.forPickup("Fairy Phone");
                    Core.sleep(1000);
                }
                Core.huntMonster("livingdungeon", "Vulchurion", "Vulchurion Feather", 3);
                Core.ensureComplete(4382);
                bot.wait.forPickup("Vulchurion Quill");
                Core.sleep(1000);
            }
            Core.huntMonster("livingdungeon", "Drayko", "Drayko Defeated... again");
            Core.ensureComplete(4383);
            bot.wait.forPickup("Drarko's Medalion");
            Core.sleep(1000);
        }
        // DRAGON vs TITAN Rematch! - 4384
        if (!Story.questProgression(4384)) {
            Core.logger("Giant Dakka Fang not found, finding it for you");
            Core.ensureAccept(4384);
            Core.huntMonster("treetitanbattle", "Dakka the Dire Dragon", "Dakka Defeated... again");
            Core.ensureComplete(4384);
            // Bot.Wait.ForPickup("Giant Dakka Fang");
        }
    }
}

export default function main(): void {
    const script = new LivingDungeon();
    Core.setOptions();

    script.livingDungeonStory();

    Core.setOptions(false);
}
