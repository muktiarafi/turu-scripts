/*
name: Doom Merge
description: This bot will farm the items belonging to the selected mode for the Doom Merge [423] in /necropolis
tags: doom, merge, necropolis, dark, armored, daimyo, spirit, orb, destruction, shade, broadsword, bane, scythe, scourge, mace, misery, bow, to, shadows, shadowbow, shadow, shadowscythe, necrotic, legion
*/
// Port of Scripts/Other/MergeShops/DoomMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { HardCoreMetalsEnum } from "../../core/CoreDailies";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreSDKA } from "../../evil/sdka/CoreSDKA";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const SDKA = new CoreSDKA();

export class DoomMerge {
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
                case "Accursed Arsenic of Doom":

                case "Baneful Beryllium of Doom":

                case "Calamitous Chromium of Doom":

                case "Pernicious Palladium of Doom":

                case "Reprehensible Rhodium of Doom":
                    SDKA.upgradeMetal(
                        HardCoreMetalsEnum[
                            req.name.split(" ")[1] as keyof typeof HardCoreMetalsEnum
                        ] as HardCoreMetalsEnum,
                    );
                    bot.wait.forPickup(req.name);
                    break;
                case "Diabolical Aura":
                    SDKA.pinpointBroadsword(quant);
                    break;
                case "Corrupt Spirit Orb":

