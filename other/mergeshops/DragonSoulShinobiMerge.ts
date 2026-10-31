/*
name: DragonSoulShinobiMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/DragonSoulShinobiMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { YokaiQuests } from "../../story/Yokai";

const Adv = new CoreAdvanced();
const Yokai = new YokaiQuests();

export class DragonSoulShinobiMerge {
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
                case "Dragon Shinobi Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Yokai.quests();
                    Core.registerQuests(7924);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("shadowfortress", "1st Head of Orochi", "Perfect Orochi Scales", 10, {
                            isTemp: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("shadowfortress", 1968, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "59476",
            "DragonSoul Shinobi",
            'Mode: [select] only\nShould the bot buy "DragonSoul Shinobi" ?',
            false,
        ),
        option.bool(
            "59465",
            "DragonSoul Shinobi",
            'Mode: [select] only\nShould the bot buy "DragonSoul Shinobi" ?',
            false,
        ),
        option.bool(
            "59466",
            "DragonSoul Kabuto + DragonTail",
            'Mode: [select] only\nShould the bot buy "DragonSoul Kabuto + DragonTail" ?',
            false,
        ),
        option.bool(
            "59467",
            "DragonSoul Kabuto",
            'Mode: [select] only\nShould the bot buy "DragonSoul Kabuto" ?',
            false,
        ),
        option.bool(
            "59468",
            "DragonSoul Kunoichi Kabuto + DragonTail",
            'Mode: [select] only\nShould the bot buy "DragonSoul Kunoichi Kabuto + DragonTail" ?',
            false,
        ),
        option.bool(
            "59469",
            "DragonSoul Kunoichi Kabuto",
            'Mode: [select] only\nShould the bot buy "DragonSoul Kunoichi Kabuto" ?',
            false,
        ),
        option.bool(
            "59470",
            "Shinobi's Dragon Soul",
            'Mode: [select] only\nShould the bot buy "Shinobi\'s Dragon Soul" ?',
            false,
        ),
        option.bool(
            "59475",
            "DragonSoul Shinobi Back Katana",
            'Mode: [select] only\nShould the bot buy "DragonSoul Shinobi Back Katana" ?',
            false,
        ),
        option.bool(
            "59471",
            "DragonSealed Katana",
            'Mode: [select] only\nShould the bot buy "DragonSealed Katana" ?',
            false,
        ),
        option.bool(
            "59472",
            "DragonSoul Shinobi Katana",
            'Mode: [select] only\nShould the bot buy "DragonSoul Shinobi Katana" ?',
            false,
        ),
        option.bool(
            "59473",
            "DragonSoul Shinobi Katana + Sheath",
            'Mode: [select] only\nShould the bot buy "DragonSoul Shinobi Katana + Sheath" ?',
            false,
        ),
        option.bool(
            "59474",
            "DragonSoul Shinobi Sheathed Katana",
            'Mode: [select] only\nShould the bot buy "DragonSoul Shinobi Sheathed Katana" ?',
            false,
        ),
        option.bool(
            "59477",
            "Dual DragonSoul Shinobi Kunai",
            'Mode: [select] only\nShould the bot buy "Dual DragonSoul Shinobi Kunai" ?',
            false,
        ),
        option.bool(
            "59478",
            "DragonSoul Shinobi Kunai",
            'Mode: [select] only\nShould the bot buy "DragonSoul Shinobi Kunai" ?',
            false,
        ),
        option.bool(
            "59479",
            "Dual DragonSoul Reversed Kunai",
            'Mode: [select] only\nShould the bot buy "Dual DragonSoul Reversed Kunai" ?',
            false,
        ),
        option.bool(
            "59480",
            "DragonSoul Reversed Kunai",
            'Mode: [select] only\nShould the bot buy "DragonSoul Reversed Kunai" ?',
            false,
        ),
        option.bool("59481", "DragonSoul Kama", 'Mode: [select] only\nShould the bot buy "DragonSoul Kama" ?', false),
        option.bool(
            "59482",
            "DragonSoul Grand Kama",
            'Mode: [select] only\nShould the bot buy "DragonSoul Grand Kama" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DragonSoulShinobiMerge.select,
});

export default function main(): void {
    const script = new DragonSoulShinobiMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
