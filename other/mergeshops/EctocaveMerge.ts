/*
name: Ectocave Mergeshop
description: Gets any item you want in the Ectocave Mergeshop
tags: null
*/
// Port of Scripts/Other/MergeShops/EctocaveMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class EctocaveMerge {
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
                case "Ichorus Scythe Piece":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(3874);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("ectocave", "Ichor Dracolich", "Uncut Emerald", 9);
                        Core.huntMonster("ectocave", "Ektorax", "Brilliant Diamond");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Ichorus Egg":
                    if (!bot.player.isMember) {
                        break;
                    }
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("ectocave", "Ektorax", req.name, quant, { isTemp: req.temp });
                    break;
                case "Pure Ichor Gem":
                    if (!bot.player.isMember) {
                        break;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(3873);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("ectocave", "Ichor Draconian", "Uncut Ichor Gem", 50, { isTemp: req.temp });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Slime":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("ectocave", "Swamp Lurker", req.name, quant, { isTemp: req.temp });
                    break;
                case "Dragon Rogue Klinge":

                case "Dragon Rogue":

                case "Dragon Rogue Hood":

                case "Dragon Rogue Twin Klinge Cape":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("ectocave", "Ektorax", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Piece of Fabric":

                case "Bone":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("ectocave", "Ichor Draconian", req.name, quant, { isTemp: req.temp });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("ectocave", 1039, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "26839",
            "Slimed DragonMaster Scythe",
            'Mode: [select] only\nShould the bot buy "Slimed DragonMaster Scythe" ?',
            false,
        ),
        option.bool("26838", "Ektorax Pet", 'Mode: [select] only\nShould the bot buy "Ektorax Pet" ?', false),
        option.bool(
            "26076",
            "Slime Dragon Rogue",
            'Mode: [select] only\nShould the bot buy "Slime Dragon Rogue" ?',
            false,
        ),
        option.bool(
            "26077",
            "Slime Dragon Rogue Lann",
            'Mode: [select] only\nShould the bot buy "Slime Dragon Rogue Lann" ?',
            false,
        ),
        option.bool(
            "26078",
            "Slime Dragon Rogue Helm",
            'Mode: [select] only\nShould the bot buy "Slime Dragon Rogue Helm" ?',
            false,
        ),
        option.bool(
            "26079",
            "Slime Dragon Rogue Lann Cape",
            'Mode: [select] only\nShould the bot buy "Slime Dragon Rogue Lann Cape" ?',
            false,
        ),
        option.bool("26300", "Slime Cloak", 'Mode: [select] only\nShould the bot buy "Slime Cloak" ?', false),
        option.bool("26299", "Slime Sword", 'Mode: [select] only\nShould the bot buy "Slime Sword" ?', false),
        option.bool("26263", "Sassy Slime Helm", 'Mode: [select] only\nShould the bot buy "Sassy Slime Helm" ?', false),
        option.bool("26262", "Slime Helm", 'Mode: [select] only\nShould the bot buy "Slime Helm" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: EctocaveMerge.select,
});

export default function main(): void {
    const script = new EctocaveMerge();
    Core.bankingBlackList.push(
        "Ichorus Scythe Piece",
        "Ichorus Egg",
        "Pure Ichor Gem",
        "Slime",
        "Dragon Rogue",
        "Dragon Rogue Klinge",
        "Dragon Rogue Hood",
        "Dragon Rogue Twin Klinge Cape",
        "Piece of Fabric",
        "Bone",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
