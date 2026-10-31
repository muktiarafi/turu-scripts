/*
name: Inevitabilis Merge
description: Farms the required materials and buys the selected item/mode from the merge shop in /timeinn
tags: timeinn, merge, eternal scale, shop
*/
// Port of Scripts/Other/MergeShops/InevitabilisMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class InevitabilisMerge {
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
                case "Eternal Scale":
                    Core.farmingLogger(req.name, quant);
                    bot.quests.updateQuest(2804);
                    Core.registerQuests(9175);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("venomvaults", "Manticore", "Manticore Stinger", 3);
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("worldscore", "Elemental Attempt", "Attempt's Essence", 3);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("timeinn", 2249, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("73247", `Warrior of Time`, 'Mode: [select] only\nShould the bot buy "Warrior of Time" ?', false),
        option.bool(
            "73248",
            `Warrior of Time's Helm`,
            'Mode: [select] only\nShould the bot buy "Warrior of Time\'s Helm" ?',
            false,
        ),
        option.bool(
            "73249",
            `Warrior of Time's Wrap`,
            'Mode: [select] only\nShould the bot buy "Warrior of Time\'s Wrap" ?',
            false,
        ),
        option.bool(
            "73250",
            `Warrior of Time's Wrap + Blade`,
            'Mode: [select] only\nShould the bot buy "Warrior of Time\'s Wrap + Blade" ?',
            false,
        ),
        option.bool(
            "73251",
            `Warrior of Time's Blade Cape`,
            'Mode: [select] only\nShould the bot buy "Warrior of Time\'s Blade Cape" ?',
            false,
        ),
        option.bool("73253", `Rogue of Time`, 'Mode: [select] only\nShould the bot buy "Rogue of Time" ?', false),
        option.bool(
            "73254",
            `Rogue of Time's Mask`,
            'Mode: [select] only\nShould the bot buy "Rogue of Time\'s Mask" ?',
            false,
        ),
        option.bool(
            "73255",
            `Rogue of Time's Hair`,
            'Mode: [select] only\nShould the bot buy "Rogue of Time\'s Hair" ?',
            false,
        ),
        option.bool(
            "73256",
            `Rogue of Time's Quiver`,
            'Mode: [select] only\nShould the bot buy "Rogue of Time\'s Quiver" ?',
            false,
        ),
        option.bool(
            "73257",
            `Rogue of Time's Battle Gear`,
            'Mode: [select] only\nShould the bot buy "Rogue of Time\'s Battle Gear" ?',
            false,
        ),
        option.bool(
            "73258",
            `Rogue of Time's Dirk`,
            'Mode: [select] only\nShould the bot buy "Rogue of Time\'s Dirk" ?',
            false,
        ),
        option.bool(
            "73259",
            `Rogue of Time's Daggers`,
            'Mode: [select] only\nShould the bot buy "Rogue of Time\'s Daggers" ?',
            false,
        ),
        option.bool(
            "73260",
            `Rogue of Time's Bow`,
            'Mode: [select] only\nShould the bot buy "Rogue of Time\'s Bow" ?',
            false,
        ),
        option.bool("73261", `Mage of Time`, 'Mode: [select] only\nShould the bot buy "Mage of Time" ?', false),
        option.bool(
            "73262",
            `Mage of Time's Hat`,
            'Mode: [select] only\nShould the bot buy "Mage of Time\'s Hat" ?',
            false,
        ),
        option.bool(
            "73263",
            `Mage of Time's Tome Cape`,
            'Mode: [select] only\nShould the bot buy "Mage of Time\'s Tome Cape" ?',
            false,
        ),
        option.bool(
            "73264",
            `Mage of Time's Temporal Rune`,
            'Mode: [select] only\nShould the bot buy "Mage of Time\'s Temporal Rune" ?',
            false,
        ),
        option.bool(
            "73265",
            `Mage of Time's Tome Pet`,
            'Mode: [select] only\nShould the bot buy "Mage of Time\'s Tome Pet" ?',
            false,
        ),
        option.bool(
            "73267",
            `Mage of Time's Staff`,
            'Mode: [select] only\nShould the bot buy "Mage of Time\'s Staff" ?',
            false,
        ),
        option.bool("73268", `Healer of Time`, 'Mode: [select] only\nShould the bot buy "Healer of Time" ?', false),
        option.bool(
            "73269",
            `Healer of Time's Hood`,
            'Mode: [select] only\nShould the bot buy "Healer of Time\'s Hood" ?',
            false,
        ),
        option.bool(
            "73270",
            `Healer of Time's Hourglass Cape`,
            'Mode: [select] only\nShould the bot buy "Healer of Time\'s Hourglass Cape" ?',
            false,
        ),
        option.bool(
            "73271",
            `Healer of Time's Staff`,
            'Mode: [select] only\nShould the bot buy "Healer of Time\'s Staff" ?',
            false,
        ),
        option.bool(
            "73272",
            `Healer of Time's Compendium`,
            'Mode: [select] only\nShould the bot buy "Healer of Time\'s Compendium" ?',
            false,
        ),
        option.bool(
            "73273",
            `Healer of Time's Battle Gear`,
            'Mode: [select] only\nShould the bot buy "Healer of Time\'s Battle Gear" ?',
            false,
        ),
        option.bool(
            "77143",
            `Warrior of Time's Blades`,
            'Mode: [select] only\nShould the bot buy "Warrior of Time\'s Blades" ?',
            false,
        ),
        option.bool(
            "73252",
            `Warrior of Time's Blade`,
            'Mode: [select] only\nShould the bot buy "Warrior of Time\'s Blade" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: InevitabilisMerge.select,
});

export default function main(): void {
    const script = new InevitabilisMerge();
    Core.bankingBlackList.push("Eternal Scale");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
