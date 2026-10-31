/*
name: Evaluate Account
description: This script will give a popup telling you a bunch of information regarding your account.
tags: tool, evaluate, account, chrono, heromart, beta, founder, badges, enhancements, rare, seasonal
*/
// Port of Scripts/Tools/EvaluateAccount.cs.

import { bot, choices, type InventoryItem } from "turu";
import { RacialGearBoost } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";

export class EvalAcc {
    evaluate(): void {
        const processItems = (prop: string): void => {
            const list = bot.flash.get<any[]>(prop);
            if (list != null) {
                usedACs += list.filter((item) => item.bCoins === 1).reduce((sum, x) => sum + ((x) => x.iCost)(x), 0);
                onePercentItems += list.filter((item) => item.iRty === 14).length;
                rareItems += list.filter((item) => this.rareIDs.includes(item.iRty)).length;
                seasonalItems += list.filter((item) => item.iRty === 50).length;

                let _classes = 0;
                classes += _classes = list.filter((item) => item.sIcon === "iiclass").length;
                let _miscItems = 0;
                miscItems += _miscItems = list.filter((item) => item.sIcon === "iibag").length;
                let _houseItems = 0;
                houseItems += _houseItems = list.filter((item) => this.houseCat.includes(item.sType)).length;
                equipment += list.length - _miscItems - _houseItems - _classes;
                hmClasses += list.filter(
                    (item) => item.sIcon === "iiclass" && this.hmClasses.includes(item.sName),
                ).length;

                for (let i = 0; i < racial75Items.length; i++) {
                    if (
                        !racial75Items[i][1] &&
                        list.some((item) => item.sMeta != null && item.sMeta.includes(`${racial75Items[i][0]}:1.75`))
                    ) {
                        racial75Items[i][1] = true;
                    }
                }
                dmgAll51Items += list.filter((item) => item.sMeta != null && item.sMeta.includes("dmgAll:1.51")).length;
            }
        };
        const processSlot = (prop: string, baseCount: number): void => {
            const slots = bot.flash.get<number>(prop);
            if (slots > baseCount) {
                extraSlots += slots - baseCount;
            }
        };
        /** How old the account is, in milliseconds (C# returns a TimeSpan). */
        const accountAge = (input: unknown): number | null => {
            if (input == null) {
                return null;
            }

            const Months = new Map([
                ["Jan", 1],
                ["Feb", 2],
                ["Mar", 3],
                // C# maps May to 4 and April to 5, so accounts made in either month read a month off.
                ["Apr", 4],
                ["May", 5],
                ["Jun", 6],
                ["Jul", 7],
                ["Aug", 8],
                ["Sep", 9],
                ["Oct", 10],
                ["Nov", 11],
                ["Dec", 12],
            ]);

            // C# reads the JSON text and drops its quotes; bot.flash.get returns the string itself.
            const output = String(input).replace(/^"|"$/g, "").split(" ");
            const time = output[3].split(":");
            return (
                Date.now() -
                new Date(
                    parseInt(output[5]),
                    [...Months].find((x) => x[0] === output[1])![1] - 1,
                    parseInt(output[2]),
                    parseInt(time[0]),
                    parseInt(time[1]),
                    parseInt(time[2]),
                ).getTime()
            );
        };
        // C#'s "0,,,.###B", "0,,.##M", "0,.#K": scaled down, up to 3/2/1 decimals.
        const ToKMB = (num: number): string => {
            const scaled = (div: number, decimals: number, unit: string): string =>
                `${Number((num / div).toFixed(decimals))}${unit}`;
            if (num > 999999999 || num < -999999999) {
                return scaled(1e9, 3, "B");
            } else if (num > 999999 || num < -999999) {
                return scaled(1e6, 2, "M");
            } else if (num > 999 || num < -999) {
                return scaled(1e3, 1, "K");
            } else {
                return String(num);
            }
        };
        const importantItemCheckbox = (tabs: number, ...items: string[]): string => {
            let _tabs = "";
            for (let t = 0; t < tabs; t++) {
                _tabs += "\t";
            }
            return `${items[0]}:${_tabs}${checkbox(Core.checkInventory(items, 1, { any: true, toInv: false }))}\n`;
        };
        const checkbox = (check: boolean): string => {
            return `[ ${check ? "🗸" : "\u200AX\u200A"} ]`;
        };
        const isCollectionChest = (item: InventoryItem): boolean => {
            return item.category === "Pet" && (item.name.includes("Chest") || item.name.includes("Collection"));
        };
        //#region Items
        bot.bank.open();
        bot.quests.load(...[...this.forgeEnhIDs, ...[793, 2937, 8042]]);
        bot.wait.forTrue(() => bot.bank.items.length > 0, 20);

        let usedACs = 0;
        let equipment = 0;
        let classes = 0;
        let hmClasses = 0;
        let miscItems = 0;
        let houseItems = 0;
        let dmgAll51Items = 0;
        const racial75Items: [RacialGearBoost, boolean][] = this.racialGears.map((x) => [x, false]);

        let onePercentItems = 0;
        let rareItems = 0;
        let seasonalItems = 0;

        processItems("world.myAvatar.items");
        processItems("world.bankinfo.items");
        processItems("world.myAvatar.houseitems");

        //#endregion
        //#region Slots
        let extraSlots = 0;

        processSlot("world.myAvatar.objData.iBagSlots", 60);
        processSlot("world.myAvatar.objData.iBankSlots", 50);
        processSlot("world.myAvatar.objData.iHouseSlots", 30);

        //#endregion
        //#region Outputting
        // Some extra data for the output
        const accAge = accountAge(bot.flash.get("world.myAvatar.objData.dCreated"));
        // C#'s gender is the JSON text ("\"M\""), whose [1] is the letter; here it's the string itself.
        const gender = bot.flash.get<string | null>("world.myAvatar.objData.strGender");
        const ACs = bot.flash.get<number>("world.myAvatar.objData.intCoins");
        const badges = Core.badges;

        // Joining Legion will use up at least 120 AC
        if (Core.isCompletedBefore(793)) {
            usedACs += 1200;
        }

        // The actual output
        bot.showMessageBox(
            `Level:\t\t\t\t${bot.player.level}\n` +
                (accAge != null
                    ? `Account Age:\t\t\t${Math.trunc(accAge / 86400000 / 365.2425)} years, ${Math.trunc(Math.trunc(accAge / 86400000 - Math.trunc(accAge / 86400000 / 365.2425) * 365.2425) / 30)} months\n`
                    : "") +
                (badges != null ? `Beta Tester:\t\t\t${checkbox(badges.some((b) => b.id === 2))}\n` : "") +
                (badges != null ? `Founder:\t\t\t\t${checkbox(badges.some((b) => b.id === 1))}\n` : "") +
                (gender != null ? `Gender:\t\t\t\t${gender.replace(/"/g, "")[0] === "M" ? "Male" : "Female"}\n` : "") +
                `\nMaxed Factions:\t\t\t${bot.reputation.factionList.filter((f) => f.rank === 10).length} out of ${bot.reputation.factionList.length}\n` +
                `Joined Legion:\t\t\t${checkbox(Core.isCompletedBefore(793))}\n` +
                `Treasure Potion Count:\t\t${bot.inventory.getQuantity(18927)}\n\n` +
                `Current Gold:\t\t\t${ToKMB(Math.trunc(Math.round(bot.player.gold / 100000)) * 100000)}\n` +
                `Current ACs:\t\t\t${ToKMB(Math.trunc(Math.floor(ACs / 1000)) * 1000)}${ACs > 0 ? "+" : ""}\n` +
                `Spent ACs:\t\t\t${ToKMB(Math.trunc(Math.floor(usedACs / 1000)) * 1000)}${usedACs > 0 ? "+" : ""}\n` +
                `Extra Slots:\t\t\t${extraSlots} slots worth ${extraSlots * 200} ACs\n\n` +
                `Total Badge Count:\t\t${badges?.length}\n` +
                `Support Badge Count:\t\t${badges?.filter((b) => b.category.replaceAll(" ", "") === "Support").length}\n` +
                `HeroMart Badge Count:\t\t${badges?.filter((b) => b.category.replaceAll(" ", "") === "HeroMart").length}\n` +
                `Exclusive Badge Count:\t\t${badges?.filter((b) => b.category.replaceAll(" ", "") === "Exclusive").length}\n\n` +
                `Equipment Count:\t\t\t${equipment}\n` +
                `Class Count:\t\t\t${classes}\n` +
                `HeroMart Class Count:\t\t${hmClasses}\n` +
                `Misc Item Count:\t\t\t${miscItems}\n` +
                `House Item Count:\t\t${houseItems}\n` +
                `Rare Item Count:\t\t\t${rareItems}\n` +
                `Seasonal Item Count:\t\t${seasonalItems}\n` +
                `1% Drop Item Count:\t\t${onePercentItems}\n` +
                `Collection Chest Count:\t\t${bot.inventory.items.filter((x) => isCollectionChest(x)).length + bot.bank.items.filter((x) => isCollectionChest(x)).length}\n\n` +
                importantItemCheckbox(3, "Void Highlord", "Void Highlord (IoDA)") +
                importantItemCheckbox(3, "Legion Revenant") +
                importantItemCheckbox(3, "ArchMage") +
                importantItemCheckbox(3, "Dragon of Time") +
                importantItemCheckbox(3, "Lord of Order") +
                importantItemCheckbox(3, "ArchPaladin") +
                importantItemCheckbox(2, "Radiant Goddess of War") +
                `Awescended:\t\t\t${checkbox(Core.isCompletedBefore(8042))}\n` +
                `75% Race DMG Weapons:\t\t${racial75Items.filter((x) => x[1]).length} of the 5 Races\n` +
                `51% DMG All Weapons:\t\t${dmgAll51Items} out of 22\n\n` +
                `Awe   \u200AEnhancements Unlocked:\t${checkbox(Core.isCompletedBefore(2937))}\n` +
                `Forge Enhancements Unlocked:\t${this.forgeEnhIDs.filter((q) => Core.isCompletedBefore(q)).length} out of ${this.forgeEnhIDs.length}`,
            "Evaluation Complete",
        );

        //#endregion
        //#region Methods

        //#endregion
    }

