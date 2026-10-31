/*
name: ShinkansenMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/ShinkansenMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { Shinkansen } from "../../story/Shinkansen";

const Adv = new CoreAdvanced();
const Shink = new Shinkansen();

export class ShinkansenMerge {
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
                case "Ninjo":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Shink.storyline();
                    Core.registerQuests(8124);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("Shinkansen", "Crystallis Soldier", "Favor Done", 30);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("shinkansen", 2005, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "61529",
            "Purified Crystallis Soldier",
            'Mode: [select] only\nShould the bot buy "Purified Crystallis Soldier" ?',
            false,
        ),
        option.bool("61547", "Apa's Outfit", 'Mode: [select] only\nShould the bot buy "Apa\'s Outfit" ?', false),
        option.bool("61555", "Eta's Outfit", 'Mode: [select] only\nShould the bot buy "Eta\'s Outfit" ?', false),
        option.bool(
            "61536",
            "Purified Crystallis Soldier's Locks + Hat",
            'Mode: [select] only\nShould the bot buy "Purified Crystallis Soldier\'s Locks + Hat" ?',
            false,
        ),
        option.bool(
            "61537",
            "Purified Crystallis Soldier's Hat",
            'Mode: [select] only\nShould the bot buy "Purified Crystallis Soldier\'s Hat" ?',
            false,
        ),
        option.bool(
            "61538",
            "Purified Crystallis Soldier's Battle Gear",
            'Mode: [select] only\nShould the bot buy "Purified Crystallis Soldier\'s Battle Gear" ?',
            false,
        ),
        option.bool(
            "61539",
            "Purified Crystallis Soldier's Hat + Glasses",
            'Mode: [select] only\nShould the bot buy "Purified Crystallis Soldier\'s Hat + Glasses" ?',
            false,
        ),
        option.bool(
            "61548",
            "Apa's Morph + Locks",
            'Mode: [select] only\nShould the bot buy "Apa\'s Morph + Locks" ?',
            false,
        ),
        option.bool("61549", "Apa's Locks", 'Mode: [select] only\nShould the bot buy "Apa\'s Locks" ?', false),
        option.bool("61556", "Eta's Morph", 'Mode: [select] only\nShould the bot buy "Eta\'s Morph" ?', false),
        option.bool("61557", "Eta's Hairstyle", 'Mode: [select] only\nShould the bot buy "Eta\'s Hairstyle" ?', false),
        option.bool(
            "61541",
            "Purified Crystallis Soldier's Cape",
            'Mode: [select] only\nShould the bot buy "Purified Crystallis Soldier\'s Cape" ?',
            false,
        ),
        option.bool(
            "61542",
            "Crystallis Soldier's Hologram",
            'Mode: [select] only\nShould the bot buy "Crystallis Soldier\'s Hologram" ?',
            false,
        ),
        option.bool(
            "61550",
            "Apa's Lightblades",
            'Mode: [select] only\nShould the bot buy "Apa\'s Lightblades" ?',
            false,
        ),
        option.bool(
            "61558",
            "The First Saint's Halo",
            'Mode: [select] only\nShould the bot buy "The First Saint\'s Halo" ?',
            false,
        ),
        option.bool(
            "61544",
            "Purified Crystallis Soldier's Cannon",
            'Mode: [select] only\nShould the bot buy "Purified Crystallis Soldier\'s Cannon" ?',
            false,
        ),
        option.bool(
            "61546",
            "Purified Crystallis Soldier's Gun + Shield",
            'Mode: [select] only\nShould the bot buy "Purified Crystallis Soldier\'s Gun + Shield" ?',
            false,
        ),
        option.bool("61551", "Apa's Grace", 'Mode: [select] only\nShould the bot buy "Apa\'s Grace" ?', false),
        option.bool("61552", "Purified Malice", 'Mode: [select] only\nShould the bot buy "Purified Malice" ?', false),
        option.bool(
            "61553",
            "Sheathed Purified Malice",
            'Mode: [select] only\nShould the bot buy "Sheathed Purified Malice" ?',
            false,
        ),
        option.bool("61559", "Tarnished Grace", 'Mode: [select] only\nShould the bot buy "Tarnished Grace" ?', false),
        option.bool("61560", "Eta's Malice", 'Mode: [select] only\nShould the bot buy "Eta\'s Malice" ?', false),
        option.bool(
            "61561",
            "Sheathed Eta's Malice",
            'Mode: [select] only\nShould the bot buy "Sheathed Eta\'s Malice" ?',
            false,
        ),
        option.bool(
            "61554",
            "Apa's Grace Battlepet",
            'Mode: [select] only\nShould the bot buy "Apa\'s Grace Battlepet" ?',
            false,
        ),
        option.bool(
            "61562",
            "Eta's Malice Battlepet",
            'Mode: [select] only\nShould the bot buy "Eta\'s Malice Battlepet" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ShinkansenMerge.select,
});

export default function main(): void {
    const script = new ShinkansenMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
