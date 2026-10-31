/*
name: Hollowborn Lab Merge
description: This bot will farm the items belonging to the selected mode for the Hollowborn Lab Merge [2191] in /hbchallenge
tags: hollowborn, lab, merge, hbchallenge, creator, morph, module, , tanks, alchemist, alchemists, goggles, facemask, protective, gear, gasmask, shrunken, head, battlegear
*/
// Port of Scripts/Hollowborn/MergeShops/HollowbornLabMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class HollowbornLabMerge {
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
                case "Hollowborn Residue":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8996);
                    //Hazardous Hybrid 8996
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("hbchallenge", "r5", "Left", "Chaoroot Compound", "Inert Charoot", 8, {
                            isTemp: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("hbchallenge", 2191, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "74265",
            "Hollowborn Creator",
            'Mode: [select] only\nShould the bot buy "Hollowborn Creator" ?',
            false,
        ),
        option.bool(
            "74266",
            "Hollowborn Creator Morph",
            'Mode: [select] only\nShould the bot buy "Hollowborn Creator Morph" ?',
            false,
        ),
        option.bool("74267", "Module 005 Morph", 'Mode: [select] only\nShould the bot buy "Module 005 Morph" ?', false),
        option.bool("74268", "Module 005 Tanks", 'Mode: [select] only\nShould the bot buy "Module 005 Tanks" ?', false),
        option.bool(
            "74270",
            "Module 005 Gauntlet",
            'Mode: [select] only\nShould the bot buy "Module 005 Gauntlet" ?',
            false,
        ),
        option.bool(
            "69019",
            "Hollowborn Alchemist",
            'Mode: [select] only\nShould the bot buy "Hollowborn Alchemist" ?',
            false,
        ),
        option.bool(
            "69020",
            "Hollowborn Alchemist's Hood",
            'Mode: [select] only\nShould the bot buy "Hollowborn Alchemist\'s Hood" ?',
            false,
        ),
        option.bool(
            "69021",
            "Hollowborn Alchemist's Hood + Goggles",
            'Mode: [select] only\nShould the bot buy "Hollowborn Alchemist\'s Hood + Goggles" ?',
            false,
        ),
        option.bool(
            "69022",
            "Hollowborn Alchemist's Hooded Facemask",
            'Mode: [select] only\nShould the bot buy "Hollowborn Alchemist\'s Hooded Facemask" ?',
            false,
        ),
        option.bool(
            "69023",
            "Hollowborn Alchemist's Protective Gear",
            'Mode: [select] only\nShould the bot buy "Hollowborn Alchemist\'s Protective Gear" ?',
            false,
        ),
        option.bool(
            "69024",
            "Hollowborn Alchemist's Hair",
            'Mode: [select] only\nShould the bot buy "Hollowborn Alchemist\'s Hair" ?',
            false,
        ),
        option.bool(
            "69025",
            "Hollowborn Alchemist's Morph",
            'Mode: [select] only\nShould the bot buy "Hollowborn Alchemist\'s Morph" ?',
            false,
        ),
        option.bool(
            "69026",
            "Hollowborn Alchemist's Facemask",
            'Mode: [select] only\nShould the bot buy "Hollowborn Alchemist\'s Facemask" ?',
            false,
        ),
        option.bool(
            "69027",
            "Hollowborn Alchemist's Gasmask",
            'Mode: [select] only\nShould the bot buy "Hollowborn Alchemist\'s Gasmask" ?',
            false,
        ),
        option.bool(
            "69028",
            "Hollowborn Alchemist's Locks",
            'Mode: [select] only\nShould the bot buy "Hollowborn Alchemist\'s Locks" ?',
            false,
        ),
        option.bool(
            "69029",
            "Hollowborn Alchemist's Morph + Locks",
            'Mode: [select] only\nShould the bot buy "Hollowborn Alchemist\'s Morph + Locks" ?',
            false,
        ),
        option.bool(
            "69030",
            "Hollowborn Alchemist's Facemask + Locks",
            'Mode: [select] only\nShould the bot buy "Hollowborn Alchemist\'s Facemask + Locks" ?',
            false,
        ),
        option.bool(
            "69031",
            "Hollowborn Alchemist's Gasmask + Locks",
            'Mode: [select] only\nShould the bot buy "Hollowborn Alchemist\'s Gasmask + Locks" ?',
            false,
        ),
        option.bool(
            "69032",
            "Hollowborn Alchemist's Blade",
            'Mode: [select] only\nShould the bot buy "Hollowborn Alchemist\'s Blade" ?',
            false,
        ),
        option.bool(
            "69033",
            "Hollowborn Alchemist's Blades",
            'Mode: [select] only\nShould the bot buy "Hollowborn Alchemist\'s Blades" ?',
            false,
        ),
        option.bool(
            "69034",
            "Hollowborn Alchemist's Shrunken Head",
            'Mode: [select] only\nShould the bot buy "Hollowborn Alchemist\'s Shrunken Head" ?',
            false,
        ),
        option.bool(
            "69035",
            "Hollowborn Alchemist's BattleGear",
            'Mode: [select] only\nShould the bot buy "Hollowborn Alchemist\'s BattleGear" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: HollowbornLabMerge.select,
});

export default function main(): void {
    const script = new HollowbornLabMerge();
    Core.bankingBlackList.push("Hollowborn Residue ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
