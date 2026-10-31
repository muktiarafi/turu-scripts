/*
name: Harvest Merge
description: This will get all or selected items on this merge shop.
tags: harvest-merge, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/MergeShops/HarvestMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreHarvestDay } from "../CoreHarvestDay";

const Adv = new CoreAdvanced();
const HarvestDay = new CoreHarvestDay();

export class HarvestMerge {
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
                case "Goredon's Zard Sauce":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("feastboss", "Goredon Rampage", req.name, quant, { isTemp: false });
                    break;
                case "Harvest Golem Parfait":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("feastwarevil", "Harvest Golem", req.name, quant, { isTemp: false });
                    break;
                case "Ultra Turdrakogiblet":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("killerkitchen", "Ultra Turdrakolich", req.name, quant, { isTemp: false });
                    break;
                case "Wretched Rider Meat":
                    HarvestDay.foulFarm();
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("dullahan", "Wretched Rider", req.name, quant, { isTemp: false });
                    break;
                case "Overgourd Seed":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("fearfeast", "OverGourd", req.name, quant, { isTemp: false });
                    break;
                case "Autumnal Civilian Hair":

                case "Autumnal Locks":

                case "Scarbucks Pumpkin Spice Latte":

                case "Maple Leaf":

                case "Burnt Feather":

                case "Scarbucks Pumpkin Pie":

                case "Autumnal Civilian":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("birdswithharms", "Rawrgobble", req.name, quant, {
                            isTemp: false,
                            log: false,
                        });
                    }
                    bot.wait.forPickup(req.name);
                    break;
                case "Iron Ore":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("birdswithharms", "TurKing", undefined, undefined, { log: false });
                    }
                    bot.wait.forPickup(req.name);
                    break;
                case "TurKing Claw":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.killMonster("birdswithharms", "r10", "Left", "TurKing", undefined, undefined, {
                            log: false,
                        });
                    }
                    bot.wait.forPickup(req.id);
                    break;
                case "Guncraft Shadowslayer Big Irons":

                case "Guncraft Shadowslayer Big Iron":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("ebilmech", "Ebil Mech Dragon", req.name, undefined, {
                            isTemp: false,
                            log: false,
                        });
                    }
                    bot.wait.forPickup(req.name);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("feast", 2181, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "70928",
            "Candy Corn Crusher",
            'Mode: [select] only\nShould the bot buy "Candy Corn Crusher" ?',
            false,
        ),
        option.bool(
            "70929",
            "Candy Corn Crusher Helm",
            'Mode: [select] only\nShould the bot buy "Candy Corn Crusher Helm" ?',
            false,
        ),
        option.bool(
            "70930",
            "Candy Corn Crusher Hood",
            'Mode: [select] only\nShould the bot buy "Candy Corn Crusher Hood" ?',
            false,
        ),
        option.bool(
            "70931",
            "Candy Corn Crusher Hat",
            'Mode: [select] only\nShould the bot buy "Candy Corn Crusher Hat" ?',
            false,
        ),
        option.bool(
            "70932",
            "Candy Corn Crusher Mask",
            'Mode: [select] only\nShould the bot buy "Candy Corn Crusher Mask" ?',
            false,
        ),
        option.bool(
            "70933",
            "Candy Corn Crusher Cape",
            'Mode: [select] only\nShould the bot buy "Candy Corn Crusher Cape" ?',
            false,
        ),
        option.bool(
            "70934",
            "Candy Corn Crusher Rune",
            'Mode: [select] only\nShould the bot buy "Candy Corn Crusher Rune" ?',
            false,
        ),
        option.bool(
            "70935",
            "Candy Corn Crusher Pet",
            'Mode: [select] only\nShould the bot buy "Candy Corn Crusher Pet" ?',
            false,
        ),
        option.bool(
            "70936",
            "Candy Corn Crusher Blade",
            'Mode: [select] only\nShould the bot buy "Candy Corn Crusher Blade" ?',
            false,
        ),
        option.bool(
            "70937",
            "Candy Corn Crusher Axe",
            'Mode: [select] only\nShould the bot buy "Candy Corn Crusher Axe" ?',
            false,
        ),
        option.bool(
            "70938",
            "Candy Corn Crusher Drills",
            'Mode: [select] only\nShould the bot buy "Candy Corn Crusher Drills" ?',
            false,
        ),
        option.bool("73488", "Headless Pumpkin", 'Mode: [select] only\nShould the bot buy "Headless Pumpkin" ?', false),
        option.bool(
            "73491",
            "Headless Pumpkin Blade",
            'Mode: [select] only\nShould the bot buy "Headless Pumpkin Blade" ?',
            false,
        ),
        option.bool(
            "73489",
            "Headless Pumpkin's... Head?",
            'Mode: [select] only\nShould the bot buy "Headless Pumpkin\'s... Head?" ?',
            false,
        ),
        option.bool(
            "73490",
            "Headless Pumpkin Cape",
            'Mode: [select] only\nShould the bot buy "Headless Pumpkin Cape" ?',
            false,
        ),
        option.bool(
            "73492",
            "Headless Pumpkin Blades",
            'Mode: [select] only\nShould the bot buy "Headless Pumpkin Blades" ?',
            false,
        ),
        option.bool("73827", "Autumniphile", 'Mode: [select] only\nShould the bot buy "Autumniphile" ?', false),
        option.bool(
            "73830",
            "Autumnal Civilian Beret",
            'Mode: [select] only\nShould the bot buy "Autumnal Civilian Beret" ?',
            false,
        ),
        option.bool(
            "73831",
            "Autumnal Civilian Beret + Locks",
            'Mode: [select] only\nShould the bot buy "Autumnal Civilian Beret + Locks" ?',
            false,
        ),
        option.bool(
            "73832",
            "Autumniphile Beret",
            'Mode: [select] only\nShould the bot buy "Autumniphile Beret" ?',
            false,
        ),
        option.bool(
            "73833",
            "Autumniphile Beret + Locks",
            'Mode: [select] only\nShould the bot buy "Autumniphile Beret + Locks" ?',
            false,
        ),
        option.bool(
            "73834",
            "Full Autumniphile Morph",
            'Mode: [select] only\nShould the bot buy "Full Autumniphile Morph" ?',
            false,
        ),
        option.bool(
            "73835",
            "Full Autumniphile Morph + Locks",
            'Mode: [select] only\nShould the bot buy "Full Autumniphile Morph + Locks" ?',
            false,
        ),
        option.bool(
            "73836",
            "Autumnal Maple Leaves",
            'Mode: [select] only\nShould the bot buy "Autumnal Maple Leaves" ?',
            false,
        ),
        option.bool(
            "73844",
            "Scarbucks Double Dessert",
            'Mode: [select] only\nShould the bot buy "Scarbucks Double Dessert" ?',
            false,
        ),
        option.bool(
            "74252",
            "Elite Guncraft Shadowslayer",
            'Mode: [select] only\nShould the bot buy "Elite Guncraft Shadowslayer" ?',
            false,
        ),
        option.bool(
            "74253",
            "Elite Guncraft Stetson",
            'Mode: [select] only\nShould the bot buy "Elite Guncraft Stetson" ?',
            false,
        ),
        option.bool(
            "74254",
            "Elite Guncraft Stetson Locks",
            'Mode: [select] only\nShould the bot buy "Elite Guncraft Stetson Locks" ?',
            false,
        ),
        option.bool(
            "74255",
            "Elite Guncraft Masked Stetson",
            'Mode: [select] only\nShould the bot buy "Elite Guncraft Masked Stetson" ?',
            false,
        ),
        option.bool(
            "74256",
            "Elite Guncraft Masked Stetson Locks",
            'Mode: [select] only\nShould the bot buy "Elite Guncraft Masked Stetson Locks" ?',
            false,
        ),
        option.bool(
            "74257",
            "Elite Guncraft Vigilante Mask",
            'Mode: [select] only\nShould the bot buy "Elite Guncraft Vigilante Mask" ?',
            false,
        ),
        option.bool(
            "74258",
            "Elite Guncraft Vigilante Masked Locks",
            'Mode: [select] only\nShould the bot buy "Elite Guncraft Vigilante Masked Locks" ?',
            false,
        ),
        option.bool("74238", "Guncraft Glory", 'Mode: [select] only\nShould the bot buy "Guncraft Glory" ?', false),
        option.bool(
            "74246",
            "Guncraft Shadowslayer Bigger Iron",
            'Mode: [select] only\nShould the bot buy "Guncraft Shadowslayer Bigger Iron" ?',
            false,
        ),
        option.bool(
            "74247",
            "Guncraft Shadowslayer Bigger Irons",
            'Mode: [select] only\nShould the bot buy "Guncraft Shadowslayer Bigger Irons" ?',
            false,
        ),
        option.bool(
            "74248",
            "Guncraft Shadowslayer Biggest Iron",
            'Mode: [select] only\nShould the bot buy "Guncraft Shadowslayer Biggest Iron" ?',
            false,
        ),
        option.bool(
            "74249",
            "Guncraft Shadowslayer Biggest Irons",
            'Mode: [select] only\nShould the bot buy "Guncraft Shadowslayer Biggest Irons" ?',
            false,
        ),
        option.bool(
            "74251",
            "Guncraft Shadowslayer Vulcan Cannon",
            'Mode: [select] only\nShould the bot buy "Guncraft Shadowslayer Vulcan Cannon" ?',
            false,
        ),
        option.bool(
            "74239",
            "Guncraft Artillery Beast",
            'Mode: [select] only\nShould the bot buy "Guncraft Artillery Beast" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: HarvestMerge.select,
});

export default function main(): void {
    const script = new HarvestMerge();
    Core.bankingBlackList.push(
        "Goredon's Zard Sauce",
        "Harvest Golem Parfait",
        "Ultra Turdrakogiblet",
        "Wretched Rider Meat",
        "Overgourd Seed",
        "Autumnal Civilian",
        "Maple Leaf",
        "Burnt Feather",
        "Autumnal Civilian Hair",
        "Autumnal Locks",
        "Scarbucks Pumpkin Spice Latte",
        "Scarbucks Pumpkin Pie",
        "Iron Ore",
        "TurKing Claw",
        "Guncraft Shadowslayer Big Iron",
        "Guncraft Shadowslayer Big Irons ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
