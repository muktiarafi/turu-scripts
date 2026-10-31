/*
name: Archive of Time Merge
description: This bot will farm the items belonging to the selected mode for the Archive of Time Merge [1347] in /cathedral
tags: archive, of, time, merge, cathedral, aegis, guardian, savior, divine, guardians, scythe, wings
*/
// Port of Scripts/Seasonal/NewYear/ArchiveofTimeMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ArchiveofTimeMerge {
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
                case "Aegis Armor":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("cathedral", "Skeletal Warrior", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Aegis Robe":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("cathedral", "Infernal Knight", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Aegis Ward":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("cathedral", "Pactagonal Knight", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Blessed Metal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("cathedral", "Corrupted Sentry", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Golden Faceplate":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("cathedral", "Flying Pieball", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Data Scroll":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("cathedral", "Data Glitch", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Time Key":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("cathedral", "Incarnation of Time", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("cathedral", 1347, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("37483", "Aegis Guardian", 'Mode: [select] only\nShould the bot buy "Aegis Guardian" ?', false),
        option.bool("37489", "Savior Of Aegis", 'Mode: [select] only\nShould the bot buy "Savior Of Aegis" ?', false),
        option.bool(
            "37494",
            "Divine Guardian Of Aegis",
            'Mode: [select] only\nShould the bot buy "Divine Guardian Of Aegis" ?',
            false,
        ),
        option.bool(
            "37495",
            "Divine Guardian's Scythe",
            'Mode: [select] only\nShould the bot buy "Divine Guardian\'s Scythe" ?',
            false,
        ),
        option.bool(
            "37496",
            "Divine Guardian Wings",
            'Mode: [select] only\nShould the bot buy "Divine Guardian Wings" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ArchiveofTimeMerge.select,
});

export default function main(): void {
    const script = new ArchiveofTimeMerge();
    Core.bankingBlackList.push(
        "Aegis Armor",
        "Aegis Robe",
        "Aegis Ward",
        "Blessed Metal",
        "Golden Faceplate",
        "Data Scroll",
        "Time Key",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
