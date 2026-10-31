/*
name: Deimos Den Rewards Merge
description: This bot will farm the items belonging to the selected mode for the Deimos Den Rewards Merge [2418] in /legionarena
tags: deimos, den, rewards, merge, legionarena, soul, eater, underworld, master, combat, cursed, grudge, nagamaki, apocryphal, ankle, shackle, shackles, asphodel, hunters, bow, devastator, claw, claws, arena, provocator, horned, retiarius, trident, arrow
*/
// Port of Scripts/Other/MergeShops/DeimosDenRewardsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreLegion } from "../../legion/CoreLegion";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();

export class DeimosDenRewardsMerge {
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
                case "Bone Sigil":
                    Legion.boneSigil(quant);
                    break;
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
                case "Deimos' Chain":

                case "Cursed Grudge Nagamaki":

                case "Deimos' Fang":
                    Core.farmingLogger(req.name, quant);
                    Core.logger(`${req.name} requires you to kill Devastator Deimos which skua can't do, use army.`);
                    break;
                case "Death Badge":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("legionarena", "Legion Fiend Rider", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("deimos", 2418, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("5006", "Soul Eater", 'Mode: [select] only\nShould the bot buy "Soul Eater" ?', false),
        option.bool(
            "70028",
            "Underworld Master Rune",
            'Mode: [select] only\nShould the bot buy "Underworld Master Rune" ?',
            false,
        ),
        option.bool(
            "70029",
            "Underworld Combat Rune",
            'Mode: [select] only\nShould the bot buy "Underworld Combat Rune" ?',
            false,
        ),
        option.bool(
            "70031",
            "Cursed Dual Grudge Nagamaki",
            'Mode: [select] only\nShould the bot buy "Cursed Dual Grudge Nagamaki" ?',
            false,
        ),
        option.bool(
            "73639",
            "Apocryphal Underworld Dagger",
            'Mode: [select] only\nShould the bot buy "Apocryphal Underworld Dagger" ?',
            false,
        ),
        option.bool(
            "73640",
            "Apocryphal Underworld Daggers",
            'Mode: [select] only\nShould the bot buy "Apocryphal Underworld Daggers" ?',
            false,
        ),
        option.bool(
            "84195",
            "Underworld Ankle Shackle",
            'Mode: [select] only\nShould the bot buy "Underworld Ankle Shackle" ?',
            false,
        ),
        option.bool(
            "84196",
            "Underworld Ankle Shackles",
            'Mode: [select] only\nShould the bot buy "Underworld Ankle Shackles" ?',
            false,
        ),
        option.bool(
            "84197",
            "Asphodel Hunter's Bow",
            'Mode: [select] only\nShould the bot buy "Asphodel Hunter\'s Bow" ?',
            false,
        ),
        option.bool(
            "84309",
            "Devastator Deimos Claw",
            'Mode: [select] only\nShould the bot buy "Devastator Deimos Claw" ?',
            false,
        ),
        option.bool(
            "84310",
            "Devastator Deimos Claws",
            'Mode: [select] only\nShould the bot buy "Devastator Deimos Claws" ?',
            false,
        ),
        option.bool(
            "84374",
            "Underworld Arena Provocator",
            'Mode: [select] only\nShould the bot buy "Underworld Arena Provocator" ?',
            false,
        ),
        option.bool(
            "84375",
            "Horned Underworld Provocator Helm",
            'Mode: [select] only\nShould the bot buy "Horned Underworld Provocator Helm" ?',
            false,
        ),
        option.bool(
            "84376",
            "Underworld Provocator Helm",
            'Mode: [select] only\nShould the bot buy "Underworld Provocator Helm" ?',
            false,
        ),
        option.bool(
            "84377",
            "Underworld Provocator Cape",
            'Mode: [select] only\nShould the bot buy "Underworld Provocator Cape" ?',
            false,
        ),
        option.bool(
            "84378",
            "Underworld Retiarius Trident",
            'Mode: [select] only\nShould the bot buy "Underworld Retiarius Trident" ?',
            false,
        ),
        option.bool(
            "84388",
            "Asphodel Hunter's Bow And Arrow",
            'Mode: [select] only\nShould the bot buy "Asphodel Hunter\'s Bow And Arrow" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DeimosDenRewardsMerge.select,
});

export default function main(): void {
    const script = new DeimosDenRewardsMerge();
    Core.bankingBlackList.push(
        "Bone Sigil",
        "Legion Token",
        "Deimos' Chain",
        "Cursed Grudge Nagamaki",
        "Deimos' Fang",
        "Death Badge",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
