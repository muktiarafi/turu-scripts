/*
name: Haku Village Merge
description: This bot will farm the items belonging to the selected mode for the Haku Village Merge [2414] in /hakuvillage
tags: haku, village, merge, hakuvillage, stylish, qipao, modern, trend, bun, dragons, favor, fan, fans, elegant, vogue, elegance, sacred, forest, dragon, dragoness, morph, tail, wings, cleyera, sakaki, katana, katanas, cypress, fang, fangs
*/
// Port of Scripts/Other/MergeShops/HakuVillageMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDOY } from "../../story/dragonsofyokai/CoreDOY";

const Adv = new CoreAdvanced();
const DOY = new CoreDOY();

export class HakuVillageMerge {
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
                case "Tengu Feather":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9600);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.killMonster("hakuvillage", "r3", "Left", "*", "Enchanted Chime", 8, { log: false });
                        Core.killMonster("hakuvillage", "r4", "Left", "*", "Pale Scale", 8, { log: false });

                        Core.equipClass(ClassType.Solo);
                        Core.killMonster("hakuvillage", "r5", "Left", "*", "Wind Blade", undefined, { log: false });
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Mikoto's Puppet String":
                    DOY.yokaiRealm();
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9690);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("yokairealm", "Mikoto Kukol'nyy", "Mikoto's Red String", 3, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Yokai Realm Moss":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("yokairealm", "Snake Shikigami", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        DOY.hakuVillage();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("hakuvillage", 2414, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("83955", "Stylish Qipao", 'Mode: [select] only\nShould the bot buy "Stylish Qipao" ?', false),
        option.bool(
            "83956",
            "Modern Trend Hair",
            'Mode: [select] only\nShould the bot buy "Modern Trend Hair" ?',
            false,
        ),
        option.bool("83957", "Modern Trend Bun", 'Mode: [select] only\nShould the bot buy "Modern Trend Bun" ?', false),
        option.bool(
            "83958",
            "Dragon's Favor Fan",
            'Mode: [select] only\nShould the bot buy "Dragon\'s Favor Fan" ?',
            false,
        ),
        option.bool(
            "83959",
            "Dragon's Favor Fans",
            'Mode: [select] only\nShould the bot buy "Dragon\'s Favor Fans" ?',
            false,
        ),
        option.bool("83960", "Elegant Qipao", 'Mode: [select] only\nShould the bot buy "Elegant Qipao" ?', false),
        option.bool("83961", "Vogue Trend Hair", 'Mode: [select] only\nShould the bot buy "Vogue Trend Hair" ?', false),
        option.bool("83962", "Vogue Trend Bun", 'Mode: [select] only\nShould the bot buy "Vogue Trend Bun" ?', false),
        option.bool(
            "83963",
            "Dragon's Elegance Fan",
            'Mode: [select] only\nShould the bot buy "Dragon\'s Elegance Fan" ?',
            false,
        ),
        option.bool(
            "83964",
            "Dragon's Elegance Fans",
            'Mode: [select] only\nShould the bot buy "Dragon\'s Elegance Fans" ?',
            false,
        ),
        option.bool(
            "83832",
            "Sacred Forest Dragon",
            'Mode: [select] only\nShould the bot buy "Sacred Forest Dragon" ?',
            false,
        ),
        option.bool(
            "83835",
            "Sacred Forest Dragon Hair",
            'Mode: [select] only\nShould the bot buy "Sacred Forest Dragon Hair" ?',
            false,
        ),
        option.bool(
            "83836",
            "Sacred Forest Dragoness Locks",
            'Mode: [select] only\nShould the bot buy "Sacred Forest Dragoness Locks" ?',
            false,
        ),
        option.bool(
            "83837",
            "Forest Dragon Morph",
            'Mode: [select] only\nShould the bot buy "Forest Dragon Morph" ?',
            false,
        ),
        option.bool(
            "83838",
            "Forest Dragoness Visage",
            'Mode: [select] only\nShould the bot buy "Forest Dragoness Visage" ?',
            false,
        ),
        option.bool(
            "83839",
            "Sacred Forest Dragon Morph",
            'Mode: [select] only\nShould the bot buy "Sacred Forest Dragon Morph" ?',
            false,
        ),
        option.bool(
            "83840",
            "Sacred Forest Dragoness Visage",
            'Mode: [select] only\nShould the bot buy "Sacred Forest Dragoness Visage" ?',
            false,
        ),
        option.bool(
            "83842",
            "Sacred Forest Dragon Tail",
            'Mode: [select] only\nShould the bot buy "Sacred Forest Dragon Tail" ?',
            false,
        ),
        option.bool(
            "83843",
            "Sacred Forest Dragon Wings",
            'Mode: [select] only\nShould the bot buy "Sacred Forest Dragon Wings" ?',
            false,
        ),
        option.bool(
            "83844",
            "Sacred Forest Dragon Wings and Tail",
            'Mode: [select] only\nShould the bot buy "Sacred Forest Dragon Wings and Tail" ?',
            false,
        ),
        option.bool(
            "83847",
            "Cleyera Sakaki Katana",
            'Mode: [select] only\nShould the bot buy "Cleyera Sakaki Katana" ?',
            false,
        ),
        option.bool(
            "83848",
            "Cleyera Sakaki Katanas",
            'Mode: [select] only\nShould the bot buy "Cleyera Sakaki Katanas" ?',
            false,
        ),
        option.bool(
            "83850",
            "Cypress Dragon Fang",
            'Mode: [select] only\nShould the bot buy "Cypress Dragon Fang" ?',
            false,
        ),
        option.bool(
            "83851",
            "Cypress Dragon Fangs",
            'Mode: [select] only\nShould the bot buy "Cypress Dragon Fangs" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: HakuVillageMerge.select,
});

export default function main(): void {
    const script = new HakuVillageMerge();
    Core.bankingBlackList.push("Tengu Feather", "Mikoto's Puppet String", "Yokai Realm Moss");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
