/*
name: Dragon Pirate Merge
description: This will farm and buy all items from Dragon Pirate Merge Shop.
tags: farm, merge, shop, dragon-pirate, pirate
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MergeShops/DragonPirateMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { DragonPirateStory } from "../DragonPirateStory";

const Adv = new CoreAdvanced();
const DP = new DragonPirateStory();

export class DragonPirateMerge {
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
                case "Draconic Doubloon":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8276);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("dragonpirate", "Dragon Gunner", "Pirates Defeated", 10);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Lightning Pirate's Machine Pistol":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("dragonpirate", "Dragon Pirate", req.name);
                    break;
                case "Lightning Pirate's Tricorn":

                case "Lightning Pirate's Tricorn + Locks":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("dragonpirate", "Dragon Gunner", req.name);
                    break;
                case "Lightning Pirate's Tricorn + Eyepatch":

                case "Lightning Pirate's Tricorn Locks + Eyepatch":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("dragonpirate", "Dragon Pirate", req.name);
                    break;
                case "Lightning Pirate":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("dragonpirate", "Scalebeard", req.name);
                    break;
            }
        };
        DP.dragonPirate();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("dragonpirate", 2048, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "63063",
            "Lightning Pirate's Cloud",
            'Mode: [select] only\nShould the bot buy "Lightning Pirate\'s Cloud" ?',
            false,
        ),
        option.bool(
            "63064",
            "Lightning Pirate's Charged Steering Wheel",
            'Mode: [select] only\nShould the bot buy "Lightning Pirate\'s Charged Steering Wheel" ?',
            false,
        ),
        option.bool(
            "63067",
            "Lightning Pirate's Dual Cutlasses",
            'Mode: [select] only\nShould the bot buy "Lightning Pirate\'s Dual Cutlasses" ?',
            false,
        ),
        option.bool(
            "63069",
            "Lightning Pirate's Cutlass + Charged Wheel",
            'Mode: [select] only\nShould the bot buy "Lightning Pirate\'s Cutlass + Charged Wheel" ?',
            false,
        ),
        option.bool(
            "63070",
            "Lightning Pirate's Dual Machine Pistols",
            'Mode: [select] only\nShould the bot buy "Lightning Pirate\'s Dual Machine Pistols" ?',
            false,
        ),
        option.bool(
            "63071",
            "Lightning Pirate's Dual WheelGuns",
            'Mode: [select] only\nShould the bot buy "Lightning Pirate\'s Dual WheelGuns" ?',
            false,
        ),
        option.bool(
            "63072",
            "Lightning Pirate's Dual Machine Guns",
            'Mode: [select] only\nShould the bot buy "Lightning Pirate\'s Dual Machine Guns" ?',
            false,
        ),
        option.bool(
            "63075",
            "Lightning Pirate's WheelGun",
            'Mode: [select] only\nShould the bot buy "Lightning Pirate\'s WheelGun" ?',
            false,
        ),
        option.bool(
            "63076",
            "Lightning Pirate's Charged Wheel",
            'Mode: [select] only\nShould the bot buy "Lightning Pirate\'s Charged Wheel" ?',
            false,
        ),
        option.bool(
            "63078",
            "Lightning Pirate's Dual Charged Wheels",
            'Mode: [select] only\nShould the bot buy "Lightning Pirate\'s Dual Charged Wheels" ?',
            false,
        ),
        option.bool(
            "63082",
            "Thunderlight Pirate",
            'Mode: [select] only\nShould the bot buy "Thunderlight Pirate" ?',
            false,
        ),
        option.bool(
            "63083",
            "Thunderlight Pirate's Tricorn",
            'Mode: [select] only\nShould the bot buy "Thunderlight Pirate\'s Tricorn" ?',
            false,
        ),
        option.bool(
            "63084",
            "Thunderlight Pirate Tricorn + Locks",
            'Mode: [select] only\nShould the bot buy "Thunderlight Pirate Tricorn + Locks" ?',
            false,
        ),
        option.bool(
            "63085",
            "Thunderlight Pirate's Tricorn + Eyepatch",
            'Mode: [select] only\nShould the bot buy "Thunderlight Pirate\'s Tricorn + Eyepatch" ?',
            false,
        ),
        option.bool(
            "63086",
            "Thunderlight Pirate's Tricorn Locks + Eyepatch",
            'Mode: [select] only\nShould the bot buy "Thunderlight Pirate\'s Tricorn Locks + Eyepatch" ?',
            false,
        ),
        option.bool(
            "63087",
            "Thunderlight Pirate's Cloud",
            'Mode: [select] only\nShould the bot buy "Thunderlight Pirate\'s Cloud" ?',
            false,
        ),
        option.bool(
            "63088",
            "Thunderlight Pirate's Charged Steering Wheel",
            'Mode: [select] only\nShould the bot buy "Thunderlight Pirate\'s Charged Steering Wheel" ?',
            false,
        ),
        option.bool(
            "63094",
            "Thunderlight Pirate's Charged Wheel",
            'Mode: [select] only\nShould the bot buy "Thunderlight Pirate\'s Charged Wheel" ?',
            false,
        ),
        option.bool(
            "63095",
            "Thunderlight Pirate's Dual Charged Wheels",
            'Mode: [select] only\nShould the bot buy "Thunderlight Pirate\'s Dual Charged Wheels" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DragonPirateMerge.select,
});

export default function main(): void {
    const script = new DragonPirateMerge();
    Core.bankingBlackList.push(
        "Draconic Doubloon",
        "Lightning Pirate's Machine Pistol",
        "Lightning Pirate's Tricorn",
        "Lightning Pirate's Tricorn + Locks",
        "Lightning Pirate's Tricorn + Eyepatch",
        "Lightning Pirate's Tricorn Locks + Eyepatch ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
