/*
name: NightmareCarnaxMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/NightmareCarnaxMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreNSOD } from "../../evil/nsod/CoreNSOD";
import { UltimateBLoD } from "../../good/blod/2UltimateBlindingLightofDestiny";
import { ArchFiend } from "../../nation/various/Archfiend";
import { DarkCarnaxStory } from "../../story/DarkCarnax";

const Adv = new CoreAdvanced();
const DarkCarnax = new DarkCarnaxStory();
const NSOD = new CoreNSOD();
const AF = new ArchFiend();
const uBLOD = new UltimateBLoD();

export class NightmareCarnaxMerge {
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
                case "Synthetic Viscera":
                    DarkCarnax.syntheticViscera(quant);
                    break;
                case "Carnax Essence":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("aqlesson", "Carnax", req.name, quant, { isTemp: false });
                    break;
                case "Perfect Orochi Scales":
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("shadowfortress", "r12", "Bottom", "*", req.name, quant, { isTemp: false });
                    break;
                case "Energized Aura":
                    NSOD.energizedAura();
                    break;
                case "Abyssal Contract":
                    AF.abyssalContract();
                    break;
                case "Purified Undead Dragon Essence":
                    uBLOD.purifiedUndeadDragonEssence();
                    break;
                case "Overwhelmed Axe":
                    uBLOD.overwhelmedAxe();
                    break;
            }
        };
        DarkCarnax.storyline(true);
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("darkcarnax", 2170, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "70901",
            "Disciple of Carnax",
            'Mode: [select] only\nShould the bot buy "Disciple of Carnax" ?',
            false,
        ),
        option.bool(
            "70902",
            "Devotee of Carnax",
            'Mode: [select] only\nShould the bot buy "Devotee of Carnax" ?',
            false,
        ),
        option.bool(
            "70903",
            "Carnax Devotee's Morph",
            'Mode: [select] only\nShould the bot buy "Carnax Devotee\'s Morph" ?',
            false,
        ),
        option.bool(
            "70904",
            "Carnax Devotee's Helm",
            'Mode: [select] only\nShould the bot buy "Carnax Devotee\'s Helm" ?',
            false,
        ),
        option.bool(
            "70905",
            "Carnax Disciple's Hood",
            'Mode: [select] only\nShould the bot buy "Carnax Disciple\'s Hood" ?',
            false,
        ),
        option.bool(
            "70906",
            "Carnax Disciple's Horned Hood",
            'Mode: [select] only\nShould the bot buy "Carnax Disciple\'s Horned Hood" ?',
            false,
        ),
        option.bool("70907", "Temple of Carnax", 'Mode: [select] only\nShould the bot buy "Temple of Carnax" ?', false),
        option.bool(
            "70908",
            "Dragon Guardians of Carnax",
            'Mode: [select] only\nShould the bot buy "Dragon Guardians of Carnax" ?',
            false,
        ),
        option.bool(
            "70909",
            "Summoning Portal of Carnax",
            'Mode: [select] only\nShould the bot buy "Summoning Portal of Carnax" ?',
            false,
        ),
        option.bool(
            "70910",
            "Carnax Devotee's BattleAxe",
            'Mode: [select] only\nShould the bot buy "Carnax Devotee\'s BattleAxe" ?',
            false,
        ),
        option.bool(
            "70911",
            "Carnax Disciple's Dagger",
            'Mode: [select] only\nShould the bot buy "Carnax Disciple\'s Dagger" ?',
            false,
        ),
        option.bool(
            "70912",
            "Carnax Disciple's Daggers",
            'Mode: [select] only\nShould the bot buy "Carnax Disciple\'s Daggers" ?',
            false,
        ),
        option.bool(
            "70913",
            "Carnax Devotee's Claws",
            'Mode: [select] only\nShould the bot buy "Carnax Devotee\'s Claws" ?',
            false,
        ),
        option.bool("72688", "Nightmare Queen", 'Mode: [select] only\nShould the bot buy "Nightmare Queen" ?', false),
        option.bool(
            "72689",
            "Nightmare Queen's Face",
            'Mode: [select] only\nShould the bot buy "Nightmare Queen\'s Face" ?',
            false,
        ),
        option.bool(
            "72690",
            "Nightmare Queen's Morph",
            'Mode: [select] only\nShould the bot buy "Nightmare Queen\'s Morph" ?',
            false,
        ),
        option.bool(
            "72691",
            "Nightmare Queen's Tiara",
            'Mode: [select] only\nShould the bot buy "Nightmare Queen\'s Tiara" ?',
            false,
        ),
        option.bool(
            "72692",
            "Nightmare Queen's Spikes",
            'Mode: [select] only\nShould the bot buy "Nightmare Queen\'s Spikes" ?',
            false,
        ),
        option.bool(
            "72693",
            "Nightmare Queen's Sword",
            'Mode: [select] only\nShould the bot buy "Nightmare Queen\'s Sword" ?',
            false,
        ),
        option.bool(
            "72694",
            "Nightmare Queen's Gauntlet",
            'Mode: [select] only\nShould the bot buy "Nightmare Queen\'s Gauntlet" ?',
            false,
        ),
        option.bool(
            "72799",
            "Nightmare Carnax Disciple",
            'Mode: [select] only\nShould the bot buy "Nightmare Carnax Disciple" ?',
            false,
        ),
        option.bool(
            "72800",
            "Nightmare Carnax Devotee",
            'Mode: [select] only\nShould the bot buy "Nightmare Carnax Devotee" ?',
            false,
        ),
        option.bool(
            "72802",
            "Nightmare Carnax's Horned Hood",
            'Mode: [select] only\nShould the bot buy "Nightmare Carnax\'s Horned Hood" ?',
            false,
        ),
        option.bool(
            "72803",
            "Nightmare Carnax's Morph",
            'Mode: [select] only\nShould the bot buy "Nightmare Carnax\'s Morph" ?',
            false,
        ),
        option.bool(
            "72804",
            "Nightmare Carnax's Temple",
            'Mode: [select] only\nShould the bot buy "Nightmare Carnax\'s Temple" ?',
            false,
        ),
        option.bool(
            "72805",
            "Nightmare Carnax's Guardians",
            'Mode: [select] only\nShould the bot buy "Nightmare Carnax\'s Guardians" ?',
            false,
        ),
        option.bool(
            "72806",
            "Nightmare Carnax's BattleAxe",
            'Mode: [select] only\nShould the bot buy "Nightmare Carnax\'s BattleAxe" ?',
            false,
        ),
        option.bool(
            "72807",
            "Nightmare Carnax's Dagger",
            'Mode: [select] only\nShould the bot buy "Nightmare Carnax\'s Dagger" ?',
            false,
        ),
        option.bool(
            "72808",
            "Nightmare Carnax's Daggers",
            'Mode: [select] only\nShould the bot buy "Nightmare Carnax\'s Daggers" ?',
            false,
        ),
        option.bool(
            "72809",
            "Nightmare Carnax's Claws",
            'Mode: [select] only\nShould the bot buy "Nightmare Carnax\'s Claws" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: NightmareCarnaxMerge.select,
});

export default function main(): void {
    const script = new NightmareCarnaxMerge();
    Core.bankingBlackList.push(
        "Synthetic Viscera",
        "Carnax Essence",
        "Perfect Orochi Scales",
        "Energized Aura",
        "Abyssal Contract",
        "Purified Undead Dragon Essence",
        "Overwhelmed Axe",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
