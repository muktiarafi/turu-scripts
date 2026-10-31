/*
name: DeepTunnelMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/DeepTunnelMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreNation } from "../../nation/CoreNation";
import { CoreQOM } from "../../story/queenofmonsters/CoreQoM";

const Adv = new CoreAdvanced();
const QOM = new CoreQOM();
const Nation = new CoreNation();

export class DeepTunnelMerge {
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
                case "Pure Monstrite":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop("Queen's Follower Slain");
                    Core.registerQuests(8095);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("transformation", "Enter", "Spawn", "*", "Queen's Follower Slain", 100, {
                            isTemp: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Unidentified 23":
                    Core.farmingLogger(req.name, quant);
                    Nation.theAssistant(req.name, quant);
                    break;
                case "Blood Gem of the Archfiend":
                    Core.farmingLogger(req.name, quant);
                    Nation.farmBloodGem(quant);
                    break;
            }
        };
        QOM.theQueensSecrets(true);
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("transformation", 2002, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "61090",
            "Chaorrupted Sorcerer",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Sorcerer" ?',
            false,
        ),
        option.bool(
            "61089",
            "Chaorrupted Sorcerer's Staff",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Sorcerer\'s Staff" ?',
            false,
        ),
        option.bool(
            "61115",
            "Chaotic Sorcerer's Staff",
            'Mode: [select] only\nShould the bot buy "Chaotic Sorcerer\'s Staff" ?',
            false,
        ),
        option.bool(
            "61091",
            "Chaorrupted Sorcerer's Hood",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Sorcerer\'s Hood" ?',
            false,
        ),
        option.bool(
            "61092",
            "Chaorrupted Sorcerer's Spikes",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Sorcerer\'s Spikes" ?',
            false,
        ),
        option.bool(
            "61093",
            "Chaorrupted Sorcerer's Headdress",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Sorcerer\'s Headdress" ?',
            false,
        ),
        option.bool(
            "61094",
            "Chaorrupted Sorcerer's Rise",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Sorcerer\'s Rise" ?',
            false,
        ),
        option.bool(
            "61095",
            "Chaorrupted Sorcerer's Ascension",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Sorcerer\'s Ascension" ?',
            false,
        ),
        option.bool(
            "61096",
            "Chaorrupted Sorcerer's Rune",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Sorcerer\'s Rune" ?',
            false,
        ),
        option.bool("59223", "Void Sorcerer", 'Mode: [select] only\nShould the bot buy "Void Sorcerer" ?', false),
        option.bool(
            "59222",
            "Void Sorcerer's Staff",
            'Mode: [select] only\nShould the bot buy "Void Sorcerer\'s Staff" ?',
            false,
        ),
        option.bool(
            "59224",
            "Void Sorcerer's Hood",
            'Mode: [select] only\nShould the bot buy "Void Sorcerer\'s Hood" ?',
            false,
        ),
        option.bool(
            "59225",
            "Void Sorcerer's Spikes",
            'Mode: [select] only\nShould the bot buy "Void Sorcerer\'s Spikes" ?',
            false,
        ),
        option.bool(
            "59226",
            "Void Sorcerer's Headdress",
            'Mode: [select] only\nShould the bot buy "Void Sorcerer\'s Headdress" ?',
            false,
        ),
        option.bool(
            "59227",
            "Void Sorcerer's Rise",
            'Mode: [select] only\nShould the bot buy "Void Sorcerer\'s Rise" ?',
            false,
        ),
        option.bool(
            "59228",
            "Void Sorcerer's Ascension",
            'Mode: [select] only\nShould the bot buy "Void Sorcerer\'s Ascension" ?',
            false,
        ),
        option.bool(
            "59229",
            "Void Sorcerer's Rune",
            'Mode: [select] only\nShould the bot buy "Void Sorcerer\'s Rune" ?',
            false,
        ),
        option.bool(
            "59217",
            "Chaorrupted Usurper",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Usurper" ?',
            false,
        ),
        option.bool(
            "59218",
            "Chaorrupted Usurper's Crown",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Usurper\'s Crown" ?',
            false,
        ),
        option.bool(
            "59219",
            "Chaorrupted Usurper's Headdress",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Usurper\'s Headdress" ?',
            false,
        ),
        option.bool(
            "59220",
            "Chaorrupted Usurper's Spiked Helm",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Usurper\'s Spiked Helm" ?',
            false,
        ),
        option.bool(
            "59221",
            "Chaorrupted Usurper's Phantasm",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Usurper\'s Phantasm" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DeepTunnelMerge.select,
});

export default function main(): void {
    const script = new DeepTunnelMerge();
    Core.bankingBlackList.push("Pure Monstrite", "Unidentified 23", "Blood Gem of the Archfiend");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
