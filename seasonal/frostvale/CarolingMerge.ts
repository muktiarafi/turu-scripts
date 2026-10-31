/*
name: Caroling Merge
description: This bot will farm the items belonging to the selected mode for the Caroling Merge [2197] in /caroltown
tags: caroling, merge, caroltown, midwinter, cheermaker, cutie, antlered, beanie, snowflakes, snowy, nimbo, licorice, candy, cane, darkwood, carved, armaments, northlands, paladin, frozen, paladins, glacial, light, destiny, ascended, aurum, wings, noble, leo, scion, scions, requiem, heraldic, lion, companion, frostval, party, favor, gifts, holiday, hoodie, , morph, holly, twilly, twig, zorbak, elf, drago, j, maya, iona, greataxe, castillonnais, greataxes, sweet, amp, savory, guest, trio
*/
// Port of Scripts/Seasonal/Frostvale/CarolingMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class CarolingMerge {
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
            //#endregion Dont edit this part
            switch (req.name) {
                case "Aurum Wings Blade":

                case "Brunswick Leo Scion":

                case "Brunswick Leo's Requiem":

                case "Brunswick Leo Scion Cane":

                case "Spearmint Candy Cane":

                case "100 Pound Gift":

                case "Chill Hoodie Outfit":

                case "Chill Hat + Hair":

                case "Chill Hat + Locks":

                case "Chill Hat Visage":

                case "Chill Hat Morph":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonsterMapID("caroltown", 6, req.name, quant, { isTemp: false });
                    break;
                case "Red Ribbon":

                case "Silver Tinsel":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("caroltown", "Frostval Tree", req.name, req.quantity, { isTemp: req.temp });
                    break;
                case "Jingle Bells":
                    Core.equipClass(ClassType.Farm);
                    // Jingle Spells - 9520
                    Core.registerQuests(9520);
                    Core.huntMonster("caroltown", "Frostval Deer", req.name, quant, { isTemp: false });
                    bot.wait.forPickup(req.id);
                    Core.cancelRegisteredQuests();
                    break;
                case "Icy Fur":

                case "Wrapping Paper":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("caroltown", "Krumpet", req.name, quant, { isTemp: false });
                    break;
                case "Fishy Cream Candy Cane Guest":

                case "Blue Cheese Candy Cane Guest":

                case "Moglinberry Candy Cane Guest":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.huntMonster("caroltown", "Gift Delivery", req.name, quant, { isTemp: req.temp, log: false });
                    break;
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
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("caroltown", 2197, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "75005",
            "Midwinter Cheermaker",
            'Mode: [select] only\nShould the bot buy "Midwinter Cheermaker" ?',
            false,
        ),
        option.bool(
            "75006",
            "Midwinter Cutie Hat",
            'Mode: [select] only\nShould the bot buy "Midwinter Cutie Hat" ?',
            false,
        ),
        option.bool(
            "75007",
            "Midwinter Cutie Hat and Locks",
            'Mode: [select] only\nShould the bot buy "Midwinter Cutie Hat and Locks" ?',
            false,
        ),
        option.bool(
            "75008",
            "Midwinter Antlered Hat",
            'Mode: [select] only\nShould the bot buy "Midwinter Antlered Hat" ?',
            false,
        ),
        option.bool(
            "75009",
            "Midwinter Antlered Hat and Locks",
            'Mode: [select] only\nShould the bot buy "Midwinter Antlered Hat and Locks" ?',
            false,
        ),
        option.bool("75010", "Midwinter Beanie", 'Mode: [select] only\nShould the bot buy "Midwinter Beanie" ?', false),
        option.bool(
            "75011",
            "Midwinter Beanie and Locks",
            'Mode: [select] only\nShould the bot buy "Midwinter Beanie and Locks" ?',
            false,
        ),
        option.bool(
            "75012",
            "Midwinter Snowflakes",
            'Mode: [select] only\nShould the bot buy "Midwinter Snowflakes" ?',
            false,
        ),
        option.bool(
            "75013",
            "Midwinter Cutie Cape",
            'Mode: [select] only\nShould the bot buy "Midwinter Cutie Cape" ?',
            false,
        ),
        option.bool(
            "75014",
            "Midwinter Snowy Nimbo",
            'Mode: [select] only\nShould the bot buy "Midwinter Snowy Nimbo" ?',
            false,
        ),
        option.bool(
            "75015",
            "Licorice Candy Cane",
            'Mode: [select] only\nShould the bot buy "Licorice Candy Cane" ?',
            false,
        ),
        option.bool(
            "75016",
            "Darkwood Carved Armaments",
            'Mode: [select] only\nShould the bot buy "Darkwood Carved Armaments" ?',
            false,
        ),
        option.bool(
            "73885",
            "Northlands Paladin",
            'Mode: [select] only\nShould the bot buy "Northlands Paladin" ?',
            false,
        ),
        option.bool(
            "73887",
            "Frozen Paladin's Helm",
            'Mode: [select] only\nShould the bot buy "Frozen Paladin\'s Helm" ?',
            false,
        ),
        option.bool(
            "73890",
            "Glacial Light of Destiny",
            'Mode: [select] only\nShould the bot buy "Glacial Light of Destiny" ?',
            false,
        ),
        option.bool(
            "69478",
            "Ascended Aurum Wings Blade",
            'Mode: [select] only\nShould the bot buy "Ascended Aurum Wings Blade" ?',
            false,
        ),
        option.bool("79340", "Noble Leo Scion", 'Mode: [select] only\nShould the bot buy "Noble Leo Scion" ?', false),
        option.bool(
            "79342",
            "Noble Leo Scion Hair",
            'Mode: [select] only\nShould the bot buy "Noble Leo Scion Hair" ?',
            false,
        ),
        option.bool(
            "79343",
            "Noble Leo Scion Locks",
            'Mode: [select] only\nShould the bot buy "Noble Leo Scion Locks" ?',
            false,
        ),
        option.bool(
            "79344",
            "Leo Scion's Requiem",
            'Mode: [select] only\nShould the bot buy "Leo Scion\'s Requiem" ?',
            false,
        ),
        option.bool(
            "79346",
            "Heraldic Lion Companion",
            'Mode: [select] only\nShould the bot buy "Heraldic Lion Companion" ?',
            false,
        ),
        option.bool(
            "79347",
            "Noble Leo Scion Cane",
            'Mode: [select] only\nShould the bot buy "Noble Leo Scion Cane" ?',
            false,
        ),
        option.bool(
            "82548",
            "Frostval Party Favor",
            'Mode: [select] only\nShould the bot buy "Frostval Party Favor" ?',
            false,
        ),
        option.bool(
            "82560",
            "Frostval Party Gifts",
            'Mode: [select] only\nShould the bot buy "Frostval Party Gifts" ?',
            false,
        ),
        option.bool(
            "82778",
            "Northlands Holiday Hoodie",
            'Mode: [select] only\nShould the bot buy "Northlands Holiday Hoodie" ?',
            false,
        ),
        option.bool(
            "82779",
            "Northlands Holiday Hat",
            'Mode: [select] only\nShould the bot buy "Northlands Holiday Hat" ?',
            false,
        ),
        option.bool(
            "82780",
            "Northlands Holiday Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Northlands Holiday Hat + Locks" ?',
            false,
        ),
        option.bool(
            "82781",
            "Northlands Holiday Morph",
            'Mode: [select] only\nShould the bot buy "Northlands Holiday Morph" ?',
            false,
        ),
        option.bool(
            "82782",
            "Northlands Holiday Visage",
            'Mode: [select] only\nShould the bot buy "Northlands Holiday Visage" ?',
            false,
        ),
        option.bool(
            "82788",
            "Holly Holiday Twilly",
            'Mode: [select] only\nShould the bot buy "Holly Holiday Twilly" ?',
            false,
        ),
        option.bool(
            "82789",
            "Holly Holiday Twig",
            'Mode: [select] only\nShould the bot buy "Holly Holiday Twig" ?',
            false,
        ),
        option.bool(
            "82790",
            "Holly Holiday Zorbak",
            'Mode: [select] only\nShould the bot buy "Holly Holiday Zorbak" ?',
            false,
        ),
        option.bool(
            "90589",
            "Holiday Elf Drago",
            'Mode: [select] only\nShould the bot buy "Holiday Elf Drago" ?',
            false,
        ),
        option.bool("90591", "Holiday Elf J6", 'Mode: [select] only\nShould the bot buy "Holiday Elf J6" ?', false),
        option.bool("90592", "Holiday Elf Maya", 'Mode: [select] only\nShould the bot buy "Holiday Elf Maya" ?', false),
        option.bool("90593", "Holiday Elf Iona", 'Mode: [select] only\nShould the bot buy "Holiday Elf Iona" ?', false),
        option.bool(
            "90461",
            "Greataxe of Castillonnais",
            'Mode: [select] only\nShould the bot buy "Greataxe of Castillonnais" ?',
            false,
        ),
        option.bool(
            "90462",
            "Greataxes of Castillonnais",
            'Mode: [select] only\nShould the bot buy "Greataxes of Castillonnais" ?',
            false,
        ),
        option.bool(
            "98181",
            "Sweet &amp; Savory Guest Trio",
            'Mode: [select] only\nShould the bot buy "Sweet &amp; Savory Guest Trio" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CarolingMerge.select,
});

export default function main(): void {
    const script = new CarolingMerge();
    Core.bankingBlackList.push(
        "Red Ribbon",
        "Wrapping Paper",
        "Icy Fur",
        "Silver Tinsel",
        "Aurum Wings Blade",
        "Jingle Bells",
        "Brunswick Leo Scion",
        "Brunswick Leo's Requiem",
        "Brunswick Leo Scion Cane",
        "Spearmint Candy Cane",
        "100 Pound Gift",
        "Chill Hoodie Outfit",
        "Chill Hat + Hair",
        "Chill Hat + Locks",
        "Chill Hat Morph",
        "Chill Hat Visage",
        "Fishy Cream Candy Cane Guest",
        "Moglinberry Candy Cane Guest",
        "Blue Cheese Candy Cane Guest",
    );

    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
