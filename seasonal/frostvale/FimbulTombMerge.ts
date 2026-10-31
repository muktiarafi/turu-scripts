/*
name: Fimbul Tomb Merge
description: This bot will farm the items belonging to the selected mode for the Fimbul Tomb Merge [2378] in /fimbultomb
tags: frostval, fimbul, tomb, merge, fimbultomb, cursed, fimbulventr, witch, vengeful, azure, blossom, resonating, melodic, ice, crystal, crystals
*/
// Port of Scripts/Seasonal/Frostvale/FimbulTombMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFrostvale } from "./story/CoreFrostvale";

const Adv = new CoreAdvanced();
const FV = new CoreFrostvale();

export class FimbulTombMerge {
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
                case "Fimbul's Frost":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9507);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("glacetomb", "Kriomein", "Valedictorian Speech", undefined, { log: false });
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("glacetomb", "Draugr", "Frozen Marrow", 8, { log: false });
                        Core.huntMonster("glacetomb", "Snow Fairy", "Crystalline Wings", 8, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Fimbul's Crystal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9519);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("fimbultomb", "Fimbulventr Witch", "Ice Crown", undefined, { log: false });
                        Core.huntMonster("fimbultomb", "Daselm", "Daselm's Thesis", undefined, { log: false });
                        Core.huntMonster("fimbultomb", "Peter", "Peter's Recc Letter", undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        FV.fimbultomb();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("fimbultomb", 2378, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "82387",
            "Cursed Fimbulventr Witch",
            'Mode: [select] only\nShould the bot buy "Cursed Fimbulventr Witch" ?',
            false,
        ),
        option.bool(
            "82388",
            "Fimbulventr Witch",
            'Mode: [select] only\nShould the bot buy "Fimbulventr Witch" ?',
            false,
        ),
        option.bool(
            "82389",
            "Fimbulventr Witch Visage",
            'Mode: [select] only\nShould the bot buy "Fimbulventr Witch Visage" ?',
            false,
        ),
        option.bool(
            "82390",
            "Fimbulventr Witch Locks",
            'Mode: [select] only\nShould the bot buy "Fimbulventr Witch Locks" ?',
            false,
        ),
        option.bool(
            "82391",
            "Fimbulventr Witch Hair",
            'Mode: [select] only\nShould the bot buy "Fimbulventr Witch Hair" ?',
            false,
        ),
        option.bool(
            "82392",
            "Vengeful Azure Blossom Staff",
            'Mode: [select] only\nShould the bot buy "Vengeful Azure Blossom Staff" ?',
            false,
        ),
        option.bool(
            "82393",
            "Resonating Azure Blossom Staff",
            'Mode: [select] only\nShould the bot buy "Resonating Azure Blossom Staff" ?',
            false,
        ),
        option.bool(
            "82394",
            "Melodic Ice Crystal",
            'Mode: [select] only\nShould the bot buy "Melodic Ice Crystal" ?',
            false,
        ),
        option.bool(
            "82395",
            "Melodic Ice Crystals",
            'Mode: [select] only\nShould the bot buy "Melodic Ice Crystals" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FimbulTombMerge.select,
});

export default function main(): void {
    const script = new FimbulTombMerge();
    Core.bankingBlackList.push("Fimbul's Frost", "Fimbul's Crystal");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
