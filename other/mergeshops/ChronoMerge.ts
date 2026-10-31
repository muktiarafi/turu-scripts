/*
name: ChronoMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/ChronoMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ChronoMerge {
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
                case "Time Piece":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8171);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster(
                            "shadowrealmpast",
                            "r2",
                            "Right",
                            "Shadow Guardian",
                            "Shadow Guardians Defeated",
                        );
                    }
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("chronohub", 2011, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "53185",
            "Silver ChronoGuardian",
            'Mode: [select] only\nShould the bot buy "Silver ChronoGuardian" ?',
            false,
        ),
        option.bool(
            "53198",
            "Bronze ChronoGuardian",
            'Mode: [select] only\nShould the bot buy "Bronze ChronoGuardian" ?',
            false,
        ),
        option.bool(
            "53186",
            "Silver ChronoGuardian Helmet",
            'Mode: [select] only\nShould the bot buy "Silver ChronoGuardian Helmet" ?',
            false,
        ),
        option.bool(
            "53187",
            "Silver ChronoGuardian Mask",
            'Mode: [select] only\nShould the bot buy "Silver ChronoGuardian Mask" ?',
            false,
        ),
        option.bool(
            "53188",
            "Silver ChronoGuardian Mask + Hair",
            'Mode: [select] only\nShould the bot buy "Silver ChronoGuardian Mask + Hair" ?',
            false,
        ),
        option.bool(
            "53189",
            "Silver ChronoGuardian Mask + Locks",
            'Mode: [select] only\nShould the bot buy "Silver ChronoGuardian Mask + Locks" ?',
            false,
        ),
        option.bool(
            "53190",
            "Silver ChronoGuardian Open Helm",
            'Mode: [select] only\nShould the bot buy "Silver ChronoGuardian Open Helm" ?',
            false,
        ),
        option.bool(
            "53199",
            "Bronze ChronoGuardian Helmet",
            'Mode: [select] only\nShould the bot buy "Bronze ChronoGuardian Helmet" ?',
            false,
        ),
        option.bool(
            "53200",
            "Bronze ChronoGuardian Mask",
            'Mode: [select] only\nShould the bot buy "Bronze ChronoGuardian Mask" ?',
            false,
        ),
        option.bool(
            "53201",
            "Bronze ChronoGuardian Mask + Hair",
            'Mode: [select] only\nShould the bot buy "Bronze ChronoGuardian Mask + Hair" ?',
            false,
        ),
        option.bool(
            "53202",
            "ChronoGuardian Hair",
            'Mode: [select] only\nShould the bot buy "ChronoGuardian Hair" ?',
            false,
        ),
        option.bool(
            "53203",
            "Bronze ChronoGuardian Mask + Locks",
            'Mode: [select] only\nShould the bot buy "Bronze ChronoGuardian Mask + Locks" ?',
            false,
        ),
        option.bool(
            "53204",
            "ChronoGuardian Locks",
            'Mode: [select] only\nShould the bot buy "ChronoGuardian Locks" ?',
            false,
        ),
        option.bool(
            "53205",
            "Bronze ChronoGuardian Open Helm",
            'Mode: [select] only\nShould the bot buy "Bronze ChronoGuardian Open Helm" ?',
            false,
        ),
        option.bool(
            "53191",
            "Silver ChronoGuardian Rocket Pack",
            'Mode: [select] only\nShould the bot buy "Silver ChronoGuardian Rocket Pack" ?',
            false,
        ),
        option.bool(
            "53192",
            "Silver ChronoGuardian Bazooka Cape",
            'Mode: [select] only\nShould the bot buy "Silver ChronoGuardian Bazooka Cape" ?',
            false,
        ),
        option.bool(
            "53206",
            "Bronze ChronoGuardian Rocket Pack",
            'Mode: [select] only\nShould the bot buy "Bronze ChronoGuardian Rocket Pack" ?',
            false,
        ),
        option.bool(
            "53207",
            "Bronze ChronoGuardian Bazooka Cape",
            'Mode: [select] only\nShould the bot buy "Bronze ChronoGuardian Bazooka Cape" ?',
            false,
        ),
        option.bool(
            "53193",
            "Silver ChronoGuardian Bazooka",
            'Mode: [select] only\nShould the bot buy "Silver ChronoGuardian Bazooka" ?',
            false,
        ),
        option.bool(
            "53194",
            "Silver ChronoGuardian Blaster",
            'Mode: [select] only\nShould the bot buy "Silver ChronoGuardian Blaster" ?',
            false,
        ),
        option.bool(
            "53195",
            "Silver Overclocked Laser Blaster",
            'Mode: [select] only\nShould the bot buy "Silver Overclocked Laser Blaster" ?',
            false,
        ),
        option.bool(
            "53196",
            "Silver Overclocked Hammer",
            'Mode: [select] only\nShould the bot buy "Silver Overclocked Hammer" ?',
            false,
        ),
        option.bool(
            "53197",
            "Silver Overclocked Polearm",
            'Mode: [select] only\nShould the bot buy "Silver Overclocked Polearm" ?',
            false,
        ),
        option.bool(
            "53208",
            "Bronze ChronoGuardian Bazooka",
            'Mode: [select] only\nShould the bot buy "Bronze ChronoGuardian Bazooka" ?',
            false,
        ),
        option.bool(
            "53209",
            "Bronze ChronoGuardian Blaster",
            'Mode: [select] only\nShould the bot buy "Bronze ChronoGuardian Blaster" ?',
            false,
        ),
        option.bool(
            "53210",
            "Bronze Overclocked Laser Blaster",
            'Mode: [select] only\nShould the bot buy "Bronze Overclocked Laser Blaster" ?',
            false,
        ),
        option.bool(
            "53211",
            "Bronze Overclocked Hammer",
            'Mode: [select] only\nShould the bot buy "Bronze Overclocked Hammer" ?',
            false,
        ),
        option.bool(
            "53212",
            "Bronze Overclocked Polearm",
            'Mode: [select] only\nShould the bot buy "Bronze Overclocked Polearm" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ChronoMerge.select,
});

export default function main(): void {
    const script = new ChronoMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
