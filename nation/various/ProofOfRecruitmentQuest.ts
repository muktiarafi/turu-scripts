/*
name: ProofOfRecruitmentQuest
description: null
tags: null
*/
// Port of Scripts/Nation/Various/ProofOfRecruitmentQuest.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreStory } from "../../core/CoreStory";
import { CoreNation } from "../CoreNation";

const Farm = new CoreFarms();
const Story = new CoreStory();
const Nation = new CoreNation();

export class ProofOFRecruitmentQuest {
    requiredItems: string[] = [
        "ArchToken I",
        "ArchToken II",
        "Portal Key",
        "ArchToken III",
        "ArchToken IV",
        "ArchToken V",
        "ArchToken VI",
        "ArchToken VII",
        "ArchToken VIII",
        "ArchToken IX",
        "ArchToken X",
        "ArchToken XI",
    ];
    rewards: string[] = [
        "Tainted Gem",
        "Dark Crystal Shard",
        "Diamond of Nulgath",
        "Gem of Nulgath",
        "Unidentified 13",
    ];

    completeQuests(): void {
        this.legacyQuest();
        Core.addDrop(...this.requiredItems);
        Core.addDrop(...this.rewards);

        for (let i = 0; i < this.rewards.length; i++) {
            if (bot.inventory.isMaxStack(this.rewards[i])) {
                Core.logger(
                    `${this.rewards[i]} is max stack Checking next item in the "Proof of Recruitment" Quest's Rewards`,
                );
            } else {
                Core.logger(`farming ${this.rewards[i]} till max stack from  "Proof of Recruitment Quest"`);

                if (!Core.checkInventory("ArchToken XI")) {
                    if (!Core.checkInventory("ArchToken X")) {
                        if (!Core.checkInventory("ArchToken IX")) {
                            if (!Core.checkInventory("ArchToken VIII")) {
                                if (!Core.checkInventory("ArchToken VII")) {
                                    if (!Core.checkInventory("ArchToken VI")) {
                                        if (!Core.checkInventory("ArchToken V")) {
                                            if (!Core.checkInventory("ArchToken IV")) {
                                                if (!Core.checkInventory("ArchToken III")) {
                                                    if (!Core.checkInventory("ArchToken II")) {
                                                        if (!Core.checkInventory("ArchToken I")) {
                                                            //Dirtlicker's Test 4751 [ArchToken I]
                                                            Core.ensureAccept(4751);
                                                            Core.huntMonster(
                                                                "ArchPortal",
                                                                "Skull Warrior",
                                                                "Monsters Slain",
                                                                8,
                                                            );
                                                            Core.ensureComplete(4751);
                                                        }
                                                        //Souls for the Nation 4752 [ArchToken II]
                                                        Core.ensureAccept(4752);
                                                        if (!Core.checkInventory("Doomwood Token", 5)) {
                                                            Core.logger(
                                                                `Can't Finish The quest as it requires "Doomwood Token x5 [temp item]"  which can only be obtained from DoomWood PVP Arena`,
                                                                undefined,
                                                                { messageBox: true, stopBot: true },
                                                            );
                                                        }
                                                        Core.ensureComplete(4752);
                                                    }
                                                    //More Souls! 4753 [ArchToken III]
                                                    Core.ensureAccept(4753);
                                                    Farm.bludrutBrawlBoss(undefined, 30);
                                                    Core.ensureComplete(4753);
                                                }
                                                //Legion Scum 4754 [ArchToken IV]
                                                Core.ensureAccept(4754);
                                                Core.huntMonster(
                                                    "ArchPortal",
                                                    "Legion Spy",
                                                    "Defeated Legion Spies",
                                                    8,
                                                );
                                                Core.ensureComplete(4754);
                                            }
                                            //Traitors 4755 [ArchToken V]
                                            Core.ensureAccept(4755);
                                            Core.huntMonster("citadel", "Death's Head", "Death's Head Head");
                                            Core.huntMonster("EvilWarDage ", "Infernalfiend", "Infernal Fiend Head");
                                            Core.huntMonster(
                                                "EvilWarNul",
                                                "Nulgath's Redemption",
                                                "Nulgath's Redemption Head",
                                            );
                                            Core.ensureComplete(4755);
                                        }
                                        //The Evil War 4756 [ArchToken VI]
                                        Core.ensureAccept(4756);
                                        Core.huntMonster("EvilWarNul", "Blade Master", "Blade Master's Blood");
                                        Core.huntMonster("EvilWarNul", "Undead Legend", "Legion's Crown");
                                        Core.huntMonster("EvilWarNul", "Laken", "Saber of the Traveler");
                                        Core.ensureComplete(4756);
                                    }
                                    //Eye Spy 4757 [ArchToken VII]
                                    Core.ensureAccept(4757);
                                    Core.getMapItem(4178, 8, "ArchPortal");
                                    Core.huntMonster("Void", "Void Elemental", "Void Energy", 8);
                                    Core.ensureComplete(4757);
                                }
                                //Souls of the Legion 4758 [ArchToken VIII]
                                Core.ensureAccept(4758);
                                Core.huntMonster("ArchPortal", "Skull Warrior", "Dusty Bone Marrow", 5);
                                Core.huntMonster("ArchPortal", "Legion Guard", "Mummified Gray Matter", 5);
                                Core.ensureComplete(4758);
                            }
                            //Put the Lime in the Coconut 4759 [ArchToken IX]
                            Core.ensureAccept(4759);
                            Core.getMapItem(4179, 12, "ArchPortal");
                            Core.huntMonster("ArchPortal", "Skull Warrior", "Legion Skull");
                            Core.ensureComplete(4759);
                        }
                        //Hungry, Hungry Portals 4760 [ArchToken X]
                        Core.ensureAccept(4760);
                        Core.huntMonster("ArchPortal", "Legion Guard", "Undead Guards Souls", 8);
                        Core.huntMonster("ArchPortal", "Skull Warrior", "Skull Warriors Souls", 10);
                        Core.huntMonster("ArchPortal", "Legion Spy", "Hidden Legion Spy Souls", 6);
                        Core.huntMonster("citadel", "Death's Head", "Soul of the Death's Head");
                        Core.ensureComplete(4760);
                    }
                    //Protect the Portal! 4761 [ArchToken XI]
                    Core.ensureAccept(4761);
                    Core.huntMonster("ArchPortal", "High Legion Inquisitor", "High Legion Inquisitor Defeated");
                    Core.ensureComplete(4761);
                }

                //Proof of Recruitment 4785 [Rewards quest]
                while (!bot.inventory.isMaxStack(this.rewards[i])) {
                    Core.ensureAccept(4785);
                    Core.killMonster("shadowblast", "r13", "Left", "*", "Fiend Seal", 15, { isTemp: false });
                    Nation.emblemofNulgath(1);
                    Core.huntMonster("ArchPortal", "Skull Warrior", "Defeat the TR8T0R", 15);
                    Core.ensureComplete(4785);
                }
            }
        }
    }