    private rareIDs: number[] = [
        21, // Limited Time Drop
        68, // New Collection Chest
        35, // Rare
        40, // Import Item
        55, // Sesaonal Rare
        60, // Event Item
        65, // Event Rare
        70, // Limited Rare
        75, // Collector's Rare
        80, // Promotional Item
        90, // Ultra Rare
        95, // Super Mega Ultra Rare
    ];

    private houseCat: string[] = ["Floor Item", "Wall Item", "House"];

    private forgeEnhIDs: number[] = [
        8738, 8739, 8740, 8741, 8742, 8743, 8745, 8758, 8821, 8820, 8822, 8823, 8824, 8825, 8826, 8827, 9172, 9171,
    ];

    private hmClasses: string[] = [
        "CardClasher",
        "Chrono Chaorruptor",
        "Chrono Commandant",
        "Chrono DataKnight",
        "Chrono DragonKnight",
        "ChronoCommander",
        "ChronoCorruptor",
        "Chronomancer",
        "Chronomancer Prime",
        "Classic Defender",
        "Classic Dragonlord",
        "Classic Guardian",
        "Continuum Chronomancer",
        "Corrupted Chronomancer",
        "Dark Master of Moglins",
        "Defender",
        "Dragonlord",
        "DoomKnight OverLord",
        "Dragon Knight",
        "Empyrean Chronomancer",
        "Eternal Chronomancer",
        "Flame Dragon Warrior",
        "Great Thief",
        "Guardian",
        "Heavy Metal Rockstar",
        "Heavy Metal Necro",
        "Immortal Chronomancer",
        "Infinity Knight",
        "Interstellar Knight",
        "Legion Paladin",
        "Master of Moglins",
        "Nechronomancer",
        "Necrotic Chronomancer",
        "NOT A MOD",
        "Nu Metal Necro",
        "Obsidian Paladin Chronomancer",
        "Overworld Chronomancer",
        "Paladin Chronomancer",
        "Paladin Highlord",
        "PaladinSlayer",
        "Quantum Chronomancer",
        "ShadowStalker of Time",
        "ShadowWalker of Time",
        "ShadowWeaver of Time",
        "Star Captain",
        "StarLord",
        "TimeKeeper",
        "TimeKiller",
        "Timeless Chronomancer",
        "Underworld Chronomancer",
        "Unchained Rocker",
    ];

    private racialGears: RacialGearBoost[] = (choices(RacialGearBoost) as RacialGearBoost[]).filter(
        (x) => !RacialGearBoost.None.includes(x),
    );
}

export default function main(): void {
    const script = new EvalAcc();
    script.evaluate();
}
