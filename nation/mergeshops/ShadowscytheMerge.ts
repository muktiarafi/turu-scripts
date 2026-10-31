/*
name: Shadowscythe Merge
description: This bot will farm the items belonging to the selected mode for the Shadowscythe Merge [1208] in /shadowblast
tags: shadowscythe, merge, shadowblast, doomfire, empowered, flaming, exalted
*/
// Port of Scripts/Nation/MergeShops/ShadowscytheMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { ShadowBlastArena } from "../../story/nation/ShadowBlastArena";

const Adv = new CoreAdvanced();
const SBA = new ShadowBlastArena();

export class ShadowscytheMerge {
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
                case "Diamond Token of Gravelyn":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(4737);
                    Core.addDrop("Diamond Token of Dage", "Legion Token");
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        if (!Core.checkInventory("Defeated Makai", 25)) {
                            Core.equipClass(ClassType.Farm);
                            Core.killMonster("tercessuinotlim", "m2", "Left", "*", "Defeated Makai", 25, {
                                isTemp: false,
                            });
                            Core.jumpWait();
                            Core.join("aqlesson");
                        }
                        Core.equipClass(ClassType.Solo);
                        Core.killMonster("aqlesson", "Frame9", "Right", "Carnax", "Carnax Eye", undefined, {
                            publicRoom: true,
                        });
                        Core.huntMonster("deepchaos", "Kathool", "Kathool Tentacle", undefined, { publicRoom: true });
                        Core.killMonster("dflesson", "r12", "Right", 29, 33257, undefined, {
                            isTemp: true,
                            publicRoom: true,
                        });
                        Core.huntMonster("lair", "Red Dragon", "Red Dragon's Fang");
                        Core.huntMonster("bloodtitan", "Blood Titan", "Blood Titan's Blade", undefined, {
                            publicRoom: true,
                        });

                        bot.wait.forQuestComplete(4737);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Emblem of Gravelyn":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(4750);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("shadowblast", "Carnage", "Shadow Seal", 25, { isTemp: false });
                        Core.huntMonster("shadowblast", "Legion Fenrir", "Gem of Superiority", undefined, {
                            isTemp: false,
                        });
                        bot.wait.forQuestComplete(4750);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        SBA.doall();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("shadowblast", 1208, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("33273", "DOOMFire Blade", 'Mode: [select] only\nShould the bot buy "DOOMFire Blade" ?', false),
        option.bool(
            "33274",
            "Empowered DOOMFire Blade",
            'Mode: [select] only\nShould the bot buy "Empowered DOOMFire Blade" ?',
            false,
        ),
        option.bool(
            "33275",
            "Flaming DOOMFire Blade",
            'Mode: [select] only\nShould the bot buy "Flaming DOOMFire Blade" ?',
            false,
        ),
        option.bool(
            "33276",
            "Exalted DOOMFire Blade",
            'Mode: [select] only\nShould the bot buy "Exalted DOOMFire Blade" ?',
            false,
        ),
        option.bool("33209", "DOOMFire Cape", 'Mode: [select] only\nShould the bot buy "DOOMFire Cape" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ShadowscytheMerge.select,
});

export default function main(): void {
    const script = new ShadowscytheMerge();
    Core.bankingBlackList.push("Diamond Token of Gravelyn", "Emblem of Gravelyn");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
