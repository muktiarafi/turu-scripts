/*
name: Dragon Capital Merge
description: This will farm and buy all items of Dragon Capital Merge Shop.
tags: farm, merge, shop, dragon-capital, pirate
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MergeShops/DragonCapitalMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { DragonCapitalStory } from "../DragonCapitalStory";

const Adv = new CoreAdvanced();
const DCS = new DragonCapitalStory();

export class DragonCapitalMerge {
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
                case "Dragon King's Favor":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8288);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("dragoncapital", "Titan Leech", "Titan Leftovers Defeated", 6);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Regal Pirate Fleet":

                case "Regal Pirate Leggings":

                case "Regal Pirate's Hat":

                case "Regal Pirate's Accessories":

                case "Regal Pirate's Hat + Locks":

                case "Regal Pirate's Accessories + Locks":

                case "Regal Pirate's Rapier":

                case "Regal Pirate's Accoutrements":

                case "Formal Pirate Fleet":

                case "Formal Pirate Leggings":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("dragoncapital", "Leviathanius", req.name, undefined, { isTemp: false });
                    break;
                case "Regal Pirate's Wheel":

                case "Regal Pirate's Cape + Wheel":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("dragoncapital", "Empowered Scalebeard", req.name, undefined, { isTemp: false });
                    break;
            }
        };
        DCS.dragonCapital();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("dragoncapital", 2053, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "62726",
            "Diabolical Admiral",
            'Mode: [select] only\nShould the bot buy "Diabolical Admiral" ?',
            false,
        ),
        option.bool(
            "62727",
            "Diabolical Officer",
            'Mode: [select] only\nShould the bot buy "Diabolical Officer" ?',
            false,
        ),
        option.bool(
            "62728",
            "Diabolical Admiral's Cap",
            'Mode: [select] only\nShould the bot buy "Diabolical Admiral\'s Cap" ?',
            false,
        ),
        option.bool(
            "62729",
            "Diabolical Admiral's Cap + Locks",
            'Mode: [select] only\nShould the bot buy "Diabolical Admiral\'s Cap + Locks" ?',
            false,
        ),
        option.bool(
            "62730",
            "Diabolical Admiral's Cap + Visor",
            'Mode: [select] only\nShould the bot buy "Diabolical Admiral\'s Cap + Visor" ?',
            false,
        ),
        option.bool(
            "62731",
            "Diabolical Admiral's Cap Locks + Visor",
            'Mode: [select] only\nShould the bot buy "Diabolical Admiral\'s Cap Locks + Visor" ?',
            false,
        ),
        option.bool(
            "62732",
            "Diabolical Admiral's Locks",
            'Mode: [select] only\nShould the bot buy "Diabolical Admiral\'s Locks" ?',
            false,
        ),
        option.bool(
            "62733",
            "Diabolical Admiral's Locks + Visor",
            'Mode: [select] only\nShould the bot buy "Diabolical Admiral\'s Locks + Visor" ?',
            false,
        ),
        option.bool(
            "62734",
            "Diabolical Admiral's Shag",
            'Mode: [select] only\nShould the bot buy "Diabolical Admiral\'s Shag" ?',
            false,
        ),
        option.bool(
            "62735",
            "Diabolical Admiral's Shag + Visor",
            'Mode: [select] only\nShould the bot buy "Diabolical Admiral\'s Shag + Visor" ?',
            false,
        ),
        option.bool(
            "62736",
            "Admiral's Eldritch Arms",
            'Mode: [select] only\nShould the bot buy "Admiral\'s Eldritch Arms" ?',
            false,
        ),
        option.bool(
            "62737",
            "Diabolical Admiral's Cloak",
            'Mode: [select] only\nShould the bot buy "Diabolical Admiral\'s Cloak" ?',
            false,
        ),
        option.bool(
            "62738",
            "Diabolical Cloak + Arms",
            'Mode: [select] only\nShould the bot buy "Diabolical Cloak + Arms" ?',
            false,
        ),
        option.bool(
            "62739",
            "Diabolical Cloak + Tide",
            'Mode: [select] only\nShould the bot buy "Diabolical Cloak + Tide" ?',
            false,
        ),
        option.bool("62740", "Diabolical Tide", 'Mode: [select] only\nShould the bot buy "Diabolical Tide" ?', false),
        option.bool(
            "62741",
            "Diabolical Telescope",
            'Mode: [select] only\nShould the bot buy "Diabolical Telescope" ?',
            false,
        ),
        option.bool(
            "62742",
            "Sheathed Diabolical Sword",
            'Mode: [select] only\nShould the bot buy "Sheathed Diabolical Sword" ?',
            false,
        ),
        option.bool(
            "62743",
            "Diabolical Flare Gun",
            'Mode: [select] only\nShould the bot buy "Diabolical Flare Gun" ?',
            false,
        ),
        option.bool(
            "62744",
            "Diabolical Cane Sword",
            'Mode: [select] only\nShould the bot buy "Diabolical Cane Sword" ?',
            false,
        ),
        option.bool("62746", "Diabolical Sword", 'Mode: [select] only\nShould the bot buy "Diabolical Sword" ?', false),
        option.bool(
            "62860",
            "Enchanted Regal Pirate",
            'Mode: [select] only\nShould the bot buy "Enchanted Regal Pirate" ?',
            false,
        ),
        option.bool(
            "62861",
            "Enchanted Regal Pirate Leggings",
            'Mode: [select] only\nShould the bot buy "Enchanted Regal Pirate Leggings" ?',
            false,
        ),
        option.bool(
            "62864",
            "Enchanted Regal Pirate Hat",
            'Mode: [select] only\nShould the bot buy "Enchanted Regal Pirate Hat" ?',
            false,
        ),
        option.bool(
            "62865",
            "Enchanted Regal Pirate Accessories",
            'Mode: [select] only\nShould the bot buy "Enchanted Regal Pirate Accessories" ?',
            false,
        ),
        option.bool(
            "62866",
            "Formal Pirate Eyepatch",
            'Mode: [select] only\nShould the bot buy "Formal Pirate Eyepatch" ?',
            false,
        ),
        option.bool(
            "62867",
            "Enchanted Formal Pirate Accessories",
            'Mode: [select] only\nShould the bot buy "Enchanted Formal Pirate Accessories" ?',
            false,
        ),
        option.bool(
            "62868",
            "Enchanted Regal Pirate Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Enchanted Regal Pirate Hat + Locks" ?',
            false,
        ),
        option.bool(
            "62869",
            "Formal Pirate Eyepatch + Locks",
            'Mode: [select] only\nShould the bot buy "Formal Pirate Eyepatch + Locks" ?',
            false,
        ),
        option.bool(
            "63785",
            "Enchanted Formal Pirate Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Enchanted Formal Pirate Hat + Locks" ?',
            false,
        ),
        option.bool(
            "63786",
            "Enchanted Formal Accessories + Locks",
            'Mode: [select] only\nShould the bot buy "Enchanted Formal Accessories + Locks" ?',
            false,
        ),
        option.bool(
            "63787",
            "Enchanted Formal Pirate Hat",
            'Mode: [select] only\nShould the bot buy "Enchanted Formal Pirate Hat" ?',
            false,
        ),
        option.bool(
            "63788",
            "Enchanted Regal Accessories + Locks",
            'Mode: [select] only\nShould the bot buy "Enchanted Regal Accessories + Locks" ?',
            false,
        ),
        option.bool(
            "62870",
            "Formal Pirate Fleet Cape",
            'Mode: [select] only\nShould the bot buy "Formal Pirate Fleet Cape" ?',
            false,
        ),
        option.bool(
            "62871",
            "Enchanted Formal Pirate Cape + Wheel",
            'Mode: [select] only\nShould the bot buy "Enchanted Formal Pirate Cape + Wheel" ?',
            false,
        ),
        option.bool(
            "62872",
            "Enchanted Pirate's Ship Wheel",
            'Mode: [select] only\nShould the bot buy "Enchanted Pirate\'s Ship Wheel" ?',
            false,
        ),
        option.bool(
            "62873",
            "Enchanted Regal Pirate Rapier",
            'Mode: [select] only\nShould the bot buy "Enchanted Regal Pirate Rapier" ?',
            false,
        ),
        option.bool(
            "62874",
            "Enchanted Regal Pirate Accoutrements",
            'Mode: [select] only\nShould the bot buy "Enchanted Regal Pirate Accoutrements" ?',
            false,
        ),
        option.bool(
            "63781",
            "Enchanted Formal Pirate",
            'Mode: [select] only\nShould the bot buy "Enchanted Formal Pirate" ?',
            false,
        ),
        option.bool(
            "63782",
            "Enchanted Formal Pirate Leggings",
            'Mode: [select] only\nShould the bot buy "Enchanted Formal Pirate Leggings" ?',
            false,
        ),
        option.bool(
            "63783",
            "Enchanted Regal Pirate Cape + Wheel",
            'Mode: [select] only\nShould the bot buy "Enchanted Regal Pirate Cape + Wheel" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DragonCapitalMerge.select,
});

export default function main(): void {
    const script = new DragonCapitalMerge();
    Core.bankingBlackList.push(
        "Dragon King's Favor",
        "Regal Pirate Fleet",
        "Regal Pirate Leggings",
        "Regal Pirate's Hat",
        "Regal Pirate's Accessories",
        "Regal Pirate's Hat + Locks",
        "Regal Pirate's Accessories + Locks",
        "Regal Pirate's Wheel",
        "Regal Pirate's Rapier",
        "Regal Pirate's Accoutrements",
        "Formal Pirate Fleet",
        "Formal Pirate Leggings",
        "Regal Pirate's Cape + Wheel ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
