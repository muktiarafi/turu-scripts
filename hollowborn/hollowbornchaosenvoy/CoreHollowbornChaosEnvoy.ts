/*
name: null
description: null
tags: null
*/
// Port of Scripts/Hollowborn/HollowbornChaosEnvoy/CoreHollowbornChaosEnvoy.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, option } from "turu";
import { AscendedDrakathGear } from "../../chaos/AscendedDrakathGear";
import { ChaosAvengerClass } from "../../chaos/ChaosAvengerPreReqs";
import { EternalDrakath } from "../../chaos/EternalDrakathSet";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, configEnum, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreStory } from "../../core/CoreStory";
import { CoreHollowborn } from "../CoreHollowborn";
import { ChaosPuppetMaster } from "../../other/badges/ChaosPuppetMaster";
import { TitanStrikeGearMerge } from "../../other/mergeshops/TitanStrikeGearMerge";
import { CoreQOM } from "../../story/queenofmonsters/CoreQoM";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const HB = new CoreHollowborn();
const QOM = new CoreQOM();
const CAV = new ChaosAvengerClass();
const ED = new EternalDrakath();
const ADG = new AscendedDrakathGear();
const TGM = new TitanStrikeGearMerge();
const CPM = new ChaosPuppetMaster();
const Story = new CoreStory();

export enum StirringDiscordRewards {
    Hollowborn_Chaos_Warrior = 74476,
    Hollowborn_Chaos_Morph = 74477,
    Hollowborn_Chaotic_Wings = 74478,
    All,
    None,
}

export enum InTheBeastsShadowRewards {
    Hollowborn_Omega_Blades = 74480,
    Hollowborn_Omega_Sword = 74481,
    Hollowborn_Chaos_Unlocker = 74482,
    All,
    None,
}

export enum UniqueQuarryRewards {
    Hollowborn_Benevolent_Locks = 74485,
    Hollowborn_Malignant_Locks = 74488,
    Hollowborn_Face_of_Chaos = 74491,
    Hollowborn_Gaze_of_Chaos = 74492,
    All,
    None,
}

export enum WaveringIllusionsRewards {
    Hollowborn_Eye_of_Chaos = 74479,
    Hollowborn_Wings_of_Chaos = 74493,
    Hollowborn_Chaotic_Portal = 74499,
    All,
    None,
}

export enum ShadowsOfDisdainRewards {
    Hollowborn_Envoy_of_Chaos = 74489,
    Hollowborn_Alignment_Aspects = 74494,
    Hollowborn_Blade_of_Chaos_Cape = 74495,
    Hollowborn_Chaotic_Portal = 74496,
    Hollowborn_Blade_of_Chaos = 74497,
    Hollowborn_Claw_of_Chaos = 74498,
    All,
    None,
}

export enum PersistingMayhemRewards {
    Hollowborn_Benevolent = 74483,
    Hollowborn_Benevolent_Morph = 74484,
    Hollowborn_Malignant = 74486,
    Hollowborn_Malignant_Morph = 74487,
    Idle_Hollowborn_Envoy_of_Chaos = 74490,
    Hollowborn_Blade_of_Chaos_Floor = 74500,
    Hollowborn_Blades_of_Chaos = 74501,
    Hollowborn_Omega_Swords = 74502,
    Hollowborn_Chaos_Unlockers = 74503,
    All,
    None,
}

