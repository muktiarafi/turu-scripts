/*
name: CruxShadowsMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/CruxShadowsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class CruxShadowsMerge {
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
                case "Glowing Pumpkinseed":
                    if (Core.isMember) {
                        Core.equipClass(ClassType.Solo);
                        Core.registerQuests(4617);

                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            //ULTRA Pumpkinseed Farming Quest 4617 [Member]
                            Core.huntMonster("CruxShip", "Apephryx", "Otherworld Sigil", undefined, { isTemp: false });
                            bot.wait.forPickup(req.name);
                        }
                        Core.cancelRegisteredQuests();
                    } else {
                        Core.equipClass(ClassType.Farm);
                        Core.registerQuests(4615);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            //Gather the Gold Debns 4615
                            Core.huntMonster("CruxShip", "Treasure Hunter", "Debns Gathered", 6);
                            bot.wait.forPickup(req.name);
                        }
                        Core.cancelRegisteredQuests();
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("cruxship", 1172, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "31848",
            "Evolved Pumpkin Lord",
            'Mode: [select] only\nShould the bot buy "Evolved Pumpkin Lord" ?',
            false,
        ),
        option.bool(
            "31905",
            "SteamPunk TreasureHunter",
            'Mode: [select] only\nShould the bot buy "SteamPunk TreasureHunter" ?',
            false,
        ),
        option.bool(
            "31906",
            "TreasureHunter Musket",
            'Mode: [select] only\nShould the bot buy "TreasureHunter Musket" ?',
            false,
        ),
        option.bool(
            "31907",
            "TreasureHunter Wrap",
            'Mode: [select] only\nShould the bot buy "TreasureHunter Wrap" ?',
            false,
        ),
        option.bool(
            "31908",
            "TreasureHunter Hair",
            'Mode: [select] only\nShould the bot buy "TreasureHunter Hair" ?',
            false,
        ),
        option.bool(
            "31909",
            "TreasureHunter Musket Cape",
            'Mode: [select] only\nShould the bot buy "TreasureHunter Musket Cape" ?',
            false,
        ),
        option.bool("31981", "Monster Mummy", 'Mode: [select] only\nShould the bot buy "Monster Mummy" ?', false),
        option.bool(
            "31982",
            "Monster Mummy Wrap",
            'Mode: [select] only\nShould the bot buy "Monster Mummy Wrap" ?',
            false,
        ),
        option.bool("31929", "Darkwave Dancer", 'Mode: [select] only\nShould the bot buy "Darkwave Dancer" ?', false),
        option.bool(
            "31924",
            "Live/Love Banner (Left)",
            'Mode: [select] only\nShould the bot buy "Live/Love Banner (Left)" ?',
            false,
        ),
        option.bool(
            "31925",
            "Be/Believe Banner (Left)",
            'Mode: [select] only\nShould the bot buy "Be/Believe Banner (Left)" ?',
            false,
        ),
        option.bool("31961", "Darkwave Guitar", 'Mode: [select] only\nShould the bot buy "Darkwave Guitar" ?', false),
        option.bool(
            "31959",
            "Bloodwave Violin and Bow",
            'Mode: [select] only\nShould the bot buy "Bloodwave Violin and Bow" ?',
            false,
        ),
        option.bool(
            "31960",
            "Darkwave Violin and Bow",
            'Mode: [select] only\nShould the bot buy "Darkwave Violin and Bow" ?',
            false,
        ),
        option.bool("31958", "Darkwave Drumset", 'Mode: [select] only\nShould the bot buy "Darkwave Drumset" ?', false),
        option.bool(
            "31957",
            "Darkwave Keyboards",
            'Mode: [select] only\nShould the bot buy "Darkwave Keyboards" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CruxShadowsMerge.select,
});

export default function main(): void {
    const script = new CruxShadowsMerge();
    Core.bankingBlackList.push("Glowing Pumpkinseed ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
