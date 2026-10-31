/*
name: Abyssal Zone Merge
description: This bot will farm the items belonging to the selected mode for the Abyssal Zone Merge [2304] in /abyssalzone
tags: abyssal, zone, merge, abyssalzone, enchanted, shark, diver, suit, , morph, ashray, elf, warden, top, knot, horns, coastal, corona, golden, trident, dancers, sea, streams
*/
// Port of Scripts/Other/MergeShops/AbyssalZoneMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AOR = new CoreAOR();

export class AbyssalZoneMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    protectRequiredItems(): void {
        const items = ["Undine Base Scrip", "Water Elf Antler", "Waves of Tumult"];

        for (const item of items) {
            if (!Core.bankingBlackList.includes(item)) {
                Core.bankingBlackList.push(item);
            }
        }
    }

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
                case "Undine Base Scrip":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("abyssalzone", "Kitefin Shark Bait", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Water Elf Antler":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.ensureAccept(9316);
                        Core.huntMonster("abyssalzone", "The Ashray", "Ashray Artifacts", undefined, { log: false });
                        Core.huntMonster("abyssalzone", "Necro Adipocere", "Adipocere Antler", 3, { log: false });
                        Core.huntMonster("abyssalzone", "Foam Scavenger", "Scavenger Foam", 6, { log: false });
                        Core.ensureComplete(9316);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Waves of Tumult":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("abyssalzone", "Blighted Water", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        this.protectRequiredItems();
        AOR.abyssalZone();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("abyssalzone", 2304, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "78029",
            "Enchanted Shark Diver",
            'Mode: [select] only\nShould the bot buy "Enchanted Shark Diver" ?',
            false,
        ),
        option.bool(
            "78030",
            "Enchanted Shark Suit",
            'Mode: [select] only\nShould the bot buy "Enchanted Shark Suit" ?',
            false,
        ),
        option.bool(
            "78031",
            "Enchanted Shark Hood",
            'Mode: [select] only\nShould the bot buy "Enchanted Shark Hood" ?',
            false,
        ),
        option.bool(
            "78032",
            "Enchanted Shark Hood + Locks",
            'Mode: [select] only\nShould the bot buy "Enchanted Shark Hood + Locks" ?',
            false,
        ),
        option.bool(
            "78033",
            "Enchanted Shark Hood Morph",
            'Mode: [select] only\nShould the bot buy "Enchanted Shark Hood Morph" ?',
            false,
        ),
        option.bool(
            "78034",
            "Enchanted Shark Hood Visage",
            'Mode: [select] only\nShould the bot buy "Enchanted Shark Hood Visage" ?',
            false,
        ),
        option.bool(
            "67431",
            "Ashray Elf Warden",
            'Mode: [select] only\nShould the bot buy "Ashray Elf Warden" ?',
            false,
        ),
        option.bool(
            "67432",
            "Ashray Elf Top Knot",
            'Mode: [select] only\nShould the bot buy "Ashray Elf Top Knot" ?',
            false,
        ),
        option.bool("67433", "Ashray Elf Locks", 'Mode: [select] only\nShould the bot buy "Ashray Elf Locks" ?', false),
        option.bool(
            "67434",
            "Ashray Top Knot and Horns",
            'Mode: [select] only\nShould the bot buy "Ashray Top Knot and Horns" ?',
            false,
        ),
        option.bool(
            "67435",
            "Ashray Locks and Horns",
            'Mode: [select] only\nShould the bot buy "Ashray Locks and Horns" ?',
            false,
        ),
        option.bool("67436", "Coastal Corona", 'Mode: [select] only\nShould the bot buy "Coastal Corona" ?', false),
        option.bool(
            "67438",
            "Golden Ashray Trident",
            'Mode: [select] only\nShould the bot buy "Golden Ashray Trident" ?',
            false,
        ),
        option.bool(
            "67439",
            "Dancer's Sea Streams",
            'Mode: [select] only\nShould the bot buy "Dancer\'s Sea Streams" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AbyssalZoneMerge.select,
});

export default function main(): void {
    const script = new AbyssalZoneMerge();
    script.protectRequiredItems();
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
