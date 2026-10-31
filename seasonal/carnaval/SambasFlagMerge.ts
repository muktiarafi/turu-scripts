/*
name: Sambas Flag Merge
description: This bot will farm the items belonging to the selected mode for the Sambas Flag Merge [2237] in /sambaflag
tags: sambas, flag, merge, sambaflag, sambista, dorival, moglin, jorge, zeca, encanto, encantado, cavaquinho, pandeiro, tantan, dança, das, sombras, dançarina, circlet, diadem, de, ouro, escuro
*/
// Port of Scripts/Seasonal/Carnaval/SambasFlagMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { SambasFlag } from "./SambaFlag";

const Adv = new CoreAdvanced();
const SF = new SambasFlag();

export class SambasFlagMerge {
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
                case "Ceremonial Standard":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9115);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("sambaflag", "Flag Bearer", "Flag Standard");
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("sambaflag", "Master Of Ceremonies", "Ceremony Feather");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Costume Piece":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9110);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("bloodtusk", "Jungle Vulture", "Vulture Feathers", 8);
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("bloodtusk", "Rhison", "Rhison Fur", 8);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Pandeiro":

                case "Tantan":

                case "Cavaquinho":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("sambaflag", "Master Of Ceremonies", req.name, quant);
                    bot.wait.forPickup(req.name);
                    break;
                case "Dança das Sombras Hair":

                case "Dança das Sombras Locks":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("sambaflag", "Flag Bearer", req.name, quant, { isTemp: req.temp, log: false });
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("Sambaflag")) {
            return;
        }

        //story for materials quest.
        SF.storyLine();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("sambaflag", 2237, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("76366", "Sambista Armor", 'Mode: [select] only\nShould the bot buy "Sambista Armor" ?', false),
        option.bool("76367", "Sambista Helm", 'Mode: [select] only\nShould the bot buy "Sambista Helm" ?', false),
        option.bool(
            "76371",
            "Dorival The Moglin",
            'Mode: [select] only\nShould the bot buy "Dorival The Moglin" ?',
            false,
        ),
        option.bool("76372", "Jorge The Moglin", 'Mode: [select] only\nShould the bot buy "Jorge The Moglin" ?', false),
        option.bool("76373", "Zeca The Moglin", 'Mode: [select] only\nShould the bot buy "Zeca The Moglin" ?', false),
        option.bool(
            "76375",
            "Encanto Sambista Armor",
            'Mode: [select] only\nShould the bot buy "Encanto Sambista Armor" ?',
            false,
        ),
        option.bool(
            "76376",
            "Encantado Sambista Hat",
            'Mode: [select] only\nShould the bot buy "Encantado Sambista Hat" ?',
            false,
        ),
        option.bool(
            "76377",
            "Encantado Cavaquinho",
            'Mode: [select] only\nShould the bot buy "Encantado Cavaquinho" ?',
            false,
        ),
        option.bool(
            "76378",
            "Encantado Pandeiro",
            'Mode: [select] only\nShould the bot buy "Encantado Pandeiro" ?',
            false,
        ),
        option.bool("76379", "Encantado Tantan", 'Mode: [select] only\nShould the bot buy "Encantado Tantan" ?', false),
        option.bool(
            "99284",
            "Dança das Sombras",
            'Mode: [select] only\nShould the bot buy "Dança das Sombras" ?',
            false,
        ),
        option.bool(
            "99287",
            "Dança das Sombras Mask",
            'Mode: [select] only\nShould the bot buy "Dança das Sombras Mask" ?',
            false,
        ),
        option.bool(
            "99288",
            "Dançarina das Sombras Mask",
            'Mode: [select] only\nShould the bot buy "Dançarina das Sombras Mask" ?',
            false,
        ),
        option.bool(
            "99289",
            "Dança das Sombras Circlet",
            'Mode: [select] only\nShould the bot buy "Dança das Sombras Circlet" ?',
            false,
        ),
        option.bool(
            "99290",
            "Dança das Sombras Diadem",
            'Mode: [select] only\nShould the bot buy "Dança das Sombras Diadem" ?',
            false,
        ),
        option.bool(
            "99291",
            "Dança das Sombras Visage",
            'Mode: [select] only\nShould the bot buy "Dança das Sombras Visage" ?',
            false,
        ),
        option.bool(
            "99389",
            "Tantan de Ouro Encantado",
            'Mode: [select] only\nShould the bot buy "Tantan de Ouro Encantado" ?',
            false,
        ),
        option.bool("99463", "Tantan Escuro", 'Mode: [select] only\nShould the bot buy "Tantan Escuro" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SambasFlagMerge.select,
});

export default function main(): void {
    const script = new SambasFlagMerge();
    Core.bankingBlackList.push(
        "Costume Piece",
        "Ceremonial Standard",
        "Cavaquinho",
        "Pandeiro",
        "Tantan",
        "Dança das Sombras Hair",
        "Dança das Sombras Locks",
    );

    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
