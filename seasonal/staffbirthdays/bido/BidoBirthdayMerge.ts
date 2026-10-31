/*
name: Bido Birthday Merge
description: This bot will farm the items belonging to the selected mode for the Bido Birthday Merge [1735] in /akiba
tags: bido, birthday, merge, akiba, bidos, fireflies, toxic, alchemist, wings, alchemical, onyx, reversed, katana, katanas, backblades, seal, balance, amber, bloodriver, alchemists, adornments, fists, diviner, spear, rogue, bandana, , scarf, pixel, on, your, back, venom, noxious, royal, lance
*/
// Port of Scripts/Seasonal/StaffBirthdays/Bido/BidoBirthdayMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class BidoBirthdayMerge {
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
                case "Concentrated Mana":

                case "Bits of Cloth":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(6979);
                        Core.huntMonster("prison", "Piggy Drake", "Broken Piggy Bank");
                        Core.ensureComplete(6979);
                    }
                    Core.join("akiba", "r1", "Right", { publicRoom: false });
                    break;
                case "Green Scrap":

                case "Scrap Metal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(6978);
                        Core.huntMonster("newbie", "Slime", "Hidden Giftbox", 5);
                        Core.huntMonster("noobshire", "Kittarian Mouse Eater", "Decorated Box", 5);
                        Core.ensureComplete(6978);
                    }
                    Core.join("akiba", "r1", "Right", { publicRoom: false });
                    break;
                case "Bido's Appreciation":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(6980);
                        Core.huntMonster("well", "Gell Oh No", "Piece of Gell Oh No Perfectly Slushied");
                        Core.huntMonster("ashfallcamp", "Smoldur", "Smoldur's Shedded Scales", 4);
                        Core.ensureComplete(6980);
                    }
                    Core.join("akiba", "r1", "Right", { publicRoom: false });
                    break;
                case "Unknown Alloy":
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Adv.buyItem("alchemyacademy", 2036, 62749, quant, 8777, undefined, false);
                        Adv.buyItem("alchemyacademy", 2114, req.name, quant, undefined, undefined, false);
                    }
                    Core.join("akiba", "r1", "Right", { publicRoom: false });
                    break;
                case "Monster Trophy":
                    Core.huntMonster("towerofdoom", "Dread Klunk", req.name, quant, { isTemp: false });
                    Core.join("akiba", "r1", "Right", { publicRoom: false });
                    break;
                case "Alteon the Imbalanced":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("brightfortress", "Imbalanced Alteon", req.name, quant, { isTemp: false });
                    Core.join("akiba", "r1", "Right", { publicRoom: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("akiba", 1735, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "49049",
            "Bido's Fireflies",
            'Mode: [select] only\nShould the bot buy "Bido\'s Fireflies" ?',
            false,
        ),
        option.bool(
            "49046",
            "Toxic Alchemist Hair",
            'Mode: [select] only\nShould the bot buy "Toxic Alchemist Hair" ?',
            false,
        ),
        option.bool(
            "49047",
            "Toxic Alchemist Locks",
            'Mode: [select] only\nShould the bot buy "Toxic Alchemist Locks" ?',
            false,
        ),
        option.bool("49070", "Toxic Runes", 'Mode: [select] only\nShould the bot buy "Toxic Runes" ?', false),
        option.bool(
            "49048",
            "Toxic Alchemist Wings",
            'Mode: [select] only\nShould the bot buy "Toxic Alchemist Wings" ?',
            false,
        ),
        option.bool(
            "49068",
            "Alchemical Onyx Daggers",
            'Mode: [select] only\nShould the bot buy "Alchemical Onyx Daggers" ?',
            false,
        ),
        option.bool(
            "49067",
            "Alchemical Onyx Reversed Daggers",
            'Mode: [select] only\nShould the bot buy "Alchemical Onyx Reversed Daggers" ?',
            false,
        ),
        option.bool(
            "49064",
            "Alchemical Onyx Blade",
            'Mode: [select] only\nShould the bot buy "Alchemical Onyx Blade" ?',
            false,
        ),
        option.bool(
            "49065",
            "Alchemical Onyx Katana",
            'Mode: [select] only\nShould the bot buy "Alchemical Onyx Katana" ?',
            false,
        ),
        option.bool(
            "49092",
            "Dual Alchemical Onyx Katanas",
            'Mode: [select] only\nShould the bot buy "Dual Alchemical Onyx Katanas" ?',
            false,
        ),
        option.bool(
            "49069",
            "Alchemical Onyx Staff",
            'Mode: [select] only\nShould the bot buy "Alchemical Onyx Staff" ?',
            false,
        ),
        option.bool(
            "49071",
            "Toxic Aura Backblades",
            'Mode: [select] only\nShould the bot buy "Toxic Aura Backblades" ?',
            false,
        ),
        option.bool("49081", "Seal of Balance", 'Mode: [select] only\nShould the bot buy "Seal of Balance" ?', false),
        option.bool("49061", "Toxic Aura Blade", 'Mode: [select] only\nShould the bot buy "Toxic Aura Blade" ?', false),
        option.bool(
            "49062",
            "Alchemical Aura Blade",
            'Mode: [select] only\nShould the bot buy "Alchemical Aura Blade" ?',
            false,
        ),
        option.bool("49063", "Amber Aura Blade", 'Mode: [select] only\nShould the bot buy "Amber Aura Blade" ?', false),
        option.bool("49060", "Toxic Bloodriver", 'Mode: [select] only\nShould the bot buy "Toxic Bloodriver" ?', false),
        option.bool(
            "49044",
            "Toxic Alchemists Adornments",
            'Mode: [select] only\nShould the bot buy "Toxic Alchemists Adornments" ?',
            false,
        ),
        option.bool("49045", "Toxic Rune Fists", 'Mode: [select] only\nShould the bot buy "Toxic Rune Fists" ?', false),
        option.bool(
            "55694",
            "Toxic Diviner Hair",
            'Mode: [select] only\nShould the bot buy "Toxic Diviner Hair" ?',
            false,
        ),
        option.bool(
            "55695",
            "Toxic Diviner Rune",
            'Mode: [select] only\nShould the bot buy "Toxic Diviner Rune" ?',
            false,
        ),
        option.bool(
            "55696",
            "Toxic Diviner Blade",
            'Mode: [select] only\nShould the bot buy "Toxic Diviner Blade" ?',
            false,
        ),
        option.bool(
            "55697",
            "Toxic Diviner Spear",
            'Mode: [select] only\nShould the bot buy "Toxic Diviner Spear" ?',
            false,
        ),
        option.bool(
            "71065",
            "Toxic Alchemist Rogue",
            'Mode: [select] only\nShould the bot buy "Toxic Alchemist Rogue" ?',
            false,
        ),
        option.bool(
            "71066",
            "Toxic Alchemist's Bandana",
            'Mode: [select] only\nShould the bot buy "Toxic Alchemist\'s Bandana" ?',
            false,
        ),
        option.bool(
            "71067",
            "Toxic Alchemist's Bandana + Locks",
            'Mode: [select] only\nShould the bot buy "Toxic Alchemist\'s Bandana + Locks" ?',
            false,
        ),
        option.bool(
            "71068",
            "Toxic Alchemist's Scarf",
            'Mode: [select] only\nShould the bot buy "Toxic Alchemist\'s Scarf" ?',
            false,
        ),
        option.bool(
            "71069",
            "Toxic Alchemist's Scarf + Locks",
            'Mode: [select] only\nShould the bot buy "Toxic Alchemist\'s Scarf + Locks" ?',
            false,
        ),
        option.bool(
            "71070",
            "Pixel On Your Back",
            'Mode: [select] only\nShould the bot buy "Pixel On Your Back" ?',
            false,
        ),
        option.bool(
            "71071",
            "Toxic Alchemist's Venom Blade",
            'Mode: [select] only\nShould the bot buy "Toxic Alchemist\'s Venom Blade" ?',
            false,
        ),
        option.bool(
            "71072",
            "Toxic Alchemist's Venom Blades",
            'Mode: [select] only\nShould the bot buy "Toxic Alchemist\'s Venom Blades" ?',
            false,
        ),
        option.bool(
            "71073",
            "Toxic Alchemist's Noxious Blade",
            'Mode: [select] only\nShould the bot buy "Toxic Alchemist\'s Noxious Blade" ?',
            false,
        ),
        option.bool(
            "71074",
            "Toxic Alchemist's Noxious Blades",
            'Mode: [select] only\nShould the bot buy "Toxic Alchemist\'s Noxious Blades" ?',
            false,
        ),
        option.bool(
            "71075",
            "Toxic Alchemist's Royal Sword",
            'Mode: [select] only\nShould the bot buy "Toxic Alchemist\'s Royal Sword" ?',
            false,
        ),
        option.bool(
            "71076",
            "Toxic Alchemist's Venom Lance",
            'Mode: [select] only\nShould the bot buy "Toxic Alchemist\'s Venom Lance" ?',
            false,
        ),
        option.bool(
            "71077",
            "Toxic Alchemist's Noxious Lance",
            'Mode: [select] only\nShould the bot buy "Toxic Alchemist\'s Noxious Lance" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BidoBirthdayMerge.select,
});

export default function main(): void {
    const script = new BidoBirthdayMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
