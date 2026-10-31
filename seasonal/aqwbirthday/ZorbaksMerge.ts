/*
name: Zorbaks Merge
description: This bot will farm the items belonging to the selected mode for the Zorbaks Merge [1640] in /birthday
tags: zorbaks, merge, birthday, copper, dragon, statue, r, gold, platinum, sepulchure, l, royal, shadowslayer, shadowslayers, cap, , coat, elite, exalted, honor, glasses, escherion, plushie, mace, xang, vath, kitsune, wolfwing, kimberly, ledgermayne, tibicenas, khasaanda, iadoa, lionfang, alteon, drakath, xing, plushies, gilded, knight, armet, haloed, sallet, grand, great, cloak, spear, zweihander, dread, draconic, chrono, raven, sneevil
*/
// Port of Scripts/Seasonal/AqwBirthday/ZorbaksMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ZorbaksMerge {
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
                case "Copper Scale":

                case "Gold Scale":

                case "Platinum Scale":

                case "Onyx Scale":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        // 14th Anniversary Gifts 6554
                        Core.ensureAccept(6554);

                        Core.huntMonster("birthday", "Birthday Cake", "Top Cherry");
                        Core.huntMonster("birthday", "Birthday Cake", "Copper Knife");
                        Core.huntMonster("birthday", "Birthday Cake", "Platinum Fork");
                        Core.huntMonster("birthday", "Birthday Cake", "Gold Spoon");

                        Core.ensureComplete(6554, req.id);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Hero Plushie":

                case "Chaorrupted Button":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("birthday", "Birthday Cake", req.name, quant, { isTemp: false });
                    break;
                case "Cursed Pinata Candy":

                case "Tinfoil Wrapper":

                case "Knight Armet":

                case "Knight Armor":

                case "Knight Sallet":

                case "Knight Cloak":

                case "Knight Mace":

                case "Knight Spear":

                case "Knight Zweihander":

                case "Knight Great Helm":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("birthday", "Twilly Pinata", req.name, quant, { isTemp: false });
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("birthday")) {
            return;
        }

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("battleon", 1640, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "45297",
            "Copper Dragon Statue (R)",
            'Mode: [select] only\nShould the bot buy "Copper Dragon Statue (R)" ?',
            false,
        ),
        option.bool(
            "45298",
            "Gold Dragon Statue (R)",
            'Mode: [select] only\nShould the bot buy "Gold Dragon Statue (R)" ?',
            false,
        ),
        option.bool(
            "45299",
            "Platinum Dragon Statue (R)",
            'Mode: [select] only\nShould the bot buy "Platinum Dragon Statue (R)" ?',
            false,
        ),
        option.bool(
            "45300",
            "Copper Sepulchure Statue (R)",
            'Mode: [select] only\nShould the bot buy "Copper Sepulchure Statue (R)" ?',
            false,
        ),
        option.bool(
            "45301",
            "Gold Sepulchure Statue (R)",
            'Mode: [select] only\nShould the bot buy "Gold Sepulchure Statue (R)" ?',
            false,
        ),
        option.bool(
            "45302",
            "Platinum Sepulchure Statue (R)",
            'Mode: [select] only\nShould the bot buy "Platinum Sepulchure Statue (R)" ?',
            false,
        ),
        option.bool(
            "45304",
            "Copper Dragon Statue (L)",
            'Mode: [select] only\nShould the bot buy "Copper Dragon Statue (L)" ?',
            false,
        ),
        option.bool(
            "45305",
            "Gold Dragon Statue (L)",
            'Mode: [select] only\nShould the bot buy "Gold Dragon Statue (L)" ?',
            false,
        ),
        option.bool(
            "45306",
            "Platinum Dragon Statue (L)",
            'Mode: [select] only\nShould the bot buy "Platinum Dragon Statue (L)" ?',
            false,
        ),
        option.bool(
            "45307",
            "Copper Sepulchure Statue (L)",
            'Mode: [select] only\nShould the bot buy "Copper Sepulchure Statue (L)" ?',
            false,
        ),
        option.bool(
            "45308",
            "Gold Sepulchure Statue (L)",
            'Mode: [select] only\nShould the bot buy "Gold Sepulchure Statue (L)" ?',
            false,
        ),
        option.bool(
            "45309",
            "Platinum Sepulchure Statue (L)",
            'Mode: [select] only\nShould the bot buy "Platinum Sepulchure Statue (L)" ?',
            false,
        ),
        option.bool(
            "55418",
            "Royal Shadowslayer",
            'Mode: [select] only\nShould the bot buy "Royal Shadowslayer" ?',
            false,
        ),
        option.bool(
            "55419",
            "Royal Shadowslayer's Cap + Locks",
            'Mode: [select] only\nShould the bot buy "Royal Shadowslayer\'s Cap + Locks" ?',
            false,
        ),
        option.bool(
            "55420",
            "Royal Shadowslayer's Cap",
            'Mode: [select] only\nShould the bot buy "Royal Shadowslayer\'s Cap" ?',
            false,
        ),
        option.bool(
            "55421",
            "Royal Shadowslayer's Coat",
            'Mode: [select] only\nShould the bot buy "Royal Shadowslayer\'s Coat" ?',
            false,
        ),
        option.bool(
            "55422",
            "Elite Shadowslayer",
            'Mode: [select] only\nShould the bot buy "Elite Shadowslayer" ?',
            false,
        ),
        option.bool(
            "55424",
            "Elite Shadowslayer Locks",
            'Mode: [select] only\nShould the bot buy "Elite Shadowslayer Locks" ?',
            false,
        ),
        option.bool(
            "55426",
            "Elite Shadowslayer Hair",
            'Mode: [select] only\nShould the bot buy "Elite Shadowslayer Hair" ?',
            false,
        ),
        option.bool(
            "55414",
            "Royal Exalted ShadowSlayer",
            'Mode: [select] only\nShould the bot buy "Royal Exalted ShadowSlayer" ?',
            false,
        ),
        option.bool(
            "55415",
            "Royal Exalted ShadowSlayer Cap + Locks",
            'Mode: [select] only\nShould the bot buy "Royal Exalted ShadowSlayer Cap + Locks" ?',
            false,
        ),
        option.bool(
            "55416",
            "Royal Exalted ShadowSlayer Cap",
            'Mode: [select] only\nShould the bot buy "Royal Exalted ShadowSlayer Cap" ?',
            false,
        ),
        option.bool(
            "55417",
            "Royal Exalted ShadowSlayer Coat",
            'Mode: [select] only\nShould the bot buy "Royal Exalted ShadowSlayer Coat" ?',
            false,
        ),
        option.bool(
            "55423",
            "Royal Honor ShadowSlayer",
            'Mode: [select] only\nShould the bot buy "Royal Honor ShadowSlayer" ?',
            false,
        ),
        option.bool(
            "55425",
            "Royal Shadowslayer Locks + Glasses",
            'Mode: [select] only\nShould the bot buy "Royal Shadowslayer Locks + Glasses" ?',
            false,
        ),
        option.bool(
            "55427",
            "Royal ShadowSlayer Glasses",
            'Mode: [select] only\nShould the bot buy "Royal ShadowSlayer Glasses" ?',
            false,
        ),
        option.bool(
            "64552",
            "Escherion Plushie Mace",
            'Mode: [select] only\nShould the bot buy "Escherion Plushie Mace" ?',
            false,
        ),
        option.bool(
            "64553",
            "Xang Plushie Mace",
            'Mode: [select] only\nShould the bot buy "Xang Plushie Mace" ?',
            false,
        ),
        option.bool(
            "64554",
            "Vath Plushie Mace",
            'Mode: [select] only\nShould the bot buy "Vath Plushie Mace" ?',
            false,
        ),
        option.bool(
            "64555",
            "Kitsune Plushie Mace",
            'Mode: [select] only\nShould the bot buy "Kitsune Plushie Mace" ?',
            false,
        ),
        option.bool(
            "64556",
            "Wolfwing Plushie Mace",
            'Mode: [select] only\nShould the bot buy "Wolfwing Plushie Mace" ?',
            false,
        ),
        option.bool(
            "64557",
            "Kimberly Plushie Mace",
            'Mode: [select] only\nShould the bot buy "Kimberly Plushie Mace" ?',
            false,
        ),
        option.bool(
            "64558",
            "Ledgermayne Plushie Mace",
            'Mode: [select] only\nShould the bot buy "Ledgermayne Plushie Mace" ?',
            false,
        ),
        option.bool(
            "64559",
            "Tibicenas Plushie Mace",
            'Mode: [select] only\nShould the bot buy "Tibicenas Plushie Mace" ?',
            false,
        ),
        option.bool(
            "64560",
            "Khasaanda Plushie Mace",
            'Mode: [select] only\nShould the bot buy "Khasaanda Plushie Mace" ?',
            false,
        ),
        option.bool(
            "64561",
            "Iadoa Plushie Mace",
            'Mode: [select] only\nShould the bot buy "Iadoa Plushie Mace" ?',
            false,
        ),
        option.bool(
            "64562",
            "LionFang Plushie Mace",
            'Mode: [select] only\nShould the bot buy "LionFang Plushie Mace" ?',
            false,
        ),
        option.bool(
            "64563",
            "Alteon Plushie Mace",
            'Mode: [select] only\nShould the bot buy "Alteon Plushie Mace" ?',
            false,
        ),
        option.bool(
            "64564",
            "Drakath Plushie Mace",
            'Mode: [select] only\nShould the bot buy "Drakath Plushie Mace" ?',
            false,
        ),
        option.bool(
            "64565",
            "Xing and Xang Plushies Dagger",
            'Mode: [select] only\nShould the bot buy "Xing and Xang Plushies Dagger" ?',
            false,
        ),
        option.bool(
            "64598",
            "Xing Plushie Mace",
            'Mode: [select] only\nShould the bot buy "Xing Plushie Mace" ?',
            false,
        ),
        option.bool(
            "54839",
            "Gilded Knight Armor",
            'Mode: [select] only\nShould the bot buy "Gilded Knight Armor" ?',
            false,
        ),
        option.bool(
            "54840",
            "Gilded Knight Armet",
            'Mode: [select] only\nShould the bot buy "Gilded Knight Armet" ?',
            false,
        ),
        option.bool(
            "54841",
            "Haloed Gilded Knight Armet",
            'Mode: [select] only\nShould the bot buy "Haloed Gilded Knight Armet" ?',
            false,
        ),
        option.bool(
            "54842",
            "Gilded Knight Sallet",
            'Mode: [select] only\nShould the bot buy "Gilded Knight Sallet" ?',
            false,
        ),
        option.bool(
            "54843",
            "Gilded Knight Grand Sallet",
            'Mode: [select] only\nShould the bot buy "Gilded Knight Grand Sallet" ?',
            false,
        ),
        option.bool(
            "54844",
            "Gilded Knight Great Helm",
            'Mode: [select] only\nShould the bot buy "Gilded Knight Great Helm" ?',
            false,
        ),
        option.bool(
            "54845",
            "Gilded Knight Cloak",
            'Mode: [select] only\nShould the bot buy "Gilded Knight Cloak" ?',
            false,
        ),
        option.bool(
            "54846",
            "Gilded Knight Mace",
            'Mode: [select] only\nShould the bot buy "Gilded Knight Mace" ?',
            false,
        ),
        option.bool(
            "54847",
            "Gilded Knight Spear",
            'Mode: [select] only\nShould the bot buy "Gilded Knight Spear" ?',
            false,
        ),
        option.bool(
            "54848",
            "Gilded Knight Zweihander",
            'Mode: [select] only\nShould the bot buy "Gilded Knight Zweihander" ?',
            false,
        ),
        option.bool(
            "54849",
            "Dread Knight Armor",
            'Mode: [select] only\nShould the bot buy "Dread Knight Armor" ?',
            false,
        ),
        option.bool(
            "54850",
            "Dread Knight Armet",
            'Mode: [select] only\nShould the bot buy "Dread Knight Armet" ?',
            false,
        ),
        option.bool(
            "54851",
            "Haloed Dread Knight Armet",
            'Mode: [select] only\nShould the bot buy "Haloed Dread Knight Armet" ?',
            false,
        ),
        option.bool(
            "54852",
            "Dread Knight Sallet",
            'Mode: [select] only\nShould the bot buy "Dread Knight Sallet" ?',
            false,
        ),
        option.bool(
            "54853",
            "Draconic Dread Knight Sallet",
            'Mode: [select] only\nShould the bot buy "Draconic Dread Knight Sallet" ?',
            false,
        ),
        option.bool(
            "54854",
            "Dread Knight Great Helm",
            'Mode: [select] only\nShould the bot buy "Dread Knight Great Helm" ?',
            false,
        ),
        option.bool(
            "54855",
            "Dread Knight Cloak",
            'Mode: [select] only\nShould the bot buy "Dread Knight Cloak" ?',
            false,
        ),
        option.bool(
            "54856",
            "Dread Knight Mace",
            'Mode: [select] only\nShould the bot buy "Dread Knight Mace" ?',
            false,
        ),
        option.bool(
            "54857",
            "Dread Knight Spear",
            'Mode: [select] only\nShould the bot buy "Dread Knight Spear" ?',
            false,
        ),
        option.bool(
            "54858",
            "Dread Knight Zweihander",
            'Mode: [select] only\nShould the bot buy "Dread Knight Zweihander" ?',
            false,
        ),
        option.bool("63973", "Chrono Raven", 'Mode: [select] only\nShould the bot buy "Chrono Raven" ?', false),
        option.bool("63975", "Chrono Sneevil", 'Mode: [select] only\nShould the bot buy "Chrono Sneevil" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ZorbaksMerge.select,
});

export default function main(): void {
    const script = new ZorbaksMerge();
    Core.bankingBlackList.push(
        "Copper Scale",
        "Gold Scale",
        "Platinum Scale",
        "Onyx Scale",
        "Hero Plushie",
        "Chaorrupted Button",
        "Cursed Pinata Candy",
        "Tinfoil Wrapper",
        "Knight Armor",
        "Knight Armet",
        "Knight Sallet",
        "Knight Great Helm",
        "Knight Cloak",
        "Knight Mace",
        "Knight Spear",
        "Knight Zweihander",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