export class CoreHollowbornChaosEnvoy {
    getAll(): void {
        const getAllDrops = bot.config!.get<boolean>("getAll");
        const BankAfter = bot.config!.get<boolean>("BankAfter");
        let optionsLogged = false;

        const questDictionary = new Map<string, [Order: number, Action: () => void]>([
            [
                "Stirring Discord",
                [
                    8998,
                    () =>
                        this.stirringDiscord(
                            getAllDrops
                                ? StirringDiscordRewards.All
                                : configEnum(
                                      "Stirring Discord",
                                      StirringDiscordRewards,
                                      StirringDiscordRewards.Hollowborn_Chaos_Warrior,
                                  ),
                        ),
                ],
            ],
            [
                "In The Beasts Shadow",
                [
                    8999,
                    () =>
                        this.inTheBeastsShadow(
                            getAllDrops
                                ? InTheBeastsShadowRewards.All
                                : configEnum(
                                      "In The Beasts Shadow",
                                      InTheBeastsShadowRewards,
                                      InTheBeastsShadowRewards.Hollowborn_Omega_Blades,
                                  ),
                        ),
                ],
            ],
            [
                "Unique Quarry",
                [
                    9000,
                    () =>
                        this.uniqueQuarry(
                            getAllDrops
                                ? UniqueQuarryRewards.All
                                : configEnum(
                                      "Unique Quarry",
                                      UniqueQuarryRewards,
                                      UniqueQuarryRewards.Hollowborn_Benevolent_Locks,
                                  ),
                        ),
                ],
            ],
            [
                "Wavering Illusions",
                [
                    9001,
                    () =>
                        this.waveringIllusions(
                            getAllDrops
                                ? WaveringIllusionsRewards.All
                                : configEnum(
                                      "Wavering Illusions",
                                      WaveringIllusionsRewards,
                                      WaveringIllusionsRewards.Hollowborn_Eye_of_Chaos,
                                  ),
                        ),
                ],
            ],
            [
                "Shadows Of Disdain",
                [
                    9002,
                    () =>
                        this.shadowsOfDisdain(
                            getAllDrops
                                ? ShadowsOfDisdainRewards.All
                                : configEnum(
                                      "Shadows Of Disdain",
                                      ShadowsOfDisdainRewards,
                                      ShadowsOfDisdainRewards.Hollowborn_Envoy_of_Chaos,
                                  ),
                        ),
                ],
            ],
            [
                "Persisting Mayhem",
                [
                    9003,
                    () =>
                        this.persistingMayhem(
                            getAllDrops
                                ? PersistingMayhemRewards.All
                                : configEnum(
                                      "Persisting Mayhem",
                                      PersistingMayhemRewards,
                                      PersistingMayhemRewards.Hollowborn_Benevolent,
                                  ),
                        ),
                ],
            ],
        ]);

        const questOrder = [
            "Stirring Discord",
            "In The Beasts Shadow",
            "Unique Quarry",
            "Wavering Illusions",
            "Shadows Of Disdain",
            "Persisting Mayhem",
        ];

        for (const quest of questOrder) {
            const questConfig = bot.config?.get<string>(quest) ?? "";
            if (!!questConfig) {
                if (!optionsLogged) {
                    Core.logger(
                        `Options Selected:\n${questOrder.map((q) => `\t${q.replaceAll("_", " ")}: [${bot.config?.get<string>(q)?.replaceAll("_", " ") ?? ""}]`).join("\n")}`,
                    );
                    optionsLogged = true;
                }

                const [order, action] = questDictionary.get(quest)!;
                action();

                if (BankAfter) {
                    Core.toBank(...Core.questRewards(order));
                }
            }
            Core.cancelRegisteredQuests();
        }
    }

