/*
name: Battle Gems Game Gear Merge
description: This bot will farm the items belonging to the selected mode for the Battle Gems Game Gear Merge [844] in /luck
tags: battle, gems, game, gear, merge, luck, hyena, troll, snowwolf, minoootaur, ninetail, gorillaphant, anubus, deathknight, dimetrodon, werewolf, citrine, poleaxe, ruby, amethyst, sapphire, emerald, artix, bobble, cysero, gravelyn, golden, metal, necro, skull, hunter, explorer, windy
*/
// Port of Scripts/Seasonal/LuckyDay/BattleGemsGameGearMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class BattleGemsGameGearMerge {
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
                case "Golden Ticket":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.join("luck");
                        Core.sendPackets("%xt%zm%getMapItem%10173%101%");
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("luck")) {
            return;
        }

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("luck", 844, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "34308",
            "Battle Gems Hyena",
            'Mode: [select] only\nShould the bot buy "Battle Gems Hyena" ?',
            false,
        ),
        option.bool(
            "34309",
            "Battle Gems Troll",
            'Mode: [select] only\nShould the bot buy "Battle Gems Troll" ?',
            false,
        ),
        option.bool(
            "34310",
            "Battle Gems SnowWolf",
            'Mode: [select] only\nShould the bot buy "Battle Gems SnowWolf" ?',
            false,
        ),
        option.bool(
            "34311",
            "Battle Gems Minoootaur",
            'Mode: [select] only\nShould the bot buy "Battle Gems Minoootaur" ?',
            false,
        ),
        option.bool(
            "34312",
            "Battle Gems Ninetail",
            'Mode: [select] only\nShould the bot buy "Battle Gems Ninetail" ?',
            false,
        ),
        option.bool(
            "34313",
            "Battle Gems Gorillaphant",
            'Mode: [select] only\nShould the bot buy "Battle Gems Gorillaphant" ?',
            false,
        ),
        option.bool(
            "34314",
            "Battle Gems Anubus",
            'Mode: [select] only\nShould the bot buy "Battle Gems Anubus" ?',
            false,
        ),
        option.bool(
            "34315",
            "Battle Gems DeathKnight",
            'Mode: [select] only\nShould the bot buy "Battle Gems DeathKnight" ?',
            false,
        ),
        option.bool(
            "34316",
            "Battle Gems Dimetrodon",
            'Mode: [select] only\nShould the bot buy "Battle Gems Dimetrodon" ?',
            false,
        ),
        option.bool(
            "34317",
            "Battle Gems Werewolf",
            'Mode: [select] only\nShould the bot buy "Battle Gems Werewolf" ?',
            false,
        ),
        option.bool("23200", "Citrine Poleaxe", 'Mode: [select] only\nShould the bot buy "Citrine Poleaxe" ?', false),
        option.bool("23201", "Ruby Poleaxe", 'Mode: [select] only\nShould the bot buy "Ruby Poleaxe" ?', false),
        option.bool("23202", "Amethyst Poleaxe", 'Mode: [select] only\nShould the bot buy "Amethyst Poleaxe" ?', false),
        option.bool("23203", "Sapphire Poleaxe", 'Mode: [select] only\nShould the bot buy "Sapphire Poleaxe" ?', false),
        option.bool("23204", "Emerald Poleaxe", 'Mode: [select] only\nShould the bot buy "Emerald Poleaxe" ?', false),
        option.bool("23205", "Citrine Axe", 'Mode: [select] only\nShould the bot buy "Citrine Axe" ?', false),
        option.bool("23206", "Ruby Axe", 'Mode: [select] only\nShould the bot buy "Ruby Axe" ?', false),
        option.bool("23207", "Amethyst Axe", 'Mode: [select] only\nShould the bot buy "Amethyst Axe" ?', false),
        option.bool("23208", "Sapphire Axe", 'Mode: [select] only\nShould the bot buy "Sapphire Axe" ?', false),
        option.bool("23288", "Emerald Axe", 'Mode: [select] only\nShould the bot buy "Emerald Axe" ?', false),
        option.bool(
            "92613",
            "Battle Gems Artix Bobble Helm",
            'Mode: [select] only\nShould the bot buy "Battle Gems Artix Bobble Helm" ?',
            false,
        ),
        option.bool(
            "92614",
            "Battle Gems Cysero Bobble Helm",
            'Mode: [select] only\nShould the bot buy "Battle Gems Cysero Bobble Helm" ?',
            false,
        ),
        option.bool(
            "92615",
            "Battle Gems Gravelyn Bobble Helm",
            'Mode: [select] only\nShould the bot buy "Battle Gems Gravelyn Bobble Helm" ?',
            false,
        ),
        option.bool(
            "92616",
            "Battle Gems Golden Bobble Helm",
            'Mode: [select] only\nShould the bot buy "Battle Gems Golden Bobble Helm" ?',
            false,
        ),
        option.bool(
            "92617",
            "Battle Gems Metal Bobble Helm",
            'Mode: [select] only\nShould the bot buy "Battle Gems Metal Bobble Helm" ?',
            false,
        ),
        option.bool(
            "92618",
            "Battle Gems Necro Bobble Helm",
            'Mode: [select] only\nShould the bot buy "Battle Gems Necro Bobble Helm" ?',
            false,
        ),
        option.bool(
            "92619",
            "Battle Gems Skull Bobble Helm",
            'Mode: [select] only\nShould the bot buy "Battle Gems Skull Bobble Helm" ?',
            false,
        ),
        option.bool(
            "92620",
            "Battle Gems Hunter Bobble Helm",
            'Mode: [select] only\nShould the bot buy "Battle Gems Hunter Bobble Helm" ?',
            false,
        ),
        option.bool(
            "92621",
            "Battle Gems Explorer Helm",
            'Mode: [select] only\nShould the bot buy "Battle Gems Explorer Helm" ?',
            false,
        ),
        option.bool(
            "27908",
            "Battle Gems Windy",
            'Mode: [select] only\nShould the bot buy "Battle Gems Windy" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BattleGemsGameGearMerge.select,
});

export default function main(): void {
    const script = new BattleGemsGameGearMerge();
    Core.bankingBlackList.push("Golden Ticket");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
