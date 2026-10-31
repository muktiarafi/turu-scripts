/*
name: Astravia Judgement Merge
description: Astravia Judgement Merge
tags: astravia judgement, merge, mergeshop
*/
// Port of Scripts/Darkon/MergeShops/AstraviaJudgementMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";

const Adv = new CoreAdvanced();
const Darkon = new CoreDarkon();

export class AstraviaJudgeMerge {
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
                case "A Melody":
                    Darkon.aMelody(quant);
                    break;
                case "Re's Party Attire":
                    Core.huntMonster("astraviajudge", "La", req.name, quant);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("astraviajudge", 2065, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("65302", "Mi's Attire", 'Mode: [select] only\nShould the bot buy "Mi\'s Attire" ?', false),
        option.bool(
            "65303",
            "Mi's Sleeveless Attire",
            'Mode: [select] only\nShould the bot buy "Mi\'s Sleeveless Attire" ?',
            false,
        ),
        option.bool("65304", "Mi's Hair", 'Mode: [select] only\nShould the bot buy "Mi\'s Hair" ?', false),
        option.bool("65305", "Mi's Antennae", 'Mode: [select] only\nShould the bot buy "Mi\'s Antennae" ?', false),
        option.bool("65306", "Mi's Morph", 'Mode: [select] only\nShould the bot buy "Mi\'s Morph" ?', false),
        option.bool("66332", "Re's Party Arms", 'Mode: [select] only\nShould the bot buy "Re\'s Party Arms" ?', false),
        option.bool(
            "66334",
            "Astravian Officer's White Hat",
            'Mode: [select] only\nShould the bot buy "Astravian Officer\'s White Hat" ?',
            false,
        ),
        option.bool(
            "66335",
            "Astravian Officer's White Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Astravian Officer\'s White Hat + Locks" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AstraviaJudgeMerge.select,
});

export default function main(): void {
    const script = new AstraviaJudgeMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
