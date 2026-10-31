/*
name: Frostvalgala Merge
description: This bot will farm the items belonging to the selected mode for the Frostvalgala Merge [2645] in /frostvalgala
tags: frostvalgala, merge, frostvalgala, golden, granville, knight, noble, red, sash, carteret, spear, shield, stella, dei, miracoli, royal, frostval, tree, stelle, invernali, sanctolina, halberd, mace, lucevan, le
*/
// Port of Scripts/Seasonal/Frostvale/FrostvalgalaMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFrostvale } from "./story/CoreFrostvale";

const Adv = new CoreAdvanced();
const Frost = new CoreFrostvale();

export class FrostvalgalaMerge {
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
                case "Whistler Bullion":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(
                            Core.isMember ? 10525 : 10524,
                            ["frostvalgala", "Unsung Queen", ClassType.Solo],
                            ["frostvalgala", "Unsung Knight", ClassType.Farm],
                            ["frostvalgala", "Unsung Beast", ClassType.Farm],
                        );
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Granville Knight":

                case "Granville Helm":

                case "Noble Blue Sash":

                case "Silver Carteret Spear":

                case "Silver Carteret Spear and Shield":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("frostvalgala", "Unsung Queen", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                //#endregion
            }
        };
        Frost.frostvalGala();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("frostvalgala", 2645, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "97499",
            "Golden Granville Knight",
            'Mode: [select] only\nShould the bot buy "Golden Granville Knight" ?',
            false,
        ),
        option.bool(
            "97500",
            "Golden Granville Helm",
            'Mode: [select] only\nShould the bot buy "Golden Granville Helm" ?',
            false,
        ),
        option.bool("97501", "Noble Red Sash", 'Mode: [select] only\nShould the bot buy "Noble Red Sash" ?', false),
        option.bool(
            "97502",
            "Golden Carteret Spear",
            'Mode: [select] only\nShould the bot buy "Golden Carteret Spear" ?',
            false,
        ),
        option.bool(
            "97503",
            "Golden Carteret Spear and Shield",
            'Mode: [select] only\nShould the bot buy "Golden Carteret Spear and Shield" ?',
            false,
        ),
        option.bool(
            "97585",
            "Stella dei Miracoli",
            'Mode: [select] only\nShould the bot buy "Stella dei Miracoli" ?',
            false,
        ),
        option.bool(
            "97586",
            "Dual Stella dei Miracoli",
            'Mode: [select] only\nShould the bot buy "Dual Stella dei Miracoli" ?',
            false,
        ),
        option.bool(
            "97735",
            "Royal Frostval Tree",
            'Mode: [select] only\nShould the bot buy "Royal Frostval Tree" ?',
            false,
        ),
        option.bool("97739", "Stelle Invernali", 'Mode: [select] only\nShould the bot buy "Stelle Invernali" ?', false),
        option.bool(
            "97740",
            "Dual Stelle Invernali",
            'Mode: [select] only\nShould the bot buy "Dual Stelle Invernali" ?',
            false,
        ),
        option.bool("97602", "Sanctolina Staff", 'Mode: [select] only\nShould the bot buy "Sanctolina Staff" ?', false),
        option.bool(
            "97604",
            "Sanctolina Halberd",
            'Mode: [select] only\nShould the bot buy "Sanctolina Halberd" ?',
            false,
        ),
        option.bool("97607", "Sanctolina Mace", 'Mode: [select] only\nShould the bot buy "Sanctolina Mace" ?', false),
        option.bool("97609", "Sanctolina Axe", 'Mode: [select] only\nShould the bot buy "Sanctolina Axe" ?', false),
        option.bool(
            "97742",
            "Lucevan Le Stelle",
            'Mode: [select] only\nShould the bot buy "Lucevan Le Stelle" ?',
            false,
        ),
        option.bool(
            "97743",
            "Dual Lucevan Le Stelle",
            'Mode: [select] only\nShould the bot buy "Dual Lucevan Le Stelle" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FrostvalgalaMerge.select,
});

export default function main(): void {
    const script = new FrostvalgalaMerge();
    Core.bankingBlackList.push(
        "Whistler Bullion",
        "Granville Knight",
        "Granville Helm",
        "Noble Blue Sash",
        "Silver Carteret Spear",
        "Silver Carteret Spear and Shield",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
