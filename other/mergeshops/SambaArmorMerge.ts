/*
name: Samba Armor Merge
description: This bot will farm the items belonging to the selected mode for the Samba Armor Merge [302] in /bloodtusk
tags: samba, armor, merge, bloodtusk, dancin, green, dance, feathers, purple
*/
// Port of Scripts/Other/MergeShops/SambaArmorMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class SambaArmorMerge {
    // [Can Change] This should only be changed by the author.
    //If true, it will not stop the script if the default case triggers and the user chose to only get mats
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
                case "Green Dancin' Feathers Merge":

                case "Samba Hair":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(1180);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("bloodtusk", "Horc Boar Scout", "Boar Bristles", 5);
                        Core.huntMonster("bloodtusk", "Horc Boar Scout", "Boar Bone");
                        Core.huntMonster("bloodtusk", "Jungle Vulture", "Dyed Feathers", 10);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Purple Dancin' Feathers Merge":

                case "Samba Outfit!":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(1181);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("bloodtusk", "Horc Boar Scout", "Bolt of Cloth", 3);
                        Core.huntMonster("bloodtusk", "Rhison", "Shiny Metal", 3);
                        Core.getMapItem(46408, 10, "bloodtusk");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("bloodtusk", 302, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("8831", "Dancin' Armor", 'Mode: [select] only\nShould the bot buy "Dancin\' Armor" ?', false),
        option.bool(
            "8744",
            "Green Dance Feathers",
            'Mode: [select] only\nShould the bot buy "Green Dance Feathers" ?',
            false,
        ),
        option.bool(
            "8745",
            "Purple Dance Feathers",
            'Mode: [select] only\nShould the bot buy "Purple Dance Feathers" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SambaArmorMerge.select,
});

export default function main(): void {
    const script = new SambaArmorMerge();
    Core.bankingBlackList.push(
        "Samba Hair",
        "Samba Outfit!",
        "Green Dancin' Feathers Merge",
        "Purple Dancin' Feathers Merge",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
