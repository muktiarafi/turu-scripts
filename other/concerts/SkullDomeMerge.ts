/*
name: Skull Dome Merge
description: This bot will farm the items belonging to the selected mode for the Skull Dome Merge [2312] in /skulldome
tags: skull, dome, merge, skulldome, diabolical, techwear, punk, shave, aviators, , street, summer, bag, guitar, delinquent, bat, bats, necrobard, apprentice, bony, cap, necrotic, tune, resting, ribcage, sickle, undead, masses, sickles, bone, basher, reverb, al, fine, neo, metal, necro
*/
// Port of Scripts/Other/Concerts/SkullDomeMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { BattleConcertClassQuests } from "./BattleConcert2023";

const Adv = new CoreAdvanced();
const BCCQ = new BattleConcertClassQuests();

export class SkullDomeMerge {
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
                case "Bone Pick":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(9327);
                        Core.huntMonster("brainmeat", "Brain Matter", "Brain Matter", undefined, { log: false });
                        Core.ensureComplete(9327);
                    }
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                case "Cursed Fabric":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("skullhall", "Necroupie", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Rotten Meat":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("brainmeat", "Brain Matter", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Metanoia Shaggy Locks":

                case "Metanoia Shag":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("skullarena", "Bellum", req.name, quant, { isTemp: false, log: false });
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        BCCQ.battleConcertQuests();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("skulldome", 2312, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "78040",
            "Diabolical Techwear",
            'Mode: [select] only\nShould the bot buy "Diabolical Techwear" ?',
            false,
        ),
        option.bool(
            "78041",
            "Diabolical Punk Shave",
            'Mode: [select] only\nShould the bot buy "Diabolical Punk Shave" ?',
            false,
        ),
        option.bool(
            "78042",
            "Diabolical Punk Locks",
            'Mode: [select] only\nShould the bot buy "Diabolical Punk Locks" ?',
            false,
        ),
        option.bool(
            "78043",
            "Diabolical Aviators",
            'Mode: [select] only\nShould the bot buy "Diabolical Aviators" ?',
            false,
        ),
        option.bool(
            "78044",
            "Diabolical Aviators + Locks",
            'Mode: [select] only\nShould the bot buy "Diabolical Aviators + Locks" ?',
            false,
        ),
        option.bool(
            "78045",
            "Diabolical Street Mask",
            'Mode: [select] only\nShould the bot buy "Diabolical Street Mask" ?',
            false,
        ),
        option.bool(
            "78046",
            "Diabolical Street Mask + Locks",
            'Mode: [select] only\nShould the bot buy "Diabolical Street Mask + Locks" ?',
            false,
        ),
        option.bool(
            "78047",
            "Diabolical Summer Bag",
            'Mode: [select] only\nShould the bot buy "Diabolical Summer Bag" ?',
            false,
        ),
        option.bool(
            "78048",
            "Diabolical Guitar",
            'Mode: [select] only\nShould the bot buy "Diabolical Guitar" ?',
            false,
        ),
        option.bool(
            "78049",
            "Diabolical Delinquent Bat",
            'Mode: [select] only\nShould the bot buy "Diabolical Delinquent Bat" ?',
            false,
        ),
        option.bool(
            "78050",
            "Diabolical Delinquent Bats",
            'Mode: [select] only\nShould the bot buy "Diabolical Delinquent Bats" ?',
            false,
        ),
        option.bool("78924", "Necrobard", 'Mode: [select] only\nShould the bot buy "Necrobard" ?', false),
        option.bool(
            "78925",
            "Apprentice Necrobard",
            'Mode: [select] only\nShould the bot buy "Apprentice Necrobard" ?',
            false,
        ),
        option.bool(
            "78926",
            "Bony Necrobard Cap",
            'Mode: [select] only\nShould the bot buy "Bony Necrobard Cap" ?',
            false,
        ),
        option.bool(
            "78927",
            "Bony Necrobard Cap and Locks",
            'Mode: [select] only\nShould the bot buy "Bony Necrobard Cap and Locks" ?',
            false,
        ),
        option.bool("78928", "Necrotic Tune", 'Mode: [select] only\nShould the bot buy "Necrotic Tune" ?', false),
        option.bool(
            "78929",
            "Resting Ribcage Guitar",
            'Mode: [select] only\nShould the bot buy "Resting Ribcage Guitar" ?',
            false,
        ),
        option.bool("78930", "Ribcage Guitar", 'Mode: [select] only\nShould the bot buy "Ribcage Guitar" ?', false),
        option.bool(
            "78931",
            "Sickle of the Undead Masses",
            'Mode: [select] only\nShould the bot buy "Sickle of the Undead Masses" ?',
            false,
        ),
        option.bool(
            "78932",
            "Sickles of the Undead Masses",
            'Mode: [select] only\nShould the bot buy "Sickles of the Undead Masses" ?',
            false,
        ),
        option.bool(
            "78959",
            "Bone Basher Reverb",
            'Mode: [select] only\nShould the bot buy "Bone Basher Reverb" ?',
            false,
        ),
        option.bool("78855", "Al Fine Hair", 'Mode: [select] only\nShould the bot buy "Al Fine Hair" ?', false),
        option.bool("78856", "Al Fine Locks", 'Mode: [select] only\nShould the bot buy "Al Fine Locks" ?', false),
        option.bool("78967", "Neo Metal Necro", 'Mode: [select] only\nShould the bot buy "Neo Metal Necro" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SkullDomeMerge.select,
});

export default function main(): void {
    const script = new SkullDomeMerge();
    Core.bankingBlackList.push("Bone Pick", "Cursed Fabric", "Rotten Meat", "Metanoia Shag", "Metanoia Shaggy Locks");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
