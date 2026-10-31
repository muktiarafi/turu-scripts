/*
name: Fire Invasion Merge
description: This bot will farm the items from the Fire Invasion Merge shop in /fireinvasion
tags: fire, invasion, merge, shadow, fire, trophy, tyndarius, ruby, sapphire, spellblade, fighting
*/
// Port of Scripts/ShadowsOfWar/MergeShops/FireInvasionMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreSoW } from "../../story/shadowsofwar/CoreSoW";

const Adv = new CoreAdvanced();
const SOW = new CoreSoW();

export class FireInvasionMerge {
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
                case "ShadowFire Trophy":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8192);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("fireinvasion", "Living Shadowflame", "ShadowFlame Tag", 15, { log: false });
                        Core.huntMonster("fireinvasion", "Shadefire Cavalry", "Corrupted Badge", 3, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        SOW.tyndarius();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("fireinvasion", 2031, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("61694", "Ruby SpellBlade", 'Mode: [select] only\nShould the bot buy "Ruby SpellBlade" ?', false),
        option.bool("61695", "Ruby Hat + Bangs", 'Mode: [select] only\nShould the bot buy "Ruby Hat + Bangs" ?', false),
        option.bool("61696", "Ruby Hat + Hair", 'Mode: [select] only\nShould the bot buy "Ruby Hat + Hair" ?', false),
        option.bool(
            "61697",
            "Ruby Spell Shroud",
            'Mode: [select] only\nShould the bot buy "Ruby Spell Shroud" ?',
            false,
        ),
        option.bool(
            "61698",
            "Burning Ruby Blade",
            'Mode: [select] only\nShould the bot buy "Burning Ruby Blade" ?',
            false,
        ),
        option.bool(
            "61699",
            "Dual Burning Ruby Blades",
            'Mode: [select] only\nShould the bot buy "Dual Burning Ruby Blades" ?',
            false,
        ),
        option.bool(
            "61700",
            "Burning Ruby BattleGear",
            'Mode: [select] only\nShould the bot buy "Burning Ruby BattleGear" ?',
            false,
        ),
        option.bool(
            "61701",
            "Burning Blade Pixie",
            'Mode: [select] only\nShould the bot buy "Burning Blade Pixie" ?',
            false,
        ),
        option.bool(
            "61686",
            "Sapphire SpellBlade",
            'Mode: [select] only\nShould the bot buy "Sapphire SpellBlade" ?',
            false,
        ),
        option.bool(
            "61687",
            "Sapphire Hat + Bangs",
            'Mode: [select] only\nShould the bot buy "Sapphire Hat + Bangs" ?',
            false,
        ),
        option.bool(
            "61688",
            "Sapphire Hat + Hair",
            'Mode: [select] only\nShould the bot buy "Sapphire Hat + Hair" ?',
            false,
        ),
        option.bool(
            "61689",
            "Burning Sapphire Blade",
            'Mode: [select] only\nShould the bot buy "Burning Sapphire Blade" ?',
            false,
        ),
        option.bool(
            "61690",
            "Dual Burning Sapphire Blades",
            'Mode: [select] only\nShould the bot buy "Dual Burning Sapphire Blades" ?',
            false,
        ),
        option.bool(
            "61691",
            "Burning Sapphire BattleGear",
            'Mode: [select] only\nShould the bot buy "Burning Sapphire BattleGear" ?',
            false,
        ),
        option.bool(
            "61692",
            "Sapphire Flame Pixie",
            'Mode: [select] only\nShould the bot buy "Sapphire Flame Pixie" ?',
            false,
        ),
        option.bool(
            "61693",
            "Sapphire Spell Shroud",
            'Mode: [select] only\nShould the bot buy "Sapphire Spell Shroud" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FireInvasionMerge.select,
});

export default function main(): void {
    const script = new FireInvasionMerge();
    Core.bankingBlackList.push("ShadowFire Trophy");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
