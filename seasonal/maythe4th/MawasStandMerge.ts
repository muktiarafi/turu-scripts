/*
name: Mawa's Stand Merge
description: This bot will farm the items belonging to the selected mode for the Mawa's Stand Merge [1874] in /zorbaspalace
tags: mawas, stand, merge, zorbaspalace, galactic, shadow, trooper, twicket, twig, fortuna, twillek, starcrasher, , scarf, backblades, lightblade, lightblades, parodian, guard, guards, sheathed
*/
// Port of Scripts/Seasonal/MayThe4th/MawasStandMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class MawasStandMerge {
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
                case "Furry Egg":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("zorbaspalace", "Lem-or", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Woopee":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("zorbaspalace", "Thwompcat", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("zorbaspalace", 1874, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "54390",
            "Galactic Shadow Trooper",
            'Mode: [select] only\nShould the bot buy "Galactic Shadow Trooper" ?',
            false,
        ),
        option.bool(
            "54394",
            "Galactic Shadow Trooper Helm",
            'Mode: [select] only\nShould the bot buy "Galactic Shadow Trooper Helm" ?',
            false,
        ),
        option.bool("54447", "Twicket", 'Mode: [select] only\nShould the bot buy "Twicket" ?', false),
        option.bool("54448", "Twig Fortuna", 'Mode: [select] only\nShould the bot buy "Twig Fortuna" ?', false),
        option.bool("54449", "Twill-ek", 'Mode: [select] only\nShould the bot buy "Twill-ek" ?', false),
        option.bool("54440", "StarCrasher", 'Mode: [select] only\nShould the bot buy "StarCrasher" ?', false),
        option.bool("54441", "StarCrasher Helm", 'Mode: [select] only\nShould the bot buy "StarCrasher Helm" ?', false),
        option.bool(
            "54442",
            "StarCrasher Helm + Scarf",
            'Mode: [select] only\nShould the bot buy "StarCrasher Helm + Scarf" ?',
            false,
        ),
        option.bool("54443", "StarCrasher Hood", 'Mode: [select] only\nShould the bot buy "StarCrasher Hood" ?', false),
        option.bool(
            "54444",
            "StarCrasher Backblades",
            'Mode: [select] only\nShould the bot buy "StarCrasher Backblades" ?',
            false,
        ),
        option.bool(
            "54445",
            "StarCrasher Lightblade",
            'Mode: [select] only\nShould the bot buy "StarCrasher Lightblade" ?',
            false,
        ),
        option.bool(
            "54446",
            "StarCrasher Lightblades",
            'Mode: [select] only\nShould the bot buy "StarCrasher Lightblades" ?',
            false,
        ),
        option.bool("54455", "Parodian Guard", 'Mode: [select] only\nShould the bot buy "Parodian Guard" ?', false),
        option.bool(
            "54456",
            "Parodian Guard Helm",
            'Mode: [select] only\nShould the bot buy "Parodian Guard Helm" ?',
            false,
        ),
        option.bool(
            "54457",
            "Parodian Guard's Sheathed Daggers",
            'Mode: [select] only\nShould the bot buy "Parodian Guard\'s Sheathed Daggers" ?',
            false,
        ),
        option.bool(
            "54458",
            "Parodian Guard's Sheathed Polearm",
            'Mode: [select] only\nShould the bot buy "Parodian Guard\'s Sheathed Polearm" ?',
            false,
        ),
        option.bool(
            "54459",
            "Parodian Guard's Polearm",
            'Mode: [select] only\nShould the bot buy "Parodian Guard\'s Polearm" ?',
            false,
        ),
        option.bool(
            "54460",
            "Parodian Guard's Daggers",
            'Mode: [select] only\nShould the bot buy "Parodian Guard\'s Daggers" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: MawasStandMerge.select,
});

export default function main(): void {
    const script = new MawasStandMerge();
    Core.bankingBlackList.push("Furry Egg", "Woopee");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