    stirringDiscord(rewardSelection: StirringDiscordRewards = StirringDiscordRewards.None, completeOnce = false): void {
        const rewards = Core.questRewards(8998);
        const discordReward = configEnum(
            "Stirring Discord",
            StirringDiscordRewards,
            StirringDiscordRewards.Hollowborn_Chaos_Warrior,
        );

        const shouldReturnEarly =
            (discordReward === StirringDiscordRewards.None && !completeOnce) ||
            (discordReward === StirringDiscordRewards.All &&
                Core.checkInventory(rewards, undefined, { toInv: false }) &&
                Story.questProgression(8998)) ||
            (discordReward !== StirringDiscordRewards.None &&
                Core.checkInventory(discordReward, undefined, { toInv: false }) &&
                Story.questProgression(8998));

        if (shouldReturnEarly) {
            if (discordReward === StirringDiscordRewards.None && !completeOnce) {
                Core.logger(
                    "Conditions met: Reward is None and completeOnce is false. Exiting Stirring Discord quest.",
                );
            } else if (
                discordReward !== StirringDiscordRewards.None &&
                Core.checkInventory(discordReward, undefined, { toInv: false }) &&
                Story.questProgression(8998)
            ) {
                Core.logger(
                    "Conditions met: Reward is present and quest progression is complete. Exiting Stirring Discord quest.",
                );
            }

            return;
            // Signal to exit
        }

        Core.addDrop(...rewards);
        HB.hardcoreContract();
        Farm.experience(75);

        Core.logger(`Reward Chosen: ${StirringDiscordRewards[discordReward].replaceAll("_", " ")}`);
        while (!bot.shouldExit && !shouldReturnEarly) {
            Core.ensureAcceptmultiple(7158, 8998);
            Core.huntMonster("lagunabeach", "Heart of Chaos", "Chaos Pirate Crew", undefined, { isTemp: false });
            Core.huntMonster("backroom", "Book Wyrm", "Maledictus Magum", undefined, { isTemp: false });
            Core.huntMonster("wardwarf", "Chaotic Draconian", "Chaotic Draconian Wings", undefined, { isTemp: false });
            Core.killMonster("blindingsnow", "r5", "Spawn", "*", "Shard of Chaos", 100, { isTemp: false });
            Core.huntMonster("chaosboss", "Ultra Chaos Warlord", "Chaotic War Essence", 15, { isTemp: false });
            Adv.buyItem("crownsreach", 1383, "Chaotic Knight Helm");

            // Handle quest completion
            if (completeOnce) {
                Core.ensureComplete(8998);
                Core.logger("Stirring Discord quest completed.");
                return;
            }

            // Handle reward selection
            if (rewardSelection === StirringDiscordRewards.All) {
                Core.ensureCompleteChoose(8998, Core.questRewards(8998));
                if (Core.checkInventory(Core.questRewards(8998), undefined, { toInv: false })) {
                    Core.logger("All rewards present, exiting Stirring Discord quest.");
                    return;
                }
            } else {
                // Complete for the specific reward if not owned
                if (!Core.checkInventory(discordReward)) {
                    Core.ensureComplete(8998, discordReward);
                    Core.logger(
                        `Stirring Discord quest completed for reward: ${StirringDiscordRewards[discordReward]}`,
                    );
                }
                break;
            }
        }
    }

