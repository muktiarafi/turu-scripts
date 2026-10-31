/*
name: Cocytus Barracks Merge
description: This bot will farm the items belonging to the selected mode for the Cocytus Barracks Merge [2421] in /cocytusbarracks
tags: cocytus, barracks, merge, cocytusbarracks, penitent, underworld, keeper, tower, bramble, blame, sullied, bangle, shield, acheron, usurper, lord, horns, halo, regalia, phantima, maiden, woe, defiler, ancients, defilers, shielded, ivory, overdriven, evocator, morph, statue, crusher, thorny, skull
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/CocytusBarracksMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreLegion } from "../../../legion/CoreLegion";
import { CoreDageBirthday } from "./CoreDageBirthday";

const Adv = new CoreAdvanced();
const CDB = new CoreDageBirthday();
const Legion = new CoreLegion();

export class CocytusBarracksMerge {
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
                case "Coin For the Dead":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9633);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("cocytusbarracks", "Maleagant", "Aestiua Shard", undefined, { log: false });
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("cocytusbarracks", "Cerberus Pup", "Phlegethon Tag", 8, { log: false });
                        Core.huntMonster("cocytusbarracks", "Mourner", "Lethe Wreath", 8, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
            }
        };
        CDB.cocytusBarracks();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("cocytusbarracks", 2421, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "84628",
            "Penitent Underworld Keeper",
            'Mode: [select] only\nShould the bot buy "Penitent Underworld Keeper" ?',
            false,
        ),
        option.bool(
            "84629",
            "Penitent Keeper Helm",
            'Mode: [select] only\nShould the bot buy "Penitent Keeper Helm" ?',
            false,
        ),
        option.bool(
            "84630",
            "Penitent Keeper Locks",
            'Mode: [select] only\nShould the bot buy "Penitent Keeper Locks" ?',
            false,
        ),
        option.bool(
            "84633",
            "Penitent Keeper Tower Helm",
            'Mode: [select] only\nShould the bot buy "Penitent Keeper Tower Helm" ?',
            false,
        ),
        option.bool(
            "84642",
            "Bramble Blame Blade",
            'Mode: [select] only\nShould the bot buy "Bramble Blame Blade" ?',
            false,
        ),
        option.bool(
            "84643",
            "Bramble Blame Blades",
            'Mode: [select] only\nShould the bot buy "Bramble Blame Blades" ?',
            false,
        ),
        option.bool(
            "84651",
            "Sullied Blame Blade and Bangle",
            'Mode: [select] only\nShould the bot buy "Sullied Blame Blade and Bangle" ?',
            false,
        ),
        option.bool(
            "84652",
            "Sullied Blame Blade and Shield",
            'Mode: [select] only\nShould the bot buy "Sullied Blame Blade and Shield" ?',
            false,
        ),
        option.bool(
            "84653",
            "Bramble Blame Blade and Shield",
            'Mode: [select] only\nShould the bot buy "Bramble Blame Blade and Shield" ?',
            false,
        ),
        option.bool(
            "84654",
            "Acheron Usurper Lord",
            'Mode: [select] only\nShould the bot buy "Acheron Usurper Lord" ?',
            false,
        ),
        option.bool(
            "84657",
            "Usurper Lord Horns",
            'Mode: [select] only\nShould the bot buy "Usurper Lord Horns" ?',
            false,
        ),
        option.bool(
            "84660",
            "Acheron Usurper Lord Halo Cape",
            'Mode: [select] only\nShould the bot buy "Acheron Usurper Lord Halo Cape" ?',
            false,
        ),
        option.bool(
            "84661",
            "Acheron Usurper Lord Regalia",
            'Mode: [select] only\nShould the bot buy "Acheron Usurper Lord Regalia" ?',
            false,
        ),
        option.bool(
            "84663",
            "Phantima, Maiden of Woe",
            'Mode: [select] only\nShould the bot buy "Phantima, Maiden of Woe" ?',
            false,
        ),
        option.bool(
            "84664",
            "Defiler of the Ancients",
            'Mode: [select] only\nShould the bot buy "Defiler of the Ancients" ?',
            false,
        ),
        option.bool(
            "84665",
            "Defilers of the Ancients",
            'Mode: [select] only\nShould the bot buy "Defilers of the Ancients" ?',
            false,
        ),
        option.bool(
            "84672",
            "Shielded Defiler of the Ancients",
            'Mode: [select] only\nShould the bot buy "Shielded Defiler of the Ancients" ?',
            false,
        ),
        option.bool(
            "84673",
            "Ivory Acheron Usurper Lord",
            'Mode: [select] only\nShould the bot buy "Ivory Acheron Usurper Lord" ?',
            false,
        ),
        option.bool(
            "84691",
            "Penitent Ivory Underworld Keeper",
            'Mode: [select] only\nShould the bot buy "Penitent Ivory Underworld Keeper" ?',
            false,
        ),
        option.bool(
            "84729",
            "Overdriven Evocator",
            'Mode: [select] only\nShould the bot buy "Overdriven Evocator" ?',
            false,
        ),
        option.bool(
            "84732",
            "Overdriven Evocator Hooded Morph",
            'Mode: [select] only\nShould the bot buy "Overdriven Evocator Hooded Morph" ?',
            false,
        ),
        option.bool(
            "84733",
            "Overdriven Evocator Hooded Visage",
            'Mode: [select] only\nShould the bot buy "Overdriven Evocator Hooded Visage" ?',
            false,
        ),
        option.bool(
            "84693",
            "Penitent Ivory Keeper Locks",
            'Mode: [select] only\nShould the bot buy "Penitent Ivory Keeper Locks" ?',
            false,
        ),
        option.bool(
            "84696",
            "Penitent Ivory Keeper Tower Helm",
            'Mode: [select] only\nShould the bot buy "Penitent Ivory Keeper Tower Helm" ?',
            false,
        ),
        option.bool(
            "84705",
            "Bramble Ivory Blame Blade",
            'Mode: [select] only\nShould the bot buy "Bramble Ivory Blame Blade" ?',
            false,
        ),
        option.bool(
            "84706",
            "Bramble Ivory Blame Blades",
            'Mode: [select] only\nShould the bot buy "Bramble Ivory Blame Blades" ?',
            false,
        ),
        option.bool(
            "84714",
            "Ivory Blame Blade and Bangle",
            'Mode: [select] only\nShould the bot buy "Ivory Blame Blade and Bangle" ?',
            false,
        ),
        option.bool(
            "84715",
            "Ivory Blame Blade and Shield",
            'Mode: [select] only\nShould the bot buy "Ivory Blame Blade and Shield" ?',
            false,
        ),
        option.bool(
            "84716",
            "Bramble Ivory Blame Blade and Shield",
            'Mode: [select] only\nShould the bot buy "Bramble Ivory Blame Blade and Shield" ?',
            false,
        ),
        option.bool(
            "84679",
            "Ivory Usurper Lord Halo Cape",
            'Mode: [select] only\nShould the bot buy "Ivory Usurper Lord Halo Cape" ?',
            false,
        ),
        option.bool(
            "84688",
            "Shielded Ivory Defiler of the Ancients",
            'Mode: [select] only\nShould the bot buy "Shielded Ivory Defiler of the Ancients" ?',
            false,
        ),
        option.bool(
            "84680",
            "Ivory Defiler of the Ancients",
            'Mode: [select] only\nShould the bot buy "Ivory Defiler of the Ancients" ?',
            false,
        ),
        option.bool(
            "84681",
            "Ivory Defilers of the Ancients",
            'Mode: [select] only\nShould the bot buy "Ivory Defilers of the Ancients" ?',
            false,
        ),
        option.bool(
            "84676",
            "Ivory Usurper Lord Horns",
            'Mode: [select] only\nShould the bot buy "Ivory Usurper Lord Horns" ?',
            false,
        ),
        option.bool(
            "84692",
            "Penitent Ivory Keeper Helm",
            'Mode: [select] only\nShould the bot buy "Penitent Ivory Keeper Helm" ?',
            false,
        ),
        option.bool(
            "84690",
            "Ivory Usurper Lord Statue",
            'Mode: [select] only\nShould the bot buy "Ivory Usurper Lord Statue" ?',
            false,
        ),
        option.bool(
            "84689",
            "Crusher of the Ancients Statue",
            'Mode: [select] only\nShould the bot buy "Crusher of the Ancients Statue" ?',
            false,
        ),
        option.bool(
            "84677",
            "Thorny Ivory Usurper Lord Skull",
            'Mode: [select] only\nShould the bot buy "Thorny Ivory Usurper Lord Skull" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CocytusBarracksMerge.select,
});

export default function main(): void {
    const script = new CocytusBarracksMerge();
    Core.bankingBlackList.push("Coin For the Dead", "Legion Token");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
