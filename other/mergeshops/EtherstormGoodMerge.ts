/*
name: Etherstorm Good Merge
description: This bot will farm the items belonging to the selected mode for the Etherstorm Good Merge [378] in /etherwargood
tags: etherstorm, good, merge, etherwargood, golden, dragoon, ultra, lance, whisper, conquerer
*/
// Port of Scripts/Other/MergeShops/EtherstormGoodMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class EtherstormGoodMerge {
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
                case "Water Defender Token":

                case "Fire Defender Token":

                case "Earth Defender Token":

                case "Air Defender Token":
                    if (Core.isMember) {
                        Core.farmingLogger(req.name, quant);
                        Core.registerQuests(1716, 1717);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("etherwargood", "Tainted Emu", "Twisted Emu Feather", 6, {
                                isTemp: true,
                                log: false,
                            });
                            Core.huntMonster("etherwargood", "Tainted Pelican", "Twisted Pelican Feather", 6, {
                                isTemp: true,
                                log: false,
                            });
                            Core.huntMonster("etherwargood", "Tainted Hummingbird", "Twisted Hummingbird Feather", 6, {
                                isTemp: true,
                                log: false,
                            });
                            Core.huntMonster("etherwargood", "Tainted Phoenix", "Twisted Phoenix Feather", 6, {
                                isTemp: true,
                                log: false,
                            });
                            bot.wait.forPickup(req.name);
                        }
                        Core.cancelRegisteredQuests();
                    } else {
                        Core.farmingLogger(req.name, quant);
                        Core.registerQuests(1717);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("etherwargood", "Tainted Emu", "Twisted Emu Feather", 3, {
                                isTemp: true,
                                log: false,
                            });
                            Core.huntMonster("etherwargood", "Tainted Pelican", "Twisted Pelican Feather", 3, {
                                isTemp: true,
                                log: false,
                            });
                            Core.huntMonster("etherwargood", "Tainted Hummingbird", "Twisted Hummingbird Feather", 3, {
                                isTemp: true,
                                log: false,
                            });
                            Core.huntMonster("etherwargood", "Tainted Phoenix", "Twisted Phoenix Feather", 3, {
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
        Adv.startBuyAllMerge("etherwargood", 378, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "11290",
            "Golden Dragoon Helm",
            'Mode: [select] only\nShould the bot buy "Golden Dragoon Helm" ?',
            false,
        ),
        option.bool(
            "11292",
            "Ultra Dragoon Lance",
            'Mode: [select] only\nShould the bot buy "Ultra Dragoon Lance" ?',
            false,
        ),
        option.bool(
            "11267",
            "Whisper of the Conquerer",
            'Mode: [select] only\nShould the bot buy "Whisper of the Conquerer" ?',
            false,
        ),
        option.bool("11316", "Golden Dragoon", 'Mode: [select] only\nShould the bot buy "Golden Dragoon" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: EtherstormGoodMerge.select,
});

export default function main(): void {
    const script = new EtherstormGoodMerge();
    Core.bankingBlackList.push(
        "Water Defender Token",
        "Fire Defender Token",
        "Earth Defender Token",
        "Air Defender Token",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
