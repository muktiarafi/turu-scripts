/*
name: CelestialChallengerMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/CelestialChallengerMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class CelestialChallengerMerge {
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
                case "Lumin Badge":
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("celestialarenad", "Queen of Hope", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Celes Badge":
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("CelestialArenaC", "War Construct", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("celestialarena", 1473, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("41443", "Blessed Abezeth", 'Mode: [select] only\nShould the bot buy "Blessed Abezeth" ?', false),
        option.bool(
            "41444",
            "Blessed Armored Wings Of Abezeth",
            'Mode: [select] only\nShould the bot buy "Blessed Armored Wings Of Abezeth" ?',
            false,
        ),
        option.bool(
            "41445",
            "Blessed Wings Of Abezeth",
            'Mode: [select] only\nShould the bot buy "Blessed Wings Of Abezeth" ?',
            false,
        ),
        option.bool(
            "41452",
            "Burning Wings Of Abezeth",
            'Mode: [select] only\nShould the bot buy "Burning Wings Of Abezeth" ?',
            false,
        ),
        option.bool(
            "41446",
            "Blessed Helm of Abezeth",
            'Mode: [select] only\nShould the bot buy "Blessed Helm of Abezeth" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CelestialChallengerMerge.select,
});

export default function main(): void {
    const script = new CelestialChallengerMerge();
    Core.bankingBlackList.push("Lumin Badge", "Celes Badge ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
