/*
name: Yguasu Falls Merge
description: This bot will farm the items belonging to the selected mode for the Yguasu Falls Merge [2413] in /yguasu
tags: yguasu, falls, merge, yguasu, vestes, da, rainha, das, ondas, morph, turbante, espírito, mãe, dágua, leque, leques, encantadas, ecantado, bolsa, espelho
*/
// Port of Scripts/Seasonal/HerosHeartDay/YguasuFallsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { YguasuFalls } from "./YguasuFalls";

const Adv = new CoreAdvanced();
const yguasuFalls = new YguasuFalls();

export class YguasuFallsMerge {
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
                case "Lovely Silk":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9588);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.killMonster("yguasu", "r3", "Left", "*", "Giggling Mask", 10, { log: false });
                        Core.killMonster("yguasu", "r4", "Left", "*", "Wolfman Talisman", 10, { log: false });

                        Core.equipClass(ClassType.Solo);
                        Core.killMonster("yguasu", "r5", "Left", "*", "M'Boi's Throat", undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Bolsa da Mãe D'água":
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.killMonster("yguasu", "r5", "Left", "M'Boi", undefined, undefined, { log: false });
                    }
                    bot.wait.forPickup(req.id);
                    break;
                case "Espelho da Mãe D'água":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuestChoose(
                            9610,
                            83981,
                            ["canalshore", "Trapped Snack", ClassType.Farm],
                            ["cursedshop", "Ghost Vase", ClassType.Farm],
                            ["terradefesta", "Baron Sunday", ClassType.Solo],
                        );
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("yguasu")) {
            Core.logger("Seasonal map, unavaible.");
            return;
        }
        yguasuFalls.doStory();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("yguasu", 2413, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "83970",
            "Vestes da Rainha das Ondas",
            'Mode: [select] only\nShould the bot buy "Vestes da Rainha das Ondas" ?',
            false,
        ),
        option.bool(
            "83971",
            "Rainha das Ondas Morph",
            'Mode: [select] only\nShould the bot buy "Rainha das Ondas Morph" ?',
            false,
        ),
        option.bool(
            "83972",
            "Turbante das Ondas Visage",
            'Mode: [select] only\nShould the bot buy "Turbante das Ondas Visage" ?',
            false,
        ),
        option.bool(
            "83973",
            "Rainha das Ondas Hair",
            'Mode: [select] only\nShould the bot buy "Rainha das Ondas Hair" ?',
            false,
        ),
        option.bool(
            "83974",
            "Turbante das Ondas",
            'Mode: [select] only\nShould the bot buy "Turbante das Ondas" ?',
            false,
        ),
        option.bool(
            "83976",
            "Espírito da Mãe d'água",
            'Mode: [select] only\nShould the bot buy "Espírito da Mãe d\'água" ?',
            false,
        ),
        option.bool(
            "83979",
            "Leque da Mãe D'água",
            'Mode: [select] only\nShould the bot buy "Leque da Mãe D\'água" ?',
            false,
        ),
        option.bool(
            "83980",
            "Leques da Mãe D'água",
            'Mode: [select] only\nShould the bot buy "Leques da Mãe D\'água" ?',
            false,
        ),
        option.bool(
            "83984",
            "Vestes Encantadas da Rainha das Ondas",
            'Mode: [select] only\nShould the bot buy "Vestes Encantadas da Rainha das Ondas" ?',
            false,
        ),
        option.bool(
            "83985",
            "Turbante Ecantado das Ondas Visage",
            'Mode: [select] only\nShould the bot buy "Turbante Ecantado das Ondas Visage" ?',
            false,
        ),
        option.bool(
            "83986",
            "Turbante Ecantado das Ondas",
            'Mode: [select] only\nShould the bot buy "Turbante Ecantado das Ondas" ?',
            false,
        ),
        option.bool(
            "83987",
            "Bolsa Ecantado da Mãe D'água",
            'Mode: [select] only\nShould the bot buy "Bolsa Ecantado da Mãe D\'água" ?',
            false,
        ),
        option.bool(
            "83988",
            "Bolsa Ecantado da Mãe D'água",
            'Mode: [select] only\nShould the bot buy "Bolsa Ecantado da Mãe D\'água" ?',
            false,
        ),
        option.bool(
            "83989",
            "Leque Ecantado da Mãe D'água",
            'Mode: [select] only\nShould the bot buy "Leque Ecantado da Mãe D\'água" ?',
            false,
        ),
        option.bool(
            "83990",
            "Leques Ecantado da Mãe D'água",
            'Mode: [select] only\nShould the bot buy "Leques Ecantado da Mãe D\'água" ?',
            false,
        ),
        option.bool(
            "83991",
            "Espelho Ecantado da Mãe D'água",
            'Mode: [select] only\nShould the bot buy "Espelho Ecantado da Mãe D\'água" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: YguasuFallsMerge.select,
});

export default function main(): void {
    const script = new YguasuFallsMerge();
    Core.bankingBlackList.push("Lovely Silk", "Bolsa da Mãe D'água", "Espelho da Mãe D'água");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
