/*
name: Mogloween Seasonal Merge
description: This will merge all the Mogloween seasonal scripts into one.
tags: story, quest, mogloween, seasonal, merge
*/
// Port of Scripts/Seasonal/Mogloween/MergeShops/MogloweenSeasonalMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreLegion } from "../../../legion/CoreLegion";
import { CoreNation } from "../../../nation/CoreNation";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();
const Nation = new CoreNation();

export class MogloweenSeasonalMerge {
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
                case "Lol-E-Pop":

                case "Box-o-Chocolates":

                case "Candy Corn":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("candycorn", "r2", "Right", "*", req.name, quant, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Ghostly Cape":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("mogloween", "Ghostly Sheet", req.name, undefined, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Cursed Bone Club":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("candycorn", "Stalkwalker", req.name, undefined, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Ivy Blade":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("mogloween", "Pumpkinhead Fred", req.name, undefined, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Blister's Chainsaw":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("mogloween", "Blister", req.name, undefined, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                case "Medusa Curse":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.buyItem("mogloween", 30, req.name);
                    bot.wait.forPickup(req.name);
                    break;
                case "Sinister Pumpkin Sickles":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("candycorn", "Field Guardian", req.name, undefined, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Great Pumpkin King Sword":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("mogloween", "Great Pumpkin King", req.name, undefined, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
                case "Diamond of Nulgath":
                    Nation.farmDiamondofNulgath(quant);
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("mogloween")) {
            return;
        }
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("mogloween", 223, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("36738", "Witch's Hat", 'Mode: [select] only\nShould the bot buy "Witch\'s Hat" ?', false),
        option.bool("36739", "Vampire Cape", 'Mode: [select] only\nShould the bot buy "Vampire Cape" ?', false),
        option.bool(
            "36740",
            "Sad Jack o' Face",
            'Mode: [select] only\nShould the bot buy "Sad Jack o\' Face" ?',
            false,
        ),
        option.bool("36741", "Mummy Face", 'Mode: [select] only\nShould the bot buy "Mummy Face" ?', false),
        option.bool(
            "36742",
            "Happy Jack o' Face",
            'Mode: [select] only\nShould the bot buy "Happy Jack o\' Face" ?',
            false,
        ),
        option.bool(
            "36743",
            "Fiery Jack o' Face",
            'Mode: [select] only\nShould the bot buy "Fiery Jack o\' Face" ?',
            false,
        ),
        option.bool("36744", "Field Guardian", 'Mode: [select] only\nShould the bot buy "Field Guardian" ?', false),
        option.bool(
            "36745",
            "Field Guardian Hat",
            'Mode: [select] only\nShould the bot buy "Field Guardian Hat" ?',
            false,
        ),
        option.bool(
            "36746",
            "Field Guardian Straw Hat",
            'Mode: [select] only\nShould the bot buy "Field Guardian Straw Hat" ?',
            false,
        ),
        option.bool("36747", "Rust Man", 'Mode: [select] only\nShould the bot buy "Rust Man" ?', false),
        option.bool(
            "36748",
            "Territorial Lion Morph",
            'Mode: [select] only\nShould the bot buy "Territorial Lion Morph" ?',
            false,
        ),
        option.bool("36749", "Territorial Lion", 'Mode: [select] only\nShould the bot buy "Territorial Lion" ?', false),
        option.bool("36750", "Gourdian", 'Mode: [select] only\nShould the bot buy "Gourdian" ?', false),
        option.bool("36751", "Flying Marmoset", 'Mode: [select] only\nShould the bot buy "Flying Marmoset" ?', false),
        option.bool(
            "36752",
            "Helm of the Gourdian",
            'Mode: [select] only\nShould the bot buy "Helm of the Gourdian" ?',
            false,
        ),
        option.bool("36753", "Tainted Wings", 'Mode: [select] only\nShould the bot buy "Tainted Wings" ?', false),
        option.bool(
            "36754",
            "Putrid Meaty Club",
            'Mode: [select] only\nShould the bot buy "Putrid Meaty Club" ?',
            false,
        ),
        option.bool("36755", "Toxic Ivy Blade", 'Mode: [select] only\nShould the bot buy "Toxic Ivy Blade" ?', false),
        option.bool("36756", "Golden DeathSaw", 'Mode: [select] only\nShould the bot buy "Golden DeathSaw" ?', false),
        option.bool(
            "36757",
            "Dorian and Dorothy",
            'Mode: [select] only\nShould the bot buy "Dorian and Dorothy" ?',
            false,
        ),
        option.bool(
            "36758",
            "Cute lil Dorothy Morph",
            'Mode: [select] only\nShould the bot buy "Cute lil Dorothy Morph" ?',
            false,
        ),
        option.bool(
            "36759",
            "Sinister PumpKing Blade",
            'Mode: [select] only\nShould the bot buy "Sinister PumpKing Blade" ?',
            false,
        ),
        option.bool("36760", "Tododo", 'Mode: [select] only\nShould the bot buy "Tododo" ?', false),
        option.bool("36761", "Mummy", 'Mode: [select] only\nShould the bot buy "Mummy" ?', false),
        option.bool("36762", "Pumpkin Slicer", 'Mode: [select] only\nShould the bot buy "Pumpkin Slicer" ?', false),
        option.bool("36763", "Hekyll and Jyde", 'Mode: [select] only\nShould the bot buy "Hekyll and Jyde" ?', false),
        option.bool(
            "36764",
            "Hanging Lantern Staff",
            'Mode: [select] only\nShould the bot buy "Hanging Lantern Staff" ?',
            false,
        ),
        option.bool(
            "36765",
            "Pink Gummi Were-bear and Lolly",
            'Mode: [select] only\nShould the bot buy "Pink Gummi Were-bear and Lolly" ?',
            false,
        ),
        option.bool("36766", "Jack O Scythe", 'Mode: [select] only\nShould the bot buy "Jack O Scythe" ?', false),
        option.bool("36767", "Jack O Stave", 'Mode: [select] only\nShould the bot buy "Jack O Stave" ?', false),
        option.bool(
            "36768",
            "Masquerade Vesture",
            'Mode: [select] only\nShould the bot buy "Masquerade Vesture" ?',
            false,
        ),
        option.bool("36769", "Masquerade Mask", 'Mode: [select] only\nShould the bot buy "Masquerade Mask" ?', false),
        option.bool(
            "36770",
            "Alea Masquerade Mask",
            'Mode: [select] only\nShould the bot buy "Alea Masquerade Mask" ?',
            false,
        ),
        option.bool(
            "36771",
            "SoulSucker Gourdhead",
            'Mode: [select] only\nShould the bot buy "SoulSucker Gourdhead" ?',
            false,
        ),
        option.bool("36772", "Gourd-O Mask", 'Mode: [select] only\nShould the bot buy "Gourd-O Mask" ?', false),
        option.bool(
            "36773",
            "CandyCorn Daggers",
            'Mode: [select] only\nShould the bot buy "CandyCorn Daggers" ?',
            false,
        ),
        option.bool("36774", "Candy Sack", 'Mode: [select] only\nShould the bot buy "Candy Sack" ?', false),
        option.bool(
            "36775",
            "Pumpkin Vine Cape",
            'Mode: [select] only\nShould the bot buy "Pumpkin Vine Cape" ?',
            false,
        ),
        option.bool(
            "36776",
            "Evolved PumpkinLord Armor",
            'Mode: [select] only\nShould the bot buy "Evolved PumpkinLord Armor" ?',
            false,
        ),
        option.bool("36777", "Mummy Mask", 'Mode: [select] only\nShould the bot buy "Mummy Mask" ?', false),
        option.bool(
            "31955",
            "Twisted Legion PumpkinLord Blade",
            'Mode: [select] only\nShould the bot buy "Twisted Legion PumpkinLord Blade" ?',
            false,
        ),
        option.bool(
            "31954",
            "Creeper Legion Helm",
            'Mode: [select] only\nShould the bot buy "Creeper Legion Helm" ?',
            false,
        ),
        option.bool(
            "31953",
            "Creeper Flame Legion Helm",
            'Mode: [select] only\nShould the bot buy "Creeper Flame Legion Helm" ?',
            false,
        ),
        option.bool(
            "31952",
            "Flaming Legion Helm",
            'Mode: [select] only\nShould the bot buy "Flaming Legion Helm" ?',
            false,
        ),
        option.bool("31951", "Evil Legion Helm", 'Mode: [select] only\nShould the bot buy "Evil Legion Helm" ?', false),
        option.bool(
            "31950",
            "Barbed Legion PumpkinLord Shroud",
            'Mode: [select] only\nShould the bot buy "Barbed Legion PumpkinLord Shroud" ?',
            false,
        ),
        option.bool(
            "31949",
            "Battered Legion PumpkinLord Shroud",
            'Mode: [select] only\nShould the bot buy "Battered Legion PumpkinLord Shroud" ?',
            false,
        ),
        option.bool(
            "31948",
            "Barbed Legion PumpkinLord Vines",
            'Mode: [select] only\nShould the bot buy "Barbed Legion PumpkinLord Vines" ?',
            false,
        ),
        option.bool(
            "31947",
            "Barbed Legion PumpkinLord Cape",
            'Mode: [select] only\nShould the bot buy "Barbed Legion PumpkinLord Cape" ?',
            false,
        ),
        option.bool(
            "31946",
            "Luminous Legion PumpkinLord Cape",
            'Mode: [select] only\nShould the bot buy "Luminous Legion PumpkinLord Cape" ?',
            false,
        ),
        option.bool(
            "36890",
            "Legion PumpkinLord",
            'Mode: [select] only\nShould the bot buy "Legion PumpkinLord" ?',
            false,
        ),
        option.bool(
            "46041",
            "Legion Pumpking Overlord",
            'Mode: [select] only\nShould the bot buy "Legion Pumpking Overlord" ?',
            false,
        ),
        option.bool(
            "46042",
            "Legion Pumpking Morph",
            'Mode: [select] only\nShould the bot buy "Legion Pumpking Morph" ?',
            false,
        ),
        option.bool(
            "46043",
            "Blade of the Pumpking Legion",
            'Mode: [select] only\nShould the bot buy "Blade of the Pumpking Legion" ?',
            false,
        ),
        option.bool(
            "46044",
            "A Gourdly Legion Spirit",
            'Mode: [select] only\nShould the bot buy "A Gourdly Legion Spirit" ?',
            false,
        ),
        option.bool(
            "50804",
            "Magical Baby Dragon Nulgath",
            'Mode: [select] only\nShould the bot buy "Magical Baby Dragon Nulgath" ?',
            false,
        ),
        option.bool("50796", "Baby Dragon Dage", 'Mode: [select] only\nShould the bot buy "Baby Dragon Dage" ?', false),
        option.bool("56942", "Spooky Kid", 'Mode: [select] only\nShould the bot buy "Spooky Kid" ?', false),
        option.bool(
            "56943",
            "Spooky Girl's Locks",
            'Mode: [select] only\nShould the bot buy "Spooky Girl\'s Locks" ?',
            false,
        ),
        option.bool(
            "56944",
            "Spooky Girl's Locks + Hat",
            'Mode: [select] only\nShould the bot buy "Spooky Girl\'s Locks + Hat" ?',
            false,
        ),
        option.bool(
            "56945",
            "Spooky Boy's Hair",
            'Mode: [select] only\nShould the bot buy "Spooky Boy\'s Hair" ?',
            false,
        ),
        option.bool(
            "56946",
            "Spooky Boy's Hair + Hat",
            'Mode: [select] only\nShould the bot buy "Spooky Boy\'s Hair + Hat" ?',
            false,
        ),
        option.bool("56947", "Spooky Axe", 'Mode: [select] only\nShould the bot buy "Spooky Axe" ?', false),
        option.bool(
            "56948",
            "Spooky Goth Outfit",
            'Mode: [select] only\nShould the bot buy "Spooky Goth Outfit" ?',
            false,
        ),
        option.bool(
            "56949",
            "Spooky Pigtails Hat + Morph",
            'Mode: [select] only\nShould the bot buy "Spooky Pigtails Hat + Morph" ?',
            false,
        ),
        option.bool(
            "56950",
            "Spooky Pigtails Morph",
            'Mode: [select] only\nShould the bot buy "Spooky Pigtails Morph" ?',
            false,
        ),
        option.bool(
            "56951",
            "Spooky Casual Morph",
            'Mode: [select] only\nShould the bot buy "Spooky Casual Morph" ?',
            false,
        ),
        option.bool(
            "56952",
            "Spooky Casual Hat + Morph",
            'Mode: [select] only\nShould the bot buy "Spooky Casual Hat + Morph" ?',
            false,
        ),
        option.bool(
            "56953",
            "Poison Bottle Sword",
            'Mode: [select] only\nShould the bot buy "Poison Bottle Sword" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: MogloweenSeasonalMerge.select,
});

export default function main(): void {
    const script = new MogloweenSeasonalMerge();
    Core.bankingBlackList.push(
        "Candy Corn",
        "Box-o-Chocolates",
        "Lol-E-Pop",
        "Ghostly Cape",
        "Cursed Bone Club",
        "Ivy Blade",
        "Blister's Chainsaw",
        "Medusa Curse",
        "Sinister Pumpkin Sickles",
        "Great Pumpkin King Sword",
        "Legion Token",
        "Diamond of Nulgath ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
