/*
name: null
description: null
tags: null
*/
// Port of Scripts/Hollowborn/HollowbornLichKing/CoreHollowbornLichKing.cs.

import { bot, choices, option } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { configEnum, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreHollowborn } from "../CoreHollowborn";
import { HollowSoul } from "../materials/HollowSoul";
import { CoreLegion } from "../../legion/CoreLegion";
import { LetItBurn } from "../../legion/legionmaterials/LetitBurn(SoulEssence)";
import { AnotherOneBitesTheDust } from "../../legion/legionmaterials/SoulSand";
import { UndeadLegionMerge } from "../../legion/mergeshops/UndeadLegionMerge";
import { CoreLR } from "../../legion/revenant/CoreLR";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const HB = new CoreHollowborn();
const Legion = new CoreLegion();
const undeadLegionMerge = new UndeadLegionMerge();
const anotherOneBitesTheDust = new AnotherOneBitesTheDust();
const hollowSoul = new HollowSoul();
const letItBurn = new LetItBurn();
const coreLR = new CoreLR();

export enum DraftlessRewards {
    Soul_Fragment = 84835,
    Hollowborn_Undead_Warrior = 84873,
    Hollowborn_Underworld_Legacy_Horns = 84876,
    Hollowborn_Underworld_Legacy_Helm = 84877,
    All,
    None,
}

export enum FlowStressRewards {
    Lich_King_Fragment = 84836,
    Hollowborn_Legion_Champion = 84872,
    Hollowborn_Undead_Legacy_Horns = 84874,
    Hollowborn_Undead_Legacy_Helm = 84875,
    Hollowborn_Legion_Champion_Crest = 84878,
    Hollowborn_Soul_Eater_Blade = 84879,
    All,
    None,
}

export enum CounterblowRewards {
    Hollowborn_Soul_Eater_Blades = 84880,
    Hollowborn_Lich_Kings_Pride = 84882,
    Hollowborn_Lich_Kings_Morph = 84885,
    Hollowborn_Lich_Kings_Flaming_Skull = 84886,
    Hollowborn_Apocalypse_Flame = 84888,
    Hollowborn_Apocalypse_Flames = 84889,
    Altar_Of_the_Hollowborn_Caladbolg = 84901,
    Hollowborn_Shadow_of_the_Legion = 84919,
    All,
    None,
}

export enum HeatTreatmentRewards {
    Hollowborn_Lich_King = 84881,
    Hollowborn_Lich_Kings_Horns = 84883,
    Hollowborn_Lich_Kings_Hood = 84884,
    Hollowborn_Lich_Kings_Cloak = 84887,
    All,
    None,
}

export class CoreHollowbornLichKing {
    draftlessTurnin = 1;
    flowStressTurnin = 1;
    heatTreatmentTurnin = 1;
    counterblowTurnin = 1;

