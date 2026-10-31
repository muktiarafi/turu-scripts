/*
name: Crulons Wedding Merge
description: This bot will farm the items belonging to the selected mode for the Crulons Wedding Merge [2472] in /crulonwed
tags: crulons, wedding, merge, crulonwed, sandsea, ceremonial, attire, morph, amanis, veil, emerald, eons, royal, guest, enchanted, desert, bandana, luxorlight, wings, spear, bow
*/
// Port of Scripts/Other/MergeShops/CrulonsWeddingMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { Crulonwedding } from "../../story/Crulonwed";

const Adv = new CoreAdvanced();
const crulonwedding = new Crulonwedding();

export class CrulonsWeddingMerge {
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
                case "Flame Incantation":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9848);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("djinnguard", UseableMonsters[1], "Jaan's Flames");

                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Silver Ward":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9849);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("towerofmirrors", UseableMonsters[2], "Silver Tincture", 10);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Almoravid's Bracer":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9850);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("crulonwed", UseableMonsters[0], "Silver Tincture", 10);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Luminous Soul Bow":

                case "Luminous Soul Spear":

                case "Luminous Emblem":

                case "Luminous Soul Blade":

                case "Desert Bandana":

                case "Honored Sandsea Guest":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("crulonwed", UseableMonsters[0], req.name, quant, { isTemp: req.temp });
                    break;
            }
        };
        //#region Useable Monsters
        const UseableMonsters = [
            "King Almoravid", // UseableMonsters[0]
            "Jaan al Nair",
            "Silver Elemental",
        ];
        //#endregion Useable Monsters
        crulonwedding.storyLine();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("crulonwed", 2472, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "87682",
            "Sandsea Ceremonial Attire",
            'Mode: [select] only\nShould the bot buy "Sandsea Ceremonial Attire" ?',
            false,
        ),
        option.bool(
            "87683",
            "Crulon's Wedding Morph",
            'Mode: [select] only\nShould the bot buy "Crulon\'s Wedding Morph" ?',
            false,
        ),
        option.bool(
            "87684",
            "Amani's Wedding Visage",
            'Mode: [select] only\nShould the bot buy "Amani\'s Wedding Visage" ?',
            false,
        ),
        option.bool(
            "87685",
            "Crulon's Wedding Helm",
            'Mode: [select] only\nShould the bot buy "Crulon\'s Wedding Helm" ?',
            false,
        ),
        option.bool(
            "87686",
            "Amani's Wedding Veil",
            'Mode: [select] only\nShould the bot buy "Amani\'s Wedding Veil" ?',
            false,
        ),
        option.bool(
            "87687",
            "Crulon's Wedding Mask",
            'Mode: [select] only\nShould the bot buy "Crulon\'s Wedding Mask" ?',
            false,
        ),
        option.bool(
            "87688",
            "Emerald Eons Blade",
            'Mode: [select] only\nShould the bot buy "Emerald Eons Blade" ?',
            false,
        ),
        option.bool(
            "87689",
            "Emerald Eons Blades",
            'Mode: [select] only\nShould the bot buy "Emerald Eons Blades" ?',
            false,
        ),
        option.bool(
            "68243",
            "Royal Sandsea Guest",
            'Mode: [select] only\nShould the bot buy "Royal Sandsea Guest" ?',
            false,
        ),
        option.bool(
            "68244",
            "Enchanted Desert Bandana",
            'Mode: [select] only\nShould the bot buy "Enchanted Desert Bandana" ?',
            false,
        ),
        option.bool("68245", "Luxorlight Helm", 'Mode: [select] only\nShould the bot buy "Luxorlight Helm" ?', false),
        option.bool("68246", "Luxorlight Wings", 'Mode: [select] only\nShould the bot buy "Luxorlight Wings" ?', false),
        option.bool("68248", "Luxorlight Blade", 'Mode: [select] only\nShould the bot buy "Luxorlight Blade" ?', false),
        option.bool("68249", "Luxorlight Spear", 'Mode: [select] only\nShould the bot buy "Luxorlight Spear" ?', false),
        option.bool("68250", "Luxorlight Bow", 'Mode: [select] only\nShould the bot buy "Luxorlight Bow" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CrulonsWeddingMerge.select,
});

export default function main(): void {
    const script = new CrulonsWeddingMerge();
    Core.bankingBlackList.push(
        "Flame Incantation",
        "Silver Ward",
        "Almoravid's Bracer",
        "Honored Sandsea Guest",
        "Desert Bandana",
        "Luminous Emblem",
        "Luminous Soul Blade",
        "Luminous Soul Spear",
        "Luminous Soul Bow",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
