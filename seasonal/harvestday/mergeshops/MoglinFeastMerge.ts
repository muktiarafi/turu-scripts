/*
name: Moglin Feast Merge
description: This bot will farm the items belonging to the selected mode for the Moglin Feast Merge [2637] in /moglinfeast
tags: moglin, feast, merge, moglinfeast, fall, forest, traveler, morph, cap, fruit, assortment, fae, ruler, king, queen, assassin, scarf
*/
// Port of Scripts/Seasonal/HarvestDay/MergeShops/MoglinFeastMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreHarvestDay } from "../CoreHarvestDay";

const Adv = new CoreAdvanced();
const HarvestDay = new CoreHarvestDay();

export class MoglinFeastMerge {
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
                //#region Items not setup
                case "Golden Leaves":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(
                            10498,
                            ["moglinfeast", "Hay Fever Sylph", ClassType.Farm],
                            ["moglinfeast", "Redcap Mush", ClassType.Farm],
                            ["moglinfeast", "Fall Fae Queen", ClassType.Solo],
                        );
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Persimmon Branch":

                case "Fall Fruit Basket":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.huntMonster("moglinfeast", "Pumpkin Mimic", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Fae Dust":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.killMonster("moglinfeast", "r7", "Left", "*", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                case "Fall Fae Assassin Morph":

                case "Fall Fae Assassin Visage":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("moglinfeast", "Fall Fae Queen", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                //#endregion
            }
        };
        HarvestDay.moglinFeast();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("moglinfeast", 2637, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "94699",
            "Fall Forest Traveler",
            'Mode: [select] only\nShould the bot buy "Fall Forest Traveler" ?',
            false,
        ),
        option.bool(
            "94700",
            "Fall Forest Traveler Hair",
            'Mode: [select] only\nShould the bot buy "Fall Forest Traveler Hair" ?',
            false,
        ),
        option.bool(
            "94701",
            "Fall Forest Traveler Locks",
            'Mode: [select] only\nShould the bot buy "Fall Forest Traveler Locks" ?',
            false,
        ),
        option.bool(
            "94702",
            "Fall Forest Traveler Morph",
            'Mode: [select] only\nShould the bot buy "Fall Forest Traveler Morph" ?',
            false,
        ),
        option.bool(
            "94703",
            "Fall Forest Traveler Visage",
            'Mode: [select] only\nShould the bot buy "Fall Forest Traveler Visage" ?',
            false,
        ),
        option.bool(
            "94704",
            "Fall Forest Traveler Hat",
            'Mode: [select] only\nShould the bot buy "Fall Forest Traveler Hat" ?',
            false,
        ),
        option.bool(
            "94705",
            "Fall Forest Traveler Cap",
            'Mode: [select] only\nShould the bot buy "Fall Forest Traveler Cap" ?',
            false,
        ),
        option.bool(
            "94711",
            "Fall Fruit Assortment",
            'Mode: [select] only\nShould the bot buy "Fall Fruit Assortment" ?',
            false,
        ),
        option.bool("96967", "Fall Fae Ruler", 'Mode: [select] only\nShould the bot buy "Fall Fae Ruler" ?', false),
        option.bool("96968", "Fall Fae King", 'Mode: [select] only\nShould the bot buy "Fall Fae King" ?', false),
        option.bool("96969", "Fall Fae Queen", 'Mode: [select] only\nShould the bot buy "Fall Fae Queen" ?', false),
        option.bool(
            "96972",
            "Fall Fae Assassin",
            'Mode: [select] only\nShould the bot buy "Fall Fae Assassin" ?',
            false,
        ),
        option.bool(
            "96975",
            "Fall Fae Assassin Mask",
            'Mode: [select] only\nShould the bot buy "Fall Fae Assassin Mask" ?',
            false,
        ),
        option.bool(
            "96976",
            "Fall Fae Assassin Scarf",
            'Mode: [select] only\nShould the bot buy "Fall Fae Assassin Scarf" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: MoglinFeastMerge.select,
});

export default function main(): void {
    const script = new MoglinFeastMerge();
    Core.bankingBlackList.push(
        "Golden Leaves",
        "Persimmon Branch",
        "Fall Fruit Basket",
        "Fae Dust",
        "Fall Fae Assassin Morph",
        "Fall Fae Assassin Visage",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
