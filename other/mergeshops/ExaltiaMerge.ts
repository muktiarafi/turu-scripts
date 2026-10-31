/*
name: Exaltia Merge
description: This bot will farm the items belonging to the selected mode for the Exaltia Merge [2010] in /timeinn
tags: exaltia, merge, timeinn, celestial, magia, thaumaturgus, alpha, omega, ultima, exalted, unity, penultima, apotheosis, apostate, duality, ascendant, enlightened, vision, zodiac, hammer, scythe, tome, grand, riftwalker, horns, horned, battle, guard, anchored, portal, contemplative, portals, sentinel, spectral, density, cryptic, drone, battlepet
*/
// Port of Scripts/Other/MergeShops/ExaltiaMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ExaltiaMerge {
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
                case "Ezrajal Insignia":

                case "Warden Insignia":

                case "Engineer Insignia":

                case "Exalted Drone Pet":
                    Core.logger(`${req.name} needs to be farmed manually.`);
                    break;
                case "Exalted Artillery Shard":
                    Core.huntMonster("timeinn", "The Engineer", req.name, req.quantity, { isTemp: req.temp });
                    break;
                case "Exalted Node":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("timeinn", "r3", "Bottom", "*", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Exalted Relic Piece":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("timeinn", "The Warden", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Exalted Forgemetal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("timeinn", "Ezrajal", req.name, quant, { isTemp: req.temp, log: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("timeinn", 2010, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("73342", "Celestial Magia", 'Mode: [select] only\nShould the bot buy "Celestial Magia" ?', false),
        option.bool(
            "61918",
            "Thaumaturgus Alpha",
            'Mode: [select] only\nShould the bot buy "Thaumaturgus Alpha" ?',
            false,
        ),
        option.bool(
            "61919",
            "Thaumaturgus Omega",
            'Mode: [select] only\nShould the bot buy "Thaumaturgus Omega" ?',
            false,
        ),
        option.bool(
            "61920",
            "Thaumaturgus Ultima",
            'Mode: [select] only\nShould the bot buy "Thaumaturgus Ultima" ?',
            false,
        ),
        option.bool("61924", "Exalted Unity", 'Mode: [select] only\nShould the bot buy "Exalted Unity" ?', false),
        option.bool(
            "61925",
            "Exalted Penultima",
            'Mode: [select] only\nShould the bot buy "Exalted Penultima" ?',
            false,
        ),
        option.bool(
            "61926",
            "Exalted Apotheosis",
            'Mode: [select] only\nShould the bot buy "Exalted Apotheosis" ?',
            false,
        ),
        option.bool("61921", "Apostate Alpha", 'Mode: [select] only\nShould the bot buy "Apostate Alpha" ?', false),
        option.bool("61922", "Apostate Omega", 'Mode: [select] only\nShould the bot buy "Apostate Omega" ?', false),
        option.bool("61923", "Apostate Ultima", 'Mode: [select] only\nShould the bot buy "Apostate Ultima" ?', false),
        option.bool("61927", "Exalted Duality", 'Mode: [select] only\nShould the bot buy "Exalted Duality" ?', false),
        option.bool("61826", "Ascendant", 'Mode: [select] only\nShould the bot buy "Ascendant" ?', false),
        option.bool(
            "61831",
            "Ascendant Enlightened Vision",
            'Mode: [select] only\nShould the bot buy "Ascendant Enlightened Vision" ?',
            false,
        ),
        option.bool(
            "61832",
            "Ascendant Enlightened Locks",
            'Mode: [select] only\nShould the bot buy "Ascendant Enlightened Locks" ?',
            false,
        ),
        option.bool(
            "61833",
            "Ascendant Dagger Zodiac",
            'Mode: [select] only\nShould the bot buy "Ascendant Dagger Zodiac" ?',
            false,
        ),
        option.bool(
            "61835",
            "Ascendant Hammer Zodiac",
            'Mode: [select] only\nShould the bot buy "Ascendant Hammer Zodiac" ?',
            false,
        ),
        option.bool(
            "61836",
            "Ascendant Scythe Zodiac",
            'Mode: [select] only\nShould the bot buy "Ascendant Scythe Zodiac" ?',
            false,
        ),
        option.bool(
            "61837",
            "Ascendant Staff Zodiac",
            'Mode: [select] only\nShould the bot buy "Ascendant Staff Zodiac" ?',
            false,
        ),
        option.bool(
            "61838",
            "Ascendant Tome Zodiac",
            'Mode: [select] only\nShould the bot buy "Ascendant Tome Zodiac" ?',
            false,
        ),
        option.bool(
            "61839",
            "Ascendant Wand Zodiac",
            'Mode: [select] only\nShould the bot buy "Ascendant Wand Zodiac" ?',
            false,
        ),
        option.bool(
            "61834",
            "Ascendant Grand Zodiac",
            'Mode: [select] only\nShould the bot buy "Ascendant Grand Zodiac" ?',
            false,
        ),
        option.bool("61845", "Riftwalker", 'Mode: [select] only\nShould the bot buy "Riftwalker" ?', false),
        option.bool("61847", "Riftwalker Horns", 'Mode: [select] only\nShould the bot buy "Riftwalker Horns" ?', false),
        option.bool(
            "61849",
            "Riftwalker Horned Locks",
            'Mode: [select] only\nShould the bot buy "Riftwalker Horned Locks" ?',
            false,
        ),
        option.bool(
            "61850",
            "Riftwalker Battle Guard",
            'Mode: [select] only\nShould the bot buy "Riftwalker Battle Guard" ?',
            false,
        ),
        option.bool(
            "61851",
            "Riftwalker Anchored Portal",
            'Mode: [select] only\nShould the bot buy "Riftwalker Anchored Portal" ?',
            false,
        ),
        option.bool(
            "61852",
            "Riftwalker Contemplative Portals",
            'Mode: [select] only\nShould the bot buy "Riftwalker Contemplative Portals" ?',
            false,
        ),
        option.bool(
            "61854",
            "Riftwalker Sentinel Blade",
            'Mode: [select] only\nShould the bot buy "Riftwalker Sentinel Blade" ?',
            false,
        ),
        option.bool(
            "61855",
            "Riftwalker Spectral Blade",
            'Mode: [select] only\nShould the bot buy "Riftwalker Spectral Blade" ?',
            false,
        ),
        option.bool(
            "61857",
            "Riftwalker Density Blade",
            'Mode: [select] only\nShould the bot buy "Riftwalker Density Blade" ?',
            false,
        ),
        option.bool("61870", "Cryptic", 'Mode: [select] only\nShould the bot buy "Cryptic" ?', false),
        option.bool("62025", "Cryptic Runes", 'Mode: [select] only\nShould the bot buy "Cryptic Runes" ?', false),
        option.bool("62026", "Cryptic Daggers", 'Mode: [select] only\nShould the bot buy "Cryptic Daggers" ?', false),
        option.bool(
            "62020",
            "Exalted Drone Battlepet",
            'Mode: [select] only\nShould the bot buy "Exalted Drone Battlepet" ?',
            false,
        ),
        option.bool(
            "68455",
            "Dual Exalted Apotheosis",
            'Mode: [select] only\nShould the bot buy "Dual Exalted Apotheosis" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ExaltiaMerge.select,
});

export default function main(): void {
    const script = new ExaltiaMerge();
    Core.bankingBlackList.push(
        "Ezrajal Insignia",
        "Warden Insignia",
        "Engineer Insignia",
        "Exalted Node",
        "Exalted Relic Piece",
        "Exalted Artillery Shard",
        "Exalted Forgemetal",
        "Exalted Drone Pet",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