    inTheBeastsShadow(
        rewardSelection: InTheBeastsShadowRewards = InTheBeastsShadowRewards.None,
        completeOnce = false,
    ): void {
        if (!Story.questProgression(8998)) {
            Core.logger('Quest not unlocked [8999], doing "Stirring Discord"');
            this.stirringDiscord(undefined, true);
        }

        const rewards = Core.questRewards(8999);
        const beastsShadowReward = configEnum(
            "In The Beasts Shadow",
            InTheBeastsShadowRewards,
            InTheBeastsShadowRewards.Hollowborn_Omega_Blades,
        );

        // Check if we should return early based on inventory conditions and 'completeOnce' flag
        const shouldReturnEarly =
            (beastsShadowReward === InTheBeastsShadowRewards.None && !completeOnce) ||
            (beastsShadowReward === InTheBeastsShadowRewards.All &&
                Core.checkInventory(rewards, undefined, { toInv: false }) &&
                Story.questProgression(8999)) ||
            (beastsShadowReward !== InTheBeastsShadowRewards.None &&
                Core.checkInventory(beastsShadowReward, undefined, { toInv: false }) &&
                Story.questProgression(8999));
        // Specific reward present and quest progression is complete

        if (shouldReturnEarly) {
            if (beastsShadowReward === InTheBeastsShadowRewards.None && !completeOnce) {
                Core.logger(
                    "Conditions met: Reward is None and completeOnce is false. Exiting In The Beasts Shadow quest.",
                );
            } else if (
                beastsShadowReward === InTheBeastsShadowRewards.All &&
                Core.checkInventory(rewards, undefined, { toInv: false }) &&
                Story.questProgression(8999)
            ) {
                Core.logger(
                    "Conditions met: All rewards present and quest progression is complete. Exiting In The Beasts Shadow quest.",
                );
            } else if (
                beastsShadowReward !== InTheBeastsShadowRewards.None &&
                Core.checkInventory(beastsShadowReward, undefined, { toInv: false }) &&
                Story.questProgression(8999)
            ) {
                Core.logger(
                    "Conditions met: Specific reward present and quest progression is complete. Exiting In The Beasts Shadow quest.",
                );
            }

            return;
            // Signal to exit
        }

        Core.addDrop(...rewards);
        Farm.experience(75);

        Core.logger(`Reward Chosen: ${InTheBeastsShadowRewards[beastsShadowReward].replaceAll("_", " ")}`);

        while (!bot.shouldExit && !shouldReturnEarly) {
            Core.ensureAccept(8999);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("hydra", "Hydra Head", "Hydra Armor", undefined, { isTemp: false });
            Core.huntMonster("roc", "Rock Roc", "Mini Rock Roc", undefined, { isTemp: false });
            Core.killMonster("odokuro", "Boss", "Right", "O-dokuro", "O-dokuro on Your Back", undefined, {
                isTemp: false,
            });
            Core.huntMonster("chaoscave", "DracoWerePyre", "Burning Dragon Mace", undefined, { isTemp: false });
            Core.huntMonster("palooza", "Pony Gary Yellow", "Mini Pony Gary Yellow", undefined, { isTemp: false });
            Core.huntMonster("elemental", "Mana Golem", "Mana Golem", undefined, { isTemp: false });
            Core.killEscherion("Relic of Chaos", 13);

            Core.equipClass(ClassType.Farm);
            Core.killMonster("mountdoomskull", "b1", "Left", "*", "Fragment of Mount Doomskull", 1000, {
                isTemp: false,
            });

            // Handle quest completion
            if (completeOnce) {
                Core.ensureComplete(8999);
                Core.logger("In The Beasts Shadow quest completed.");
                return;
            }

            if (rewardSelection === InTheBeastsShadowRewards.All) {
                Core.ensureCompleteChoose(8999, Core.questRewards(8999));
                if (Core.checkInventory(Core.questRewards(8999), undefined, { toInv: false })) {
                    Core.logger("All rewards present, exiting In The Beasts Shadow quest.");
                    return;
                }
            } else {
                // Complete for the specific reward if not owned
                if (!Core.checkInventory(beastsShadowReward)) {
                    Core.ensureComplete(8999, beastsShadowReward);
                    Core.logger(
                        `In The Beasts Shadow quest completed for reward: ${InTheBeastsShadowRewards[beastsShadowReward]}`,
                    );
                }
                break;
            }
        }
    }

