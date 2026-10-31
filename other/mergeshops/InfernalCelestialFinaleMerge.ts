/*
name: Infernal Celestial Finale Merge
description: This bot will farm the items belonging to the selected mode for the Infernal Celestial Finale Merge [2562] in /infernaldianoia
tags: infernal, celestial, finale, merge, infernaldianoia, nightstar, crown, fallen, arthelyn, wings, dominion
*/
// Port of Scripts/Other/MergeShops/InfernalCelestialFinaleMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { InfernalDianoia } from "../../story/queenofmonsters/extra/InfernalDianoia";

const Adv = new CoreAdvanced();
const ID = new InfernalDianoia();

export class InfernalCelestialFinaleMerge {
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
                case "Infernal Down":
                    this.infernalDown(quant);
                    break;
                case "Arthelyn's Oculus":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("infernaldianoia", "Fallen Arthelyn", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Life Spirit":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("infernaldianoia", "Avatar of Life", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
            }
        };
        ID.storyline();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("infernaldianoia", 2562, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    infernalDown(quant = 100): void {
        if (Core.checkInventory("Infernal Down", quant)) {
            return;
        }
        Core.farmingLogger("Infernal Down", quant);
        Core.addDrop("Infernal Down");
        while (!bot.shouldExit && !Core.checkInventory("Infernal Down", quant)) {
            Core.huntMonsterQuest(
                10095,
                ["infernaldianoia", "Eudae", ClassType.Solo],
                ["infernaldianoia", "Avatar of Time", ClassType.Solo],
                ["infernaldianoia", "Aranx, Nightstar", ClassType.Solo],
            );
            bot.wait.forPickup("Infernal Down");
        }
    }

    static readonly select = [
        option.bool("92057", "Nightstar Crown", 'Mode: [select] only\nShould the bot buy "Nightstar Crown" ?', false),
        option.bool(
            "92056",
            "Fallen Arthelyn Wings",
            'Mode: [select] only\nShould the bot buy "Fallen Arthelyn Wings" ?',
            false,
        ),
        option.bool(
            "92055",
            "Fallen Arthelyn Helm",
            'Mode: [select] only\nShould the bot buy "Fallen Arthelyn Helm" ?',
            false,
        ),
        option.bool("92054", "Fallen Arthelyn", 'Mode: [select] only\nShould the bot buy "Fallen Arthelyn" ?', false),
        option.bool(
            "92188",
            "Celestial Dominion Gauntlet",
            'Mode: [select] only\nShould the bot buy "Celestial Dominion Gauntlet" ?',
            false,
        ),
        option.bool(
            "92187",
            "Celestial Dominion Wings",
            'Mode: [select] only\nShould the bot buy "Celestial Dominion Wings" ?',
            false,
        ),
        option.bool(
            "92186",
            "Celestial Dominion Helm",
            'Mode: [select] only\nShould the bot buy "Celestial Dominion Helm" ?',
            false,
        ),
        option.bool(
            "92185",
            "Celestial Dominion",
            'Mode: [select] only\nShould the bot buy "Celestial Dominion" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: InfernalCelestialFinaleMerge.select,
});

export default function main(): void {
    const script = new InfernalCelestialFinaleMerge();
    Core.bankingBlackList.push("Infernal Down", "Arthelyn's Oculus", "Life Spirit");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
