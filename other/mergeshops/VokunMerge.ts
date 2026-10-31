/*
name: VokunMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/VokunMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Alignment, ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class VokunMerge {
    private dontStopMissingIng = false;

    buyAllMerge(): void {
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
                case "Unitas Fragment":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    if (!Core.isMember) {
                        Core.registerQuests(3760);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("battleundera", "Undead Berserker", "Warrior Claymore Blade", undefined, {
                                isTemp: false,
                                log: false,
                            });
                            Core.huntMonster("maul", "SlimeSkull", "Dark Crown Axe", undefined, {
                                isTemp: false,
                                log: false,
                            });
                            Farm.battleUnderB("Undead Energy", 50);
                            bot.wait.forPickup(req.name);
                        }
                    } else {
                        Core.registerQuests(3763);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("graveyard", "Big Jack Sprat", "Bone Axe", undefined, {
                                isTemp: false,
                                log: false,
                            });
                            if (Core.heroAlignment !== 2) {
                                Core.changeAlignment(Alignment.Evil);
                            }
                            Core.buyItem("shadowfall", 47, "Helm of the Dark Lord");
                            bot.wait.forPickup(req.name);
                        }
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("underworld", 980, findIngredients);

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("25408", "Skuller of Vokun", 'Mode: [select] only\nShould the bot buy "Skuller of Vokun" ?', false),
        option.bool(
            "25409",
            "Skuller of Vokun Head",
            'Mode: [select] only\nShould the bot buy "Skuller of Vokun Head" ?',
            false,
        ),
        option.bool(
            "25410",
            "GateKeeper of Vokun",
            'Mode: [select] only\nShould the bot buy "GateKeeper of Vokun" ?',
            false,
        ),
        option.bool(
            "25411",
            "GateKeeper Skull of Vokun",
            'Mode: [select] only\nShould the bot buy "GateKeeper Skull of Vokun" ?',
            false,
        ),
        option.bool(
            "25412",
            "GateKeeper of Vokun Cape",
            'Mode: [select] only\nShould the bot buy "GateKeeper of Vokun Cape" ?',
            false,
        ),
        option.bool("25413", "Beast Of Vokun", 'Mode: [select] only\nShould the bot buy "Beast Of Vokun" ?', false),
        option.bool(
            "25414",
            "BeastWings of Vokun",
            'Mode: [select] only\nShould the bot buy "BeastWings of Vokun" ?',
            false,
        ),
        option.bool(
            "25415",
            "BeastHorns of Vokun",
            'Mode: [select] only\nShould the bot buy "BeastHorns of Vokun" ?',
            false,
        ),
        option.bool(
            "25416",
            "Beast of Vokun Polearm",
            'Mode: [select] only\nShould the bot buy "Beast of Vokun Polearm" ?',
            false,
        ),
        option.bool(
            "25423",
            "Assassin of Vokun",
            'Mode: [select] only\nShould the bot buy "Assassin of Vokun" ?',
            false,
        ),
        option.bool(
            "25424",
            "Assassin Helm of Vokun",
            'Mode: [select] only\nShould the bot buy "Assassin Helm of Vokun" ?',
            false,
        ),
        option.bool("25425", "Katana of Vokun", 'Mode: [select] only\nShould the bot buy "Katana of Vokun" ?', false),
        option.bool(
            "25430",
            "BloodBlade of Vokun",
            'Mode: [select] only\nShould the bot buy "BloodBlade of Vokun" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: VokunMerge.select,
});

export default function main(): void {
    const script = new VokunMerge();
    Core.bankingBlackList.push("Unitas Fragment");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
