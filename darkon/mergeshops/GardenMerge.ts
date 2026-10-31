/*
name: Garden Merge
description: Garden Merge
tags: darkon, garden, merge, mergeshop
*/
// Port of Scripts/Darkon/MergeShops/GardenMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";

const Adv = new CoreAdvanced();
const Darkon = new CoreDarkon();

export class GardenMerge {
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
                // Add how to get items here
                case "Darkon's Receipt":
                    Darkon.farmReceipt(quant);
                    break;
                case "Debris Fragment":
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("garden", "r2", "Left", "*", req.name, quant, { isTemp: false });
                    break;
                case "Darkon's Debris 1952": {
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop("Darkon's Receipt");
                    let EnoughPeople = false;
                    Core.join("doomvault", "r5", "Left", { publicRoom: true });
                    Core.registerQuests(7325);
                    while (!bot.shouldExit && !Core.checkInventory(req.name)) {
                        if (bot.map.name.toLowerCase() === "doomvault") {
                            while (!bot.shouldExit && bot.player.cell !== "r5") {
                                Core.jump("r5", "Left");
                                Core.sleep();
                            }

                            EnoughPeople = bot.map.cellPlayers?.length >= 3;

                            if (!EnoughPeople && Core.isMember) {
                                Core.huntMonster("ultravoid", "Ultra Kathool", "Ingredients?", 22, {
                                    isTemp: false,
                                    publicRoom: true,
                                });
                            } else {
                                Core.killMonster("doomvault", "r5", "Left", "Binky", "Ingredients?", 22, {
                                    isTemp: false,
                                    publicRoom: true,
                                });
                            }

                            bot.wait.forPickup("Darkon's Receipt");
                        }
                    }
                    Core.cancelRegisteredQuests();
                    break;
                }
                case "Darkon's Debris 1935.1":

                case "Darkon's Debris 66 Angel Wing":

