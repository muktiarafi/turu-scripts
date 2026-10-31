/*
name: Diplomat Merge
description: farms the materials and gets teh items from the diplomat merge in /castle
tags: diplomate merge, castle, swordhavenrep,
*/
// Port of Scripts/Other/MergeShops/DiplomatMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class DiplomatMerge {
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
                case "Elodie's Trinket":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9155);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("shogunwar", "Bamboo Treeant", "Bamboo Stalk", 7);
                        Core.huntMonster("aozorahills", "Reishi", "Dried Reishi", 7);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        Farm.swordhavenREP();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("castle ", 2255, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "72035",
            "Swordhaven Emissary",
            'Mode: [select] only\nShould the bot buy "Swordhaven Emissary" ?',
            false,
        ),
        option.bool(
            "72036",
            "Swordhaven Emissary Hair",
            'Mode: [select] only\nShould the bot buy "Swordhaven Emissary Hair" ?',
            false,
        ),
        option.bool(
            "72037",
            "Swordhaven Emissary Circlet",
            'Mode: [select] only\nShould the bot buy "Swordhaven Emissary Circlet" ?',
            false,
        ),
        option.bool(
            "72038",
            "Swordhaven Emissary Locks",
            'Mode: [select] only\nShould the bot buy "Swordhaven Emissary Locks" ?',
            false,
        ),
        option.bool(
            "72039",
            "Swordhaven Emissary Diadem",
            'Mode: [select] only\nShould the bot buy "Swordhaven Emissary Diadem" ?',
            false,
        ),
        option.bool(
            "72040",
            "Swordhaven Emissary Hood",
            'Mode: [select] only\nShould the bot buy "Swordhaven Emissary Hood" ?',
            false,
        ),
        option.bool(
            "72041",
            "Swordhaven Emissary Cowl",
            'Mode: [select] only\nShould the bot buy "Swordhaven Emissary Cowl" ?',
            false,
        ),
        option.bool(
            "72042",
            "Emissary Arrow Quiver",
            'Mode: [select] only\nShould the bot buy "Emissary Arrow Quiver" ?',
            false,
        ),
        option.bool(
            "72043",
            "Swordhaven Emissary Cape",
            'Mode: [select] only\nShould the bot buy "Swordhaven Emissary Cape" ?',
            false,
        ),
        option.bool(
            "72044",
            "Swordhaven Emissary Cape and Quiver",
            'Mode: [select] only\nShould the bot buy "Swordhaven Emissary Cape and Quiver" ?',
            false,
        ),
        option.bool(
            "72045",
            "Swordhaven Emissary Bow",
            'Mode: [select] only\nShould the bot buy "Swordhaven Emissary Bow" ?',
            false,
        ),
        option.bool(
            "72046",
            "Swordhaven Emissary Bow and Arrow",
            'Mode: [select] only\nShould the bot buy "Swordhaven Emissary Bow and Arrow" ?',
            false,
        ),
        option.bool(
            "77120",
            "Swordhaven Courtier",
            'Mode: [select] only\nShould the bot buy "Swordhaven Courtier" ?',
            false,
        ),
        option.bool(
            "77121",
            "Swordhaven Courtier Hat",
            'Mode: [select] only\nShould the bot buy "Swordhaven Courtier Hat" ?',
            false,
        ),
        option.bool(
            "77122",
            "Swordhaven Courtier Cap",
            'Mode: [select] only\nShould the bot buy "Swordhaven Courtier Cap" ?',
            false,
        ),
        option.bool(
            "77123",
            "Swordhaven Courtier Cape",
            'Mode: [select] only\nShould the bot buy "Swordhaven Courtier Cape" ?',
            false,
        ),
        option.bool(
            "77526",
            "Formal Swordhaven Courtier",
            'Mode: [select] only\nShould the bot buy "Formal Swordhaven Courtier" ?',
            false,
        ),
        option.bool(
            "77527",
            "Formal Courtier Hat",
            'Mode: [select] only\nShould the bot buy "Formal Courtier Hat" ?',
            false,
        ),
        option.bool(
            "77528",
            "Formal Courtier Cap",
            'Mode: [select] only\nShould the bot buy "Formal Courtier Cap" ?',
            false,
        ),
        option.bool(
            "77529",
            "Formal Courtier Cape",
            'Mode: [select] only\nShould the bot buy "Formal Courtier Cape" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DiplomatMerge.select,
});

export default function main(): void {
    const script = new DiplomatMerge();
    Core.bankingBlackList.push("Elodie's Trinket");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