    uniqueQuarry(rewardSelection: UniqueQuarryRewards = UniqueQuarryRewards.None, completeOnce = false): void {
        if (!Core.isCompletedBefore(8999)) {
            Core.logger('Quest not unlocked [9000], doing "In The Beasts Shadow"');
            this.inTheBeastsShadow(undefined, true);
        }

        const rewards = Core.questRewards(9000);
        const quarryReward = configEnum(
            "Unique Quarry",
            UniqueQuarryRewards,
            UniqueQuarryRewards.Hollowborn_Benevolent_Locks,
        );

        // Check if we should return early based on inventory conditions and 'completeOnce' flag
        const shouldReturnEarly =
            (quarryReward === UniqueQuarryRewards.None && !completeOnce) ||
            (quarryReward === UniqueQuarryRewards.All &&
                Core.checkInventory(rewards, undefined, { toInv: false }) &&
                Story.questProgression(9000)) ||
            (quarryReward !== UniqueQuarryRewards.None &&
                Core.checkInventory(quarryReward, undefined, { toInv: false }) &&
                Story.questProgression(9000));
        // Specific reward present and quest progression is complete

        if (shouldReturnEarly) {
            if (quarryReward === UniqueQuarryRewards.None && !completeOnce) {
                Core.logger("Conditions met: Reward is None and completeOnce is false. Exiting Unique Quarry quest.");
            } else if (
                quarryReward === UniqueQuarryRewards.All &&
                Core.checkInventory(rewards, undefined, { toInv: false }) &&
                Story.questProgression(9000)
            ) {
                Core.logger(
                    "Conditions met: All rewards present and quest progression is complete. Exiting Unique Quarry quest.",
                );
            } else if (
                quarryReward !== UniqueQuarryRewards.None &&
                Core.checkInventory(quarryReward, undefined, { toInv: false }) &&
                Story.questProgression(9000)
            ) {
                Core.logger(
                    "Conditions met: Specific reward present and quest progression is complete. Exiting Unique Quarry quest.",
                );
            }

            return;
            // Signal to exit
        }

        Core.addDrop(...rewards);
        Farm.experience(75);
        ADG.ascendedGear("Ascended Face of Chaos");

        Core.logger(`Reward Chosen: ${UniqueQuarryRewards[quarryReward].replaceAll("_", " ")}`);
        bot.quests.updateQuest(2804);
        while (!bot.shouldExit && !shouldReturnEarly) {
            Core.ensureAccept(9000);
            Core.equipClass(ClassType.Farm);
            Core.killMonster("chaoswar", "r13", "Left", "*", "Chaos Tentacle", 300, { isTemp: false });

            Core.equipClass(ClassType.Solo);
            Core.huntMonster("sandcastle", "Chaos Sphinx", "Chaos Sphinx", undefined, { isTemp: false });
            Core.huntMonster("deepchaos", "Kathool", "Kathool Annihilator", undefined, { isTemp: false });
            Core.huntMonster("castleroof", "Chaos Dragon", "Chaos Dragon Slayer", undefined, { isTemp: false });
            Core.huntMonster("mirrorportal", "Chaos Harpy", "HarpyHunter", undefined, { isTemp: false });
            Core.huntMonster("orecavern", "Naga Baas", "Naga Baas Pet", undefined, { isTemp: false });
            Core.huntMonster("venomvaults", "Manticore", "Treasure Vault Key", undefined, { isTemp: false });

            Adv.buyItem("venomvaults", 585, "Chaotic Manticore Head");

            if (!Core.checkInventory("Chaoroot", 30)) {
                Farm.gold(900000);
                Core.buyItem("tercessuinotlim", 1951, "Receipt of Swindle", 3);
                Core.buyItem("tercessuinotlim", 1951, "Chaoroot", 30);
            }

            // Handle quest completion
            if (completeOnce) {
                Core.ensureComplete(9000);
                Core.logger("Unique Quarry quest completed.");
                return;
            }

            if (rewardSelection === UniqueQuarryRewards.All) {
                Core.ensureCompleteChoose(9000, Core.questRewards(9000));
                if (Core.checkInventory(Core.questRewards(9000), undefined, { toInv: false })) {
                    Core.logger("All rewards present, exiting Unique Quarry quest.");
                    return;
                }
            } else {
                // Complete for the specific reward if not owned
                if (!Core.checkInventory(quarryReward)) {
                    Core.ensureComplete(9000, quarryReward);
                    Core.logger(`Unique Quarry quest completed for reward: ${UniqueQuarryRewards[quarryReward]}`);
                }
                break;
            }
        }
    }