                case "Ominous Aura":
                    SDKA.doomKnightWK(req.name, quant);
                    break;
                case "Dark Spirit Orb":
                    SDKA.dso(quant);
                    break;
                case "Dark Energy": {
                    Core.farmingLogger(req.name, quant);
                    // Log the farming request
                    // Ensure no negative values when calculating the sell amount
                    const sellAmount = Math.max(0, bot.inventory.getQuantity("Dark Energy") - quant);
                    // Proceed if there’s at least one item to sell
                    if (sellAmount > 0) {
                        Core.logger(`Selling ${sellAmount} Dark Energy to prevent errors... Hopefully.`, "Sell");
                        Core.sellItem("Dark Energy", sellAmount);
                    }
                    // Equip the farming class and start killing monsters
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("dwarfhold", "r2", "Left", "Chaos Drow", req.name, quant, { isTemp: false });
                    break;
                }
                case "Undead Energy":
                    Farm.battleUnderB("Undead Energy", quant);
                    break;
                case "DoomKnight Weapon Kit":
                    SDKA.doomKnightWK(undefined, quant);
                    break;
                case "DoomSoldier Weapon Kit":
                    SDKA.doomSoldierWK(quant);
                    break;
                case "DoomSquire Weapon Kit":
                    SDKA.doomSquireWK(quant);
                    break;
                case "Legion Daimyo Armor":
                    Core.addDrop(req.name);
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(2951);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("ruins", "Dark Elemental", "Heart of Darkness", 15);
                        Core.huntMonster("bludrut4", "Shadow Serpent", "Shadow Essence", 4);
                        Core.huntMonster("GreenguardWest", "Black Knight", "Black Metal Armor");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Dark Daimyo Armor":
                    Core.addDrop(req.name);
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(2080);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("ruins", "Dark Elemental", "Heart of Darkness", 15);
                        Core.huntMonster("bludrut4", "Shadow Serpent", "Shadow Essence", 4);
                        Core.huntMonster("GreenguardWest", "Black Knight", "Black Metal Armor");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        if (!Core.isMember) {
            Core.logger("Membership Required for any item here...", "Membership Warning", { stopBot: true });
        }

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("necropolis", 423, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "12287",
            "Dark Armored Daimyo",
            'Mode: [select] only\nShould the bot buy "Dark Armored Daimyo" ?',
            false,
        ),
        option.bool(
            "12514",
            "Daggers of Destruction",
            'Mode: [select] only\nShould the bot buy "Daggers of Destruction" ?',
            false,
        ),
        option.bool("12518", "Blade of Shade", 'Mode: [select] only\nShould the bot buy "Blade of Shade" ?', false),
        option.bool(
            "12519",
            "Broadsword of Bane",
            'Mode: [select] only\nShould the bot buy "Broadsword of Bane" ?',
            false,
        ),
        option.bool(
            "12515",
            "Scythe of Scourge",
            'Mode: [select] only\nShould the bot buy "Scythe of Scourge" ?',
            false,
        ),
        option.bool("12521", "Mace of Misery", 'Mode: [select] only\nShould the bot buy "Mace of Misery" ?', false),
        option.bool(
            "12511",
            "Bow to the Shadows",
            'Mode: [select] only\nShould the bot buy "Bow to the Shadows" ?',
            false,
        ),
        option.bool(
            "12690",
            "ShadowBow of the Shadows",
            'Mode: [select] only\nShould the bot buy "ShadowBow of the Shadows" ?',
            false,
        ),
        option.bool(
            "12692",
            "Shadow Daggers of Destruction",
            'Mode: [select] only\nShould the bot buy "Shadow Daggers of Destruction" ?',
            false,
        ),
        option.bool(
            "12694",
            "Shadow Mace of Misery",
            'Mode: [select] only\nShould the bot buy "Shadow Mace of Misery" ?',
            false,
        ),
        option.bool(
            "12696",
            "ShadowScythe of Scourge",
            'Mode: [select] only\nShould the bot buy "ShadowScythe of Scourge" ?',
            false,
        ),
        option.bool(
            "12698",
            "Shadow Broadsword of Bane",
            'Mode: [select] only\nShould the bot buy "Shadow Broadsword of Bane" ?',
            false,
        ),
        option.bool(
            "12741",
            "Shadow Shade Blade",
            'Mode: [select] only\nShould the bot buy "Shadow Shade Blade" ?',
            false,
        ),
        option.bool(
            "14475",
            "Necrotic Bow of the Shadow",
            'Mode: [select] only\nShould the bot buy "Necrotic Bow of the Shadow" ?',
            false,
        ),
        option.bool(
            "14476",
            "Necrotic Daggers of Destruction",
            'Mode: [select] only\nShould the bot buy "Necrotic Daggers of Destruction" ?',
            false,
        ),
        option.bool(
            "14477",
            "Necrotic Mace of Misery",
            'Mode: [select] only\nShould the bot buy "Necrotic Mace of Misery" ?',
            false,
        ),
        option.bool(
            "14478",
            "Necrotic Scythe of Scourge",
            'Mode: [select] only\nShould the bot buy "Necrotic Scythe of Scourge" ?',
            false,
        ),
        option.bool(
            "14479",
            "Necrotic Broadsword of Bane",
            'Mode: [select] only\nShould the bot buy "Necrotic Broadsword of Bane" ?',
            false,
        ),
        option.bool(
            "14480",
            "Necrotic Shade Blade",
            'Mode: [select] only\nShould the bot buy "Necrotic Shade Blade" ?',
            false,
        ),
        option.bool(
            "17971",
            "Legion Armored Daimyo",
            'Mode: [select] only\nShould the bot buy "Legion Armored Daimyo" ?',
            false,
        ),
        option.bool(
            "43796",
            "ShadowScythe Daimyo",
            'Mode: [select] only\nShould the bot buy "ShadowScythe Daimyo" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DoomMerge.select,
});

export default function main(): void {
    const script = new DoomMerge();
    Core.bankingBlackList.push(
        "Dark Daimyo Armor",
        "Dark Energy",
        "DoomSquire Weapon Kit",
        "Accursed Arsenic of Doom",
        "Baneful Beryllium of Doom",
        "Calamitous Chromium of Doom",
        "Pernicious Palladium of Doom",
        "Undead Energy",
        "Reprehensible Rhodium of Doom",
        "DoomSoldier Weapon Kit",
        "DoomKnight Weapon Kit",
        "Legion Daimyo Armor",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
