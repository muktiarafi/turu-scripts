/*
name: Ninth Queens Treasure Merge
description: This bot will farm the items belonging to the selected mode for the Ninth Queens Treasure Merge [2666] in /meresankhchambers
tags: ninth, queens, treasure, merge, meresankhchambers, warden, serket, scorpion, priestess, veil, pontiffs, cloak, pontiff, morph, headdress, hand, hands, saccara, lapis, sabre, shield, gem, selkis, eye, golden
*/
// Port of Scripts/Other/MergeShops/NinthQueensTreasureMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class NinthQueensTreasureMerge {
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
                case "Gold Voucher 100k":
                    Farm.voucher(req.name, quant);
                    break;
                case "Scorpion Pontiff Headdress":

                case "Scorpion Pontiff Hair":

                case "Scorpion Priestess Veil":

                case "Scorpion Priestess Locks":

                case "Eye of Serket":

                case "Saccara Lapis Sabres":

                case "Saccara Lapis Sabre":

                case "Meresankh's Forbidden Gem": {
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    const questID = Core.isMember ? 10545 : 10544;
                    Core.registerQuests(questID);
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("meresankhchambers", "Queen Meresankh", req.name, quant, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                }
            }
        };
        Adv.startBuyAllMerge("meresankhchambers", 2666, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }
    static readonly select = [
        option.bool("98378", "Warden of Serket", 'Mode: [select] only\nShould the bot buy "Warden of Serket" ?', false),
        option.bool(
            "98379",
            "Scorpion Priestess Visage",
            'Mode: [select] only\nShould the bot buy "Scorpion Priestess Visage" ?',
            false,
        ),
        option.bool(
            "98380",
            "Scorpion Priestess Veil Visage",
            'Mode: [select] only\nShould the bot buy "Scorpion Priestess Veil Visage" ?',
            false,
        ),
        option.bool(
            "98394",
            "Scorpion Pontiff's Cloak",
            'Mode: [select] only\nShould the bot buy "Scorpion Pontiff\'s Cloak" ?',
            false,
        ),
        option.bool(
            "98386",
            "Scorpion Pontiff Morph",
            'Mode: [select] only\nShould the bot buy "Scorpion Pontiff Morph" ?',
            false,
        ),
        option.bool(
            "98388",
            "Scorpion Pontiff Headdress Morph",
            'Mode: [select] only\nShould the bot buy "Scorpion Pontiff Headdress Morph" ?',
            false,
        ),
        option.bool("98401", "Hand of Serket", 'Mode: [select] only\nShould the bot buy "Hand of Serket" ?', false),
        option.bool("98402", "Hands of Serket", 'Mode: [select] only\nShould the bot buy "Hands of Serket" ?', false),
        option.bool(
            "98404",
            "Saccara Lapis Sabre and Shield",
            'Mode: [select] only\nShould the bot buy "Saccara Lapis Sabre and Shield" ?',
            false,
        ),
        option.bool(
            "98405",
            "Gem Axe of Selkis",
            'Mode: [select] only\nShould the bot buy "Gem Axe of Selkis" ?',
            false,
        ),
        option.bool(
            "98395",
            "Eye of Serket Cloak",
            'Mode: [select] only\nShould the bot buy "Eye of Serket Cloak" ?',
            false,
        ),
        option.bool("98397", "Golden Selkis", 'Mode: [select] only\nShould the bot buy "Golden Selkis" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: NinthQueensTreasureMerge.select,
});

export default function main(): void {
    const script = new NinthQueensTreasureMerge();
    Core.bankingBlackList.push(
        "Meresankh's Forbidden Gem",
        "Scorpion Pontiff Headdress",
        "Scorpion Pontiff Hair",
        "Scorpion Priestess Veil",
        "Scorpion Priestess Locks",
        "Eye of Serket",
        "Saccara Lapis Sabres",
        "Saccara Lapis Sabre",
    );

    Core.addDrop(
        "Meresankh's Forbidden Gem",
        "Scorpion Pontiff Headdress",
        "Scorpion Pontiff Hair",
        "Scorpion Priestess Veil",
        "Scorpion Priestess Locks",
        "Eye of Serket",
        "Saccara Lapis Sabres",
        "Saccara Lapis Sabre",
    );

    Core.setOptions();
    script.buyAllMerge();
    Core.setOptions(false);
}
