/*
name: Dreampalace Merge
description: This bot will farm the items belonging to the selected mode for the Dreampalace Merge [1961] in /dreampalace
tags: dreampalace, merge, dreampalace, strong, golmoth, vibrant, awakened, scythe, gazeroth, bow, zelkur, scimitar, zal, djinn, realm, techsuit, polycrystalline, tactical, solarcore, battering, shield, silicon, visor, backup, amplified, techguard
*/
// Port of Scripts/Other/MergeShops/DreampalaceMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { DreamPalace } from "../../story/DreamPalace";

const Adv = new CoreAdvanced();
const dreamPalace = new DreamPalace();

export class DreampalaceMerge {
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
                case "Axe of Golmoth":

                case "Scales of Golmoth":
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("DreamPalace", "Golmoth", req.name, quant, { isTemp: false });
                    }
                    bot.wait.forPickup(req.name);
                    break;
                case "Token of Water":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("DreamPalace", "Mote of Mana", req.name, req.quantity, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    break;
                case "Token of Fire":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("DreamPalace", "Mote of Power", req.name, req.quantity, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    break;
                case "Token of Earth":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("DreamPalace", "Mote of Earth", req.name, req.quantity, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    break;
                case "Token of Air":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("DreamPalace", "Mote of Air", req.name, req.quantity, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    break;
                case "Zahad's Ancient Gem":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("DreamPalace", "Zahad", req.name, req.quantity, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    break;
                case "Scythe of Gazeroth":

                case "Souls of Gazeroth":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("DreamPalace", "Gazeroth", req.name, req.quantity, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    break;
                case "Claws of Zelkur":

                case "Bow of Zelkur":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("DreamPalace", "Zelkur", req.name, req.quantity, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    break;
                case "Feathers of Zal":

                case "Scimitar of Zal":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("DreamPalace", "Zal", req.name, req.quantity, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("dreampalace", 1961, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "58693",
            "Strong Axe of Golmoth",
            'Mode: [select] only\nShould the bot buy "Strong Axe of Golmoth" ?',
            false,
        ),
        option.bool(
            "58694",
            "Vibrant Axe of Golmoth",
            'Mode: [select] only\nShould the bot buy "Vibrant Axe of Golmoth" ?',
            false,
        ),
        option.bool(
            "58695",
            "Awakened Axe of Golmoth",
            'Mode: [select] only\nShould the bot buy "Awakened Axe of Golmoth" ?',
            false,
        ),
        option.bool(
            "58701",
            "Strong Scythe of Gazeroth",
            'Mode: [select] only\nShould the bot buy "Strong Scythe of Gazeroth" ?',
            false,
        ),
        option.bool(
            "58702",
            "Vibrant Scythe of Gazeroth",
            'Mode: [select] only\nShould the bot buy "Vibrant Scythe of Gazeroth" ?',
            false,
        ),
        option.bool(
            "58703",
            "Awakened Scythe of Gazeroth",
            'Mode: [select] only\nShould the bot buy "Awakened Scythe of Gazeroth" ?',
            false,
        ),
        option.bool(
            "58705",
            "Strong Bow of Zelkur",
            'Mode: [select] only\nShould the bot buy "Strong Bow of Zelkur" ?',
            false,
        ),
        option.bool(
            "58706",
            "Vibrant Bow of Zelkur",
            'Mode: [select] only\nShould the bot buy "Vibrant Bow of Zelkur" ?',
            false,
        ),
        option.bool(
            "58707",
            "Awakened Bow of Zelkur",
            'Mode: [select] only\nShould the bot buy "Awakened Bow of Zelkur" ?',
            false,
        ),
        option.bool(
            "58697",
            "Strong Scimitar of Zal",
            'Mode: [select] only\nShould the bot buy "Strong Scimitar of Zal" ?',
            false,
        ),
        option.bool(
            "58698",
            "Vibrant Scimitar of Zal",
            'Mode: [select] only\nShould the bot buy "Vibrant Scimitar of Zal" ?',
            false,
        ),
        option.bool(
            "58699",
            "Awakened Scimitar of Zal",
            'Mode: [select] only\nShould the bot buy "Awakened Scimitar of Zal" ?',
            false,
        ),
        option.bool(
            "91066",
            "Djinn Realm TechSuit",
            'Mode: [select] only\nShould the bot buy "Djinn Realm TechSuit" ?',
            false,
        ),
        option.bool(
            "91067",
            "Polycrystalline Tactical Helm",
            'Mode: [select] only\nShould the bot buy "Polycrystalline Tactical Helm" ?',
            false,
        ),
        option.bool(
            "91071",
            "Solarcore Battering Shield",
            'Mode: [select] only\nShould the bot buy "Solarcore Battering Shield" ?',
            false,
        ),
        option.bool(
            "91068",
            "Polycrystalline Silicon Helm",
            'Mode: [select] only\nShould the bot buy "Polycrystalline Silicon Helm" ?',
            false,
        ),
        option.bool(
            "91069",
            "Polycrystalline Silicon Visor",
            'Mode: [select] only\nShould the bot buy "Polycrystalline Silicon Visor" ?',
            false,
        ),
        option.bool(
            "91070",
            "Back-Up Solarcore Shield",
            'Mode: [select] only\nShould the bot buy "Back-Up Solarcore Shield" ?',
            false,
        ),
        option.bool(
            "91073",
            "Amplified Djinn Realm TechGuard",
            'Mode: [select] only\nShould the bot buy "Amplified Djinn Realm TechGuard" ?',
            false,
        ),
        option.bool(
            "91072",
            "Djinn Realm TechGuard",
            'Mode: [select] only\nShould the bot buy "Djinn Realm TechGuard" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DreampalaceMerge.select,
});

export default function main(): void {
    const script = new DreampalaceMerge();
    Core.bankingBlackList.push(
        "Axe of Golmoth",
        "Scales of Golmoth",
        "Token of Fire",
        "Zahad's Ancient Gem",
        "Scythe of Gazeroth",
        "Souls of Gazeroth",
        "Token of Earth",
        "Bow of Zelkur",
        "Claws of Zelkur",
        "Token of Water",
        "Scimitar of Zal",
        "Feathers of Zal",
        "Token of Air",
    );
    Core.setOptions();

    dreamPalace.storyLine();
    script.buyAllMerge();

    Core.setOptions(false);
}
