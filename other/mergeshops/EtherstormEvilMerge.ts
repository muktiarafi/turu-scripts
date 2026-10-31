/*
name: Etherstorm Evil Merge
description: This bot will farm the items belonging to the selected mode for the Etherstorm Evil Merge [382] in /etherwarevil
tags: etherstorm, evil, merge, etherwarevil, terragons, shout, rippled, bone, jagged, kill, dark, water
*/
// Port of Scripts/Other/MergeShops/EtherstormEvilMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class EtherstormEvilMerge {
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
                case "Dark Earth Token":

                case "Dark Water Token":

                case "Dark Fire Token":

                case "Dark Air Token":
                    if (Core.isMember) {
                        Core.farmingLogger(req.name, quant);
                        Core.registerQuests(1718, 1719);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("etherwarevil", "Tainted Emu", "Twisted Emu Feather", 6, {
                                isTemp: true,
                                log: false,
                            });
                            Core.huntMonster("etherwarevil", "Tainted Pelican", "Twisted Pelican Feather", 6, {
                                isTemp: true,
                                log: false,
                            });
                            Core.huntMonster("etherwarevil", "Tainted Hummingbird", "Twisted Hummingbird Feather", 6, {
                                isTemp: true,
                                log: false,
                            });
                            Core.huntMonster("etherwarevil", "Tainted Phoenix", "Twisted Phoenix Feather", 6, {
                                isTemp: true,
                                log: false,
                            });
                            bot.wait.forPickup(req.name);
                        }
                        Core.cancelRegisteredQuests();
                    } else {
                        Core.farmingLogger(req.name, quant);
                        Core.registerQuests(1719);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("etherwarevil", "Tainted Emu", "Twisted Emu Feather", 3, {
                                isTemp: true,
                                log: false,
                            });
                            Core.huntMonster("etherwarevil", "Tainted Pelican", "Twisted Pelican Feather", 3, {
                                isTemp: true,
                                log: false,
                            });
                            Core.huntMonster("etherwarevil", "Tainted Hummingbird", "Twisted Hummingbird Feather", 3, {
                                isTemp: true,
                                log: false,
                            });
                            Core.huntMonster("etherwarevil", "Tainted Phoenix", "Twisted Phoenix Feather", 3, {
                                isTemp: true,
                                log: false,
                            });
                            bot.wait.forPickup(req.name);
                        }
                        Core.cancelRegisteredQuests();
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("etherwarevil", 382, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "11306",
            "Terragon's Shout",
            'Mode: [select] only\nShould the bot buy "Terragon\'s Shout" ?',
            false,
        ),
        option.bool(
            "11269",
            "Rippled Bone Sword",
            'Mode: [select] only\nShould the bot buy "Rippled Bone Sword" ?',
            false,
        ),
        option.bool("11266", "Jagged Kill", 'Mode: [select] only\nShould the bot buy "Jagged Kill" ?', false),
        option.bool("11315", "Dark Water", 'Mode: [select] only\nShould the bot buy "Dark Water" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: EtherstormEvilMerge.select,
});

export default function main(): void {
    const script = new EtherstormEvilMerge();
    Core.bankingBlackList.push("Dark Earth Token", "Dark Water Token", "Dark Fire Token", "Dark Air Token");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