    private legacyQuest(): void {
        const QuestLogic = (): void => {
            switch (Story.legacyQuestId) {
                case 4751:
                    // Dirtlicker's Test [ArchToken I]
                    Core.ensureAccept(4751);
                    Core.huntMonster("ArchPortal", "Skull Warrior", "Monsters Slain", 8);
                    Core.ensureComplete(4751);
                    bot.wait.forPickup("ArchToken I");
                    break;
                case 4752:
                    // Souls for the Nation [ArchToken II]
                    Core.ensureAccept(4752);
                    if (!Core.checkInventory("Doomwood Token", 5)) {
                        Core.logger(
                            `Can't finish the quest as it requires 'Doomwood Token x5 [temp item]', which can only be obtained from DoomWood PVP Arena`,
                            undefined,
                            { messageBox: true, stopBot: true },
                        );
                    }
                    Core.ensureComplete(4752);
                    bot.wait.forPickup("ArchToken II");
                    break;
                case 4753:
                    // More Souls! [ArchToken III]
                    Core.ensureAccept(4753);
                    Farm.bludrutBrawlBoss(undefined, 30);
                    Core.ensureComplete(4753);
                    bot.wait.forPickup("ArchToken III");
                    break;
                case 4754:
                    // Legion Scum [ArchToken IV]
                    Core.ensureAccept(4754);
                    Core.huntMonster("ArchPortal", "Legion Spy", "Defeated Legion Spies", 8);
                    Core.ensureComplete(4754);
                    bot.wait.forPickup("ArchToken IV");
                    break;
                case 4755:
                    // Traitors [ArchToken V]
                    Core.ensureAccept(4755);
                    Core.huntMonster("citadel", "Death's Head", "Death's Head Head");
                    Core.huntMonster("EvilWarDage", "Infernalfiend", "Infernal Fiend Head");
                    Core.huntMonster("EvilWarNul", "Nulgath's Redemption", "Nulgath's Redemption Head");
                    Core.ensureComplete(4755);
                    bot.wait.forPickup("ArchToken V");
                    break;
                case 4756:
                    // The Evil War [ArchToken VI]
                    Core.ensureAccept(4756);
                    Core.huntMonster("EvilWarNul", "Blade Master", "Blade Master's Blood");
                    Core.huntMonster("EvilWarNul", "Undead Legend", "Legion's Crown");
                    Core.huntMonster("EvilWarNul", "Laken", "Saber of the Traveler");
                    Core.ensureComplete(4756);
                    bot.wait.forPickup("ArchToken VI");
                    break;
                case 4757:
                    // Eye Spy [ArchToken VII]
                    Core.ensureAccept(4757);
                    Core.getMapItem(4178, 8, "ArchPortal");
                    Core.huntMonster("Void", "Void Elemental", "Void Energy", 8);
                    Core.ensureComplete(4757);
                    bot.wait.forPickup("ArchToken VII");
                    break;
                case 4758:
                    // Souls of the Legion [ArchToken VIII]
                    Core.ensureAccept(4758);
                    Core.huntMonster("ArchPortal", "Skull Warrior", "Dusty Bone Marrow", 5);
                    Core.huntMonster("ArchPortal", "Legion Guard", "Mummified Gray Matter", 5);
                    Core.ensureComplete(4758);
                    bot.wait.forPickup("ArchToken VIII");
                    break;
                case 4759:
                    // Put the Lime in the Coconut [ArchToken IX]
                    Core.ensureAccept(4759);
                    Core.getMapItem(4179, 12, "ArchPortal");
                    Core.huntMonster("ArchPortal", "Skull Warrior", "Legion Skull");
                    Core.ensureComplete(4759);
                    bot.wait.forPickup("ArchToken IX");
                    break;
                case 4760:
                    // Hungry, Hungry Portals [ArchToken X]
                    Core.ensureAccept(4760);
                    Core.huntMonster("ArchPortal", "Legion Guard", "Undead Guards Souls", 8);
                    Core.huntMonster("ArchPortal", "Skull Warrior", "Skull Warriors Souls", 10);
                    Core.huntMonster("ArchPortal", "Legion Spy", "Hidden Legion Spy Souls", 6);
                    Core.huntMonster("citadel", "Death's Head", "Soul of the Death's Head");
                    Core.ensureComplete(4760);
                    bot.wait.forPickup("ArchToken X");
                    break;
                case 4761:
                    // Protect the Portal! [ArchToken XI]
                    Core.ensureAccept(4761);
                    Core.huntMonster("ArchPortal", "High Legion Inquisitor", "High Legion Inquisitor Defeated");
                    Core.ensureComplete(4761);
                    bot.wait.forPickup("ArchToken XI");
                    break;
            }
        };
        Story.legacyQuestManager(QuestLogic, ...Core.fromTo(4751, 4761));
    }
}

export default function main(): void {
    const script = new ProofOFRecruitmentQuest();
    Core.setOptions();
    Core.bankingBlackList.push(...script.requiredItems);

    script.completeQuests();

    Core.setOptions(false);
}
