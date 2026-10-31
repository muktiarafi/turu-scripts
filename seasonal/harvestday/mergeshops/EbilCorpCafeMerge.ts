/*
name: Ebil Corp Cafe Merge
description: This will get all or selected items on this merge shop.
tags: ebil-corp-cafe-merge, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/MergeShops/EbilCorpCafeMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreHarvestDay } from "../CoreHarvestDay";

const Adv = new CoreAdvanced();
const HD = new CoreHarvestDay();

export class EbilCorpCafeMerge {
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
                case "Tin Can of ???":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(8971);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("ebiltakeover", "Smorgasbord", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "PACVEC Mach 1.0":

                case "PACVEC Helm":

                case "PACVEC Visor":

                case "PACVEC Guard":

                case "PACVEC Battle Wings":

                case "PACVEC Battle Hammer":

                case "PACVEC Railgun":

                case "PACVEC Alien":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("ebilmech", "Ebil Mech Dragon", req.name, quant, { isTemp: false });
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("ebiltakeover")) {
            return;
        }
        HD.epilTakeOver();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("ebiltakeover", 2190, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("70594", "PACV Mach 2.0", 'Mode: [select] only\nShould the bot buy "PACV Mach 2.0" ?', false),
        option.bool("70595", "PACV Helm", 'Mode: [select] only\nShould the bot buy "PACV Helm" ?', false),
        option.bool("70596", "PACV Visor", 'Mode: [select] only\nShould the bot buy "PACV Visor" ?', false),
        option.bool("70597", "PACV Guard", 'Mode: [select] only\nShould the bot buy "PACV Guard" ?', false),
        option.bool(
            "70598",
            "PACV Battle Wings",
            'Mode: [select] only\nShould the bot buy "PACV Battle Wings" ?',
            false,
        ),
        option.bool(
            "70603",
            "PACV Battle Hammer",
            'Mode: [select] only\nShould the bot buy "PACV Battle Hammer" ?',
            false,
        ),
        option.bool("70605", "PACV Railgun", 'Mode: [select] only\nShould the bot buy "PACV Railgun" ?', false),
        option.bool("70600", "PACV Alien", 'Mode: [select] only\nShould the bot buy "PACV Alien" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: EbilCorpCafeMerge.select,
});

export default function main(): void {
    const script = new EbilCorpCafeMerge();
    Core.bankingBlackList.push(
        "Tin Can of ???",
        "PACVEC Mach 1.0",
        "PACVEC Helm",
        "PACVEC Visor",
        "PACVEC Guard",
        "PACVEC Battle Wings",
        "PACVEC Battle Hammer",
        "PACVEC Railgun",
        "PACVEC Alien",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