                case "Darkon's Debris 66 Fallen Wing":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("garden", "Creature 12", req.name, undefined, { isTemp: false });
                    break;
                case "Fa's Gamer Fuel":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("garden", "Fa", req.name, quant, { isTemp: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("garden", 1831, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "52970",
            "Darkon's Debris 92.1",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 92.1" ?',
            false,
        ),
        option.bool(
            "52971",
            "Darkon's Debris 92.2",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 92.2" ?',
            false,
        ),
        option.bool(
            "52972",
            "Darkon's Debris 92.3",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 92.3" ?',
            false,
        ),
        option.bool(
            "52993",
            "Darkon's Debris 2020",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 2020" ?',
            false,
        ),
        option.bool(
            "52973",
            "Darkon's Debris 92 Locks",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 92 Locks" ?',
            false,
        ),
        option.bool(
            "52974",
            "Darkon's Debris 92 Hair",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 92 Hair" ?',
            false,
        ),
        option.bool(
            "53001",
            "Darkon's Debris 2020 Pet",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 2020 Pet" ?',
            false,
        ),
        option.bool(
            "54502",
            "Darkon's Debris 66 Fallen Wings",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 66 Fallen Wings" ?',
            false,
        ),
        option.bool(
            "54493",
            "Darkon's Debris 66 Halo Bang",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 66 Halo Bang" ?',
            false,
        ),
        option.bool(
            "54497",
            "Darkon's Debris 66 Horns Bang",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 66 Horns Bang" ?',
            false,
        ),
        option.bool(
            "54495",
            "Darkon's Debris 66 Halo Horns Bang",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 66 Halo Horns Bang" ?',
            false,
        ),
        option.bool(
            "54494",
            "Darkon's Debris 66 Halo Cut",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 66 Halo Cut" ?',
            false,
        ),
        option.bool(
            "54498",
            "Darkon's Debris 66 Horns Cut",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 66 Horns Cut" ?',
            false,
        ),
        option.bool(
            "54496",
            "Darkon's Debris 66 Halo Horns Cut",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 66 Halo Horns Cut" ?',
            false,
        ),
        option.bool(
            "54490",
            "Darkon's Debris 66.1",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 66.1" ?',
            false,
        ),
        option.bool(
            "54491",
            "Darkon's Debris 66.2",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 66.2" ?',
            false,
        ),
        option.bool(
            "54492",
            "Darkon's Debris 66.3",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 66.3" ?',
            false,
        ),
        option.bool("54504", "Fa's Attire", 'Mode: [select] only\nShould the bot buy "Fa\'s Attire" ?', false),
        option.bool("54507", "Fa's Horn", 'Mode: [select] only\nShould the bot buy "Fa\'s Horn" ?', false),
        option.bool(
            "54517",
            "Darkon's Debris 4.1",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 4.1" ?',
            false,
        ),
        option.bool(
            "54518",
            "Darkon's Debris 4.2",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 4.2" ?',
            false,
        ),
        option.bool(
            "54510",
            "Darkon's Debris 13",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 13" ?',
            false,
        ),
        option.bool(
            "54512",
            "Darkon's Debris 508",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 508" ?',
            false,
        ),
        option.bool(
            "54513",
            "Darkon's Debris 508 Dual",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 508 Dual" ?',
            false,
        ),
        option.bool(
            "54514",
            "Darkon's Debris 1935 Stick",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 1935 Stick" ?',
            false,
        ),
        option.bool(
            "54519",
            "Darkon's Debris 1952 Extra",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 1952 Extra" ?',
            false,
        ),
        option.bool("54543", "Creature 83 Pet", 'Mode: [select] only\nShould the bot buy "Creature 83 Pet" ?', false),
        option.bool(
            "54500",
            "Darkon's Debris 66 Angel Wings",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 66 Angel Wings" ?',
            false,
        ),
        option.bool(
            "54547",
            "Summit Snack Combo",
            'Mode: [select] only\nShould the bot buy "Summit Snack Combo" ?',
            false,
        ),
        option.bool(
            "54503",
            "Darkon's Debris 66 Duality Wings",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 66 Duality Wings" ?',
            false,
        ),
        option.bool("69757", "Astravian Adept", 'Mode: [select] only\nShould the bot buy "Astravian Adept" ?', false),
        option.bool(
            "69758",
            "Astravian Adept Helm",
            'Mode: [select] only\nShould the bot buy "Astravian Adept Helm" ?',
            false,
        ),
        option.bool(
            "69759",
            "Astravian Adept Plumed Helm",
            'Mode: [select] only\nShould the bot buy "Astravian Adept Plumed Helm" ?',
            false,
        ),
        option.bool(
            "69760",
            "Astravian Adept Sheaths",
            'Mode: [select] only\nShould the bot buy "Astravian Adept Sheaths" ?',
            false,
        ),
        option.bool(
            "69761",
            "Astravian Adept Szabla",
            'Mode: [select] only\nShould the bot buy "Astravian Adept Szabla" ?',
            false,
        ),
        option.bool(
            "69762",
            "Astravian Adept Szablas",
            'Mode: [select] only\nShould the bot buy "Astravian Adept Szablas" ?',
            false,
        ),
        option.bool(
            "69763",
            "Astravian Shadow Adept",
            'Mode: [select] only\nShould the bot buy "Astravian Shadow Adept" ?',
            false,
        ),
        option.bool(
            "69764",
            "Shadow Adept Helm",
            'Mode: [select] only\nShould the bot buy "Shadow Adept Helm" ?',
            false,
        ),
        option.bool(
            "69765",
            "Shadow Adept Plumed Helm",
            'Mode: [select] only\nShould the bot buy "Shadow Adept Plumed Helm" ?',
            false,
        ),
        option.bool(
            "69770",
            "Astravian Sheathed Szabla",
            'Mode: [select] only\nShould the bot buy "Astravian Sheathed Szabla" ?',
            false,
        ),
        option.bool(
            "69878",
            "Astravian Sheathed Szablas",
            'Mode: [select] only\nShould the bot buy "Astravian Sheathed Szablas" ?',
            false,
        ),
        option.bool("69838", "Fa's VR Headset", 'Mode: [select] only\nShould the bot buy "Fa\'s VR Headset" ?', false),
        option.bool("69839", "Fa's Gauntlet", 'Mode: [select] only\nShould the bot buy "Fa\'s Gauntlet" ?', false),
        option.bool("69840", "Fa's Gauntlets", 'Mode: [select] only\nShould the bot buy "Fa\'s Gauntlets" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: GardenMerge.select,
});

export default function main(): void {
    const script = new GardenMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
