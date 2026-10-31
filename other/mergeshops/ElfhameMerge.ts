/*
name: Elfhame Merge
description: This bot will farm the items belonging to the selected mode for the Elfhame Merge [1188] in /elfhame
tags: elfhame, merge, elfhame, ruin, stalker, pet, guardian, spirit, morph, twisted, deer, ratawampus, toxic
*/
// Port of Scripts/Other/MergeShops/ElfhameMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { BrightOak } from "../../story/queenofmonsters/extra/BrightOak";

const Adv = new CoreAdvanced();
const BO = new BrightOak();

export class ElfhameMerge {
    // [Can Change] This should only be changed by the author.
    // If true, it will not stop the script if the default case triggers and the user chose to only get mats
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
                case "Flower of Renewal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(4669);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("elfhame", "Blighted Deer", "Deer Horn", 2, { isTemp: true, log: false });
                        Core.huntMonster("elfhame", "Wolfrider", "Elfhame Wolf Pelt", 2, { isTemp: true, log: false });
                        Core.huntMonster("elfhame", "Ruin Dweller", "Ruin Dweller Remains", 3, {
                            isTemp: true,
                            log: false,
                        });
                        Core.huntMonster("elfhame", "Ratawampus", "Ratawampus Tail", 2, { isTemp: true, log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        BO.avenGreywhorl();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("elfhame", 1188, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("32216", "Ruin Stalker Pet", 'Mode: [select] only\nShould the bot buy "Ruin Stalker Pet" ?', false),
        option.bool("32213", "Guardian Spirit", 'Mode: [select] only\nShould the bot buy "Guardian Spirit" ?', false),
        option.bool(
            "32214",
            "Guardian Spirit Morph",
            'Mode: [select] only\nShould the bot buy "Guardian Spirit Morph" ?',
            false,
        ),
        option.bool(
            "32219",
            "Guardian Spirit Sword",
            'Mode: [select] only\nShould the bot buy "Guardian Spirit Sword" ?',
            false,
        ),
        option.bool("32218", "Twisted Deer Pet", 'Mode: [select] only\nShould the bot buy "Twisted Deer Pet" ?', false),
        option.bool("32215", "Ratawampus Pet", 'Mode: [select] only\nShould the bot buy "Ratawampus Pet" ?', false),
        option.bool("32250", "Toxic Spirit", 'Mode: [select] only\nShould the bot buy "Toxic Spirit" ?', false),
        option.bool(
            "32251",
            "Toxic Spirit Morph",
            'Mode: [select] only\nShould the bot buy "Toxic Spirit Morph" ?',
            false,
        ),
        option.bool(
            "32252",
            "Toxic Spirit Sword",
            'Mode: [select] only\nShould the bot buy "Toxic Spirit Sword" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ElfhameMerge.select,
});

export default function main(): void {
    const script = new ElfhameMerge();
    Core.bankingBlackList.push("Flower of Renewal");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
