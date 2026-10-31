/*
name: StormCacheMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/StormCacheMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { ThunderFang } from "../../story/ThunderFang";

const Adv = new CoreAdvanced();
const TF = new ThunderFang();

export class StormCacheMerge {
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
                case "Tonitrus Gem":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    if (!Core.checkInventory(Core.questRewards(4243))) {
                        Core.addDrop(...Core.questRewards(4243));
                        Core.ensureAccept(4243);
                        Core.huntMonster("thunderfang", "Energy Elemental", "Gem Found");
                        Core.ensureComplete(4243);
                    }
                    // Core.RegisterQuests(4246);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(4246);
                        Core.huntMonster("thunderfang", "Storm Draconian", "Storm Draconian Defeated", 8);
                        Core.ensureComplete(4246);
                        bot.wait.forPickup(req.name);
                    }
                    // Core.CancelRegisteredQuests();
                    break;
            }
        };
        TF.storyLine();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("thunderfang", 1103, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("29781", "Tempestas Egg", 'Mode: [select] only\nShould the bot buy "Tempestas Egg" ?', false),
        option.bool(
            "29732",
            "Thunderfang Battlemage",
            'Mode: [select] only\nShould the bot buy "Thunderfang Battlemage" ?',
            false,
        ),
        option.bool(
            "29733",
            "Electrostatic Hair",
            'Mode: [select] only\nShould the bot buy "Electrostatic Hair" ?',
            false,
        ),
        option.bool(
            "29734",
            "Electrostatic Locks",
            'Mode: [select] only\nShould the bot buy "Electrostatic Locks" ?',
            false,
        ),
        option.bool(
            "29735",
            "Cape of Lightning",
            'Mode: [select] only\nShould the bot buy "Cape of Lightning" ?',
            false,
        ),
        option.bool(
            "29782",
            "Lightning Dragon Pet",
            'Mode: [select] only\nShould the bot buy "Lightning Dragon Pet" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: StormCacheMerge.select,
});

export default function main(): void {
    const script = new StormCacheMerge();
    Core.bankingBlackList.push("Tonitrus Gem");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
