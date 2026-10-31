/*
name: BrightshadowMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/BrightshadowMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreSoC } from "../../story/shadowsofchaos/CoreSoC";

const Adv = new CoreAdvanced();
const SoC = new CoreSoC();

export class BrightshadowMerge {
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
                case "Shadow BeastMaster":

                case "Shadow BeastMaster Bow":

                case "Shadow BeastMaster Hood":

                case "Shadow BeastMaster Hood + Mask":

                case "Shadow BeastMaster Knuckle":

                case "Shadow BeastMaster Quiver":

                case "Shadow BeastMaster's Beard":

                case "Shadow BeastMaster's Locks":

                case "Shadow BeastMaster's Shag":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("brightshadow", "Gravelyn the Good", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Venerated Essence":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7738);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("brightshadow", "Brightfall Light", "BrightFall Light", 5);
                        Core.huntMonster("brightshadow", "Brightfall Guard", "BrightFall Dark", 10);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "ShadowFlame Glaive":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("chaosamulet", "Shadowflame Warrior", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "ShadowFlame Spellsword":

                case "ShadowFlame Spellsword's Sheathed Blade":

                case "ShadowFlame Spellsword's Hip Blade":

                case "ShadowFlame SpellSword's Blade":

                case "ShadowFlame SpellSword's Daggers":

                case "ShadowFlame SpellSword's Tome":

                case "SpellSword's Flame Blade":

                case "SpellSword's Reversed Daggers":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("brightchaos", "Blight", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Blight Essence":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(7750);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("brightchaos", "Blight", "Blight Subdued", 4);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        SoC.brightShadow();
        SoC.brightChaos();
        Adv.startBuyAllMerge("brightshadow", 1921, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "56461",
            "Eternal BeastMaster",
            'Mode: [select] only\nShould the bot buy "Eternal BeastMaster" ?',
            false,
        ),
        option.bool(
            "56462",
            "Eternal BeastMaster's Locks",
            'Mode: [select] only\nShould the bot buy "Eternal BeastMaster\'s Locks" ?',
            false,
        ),
        option.bool(
            "56463",
            "Eternal BeastMaster's Shag",
            'Mode: [select] only\nShould the bot buy "Eternal BeastMaster\'s Shag" ?',
            false,
        ),
        option.bool(
            "56464",
            "Eternal Beastmaster's Beard",
            'Mode: [select] only\nShould the bot buy "Eternal Beastmaster\'s Beard" ?',
            false,
        ),
        option.bool(
            "56465",
            "Eternal BeastMaster's Bow",
            'Mode: [select] only\nShould the bot buy "Eternal BeastMaster\'s Bow" ?',
            false,
        ),
        option.bool(
            "56466",
            "Eternal BeastMaster's Knuckle",
            'Mode: [select] only\nShould the bot buy "Eternal BeastMaster\'s Knuckle" ?',
            false,
        ),
        option.bool(
            "56467",
            "Eternal BeastMaster's Glaive",
            'Mode: [select] only\nShould the bot buy "Eternal BeastMaster\'s Glaive" ?',
            false,
        ),
        option.bool(
            "57089",
            "Eternal BeastMaster Hood",
            'Mode: [select] only\nShould the bot buy "Eternal BeastMaster Hood" ?',
            false,
        ),
        option.bool(
            "57090",
            "Eternal BeastMaster Hood + Mask",
            'Mode: [select] only\nShould the bot buy "Eternal BeastMaster Hood + Mask" ?',
            false,
        ),
        option.bool(
            "57094",
            "Eternal BeastMaster Quiver",
            'Mode: [select] only\nShould the bot buy "Eternal BeastMaster Quiver" ?',
            false,
        ),
        option.bool(
            "56269",
            "Enchanted Spellsword",
            'Mode: [select] only\nShould the bot buy "Enchanted Spellsword" ?',
            false,
        ),
        option.bool(
            "56280",
            "Enchanted Spellsword's Sheathed Blade",
            'Mode: [select] only\nShould the bot buy "Enchanted Spellsword\'s Sheathed Blade" ?',
            false,
        ),
        option.bool(
            "56281",
            "Enchanted Spellsword's Hip Blade",
            'Mode: [select] only\nShould the bot buy "Enchanted Spellsword\'s Hip Blade" ?',
            false,
        ),
        option.bool(
            "56284",
            "Enchanted SpellSword's Flame Blade",
            'Mode: [select] only\nShould the bot buy "Enchanted SpellSword\'s Flame Blade" ?',
            false,
        ),
        option.bool(
            "56285",
            "Enchanted SpellSword's Blade",
            'Mode: [select] only\nShould the bot buy "Enchanted SpellSword\'s Blade" ?',
            false,
        ),
        option.bool(
            "56288",
            "Enchanted SpellSword's Daggers",
            'Mode: [select] only\nShould the bot buy "Enchanted SpellSword\'s Daggers" ?',
            false,
        ),
        option.bool(
            "56289",
            "Enchanted Reversed Daggers",
            'Mode: [select] only\nShould the bot buy "Enchanted Reversed Daggers" ?',
            false,
        ),
        option.bool(
            "56291",
            "Enchanted SpellSword's Tome",
            'Mode: [select] only\nShould the bot buy "Enchanted SpellSword\'s Tome" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BrightshadowMerge.select,
});

export default function main(): void {
    const script = new BrightshadowMerge();
    Core.bankingBlackList.push(
        "Shadow BeastMaster",
        "Venerated Essence",
        "Shadow BeastMaster's Locks",
        "Shadow BeastMaster's Shag",
        "Shadow BeastMaster's Beard",
        "Shadow BeastMaster Bow",
        "Shadow BeastMaster Knuckle",
        "ShadowFlame Glaive",
        "Shadow BeastMaster Hood",
        "Shadow BeastMaster Hood + Mask",
        "Shadow BeastMaster Quiver",
        "ShadowFlame Spellsword",
        "Blight Essence",
        "ShadowFlame Spellsword's Sheathed Blade",
        "ShadowFlame Spellsword's Hip Blade",
        "SpellSword's Flame Blade",
        "ShadowFlame SpellSword's Blade",
        "ShadowFlame SpellSword's Daggers",
        "SpellSword's Reversed Daggers",
        "ShadowFlame SpellSword's Tome ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
