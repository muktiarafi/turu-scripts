/*
name: Swordhaven Maze Merge
description: This bot will farm the items belonging to the selected mode for the Swordhaven Maze Merge [2740] in /swordhavenmaze
tags: swordhaven, maze, merge, swordhavenmaze, extinction, artist, aficionado, house, volkov, uniform, ceremonial, ruby, rapiers, warrior, morph, cap, , jubilant, artists, shadow, artistas, instrument, brush, rapier
*/
// Port of Scripts/Other/MergeShops/SwordhavenMazeMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class SwordhavenMazeMerge {
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
                case "Feral Boar's Hide":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.huntMonster("swordhavenmaze", "Feral Boar", req.name, req.quantity, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    break;
                case "Ghost's Garment":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.huntMonster("swordhavenmaze", "Noble Ghost", req.name, req.quantity, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    break;
                case "Prisoner's Chain":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.huntMonster("swordhavenmaze", "Undead Prisoner", req.name, req.quantity, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    break;
                case "90 Degree Rotator":

                case "Extinction Artist's Pigment":

                case "Aspiring Extinction Aficionado":

                case "Extinction Artist's Hair":

                case "Extinction Artista's Locks":

                case "Instrument of Destruction":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("swordhavenmaze", "Aficionado Cosima", req.name, req.quantity, {
                        isTemp: req.temp,
                    });
                    bot.wait.forPickup(req.name);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("swordhavenmaze", 2740, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "102018",
            "Extinction Artist Aficionado",
            'Mode: [select] only\nShould the bot buy "Extinction Artist Aficionado" ?',
            false,
        ),
        option.bool(
            "102028",
            "House Volkov Uniform",
            'Mode: [select] only\nShould the bot buy "House Volkov Uniform" ?',
            false,
        ),
        option.bool(
            "102029",
            "House Volkov Ceremonial Uniform",
            'Mode: [select] only\nShould the bot buy "House Volkov Ceremonial Uniform" ?',
            false,
        ),
        option.bool(
            "102035",
            "Ruby Rapiers of Volkov",
            'Mode: [select] only\nShould the bot buy "Ruby Rapiers of Volkov" ?',
            false,
        ),
        option.bool(
            "102030",
            "Volkov Warrior Morph",
            'Mode: [select] only\nShould the bot buy "Volkov Warrior Morph" ?',
            false,
        ),
        option.bool(
            "102031",
            "Volkov Warrior Visage",
            'Mode: [select] only\nShould the bot buy "Volkov Warrior Visage" ?',
            false,
        ),
        option.bool(
            "102032",
            "Volkov Warrior Cap",
            'Mode: [select] only\nShould the bot buy "Volkov Warrior Cap" ?',
            false,
        ),
        option.bool(
            "102033",
            "Volkov Warrior Cap + Locks",
            'Mode: [select] only\nShould the bot buy "Volkov Warrior Cap + Locks" ?',
            false,
        ),
        option.bool(
            "102019",
            "Jubilant Artist's Mask",
            'Mode: [select] only\nShould the bot buy "Jubilant Artist\'s Mask" ?',
            false,
        ),
        option.bool(
            "102020",
            "Jubilant Artist's Shadow Mask",
            'Mode: [select] only\nShould the bot buy "Jubilant Artist\'s Shadow Mask" ?',
            false,
        ),
        option.bool(
            "102022",
            "Jubilant Artista's Mask",
            'Mode: [select] only\nShould the bot buy "Jubilant Artista\'s Mask" ?',
            false,
        ),
        option.bool(
            "102023",
            "Jubilant Artista's Shadow Mask",
            'Mode: [select] only\nShould the bot buy "Jubilant Artista\'s Shadow Mask" ?',
            false,
        ),
        option.bool(
            "102027",
            "Instrument of Extinction",
            'Mode: [select] only\nShould the bot buy "Instrument of Extinction" ?',
            false,
        ),
        option.bool(
            "102025",
            "Extinction Artist's Brush",
            'Mode: [select] only\nShould the bot buy "Extinction Artist\'s Brush" ?',
            false,
        ),
        option.bool(
            "102034",
            "Ruby Rapier of Volkov",
            'Mode: [select] only\nShould the bot buy "Ruby Rapier of Volkov" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SwordhavenMazeMerge.select,
});

export default function main(): void {
    const script = new SwordhavenMazeMerge();
    Core.bankingBlackList.push(
        "Aspiring Extinction Aficionado",
        "Extinction Artist's Pigment",
        "Feral Boar's Hide",
        "Ghost's Garment",
        "Prisoner's Chain",
        "Extinction Artist's Hair",
        "Extinction Artista's Locks",
        "90 Degree Rotator",
        "Instrument of Destruction",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
