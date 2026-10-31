/*
name: WarTrainingMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/WarTrainingMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { FireChampionsArmor } from "../armor/FireChampionsArmor";
import { DragonslayerGeneral } from "../classes/DragonslayerGeneral";
import { WarfuryEmblem } from "../WarFuryEmblem";
import { CoreSoW } from "../../story/shadowsofwar/CoreSoW";

const Adv = new CoreAdvanced();
const Tynd = new CoreSoW();
const Emblem = new WarfuryEmblem();
const DSG = new DragonslayerGeneral();
const FCA = new FireChampionsArmor();

export class WarTrainingMerge {
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
                case "Warfury Emblem":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Emblem.warfuryEmblemFarm(quant);
                    break;
                case "WarFury Soldier's Morph":

                case "WarFury Soldier's Armor":

                case "WarFury Soldier's Blade":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("wartraining", "Varga", req.name, undefined, { isTemp: false });
                    break;
                case "Enchanted Scale":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    DSG.enchantedScaleandClaw(quant, 0);
                    break;
                case "Flame-Forged Metal":
                    if (!bot.quests.isAvailable(793)) {
                        Core.logger("Legion required.");
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    FCA.flameForgedMetal(quant);
                    break;
                case "Void Scale":
                    Core.farmingLogger(req.name, quant);
                    FCA.voidScale(quant);
                    break;
                case "Dragon Scale":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("lair", "Bronze Draconian", req.name, quant);
                    break;
            }
        };
        Tynd.tyndarius(true);
        Adv.startBuyAllMerge("wartraining", 2035, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("61750", "Ruby DragonTamer", 'Mode: [select] only\nShould the bot buy "Ruby DragonTamer" ?', false),
        option.bool(
            "61751",
            "Ruby DragonTamer's Helmet",
            'Mode: [select] only\nShould the bot buy "Ruby DragonTamer\'s Helmet" ?',
            false,
        ),
        option.bool(
            "61752",
            "DragonTamer's Morph + Locks",
            'Mode: [select] only\nShould the bot buy "DragonTamer\'s Morph + Locks" ?',
            false,
        ),
        option.bool(
            "61753",
            "DragonTamer's Morph",
            'Mode: [select] only\nShould the bot buy "DragonTamer\'s Morph" ?',
            false,
        ),
        option.bool(
            "61754",
            "DragonTamer's Blade",
            'Mode: [select] only\nShould the bot buy "DragonTamer\'s Blade" ?',
            false,
        ),
        option.bool(
            "61755",
            "DragonTamer's Poleaxe",
            'Mode: [select] only\nShould the bot buy "DragonTamer\'s Poleaxe" ?',
            false,
        ),
        option.bool(
            "61756",
            "DragonTamer's Tail",
            'Mode: [select] only\nShould the bot buy "DragonTamer\'s Tail" ?',
            false,
        ),
        option.bool(
            "61757",
            "DragonTamer's Wings",
            'Mode: [select] only\nShould the bot buy "DragonTamer\'s Wings" ?',
            false,
        ),
        option.bool(
            "61758",
            "DragonTamer's Wings + Tail",
            'Mode: [select] only\nShould the bot buy "DragonTamer\'s Wings + Tail" ?',
            false,
        ),
        option.bool(
            "58462",
            "Polished DragonSlayer",
            'Mode: [select] only\nShould the bot buy "Polished DragonSlayer" ?',
            false,
        ),
        option.bool(
            "58463",
            "Polished DragonSlayer's Helm",
            'Mode: [select] only\nShould the bot buy "Polished DragonSlayer\'s Helm" ?',
            false,
        ),
        option.bool(
            "58464",
            "Woven DragonSlayer's Cloak",
            'Mode: [select] only\nShould the bot buy "Woven DragonSlayer\'s Cloak" ?',
            false,
        ),
        option.bool(
            "62570",
            "Fire Champion's Armor",
            'Mode: [select] only\nShould the bot buy "Fire Champion\'s Armor" ?',
            false,
        ),
        option.bool(
            "62571",
            "Fire Champion's Armet",
            'Mode: [select] only\nShould the bot buy "Fire Champion\'s Armet" ?',
            false,
        ),
        option.bool(
            "62572",
            "Fire Champion's Cloak",
            'Mode: [select] only\nShould the bot buy "Fire Champion\'s Cloak" ?',
            false,
        ),
        option.bool(
            "62607",
            "WarFury Elite's Armor",
            'Mode: [select] only\nShould the bot buy "WarFury Elite\'s Armor" ?',
            false,
        ),
        option.bool(
            "62608",
            "WarFury Elite's Morph",
            'Mode: [select] only\nShould the bot buy "WarFury Elite\'s Morph" ?',
            false,
        ),
        option.bool(
            "62609",
            "WarFury Elite's Blade",
            'Mode: [select] only\nShould the bot buy "WarFury Elite\'s Blade" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: WarTrainingMerge.select,
});

export default function main(): void {
    const script = new WarTrainingMerge();
    Core.bankingBlackList.push("");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
