/*
name: Dage Recruit Merge
description: This will complete the Dage Recruit story and farm Dark Victory Seals.
tags: story, quest, dage, recruit, legion, dark-victory-seal, merge, staff, birthday
*/
// Port of Scripts/Legion/MergeShops/DageRecruitMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { CoreLegion } from "../CoreLegion";
import { DarkWarLegionandNation } from "../../story/legion/DarkWarLegionandNation";

const Story = new CoreStory();
const Adv = new CoreAdvanced();
const Legion = new CoreLegion();
const DWLaN = new DarkWarLegionandNation();

export class DageRecruitMerge {
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
                case "Dark Victory Seal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8576);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        if (!Story.questProgression(8576)) {
                            Core.ensureAccept(8576);
                            Core.huntMonster("dagerecruit", "Dark Makai", "Dark Makai Defeated", 6);
                            Core.huntMonster("dagerecruit", "Dreadfiend", "Dreadfiend Defeated", 6);
                            Core.huntMonster("dagerecruit", "Bloodfiend", "Bloodfiend Defeated", 6);
                            Core.huntMonster("dagerecruit", "Infernal Fiend", "Infernal Fiend Defeated", 6);
                            Core.ensureComplete(8576);
                        }
                        Core.huntMonster("dagerecruit", "Dark Makai", "Dark Makai Defeated", 6);
                        Core.huntMonster("dagerecruit", "Dreadfiend", "Dreadfiend Defeated", 6);
                        Core.huntMonster("dagerecruit", "Bloodfiend", "Bloodfiend Defeated", 6);
                        Core.huntMonster("dagerecruit", "Infernal Fiend", "Infernal Fiend Defeated", 6);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Legion Token":
                    Core.farmingLogger(req.name, quant);
                    Legion.farmLegionToken(quant);
                    break;
                case "Underworld Asgardian Helm":

                case "Underworld Asgardian Cape":

                case "Underworld Asgardian Sword":

                case "Underworld DeathSpine":

                case "Underworld Asgardian Mace":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("dagerecruit", "Hebimaru", req.name, undefined, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Underworld Oni's Naginata":

                case "Underworld Oni's Blade":

                case "Underworld Oni's Blades":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("dagerecruit", "Nuckelavee", req.name, undefined, { isTemp: false });
                    break;
            }
        };
        DWLaN.darkWarLegion();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("dagerecruit", 2119, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "68275",
            "Legion DeathFiend",
            'Mode: [select] only\nShould the bot buy "Legion DeathFiend" ?',
            false,
        ),
        option.bool(
            "68276",
            "Legion DeathFiend's Hood",
            'Mode: [select] only\nShould the bot buy "Legion DeathFiend\'s Hood" ?',
            false,
        ),
        option.bool(
            "68277",
            "Legion DeathFiend's Gaze",
            'Mode: [select] only\nShould the bot buy "Legion DeathFiend\'s Gaze" ?',
            false,
        ),
        option.bool(
            "68278",
            "Legion DeathFiend's Skull",
            'Mode: [select] only\nShould the bot buy "Legion DeathFiend\'s Skull" ?',
            false,
        ),
        option.bool(
            "68279",
            "Legion DeathFiend's Mask",
            'Mode: [select] only\nShould the bot buy "Legion DeathFiend\'s Mask" ?',
            false,
        ),
        option.bool(
            "68280",
            "Legion DeathFiend's Horns",
            'Mode: [select] only\nShould the bot buy "Legion DeathFiend\'s Horns" ?',
            false,
        ),
        option.bool(
            "68281",
            "Legion DeathFiend's Rune",
            'Mode: [select] only\nShould the bot buy "Legion DeathFiend\'s Rune" ?',
            false,
        ),
        option.bool(
            "68282",
            "Legion DeathFiend's Cape",
            'Mode: [select] only\nShould the bot buy "Legion DeathFiend\'s Cape" ?',
            false,
        ),
        option.bool(
            "68283",
            "Legion DeathFiend's Spear",
            'Mode: [select] only\nShould the bot buy "Legion DeathFiend\'s Spear" ?',
            false,
        ),
        option.bool(
            "68284",
            "Legion DeathFiend's Scythe",
            'Mode: [select] only\nShould the bot buy "Legion DeathFiend\'s Scythe" ?',
            false,
        ),
        option.bool(
            "68285",
            "Legion DeathFiend's Morningstar",
            'Mode: [select] only\nShould the bot buy "Legion DeathFiend\'s Morningstar" ?',
            false,
        ),
        option.bool(
            "68286",
            "Legion DeathFiend's Morningstars",
            'Mode: [select] only\nShould the bot buy "Legion DeathFiend\'s Morningstars" ?',
            false,
        ),
        option.bool("68322", "Legion Conqueror", 'Mode: [select] only\nShould the bot buy "Legion Conqueror" ?', false),
        option.bool(
            "68323",
            "Legion Conqueror Horns",
            'Mode: [select] only\nShould the bot buy "Legion Conqueror Horns" ?',
            false,
        ),
        option.bool(
            "68324",
            "Legion Conqueror Helm",
            'Mode: [select] only\nShould the bot buy "Legion Conqueror Helm" ?',
            false,
        ),
        option.bool(
            "68325",
            "Legion Conqueror Cape",
            'Mode: [select] only\nShould the bot buy "Legion Conqueror Cape" ?',
            false,
        ),
        option.bool(
            "68326",
            "Legion Conqueror Cape + Sword",
            'Mode: [select] only\nShould the bot buy "Legion Conqueror Cape + Sword" ?',
            false,
        ),
        option.bool(
            "68327",
            "Legion Conqueror Sword",
            'Mode: [select] only\nShould the bot buy "Legion Conqueror Sword" ?',
            false,
        ),
        option.bool(
            "68328",
            "Legion Conqueror Swords",
            'Mode: [select] only\nShould the bot buy "Legion Conqueror Swords" ?',
            false,
        ),
        option.bool(
            "68329",
            "Legion Conqueror Mace",
            'Mode: [select] only\nShould the bot buy "Legion Conqueror Mace" ?',
            false,
        ),
        option.bool(
            "68330",
            "Legion Conqueror Sword + Shield",
            'Mode: [select] only\nShould the bot buy "Legion Conqueror Sword + Shield" ?',
            false,
        ),
        option.bool(
            "68331",
            "Legion Conqueror Battle Gear",
            'Mode: [select] only\nShould the bot buy "Legion Conqueror Battle Gear" ?',
            false,
        ),
        option.bool(
            "68332",
            "Legion DeathSpines",
            'Mode: [select] only\nShould the bot buy "Legion DeathSpines" ?',
            false,
        ),
        option.bool(
            "68333",
            "Legion DeathSpine",
            'Mode: [select] only\nShould the bot buy "Legion DeathSpine" ?',
            false,
        ),
        option.bool(
            "68789",
            "Legion Dread Knight's Burning Skull",
            'Mode: [select] only\nShould the bot buy "Legion Dread Knight\'s Burning Skull" ?',
            false,
        ),
        option.bool(
            "68790",
            "Legion Dread Knight's Burning Crown",
            'Mode: [select] only\nShould the bot buy "Legion Dread Knight\'s Burning Crown" ?',
            false,
        ),
        option.bool(
            "68309",
            "Underworld Asgardian Horns",
            'Mode: [select] only\nShould the bot buy "Underworld Asgardian Horns" ?',
            false,
        ),
        option.bool(
            "68312",
            "Underworld Asgardian Cape + Sword",
            'Mode: [select] only\nShould the bot buy "Underworld Asgardian Cape + Sword" ?',
            false,
        ),
        option.bool(
            "68315",
            "Underworld Asgardian Swords",
            'Mode: [select] only\nShould the bot buy "Underworld Asgardian Swords" ?',
            false,
        ),
        option.bool(
            "68317",
            "Underworld Asgardian Battle Gear",
            'Mode: [select] only\nShould the bot buy "Underworld Asgardian Battle Gear" ?',
            false,
        ),
        option.bool(
            "68318",
            "Underworld Asgardian Sword + Shield",
            'Mode: [select] only\nShould the bot buy "Underworld Asgardian Sword + Shield" ?',
            false,
        ),
        option.bool(
            "68319",
            "Underworld DeathSpines",
            'Mode: [select] only\nShould the bot buy "Underworld DeathSpines" ?',
            false,
        ),
        option.bool(
            "68321",
            "Underworld Asgardian Gauntlets",
            'Mode: [select] only\nShould the bot buy "Underworld Asgardian Gauntlets" ?',
            false,
        ),
        option.bool("68538", "Underworld Oni", 'Mode: [select] only\nShould the bot buy "Underworld Oni" ?', false),
        option.bool(
            "68539",
            "Underworld Oni's Helm",
            'Mode: [select] only\nShould the bot buy "Underworld Oni\'s Helm" ?',
            false,
        ),
        option.bool(
            "68542",
            "Underworld Oni's Burning Blade",
            'Mode: [select] only\nShould the bot buy "Underworld Oni\'s Burning Blade" ?',
            false,
        ),
        option.bool(
            "68543",
            "Underworld Oni's Burning Blades",
            'Mode: [select] only\nShould the bot buy "Underworld Oni\'s Burning Blades" ?',
            false,
        ),
        option.bool(
            "68546",
            "Underworld Oni's Burning Naginata",
            'Mode: [select] only\nShould the bot buy "Underworld Oni\'s Burning Naginata" ?',
            false,
        ),
        option.bool(
            "68805",
            "Legion Dread Knight",
            'Mode: [select] only\nShould the bot buy "Legion Dread Knight" ?',
            false,
        ),
        option.bool(
            "68944",
            "Dread Knight's Apprentice Blade",
            'Mode: [select] only\nShould the bot buy "Dread Knight\'s Apprentice Blade" ?',
            false,
        ),
        option.bool(
            "68945",
            "Dread Knight's Acolyte Blade",
            'Mode: [select] only\nShould the bot buy "Dread Knight\'s Acolyte Blade" ?',
            false,
        ),
        option.bool(
            "68946",
            "Dread Knight's Master Blade",
            'Mode: [select] only\nShould the bot buy "Dread Knight\'s Master Blade" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DageRecruitMerge.select,
});

export default function main(): void {
    const script = new DageRecruitMerge();
    Core.bankingBlackList.push(
        "Dark Victory Seal",
        "Legion Token",
        "Underworld Asgardian Helm",
        "Underworld Asgardian Cape",
        "Underworld Asgardian Sword",
        "Underworld Asgardian Mace",
        "Underworld DeathSpine",
        "Underworld Oni's Blade",
        "Underworld Oni's Blades",
        "Underworld Oni's Naginata ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
