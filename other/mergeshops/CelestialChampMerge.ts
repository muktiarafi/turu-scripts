/*
name: CelestialChampMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/CelestialChampMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CelestialArenaQuests } from "../../story/queenofmonsters/extra/CelestialArena";

const Adv = new CoreAdvanced();
const CAQ = new CelestialArenaQuests();

export class CelestialChampion {
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
                // Add how to get items here
                case "Champion Sash":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("celestialarenad", "Aranx", "Champion Sash", quant, { isTemp: false });
                    break;
                case "Lumin Badge":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("celestialarenac", "Undead Raxgore Construct", "Lumin Badge", quant, {
                        isTemp: false,
                    });
                    break;
            }
        };
        CAQ.arena1to10();
        CAQ.arena11to20();
        CAQ.arena21to29();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("celestialarena", 1474, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("41454", "Viltusial", 'Mode: [select] only\nShould the bot buy "Viltusial" ?', false),
        option.bool("41461", "Bow of Viltusial", 'Mode: [select] only\nShould the bot buy "Bow of Viltusial" ?', false),
        option.bool(
            "41460",
            "Cape Of Viltusial",
            'Mode: [select] only\nShould the bot buy "Cape Of Viltusial" ?',
            false,
        ),
        option.bool(
            "41457",
            "Hair Of Viltusial",
            'Mode: [select] only\nShould the bot buy "Hair Of Viltusial" ?',
            false,
        ),
        option.bool(
            "41455",
            "Helm Of Viltusial",
            'Mode: [select] only\nShould the bot buy "Helm Of Viltusial" ?',
            false,
        ),
        option.bool(
            "41458",
            "Locks Of Viltusial",
            'Mode: [select] only\nShould the bot buy "Locks Of Viltusial" ?',
            false,
        ),
        option.bool(
            "41456",
            "Helm of Viltusial + Locks",
            'Mode: [select] only\nShould the bot buy "Helm of Viltusial + Locks" ?',
            false,
        ),
        option.bool(
            "41459",
            "Wings Of Viltusial",
            'Mode: [select] only\nShould the bot buy "Wings Of Viltusial" ?',
            false,
        ),
        option.bool(
            "41466",
            "Scythe Of Blessings",
            'Mode: [select] only\nShould the bot buy "Scythe Of Blessings" ?',
            false,
        ),
        option.bool(
            "41465",
            "Staff Of Blessings",
            'Mode: [select] only\nShould the bot buy "Staff Of Blessings" ?',
            false,
        ),
        option.bool("41447", "Cursed Abezeth", 'Mode: [select] only\nShould the bot buy "Cursed Abezeth" ?', false),
        option.bool("41450", "Abezeth Cape", 'Mode: [select] only\nShould the bot buy "Abezeth Cape" ?', false),
        option.bool("41448", "Helm Of Abezeth", 'Mode: [select] only\nShould the bot buy "Helm Of Abezeth" ?', false),
        option.bool("41449", "Hood Of Abezeth", 'Mode: [select] only\nShould the bot buy "Hood Of Abezeth" ?', false),
        option.bool("41451", "Wings Of Abezeth", 'Mode: [select] only\nShould the bot buy "Wings Of Abezeth" ?', false),
        option.bool(
            "41564",
            "Runes of Viltusial",
            'Mode: [select] only\nShould the bot buy "Runes of Viltusial" ?',
            false,
        ),
        option.bool(
            "41565",
            "Runed Cape of Viltusial",
            'Mode: [select] only\nShould the bot buy "Runed Cape of Viltusial" ?',
            false,
        ),
        option.bool("50360", "Infernal Slayer", 'Mode: [select] only\nShould the bot buy "Infernal Slayer" ?', false),
        option.bool(
            "50366",
            "Infernal Slayer's Wing",
            'Mode: [select] only\nShould the bot buy "Infernal Slayer\'s Wing" ?',
            false,
        ),
        option.bool(
            "50367",
            "Infernal Slayer's Wings",
            'Mode: [select] only\nShould the bot buy "Infernal Slayer\'s Wings" ?',
            false,
        ),
        option.bool(
            "50365",
            "Infernal Slayer's Rune + Wrap",
            'Mode: [select] only\nShould the bot buy "Infernal Slayer\'s Rune + Wrap" ?',
            false,
        ),
        option.bool(
            "50362",
            "Infernal Slayer's Halo",
            'Mode: [select] only\nShould the bot buy "Infernal Slayer\'s Halo" ?',
            false,
        ),
        option.bool(
            "50361",
            "Infernal Slayer's Halo + Locks",
            'Mode: [select] only\nShould the bot buy "Infernal Slayer\'s Halo + Locks" ?',
            false,
        ),
        option.bool(
            "50364",
            "Infernal Slayer's Hat",
            'Mode: [select] only\nShould the bot buy "Infernal Slayer\'s Hat" ?',
            false,
        ),
        option.bool(
            "50363",
            "Infernal Slayer's Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Infernal Slayer\'s Hat + Locks" ?',
            false,
        ),
        option.bool(
            "50409",
            "Infernal Slayer's Armored Wing",
            'Mode: [select] only\nShould the bot buy "Infernal Slayer\'s Armored Wing" ?',
            false,
        ),
        option.bool("50408", "Slayer's Wings", 'Mode: [select] only\nShould the bot buy "Slayer\'s Wings" ?', false),
        option.bool(
            "41453",
            "Burning Blade Of Abezeth",
            'Mode: [select] only\nShould the bot buy "Burning Blade Of Abezeth" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CelestialChampion.select,
});

export default function main(): void {
    const script = new CelestialChampion();
    Core.setOptions();

    Core.bankingBlackList.push("Champion Sash", "Lumin Badge");
    script.buyAllMerge();

    Core.setOptions(false);
}
