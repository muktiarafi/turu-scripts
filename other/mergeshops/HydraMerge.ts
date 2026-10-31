/*
name: Hydra Merge
description: This bot will farm the items belonging to the selected mode for the Hydra Merge [1597] in /hydrachallenge
tags: hydra, merge, hydrachallenge, chaos, hydraslayer, cloak, backblade, hammer, head, scarf, visor, dew, drops, dress, long, faerie, escherions, evolved, purified, plate, morph, guardian, trident, mystical
*/
// Port of Scripts/Other/MergeShops/HydraMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class HydraMerge {
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
                case "Hydra Scale Piece":
                    Core.huntMonster("hydrachallenge", "Hydra Head 25", req.name, quant, { isTemp: false, log: true });
                    break;
                case "Staff of Inversion":
                    Core.killEscherion(req.name, 1, { isTemp: false, log: true });
                    break;
                case "Enchanted Pearl":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("hydrachallenge", "Hydra Head 90", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("hydrachallenge", 1597, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "43593",
            "Chaos HydraSlayer",
            'Mode: [select] only\nShould the bot buy "Chaos HydraSlayer" ?',
            false,
        ),
        option.bool(
            "43601",
            "Chaos HydraSlayer Cloak",
            'Mode: [select] only\nShould the bot buy "Chaos HydraSlayer Cloak" ?',
            false,
        ),
        option.bool(
            "43600",
            "Chaos HydraSlayer BackBlade",
            'Mode: [select] only\nShould the bot buy "Chaos HydraSlayer BackBlade" ?',
            false,
        ),
        option.bool(
            "43598",
            "Chaos HydraSlayer Hammer",
            'Mode: [select] only\nShould the bot buy "Chaos HydraSlayer Hammer" ?',
            false,
        ),
        option.bool(
            "43595",
            "Chaos HydraSlayer Helm",
            'Mode: [select] only\nShould the bot buy "Chaos HydraSlayer Helm" ?',
            false,
        ),
        option.bool(
            "43594",
            "Chaos HydraSlayer Head",
            'Mode: [select] only\nShould the bot buy "Chaos HydraSlayer Head" ?',
            false,
        ),
        option.bool(
            "43596",
            "Chaos HydraSlayer Scarf",
            'Mode: [select] only\nShould the bot buy "Chaos HydraSlayer Scarf" ?',
            false,
        ),
        option.bool(
            "43599",
            "Chaos HydraSlayer Blade",
            'Mode: [select] only\nShould the bot buy "Chaos HydraSlayer Blade" ?',
            false,
        ),
        option.bool(
            "43597",
            "Chaos HydraSlayer Visor",
            'Mode: [select] only\nShould the bot buy "Chaos HydraSlayer Visor" ?',
            false,
        ),
        option.bool(
            "43794",
            "Dew Drop's Dress Armor",
            'Mode: [select] only\nShould the bot buy "Dew Drop\'s Dress Armor" ?',
            false,
        ),
        option.bool("43795", "Long Faerie Hair", 'Mode: [select] only\nShould the bot buy "Long Faerie Hair" ?', false),
        option.bool("43798", "Faerie Hair", 'Mode: [select] only\nShould the bot buy "Faerie Hair" ?', false),
        option.bool(
            "43799",
            "Escherion's Evolved Staff",
            'Mode: [select] only\nShould the bot buy "Escherion\'s Evolved Staff" ?',
            false,
        ),
        option.bool(
            "83390",
            "Purified HydraSlayer Plate",
            'Mode: [select] only\nShould the bot buy "Purified HydraSlayer Plate" ?',
            false,
        ),
        option.bool(
            "83391",
            "Purified HydraSlayer Helm",
            'Mode: [select] only\nShould the bot buy "Purified HydraSlayer Helm" ?',
            false,
        ),
        option.bool(
            "83392",
            "Purified HydraSlayer Morph Hood",
            'Mode: [select] only\nShould the bot buy "Purified HydraSlayer Morph Hood" ?',
            false,
        ),
        option.bool(
            "83393",
            "Purified HydraSlayer Hood",
            'Mode: [select] only\nShould the bot buy "Purified HydraSlayer Hood" ?',
            false,
        ),
        option.bool(
            "83394",
            "Hydra Head Guardian Cape",
            'Mode: [select] only\nShould the bot buy "Hydra Head Guardian Cape" ?',
            false,
        ),
        option.bool(
            "83395",
            "Purified HydraSlayer Blade",
            'Mode: [select] only\nShould the bot buy "Purified HydraSlayer Blade" ?',
            false,
        ),
        option.bool(
            "83396",
            "Purified HydraSlayer Blades",
            'Mode: [select] only\nShould the bot buy "Purified HydraSlayer Blades" ?',
            false,
        ),
        option.bool(
            "83397",
            "Purified HydraSlayer Polearm",
            'Mode: [select] only\nShould the bot buy "Purified HydraSlayer Polearm" ?',
            false,
        ),
        option.bool(
            "83398",
            "Purified HydraSlayer Trident",
            'Mode: [select] only\nShould the bot buy "Purified HydraSlayer Trident" ?',
            false,
        ),
        option.bool(
            "83399",
            "Purified HydraSlayer Staff",
            'Mode: [select] only\nShould the bot buy "Purified HydraSlayer Staff" ?',
            false,
        ),
        option.bool(
            "83400",
            "Mystical HydraSlayer Plate",
            'Mode: [select] only\nShould the bot buy "Mystical HydraSlayer Plate" ?',
            false,
        ),
        option.bool(
            "83401",
            "Mystical Hydraslayer Helm",
            'Mode: [select] only\nShould the bot buy "Mystical Hydraslayer Helm" ?',
            false,
        ),
        option.bool(
            "83402",
            "Mystical HydraSlayer Morph Hood",
            'Mode: [select] only\nShould the bot buy "Mystical HydraSlayer Morph Hood" ?',
            false,
        ),
        option.bool(
            "83403",
            "Mystical HydraSlayer Hood",
            'Mode: [select] only\nShould the bot buy "Mystical HydraSlayer Hood" ?',
            false,
        ),
        option.bool(
            "83404",
            "Mystical Hydra Head Cape",
            'Mode: [select] only\nShould the bot buy "Mystical Hydra Head Cape" ?',
            false,
        ),
        option.bool(
            "83405",
            "Mystical HydraSlayer Blade",
            'Mode: [select] only\nShould the bot buy "Mystical HydraSlayer Blade" ?',
            false,
        ),
        option.bool(
            "83406",
            "Mystical HydraSlayer Blades",
            'Mode: [select] only\nShould the bot buy "Mystical HydraSlayer Blades" ?',
            false,
        ),
        option.bool(
            "83407",
            "Mystical HydraSlayer Polearm",
            'Mode: [select] only\nShould the bot buy "Mystical HydraSlayer Polearm" ?',
            false,
        ),
        option.bool(
            "83408",
            "Mystical HydraSlayer Trident",
            'Mode: [select] only\nShould the bot buy "Mystical HydraSlayer Trident" ?',
            false,
        ),
        option.bool(
            "83409",
            "Mystical HydraSlayer Staff",
            'Mode: [select] only\nShould the bot buy "Mystical HydraSlayer Staff" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: HydraMerge.select,
});

export default function main(): void {
    const script = new HydraMerge();
    Core.bankingBlackList.push("Hydra Scale Piece", "Staff of Inversion", "Enchanted Pearl");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
