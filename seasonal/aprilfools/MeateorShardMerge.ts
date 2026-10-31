/*
name: Meateor Shard Merge
description: This script farms all the materials needed for Meateor Shard Merge in meateortown.
tags: meateor, meateortown, shard, seasonal, april fools, merge
*/
// Port of Scripts/Seasonal/AprilFools/MeateorShardMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class MeateorShardMerge {
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
                case "Meateor Shard":

                case "Cutie Cow Pet":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("meateortown", "Giant ChickenCow", req.name, quant, { isTemp: false, log: false });
                    break;
                case "ChickenCow Teeth":

                case "Silver Savior of Battleon":

                case "Illustrious Savior of Battleon":

                case "Armored Defender of Battleon":

                case "Armored Victor of Battleon":

                case "Silver Defender's Helm":

                case "Silver Savior's Visor":

                case "Silver Savior's Magical Wrap":

                case "Illustrious Defender Pet":

                case "Illustrious Savior's Blade":

                case "Illustrious Savior's Blades":

                case "Silver Victor's Hammer":

                case "Silver Victor's Hammers":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    if (!Core.isCompletedBefore(8612)) {
                        Core.ensureAccept(8612);
                        Core.huntMonster("meateortown", "Giant ChickenCow", "ChickenCow Tamed");
                        Core.ensureComplete(8612);
                    }
                    Core.registerQuests(8613);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("meateortown", "Spicy ChickenCow");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("meateortown", 2128, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "69334",
            "ChickenCow BeastMaster",
            'Mode: [select] only\nShould the bot buy "ChickenCow BeastMaster" ?',
            false,
        ),
        option.bool("69335", "ChickenCowl", 'Mode: [select] only\nShould the bot buy "ChickenCowl" ?', false),
        option.bool(
            "69336",
            "ChickenCowl + Bangs",
            'Mode: [select] only\nShould the bot buy "ChickenCowl + Bangs" ?',
            false,
        ),
        option.bool("68209", "Pocky Manslayers", 'Mode: [select] only\nShould the bot buy "Pocky Manslayers" ?', false),
        option.bool(
            "68212",
            "Burgers of Destiny",
            'Mode: [select] only\nShould the bot buy "Burgers of Destiny" ?',
            false,
        ),
        option.bool(
            "69226",
            "Overboard Blade of Boxgath",
            'Mode: [select] only\nShould the bot buy "Overboard Blade of Boxgath" ?',
            false,
        ),
        option.bool(
            "69303",
            "Egg-cellent Trobble Pet",
            'Mode: [select] only\nShould the bot buy "Egg-cellent Trobble Pet" ?',
            false,
        ),
        option.bool("69227", "Caladboard", 'Mode: [select] only\nShould the bot buy "Caladboard" ?', false),
        option.bool(
            "69224",
            "Blinding Box of Destiny",
            'Mode: [select] only\nShould the bot buy "Blinding Box of Destiny" ?',
            false,
        ),
        option.bool(
            "69400",
            "UnFowled BeastMaster",
            'Mode: [select] only\nShould the bot buy "UnFowled BeastMaster" ?',
            false,
        ),
        option.bool("69498", "Sweetie Cow Pet", 'Mode: [select] only\nShould the bot buy "Sweetie Cow Pet" ?', false),
        option.bool(
            "69341",
            "Golden Savior of Battleon",
            'Mode: [select] only\nShould the bot buy "Golden Savior of Battleon" ?',
            false,
        ),
        option.bool(
            "69342",
            "Glorious Savior of Battleon",
            'Mode: [select] only\nShould the bot buy "Glorious Savior of Battleon" ?',
            false,
        ),
        option.bool(
            "69343",
            "Gilded Defender of Battleon",
            'Mode: [select] only\nShould the bot buy "Gilded Defender of Battleon" ?',
            false,
        ),
        option.bool(
            "69344",
            "Gilded Victor of Battleon",
            'Mode: [select] only\nShould the bot buy "Gilded Victor of Battleon" ?',
            false,
        ),
        option.bool(
            "69345",
            "Golden Defender's Helm",
            'Mode: [select] only\nShould the bot buy "Golden Defender\'s Helm" ?',
            false,
        ),
        option.bool(
            "69346",
            "Golden Savior's Visor",
            'Mode: [select] only\nShould the bot buy "Golden Savior\'s Visor" ?',
            false,
        ),
        option.bool(
            "69347",
            "Battleon Savior's Magical Wrap",
            'Mode: [select] only\nShould the bot buy "Battleon Savior\'s Magical Wrap" ?',
            false,
        ),
        option.bool(
            "69348",
            "Glorious Defender Twilly Pet",
            'Mode: [select] only\nShould the bot buy "Glorious Defender Twilly Pet" ?',
            false,
        ),
        option.bool(
            "69349",
            "Glorious Savior's Blade",
            'Mode: [select] only\nShould the bot buy "Glorious Savior\'s Blade" ?',
            false,
        ),
        option.bool(
            "69350",
            "Glorious Savior's Blades",
            'Mode: [select] only\nShould the bot buy "Glorious Savior\'s Blades" ?',
            false,
        ),
        option.bool(
            "69351",
            "Golden Victor's Hammer",
            'Mode: [select] only\nShould the bot buy "Golden Victor\'s Hammer" ?',
            false,
        ),
        option.bool(
            "69352",
            "Golden Victor's Hammers",
            'Mode: [select] only\nShould the bot buy "Golden Victor\'s Hammers" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: MeateorShardMerge.select,
});

export default function main(): void {
    const script = new MeateorShardMerge();
    Core.bankingBlackList.push(
        "Meateor Shard",
        "Cutie Cow Pet",
        "ChickenCow Teeth",
        "Silver Savior of Battleon",
        "Illustrious Savior of Battleon",
        "Armored Defender of Battleon",
        "Armored Victor of Battleon",
        "Silver Defender's Helm",
        "Silver Savior's Visor",
        "Silver Savior's Magical Wrap",
        "Illustrious Defender Pet",
        "Illustrious Savior's Blade",
        "Illustrious Savior's Blades",
        "Silver Victor's Hammer",
        "Silver Victor's Hammers",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
