/*
name: Murder Moon Merge
description: This bot will farm the items belonging to the selected mode for the Murder Moon Merge [1998] in /murdermoon
tags: farm, merge, seasonal, shop, dark, may-the-4th
*/
// Port of Scripts/Seasonal/MayThe4th/MurderMoonMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { MurderMoon } from "./MurderMoonStory";

const Adv = new CoreAdvanced();
const Moon = new MurderMoon();

export class MurderMoonMerge {
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
                case "Cyber Crystal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8065);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("murdermoon", "r2", "Left", "Tempest Soldier", "Tempest Soldier Badge", 5, {
                            log: false,
                        });
                    }
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                case "Fifth Lord's Filtrinator":

                case "S Ring":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("murdermoon", "Fifth Sepulchure", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Dotty":

                case "Dark Helmet":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("zorbaspalace", "Zorba the Bakk", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Dark Tempest Soldier":

                case "Dark Tempest Soldier Helm":

                case "Dark Tempest Soldier Jetpack":

                case "Dark Tempest Soldier Blaster":

                case "Dark Tempest Soldier Laserblade":

                case "Dark Tempest Soldier Pet":

                case "Dark Tempest Soldier Mask":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("murdermoon", "Tempest Soldier", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("murdermoon")) {
            return;
        }

        Moon.murderMoonStory();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("murdermoon", 1998, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("60768", "Paladorian", 'Mode: [select] only\nShould the bot buy "Paladorian" ?', false),
        option.bool(
            "60769",
            "Paladorian Apprentice Helm + Locks",
            'Mode: [select] only\nShould the bot buy "Paladorian Apprentice Helm + Locks" ?',
            false,
        ),
        option.bool(
            "60770",
            "Paladorian Apprentice Helm",
            'Mode: [select] only\nShould the bot buy "Paladorian Apprentice Helm" ?',
            false,
        ),
        option.bool(
            "60771",
            "Paladorian Helm + Antenna",
            'Mode: [select] only\nShould the bot buy "Paladorian Helm + Antenna" ?',
            false,
        ),
        option.bool("60772", "Paladorian Helm", 'Mode: [select] only\nShould the bot buy "Paladorian Helm" ?', false),
        option.bool(
            "60773",
            "PalaDu Apprentice Helm",
            'Mode: [select] only\nShould the bot buy "PalaDu Apprentice Helm" ?',
            false,
        ),
        option.bool("60774", "PalaDurian Helm", 'Mode: [select] only\nShould the bot buy "PalaDurian Helm" ?', false),
        option.bool(
            "60775",
            "Paladorian BackBeam Riffle",
            'Mode: [select] only\nShould the bot buy "Paladorian BackBeam Riffle" ?',
            false,
        ),
        option.bool(
            "60776",
            "Paladorian BackBeam Sword",
            'Mode: [select] only\nShould the bot buy "Paladorian BackBeam Sword" ?',
            false,
        ),
        option.bool("60777", "Paladorian Cape", 'Mode: [select] only\nShould the bot buy "Paladorian Cape" ?', false),
        option.bool(
            "60778",
            "Paladorian Jetpack",
            'Mode: [select] only\nShould the bot buy "Paladorian Jetpack" ?',
            false,
        ),
        option.bool(
            "60780",
            "Paladorian Beam Rifle",
            'Mode: [select] only\nShould the bot buy "Paladorian Beam Rifle" ?',
            false,
        ),
        option.bool("61004", "Dark Lord", 'Mode: [select] only\nShould the bot buy "Dark Lord" ?', false),
        option.bool("60925", "Dark Lord Armor", 'Mode: [select] only\nShould the bot buy "Dark Lord Armor" ?', false),
        option.bool(
            "60926",
            "Dark Lord's Hood + Hair",
            'Mode: [select] only\nShould the bot buy "Dark Lord\'s Hood + Hair" ?',
            false,
        ),
        option.bool(
            "60927",
            "Dark Lord's Hood",
            'Mode: [select] only\nShould the bot buy "Dark Lord\'s Hood" ?',
            false,
        ),
        option.bool(
            "60928",
            "Dark Lord's Masked Hood",
            'Mode: [select] only\nShould the bot buy "Dark Lord\'s Masked Hood" ?',
            false,
        ),
        option.bool(
            "60929",
            "Dark Lord's Underworld Hood",
            'Mode: [select] only\nShould the bot buy "Dark Lord\'s Underworld Hood" ?',
            false,
        ),
        option.bool(
            "60930",
            "Dark Lord's Cloak",
            'Mode: [select] only\nShould the bot buy "Dark Lord\'s Cloak" ?',
            false,
        ),
        option.bool(
            "60931",
            "Dark Lord's Laserblade",
            'Mode: [select] only\nShould the bot buy "Dark Lord\'s Laserblade" ?',
            false,
        ),
        option.bool(
            "60932",
            "Dark Lord's Double Blade",
            'Mode: [select] only\nShould the bot buy "Dark Lord\'s Double Blade" ?',
            false,
        ),
        option.bool(
            "60933",
            "Dark Lord's Battle Droid",
            'Mode: [select] only\nShould the bot buy "Dark Lord\'s Battle Droid" ?',
            false,
        ),
        option.bool(
            "60959",
            "Dark Lord's Droid",
            'Mode: [select] only\nShould the bot buy "Dark Lord\'s Droid" ?',
            false,
        ),
        option.bool(
            "60934",
            "Crimson Dark Lord Armor",
            'Mode: [select] only\nShould the bot buy "Crimson Dark Lord Armor" ?',
            false,
        ),
        option.bool(
            "60935",
            "Crimson Dark Lord's Hood + Hair",
            'Mode: [select] only\nShould the bot buy "Crimson Dark Lord\'s Hood + Hair" ?',
            false,
        ),
        option.bool(
            "60936",
            "Crimson Dark Lord's Hood",
            'Mode: [select] only\nShould the bot buy "Crimson Dark Lord\'s Hood" ?',
            false,
        ),
        option.bool(
            "60937",
            "Crimson Dark Lord's Masked Hood",
            'Mode: [select] only\nShould the bot buy "Crimson Dark Lord\'s Masked Hood" ?',
            false,
        ),
        option.bool(
            "60938",
            "Crimson Dark Lord's Underworld Hood",
            'Mode: [select] only\nShould the bot buy "Crimson Dark Lord\'s Underworld Hood" ?',
            false,
        ),
        option.bool(
            "60939",
            "Crimson Dark Lord's Cloak",
            'Mode: [select] only\nShould the bot buy "Crimson Dark Lord\'s Cloak" ?',
            false,
        ),
        option.bool(
            "60940",
            "Crimson Dark Lord's Laserblade",
            'Mode: [select] only\nShould the bot buy "Crimson Dark Lord\'s Laserblade" ?',
            false,
        ),
        option.bool(
            "60941",
            "Crimson Dark Lord's Double Blade",
            'Mode: [select] only\nShould the bot buy "Crimson Dark Lord\'s Double Blade" ?',
            false,
        ),
        option.bool(
            "60942",
            "Crimson Dark Lord's Dark Laserblade",
            'Mode: [select] only\nShould the bot buy "Crimson Dark Lord\'s Dark Laserblade" ?',
            false,
        ),
        option.bool(
            "60943",
            "Crimson Dark Lord's Battle Droid",
            'Mode: [select] only\nShould the bot buy "Crimson Dark Lord\'s Battle Droid" ?',
            false,
        ),
        option.bool(
            "60960",
            "Crimson Dark Lord's Droid",
            'Mode: [select] only\nShould the bot buy "Crimson Dark Lord\'s Droid" ?',
            false,
        ),
        option.bool("60950", "Tempest Soldier", 'Mode: [select] only\nShould the bot buy "Tempest Soldier" ?', false),
        option.bool(
            "60951",
            "Tempest Soldier Helm",
            'Mode: [select] only\nShould the bot buy "Tempest Soldier Helm" ?',
            false,
        ),
        option.bool(
            "60952",
            "Tempest Soldier Jetpack",
            'Mode: [select] only\nShould the bot buy "Tempest Soldier Jetpack" ?',
            false,
        ),
        option.bool(
            "60953",
            "Tempest Soldier Blaster",
            'Mode: [select] only\nShould the bot buy "Tempest Soldier Blaster" ?',
            false,
        ),
        option.bool(
            "60954",
            "Tempest Soldier Laserblade",
            'Mode: [select] only\nShould the bot buy "Tempest Soldier Laserblade" ?',
            false,
        ),
        option.bool(
            "60955",
            "Tempest Soldier Pet",
            'Mode: [select] only\nShould the bot buy "Tempest Soldier Pet" ?',
            false,
        ),
        option.bool(
            "60958",
            "Tempest Soldier Mask",
            'Mode: [select] only\nShould the bot buy "Tempest Soldier Mask" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: MurderMoonMerge.select,
});

export default function main(): void {
    const script = new MurderMoonMerge();
    Core.bankingBlackList.push(
        "Cyber Crystal",
        "S Ring",
        "Fifth Lord's Filtrinator",
        "Dark Helmet",
        "Dotty",
        "Dark Tempest Soldier",
        "Dark Tempest Soldier Helm",
        "Dark Tempest Soldier Jetpack",
        "Dark Tempest Soldier Blaster",
        "Dark Tempest Soldier Laserblade",
        "Dark Tempest Soldier Pet",
        "Dark Tempest Soldier Mask",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
