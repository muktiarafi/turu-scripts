/*
name: Celestial Spoils Merge
description: This bot will farm the items belonging to the selected mode for the Celestial Spoils Merge [1582] in /djinnguard
tags: celestial, spoils, merge, djinnguard, djinn, warrior, sack, , fallen, king, dragon, dicers, greatsword, emeralds, sapphires, katana, toxic, wanderer, wanderers, sheathed, khopesh, wyvernslayer, wyvernslayers, horns, toxix, trophy, wings, great, caustic, wyvernfang, reaver, reavers
*/
// Port of Scripts/Other/MergeShops/CelestialSpoilsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { DjinnGuard } from "../../story/DjinnGuard";

const Adv = new CoreAdvanced();
const djinnGuard = new DjinnGuard();

export class CelestialSpoilsMerge {
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
                case "Celestial Coin":
                    djinnGuard.completeDjinnGuard();
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(6275);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //Celestial Spoils: Djinn Warrior 6275
                        Core.huntMonster("DjinnGuard", "Air Spirit", "Air Essence", 3, { log: false });
                        Core.huntMonster("DjinnGuard", "Water Spirit", "Water Essence", 3, { log: false });
                        Core.huntMonster("DjinnGuard", "Earth Spirit", "Earth Essence", 3, { log: false });
                        Core.huntMonster("DjinnGuard", "Fire Spirit", "Fire Essence", 3, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Blade of the Fallen Djinn":

                case "Blade of the Djinn King":
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("DjinnGuard", "Image of Crulon", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Lucky Button":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(9836);
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("deadmoor", "Toxic Souleater", "Toxic Souleater Venom", 10);
                        Core.huntMonster("moonlab", "Infected Scientist", "Scientist's Flask", 10);
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("deerhunt", "Zweinichthirsch", " Zweinichthirsch Antler");
                        Core.ensureComplete(9836);
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("djinnguard", 1582, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("43411", "Djinn Warrior", 'Mode: [select] only\nShould the bot buy "Djinn Warrior" ?', false),
        option.bool(
            "43412",
            "Djinn Warrior Hair",
            'Mode: [select] only\nShould the bot buy "Djinn Warrior Hair" ?',
            false,
        ),
        option.bool(
            "43413",
            "Djinn Warrior Locks",
            'Mode: [select] only\nShould the bot buy "Djinn Warrior Locks" ?',
            false,
        ),
        option.bool(
            "43414",
            "Djinn Warrior Sack",
            'Mode: [select] only\nShould the bot buy "Djinn Warrior Sack" ?',
            false,
        ),
        option.bool(
            "43415",
            "Djinn Warrior Blade + Sack",
            'Mode: [select] only\nShould the bot buy "Djinn Warrior Blade + Sack" ?',
            false,
        ),
        option.bool(
            "43416",
            "Djinn Warrior Blade",
            'Mode: [select] only\nShould the bot buy "Djinn Warrior Blade" ?',
            false,
        ),
        option.bool(
            "43417",
            "Djinn Warrior Daggers",
            'Mode: [select] only\nShould the bot buy "Djinn Warrior Daggers" ?',
            false,
        ),
        option.bool(
            "43438",
            "Blades of the Fallen Djinn",
            'Mode: [select] only\nShould the bot buy "Blades of the Fallen Djinn" ?',
            false,
        ),
        option.bool(
            "43439",
            "Blades of the Djinn King",
            'Mode: [select] only\nShould the bot buy "Blades of the Djinn King" ?',
            false,
        ),
        option.bool("44337", "Dragon Dicers", 'Mode: [select] only\nShould the bot buy "Dragon Dicers" ?', false),
        option.bool(
            "44338",
            "Greatsword of Emeralds",
            'Mode: [select] only\nShould the bot buy "Greatsword of Emeralds" ?',
            false,
        ),
        option.bool(
            "44339",
            "Greatsword of Sapphires",
            'Mode: [select] only\nShould the bot buy "Greatsword of Sapphires" ?',
            false,
        ),
        option.bool(
            "44340",
            "Katana of Sapphires",
            'Mode: [select] only\nShould the bot buy "Katana of Sapphires" ?',
            false,
        ),
        option.bool(
            "44341",
            "Katana of Emeralds",
            'Mode: [select] only\nShould the bot buy "Katana of Emeralds" ?',
            false,
        ),
        option.bool(
            "44342",
            "Staff of Sapphires",
            'Mode: [select] only\nShould the bot buy "Staff of Sapphires" ?',
            false,
        ),
        option.bool(
            "44343",
            "Staff of Emeralds",
            'Mode: [select] only\nShould the bot buy "Staff of Emeralds" ?',
            false,
        ),
        option.bool("61899", "Toxic Wanderer", 'Mode: [select] only\nShould the bot buy "Toxic Wanderer" ?', false),
        option.bool(
            "61900",
            "Toxic Wanderer's Hood",
            'Mode: [select] only\nShould the bot buy "Toxic Wanderer\'s Hood" ?',
            false,
        ),
        option.bool(
            "61901",
            "Toxic Wanderer's Sheathed Blade",
            'Mode: [select] only\nShould the bot buy "Toxic Wanderer\'s Sheathed Blade" ?',
            false,
        ),
        option.bool(
            "61902",
            "Toxic Wanderer's Khopesh",
            'Mode: [select] only\nShould the bot buy "Toxic Wanderer\'s Khopesh" ?',
            false,
        ),
        option.bool(
            "87274",
            "Toxic WyvernSlayer",
            'Mode: [select] only\nShould the bot buy "Toxic WyvernSlayer" ?',
            false,
        ),
        option.bool(
            "87275",
            "Toxic WyvernSlayer's Horns",
            'Mode: [select] only\nShould the bot buy "Toxic WyvernSlayer\'s Horns" ?',
            false,
        ),
        option.bool(
            "87276",
            "Toxic WyvernSlayer's Hood",
            'Mode: [select] only\nShould the bot buy "Toxic WyvernSlayer\'s Hood" ?',
            false,
        ),
        option.bool(
            "87277",
            "Toxix WyvernSlayer's Trophy Wings",
            'Mode: [select] only\nShould the bot buy "Toxix WyvernSlayer\'s Trophy Wings" ?',
            false,
        ),
        option.bool(
            "87278",
            "Toxic WyvernSlayer's Great Blade",
            'Mode: [select] only\nShould the bot buy "Toxic WyvernSlayer\'s Great Blade" ?',
            false,
        ),
        option.bool(
            "87279",
            "Toxic WyvernSlayer's Great Blades",
            'Mode: [select] only\nShould the bot buy "Toxic WyvernSlayer\'s Great Blades" ?',
            false,
        ),
        option.bool(
            "87280",
            "Caustic WyvernFang Reaver",
            'Mode: [select] only\nShould the bot buy "Caustic WyvernFang Reaver" ?',
            false,
        ),
        option.bool(
            "87281",
            "Caustic WyvernFang Reavers",
            'Mode: [select] only\nShould the bot buy "Caustic WyvernFang Reavers" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CelestialSpoilsMerge.select,
});

export default function main(): void {
    const script = new CelestialSpoilsMerge();
    Core.bankingBlackList.push(
        "Celestial Coin",
        "Blade of the Fallen Djinn",
        "Blade of the Djinn King",
        "Lucky Button",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
