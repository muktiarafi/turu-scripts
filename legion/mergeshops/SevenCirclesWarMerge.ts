/*
name: SevenCirclesWarMerge
description: null
tags: null
*/
// Port of Scripts/Legion/MergeShops/SevenCirclesWarMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";
import { HeadoftheLegionBeast } from "../HeadOfTheLegionBeast";
import { SevenCirclesMerge } from "./SevenCirclesMerge";
import { SevenCircles } from "../../story/legion/SevenCircles(War)";

const Legion = new CoreLegion();
const Adv = new CoreAdvanced();
const Circles = new SevenCircles();
const sevenCirclesMerge = new SevenCirclesMerge();
const headoftheLegionBeast = new HeadoftheLegionBeast();

export class SevenCirclesWarMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    headLegionBeast: string[] = [
        "Penance",
        "Essence of Wrath",
        "Essence of Violence",
        "Essence of Treachery",
        "Souls of Heresy",
        "Indulgence",
        "Beast Soul",
        "Helms of the Seven Circles",
        "Faces of Violence",
        "Crown of Wrath",
        "Stare of Greed",
        "Gluttony's Maw",
        "Aspect of Luxuria",
        "Face of Treachery",
    ];

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            // Core.DebugLogger(this, $"req.Name: {req.Name} | quant: {quant} | currentQuant: {currentQuant}");
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
                case "Indulgence":
                    headoftheLegionBeast.indulgence(quant);
                    break;
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
                case "Beast Soul":
                    if (Core.checkInventory(req.name, quant)) {
                        break;
                    }
                    Core.farmingLogger(req.name, quant);
                    Adv.gearStore(false);
                    if (Core.checkInventory("ArchPaladin")) {
                        Core.equip("ArchPaladin");
                    } else {
                        Core.equipClass(ClassType.Solo);
                    }
                    Core.huntMonster("sevencircleswar", "The Beast", req.name, quant, {
                        isTemp: false,
                        publicRoom: true,
                    });
                    Adv.gearStore(true, { enhAfter: true });
                    break;
                case "Souls of Heresy":
                    headoftheLegionBeast.soulsHeresy(quant);
                    break;
                case "Penance":
                    headoftheLegionBeast.penance(quant);
                    break;
                case "Essence of Treachery":
                    headoftheLegionBeast.essenceTreachery(quant);
                    break;
                case "Essence of Wrath":
                    headoftheLegionBeast.essenceWrath(quant);
                    break;
                case "Essence of Violence":
                    headoftheLegionBeast.essenceViolence(quant);
                    break;
                //these come from circles not war:
                case "Stare of Greed":

                case "Gluttony's Maw":

                case "Aspect of Luxuria":
                    sevenCirclesMerge.buyAllMerge(req.name);
                    break;
                case "Helms of the Seven Circles":
                    headoftheLegionBeast.helmSevenCircles();
                    break;
            }
        };
        Circles.circlesWar();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("sevencircleswar", 1984, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "59754",
            "Faces of Violence",
            'Mode: [select] only\nShould the bot buy "Faces of Violence" ?',
            false,
        ),
        option.bool("59755", "Crown of Wrath", 'Mode: [select] only\nShould the bot buy "Crown of Wrath" ?', false),
        option.bool(
            "60038",
            "Head of the Legion Beast",
            'Mode: [select] only\nShould the bot buy "Head of the Legion Beast" ?',
            false,
        ),
        option.bool(
            "59721",
            "Face of Treachery",
            'Mode: [select] only\nShould the bot buy "Face of Treachery" ?',
            false,
        ),
        option.bool("60095", "Legion Viking", 'Mode: [select] only\nShould the bot buy "Legion Viking" ?', false),
        option.bool(
            "60096",
            "Legion Viking Helm",
            'Mode: [select] only\nShould the bot buy "Legion Viking Helm" ?',
            false,
        ),
        option.bool(
            "60097",
            "Legion Viking Mask",
            'Mode: [select] only\nShould the bot buy "Legion Viking Mask" ?',
            false,
        ),
        option.bool(
            "60101",
            "Legion Viking Hatchet",
            'Mode: [select] only\nShould the bot buy "Legion Viking Hatchet" ?',
            false,
        ),
        option.bool(
            "60099",
            "Legion Viking Big Axe",
            'Mode: [select] only\nShould the bot buy "Legion Viking Big Axe" ?',
            false,
        ),
        option.bool(
            "60100",
            "Legion Viking Flail",
            'Mode: [select] only\nShould the bot buy "Legion Viking Flail" ?',
            false,
        ),
        option.bool(
            "60098",
            "Legion Viking Back Axe",
            'Mode: [select] only\nShould the bot buy "Legion Viking Back Axe" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SevenCirclesWarMerge.select,
});

export default function main(): void {
    const script = new SevenCirclesWarMerge();
    Core.bankingBlackList.push(
        "Legion Token",
        "Indulgence",
        "Beast Soul",
        "Souls of Heresy",
        "Essence of Treachery",
        "Essence of Wrath",
        "Essence of Violence",
        "Penance",
        "Stare of Greed",
        "Gluttony's Maw",
        "Aspect of Luxuria",
        "Helms of the Seven Circles",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