    waveringIllusions(
        rewardSelection: WaveringIllusionsRewards = WaveringIllusionsRewards.None,
        completeOnce = false,
    ): void {
        if (!Core.isCompletedBefore(9000)) {
            Core.logger('Quest not unlocked [9001], doing "Unique Quarry"');
            this.uniqueQuarry(undefined, true);
        }

        const rewards = Core.questRewards(9001);
        const illusionsReward = configEnum(
            "Wavering Illusions",
            WaveringIllusionsRewards,
            WaveringIllusionsRewards.Hollowborn_Eye_of_Chaos,
        );

        // Check if we should return early based on inventory conditions and 'completeOnce' flag
        const shouldReturnEarly =
            (illusionsReward === WaveringIllusionsRewards.None && !completeOnce) ||
            (illusionsReward === WaveringIllusionsRewards.All &&
                Core.checkInventory(rewards, undefined, { toInv: false }) &&
                Story.questProgression(9001)) ||
            (illusionsReward !== WaveringIllusionsRewards.None &&
                Core.checkInventory(illusionsReward, undefined, { toInv: false }) &&
                Story.questProgression(9001));
        // Specific reward present and quest progression is complete

        if (shouldReturnEarly) {
            if (illusionsReward === WaveringIllusionsRewards.None && !completeOnce) {
                Core.logger(
                    "Conditions met: Reward is None and completeOnce is false. Exiting Wavering Illusions quest.",
                );
            } else if (
                illusionsReward === WaveringIllusionsRewards.All &&
                Core.checkInventory(rewards, undefined, { toInv: false }) &&
                Story.questProgression(9001)
            ) {
                Core.logger(
                    "Conditions met: All rewards present and quest progression is complete. Exiting Wavering Illusions quest.",
                );
            } else if (
                illusionsReward !== WaveringIllusionsRewards.None &&
                Core.checkInventory(illusionsReward, undefined, { toInv: false }) &&
                Story.questProgression(9001)
            ) {
                Core.logger(
                    "Conditions met: Specific reward present and quest progression is complete. Exiting Wavering Illusions quest.",
                );
            }

            return;
            // Signal to exit
        }

        Core.addDrop(...rewards);
        Farm.experience(80);
        QOM.theQueensSecrets();
        Core.huntMonster("finalbattle", "Drakath", "Drakath Wings", undefined, { isTemp: false });

        Core.logger(`Reward Chosen: ${WaveringIllusionsRewards[illusionsReward]}`);
        if (!Core.checkInventory("Supreme Arcane Staff of Chaos")) {
            Core.logger("Hunting for Supreme Arcane Staff of Chaos.");
            Core.huntMonster("ledgermayne", "Ledgermayne", "The Supreme Arcane Staff", undefined, { isTemp: false });
            // Can buyback
            Adv.buyItem("deepforest", 1999, "Supreme Arcane Staff of Chaos");
        }

        CPM.badge();

        while (!bot.shouldExit && !shouldReturnEarly) {
            Core.ensureAccept(9001);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("chaoscrypt", "Chaorrupted Knight", "Chaos Gem", 200, { isTemp: false });

            Core.equipClass(ClassType.Solo);
            Core.huntMonster("chaoslab", "Chaos Artix", "Chaorrupted Light of Destiny", undefined, { isTemp: false });
            Core.huntMonster("mqlesson", "Dragonoid", "Dragonoid of Hours", undefined, { isTemp: false });
            Core.huntMonster("timespace", "Chaos Lord Iadoa", "Chaorrupted Hourglass", 30, {
                isTemp: false,
                publicRoom: true,
            });
            Core.huntMonster("chaoskraken", "Chaos Kraken", "Chaotic Invertebrae", 20, {
                isTemp: false,
                publicRoom: true,
            });

            Core.buyItem("downbelow", 2004, "Chaos PuppetMaster");

            // Handle quest completion
            if (completeOnce) {
                Core.ensureComplete(9001);
                Core.logger("Wavering Illusions quest completed.");
                return;
            }

            if (rewardSelection === WaveringIllusionsRewards.All) {
                Core.ensureCompleteChoose(9001, Core.questRewards(9001));
                if (Core.checkInventory(Core.questRewards(9001), undefined, { toInv: false })) {
                    Core.logger("All rewards present, exiting Wavering Illusions quest.");
                    return;
                }
            } else {
                // Complete for the specific reward if not owned
                if (!Core.checkInventory(illusionsReward)) {
                    Core.ensureComplete(9001, illusionsReward);
                    Core.logger(
                        `Wavering Illusions quest completed for reward: ${WaveringIllusionsRewards[illusionsReward]}`,
                    );
                }
                break;
            }
        }
    }

