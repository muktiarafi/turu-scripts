/*
name: Forgotten Tombs Merge
description: This bot will farm the items belonging to the selected mode for the Forgotten Tombs Merge [1124] in /legioncrypt
tags: forgotten, tombs, merge, legioncrypt, seraphic, grave, digger, tools, accoutrements, pistol, jade, mages, cursed, sorcerers, underworld
*/
// Port of Scripts/Legion/MergeShops/ForgottenTombsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ForgottenTombsMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private readonly dontStopMissingIng = false;

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
                case "Ancient Sigil":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(4196, 4197);
                    Core.killMonster("legioncrypt", "r3", "Top", "*", req.name, quant, { isTemp: false, log: false });
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                case "Broken Staff": {
                    const staffPieces: Map<string, [string, ClassType]> = new Map([
                        ["Gravedigger", ["1st Piece of the Staff", ClassType.Farm]],
                        ["Undead Infantry", ["2nd Piece of the Staff", ClassType.Farm]],
                        ["Legion Doomknight", ["3rd Piece of the Staff", ClassType.Farm]],
                        ["Brutus", ["4th Piece of the Staff", ClassType.Solo]],
                    ]);
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(9664);
                        for (const kvp of staffPieces) {
                            if (Core.checkInventory(req.name, quant)) {
                                break;
                            }

                            Core.equipClass(kvp[1][1]);
                            Core.killMonster(
                                "legioncrypt",
                                kvp[0] !== "Brutus" ? "r3" : "r9",
                                kvp[0] !== "Brutus" ? "Top" : "Bottom",
                                kvp[0] !== "Brutus" ? "*" : kvp[0],
                                kvp[1][0],
                            );
                            bot.wait.forPickup(kvp[1][0]);
                        }
                        Core.ensureComplete(9664);
                    }
                    bot.wait.forPickup(req.name);
                    break;
                }
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("legioncrypt", 1124, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "29567",
            "Seraphic Grave Digger",
            'Mode: [select] only\nShould the bot buy "Seraphic Grave Digger" ?',
            false,
        ),
        option.bool(
            "29568",
            "Grave Digger Tools",
            'Mode: [select] only\nShould the bot buy "Grave Digger Tools" ?',
            false,
        ),
        option.bool(
            "29569",
            "Grave Digger Accoutrements",
            'Mode: [select] only\nShould the bot buy "Grave Digger Accoutrements" ?',
            false,
        ),
        option.bool("29570", "Seraphic Pistol", 'Mode: [select] only\nShould the bot buy "Seraphic Pistol" ?', false),
        option.bool(
            "29571",
            "Seraphic Grave Digger Hat",
            'Mode: [select] only\nShould the bot buy "Seraphic Grave Digger Hat" ?',
            false,
        ),
        option.bool(
            "29572",
            "Mask of the Grave Digger",
            'Mode: [select] only\nShould the bot buy "Mask of the Grave Digger" ?',
            false,
        ),
        option.bool(
            "29573",
            "Seraphic Grave Digger Mask",
            'Mode: [select] only\nShould the bot buy "Seraphic Grave Digger Mask" ?',
            false,
        ),
        option.bool(
            "25315",
            "Jade Mage's Staff",
            'Mode: [select] only\nShould the bot buy "Jade Mage\'s Staff" ?',
            false,
        ),
        option.bool(
            "85026",
            "Cursed Sorcerer’s Underworld Staff",
            'Mode: [select] only\nShould the bot buy "Cursed Sorcerer’s Underworld Staff" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ForgottenTombsMerge.select,
});

export default function main(): void {
    const script = new ForgottenTombsMerge();
    Core.bankingBlackList.push("Ancient Sigil", "Broken Staff");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
