/*
name: VulcarsMerge
description: null
tags: null
*/
// Port of Scripts/Legion/Various/VulcarsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";
import { LetItBurn } from "../legionmaterials/LetitBurn(SoulEssence)";
import { AnotherOneBitesTheDust } from "../legionmaterials/SoulSand";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();
const SSand = new AnotherOneBitesTheDust();
const letItBurn = new LetItBurn();

export class VulcarsMerge {
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
                case "Soul Sand":
                    SSand.soulSand(quant);
                    break;
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
                case "Soul Essence":
                    letItBurn.soulEssence(quant);
                    break;
                case "Legion Undead Visor":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(7992);
                        Core.huntMonster("dagefortress", "Grrrberus", "Grrberus' Flame");
                        SSand.soulSand(3);
                        Core.ensureCompleteChoose(7992, [req.name]);
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("underworld", 1985, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "59961",
            "Undead Spawn Minion",
            'Mode: [select] only\nShould the bot buy "Undead Spawn Minion" ?',
            false,
        ),
        option.bool(
            "59962",
            "Undead Minion Visor",
            'Mode: [select] only\nShould the bot buy "Undead Minion Visor" ?',
            false,
        ),
        option.bool(
            "59968",
            "Legion Soul Devourer",
            'Mode: [select] only\nShould the bot buy "Legion Soul Devourer" ?',
            false,
        ),
        option.bool("59982", "Legion Bonfire", 'Mode: [select] only\nShould the bot buy "Legion Bonfire" ?', false),
        option.bool(
            "59959",
            "Legion Forge Spawn",
            'Mode: [select] only\nShould the bot buy "Legion Forge Spawn" ?',
            false,
        ),
        option.bool(
            "59964",
            "Legion Forge Visor",
            'Mode: [select] only\nShould the bot buy "Legion Forge Visor" ?',
            false,
        ),
        option.bool(
            "59966",
            "Legion Infinite Flames",
            'Mode: [select] only\nShould the bot buy "Legion Infinite Flames" ?',
            false,
        ),
        option.bool(
            "59965",
            "Legion Spawn Runes",
            'Mode: [select] only\nShould the bot buy "Legion Spawn Runes" ?',
            false,
        ),
        option.bool(
            "59967",
            "Legion Bonfire Altar",
            'Mode: [select] only\nShould the bot buy "Legion Bonfire Altar" ?',
            false,
        ),
        option.bool(
            "60059",
            "Dual Legion Soul Devourers",
            'Mode: [select] only\nShould the bot buy "Dual Legion Soul Devourers" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: VulcarsMerge.select,
});

export default function main(): void {
    const script = new VulcarsMerge();
    Core.bankingBlackList.push("Soul Sand", "Legion Token", "Soul Essence", "Legion Undead Visor ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
