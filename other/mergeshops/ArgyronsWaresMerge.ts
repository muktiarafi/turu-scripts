/*
name: Argyrons Wares Merge
description: This bot will farm the items belonging to the selected mode for the Argyrons Wares Merge [2626] in /abaddoncave
tags: argyrons, wares, merge, abaddoncave, arachnosapien, abaddon, hybrid, spineback, horned, tarsus, abdomen, broodmaster, venom, plague, xl, guest, abbadon, guard
*/
// Port of Scripts/Other/MergeShops/ArgyronsWaresMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreStory } from "../../core/CoreStory";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const Story = new CoreStory();

export class ArgyronsWaresMerge {
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                return;
            }

            switch (req.name) {
                case "Dread Thread":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(10427);
                    // Arach-kids
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("abaddoncave", "Cursed Dreadspider", "Dreadspider Carapace", 9);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Abaddon Vertebrae":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(10428);
                    // Arachnosapien
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("abaddoncave", "Spineback Abaddon", "Abaddon Carapace");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Spineback Abaddon Guard":

                case "Spineback Abaddon Guest":

                case "Spineback Abaddon Carapace":

                case "Arachnosapien Locks":

                case "Arachnosapien Visage":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("abaddoncave", "Spineback Abaddon", req.name, quant, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Gold Voucher 100k":
                    Farm.voucher(req.name, req.quantity);
                    break;
                default: {
                    const shouldStop = !Adv.matsOnly || !this.dontStopMissingIng;
                    Core.logger(
                        `The bot hasn't been taught how to get ${req.name}.` +
                            (shouldStop ? " Please report the issue." : " Skipping"),
                        undefined,
                        { messageBox: shouldStop, stopBot: shouldStop },
                    );
                    break;
                }
            }
        };
        // Always ensure drops are added
        Core.addDrop(
            "Dread Thread",
            "Abaddon Vertebrae",
            "Arachnosapien Visage",
            "Arachnosapien Locks",
            "Spineback Abaddon Carapace",
        );
        this.preFarm();
        Adv.startBuyAllMerge("abaddoncave", 2626, findIngredients, buyOnlyThis, { buyMode });

        //#region findIngredients

        //#endregion
    }

    preFarm(): void {
        if (Core.isCompletedBefore(10427)) {
            return;
        }

        Story.killQuest(10427, "abaddoncave", "Cursed Dreadspider");
    }

    static readonly select = [
        option.bool("91172", "Arachnosapien", 'Mode: [select] only\nShould the bot buy "Arachnosapien" ?', false),
        option.bool("91173", "Abaddon Hybrid", 'Mode: [select] only\nShould the bot buy "Abaddon Hybrid" ?', false),
        option.bool(
            "91175",
            "Spineback Abaddon Helm",
            'Mode: [select] only\nShould the bot buy "Spineback Abaddon Helm" ?',
            false,
        ),
        option.bool(
            "91176",
            "Arachnosapien Helm",
            'Mode: [select] only\nShould the bot buy "Arachnosapien Helm" ?',
            false,
        ),
        option.bool(
            "91177",
            "Spineback Abaddon Visage",
            'Mode: [select] only\nShould the bot buy "Spineback Abaddon Visage" ?',
            false,
        ),
        option.bool(
            "91178",
            "Horned Arachnosapien Visage",
            'Mode: [select] only\nShould the bot buy "Horned Arachnosapien Visage" ?',
            false,
        ),
        option.bool(
            "91181",
            "Horned Arachnosapien Locks",
            'Mode: [select] only\nShould the bot buy "Horned Arachnosapien Locks" ?',
            false,
        ),
        option.bool(
            "91183",
            "Spineback Abaddon Tarsus",
            'Mode: [select] only\nShould the bot buy "Spineback Abaddon Tarsus" ?',
            false,
        ),
        option.bool(
            "91185",
            "Spineback Abaddon Abdomen",
            'Mode: [select] only\nShould the bot buy "Spineback Abaddon Abdomen" ?',
            false,
        ),
        option.bool(
            "91186",
            "Broodmaster Venom",
            'Mode: [select] only\nShould the bot buy "Broodmaster Venom" ?',
            false,
        ),
        option.bool(
            "91187",
            "Dual Broodmaster Venom",
            'Mode: [select] only\nShould the bot buy "Dual Broodmaster Venom" ?',
            false,
        ),
        option.bool(
            "91188",
            "Broodmaster Plague",
            'Mode: [select] only\nShould the bot buy "Broodmaster Plague" ?',
            false,
        ),
        option.bool(
            "91189",
            "Dual Broodmaster Plague",
            'Mode: [select] only\nShould the bot buy "Dual Broodmaster Plague" ?',
            false,
        ),
        option.bool(
            "91195",
            "XL Spineback Abaddon Guest",
            'Mode: [select] only\nShould the bot buy "XL Spineback Abaddon Guest" ?',
            false,
        ),
        option.bool(
            "91196",
            "XL Spineback Abaddon Guard",
            'Mode: [select] only\nShould the bot buy "XL Spineback Abaddon Guard" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ArgyronsWaresMerge.select,
});

export default function main(): void {
    const script = new ArgyronsWaresMerge();
    Core.bankingBlackList.push(
        "Dread Thread",
        "Abaddon Vertebrae",
        "Arachnosapien Visage",
        "Arachnosapien Locks",
        "Spineback Abaddon Carapace",
        "Spineback Abaddon Guest",
        "Spineback Abaddon Guard",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
