/*
name: Blood Titan Merge [Mem]
description: This bot will farm the items belonging to the selected mode for the Blood Titan Merge [617] in /classhalla
tags: blood, titan, merge, classhallc, horns, titans, gilded, crusher
*/
// Port of Scripts/Other/MergeShops/BloodTitanMerge[mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { TitanAttackStory } from "../../story/TitanAttack";

const Adv = new CoreAdvanced();
const Tas = new TitanAttackStory();

export class BloodTitanMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                Core.logger("req is NULL");
                return;
            }

            switch (req.name) {
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
                //#endregion
                case "Blood Titan Token":
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(
                        ...[
                            ...Core.ensureLoad(9253).requirements.map((item) => item.name),
                            ...Core.ensureLoad(2908).requirements.map((item) => item.name),
                        ],
                    );
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9253);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        if (!Core.checkInventory("Blood Titan's Tribute")) {
                            Core.ensureAccept(2908);
                            Core.huntMonster("bloodtitan", "Blood Titan", "Blood Titan's Phial", 1, {
                                isTemp: false,
                                log: false,
                            });
                            Core.huntMonster("titandrakath", "Titan Drakath", "Titanic Drakath's Blood", 1, {
                                isTemp: false,
                                log: false,
                            });
                            Core.huntMonster("desoloth", "Desoloth", "Desoloth's Blood", 1, {
                                isTemp: false,
                                log: false,
                            });
                            Core.huntMonster("ultracarnax", "Ultra-Carnax", "Ultra Carnax's Blood", 1, {
                                isTemp: false,
                                log: false,
                            });
                            Core.ensureComplete(2908);
                            bot.wait.forPickup("Blood Titan's Tribute");
                        }
                        Core.huntMonster("bloodtitan", "Ultra Blood Titan", "Ultra Blood Titan Defeated", 1, {
                            isTemp: false,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        Tas.doAll();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("classhallc", 617, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("16641", "Blood Titan", 'Mode: [select] only\nShould the bot buy "Blood Titan" ?', false),
        option.bool(
            "16650",
            "Blood Titan Horns",
            'Mode: [select] only\nShould the bot buy "Blood Titan Horns" ?',
            false,
        ),
        option.bool(
            "17253",
            "Titan's Gilded Crusher",
            'Mode: [select] only\nShould the bot buy "Titan\'s Gilded Crusher" ?',
            false,
        ),
        option.bool(
            "48200",
            "Blood Titan Armor",
            'Mode: [select] only\nShould the bot buy "Blood Titan Armor" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BloodTitanMerge.select,
});

export default function main(): void {
    const script = new BloodTitanMerge();
    Core.bankingBlackList.push("Blood Titan Token");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