    shadowsOfDisdain(
        rewardSelection: ShadowsOfDisdainRewards = ShadowsOfDisdainRewards.None,
        completeOnce = false,
    ): void {
        if (!Core.isCompletedBefore(9001)) {
            Core.logger('Quest not unlocked [9002], doing "Wavering Illusions"');
            this.waveringIllusions(undefined, true);
        }

        const rewards = Core.questRewards(9002);
        const disdainReward = configEnum(
            "Shadows Of Disdain",
            ShadowsOfDisdainRewards,
            ShadowsOfDisdainRewards.Hollowborn_Envoy_of_Chaos,
        );

        // Check if quest can be skipped
        const shouldReturnEarly =
            (disdainReward === ShadowsOfDisdainRewards.None && !completeOnce) ||
            (disdainReward === ShadowsOfDisdainRewards.All &&
                Core.checkInventory(rewards, undefined, { toInv: false }) &&
                Story.questProgression(9002)) ||
            (disdainReward !== ShadowsOfDisdainRewards.None &&
                Core.checkInventory(disdainReward, undefined, { toInv: false }) &&
                Story.questProgression(9002));

        if (shouldReturnEarly) {
            Core.logger("Skipping Shadows Of Disdain quest due to conditions met.");
            return;
        }

        Core.addDrop(...rewards);
        Farm.experience(95);
        ED.getSet();

        // Obtain Titan Drakath if not already owned
        if (!Core.checkInventory("Titan Drakath")) {
            Core.logger("Hunting for Titan Drakath.");
            TGM.buyAllMerge("Titan Drakath");
        }

        Core.logger(`Reward Chosen: ${ShadowsOfDisdainRewards[disdainReward].replaceAll("_", " ")}`);

        // Main farming loop
        while (!bot.shouldExit && !shouldReturnEarly) {
            Core.ensureAccept(9002);

            // Collect Chaos War Medals
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("mountdoomskull", "Chaos Spider", "Chaos War Medal", 1000, { isTemp: false });

            // Defeat Prince Drakath
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("finalshowdown", "Prince Drakath", "Drakath Pet", undefined, { isTemp: false });

            // Complete additional quest requirements
            CAV.fragmentsoftheLordsA();
            CAV.fragmentsoftheLordsB();
            Core.huntMonster("ultradrakath", "Champion of Chaos", "Trace of Chaos", 13, {
                isTemp: false,
                publicRoom: true,
            });

            // Purchase Chaorrupted Usurper
            Adv.buyItem("transformation", 2002, "Chaorrupted Usurper");

            // Handle quest completion
            if (completeOnce) {
                Core.ensureComplete(9002);
                Core.logger("Shadows Of Disdain quest completed.");
                return;
            }

            if (rewardSelection === ShadowsOfDisdainRewards.All) {
                Core.ensureCompleteChoose(9002, Core.questRewards(9002));
                if (Core.checkInventory(Core.questRewards(9002), undefined, { toInv: false })) {
                    Core.logger("All rewards present, exiting Shadows Of Disdain quest.");
                    return;
                }
            } else {
                // Complete for the specific reward if not owned
                if (!Core.checkInventory(disdainReward)) {
                    Core.ensureComplete(9002, disdainReward);
                    Core.logger(
                        `Shadows Of Disdain quest completed for reward: ${ShadowsOfDisdainRewards[disdainReward]}`,
                    );
                }
                break;
            }
        }
    }

