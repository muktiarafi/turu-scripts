/*
name: Witchs Charms Merge
description: Farms the Witchs Charms Merge [2796] in /walpurgisnacht.
tags: walpurgisnacht, merge, witchs, charms, merge
*/
// Port of Scripts/Seasonal/Mogloween/MergeShops/WitchsCharms.cs.

import { bot, defineScriptOptions, type Monster, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreMogloween } from "../CoreMogloween";

const Adv = new CoreAdvanced();
const coreMogloween = new CoreMogloween();

export class WitchsCharms {
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                return;
            }

            switch (req.name) {
                case "Hollyhock Brew": {
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    let ensis: Monster | null;
                    let grigor: Monster | null;
                    Core.registerQuests(Core.isMember ? 10907 : 10906);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        if (bot.map.name !== "birgittamogloween") {
                            Core.join("birgittamogloween");
                        }

                        if (bot.player.cell !== "r6") {
                            Core.jump("r6", "Left");
                        }

                        ensis =
                            bot.monsters.currentAvailableMonsters?.find(
                                (m) => m.hp > 0 && m.state > 0 && m.mapId === 16,
                            ) ?? null;
                        grigor =
                            bot.monsters.currentAvailableMonsters?.find(
                                (m) => m.hp > 0 && m.state > 0 && m.mapId === 17,
                            ) ?? null;

                        if (bot.tempInv.contains("Cor Mortis Cosage") && ensis != null) {
                            bot.combat.attack(16);
                        } else if (bot.tempInv.contains("Grigor's Silver Tooth") && grigor != null) {
                            bot.combat.attack(17);
                        } else if (ensis != null) {
                            bot.combat.attack(16);
                        } else if (grigor != null) {
                            bot.combat.attack(17);
                        }
                        bot.sleep(200);
                        bot.wait.forQuestComplete(Core.isMember ? 10907 : 10906);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                }
                case "Luna Dial":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(Core.isMember ? 10932 : 10931);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("walpurgisnacht", "The Gentleman", "Father Forest's Tie", 1);
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("walpurgisnacht", "Bloodlust", "Vampire's Bloodthirst", 6);
                        Core.huntMonster("walpurgisnacht", "Beastly Hunger", "Werewolf's Hunger", 6);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Silver Stake":
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(10908, 10909);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.killMonster("shadowslayerwar", "r11", "Left", "*");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Silverblood Blade":

                case "Sventura":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("walpurgisnacht", "The Gentleman", req.name, quant, { isTemp: req.temp });
                    break;
                case "Witch Princess' Hat":
                    Core.logger("Use Butler to kill Witch Queen Talia in birgittaspire", undefined, {
                        messageBox: true,
                    });
                    break;
                default: {
                    const shouldStop = !Adv.matsOnly || !this.dontStopMissingIng;
                    Core.logger(`The bot hasn't been taught how to get ${req.name}.`, undefined, {
                        messageBox: shouldStop,
                        stopBot: shouldStop,
                    });
                    break;
                }
            }
        };
        coreMogloween.birgittaMogloween();
        coreMogloween.shadowSlayerWar();
        coreMogloween.walpurgisnacht();
        Adv.startBuyAllMerge("walpurgisnacht", 2796, findIngredients, buyOnlyThis, { buyMode });
    }

    static readonly select = [
        option.bool(
            "104334",
            "Witch Queen Talia",
            'Mode: [select] only\nShould the bot buy "Witch Queen Talia" ?',
            false,
        ),
        option.bool("104624", "ShadowSlayer Z", 'Mode: [select] only\nShould the bot buy "ShadowSlayer Z" ?', false),
        option.bool(
            "104629",
            "Blood Lineage Hunter",
            'Mode: [select] only\nShould the bot buy "Blood Lineage Hunter" ?',
            false,
        ),
        option.bool(
            "104338",
            "Darkovia's Dusk and Dawn",
            'Mode: [select] only\nShould the bot buy "Darkovia\'s Dusk and Dawn" ?',
            false,
        ),
        option.bool(
            "104637",
            "Dual Darkovia Dolore",
            'Mode: [select] only\nShould the bot buy "Dual Darkovia Dolore" ?',
            false,
        ),
        option.bool(
            "104638",
            "Sventura's Hunting Gear",
            'Mode: [select] only\nShould the bot buy "Sventura\'s Hunting Gear" ?',
            false,
        ),
        option.bool(
            "104630",
            "Blood Lineage Hat",
            'Mode: [select] only\nShould the bot buy "Blood Lineage Hat" ?',
            false,
        ),
        option.bool(
            "104631",
            "Blood Lineage Locks",
            'Mode: [select] only\nShould the bot buy "Blood Lineage Locks" ?',
            false,
        ),
        option.bool(
            "104632",
            "Blood Lineage Morph",
            'Mode: [select] only\nShould the bot buy "Blood Lineage Morph" ?',
            false,
        ),
        option.bool(
            "104633",
            "Blood Lineage Visage",
            'Mode: [select] only\nShould the bot buy "Blood Lineage Visage" ?',
            false,
        ),
        option.bool(
            "104336",
            "Witch Queen Talia Hat",
            'Mode: [select] only\nShould the bot buy "Witch Queen Talia Hat" ?',
            false,
        ),
        option.bool(
            "104337",
            "Witch Queen Talia Locks",
            'Mode: [select] only\nShould the bot buy "Witch Queen Talia Locks" ?',
            false,
        ),
        option.bool(
            "104625",
            "ShadowSlayer Z Morph",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Z Morph" ?',
            false,
        ),
        option.bool(
            "104626",
            "ShadowSlayer Z Visage",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer Z Visage" ?',
            false,
        ),
        option.bool("104636", "Darkovia Dolore", 'Mode: [select] only\nShould the bot buy "Darkovia Dolore" ?', false),
        option.bool("104339", "Obscuritas", 'Mode: [select] only\nShould the bot buy "Obscuritas" ?', false),
        option.bool("104628", "Silversun Blade", 'Mode: [select] only\nShould the bot buy "Silversun Blade" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: WitchsCharms.select,
});

export default function main(): void {
    const script = new WitchsCharms();
    Core.bankingBlackList.push(
        "Hollyhock Brew",
        "Luna Dial",
        "Silver Stake",
        "Silverblood Blade",
        "Sventura",
        "Witch Princess' Hat",
    );
    Core.setOptions();
    script.buyAllMerge();
    Core.setOptions(false);
}
