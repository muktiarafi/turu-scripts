/*
name: Faizas Merge
description: This bot will farm the items belonging to the selected mode for the Faizas Merge [2726] in /duatpalace
tags: faizas, merge, duatpalace, sandsea, lorekeeper, wise, tome, lore, book
*/
// Port of Scripts/Other/MergeShops/FaizasMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class FaizasMerge {
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
                case "Sandsea Linen":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(10747);
                    // TODO: Replace with actual quest ID
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("duatpalace", "Guardian Hound", "Hound's Pawprint", undefined, {
                            isTemp: true,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("duatpalace", 2726, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "101102",
            "Sandsea Lorekeeper",
            'Mode: [select] only\nShould the bot buy "Sandsea Lorekeeper" ?',
            false,
        ),
        option.bool(
            "101103",
            "Sandsea Lorekeeper Hair",
            'Mode: [select] only\nShould the bot buy "Sandsea Lorekeeper Hair" ?',
            false,
        ),
        option.bool(
            "101104",
            "Sandsea Lorekeeper Locks",
            'Mode: [select] only\nShould the bot buy "Sandsea Lorekeeper Locks" ?',
            false,
        ),
        option.bool(
            "101106",
            "Wise Tome of Lore",
            'Mode: [select] only\nShould the bot buy "Wise Tome of Lore" ?',
            false,
        ),
        option.bool(
            "101105",
            "Wise Book of Lore",
            'Mode: [select] only\nShould the bot buy "Wise Book of Lore" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FaizasMerge.select,
});

export default function main(): void {
    const script = new FaizasMerge();
    Core.bankingBlackList.push("Sandsea Linen");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
