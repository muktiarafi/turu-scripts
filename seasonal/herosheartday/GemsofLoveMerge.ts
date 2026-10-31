/*
name: Gems of Love Merge Shop
description: This script farms the items from Gems of Love Merge Shop.
tags: seasonal, love, merge, gemsoflove, heros heart day, beleen
*/
// Port of Scripts/Seasonal/HerosHeartDay/GemsofLoveMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class GemsofLoveMerge {
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
                case "White Oval":

                case "Blush Brilliant":

                case "Pink Pear":

                case "Half Rose":

                case "Cerise Trillian":

                case "Ruby Heart":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(7375);
                        Core.huntMonster("greed", "Goregold", "Stolen Gem Found", undefined, { log: false });
                        Core.ensureComplete(7375, req.id);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "White Box":

                case "Oval Setting":

                case "Sparkles":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(7369);
                        Core.huntMonster("pastelia", "Cutie Makai", "White Box Found", undefined, { log: false });
                        Core.ensureComplete(7369, req.id);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Blush Box":

                case "Brilliant Setting":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(7370);
                        Core.huntMonster("dwarfhold", "Gemrald", "Blush Box Found", undefined, { log: false });
                        Core.ensureComplete(7370, req.id);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Pink Box":

                case "Pear Setting":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(7371);
                        Core.huntMonster("earthstorm", "Amethite", "Pink Box Found", undefined, { log: false });
                        Core.ensureComplete(7371, req.id);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Rose Box":

                case "Half Rose Setting":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(7372);
                        Core.huntMonster("stalagbite", "Stalagbite", "Rose Box Found", undefined, { log: false });
                        Core.ensureComplete(7372, req.id);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Cerise Box":

                case "Trillian Setting":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(7373);
                        Core.huntMonster("castleofglass", "Chihuly", "Cerise Box Found", undefined, { log: false });
                        Core.ensureComplete(7373, req.id);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Ruby Box":

                case "Heart Setting":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(7374);
                        Core.huntMonster("beleensdream", "Heart Elemental", "Ruby Box Found", undefined, {
                            log: false,
                        });
                        Core.ensureComplete(7374, req.id);
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("love", 1835, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "53363",
            "Ring of White Diamonds Cape",
            'Mode: [select] only\nShould the bot buy "Ring of White Diamonds Cape" ?',
            false,
        ),
        option.bool(
            "53357",
            "White Diamond Gem Pet",
            'Mode: [select] only\nShould the bot buy "White Diamond Gem Pet" ?',
            false,
        ),
        option.bool(
            "53364",
            "Ring of Blush Brilliants Cape",
            'Mode: [select] only\nShould the bot buy "Ring of Blush Brilliants Cape" ?',
            false,
        ),
        option.bool(
            "53358",
            "Blush Brilliant Gem Pet",
            'Mode: [select] only\nShould the bot buy "Blush Brilliant Gem Pet" ?',
            false,
        ),
        option.bool(
            "53365",
            "Ring of Pink Pears Cape",
            'Mode: [select] only\nShould the bot buy "Ring of Pink Pears Cape" ?',
            false,
        ),
        option.bool(
            "53359",
            "Pink Pear Gem Pet",
            'Mode: [select] only\nShould the bot buy "Pink Pear Gem Pet" ?',
            false,
        ),
        option.bool(
            "53366",
            "Ring of Rose Hexagons Cape",
            'Mode: [select] only\nShould the bot buy "Ring of Rose Hexagons Cape" ?',
            false,
        ),
        option.bool(
            "53360",
            "Rose Hexagon Gem Pet",
            'Mode: [select] only\nShould the bot buy "Rose Hexagon Gem Pet" ?',
            false,
        ),
        option.bool(
            "53367",
            "Ring of Cerise Trillians Cape",
            'Mode: [select] only\nShould the bot buy "Ring of Cerise Trillians Cape" ?',
            false,
        ),
        option.bool(
            "53361",
            "Cerise Trillian Gem Pet",
            'Mode: [select] only\nShould the bot buy "Cerise Trillian Gem Pet" ?',
            false,
        ),
        option.bool(
            "53368",
            "Ring of Ruby Hearts Cape",
            'Mode: [select] only\nShould the bot buy "Ring of Ruby Hearts Cape" ?',
            false,
        ),
        option.bool(
            "53362",
            "Ruby Heart Gem Pet",
            'Mode: [select] only\nShould the bot buy "Ruby Heart Gem Pet" ?',
            false,
        ),
        option.bool(
            "53369",
            "Ring of Gems Cape",
            'Mode: [select] only\nShould the bot buy "Ring of Gems Cape" ?',
            false,
        ),
        option.bool("53371", "Ring of Gems", 'Mode: [select] only\nShould the bot buy "Ring of Gems" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: GemsofLoveMerge.select,
});

export default function main(): void {
    const script = new GemsofLoveMerge();
    Core.bankingBlackList.push(
        "White Oval",
        "White Box",
        "Oval Setting",
        "Sparkles",
        "Blush Brilliant",
        "Blush Box",
        "Brilliant Setting",
        "Pink Pear",
        "Pink Box",
        "Pear Setting",
        "Half Rose",
        "Rose Box",
        "Half Rose Setting",
        "Cerise Trillian",
        "Cerise Box",
        "Trillian Setting",
        "Ruby Heart",
        "Ruby Box",
        "Heart Setting",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