    getAll(): void {
        Core.logger("Startup may take a moment. Please be patient!");
        const getAllDrops = bot.config!.get<boolean>("getAll");
        const BankAfter = bot.config!.get<boolean>("BankAfter");
        let optionsLogged = false;

        const questDictionary = new Map<string, [Order: number, Action: () => void]>([
            [
                "Draftless",
                [
                    9637,
                    (() =>
                        this.draftless(
                            getAllDrops
                                ? DraftlessRewards.All
                                : configEnum("Draftless", DraftlessRewards, DraftlessRewards.Soul_Fragment),
                            !getAllDrops && BankAfter,
                        )) as () => void,
                ],
            ],
            [
                "Flow Stress",
                [
                    9638,
                    (() =>
                        this.flowStress(
                            getAllDrops
                                ? FlowStressRewards.All
                                : configEnum("Flow Stress", FlowStressRewards, FlowStressRewards.Lich_King_Fragment),
                            !getAllDrops && BankAfter,
                        )) as () => void,
                ],
            ],
            [
                "Heat Treatment",
                [
                    9639,
                    (() =>
                        this.heatTreatment(
                            getAllDrops
                                ? HeatTreatmentRewards.All
                                : configEnum(
                                      "Heat Treatment",
                                      HeatTreatmentRewards,
                                      HeatTreatmentRewards.Hollowborn_Lich_King,
                                  ),
                            !getAllDrops && BankAfter,
                        )) as () => void,
                ],
            ],
            [
                "Counterblow",
                [
                    9640,
                    (() =>
                        this.counterblow(
                            getAllDrops
                                ? CounterblowRewards.All
                                : configEnum(
                                      "Counterblow",
                                      CounterblowRewards,
                                      CounterblowRewards.Hollowborn_Soul_Eater_Blades,
                                  ),
                            !getAllDrops && BankAfter,
                        )) as () => void,
                ],
            ],
        ]);

        const questOrder = ["Draftless", "Flow Stress", "Heat Treatment", "Counterblow"];

        for (const quest of questOrder) {
            const questConfig = bot.config?.get<string>(quest) ?? "";

            //Quest/Item Requirements:
            this.checkReqs();
            //Requirements:

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
                    Core.toBank(...Core.questRewards(order).filter((x) => !"Soul Fragment".includes(x)));
                }
            }
            Core.cancelRegisteredQuests();
        }
    }

    draftless(rewardSelection: DraftlessRewards = DraftlessRewards.All, completeOnce = false, quant = 1): void {
        Core.logger(
            quant > 1
                ? `~~Draftless~~[Farm Mode], Soul Fragment: ${(bot.inventory.items?.find((x) => x.name === "Soul Fragment") ?? null)?.quantity ?? 0} / ${quant}`
                : "~~Draftless [Set/Story Mode]~~",
        );
        const rewards = Core.questRewards(9637).filter((x) => !"Soul Fragment".includes(x));

        let DraftlessReward: DraftlessRewards;
        DraftlessReward = rewardSelection;

        const shouldReturnEarly =
            DraftlessReward === DraftlessRewards.None ||
            (quant > 1 &&
                DraftlessReward === DraftlessRewards.Soul_Fragment &&
                Core.checkInventory("Soul Fragment", quant)) ||
            (DraftlessReward !== DraftlessRewards.All &&
                DraftlessReward !== DraftlessRewards.Soul_Fragment &&
                Core.checkInventory(DraftlessReward, undefined, { toInv: false }) &&
                !completeOnce) ||
            (DraftlessReward === DraftlessRewards.All && Core.checkInventory(rewards, undefined, { toInv: false }));

        if (shouldReturnEarly) {
            Core.logger(
                DraftlessReward === DraftlessRewards.Soul_Fragment
                    ? `Soul Fragment: ${(bot.inventory.items?.find((x) => x.name === "Soul Fragment") ?? null)?.quantity ?? 0} / ${quant} Continuing`
                    : "Conditions met to skip `Draftless` quest.",
            );
            return;
        }

        Core.addDrop(...rewards);
        Core.addDrop("Soul Fragment");
        Core.logger(`Reward Chosen: ${configEnum("Draftless", DraftlessRewards, DraftlessRewards.Soul_Fragment)}`);

        this.checkReqs();
        while (!bot.shouldExit) {
            if (DraftlessReward === DraftlessRewards.All) {
                for (const item of rewards) {
                    Core.logger(Core.checkInventory(item, undefined, { toInv: false }) ? `${item}: ✅` : `${item} ❌`);
                }
            }
            if (DraftlessReward === DraftlessRewards.Soul_Fragment) {
                Core.farmingLogger("Soul Fragment", quant);
            }

            if (
                (DraftlessReward === DraftlessRewards.All &&
                    Core.checkInventory(rewards, undefined, { toInv: false })) ||
                (DraftlessReward === DraftlessRewards.Soul_Fragment && Core.checkInventory("Soul Fragment", quant)) ||
                (DraftlessReward !== DraftlessRewards.All &&
                    DraftlessReward !== DraftlessRewards.Soul_Fragment &&
                    Core.checkInventory(DraftlessReward, undefined, { toInv: false }))
            ) {
                break;
            }

            Core.ensureAccept(9637);

            Legion.farmLegionToken(100);
            Farm.battleUnderB("Undead Energy", 50);
            hollowSoul.getYaSoulsHeeeere(25);

            if (completeOnce) {
                Core.ensureCompleteChoose(9637, rewards);
                Core.logger(`Draftless quest completed x${this.draftlessTurnin++}.`);
                break;
            } else {
                if (
                    (DraftlessReward === DraftlessRewards.All && !Core.checkInventory(rewards)) ||
                    (DraftlessReward === DraftlessRewards.Soul_Fragment && !Core.checkInventory("Soul Fragment", quant))
                ) {
                    if (DraftlessReward === DraftlessRewards.Soul_Fragment) {
                        Core.ensureComplete(9637, 84835);
                    } else {
                        Core.ensureCompleteChoose(9637, rewards);
                    }
                    Core.logger(`Draftless quest completed x${this.draftlessTurnin++}.`);
                } else {
                    // C# tests `!= All || != Soul_Fragment` (always true), so with every reward owned it
                    // turned the quest in for the reward "All".
                    if (
                        DraftlessReward !== DraftlessRewards.All &&
                        DraftlessReward !== DraftlessRewards.Soul_Fragment
                    ) {
                        Core.ensureComplete(9637, DraftlessReward);
                        Core.logger(`Draftless quest completed x${this.draftlessTurnin++}.`);
                    }
                }
            }
            bot.wait.forPickup("Soul Fragment");
        }
    }

    flowStress(rewardSelection: FlowStressRewards = FlowStressRewards.All, completeOnce = false, quant = 1): void {
        Core.logger(
            quant > 1
                ? `~~FlowStress~~[Farm Mode], Lich King Fragment: ${(bot.inventory.items?.find((x) => x.name === "Soul Fragment") ?? null)?.quantity ?? 0} / ${quant}`
                : "~~FlowStress [Set/Story Mode]~~",
        );
        if (!Core.isCompletedBefore(9637)) {
            Core.logger('Quest not unlocked [9638], doing "Draftless"');
            this.draftless(undefined, true);
        }

        const rewards = Core.questRewards(9638).filter((x) => !"Lich King Fragment".includes(x));

        let FlowStressReward: FlowStressRewards;
        FlowStressReward = rewardSelection;

        const shouldReturnEarly =
            (FlowStressReward === FlowStressRewards.All && Core.checkInventory(rewards, undefined, { toInv: false })) ||
            FlowStressReward === FlowStressRewards.None ||
            (quant > 1 &&
                FlowStressReward === FlowStressRewards.Lich_King_Fragment &&
                Core.checkInventory("Lich King Fragment", quant)) ||
            (FlowStressReward !== FlowStressRewards.All &&
                FlowStressReward !== FlowStressRewards.Lich_King_Fragment &&
                Core.checkInventory(FlowStressReward, quant) &&
                !completeOnce);

        if (shouldReturnEarly) {
            Core.logger(
                FlowStressReward === FlowStressRewards.Lich_King_Fragment
                    ? `Lich King Fragment: ${(bot.inventory.items?.find((x) => x.name === "Soul Fragment") ?? null)?.quantity ?? 0} / ${quant} Continuing`
                    : "Conditions met to skip `Flow Stress` quest.",
            );
            return;
        }

        Core.addDrop(...rewards);
        Core.addDrop("Lich King Fragment");
        Core.logger(`Reward Chosen: ${FlowStressReward}`);
        this.checkReqs();
        while (!bot.shouldExit) {
            if (FlowStressReward === FlowStressRewards.All) {
                for (const item of rewards) {
                    Core.logger(Core.checkInventory(item, undefined, { toInv: false }) ? `${item}: ✅` : `${item} ❌`);
                }
            }
            if (FlowStressReward === FlowStressRewards.Lich_King_Fragment) {
                Core.farmingLogger("Lich King Fragment", quant);
            }

            if (
                (FlowStressReward === FlowStressRewards.All && Core.checkInventory(rewards)) ||
                (FlowStressReward === FlowStressRewards.Lich_King_Fragment &&
                    Core.checkInventory("Lich King Fragment", quant)) ||
                (FlowStressReward !== FlowStressRewards.All &&
                    FlowStressReward !== FlowStressRewards.Lich_King_Fragment &&
                    Core.checkInventory(FlowStressReward, undefined, { toInv: false }))
            ) {
                break;
            }

            Core.ensureAccept(9638);

            this.draftless(DraftlessRewards.Soul_Fragment, false, 6);
            anotherOneBitesTheDust.soulSand(1);
            Legion.farmLegionToken(1000);

            if (completeOnce) {
                Core.ensureCompleteChoose(9638, rewards);
                Core.logger(`Flow Stress quest completed x${this.flowStressTurnin++}.`);
                break;
            } else {
                if (
                    (FlowStressReward === FlowStressRewards.All && !Core.checkInventory(rewards)) ||
                    (FlowStressReward === FlowStressRewards.Lich_King_Fragment &&
                        !Core.checkInventory("Lich King Fragment", quant))
                ) {
                    if (FlowStressReward === FlowStressRewards.Lich_King_Fragment) {
                        Core.ensureComplete(9638, 84836);
                    } else {
                        Core.ensureCompleteChoose(9638, rewards);
                    }
                    Core.logger(`Flow Stress quest completed x${this.flowStressTurnin++}.`);
                } else {
                    // C# tests `!= All || != Lich_King_Fragment` (always true), so with every reward owned it
                    // turned the quest in for the reward "All".
                    if (
                        FlowStressReward !== FlowStressRewards.All &&
                        FlowStressReward !== FlowStressRewards.Lich_King_Fragment
                    ) {
                        Core.ensureComplete(9638, FlowStressReward);
                        Core.logger(`Flow Stress quest completed x${this.flowStressTurnin++}.`);
                    }
                }
            }
            bot.wait.forPickup("Lich King Fragment");
        }
    }

    heatTreatment(
        rewardSelection: HeatTreatmentRewards = HeatTreatmentRewards.All,
        completeOnce = false,
        quant = 1,
    ): void {
        Core.logger(quant > 1 ? "~~HeatTreatment~~[Farm Mode]" : "~~HeatTreatment [Set/Story Mode]~~");
        if (!Core.isCompletedBefore(9638)) {
            Core.logger('Quest not unlocked [9639], doing "Flow Stress"');
            this.flowStress(undefined, true);
        }

        const rewards = Core.questRewards(9639);

        let HeatTreatmentReward: HeatTreatmentRewards;
        HeatTreatmentReward = rewardSelection;

        const shouldReturnEarly =
            (HeatTreatmentReward === HeatTreatmentRewards.All &&
                Core.checkInventory(rewards, undefined, { toInv: false })) ||
            HeatTreatmentReward === HeatTreatmentRewards.None ||
            (HeatTreatmentReward !== HeatTreatmentRewards.All &&
                Core.checkInventory(HeatTreatmentReward, quant) &&
                !completeOnce);

        if (shouldReturnEarly) {
            Core.logger("Conditions met to skip Heat Treatment quest.");
            return;
        }

        Core.addDrop(...rewards);

        Core.logger(`Reward Chosen: ${HeatTreatmentReward}`);

        this.checkReqs();
        while (!bot.shouldExit) {
            if (HeatTreatmentReward === HeatTreatmentRewards.All) {
                for (const item of rewards) {
                    Core.logger(Core.checkInventory(item, undefined, { toInv: false }) ? `${item}: ✅` : `${item} ❌`);
                }
            }

            if (
                (HeatTreatmentReward === HeatTreatmentRewards.All && Core.checkInventory(rewards)) ||
                (HeatTreatmentReward !== HeatTreatmentRewards.All &&
                    Core.checkInventory(HeatTreatmentReward, undefined, { toInv: false }))
            ) {
                break;
            }

            Core.ensureAccept(9639);
            this.flowStress(FlowStressRewards.Lich_King_Fragment, false, 6);
            this.draftless(DraftlessRewards.Soul_Fragment, false, 24);
            letItBurn.soulEssence(1);
            Legion.farmLegionToken(10000);

            if (completeOnce) {
                Core.ensureCompleteChoose(9639, rewards);
                Core.logger(`Heat Treatment quest completed x${this.heatTreatmentTurnin++}.`);
                break;
            } else {
                if (HeatTreatmentReward === HeatTreatmentRewards.All && !Core.checkInventory(rewards)) {
                    Core.ensureCompleteChoose(9639, rewards);
                    Core.logger(`Heat Treatment quest completed x${this.heatTreatmentTurnin++}.`);
                } else {
                    if (HeatTreatmentReward !== HeatTreatmentRewards.All) {
                        Core.ensureComplete(9639, HeatTreatmentReward);
                        Core.logger(`Heat Treatment quest completed x${this.heatTreatmentTurnin++}.`);
                    }
                }
            }
        }
    }

    counterblow(rewardSelection: CounterblowRewards, completeOnce = false, quant = 1): void {
        if (!Core.isCompletedBefore(9639)) {
            Core.logger('Quest not unlocked [9640], doing "Heat Treatment"');
            this.heatTreatment(undefined, true);
        }

        const rewards = Core.questRewards(9640);
        let CounterblowReward: CounterblowRewards;
        CounterblowReward = rewardSelection;

        const shouldReturnEarly =
            (CounterblowReward === CounterblowRewards.All && Core.checkInventory(rewards, quant, { toInv: false })) ||
            CounterblowReward === CounterblowRewards.None ||
            (CounterblowReward !== CounterblowRewards.All &&
                Core.checkInventory(CounterblowReward, quant) &&
                !completeOnce);

        if (shouldReturnEarly) {
            Core.logger("Conditions met to skip Counterblow quest.");
            return;
        }

        Core.logger(
            quant > 1 || CounterblowReward !== CounterblowRewards.All
                ? "~~Counterblow~~[Farm Mode]"
                : "~~Counterblow [Set/Story Mode]~~",
        );

        Core.addDrop(...rewards);
        Core.logger(`Reward Chosen: ${CounterblowReward}`);

        this.checkReqs();
        while (!bot.shouldExit) {
            if (CounterblowReward === CounterblowRewards.All) {
                for (const item of rewards) {
                    Core.logger(Core.checkInventory(item, undefined, { toInv: false }) ? `${item}: ✅` : `${item} ❌`);
                }
            }

            if (
                (CounterblowReward === CounterblowRewards.All && Core.checkInventory(rewards)) ||
                (CounterblowReward !== CounterblowRewards.All &&
                    Core.checkInventory(CounterblowReward, undefined, { toInv: false }))
            ) {
                break;
            }

            Core.ensureAccept(9640);
            this.flowStress(FlowStressRewards.Lich_King_Fragment, false, 12);
            this.draftless(DraftlessRewards.Soul_Fragment, false, 36);
            letItBurn.soulEssence(3);
            coreLR.conquestWreath(4);
            coreLR.exaltedCrown(4);
            coreLR.revenantSpellscroll(4);

            if (completeOnce) {
                Core.ensureCompleteChoose(9640, rewards);
                Core.logger(`Counterblow quest completed x${this.counterblowTurnin++}.`);
                break;
            } else {
                if (CounterblowReward === CounterblowRewards.All && !Core.checkInventory(rewards)) {
                    Core.ensureCompleteChoose(9640, rewards);
                    Core.logger(`Counterblow quest completed x${this.counterblowTurnin++}.`);
                } else {
                    if (CounterblowReward !== CounterblowRewards.All) {
                        Core.ensureComplete(9640, CounterblowReward);
                        Core.logger(`Counterblow quest completed x${this.counterblowTurnin++}.`);
                    }
                }
            }
        }
    }

    private checkReqs(): void {
        Farm.experience(95);

        //Quest/Item Requirements:
        Legion.joinLegion();

        if (!Core.checkInventory("Undead Champion")) {
            Adv.buyItem("underworld", 216, "Undead Champion");
        }

        if (!Core.checkInventory("Ultimate Lich King")) {
            undeadLegionMerge.buyAllMerge("Ultimate Lich King");
        }

        if (!Core.checkInventory("Ultimate Lich King Helm")) {
            undeadLegionMerge.buyAllMerge("Ultimate Lich King Helm");
        }

        if (!Core.checkInventory(55157)) {
            HB.hardcoreContract();
        }
    }

    optionsStorage = "HollowbornLichKing";
    dontPreconfigure = true;
    options = [
        option.bool(
            "getAll",
            "Get all items",
            "Some quests need to be done multiple times in order to get everything, " +
                "if true the bot will continue untill it has everything from that quest before moving on" +
                "\nRecommended setting: True",
            true,
        ),
        option.bool("BankAfter", "Bank Rewards", "bank Rewards after", true),
        Core.skipOptions,
        option.choice(
            "Draftless",
            "Draftless Reward",
            "Reward Selection for Draftless",
            choices(DraftlessRewards),
            DraftlessRewards[DraftlessRewards.All],
        ),
        option.choice(
            "Flow Stress",
            "FlowStress Reward",
            "Reward Selection for Flow Stress",
            choices(FlowStressRewards),
            FlowStressRewards[FlowStressRewards.All],
        ),
        option.choice(
            "Heat Treatment",
            "Heat Treatment Reward",
            "Reward Selection for Heat Treatment",
            choices(HeatTreatmentRewards),
            HeatTreatmentRewards[HeatTreatmentRewards.All],
        ),
        option.choice(
            "Counterblow",
            "Counterblow Reward",
            "Reward Selection for Counterblow",
            choices(CounterblowRewards),
            CounterblowRewards[CounterblowRewards.All],
        ),
    ];
}
