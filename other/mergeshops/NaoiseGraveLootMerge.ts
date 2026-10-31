/*
name: NaoiseGrave Loot Merge
description: This bot will farm the items belonging to the selected mode for the NaoiseGrave Loot Merge [2453] in /naoisegrave
tags: naoisegrave, loot, merge, naoisegrave, gold, voucher, k, antistorm, warbeast, skull, war, beast, warbeasts, energy, fist, fists, tank, tanks
*/
// Port of Scripts/Other/MergeShops/NaoiseGraveLootMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AOR = new CoreAOR();

export class NaoiseGraveLootMerge {
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
                case "Dragonling Bone":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("naoisegrave", "Bone Dragonling", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                case "Volgritian's Dragon Bone":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9778);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("naoisegrave", "Bone Dragonling", "Dragonling Soul", undefined, {
                            log: false,
                        });
                        Core.huntMonster("naoisegrave", "Ice Guardian", "Cryostone", undefined, { log: false });
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("naoisegrave", "Volgritian", "Gold Chain", undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        AOR.naoiseGrave();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("naoisegrave", 2453, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "86499",
            "Anti-Storm Warbeast",
            'Mode: [select] only\nShould the bot buy "Anti-Storm Warbeast" ?',
            false,
        ),
        option.bool(
            "86501",
            "Anti-Storm Warbeast Skull",
            'Mode: [select] only\nShould the bot buy "Anti-Storm Warbeast Skull" ?',
            false,
        ),
        option.bool(
            "86500",
            "Anti-Storm War Beast Helm",
            'Mode: [select] only\nShould the bot buy "Anti-Storm War Beast Helm" ?',
            false,
        ),
        option.bool(
            "86502",
            "Anti-Storm Warbeast's Energy Aura",
            'Mode: [select] only\nShould the bot buy "Anti-Storm Warbeast\'s Energy Aura" ?',
            false,
        ),
        option.bool(
            "86503",
            "Anti-Storm Warbeast's Energy Fist",
            'Mode: [select] only\nShould the bot buy "Anti-Storm Warbeast\'s Energy Fist" ?',
            false,
        ),
        option.bool(
            "86504",
            "Anti-Storm Warbeast's Energy Fists",
            'Mode: [select] only\nShould the bot buy "Anti-Storm Warbeast\'s Energy Fists" ?',
            false,
        ),
        option.bool(
            "82167",
            "Anti-Storm War Tank",
            'Mode: [select] only\nShould the bot buy "Anti-Storm War Tank" ?',
            false,
        ),
        option.bool(
            "82169",
            "Anti-Storm War Tank Skull",
            'Mode: [select] only\nShould the bot buy "Anti-Storm War Tank Skull" ?',
            false,
        ),
        option.bool(
            "82168",
            "Anti-Storm War Tank Helm",
            'Mode: [select] only\nShould the bot buy "Anti-Storm War Tank Helm" ?',
            false,
        ),
        option.bool(
            "82171",
            "Anti-Storm War Tank's Energy Aura",
            'Mode: [select] only\nShould the bot buy "Anti-Storm War Tank\'s Energy Aura" ?',
            false,
        ),
        option.bool(
            "82172",
            "Anti-Storm War Tank's Energy Fist",
            'Mode: [select] only\nShould the bot buy "Anti-Storm War Tank\'s Energy Fist" ?',
            false,
        ),
        option.bool(
            "82173",
            "Anti-Storm War Tank's Energy Fists",
            'Mode: [select] only\nShould the bot buy "Anti-Storm War Tank\'s Energy Fists" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: NaoiseGraveLootMerge.select,
});

export default function main(): void {
    const script = new NaoiseGraveLootMerge();
    Core.bankingBlackList.push("Dragonling Bone", "Volgritian's Dragon Bone");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
