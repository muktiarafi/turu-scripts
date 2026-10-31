/*
name: SpiritHunter Merge
description: This bot will farm the items belonging to the selected mode for the SpiritHunter Merge [375] in /bludrut
tags: spirithunter, merge, bludrut, katana, halberd, spirithunters, reaper, back, scythe
*/
// Port of Scripts/Other/MergeShops/SpiritHunterMerge[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { Bludrut } from "../../story/Bludrut";

const Adv = new CoreAdvanced();
const Blud = new Bludrut();

export class SpiritHunterMerge {
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
                case "Spirit Ward Sigil":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(1695);
                    // Spirit Ward Sigil (1695)
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("bludrut4", "Groglurk", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Screamwave":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(1694);
                    // Screamwave (1694)
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("bludrut3", "Siren", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Ectoamber":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(1693);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("bludrut", "Rattlebones", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        if (!Core.isMember) {
            Core.logger("This script requires you to be a member", undefined, { messageBox: true, stopBot: true });
            return;
        }
        Blud.storyLine();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("bludrut", 375, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "11155",
            "SpiritHunter Armor",
            'Mode: [select] only\nShould the bot buy "SpiritHunter Armor" ?',
            false,
        ),
        option.bool(
            "11156",
            "SpiritHunter Mask",
            'Mode: [select] only\nShould the bot buy "SpiritHunter Mask" ?',
            false,
        ),
        option.bool(
            "11157",
            "SpiritHunter Blades",
            'Mode: [select] only\nShould the bot buy "SpiritHunter Blades" ?',
            false,
        ),
        option.bool(
            "11158",
            "SpiritHunter Katana",
            'Mode: [select] only\nShould the bot buy "SpiritHunter Katana" ?',
            false,
        ),
        option.bool(
            "11159",
            "SpiritHunter Halberd",
            'Mode: [select] only\nShould the bot buy "SpiritHunter Halberd" ?',
            false,
        ),
        option.bool(
            "11160",
            "SpiritHunter's Reaper",
            'Mode: [select] only\nShould the bot buy "SpiritHunter\'s Reaper" ?',
            false,
        ),
        option.bool(
            "11161",
            "SpiritHunter Back Scythe",
            'Mode: [select] only\nShould the bot buy "SpiritHunter Back Scythe" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SpiritHunterMerge.select,
});

export default function main(): void {
    const script = new SpiritHunterMerge();
    Core.bankingBlackList.push("Spirit Ward Sigil", "Screamwave", "Ectoamber");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
