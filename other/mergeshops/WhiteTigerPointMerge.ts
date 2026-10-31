/*
name: WhiteTigerPoint Merge
description: This bot will farm the items belonging to the selected mode for the WhiteTigerPoint Merge [2600] in /whitetigerpoint
tags: whitetigerpoint, merge, whitetigerpoint, aureate, white, tiger, starbound, morph, cowl, starstruck, komokutens, star, spear, byakko, house
*/
// Port of Scripts/Other/MergeShops/WhiteTigerPointMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreOasis } from "../../story/oasis/CoreOasis";

const COA = new CoreOasis();
const Adv = new CoreAdvanced();

export class WhiteTigerPointMerge {
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
                case "Byakko's Stardust":

                case "White Tiger Hair":

                case "White Tiger Locks":

                case "White Tiger Cape":

                case "Byakko's Aura":

                case "Komokuten's Star Wand":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("whitetigerpoint", "Byakko", req.name, quant, { isTemp: req.temp });
                        bot.wait.forPickup(req.name);
                    }
                    break;
                //#endregion
            }
        };
        COA.whitetigerpoint();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("whitetigerpoint", 2600, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "94631",
            "Aureate White Tiger",
            'Mode: [select] only\nShould the bot buy "Aureate White Tiger" ?',
            false,
        ),
        option.bool(
            "94632",
            "Starbound White Tiger",
            'Mode: [select] only\nShould the bot buy "Starbound White Tiger" ?',
            false,
        ),
        option.bool(
            "94633",
            "White Tiger Mask Morph",
            'Mode: [select] only\nShould the bot buy "White Tiger Mask Morph" ?',
            false,
        ),
        option.bool(
            "94634",
            "White Tiger Cowl Visage",
            'Mode: [select] only\nShould the bot buy "White Tiger Cowl Visage" ?',
            false,
        ),
        option.bool("94635", "White Tiger Mask", 'Mode: [select] only\nShould the bot buy "White Tiger Mask" ?', false),
        option.bool("94636", "White Tiger Cowl", 'Mode: [select] only\nShould the bot buy "White Tiger Cowl" ?', false),
        option.bool(
            "94638",
            "Starbound Tiger Cape",
            'Mode: [select] only\nShould the bot buy "Starbound Tiger Cape" ?',
            false,
        ),
        option.bool(
            "94639",
            "Starstruck Tiger Cape",
            'Mode: [select] only\nShould the bot buy "Starstruck Tiger Cape" ?',
            false,
        ),
        option.bool(
            "94640",
            "Komokuten's Star Spear",
            'Mode: [select] only\nShould the bot buy "Komokuten\'s Star Spear" ?',
            false,
        ),
        option.bool("94641", "Byakko Morph", 'Mode: [select] only\nShould the bot buy "Byakko Morph" ?', false),
        option.bool(
            "94645",
            "House Tiger Byakko",
            'Mode: [select] only\nShould the bot buy "House Tiger Byakko" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: WhiteTigerPointMerge.select,
});

export default function main(): void {
    const script = new WhiteTigerPointMerge();
    Core.bankingBlackList.push(
        "Byakko's Stardust",
        "White Tiger Hair",
        "White Tiger Locks",
        "White Tiger Cape",
        "Byakko's Aura",
        "Komokuten's Star Wand",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
