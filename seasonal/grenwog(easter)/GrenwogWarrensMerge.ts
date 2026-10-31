/*
name: Grenwog Warrens Merge
description: This bot will farm the items belonging to the selected mode for the Grenwog Warrens Merge [2571] in /grenwogwarren
tags: grenwog, warrens, merge, grenwogwarren, lagomorph, techwear, tech, morph, ears, techmask, royal, graffiti, wings, angel, crown, punk, hammer, hammers
*/
// Port of Scripts/Seasonal/Grenwog(Easter)/GrenwogWarrensMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { GrenWogWarren } from "./GrenWogWarren";

const Adv = new CoreAdvanced();
const grenWogWarren = new GrenWogWarren();

export class GrenwogWarrensMerge {
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

            const UseableMonsters = [
                "Grenwog", // UseableMonsters[0],
                "Sugar Grenwog", // UseableMonsters[1],
                "Draconic Grenwog", // UseableMonsters[2],
                "Jurassic Grenwog", // UseableMonsters[3],
                "Elixir Grenwog", // UseableMonsters[4],
                "Alpha Cabdury", // UseableMonsters[5]
            ];

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
                case "Rubber Egg":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("grenwogwarren", UseableMonsters[0], req.name, quant, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Sugary Egg":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("grenwogwarren", UseableMonsters[1], req.name, quant, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Scaly Egg":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("grenwogwarren", UseableMonsters[2], req.name, quant, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Aged Egg":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("grenwogwarren", UseableMonsters[3], req.name, quant, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Liquid Egg":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("grenwogwarren", UseableMonsters[4], req.name, quant, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Cabdury Egg":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("grenwogwarren", UseableMonsters[5], req.name, quant, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
            }
        };
        grenWogWarren.storyline();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("grenwogwarren", 2571, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "92971",
            "Lagomorph TechWear",
            'Mode: [select] only\nShould the bot buy "Lagomorph TechWear" ?',
            false,
        ),
        option.bool(
            "92972",
            "Lagomorph Tech Morph",
            'Mode: [select] only\nShould the bot buy "Lagomorph Tech Morph" ?',
            false,
        ),
        option.bool(
            "92973",
            "Lagomorph Tech Ears Visage",
            'Mode: [select] only\nShould the bot buy "Lagomorph Tech Ears Visage" ?',
            false,
        ),
        option.bool(
            "92974",
            "Lagomorph Techmask",
            'Mode: [select] only\nShould the bot buy "Lagomorph Techmask" ?',
            false,
        ),
        option.bool(
            "92975",
            "Lagomorph Tech Visage",
            'Mode: [select] only\nShould the bot buy "Lagomorph Tech Visage" ?',
            false,
        ),
        option.bool(
            "92976",
            "Lagomorph Techwear Hair",
            'Mode: [select] only\nShould the bot buy "Lagomorph Techwear Hair" ?',
            false,
        ),
        option.bool(
            "92977",
            "Lagomorph Techwear Locks",
            'Mode: [select] only\nShould the bot buy "Lagomorph Techwear Locks" ?',
            false,
        ),
        option.bool(
            "92978",
            "Royal Graffiti Wings",
            'Mode: [select] only\nShould the bot buy "Royal Graffiti Wings" ?',
            false,
        ),
        option.bool(
            "92979",
            "Graffiti Angel Wings",
            'Mode: [select] only\nShould the bot buy "Graffiti Angel Wings" ?',
            false,
        ),
        option.bool("92980", "Graffiti Crown", 'Mode: [select] only\nShould the bot buy "Graffiti Crown" ?', false),
        option.bool(
            "92983",
            "Lagomorph Punk Hammer",
            'Mode: [select] only\nShould the bot buy "Lagomorph Punk Hammer" ?',
            false,
        ),
        option.bool(
            "92984",
            "Lagomorph Punk Hammers",
            'Mode: [select] only\nShould the bot buy "Lagomorph Punk Hammers" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: GrenwogWarrensMerge.select,
});

export default function main(): void {
    const script = new GrenwogWarrensMerge();
    Core.bankingBlackList.push("Rubber Egg", "Sugary Egg", "Scaly Egg", "Aged Egg", "Liquid Egg", "Cabdury Egg");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
