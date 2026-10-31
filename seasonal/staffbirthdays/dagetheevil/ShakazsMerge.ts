/*
name: Shakazs Merge
description: This bot will farm the required items from /siegefortress, do the story, and buy items from the merge shop
tags: siegefortress, merge, dage, staff birthday
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/ShakazsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { TempleDelve } from "../nulgath/TempleDelve";

const Adv = new CoreAdvanced();
const TD = new TempleDelve();

export class ShakazsMerge {
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
                case "Rune of Doom":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9144);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("siegefortress", "Shadow Traitor", "Traitorous Specimen", 8, { log: false });
                        Core.huntMonster("siegefortress", "Enslaved Elemental", "Elemental Rune", 8, { log: false });
                        Core.huntMonster("siegefortress", "Enslaved Astero", "Colossal Light Rune", undefined, {
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Abyssal Seer Hair":

                case "Abyssal Frost Sedge Hat":

                case "Abyssal Frost Samurai Spirit":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("Siege Fortress", "Dage The Evil", req.name, undefined, {
                        isTemp: false,
                        log: false,
                    });
                    break;
            }
        };
        TD.storyline();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("siegefortress", 2246, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "76356",
            "ShadowScythe BladeMaster",
            'Mode: [select] only\nShould the bot buy "ShadowScythe BladeMaster" ?',
            false,
        ),
        option.bool(
            "76357",
            "ShadowScythe BladeMaster Hair",
            'Mode: [select] only\nShould the bot buy "ShadowScythe BladeMaster Hair" ?',
            false,
        ),
        option.bool(
            "76358",
            "ShadowScythe BladeMaster Short Locks",
            'Mode: [select] only\nShould the bot buy "ShadowScythe BladeMaster Short Locks" ?',
            false,
        ),
        option.bool(
            "76359",
            "ShadowScythe BladeMaster Short Hair",
            'Mode: [select] only\nShould the bot buy "ShadowScythe BladeMaster Short Hair" ?',
            false,
        ),
        option.bool(
            "76360",
            "ShadowScythe BladeMaster Locks",
            'Mode: [select] only\nShould the bot buy "ShadowScythe BladeMaster Locks" ?',
            false,
        ),
        option.bool(
            "76361",
            "ShadowScythe Flag",
            'Mode: [select] only\nShould the bot buy "ShadowScythe Flag" ?',
            false,
        ),
        option.bool(
            "76362",
            "Necrotic Katana of Doom",
            'Mode: [select] only\nShould the bot buy "Necrotic Katana of Doom" ?',
            false,
        ),
        option.bool(
            "76363",
            "Necrotic Katanas of Doom",
            'Mode: [select] only\nShould the bot buy "Necrotic Katanas of Doom" ?',
            false,
        ),
        option.bool(
            "76364",
            "Sheathed Necrotic Katana of Doom",
            'Mode: [select] only\nShould the bot buy "Sheathed Necrotic Katana of Doom" ?',
            false,
        ),
        option.bool(
            "76365",
            "Necrotic Naginata of Doom",
            'Mode: [select] only\nShould the bot buy "Necrotic Naginata of Doom" ?',
            false,
        ),
        option.bool(
            "76714",
            "Blind Abyssal Seer Hair",
            'Mode: [select] only\nShould the bot buy "Blind Abyssal Seer Hair" ?',
            false,
        ),
        option.bool(
            "76715",
            "Masked Abyssal Seer Visage",
            'Mode: [select] only\nShould the bot buy "Masked Abyssal Seer Visage" ?',
            false,
        ),
        option.bool(
            "76717",
            "Abyssal Frost Masked Sedge Hat",
            'Mode: [select] only\nShould the bot buy "Abyssal Frost Masked Sedge Hat" ?',
            false,
        ),
        option.bool(
            "76720",
            "Enchanted Abyssal Frost Samurai",
            'Mode: [select] only\nShould the bot buy "Enchanted Abyssal Frost Samurai" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ShakazsMerge.select,
});

export default function main(): void {
    const script = new ShakazsMerge();
    Core.bankingBlackList.push(
        "Rune of Doom",
        "Abyssal Seer Hair",
        "Abyssal Frost Sedge Hat",
        "Abyssal Frost Samurai Spirit",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
