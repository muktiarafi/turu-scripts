/*
name: Yokai Portal Merge
description: This bot will farm the items belonging to the selected mode for the Yokai Portal Merge [2429] in /yokaiportal
tags: yokai, portal, merge, yokaiportal, amethyst, noble, plate, earring, war, march, shikigami, katanas, katana, sheath, jade, dragonguard, ruby, kitsune, duelist, banner
*/
// Port of Scripts/Other/MergeShops/YokaiPortalMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDOY } from "../../story/dragonsofyokai/CoreDOY";

const Adv = new CoreAdvanced();
const DOY = new CoreDOY();

export class YokaiPortalMerge {
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
                case "Shikigami String":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9677);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("yokaiportal", "Kitsune Spirits", "Kitsune Spirit Incense", 15, {
                            log: false,
                        });
                        Core.huntMonster("yokaiportal", "Puppeted Dragonling", "Draconic Red String", 15, {
                            log: false,
                        });
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("yokaiportal", "Kitsune Kukol'nyy", "Lord Kitsune's Red String", undefined, {
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Zakhvatchik's Sapphire":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("hakuwar", "Zakhvatchik", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Noble Amethyst Katana":

                case "Kitsune's Ruby":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("yokaiportal", "Kitsune Kukol'nyy", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Admiral Zheng's Jade":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("yokaitreasure", "Admiral Zheng", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        DOY.yokaiPortal();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("yokaiportal", 2429, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "84198",
            "Yokai Amethyst Noble",
            'Mode: [select] only\nShould the bot buy "Yokai Amethyst Noble" ?',
            false,
        ),
        option.bool(
            "84199",
            "Yokai Amethyst Noble Plate",
            'Mode: [select] only\nShould the bot buy "Yokai Amethyst Noble Plate" ?',
            false,
        ),
        option.bool(
            "84200",
            "Yokai Amethyst Noble Hair",
            'Mode: [select] only\nShould the bot buy "Yokai Amethyst Noble Hair" ?',
            false,
        ),
        option.bool(
            "84201",
            "Yokai Amethyst Noble Earring",
            'Mode: [select] only\nShould the bot buy "Yokai Amethyst Noble Earring" ?',
            false,
        ),
        option.bool(
            "84202",
            "Yokai Amethyst Noble Helm",
            'Mode: [select] only\nShould the bot buy "Yokai Amethyst Noble Helm" ?',
            false,
        ),
        option.bool(
            "84203",
            "Yokai Amethyst Noble Locks",
            'Mode: [select] only\nShould the bot buy "Yokai Amethyst Noble Locks" ?',
            false,
        ),
        option.bool(
            "84204",
            "Yokai Amethyst Noble Earring and Locks",
            'Mode: [select] only\nShould the bot buy "Yokai Amethyst Noble Earring and Locks" ?',
            false,
        ),
        option.bool(
            "84206",
            "Yokai Amethyst Noble War March",
            'Mode: [select] only\nShould the bot buy "Yokai Amethyst Noble War March" ?',
            false,
        ),
        option.bool(
            "84207",
            "Noble Amethyst Shikigami",
            'Mode: [select] only\nShould the bot buy "Noble Amethyst Shikigami" ?',
            false,
        ),
        option.bool(
            "84210",
            "Noble Amethyst Katanas",
            'Mode: [select] only\nShould the bot buy "Noble Amethyst Katanas" ?',
            false,
        ),
        option.bool(
            "84213",
            "Noble Amethyst Katana and Sheath",
            'Mode: [select] only\nShould the bot buy "Noble Amethyst Katana and Sheath" ?',
            false,
        ),
        option.bool(
            "85325",
            "Jade Yokai Dragonguard",
            'Mode: [select] only\nShould the bot buy "Jade Yokai Dragonguard" ?',
            false,
        ),
        option.bool(
            "85326",
            "Jade Yokai Dragonguard Plate",
            'Mode: [select] only\nShould the bot buy "Jade Yokai Dragonguard Plate" ?',
            false,
        ),
        option.bool(
            "85327",
            "Jade Yokai Dragonguard Hair",
            'Mode: [select] only\nShould the bot buy "Jade Yokai Dragonguard Hair" ?',
            false,
        ),
        option.bool(
            "85328",
            "Jade Yokai Dragonguard Earring",
            'Mode: [select] only\nShould the bot buy "Jade Yokai Dragonguard Earring" ?',
            false,
        ),
        option.bool(
            "85329",
            "Jade Yokai Dragonguard Helm",
            'Mode: [select] only\nShould the bot buy "Jade Yokai Dragonguard Helm" ?',
            false,
        ),
        option.bool(
            "85330",
            "Jade Yokai Dragonguard Locks",
            'Mode: [select] only\nShould the bot buy "Jade Yokai Dragonguard Locks" ?',
            false,
        ),
        option.bool(
            "85331",
            "Jade Yokai Dragonguard Earring and Locks",
            'Mode: [select] only\nShould the bot buy "Jade Yokai Dragonguard Earring and Locks" ?',
            false,
        ),
        option.bool(
            "85333",
            "Jade Yokai Dragonguard War March",
            'Mode: [select] only\nShould the bot buy "Jade Yokai Dragonguard War March" ?',
            false,
        ),
        option.bool(
            "85334",
            "Jade Yokai Shikigami",
            'Mode: [select] only\nShould the bot buy "Jade Yokai Shikigami" ?',
            false,
        ),
        option.bool(
            "85336",
            "Jade Dragonguard Katana",
            'Mode: [select] only\nShould the bot buy "Jade Dragonguard Katana" ?',
            false,
        ),
        option.bool(
            "85337",
            "Jade Dragonguard Katanas",
            'Mode: [select] only\nShould the bot buy "Jade Dragonguard Katanas" ?',
            false,
        ),
        option.bool(
            "85340",
            "Jade Dragonguard Katana and Sheath",
            'Mode: [select] only\nShould the bot buy "Jade Dragonguard Katana and Sheath" ?',
            false,
        ),
        option.bool(
            "85419",
            "Ruby Kitsune Duelist",
            'Mode: [select] only\nShould the bot buy "Ruby Kitsune Duelist" ?',
            false,
        ),
        option.bool(
            "85420",
            "Ruby Kitsune Duelist Plate",
            'Mode: [select] only\nShould the bot buy "Ruby Kitsune Duelist Plate" ?',
            false,
        ),
        option.bool(
            "85421",
            "Ruby Kitsune Duelist Hair",
            'Mode: [select] only\nShould the bot buy "Ruby Kitsune Duelist Hair" ?',
            false,
        ),
        option.bool(
            "85422",
            "Ruby Kitsune Duelist Earring",
            'Mode: [select] only\nShould the bot buy "Ruby Kitsune Duelist Earring" ?',
            false,
        ),
        option.bool(
            "85423",
            "Ruby Kitsune Duelist Helm",
            'Mode: [select] only\nShould the bot buy "Ruby Kitsune Duelist Helm" ?',
            false,
        ),
        option.bool(
            "85424",
            "Ruby Kitsune Duelist Locks",
            'Mode: [select] only\nShould the bot buy "Ruby Kitsune Duelist Locks" ?',
            false,
        ),
        option.bool(
            "85425",
            "Ruby Kitsune Duelist Earring and Locks",
            'Mode: [select] only\nShould the bot buy "Ruby Kitsune Duelist Earring and Locks" ?',
            false,
        ),
        option.bool(
            "85426",
            "Ruby Kitsune Duelist Banner",
            'Mode: [select] only\nShould the bot buy "Ruby Kitsune Duelist Banner" ?',
            false,
        ),
        option.bool(
            "85427",
            "Ruby Kitsune Duelist War March",
            'Mode: [select] only\nShould the bot buy "Ruby Kitsune Duelist War March" ?',
            false,
        ),
        option.bool(
            "85428",
            "Ruby Yokai Shikigami",
            'Mode: [select] only\nShould the bot buy "Ruby Yokai Shikigami" ?',
            false,
        ),
        option.bool(
            "85430",
            "Ruby Kitsune Katana",
            'Mode: [select] only\nShould the bot buy "Ruby Kitsune Katana" ?',
            false,
        ),
        option.bool(
            "85431",
            "Ruby Kitsune Katanas",
            'Mode: [select] only\nShould the bot buy "Ruby Kitsune Katanas" ?',
            false,
        ),
        option.bool(
            "85434",
            "Ruby Kitsune Katana and Sheath",
            'Mode: [select] only\nShould the bot buy "Ruby Kitsune Katana and Sheath" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: YokaiPortalMerge.select,
});

export default function main(): void {
    const script = new YokaiPortalMerge();
    Core.bankingBlackList.push(
        "Shikigami String",
        "Zakhvatchik's Sapphire",
        "Noble Amethyst Katana",
        "Admiral Zheng's Jade",
        "Kitsune's Ruby",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
