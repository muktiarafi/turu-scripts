/*
name: Huntress Merge
description: This will get all or selected items on this merge shop.
tags: huntress-merge, seasonal, frostvale
*/
// Port of Scripts/Seasonal/Frostvale/HuntressMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFrostvale } from "./story/CoreFrostvale";

const Adv = new CoreAdvanced();
const Frostvale = new CoreFrostvale();

export class HuntressMerge {
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
                case "Sluagh Bell":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8446, 8447, 8448);
                    Core.killMonster("otziwar", "r6", "Left", "Sluagh Warrior", req.name, req.quantity, {
                        isTemp: req.temp,
                    });
                    bot.wait.forPickup(req.id);
                    Core.cancelRegisteredQuests();
                    break;
                case "Punk Coal Elf Stabber":

                case "Festive Punk Elf Stabber":

                case "Wild Huntress' Sword":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonsterMapID("otziwar", 14, req.name, undefined, { isTemp: false });
                    break;
            }
        };
        Frostvale.otziwar();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("otziwar", 2088, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("65587", "Ice Wizard", 'Mode: [select] only\nShould the bot buy "Ice Wizard" ?', false),
        option.bool(
            "65588",
            "Ice Warlock's Hood",
            'Mode: [select] only\nShould the bot buy "Ice Warlock\'s Hood" ?',
            false,
        ),
        option.bool(
            "65589",
            "Ice Witch's Hood",
            'Mode: [select] only\nShould the bot buy "Ice Witch\'s Hood" ?',
            false,
        ),
        option.bool(
            "65590",
            "Ice Wizard's Rune",
            'Mode: [select] only\nShould the bot buy "Ice Wizard\'s Rune" ?',
            false,
        ),
        option.bool(
            "65591",
            "Ice Wizard's Portal",
            'Mode: [select] only\nShould the bot buy "Ice Wizard\'s Portal" ?',
            false,
        ),
        option.bool(
            "65592",
            "Ice Wizard's Cane",
            'Mode: [select] only\nShould the bot buy "Ice Wizard\'s Cane" ?',
            false,
        ),
        option.bool("66121", "Punk Coal Elf", 'Mode: [select] only\nShould the bot buy "Punk Coal Elf" ?', false),
        option.bool(
            "66122",
            "Punk Coal Elf's Hair",
            'Mode: [select] only\nShould the bot buy "Punk Coal Elf\'s Hair" ?',
            false,
        ),
        option.bool(
            "66123",
            "Punk Coal Elf's Locks",
            'Mode: [select] only\nShould the bot buy "Punk Coal Elf\'s Locks" ?',
            false,
        ),
        option.bool(
            "66124",
            "Punk Coal Elf's Bag",
            'Mode: [select] only\nShould the bot buy "Punk Coal Elf\'s Bag" ?',
            false,
        ),
        option.bool(
            "66125",
            "Punk Coal Elf's Back Gun",
            'Mode: [select] only\nShould the bot buy "Punk Coal Elf\'s Back Gun" ?',
            false,
        ),
        option.bool(
            "66126",
            "Punk Coal Elf's Scythe",
            'Mode: [select] only\nShould the bot buy "Punk Coal Elf\'s Scythe" ?',
            false,
        ),
        option.bool(
            "66127",
            "Punk Coal Elf's Dynamite",
            'Mode: [select] only\nShould the bot buy "Punk Coal Elf\'s Dynamite" ?',
            false,
        ),
        option.bool(
            "66129",
            "Dual Punk Coal Elf's Stabbers",
            'Mode: [select] only\nShould the bot buy "Dual Punk Coal Elf\'s Stabbers" ?',
            false,
        ),
        option.bool(
            "66130",
            "Punk Coal Elf's Machine Gun",
            'Mode: [select] only\nShould the bot buy "Punk Coal Elf\'s Machine Gun" ?',
            false,
        ),
        option.bool("66131", "Festive Punk Elf", 'Mode: [select] only\nShould the bot buy "Festive Punk Elf" ?', false),
        option.bool(
            "66132",
            "Festive Punk Elf's Hair",
            'Mode: [select] only\nShould the bot buy "Festive Punk Elf\'s Hair" ?',
            false,
        ),
        option.bool(
            "66133",
            "Festive Punk Elf's Locks",
            'Mode: [select] only\nShould the bot buy "Festive Punk Elf\'s Locks" ?',
            false,
        ),
        option.bool(
            "66134",
            "Festive Punk Elf's Bag",
            'Mode: [select] only\nShould the bot buy "Festive Punk Elf\'s Bag" ?',
            false,
        ),
        option.bool(
            "66135",
            "Festive Punk Elf's Back Gun",
            'Mode: [select] only\nShould the bot buy "Festive Punk Elf\'s Back Gun" ?',
            false,
        ),
        option.bool(
            "66136",
            "Festive Punk Elf's Scythe",
            'Mode: [select] only\nShould the bot buy "Festive Punk Elf\'s Scythe" ?',
            false,
        ),
        option.bool(
            "66137",
            "Festive Punk Elf's Dynamite",
            'Mode: [select] only\nShould the bot buy "Festive Punk Elf\'s Dynamite" ?',
            false,
        ),
        option.bool(
            "66139",
            "Dual Festive Punk Elf's Stabbers",
            'Mode: [select] only\nShould the bot buy "Dual Festive Punk Elf\'s Stabbers" ?',
            false,
        ),
        option.bool(
            "66140",
            "Festive Punk Elf's Machine Gun",
            'Mode: [select] only\nShould the bot buy "Festive Punk Elf\'s Machine Gun" ?',
            false,
        ),
        option.bool(
            "66840",
            "Frostval Valencia Armor",
            'Mode: [select] only\nShould the bot buy "Frostval Valencia Armor" ?',
            false,
        ),
        option.bool(
            "66843",
            "Frostval Trissa Armor",
            'Mode: [select] only\nShould the bot buy "Frostval Trissa Armor" ?',
            false,
        ),
        option.bool(
            "66841",
            "Valencia's Hair + Hat",
            'Mode: [select] only\nShould the bot buy "Valencia\'s Hair + Hat" ?',
            false,
        ),
        option.bool(
            "66842",
            "Valencia's Locks + Hat",
            'Mode: [select] only\nShould the bot buy "Valencia\'s Locks + Hat" ?',
            false,
        ),
        option.bool(
            "66844",
            "Trissa's Hair + Hat",
            'Mode: [select] only\nShould the bot buy "Trissa\'s Hair + Hat" ?',
            false,
        ),
        option.bool(
            "66845",
            "Trissa's Locks + Hat",
            'Mode: [select] only\nShould the bot buy "Trissa\'s Locks + Hat" ?',
            false,
        ),
        option.bool(
            "66848",
            "Wild Huntress' Blade",
            'Mode: [select] only\nShould the bot buy "Wild Huntress\' Blade" ?',
            false,
        ),
        option.bool(
            "66862",
            "Dual Huntress Blades",
            'Mode: [select] only\nShould the bot buy "Dual Huntress Blades" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: HuntressMerge.select,
});

export default function main(): void {
    const script = new HuntressMerge();
    Core.bankingBlackList.push(
        "Sluagh Bell",
        "Punk Coal Elf Stabber",
        "Festive Punk Elf Stabber",
        "Wild Huntress' Sword ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
