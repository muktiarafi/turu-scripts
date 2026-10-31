/*
name: ShadowDuat Merge
description: This bot will farm the items belonging to the selected mode for the ShadowDuat Merge [2493] in /shadowduat
tags: shadowduat, merge, shadowduat, ouroboros, warlock, shag, crown, morph, crowned, unbroken, dream, warlocks, altar, life, rebirth, forbidden, ouro, scythe, umbra, metamorphosis, tome, fang, umbral, apophis, lectors, doomed, knight, loyal
*/
// Port of Scripts/Seasonal/BlackFriday/ShadowDuatMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ShadowDuatMerge {
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
                case "A Memory":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9938, 9939);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("shadowduat", "r2", "Left", "*", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Metamorphosis Maw's Knight":

                case "Metamorphosis Maw's Loyal Knight":

                case "Metamophosis Maw's Knight Hair":

                case "Metamophosis Maw's Knight Morph":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("shadowduat", "DoomKnight Dryden", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("shadowduat", 2493, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "87828",
            "Ouroboros Warlock",
            'Mode: [select] only\nShould the bot buy "Ouroboros Warlock" ?',
            false,
        ),
        option.bool(
            "87829",
            "Ouroboros Warlock Hair",
            'Mode: [select] only\nShould the bot buy "Ouroboros Warlock Hair" ?',
            false,
        ),
        option.bool(
            "87830",
            "Ouroboros Warlock Shag",
            'Mode: [select] only\nShould the bot buy "Ouroboros Warlock Shag" ?',
            false,
        ),
        option.bool(
            "87831",
            "Ouroboros Warlock Crown Morph",
            'Mode: [select] only\nShould the bot buy "Ouroboros Warlock Crown Morph" ?',
            false,
        ),
        option.bool("87832", "Ouroboros Crown", 'Mode: [select] only\nShould the bot buy "Ouroboros Crown" ?', false),
        option.bool(
            "87833",
            "Ouroboros Warlock Hood",
            'Mode: [select] only\nShould the bot buy "Ouroboros Warlock Hood" ?',
            false,
        ),
        option.bool(
            "87834",
            "Ouroboros Warlock Crowned Hood",
            'Mode: [select] only\nShould the bot buy "Ouroboros Warlock Crowned Hood" ?',
            false,
        ),
        option.bool(
            "87835",
            "Ouroboros Warlock Crowned Hood Morph",
            'Mode: [select] only\nShould the bot buy "Ouroboros Warlock Crowned Hood Morph" ?',
            false,
        ),
        option.bool(
            "87836",
            "Ouroboros' Unbroken Dream",
            'Mode: [select] only\nShould the bot buy "Ouroboros\' Unbroken Dream" ?',
            false,
        ),
        option.bool(
            "87837",
            "Ouroboros Warlock's Altar",
            'Mode: [select] only\nShould the bot buy "Ouroboros Warlock\'s Altar" ?',
            false,
        ),
        option.bool(
            "87838",
            "Life and Rebirth Staff",
            'Mode: [select] only\nShould the bot buy "Life and Rebirth Staff" ?',
            false,
        ),
        option.bool(
            "87839",
            "Forbidden Ouro Scythe",
            'Mode: [select] only\nShould the bot buy "Forbidden Ouro Scythe" ?',
            false,
        ),
        option.bool(
            "87840",
            "Umbra Metamorphosis Tome",
            'Mode: [select] only\nShould the bot buy "Umbra Metamorphosis Tome" ?',
            false,
        ),
        option.bool(
            "87841",
            "Forbidden Metamorphosis Fang",
            'Mode: [select] only\nShould the bot buy "Forbidden Metamorphosis Fang" ?',
            false,
        ),
        option.bool(
            "87842",
            "Umbral Metamorphosis Scythe and Tome",
            'Mode: [select] only\nShould the bot buy "Umbral Metamorphosis Scythe and Tome" ?',
            false,
        ),
        option.bool(
            "87843",
            "Apophis Lector's Staff and Tome",
            'Mode: [select] only\nShould the bot buy "Apophis Lector\'s Staff and Tome" ?',
            false,
        ),
        option.bool(
            "89116",
            "Doomed Metamorphosis Knight",
            'Mode: [select] only\nShould the bot buy "Doomed Metamorphosis Knight" ?',
            false,
        ),
        option.bool(
            "89117",
            "Doomed Metamorphosis' Loyal Knight",
            'Mode: [select] only\nShould the bot buy "Doomed Metamorphosis\' Loyal Knight" ?',
            false,
        ),
        option.bool(
            "89118",
            "Doomed Metamorphosis Knight Hair",
            'Mode: [select] only\nShould the bot buy "Doomed Metamorphosis Knight Hair" ?',
            false,
        ),
        option.bool(
            "89119",
            "Doomed Metamorphosis Knight Morph",
            'Mode: [select] only\nShould the bot buy "Doomed Metamorphosis Knight Morph" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ShadowDuatMerge.select,
});

export default function main(): void {
    const script = new ShadowDuatMerge();
    Core.bankingBlackList.push(
        "A Memory",
        "Metamorphosis Maw's Knight",
        "Metamorphosis Maw's Loyal Knight",
        "Metamophosis Maw's Knight Hair",
        "Metamophosis Maw's Knight Morph",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
