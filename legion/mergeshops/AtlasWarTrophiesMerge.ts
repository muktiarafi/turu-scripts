/*
name: Atlas War Trophies Merge
description: This bot will farm the items belonging to the selected mode for the Atlas War Trophies Merge [2564] in /atlaspromenade
tags: atlas, war, trophies, merge, atlaspromenade, knight, cloak, axis, enchanted, barrensoul, psalm, ritualist, aeterna, adornment, cowl, horns, underworld, vestments, , horned, corpse, wax, candelabras, candelabra
*/
// Port of Scripts/Legion/MergeShops/AtlasWarTrophiesMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";
import { AtlasPromenade } from "../../story/legion/AtlasPromenade";

const Adv = new CoreAdvanced();
const AP = new AtlasPromenade();
const Legion = new CoreLegion();

export class AtlasWarTrophiesMerge {
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
                case "Broken Chain":
                    //10115 | You and Your Chain
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(10115);
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("atlaspromenade", "Atlas Light Magus", "Atlas Citizenship", 6);
                        Core.huntMonster("atlaspromenade", "Wrath Guard", "Wrath Scar", 12);
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("atlaspromenade", "Usurper Lord Slaine", "Slaine's Barbed Chain");
                        Core.ensureComplete(10115);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Atlas Crest":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("atlaspromenade", "Atlas Light Magus", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Atlas Axis Blade":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("atlaspromenade", "Atlas Knight", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
                case "Barrensoul Psalm":

                case "Underworld Ritualist Aeterna Adornment":

                case "Underworld Ritualist Aeterna Hood":

                case "Underworld Ritualist Aeterna Horns":

                case "Underworld Ritualist Adornments":

                case "Underworld Ritualist Horned Mask":

                case "Underworld Ritualist Mask":

                case "Underworld Ritualist Horned Hood":

                case "Underworld Ritualist Adorned Hood":

                case "Underworld Ritualist Horned Adornment":

                case "Underworld Ritualist Adorned Mask":

                case "Underworld Ritualist Hood":

                case "Underworld Ritualist":

                case "Underworld Ritualist Aeterna Adornment Horns":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("atlaspromenade", "Usurper Lord Slaine", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Pale Corpse Wax Candelabras":

                case "Pale Corpse Wax Candelabra":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("atlaspromenade", "Twisted Warrior", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
            }
        };
        AP.storyline();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("atlaspromenade", 2564, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("92306", "Atlas Knight", 'Mode: [select] only\nShould the bot buy "Atlas Knight" ?', false),
        option.bool(
            "84295",
            "Enchanted Underworld Ritualist",
            'Mode: [select] only\nShould the bot buy "Enchanted Underworld Ritualist" ?',
            false,
        ),
        option.bool(
            "92308",
            "Atlas Knight Cloak",
            'Mode: [select] only\nShould the bot buy "Atlas Knight Cloak" ?',
            false,
        ),
        option.bool(
            "84648",
            "Corpse Wax Candelabras",
            'Mode: [select] only\nShould the bot buy "Corpse Wax Candelabras" ?',
            false,
        ),
        option.bool(
            "92311",
            "Atlas Axis Blades",
            'Mode: [select] only\nShould the bot buy "Atlas Axis Blades" ?',
            false,
        ),
        option.bool(
            "92307",
            "Atlas Knight Helm",
            'Mode: [select] only\nShould the bot buy "Atlas Knight Helm" ?',
            false,
        ),
        option.bool(
            "84307",
            "Enchanted Ritualist Aeterna Adornment Horns",
            'Mode: [select] only\nShould the bot buy "Enchanted Ritualist Aeterna Adornment Horns" ?',
            false,
        ),
        option.bool(
            "84306",
            "Enchanted Ritualist Aeterna Cowl",
            'Mode: [select] only\nShould the bot buy "Enchanted Ritualist Aeterna Cowl" ?',
            false,
        ),
        option.bool(
            "84305",
            "Enchanted Ritualist Aeterna Horns",
            'Mode: [select] only\nShould the bot buy "Enchanted Ritualist Aeterna Horns" ?',
            false,
        ),
        option.bool(
            "84304",
            "Enchanted Ritualist Aeterna Adornment",
            'Mode: [select] only\nShould the bot buy "Enchanted Ritualist Aeterna Adornment" ?',
            false,
        ),
        option.bool(
            "84303",
            "Enchanted Underworld Ritualist Vestments",
            'Mode: [select] only\nShould the bot buy "Enchanted Underworld Ritualist Vestments" ?',
            false,
        ),
        option.bool(
            "84302",
            "Enchanted Underworld Ritualist Mask + Horns",
            'Mode: [select] only\nShould the bot buy "Enchanted Underworld Ritualist Mask + Horns" ?',
            false,
        ),
        option.bool(
            "84301",
            "Enchanted Underworld Ritualist Hood",
            'Mode: [select] only\nShould the bot buy "Enchanted Underworld Ritualist Hood" ?',
            false,
        ),
        option.bool(
            "84300",
            "Underworld Ritualist Horned Cowl",
            'Mode: [select] only\nShould the bot buy "Underworld Ritualist Horned Cowl" ?',
            false,
        ),
        option.bool(
            "84299",
            "Enchanted Underworld Ritualist Adornment",
            'Mode: [select] only\nShould the bot buy "Enchanted Underworld Ritualist Adornment" ?',
            false,
        ),
        option.bool(
            "84298",
            "Enchanted Underworld Ritualist Horns",
            'Mode: [select] only\nShould the bot buy "Enchanted Underworld Ritualist Horns" ?',
            false,
        ),
        option.bool(
            "84297",
            "Enchanted Underworld Ritualist Mask",
            'Mode: [select] only\nShould the bot buy "Enchanted Underworld Ritualist Mask" ?',
            false,
        ),
        option.bool(
            "84296",
            "Underworld Ritualist Cowl",
            'Mode: [select] only\nShould the bot buy "Underworld Ritualist Cowl" ?',
            false,
        ),
        option.bool(
            "84647",
            "Corpse Wax Candelabra",
            'Mode: [select] only\nShould the bot buy "Corpse Wax Candelabra" ?',
            false,
        ),
        option.bool(
            "84308",
            "Enchanted Barrensoul Psalm",
            'Mode: [select] only\nShould the bot buy "Enchanted Barrensoul Psalm" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AtlasWarTrophiesMerge.select,
});

export default function main(): void {
    const script = new AtlasWarTrophiesMerge();
    Core.bankingBlackList.push(
        "Broken Chain",
        "Atlas Crest",
        "Atlas Axis Blade",
        "Legion Token",
        "Barrensoul Psalm",
        "Underworld Ritualist Aeterna Adornment",
        "Underworld Ritualist Aeterna Hood",
        "Underworld Ritualist Aeterna Horns",
        "Underworld Ritualist Adornments",
        "Underworld Ritualist Horned Mask",
        "Underworld Ritualist Mask",
        "Underworld Ritualist Horned Hood",
        "Underworld Ritualist Adorned Hood",
        "Underworld Ritualist Horned Adornment",
        "Underworld Ritualist Adorned Mask",
        "Underworld Ritualist Hood",
        "Underworld Ritualist",
        "Pale Corpse Wax Candelabras",
        "Pale Corpse Wax Candelabra",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
