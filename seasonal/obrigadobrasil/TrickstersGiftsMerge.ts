/*
name: Trickster's Gifts Merge
description: This bot will farm the items belonging to the selected mode for the Tricksters Gifts Merge [1910] in /mythperception
tags: brasil, obrigado, seasonal, trickster, gifts, merge, mythperception, arara, azul, on, your, shoulder, picapau, amarelo, emiglin, cucas, apprentice, shadow, cuca, prismatic, , morph, pastel, privateer, privateers, scarf, eyepatch, bicorne, eyepatched, scarfed, cloak, cloaked, sheath, holster, pistol, pistols, hand, cannon, cutlass, pitiless
*/
// Port of Scripts/Seasonal/ObrigadoBrasil/TrickstersGiftsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class TrickstersGiftsMerge {
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
                case "Poeira do Saci":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(7682);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("mythperception", "Saci", "Trapped Saci");
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Ossos do Corpo-Seco":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7683);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("mythperception", "Corpo-Seco", "Corpo-Seco's Nails", 5);
                    }
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                case "Escamas da Cuca":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7684);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("mythperception", "Cuca", "Cuca's Hat", quant);
                    }
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                case "Pink Gem of the Sea":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("mythperception", "Boto", req.name, quant);
                    break;
                case "Cuca's Dye":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("mythperception", "Cuca", req.name, quant);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("mythperception", 1910, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "56095",
            "Arara Azul on your Shoulder",
            'Mode: [select] only\nShould the bot buy "Arara Azul on your Shoulder" ?',
            false,
        ),
        option.bool("56096", "Picapau Amarelo", 'Mode: [select] only\nShould the bot buy "Picapau Amarelo" ?', false),
        option.bool("56100", "Emiglin", 'Mode: [select] only\nShould the bot buy "Emiglin" ?', false),
        option.bool(
            "56204",
            "Cuca's Apprentice",
            'Mode: [select] only\nShould the bot buy "Cuca\'s Apprentice" ?',
            false,
        ),
        option.bool("56211", "Shadow Cuca", 'Mode: [select] only\nShould the bot buy "Shadow Cuca" ?', false),
        option.bool(
            "56212",
            "Prismatic Shadow Cuca",
            'Mode: [select] only\nShould the bot buy "Prismatic Shadow Cuca" ?',
            false,
        ),
        option.bool(
            "56213",
            "Cuca's Apprentice Staff",
            'Mode: [select] only\nShould the bot buy "Cuca\'s Apprentice Staff" ?',
            false,
        ),
        option.bool(
            "56227",
            "Prismatic Cuca's Apprentice Staff",
            'Mode: [select] only\nShould the bot buy "Prismatic Cuca\'s Apprentice Staff" ?',
            false,
        ),
        option.bool(
            "56205",
            "Cuca's Apprentice Hair",
            'Mode: [select] only\nShould the bot buy "Cuca\'s Apprentice Hair" ?',
            false,
        ),
        option.bool(
            "56208",
            "Cuca's Apprentice Locks",
            'Mode: [select] only\nShould the bot buy "Cuca\'s Apprentice Locks" ?',
            false,
        ),
        option.bool(
            "56206",
            "Cuca's Apprentice Hat",
            'Mode: [select] only\nShould the bot buy "Cuca\'s Apprentice Hat" ?',
            false,
        ),
        option.bool(
            "56209",
            "Cuca's Apprentice Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Cuca\'s Apprentice Hat + Locks" ?',
            false,
        ),
        option.bool(
            "56207",
            "Cuca's Apprentice Morph",
            'Mode: [select] only\nShould the bot buy "Cuca\'s Apprentice Morph" ?',
            false,
        ),
        option.bool(
            "56210",
            "Cuca's Apprentice Morph Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Cuca\'s Apprentice Morph Hat + Locks" ?',
            false,
        ),
        option.bool("63753", "Pastel Privateer", 'Mode: [select] only\nShould the bot buy "Pastel Privateer" ?', false),
        option.bool(
            "63756",
            "Privateer's Scarf",
            'Mode: [select] only\nShould the bot buy "Privateer\'s Scarf" ?',
            false,
        ),
        option.bool(
            "63757",
            "Privateer's Scarf + Locks",
            'Mode: [select] only\nShould the bot buy "Privateer\'s Scarf + Locks" ?',
            false,
        ),
        option.bool(
            "63758",
            "Privateer's Eyepatch",
            'Mode: [select] only\nShould the bot buy "Privateer\'s Eyepatch" ?',
            false,
        ),
        option.bool(
            "63759",
            "Privateer's Eyepatch + Locks",
            'Mode: [select] only\nShould the bot buy "Privateer\'s Eyepatch + Locks" ?',
            false,
        ),
        option.bool(
            "63760",
            "Privateer's Bicorne",
            'Mode: [select] only\nShould the bot buy "Privateer\'s Bicorne" ?',
            false,
        ),
        option.bool(
            "63761",
            "Privateer's Bicorne + Locks",
            'Mode: [select] only\nShould the bot buy "Privateer\'s Bicorne + Locks" ?',
            false,
        ),
        option.bool(
            "63762",
            "Privateer's Eyepatched Bicorne",
            'Mode: [select] only\nShould the bot buy "Privateer\'s Eyepatched Bicorne" ?',
            false,
        ),
        option.bool(
            "63763",
            "Privateer's Eyepatched Bicorne + Locks",
            'Mode: [select] only\nShould the bot buy "Privateer\'s Eyepatched Bicorne + Locks" ?',
            false,
        ),
        option.bool(
            "63764",
            "Privateer's Scarf + Bicorne",
            'Mode: [select] only\nShould the bot buy "Privateer\'s Scarf + Bicorne" ?',
            false,
        ),
        option.bool(
            "63765",
            "Privateer's Scarfed Bicorne + Locks",
            'Mode: [select] only\nShould the bot buy "Privateer\'s Scarfed Bicorne + Locks" ?',
            false,
        ),
        option.bool(
            "63766",
            "Privateer's Cloak",
            'Mode: [select] only\nShould the bot buy "Privateer\'s Cloak" ?',
            false,
        ),
        option.bool(
            "63767",
            "Privateer's Cloaked Sheath Holster",
            'Mode: [select] only\nShould the bot buy "Privateer\'s Cloaked Sheath Holster" ?',
            false,
        ),
        option.bool(
            "63768",
            "Privateer's Holster",
            'Mode: [select] only\nShould the bot buy "Privateer\'s Holster" ?',
            false,
        ),
        option.bool(
            "63769",
            "Privateer's Sheath",
            'Mode: [select] only\nShould the bot buy "Privateer\'s Sheath" ?',
            false,
        ),
        option.bool(
            "63770",
            "Privateer's Sheath Holster",
            'Mode: [select] only\nShould the bot buy "Privateer\'s Sheath Holster" ?',
            false,
        ),
        option.bool(
            "63774",
            "Privateer's Pistol",
            'Mode: [select] only\nShould the bot buy "Privateer\'s Pistol" ?',
            false,
        ),
        option.bool(
            "63775",
            "Privateer's Dual Pistols",
            'Mode: [select] only\nShould the bot buy "Privateer\'s Dual Pistols" ?',
            false,
        ),
        option.bool(
            "63776",
            "Privateer's Hand Cannon",
            'Mode: [select] only\nShould the bot buy "Privateer\'s Hand Cannon" ?',
            false,
        ),
        option.bool(
            "63777",
            "Privateer's Cutlass + Pistol",
            'Mode: [select] only\nShould the bot buy "Privateer\'s Cutlass + Pistol" ?',
            false,
        ),
        option.bool(
            "72092",
            "Pitiless Privateer",
            'Mode: [select] only\nShould the bot buy "Pitiless Privateer" ?',
            false,
        ),
        option.bool(
            "72093",
            "Pitiless Privateer's Eyepatch",
            'Mode: [select] only\nShould the bot buy "Pitiless Privateer\'s Eyepatch" ?',
            false,
        ),
        option.bool(
            "72094",
            "Pitiless Privateer's Eyepatch + Locks",
            'Mode: [select] only\nShould the bot buy "Pitiless Privateer\'s Eyepatch + Locks" ?',
            false,
        ),
        option.bool(
            "72095",
            "Pitiless Privateer's Bicorne",
            'Mode: [select] only\nShould the bot buy "Pitiless Privateer\'s Bicorne" ?',
            false,
        ),
        option.bool(
            "72096",
            "Pitiless Privateer's Bicorne + Locks",
            'Mode: [select] only\nShould the bot buy "Pitiless Privateer\'s Bicorne + Locks" ?',
            false,
        ),
        option.bool(
            "72097",
            "Pitiless Privateer's Cloak",
            'Mode: [select] only\nShould the bot buy "Pitiless Privateer\'s Cloak" ?',
            false,
        ),
        option.bool(
            "72098",
            "Pitiless Privateer's Sheath",
            'Mode: [select] only\nShould the bot buy "Pitiless Privateer\'s Sheath" ?',
            false,
        ),
        option.bool(
            "72099",
            "Pitiless Privateer's Pistol",
            'Mode: [select] only\nShould the bot buy "Pitiless Privateer\'s Pistol" ?',
            false,
        ),
        option.bool(
            "72100",
            "Pitiless Privateer's Dual Pistols",
            'Mode: [select] only\nShould the bot buy "Pitiless Privateer\'s Dual Pistols" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: TrickstersGiftsMerge.select,
});

export default function main(): void {
    const script = new TrickstersGiftsMerge();
    Core.bankingBlackList.push(
        "Poeira do Saci",
        "Ossos do Corpo-Seco",
        "Escamas da Cuca",
        "Pink Gem of the Sea",
        "Cuca's Dye ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
