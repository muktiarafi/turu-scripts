/*
name: Librarys Lost and Found Merge
description: This bot will farm the items belonging to the selected mode for the Librarys Lost and Found Merge [2563] in /legionlibrary
tags: librarys, lost, and, found, merge, legionlibrary, argus, panoptes, phlegethon, magma, lava, legion, loremaster, tome, lorekeeper, veil, strategy, table, study, underworld
*/
// Port of Scripts/Legion/MergeShops/LibrarysLostandFoundMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class LibrarysLostandFoundMerge {
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
                case "Argus' Iris":
                    this.iris(quant);
                    break;
                case "Underworld Linen":
                    this.linen(quant);
                    break;
                case "River Glowstone":
                    this.glowstone(quant);
                    break;
                case "Teacup Mace":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("junkhoard", "Junk Golem", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Oizys' Forgotten Memory":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(10621, ["lethe", "Oizys", ClassType.Solo]);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Unholy Incantation":
                    this.unholyIncantation(quant);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("legionlibrary", 2563, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    iris(quant = 1000): void {
        Core.farmingLogger("Argus' Iris", quant);
        Core.addDrop("Argus' Iris");
        while (!bot.shouldExit && !Core.checkInventory("Argus' Iris", quant)) {
            Core.huntMonsterQuest(10097, ["phlegethon", "Argus Panoptes", ClassType.Solo]);
            bot.wait.forPickup("Argus' Iris");
        }
    }

    linen(quant = 1000): void {
        Core.farmingLogger("Underworld Linen", quant);
        Core.addDrop("Underworld Linen");
        if (!Core.isCompletedBefore(10098)) {
            Core.huntMonsterQuest(10098, ["dagefortress", "Scorned Knight", ClassType.Farm]);
        }
        while (!bot.shouldExit && !Core.checkInventory("Underworld Linen", quant)) {
            Core.huntMonsterQuest(
                10099,
                ["judgement", "Minos", ClassType.Solo],
                ["judgement", "Rhadamanthys", ClassType.Solo],
                ["judgement", "Aeacus", ClassType.Solo],
            );
            bot.wait.forPickup("Underworld Linen");
        }
    }

    glowstone(quant = 1000): void {
        Core.farmingLogger("River Glowstone", quant);
        Core.addDrop("River Glowstone");
        if (!Core.isCompletedBefore(10098)) {
            this.linen(1);
        }
        if (!Core.isCompletedBefore(10100)) {
            Core.huntMonsterQuest(10100, ["Phlegethon ", "Cerberus Pup", ClassType.Farm]);
        }
        while (!bot.shouldExit && !Core.checkInventory("River Glowstone", quant)) {
            Core.huntMonsterQuest(10101, ["styx", "Styx Hydra", ClassType.Solo]);
            bot.wait.forPickup("River Glowstone");
        }
    }

    unholyIncantation(quant = 1000): void {
        Core.farmingLogger("Unholy Incantation", quant);
        Core.addDrop("Unholy Incantation");
        if (!Core.isCompletedBefore(10101)) {
            this.glowstone(1);
        }
        while (!bot.shouldExit && !Core.checkInventory("Unholy Incantation", quant)) {
            Core.huntMonsterQuest(10622, ["lethe", "Mourner", ClassType.Solo]);
            bot.wait.forPickup("Unholy Incantation");
        }
    }

    static readonly select = [
        option.bool(
            "92402",
            "Argus Panoptes Gauntlets",
            'Mode: [select] only\nShould the bot buy "Argus Panoptes Gauntlets" ?',
            false,
        ),
        option.bool(
            "92401",
            "Argus Panoptes Gauntlet",
            'Mode: [select] only\nShould the bot buy "Argus Panoptes Gauntlet" ?',
            false,
        ),
        option.bool("92400", "Phlegethon Magma", 'Mode: [select] only\nShould the bot buy "Phlegethon Magma" ?', false),
        option.bool("92399", "Phlegethon Lava", 'Mode: [select] only\nShould the bot buy "Phlegethon Lava" ?', false),
        option.bool(
            "92305",
            "Legion Loremaster Tome",
            'Mode: [select] only\nShould the bot buy "Legion Loremaster Tome" ?',
            false,
        ),
        option.bool(
            "92304",
            "Legion Lorekeeper Veil",
            'Mode: [select] only\nShould the bot buy "Legion Lorekeeper Veil" ?',
            false,
        ),
        option.bool(
            "92303",
            "Legion Loremaster Veil",
            'Mode: [select] only\nShould the bot buy "Legion Loremaster Veil" ?',
            false,
        ),
        option.bool(
            "92302",
            "Legion Loremaster",
            'Mode: [select] only\nShould the bot buy "Legion Loremaster" ?',
            false,
        ),
        option.bool(
            "92408",
            "Legion Strategy Table",
            'Mode: [select] only\nShould the bot buy "Legion Strategy Table" ?',
            false,
        ),
        option.bool(
            "92407",
            "Legion Study Table",
            'Mode: [select] only\nShould the bot buy "Legion Study Table" ?',
            false,
        ),
        option.bool(
            "92470",
            "Underworld Lorekeeper",
            'Mode: [select] only\nShould the bot buy "Underworld Lorekeeper" ?',
            false,
        ),
        option.bool(
            "92471",
            "Underworld Lorekeeper Veil",
            'Mode: [select] only\nShould the bot buy "Underworld Lorekeeper Veil" ?',
            false,
        ),
        option.bool(
            "95602",
            "Deathbound Oraculi",
            'Mode: [select] only\nShould the bot buy "Deathbound Oraculi" ?',
            false,
        ),
        option.bool(
            "95603",
            "Deathbound Oraculi Hair",
            'Mode: [select] only\nShould the bot buy "Deathbound Oraculi Hair" ?',
            false,
        ),
        option.bool(
            "95604",
            "Deathbound Oraculi Locks",
            'Mode: [select] only\nShould the bot buy "Deathbound Oraculi Locks" ?',
            false,
        ),
        option.bool(
            "95605",
            "Deathbound Oraculi Morph",
            'Mode: [select] only\nShould the bot buy "Deathbound Oraculi Morph" ?',
            false,
        ),
        option.bool(
            "95606",
            "Deathbound Oraculi Visage",
            'Mode: [select] only\nShould the bot buy "Deathbound Oraculi Visage" ?',
            false,
        ),
        option.bool(
            "95607",
            "Underworld Symposium Horns",
            'Mode: [select] only\nShould the bot buy "Underworld Symposium Horns" ?',
            false,
        ),
        option.bool(
            "95608",
            "Underworld Symposium Hood",
            'Mode: [select] only\nShould the bot buy "Underworld Symposium Hood" ?',
            false,
        ),
        option.bool(
            "95609",
            "Underworld Symposium Horned Mask",
            'Mode: [select] only\nShould the bot buy "Underworld Symposium Horned Mask" ?',
            false,
        ),
        option.bool(
            "95610",
            "Underworld Symposium Mask",
            'Mode: [select] only\nShould the bot buy "Underworld Symposium Mask" ?',
            false,
        ),
        option.bool(
            "95611",
            "Deathly Scholar's Cloak",
            'Mode: [select] only\nShould the bot buy "Deathly Scholar\'s Cloak" ?',
            false,
        ),
        option.bool(
            "95612",
            "Epiphany of Eudaimonia",
            'Mode: [select] only\nShould the bot buy "Epiphany of Eudaimonia" ?',
            false,
        ),
        option.bool(
            "95613",
            "Dual Epiphany of Eudaimonia",
            'Mode: [select] only\nShould the bot buy "Dual Epiphany of Eudaimonia" ?',
            false,
        ),
        option.bool(
            "95614",
            "Epiphany of Phantasiai",
            'Mode: [select] only\nShould the bot buy "Epiphany of Phantasiai" ?',
            false,
        ),
        option.bool(
            "84418",
            "Great BoneSword Of Eminence",
            'Mode: [select] only\nShould the bot buy "Great BoneSword Of Eminence" ?',
            false,
        ),
        option.bool(
            "84419",
            "Great BoneSwords Of Eminence",
            'Mode: [select] only\nShould the bot buy "Great BoneSwords Of Eminence" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LibrarysLostandFoundMerge.select,
});

export default function main(): void {
    const script = new LibrarysLostandFoundMerge();
    Core.bankingBlackList.push(
        "Argus' Iris",
        "Underworld Linen",
        "River Glowstone",
        "Teacup Mace",
        "Oizys' Forgotten Memory",
        "Unholy Incantation",
    );

    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
