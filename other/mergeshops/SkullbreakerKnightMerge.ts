/*
name: SkullbreakerKnightMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/SkullbreakerKnightMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class SkullbreakerKnightMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            const currentQuant = req.temp ? bot.tempInv.getQuantity(req.name) : bot.inventory.getQuantity(req.name);
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
                // Add how to get items here
                case "Especially Unbroken Skull":
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(!Core.isMember ? 8411 : 8412);
                    Core.logger(`Farming ${req.name} (${currentQuant}/${quant})`);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("warundead", "r3", "Left", "*", "Unbroken Skulls", 100);
                        Core.huntMonster("warundead", "Summon Lich", "Summon Lich's Orb");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("stonewood", 2071, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "65444",
            "Skullbreaker Knight",
            'Mode: [select] only\nShould the bot buy "Skullbreaker Knight" ?',
            false,
        ),
        option.bool(
            "65445",
            "Skullbreaker Knight's Hood",
            'Mode: [select] only\nShould the bot buy "Skullbreaker Knight\'s Hood" ?',
            false,
        ),
        option.bool(
            "65446",
            "Skullbreaker's Shadow Hood",
            'Mode: [select] only\nShould the bot buy "Skullbreaker\'s Shadow Hood" ?',
            false,
        ),
        option.bool(
            "65447",
            "Skullbreaker's Hooded Skull",
            'Mode: [select] only\nShould the bot buy "Skullbreaker\'s Hooded Skull" ?',
            false,
        ),
        option.bool(
            "65448",
            "Skullbreaker's Spikes",
            'Mode: [select] only\nShould the bot buy "Skullbreaker\'s Spikes" ?',
            false,
        ),
        option.bool(
            "65449",
            "Skullbreaker's Cloak",
            'Mode: [select] only\nShould the bot buy "Skullbreaker\'s Cloak" ?',
            false,
        ),
        option.bool(
            "65450",
            "Skullbreaker's Spiked Cloak",
            'Mode: [select] only\nShould the bot buy "Skullbreaker\'s Spiked Cloak" ?',
            false,
        ),
        option.bool(
            "65451",
            "Skullbreaker's Blade",
            'Mode: [select] only\nShould the bot buy "Skullbreaker\'s Blade" ?',
            false,
        ),
        option.bool(
            "65452",
            "Skullbreaker's Spear",
            'Mode: [select] only\nShould the bot buy "Skullbreaker\'s Spear" ?',
            false,
        ),
        option.bool(
            "65453",
            "Skullbreaker's Reaver",
            'Mode: [select] only\nShould the bot buy "Skullbreaker\'s Reaver" ?',
            false,
        ),
        option.bool(
            "65454",
            "Dual Skullbreaker's Reaver",
            'Mode: [select] only\nShould the bot buy "Dual Skullbreaker\'s Reaver" ?',
            false,
        ),
        option.bool(
            "65455",
            "Skullbreaker's Dagger",
            'Mode: [select] only\nShould the bot buy "Skullbreaker\'s Dagger" ?',
            false,
        ),
        option.bool(
            "65456",
            "Skullbreaker's Blade + Axe",
            'Mode: [select] only\nShould the bot buy "Skullbreaker\'s Blade + Axe" ?',
            false,
        ),
        option.bool(
            "65457",
            "Skullbreaker's Axe",
            'Mode: [select] only\nShould the bot buy "Skullbreaker\'s Axe" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SkullbreakerKnightMerge.select,
});

export default function main(): void {
    const script = new SkullbreakerKnightMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
