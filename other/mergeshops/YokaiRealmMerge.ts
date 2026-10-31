/*
name: Yokai Realm Merge
description: This bot will farm the items belonging to the selected mode for the Yokai Realm Merge [2431] in /yokairealm
tags: yokai, realm, merge, yokairealm, bujin, doomknight, hairbun, oni, doomed, artillery, array, necrotic, dao, doom, usagi, battle, fan, fans
*/
// Port of Scripts/Other/MergeShops/YokaiRealmMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDOY } from "../../story/dragonsofyokai/CoreDOY";

const Adv = new CoreAdvanced();
const DOY = new CoreDOY();

export class YokaiRealmMerge {
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
                case "Doomatter":
                    Core.farmingLogger(req.name, quant);
                    Adv.buyItem("tercessuinotlim", 1951, req.name, quant);
                    break;
                case "Mikoto's Puppet String":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9690);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("yokairealm", "Mikoto Kukol'nyy", "Mikoto's Red String", 3, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        DOY.yokaiRealm();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("yokairealm", 2431, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("83655", "Bujin DoomKnight", 'Mode: [select] only\nShould the bot buy "Bujin DoomKnight" ?', false),
        option.bool(
            "83656",
            "Bujin DoomKnight Hairbun",
            'Mode: [select] only\nShould the bot buy "Bujin DoomKnight Hairbun" ?',
            false,
        ),
        option.bool(
            "83657",
            "Bujin DoomKnight Locks",
            'Mode: [select] only\nShould the bot buy "Bujin DoomKnight Locks" ?',
            false,
        ),
        option.bool(
            "83658",
            "Bujin DoomKnight Hairbun Visage",
            'Mode: [select] only\nShould the bot buy "Bujin DoomKnight Hairbun Visage" ?',
            false,
        ),
        option.bool(
            "83659",
            "Bujin DoomKnight Visage",
            'Mode: [select] only\nShould the bot buy "Bujin DoomKnight Visage" ?',
            false,
        ),
        option.bool(
            "83661",
            "Bujin DoomKnight Helm",
            'Mode: [select] only\nShould the bot buy "Bujin DoomKnight Helm" ?',
            false,
        ),
        option.bool(
            "83662",
            "Bujin DoomKnight Oni Mask",
            'Mode: [select] only\nShould the bot buy "Bujin DoomKnight Oni Mask" ?',
            false,
        ),
        option.bool(
            "83663",
            "Doomed Artillery Array",
            'Mode: [select] only\nShould the bot buy "Doomed Artillery Array" ?',
            false,
        ),
        option.bool(
            "83667",
            "Necrotic Dao of Doom",
            'Mode: [select] only\nShould the bot buy "Necrotic Dao of Doom" ?',
            false,
        ),
        option.bool(
            "83668",
            "Dual Necrotic Dao of Doom",
            'Mode: [select] only\nShould the bot buy "Dual Necrotic Dao of Doom" ?',
            false,
        ),
        option.bool(
            "85369",
            "Usagi Oni Battle Fan",
            'Mode: [select] only\nShould the bot buy "Usagi Oni Battle Fan" ?',
            false,
        ),
        option.bool(
            "85370",
            "Usagi Oni Battle Fans",
            'Mode: [select] only\nShould the bot buy "Usagi Oni Battle Fans" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: YokaiRealmMerge.select,
});

export default function main(): void {
    const script = new YokaiRealmMerge();
    Core.bankingBlackList.push("Doomatter", "Mikoto's Puppet String");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
