/*
name: Zoda's Merge
description: This bot will farm the items belonging to the selected mode for the Zoda's Merge [2133] in /zorbaspalace
tags: zodas, merge, zorbaspalace, augmented, light, rebellion, dark, fifth, chaos, imperium, aulorian, opened, , spear, mace, pistol, pistols, golden, armaments, lorosian, hunter, hunters, saber, sabers, blaster, handgun, handguns, armblade, armblades, set, pangalactic, double
*/
// Port of Scripts/Seasonal/MayThe4th/ZodasMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { Zoda } from "./Zoda";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const Z = new Zoda();

export class ZodasMerge {
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
                case "Light Blade of the Rebellion":
                    Core.farmingLogger(req.name, quant);
                    Farm.goodREP();
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(8648);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Z.assembledSword();
                        Core.huntMonster("greed", "Goregold", "Goregold Resisted", undefined, {
                            isTemp: false,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Zorblatt's Pizza Slice":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(8651);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("zorbaspit", "Zorblatt", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Dark Blade of the Fifth":
                    Core.farmingLogger(req.name, quant);
                    Farm.evilREP();
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(8649);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Z.assembledSword();
                        Core.huntMonster("murdermoon", "Fifth Sepulchure", "Fifth Sepulchure Defeated", undefined, {
                            isTemp: false,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Chaos Blade of the Imperium":
                    Core.farmingLogger(req.name, quant);
                    Farm.chaosREP();
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(8650);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Z.assembledSword();
                        Core.huntMonster("ledgermayne", "Ledgermayne", "Ledgermayne Defeated", undefined, {
                            isTemp: false,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        Z.storyline();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("zorbaspalace", 2133, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "70076",
            "Augmented Light Blade of the Rebellion",
            'Mode: [select] only\nShould the bot buy "Augmented Light Blade of the Rebellion" ?',
            false,
        ),
        option.bool(
            "70074",
            "Augmented Dark Blade of the Fifth",
            'Mode: [select] only\nShould the bot buy "Augmented Dark Blade of the Fifth" ?',
            false,
        ),
        option.bool(
            "70078",
            "Augmented Chaos Blade of the Imperium",
            'Mode: [select] only\nShould the bot buy "Augmented Chaos Blade of the Imperium" ?',
            false,
        ),
        option.bool("69863", "Aulorian", 'Mode: [select] only\nShould the bot buy "Aulorian" ?', false),
        option.bool("69864", "Aulorian Helm", 'Mode: [select] only\nShould the bot buy "Aulorian Helm" ?', false),
        option.bool(
            "69865",
            "Aulorian Opened Helm",
            'Mode: [select] only\nShould the bot buy "Aulorian Opened Helm" ?',
            false,
        ),
        option.bool(
            "69866",
            "Aulorian Sword + Cape",
            'Mode: [select] only\nShould the bot buy "Aulorian Sword + Cape" ?',
            false,
        ),
        option.bool("69867", "Aulorian Cape", 'Mode: [select] only\nShould the bot buy "Aulorian Cape" ?', false),
        option.bool("69868", "Aulorian Blade", 'Mode: [select] only\nShould the bot buy "Aulorian Blade" ?', false),
        option.bool("69869", "Aulorian Spear", 'Mode: [select] only\nShould the bot buy "Aulorian Spear" ?', false),
        option.bool("69870", "Aulorian Mace", 'Mode: [select] only\nShould the bot buy "Aulorian Mace" ?', false),
        option.bool("69871", "Aulorian Pistol", 'Mode: [select] only\nShould the bot buy "Aulorian Pistol" ?', false),
        option.bool("69872", "Aulorian Pistols", 'Mode: [select] only\nShould the bot buy "Aulorian Pistols" ?', false),
        option.bool(
            "69873",
            "Aulorian Golden Gun",
            'Mode: [select] only\nShould the bot buy "Aulorian Golden Gun" ?',
            false,
        ),
        option.bool(
            "69874",
            "Aulorian Golden Guns",
            'Mode: [select] only\nShould the bot buy "Aulorian Golden Guns" ?',
            false,
        ),
        option.bool("69875", "Aulorian Guns", 'Mode: [select] only\nShould the bot buy "Aulorian Guns" ?', false),
        option.bool(
            "69876",
            "Aulorian Armaments",
            'Mode: [select] only\nShould the bot buy "Aulorian Armaments" ?',
            false,
        ),
        option.bool("69885", "Lorosian Hunter", 'Mode: [select] only\nShould the bot buy "Lorosian Hunter" ?', false),
        option.bool(
            "69886",
            "Lorosian Hunter Helm",
            'Mode: [select] only\nShould the bot buy "Lorosian Hunter Helm" ?',
            false,
        ),
        option.bool(
            "69887",
            "Lorosian Hunter Hat + Mask",
            'Mode: [select] only\nShould the bot buy "Lorosian Hunter Hat + Mask" ?',
            false,
        ),
        option.bool(
            "69888",
            "Lorosian Hunter's Saber Cape",
            'Mode: [select] only\nShould the bot buy "Lorosian Hunter\'s Saber Cape" ?',
            false,
        ),
        option.bool(
            "69889",
            "Lorosian Hunter Saber",
            'Mode: [select] only\nShould the bot buy "Lorosian Hunter Saber" ?',
            false,
        ),
        option.bool(
            "69890",
            "Lorosian Hunter Sabers",
            'Mode: [select] only\nShould the bot buy "Lorosian Hunter Sabers" ?',
            false,
        ),
        option.bool(
            "69891",
            "Lorosian Hunter Blaster",
            'Mode: [select] only\nShould the bot buy "Lorosian Hunter Blaster" ?',
            false,
        ),
        option.bool(
            "69892",
            "Lorosian Hunter Handgun",
            'Mode: [select] only\nShould the bot buy "Lorosian Hunter Handgun" ?',
            false,
        ),
        option.bool(
            "69893",
            "Lorosian Hunter Handguns",
            'Mode: [select] only\nShould the bot buy "Lorosian Hunter Handguns" ?',
            false,
        ),
        option.bool(
            "69894",
            "Lorosian Hunter ArmBlade",
            'Mode: [select] only\nShould the bot buy "Lorosian Hunter ArmBlade" ?',
            false,
        ),
        option.bool(
            "69895",
            "Lorosian Hunter ArmBlades",
            'Mode: [select] only\nShould the bot buy "Lorosian Hunter ArmBlades" ?',
            false,
        ),
        option.bool(
            "69896",
            "Lorosian Hunter Gun Set",
            'Mode: [select] only\nShould the bot buy "Lorosian Hunter Gun Set" ?',
            false,
        ),
        option.bool(
            "70044",
            "Pan-Galactic Double Saber",
            'Mode: [select] only\nShould the bot buy "Pan-Galactic Double Saber" ?',
            false,
        ),
        option.bool(
            "70045",
            "Pan-Galactic Double Sabers",
            'Mode: [select] only\nShould the bot buy "Pan-Galactic Double Sabers" ?',
            false,
        ),
        option.bool(
            "70046",
            "Pan-Galactic Saber",
            'Mode: [select] only\nShould the bot buy "Pan-Galactic Saber" ?',
            false,
        ),
        option.bool(
            "70047",
            "Pan-Galactic Sabers",
            'Mode: [select] only\nShould the bot buy "Pan-Galactic Sabers" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ZodasMerge.select,
});

export default function main(): void {
    const script = new ZodasMerge();
    Core.bankingBlackList.push(
        "Light Blade of the Rebellion",
        "Zorblatt's Pizza Slice",
        "Dark Blade of the Fifth",
        "Chaos Blade of the Imperium",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
