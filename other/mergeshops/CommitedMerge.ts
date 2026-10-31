/*
name: CommitedMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/CommitedMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { Asylum } from "../../story/Asylum";

const Adv = new CoreAdvanced();
const asylum = new Asylum();

export class CommitedMerge {
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
                case "Crawler Leg":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("mirrormaze", "Doom Crawler", req.name, quant, { isTemp: false });
                    break;
                case "Zombie Dragon Scale":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("mirrormaze", "Zombie Dragon", req.name, quant, { isTemp: false });
                    break;
                case "De'Sawed's Stinger":
                    Core.equipClass(ClassType.Solo);
                    Core.killMonster("catacombs", "Boss2", "Left", "Dr. De'Sawed", req.name, quant, { isTemp: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        asylum.storyLine();
        Adv.startBuyAllMerge("asylum", 506, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("14525", "Mad Doctor", 'Mode: [select] only\nShould the bot buy "Mad Doctor" ?', false),
        option.bool("14534", "Scorpion Blades", 'Mode: [select] only\nShould the bot buy "Scorpion Blades" ?', false),
        option.bool(
            "14536",
            "Mask of the Scorpion",
            'Mode: [select] only\nShould the bot buy "Mask of the Scorpion" ?',
            false,
        ),
        option.bool(
            "14538",
            "Staff of the Scorpion",
            'Mode: [select] only\nShould the bot buy "Staff of the Scorpion" ?',
            false,
        ),
        option.bool("14539", "Scorpion Scythe", 'Mode: [select] only\nShould the bot buy "Scorpion Scythe" ?', false),
        option.bool("14545", "Bandaged Face", 'Mode: [select] only\nShould the bot buy "Bandaged Face" ?', false),
        option.bool(
            "14549",
            "Mad Surgeon's Mask",
            'Mode: [select] only\nShould the bot buy "Mad Surgeon\'s Mask" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CommitedMerge.select,
});

export default function main(): void {
    const script = new CommitedMerge();
    Core.bankingBlackList.push("Crawler Leg", "Zombie Dragon Scale", "De'Sawed's Stinger ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