    persistingMayhem(
        rewardSelection: PersistingMayhemRewards = PersistingMayhemRewards.None,
        completeOnce = false,
    ): void {
        if (!Core.isCompletedBefore(9002)) {
            Core.logger('Quest not unlocked [9003], doing "Shadows of Disdain"');
            this.shadowsOfDisdain(undefined, true);
        }

        const rewards = Core.questRewards(9003);
        const mayhemReward = configEnum(
            "Persisting Mayhem",
            PersistingMayhemRewards,
            PersistingMayhemRewards.Hollowborn_Benevolent,
        );

        Core.logger(`Reward Chosen: ${PersistingMayhemRewards[mayhemReward].replaceAll("_", " ")}`);

        // Check if we should return early based on inventory conditions and 'completeOnce' flag
        const shouldReturnEarly =
            (mayhemReward === PersistingMayhemRewards.None && !completeOnce) ||
            (mayhemReward === PersistingMayhemRewards.All &&
                Core.checkInventory(rewards, undefined, { toInv: false }) &&
                Story.questProgression(9003)) ||
            (mayhemReward !== PersistingMayhemRewards.None &&
                Core.checkInventory(mayhemReward, undefined, { toInv: false }) &&
                Story.questProgression(9003));
        // Specific reward present and quest progression is complete

        if (shouldReturnEarly) {
            if (mayhemReward === PersistingMayhemRewards.None && !completeOnce) {
                Core.logger(
                    "Conditions met: Reward is None and completeOnce is false. Exiting Persisting Mayhem quest.",
                );
            } else if (
                mayhemReward === PersistingMayhemRewards.All &&
                Core.checkInventory(rewards, undefined, { toInv: false }) &&
                Story.questProgression(9003)
            ) {
                Core.logger(
                    "Conditions met: All rewards present and quest progression is complete. Exiting Persisting Mayhem quest.",
                );
            } else if (
                mayhemReward !== PersistingMayhemRewards.None &&
                Core.checkInventory(mayhemReward, undefined, { toInv: false }) &&
                Story.questProgression(9003)
            ) {
                Core.logger(
                    "Conditions met: Specific reward present and quest progression is complete. Exiting Persisting Mayhem quest.",
                );
            }

            return;
            // Signal to exit
        }

        Core.addDrop(...rewards);
        Farm.experience(95);

        while (!bot.shouldExit && !shouldReturnEarly) {
            // Accept the quest
            Core.ensureAccept(9003);

            // Farm for the required item
            Core.huntMonster("ultradrakath", "Champion of Chaos", "Trace of Chaos", 13, {
                isTemp: false,
                publicRoom: true,
            });

            if (completeOnce) {
                // Complete the quest and exit if only completing once
                Core.ensureComplete(9003);
                Core.logger("Persisting Mayhem quest completed.");
                return;
            } else {
                if (rewardSelection === PersistingMayhemRewards.All) {
                    Core.ensureCompleteChoose(9003, Core.questRewards(9003));
                    if (Core.checkInventory(Core.questRewards(9003), undefined, { toInv: false })) {
                        Core.logger("All rewards present, exiting Persisting Mayhem quest.");
                        return;
                    }
                } else {
                    // Complete the quest for the specific reward if not owned
                    if (!Core.checkInventory(rewardSelection)) {
                        Core.ensureComplete(9003, rewardSelection);
                        Core.logger(
                            `Persisting Mayhem quest completed for reward: ${PersistingMayhemRewards[rewardSelection]}`,
                        );
                    }
                }
            }
        }
    }

    optionsStorage = "HollowbornChaosEnvoy";
    dontPreconfigure = true;
    options = [
        option.choice(
            "Stirring Discord",
            "Stirring Discord Reward",
            "Reward Selection for Stirring Discord",
            choices(StirringDiscordRewards),
            StirringDiscordRewards[StirringDiscordRewards.None],
        ),
        option.choice(
            "In The Beasts Shadow",
            "In The Beasts Shadow Reward",
            "Reward Selection for Stirring Discord",
            choices(InTheBeastsShadowRewards),
            InTheBeastsShadowRewards[InTheBeastsShadowRewards.None],
        ),
        option.choice(
            "Unique Quarry",
            "Unique Quarry Reward",
            "Reward Selection for Stirring Discord",
            choices(UniqueQuarryRewards),
            UniqueQuarryRewards[UniqueQuarryRewards.None],
        ),
        option.choice(
            "Wavering Illusions",
            "Wavering Illusions Reward",
            "Reward Selection for Stirring Discord",
            choices(WaveringIllusionsRewards),
            WaveringIllusionsRewards[WaveringIllusionsRewards.None],
        ),
        option.choice(
            "Shadows Of Disdain",
            "Shadows Of Disdain Reward",
            "Reward Selection for Stirring Discord",
            choices(ShadowsOfDisdainRewards),
            ShadowsOfDisdainRewards[ShadowsOfDisdainRewards.None],
        ),
        option.choice(
            "Persisting Mayhem",
            "Persisting Mayhem Reward",
            "Reward Selection for Stirring Discord",
            choices(PersistingMayhemRewards),
            PersistingMayhemRewards[PersistingMayhemRewards.None],
        ),
        option.bool(
            "getAll",
            "Get all items",
            "Some quests need to be done multiple times in order to get everything, if true the bot will continue until it has everything from that quest before moving on. Recommended setting: True",
            true,
        ),
        option.bool("BankAfter", "Bank Rewards", "bank Rewards after", true),
        Core.skipOptions,
    ];
}
