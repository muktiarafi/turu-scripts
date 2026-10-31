/*
name: TechfortressWarMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/TechfortressWarMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDailies, MineCraftingMetalsEnum } from "../../core/CoreDailies";
import { BLODMethod, CoreBLOD } from "../../good/blod/CoreBLOD";
import { PinkBladeOfDestruciton } from "../weapons/PinkBladeofDestruction";

const Adv = new CoreAdvanced();
const PBOD = new PinkBladeOfDestruciton();
const Dailies = new CoreDailies();
const BLOD = new CoreBLOD();

export class TechfortressWarMerge {
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
                case "Deadtech War Medal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7638, 7638, 7639, 7641);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("techfortress", "Enter", "Spawn", "*", undefined, undefined, { log: false });
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Pink Blade of Destruction":
                    PBOD.getPBoD();
                    break;
                case "Unicorn Essence":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("undergroundlabb", "Ultra Brutalcorn", "Unicorn Essence", quant, {
                        isTemp: false,
                    });
                    break;
                case "Silver":
                    Dailies.mineCrafting(["Silver"], quant);
                    break;
                case "Spirit Orb":
                    BLOD.spiritOrb(quant);
                    break;
                case "Loyal Spirit Orb":
                    BLOD.loyalSpiritOrb(quant);
                    break;
                case "Blinding Aura":
                    BLOD.blindingAura(quant);
                    break;
                case "Sanctified Silver of Destiny":
                    BLOD.upgradeMetal(MineCraftingMetalsEnum.Silver);
                    break;
                case "Brilliant Aura":
                    BLOD.brilliantAura(quant);
                    break;
                case "Shard of An Orb":
                    Core.farmingLogger(req.name, quant);
                    BLOD.blindingLightOfDestiny(BLODMethod.Fewest_Hours);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(7654);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //More then one item of the same name as drop btoh temp and non-temp.
                        while (!bot.shouldExit && !Core.checkInventory(55903, 10)) {
                            Core.killMonster("dflesson", "r12", "Right", "Fluffy the Dracolich", undefined, undefined, {
                                log: false,
                            });
                        }

                        Core.killMonster("dflesson", "r3", "Right", "Fire Elemental", "Fire Elemental's Bracer", 5, {
                            isTemp: false,
                        });
                        Core.killMonster("dflesson", "r6", "Right", "Tog", "Tog Claw", 5, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Purified Undead Dragon Essence":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(7655, 7291);
                    Core.addDrop("Rainbow Moonstone");
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        if (!Core.checkInventory("Rainbow Moonstone", 5)) {
                            Core.equipClass(ClassType.Farm);
                            while (!bot.shouldExit && !Core.checkInventory("Rainbow Moonstone", 5)) {
                                Core.huntMonster("earthstorm", "Diamond Golem", "Chip of Diamond");
                                Core.huntMonster("earthstorm", "Emerald Golem", "Chip of Emerald");
                                Core.huntMonster("earthstorm", "Ruby Golem", "Chip of Ruby");
                                Core.huntMonster("earthstorm", "Sapphire Golem", "Chip of Sapphire");

                                bot.wait.forPickup("Rainbow Moonstone");
                            }
                        }
                        Core.equipClass(ClassType.Solo);
                        Core.killMonster("doomwood", "r10", "Right", "Undead Paladin", "Purification Orb", 10, {
                            isTemp: false,
                        });
                        Core.killMonster("desolich", "r3", "Left", "Desolich", "Desolich's Dark Horn", 3, {
                            isTemp: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("techfortress", 1902, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "55484",
            "Deadtech Necromancer",
            'Mode: [select] only\nShould the bot buy "Deadtech Necromancer" ?',
            false,
        ),
        option.bool(
            "55485",
            "Deadtech Necromancer Hood",
            'Mode: [select] only\nShould the bot buy "Deadtech Necromancer Hood" ?',
            false,
        ),
        option.bool(
            "55486",
            "Deadtech Necromancer Masked Hood",
            'Mode: [select] only\nShould the bot buy "Deadtech Necromancer Masked Hood" ?',
            false,
        ),
        option.bool(
            "55487",
            "Deadtech Necromancer Skull Hood",
            'Mode: [select] only\nShould the bot buy "Deadtech Necromancer Skull Hood" ?',
            false,
        ),
        option.bool(
            "55488",
            "Deadtech Necromancer Tech Hood",
            'Mode: [select] only\nShould the bot buy "Deadtech Necromancer Tech Hood" ?',
            false,
        ),
        option.bool(
            "55490",
            "Deadtech Necromancer Skeleton Arms",
            'Mode: [select] only\nShould the bot buy "Deadtech Necromancer Skeleton Arms" ?',
            false,
        ),
        option.bool(
            "55491",
            "Deadtech Necromancer Hatchet",
            'Mode: [select] only\nShould the bot buy "Deadtech Necromancer Hatchet" ?',
            false,
        ),
        option.bool(
            "55492",
            "Deadtech Necromancer Staff",
            'Mode: [select] only\nShould the bot buy "Deadtech Necromancer Staff" ?',
            false,
        ),
        option.bool("55493", "Deadtech Lich", 'Mode: [select] only\nShould the bot buy "Deadtech Lich" ?', false),
        option.bool(
            "55494",
            "Deadtech Lich Hood",
            'Mode: [select] only\nShould the bot buy "Deadtech Lich Hood" ?',
            false,
        ),
        option.bool(
            "55495",
            "Deadtech Lich Masked Hood",
            'Mode: [select] only\nShould the bot buy "Deadtech Lich Masked Hood" ?',
            false,
        ),
        option.bool(
            "55496",
            "Deadtech Lich Skull Hood",
            'Mode: [select] only\nShould the bot buy "Deadtech Lich Skull Hood" ?',
            false,
        ),
        option.bool(
            "55497",
            "Deadtech Lich Borg Hood",
            'Mode: [select] only\nShould the bot buy "Deadtech Lich Borg Hood" ?',
            false,
        ),
        option.bool(
            "55498",
            "Deadtech Lich Hatchet",
            'Mode: [select] only\nShould the bot buy "Deadtech Lich Hatchet" ?',
            false,
        ),
        option.bool(
            "55499",
            "Deadtech Lich Staff",
            'Mode: [select] only\nShould the bot buy "Deadtech Lich Staff" ?',
            false,
        ),
        option.bool(
            "55897",
            "Mechanized Armblades",
            'Mode: [select] only\nShould the bot buy "Mechanized Armblades" ?',
            false,
        ),
        option.bool(
            "55885",
            "Uni-Blade of Destruction",
            'Mode: [select] only\nShould the bot buy "Uni-Blade of Destruction" ?',
            false,
        ),
        option.bool(
            "55886",
            "Rainbow Uni-Blade of Destruction",
            'Mode: [select] only\nShould the bot buy "Rainbow Uni-Blade of Destruction" ?',
            false,
        ),
        option.bool(
            "55889",
            "Ultimate Blinding Light of Destiny",
            'Mode: [select] only\nShould the bot buy "Ultimate Blinding Light of Destiny" ?',
            false,
        ),
        option.bool(
            "55893",
            "Ultimate Twin Blades of Destiny",
            'Mode: [select] only\nShould the bot buy "Ultimate Twin Blades of Destiny" ?',
            false,
        ),
        option.bool(
            "55892",
            "Ultimate DragonStaff of Destiny",
            'Mode: [select] only\nShould the bot buy "Ultimate DragonStaff of Destiny" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: TechfortressWarMerge.select,
});

export default function main(): void {
    const script = new TechfortressWarMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
