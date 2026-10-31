/*
name: Check Roles
description: This script will give a popup telling you a bunch of information regarding your account.
tags: tool, evaluate, account, chrono, heromart, beta, founder, badges, enhancements, rare, seasonal
*/
// Port of Scripts/Tools/CheckArmyRoles.cs.

import { bot, choices, type InventoryItem } from "turu";
import { RacialGearBoost } from "../core/CoreAdvanced";
import { Core, randomInt } from "../core/CoreBots";

export class CheckArmyRoles {
    evaluate(): void {
        const processItems = (prop: string): void => {
            const list = bot.flash.get<any[]>(prop);
            if (list != null) {
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
        while (!bot.shouldExit && !bot.player.loaded) {
            Core.sleep();
        }

        if (bot.house.items.some((h) => h.equipped)) {
            bot.send.packet(`%xt%zm%house%1%${Core.username()}%`);
            bot.wait.forMapLoad("house");
        }

        bot.bank.open();

        // Load Forge Enhancement Quest + some role quests
        bot.quests.load(...[...this.forgeEnhIDs, ...[793, 2937, 8042]]);
        bot.wait.forTrue(() => bot.bank.items.length > 0, 20);

        let dmgAll51Items = 0;
        const racial75Items: [RacialGearBoost, boolean][] = this.racialGears.map((x) => [x, false]);

        Core.logger("🗂️ Checking Player Inventory Items...");
        processItems("world.myAvatar.items");

        Core.logger("🏦 Reviewing Player Bank Items...");
        processItems("world.bankinfo.items");

        Core.logger("🏠 Evaluating Player House Items...");
        processItems("world.myAvatar.houseitems");

        Core.logger("📝 Compiling and formatting all data for the final output...");

        //#region OutPut Generator
        // The actual output
        bot.showMessageBox(
            `Evaluation ID: ${this.generateEvaluationID()}\n` +
                `Extra Secutity: Account Item Count: ${bot.inventory.items.concat(...bot.bank.items).concat(...bot.house.items).length}\n` +
                `Ｅｎｈａｎｃｅｍｅｎｔｓ\n` +
                `(Victor of War) Valiance:\t\t\t\t${this.checkbox(Core.isCompletedBefore(8741))}\n` +
                `(Conductor of War) Arcana:\t\t\t\t${this.checkbox(Core.isCompletedBefore(8741))}\n` +
                `(Conductor of War) Arcana's Concerto:\t\t${this.checkbox(Core.isCompletedBefore(8742))}\n` +
                `(Deliverance of War) Elysium:\t\t\t${this.checkbox(Core.isCompletedBefore(8821))}\n` +
                `(Reflectionist of War) Examen:\t\t\t${this.checkbox(Core.isCompletedBefore(8825))}\n` +
                `(Penitent of War) Pentience:\t\t\t${this.checkbox(Core.isCompletedBefore(8822))}\n` +
                `(Miltonious of War) Ravenous:\t\t\t${this.checkbox(Core.isCompletedBefore(9560))}\n` +
                `(Shadow of War) Dauntless:\t\t\t${this.checkbox(Core.isCompletedBefore(9172))}\n` +
                `Ｃｌａｓｓｅｓ\n` +
                "(Avenger of War) " +
                this.importantItemCheckbox(3, "Chaos Avenger") +
                "(ArchMage of War) " +
                this.importantItemCheckbox(3, "ArchMage") +
                "(Revenant of War) " +
                this.importantItemCheckbox(3, "Legion Revenant") +
                "(Highlord of War) " +
                this.importantItemCheckbox(3, "Void Highlord", "Void Highlord (IoDA)") +
                "(Vera of War) " +
                this.importantItemCheckbox(3, "Verus DoomKnight") +
                "(Eternal Dragon of War) " +
                this.importantItemCheckbox(2, "Dragon of Time") +
                "(Diviner of War) " +
                this.importantItemCheckbox(3, "Arcana Invoker") +
                "(Tempest of War) " +
                this.importantItemCheckbox(2, "Sovereign of Storms") +
                "(Autist Of War) " +
                this.importantItemCheckbox(3, "Martial Artist") +
                "(Vindicator of War) " +
                this.importantItemCheckbox(2, "Hollowborn Vindicator") +
                `Ｗｅａｐｏｎｓ\n` +
                "(Prisoner of War) " +
                this.importantItemCheckbox(1, "Hollowborn Reaper's Scythe") +
                "(Primordial of War) " +
                this.importantItemCheckbox(2, "Necrotic Sword of Doom") +
                "(Wraith of War) " +
                this.importantItemCheckbox(2, "Hollowborn Sword of Doom") +
                "(Legatus of War) " +
                this.importantItemCheckbox(1, "Necrotic Blade of the Underworld") +
                "(Chauvinist of War) " +
                this.importantItemCheckbox(1, "Necrotic Sword of the Abyss") +
                "(Prudence of War) " +
                this.importantItemCheckbox(3, "Providence") +
                "(Sinner of War) " +
                this.importantItemCheckbox(3, "Sin of the Abyss") +
                "(Deacon of War) " +
                this.importantItemCheckbox(2, "Exalted Apotheosis") +
                "(Deacon of War) " +
                this.importantItemCheckbox(2, "Dual Exalted Apotheosis") +
                "(Celestial of War) " +
                this.importantItemCheckbox(1, "Greatblade of the Entwined Eclipse") +
                "(Starlight of War) " +
                this.importantItemCheckbox(2, "Star Light of the Empyrean", "Star Lights of the Empyrean") +
                "(Mysteries of War) " +
                this.importantItemCheckbox(2, "Sin of the Underworld") +
                "(Enoch of War)" +
                this.importantItemCheckbox(1, "Gramiel's Divine Enoch") +
                `Ａｒｍｏｒ\n` +
                `(Ascendant of War) Awescended:\t\t\t${this.checkbox(Core.isCompletedBefore(8042))}\n` +
                "(Radiant Goddess of War) " +
                this.importantItemCheckbox(1, "Radiant Goddess of War") +
                `Ｃｈｒｏｎｏ Ｃｈｅｃｋ\n` +
                `(Time Lord of War) Chronomancer\t\t\t${this.checkbox(this.chronoOwned())}\n` +
                `Ｅｎｄ Ｃｈｅｃｋｓ\n` +
                `Apprentice of War:\t\t\t\t${this.checkbox(this.apprenticeOfWar())}\n` +
                `Master of War:\t\t\t\t\t${this.checkbox(this.masterofWar())}\n` +
                `Apostle of War:\t\t\t\t\t${this.checkbox(this.apostleofwar())}\n` +
                `Bishop of War:\t\t\t\t\t${this.checkbox(this.bishopofWar())}\n` +
                `Cardinal of War:\t\t\t\t\t${this.checkbox(this.cardinalofWar())}\n` +
                `51% DMG All Weapons:\t\t\t\t${dmgAll51Items} out of 30\n\n` +
                "\n" +
                "\n" +
                `Ｉｎｆｏ  Ｆｏｒ  Ｐｌａｙｅｒ\n` +
                this.getStatusReport(),
            "Evaluation Complete",
        );

        Core.logger("✅ All processes complete! Ready for final review.");

        //#endregion
    }

    private apprenticeOfWar(): boolean {
        return (
            bot.player.level >= 100 &&
            bot.inventory.items.concat(...bot.bank.items).some((item) => this.dpsClasses.includes(item.name)) &&
            bot.inventory.items.concat(...bot.bank.items).some((item) => this.farmerClasses.includes(item.name)) &&
            bot.inventory.items.concat(...bot.bank.items).some((item) => this.supportClasses.includes(item.name))
        );
    }

    private masterofWar(): boolean {
        // Define the types of boosts to check for
        const boostTypes = ["dmgAll", "Dragonkin", "Elemental", "Human", "Undead", "Chaos"];

        // Check for a valid item with a damage boost of 30% or more
        const HasThirtyPerceptArmor = bot.inventory.items.concat(...bot.bank.items).some(
            (item) =>
                item != null &&
                item.meta != null &&
                // C# parses the boost's ToString() back into a double: the number itself.
                (Core.getBoostFloat(item, "dmgAll") >= 1.3 ||
                    boostTypes.slice(1).every((boostType) => Core.getBoostFloat(item, boostType) >= 1.3)) &&
                !this.isNonWeapon(item),
        );

        return this.apprenticeOfWar() && HasThirtyPerceptArmor && this.masterofWarMeta();
    }

    private apostleofwar(): boolean {
        return (
            this.masterofWar() &&
            [...this.apostleWeapons, ...this.apostleinsignias].some((item) =>
                Core.checkInventory([item], undefined, { any: true, toInv: false }),
            )
        );
    }

    private bishopofWar(): boolean {
        return (
            this.apostleofwar() &&
            bot.inventory.items
                .concat(...bot.bank.items)
                .some((item) => item != null && Core.getBoostFloat(item, "dmgAll") >= 1.5) &&
            Core.checkInventory(this.bishopClasses, undefined, { any: true, toInv: false }) &&
            Core.checkInventory(this.nulgathItems, undefined, { any: true, toInv: false }) &&
            Core.checkInventory(this.dageItems, undefined, { any: true, toInv: false }) &&
            Core.checkInventory(this.fiftyOneWeapons, undefined, { any: true, toInv: false })
        );
    }

    private cardinalofWar(): boolean {
        const hasEnhancements =
            [8738, 8739, 8740, 8741, 8742, 8758, 8821, 8820, 9560, 8744].some((id) => Core.isCompletedBefore(id)) &&
            [8826, 8825, 8758, 8827, 8824].some((id) => Core.isCompletedBefore(id)) &&
            [8743, 8745, 8758, 8823, 8822, 8744].some((id) => Core.isCompletedBefore(id));

        const FiftyOneWeaponsOwned = this.fiftyOneWeapons.filter((weapon) =>
            bot.inventory.items.concat(...bot.bank.items).some((item) => item.name === weapon),
        ).length;

        const bishopClassesOwned = this.bishopClasses.filter((cls) =>
            bot.inventory.items.concat(...bot.bank.items).some((item) => item.name === cls),
        ).length;

        /* Returns in order:
        1. BishopofWar Status
        2. >= 4 Class Roles
        3. >= 4 Weapon 51% dmgAll weapons
        4. Has *ATLEAST* 1 weapon,  1 helm, 1 cape Forge Ehn
        5. Dark Carnax Quest(& Badge) Completed *or* ArchMage Owned.
        */
        return (
            this.bishopofWar() &&
            bishopClassesOwned >= 4 &&
            FiftyOneWeaponsOwned >= 4 &&
            hasEnhancements &&
            (Core.isCompletedBefore(8918) || Core.checkInventory("ArchMage", undefined, { toInv: false }))
        );
    }

    //#region Variables
    // DPS Classes
    dpsClasses: string[] = [
        "Dragon of Time",
        "Glacial Berserker",
        "Guardian",
        "Legion DoomKnight",
        "Legion Revenant",
        "LightCaster",
        "Lycan",
        "Psionic MindBreaker",
        "Void HighLord",
    ];

    // Farmers
    farmerClasses: string[] = [
        "Abyssal Angel",
        "ArchMage",
        "Blaze Binder",
        "Daimon",
        "Dragon of Time",
        "Eternal Inversionist",
        "Firelord Summoner",
        "Legion Revenant",
        "Dark Master of Moglins",
        "Master of Moglins",
        "NCM",
        "Scarlet Sorceress",
        "ShadowScythe General",
        "Shaman",
    ];

    // Support Classes
    supportClasses: string[] = [
        "ArchFiend",
        "ArchPaladin",
        "Frostval Barbarian",
        "Infinity Titan",
        "Dark Legendary Hero",
        "Legendary Hero",
        "Legion Revenant",
        "LightCaster",
        "Lord of Order",
        "NorthLands Monk",
        "Quantum Chronomancer",
        "Continuum Chronomancer",
        "StoneCrusher",
    ];
    rareIDs: number[] = [
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
    houseCat: string[] = ["Floor Item", "Wall Item", "House"];
    private forgeEnhIDs: number[] = [
        8738, 8739, 8740, 8741, 8742, 8743, 8745, 8758, 8821, 8820, 8822, 8823, 8824, 8825, 8826, 8827, 9172, 9171,
    ];
    private forgeQuests: [Name: string, ID: number][] = [
        ["Forge Weapon Enhancement", 8738],
        ["Lacerate", 8739],
        ["Smite", 8740],
        ["Hero's Valiance", 8741],
        ["Arcana's Concerto", 8742],
        ["Absolution", 8743],
        ["Avarice", 8745],
        ["Praxis", 9171],
        ["Acheron", 8820],
        ["Elysium", 8821],
        ["Penitence", 8822],
        ["Lament", 8823],
        ["Vim, Ether", 8824],
        ["Anima", 8826],
        ["Pneuma", 8827],
        ["Dauntless", 9172],
        ["Forge Cape Enhancement", 8758],
        ["Examen", 8825],
    ];
    private heroMartClasses: string[] = [
        // Core Chrono / Time Classes
        "Chronomancer",
        "Chronomancer Prime",
        "Timeless Chronomancer",
        "Continuum Chronomancer",
        "Quantum Chronomancer",
        "Nechronomancer",
        "Necrotic Chronomancer",
        "Corrupted Chronomancer",
        "Underworld Chronomancer",
        "Overworld Chronomancer",
        "Empyrean Chronomancer",
        "Eternal Chronomancer",
        "Immortal Chronomancer",
        "Obsidian Paladin Chronomancer",
        "Paladin Chronomancer",
        "Chrono Chaorruptor",
        "Chrono Commandant",
        "Chrono DataKnight",
        "Chrono DragonKnight",
        "Chrono ShadowHunter",
        "Chrono ShadowSlayer",
        "ChronoCorruptor",
        "ChronoCommander", // Extra Chrono variants from second list
        "Phantom Chronomancer",
        "Phantasm Chronomancer",
        "Draconic Chronomancer", // Non-Chrono HM Classes
        "CardClasher",
        "Classic Guardian",
        "Guardian",
        "Classic Dragonlord",
        "Dragonlord",
        "Dragon Knight",
        "Classic Defender",
        "Defender",
        "DoomKnight OverLord",
        "Legion Paladin",
        "Paladin Highlord",
        "PaladinSlayer", // Moglin / Music / Rock / Misc
        "Master of Moglins",
        "Dark Master of Moglins",
        "Heavy Metal Necro",
        "Heavy Metal Rockstar",
        "Nu Metal Necro",
        "Unchained Rocker", // Time-Adjacent Classes
        "ShadowStalker of Time",
        "ShadowWalker of Time",
        "ShadowWeaver of Time",
        "TimeKeeper",
        "TimeKiller", // Space / Interstellar / Knight Types
        "Interstellar Knight",
        "Infinity Knight",
        "Star Captain",
        "StarLord", // Misc
        "Flame Dragon Warrior",
        "Great Thief",
        "NOT A MOD",
    ];
    apostleWeapons: string[] = ["Exalted Penultima", "Exalted Unity", "Exalted Apotheosis"];
    apostleinsignias: string[] = ["Ezrajal Insignia", "Warden Insignia", "Engineer Insignia"];

    // Bishop Classes
    bishopClasses: string[] = [
        "Chaos Avenger",
        "ArchMage",
        "Legion Revenant",
        "Void HighLord",
        "Dragon of Time",
        "Verus DoomKnight",
        "Arcana Invoker",
        "Sovereign of Storms",
    ];

    // Nulgath Insignias and Items
    nulgathItems: string[] = [
        "Nulgath Insignia",
        "Sin of the Abyss",
        "Sin of Revontheus",
        "Empowered Overfiend Blade",
        "Empowered Ungodly Reavers",
        "Empowered Shadow Spear",
        "Empowered Bloodletter",
        "Empowered Prismatic Manslayers",
        "Empowered Prismatic Manslayer",
        "Empowered Legacy of Nulgath",
        "Empowered Worshipper of Nulgath",
        "Empowered Evolved Fiend",
        "Empowered Evolved Void",
        "Empowered Evolved Blood",
        "Empowered Evolved Hex",
        "Empowered Evolved Shadow",
    ];

    // Dage Insignias and Items
    dageItems: string[] = [
        "Dage the Evil Insignia",
        "Necrotic Blade of the Underworld",
        "Empowered Caladbolg",
        "Empowered Dual Caladbolgs",
        "Empowered Lich King",
        "Empowered Undead Champion",
        "Empowered Bonfire Altar",
        "Empowered Forge Spawn",
        "Empowered Paragon Plate",
        "Empowered BladeMaster",
        "Empowered BladeMaster's Katana",
        "Empowered Dual Katanas",
        "Empowered Dark Caster",
        "Empowered Prismatic Paragon",
    ];

    fiftyOneWeapons: string[] = [
        "Necrotic Sword of Doom",
        "Hollowborn Sword of Doom",
        "Necrotic Blade of the Underworld",
        "Necrotic Sword of the Abyss",
        "Providence",
        "Sin of the Abyss",
        "Exalted Apotheosis",
        "Dual Exalted Apotheosis",
        "Greatblade of the Entwined Eclipse",
        "Star Light of the Empyrean",
    ];
    //#endregion
    //#region Methods
    /**
     * Generates a string representation of an item with a checkbox indicating its presence in the inventory.
     *
     * @param tabs The number of tabs to include before the item name. Default is 0.
     * @param items The item names to check in the inventory. The first item is used for the checkbox label.
     * @returns A string with the item name, tabs, and checkbox status (🗸 for present, X for absent).
     */
    importantItemCheckbox(tabs = 0, ...items: string[]): string {
        // Generate the required number of tabs
        const _tabs = "";

        // Determine if the items exist in the inventory
        const check = Core.checkInventory(items, 1, { any: true, toInv: false });

        // Return the item name, tabs, and its checkbox status (🗸 for true, X for false)
        return `${items[0]}:${_tabs}${this.checkbox(check)}\n`;
    }

    /**
     * Returns a checkbox representation based on a boolean value.
     *
     * @param check The boolean value indicating whether the checkbox should be checked.
     * @returns A string representation of a checkbox with a checkmark (🗸) or an X (X) depending on the value of `check`.
     */
    checkbox(check: boolean): string {
        return `[ ${check ? "✅" : "❌"} ]`;
    }

    /**
     * Checks the completion status of Forge quests and lists any that are incomplete.
     *
     * @param incompleteQuests An output parameter that will contain the names and IDs of any incomplete quests.
     * @returns The number of completed Forge quests.
     */
    /** C#'s `out List<string> incompleteQuests` is a list the caller passes; this fills it. */
    private checkForgeQuests(incompleteQuests: string[]): number {
        incompleteQuests.splice(0);
        let unlockedQuests = 0;

        for (const [Name, ID] of this.forgeQuests) {
            const quest = Core.initializeWithRetries(() => bot.quests.ensureLoad(ID));
            if (quest != null) {
                if (Core.isCompletedBefore(quest.id)) {
                    unlockedQuests++;
                } else {
                    incompleteQuests.push(`'${Name}' (ID: ${ID}) is not completed.`);
                }
            } else {
                incompleteQuests.push(`Failed to load quest '${Name}' (ID: ${ID}).`);
            }
        }

        return unlockedQuests;
    }

    /**
     * Checks if the player owns any class related to "Chrono" or "Time"
     * from either their inventory or bank.
     *
     * @returns Returns `true` if a "Chrono" or "Time" class is found,
     * otherwise returns `false`.
     */
    private chronoOwned(): boolean {
        // Filter for Chrono/Time classes
        const ChronoClasses = this.heroMartClasses.filter((x) => x.includes("Chrono") || x.includes("Time"));

        // Check if any Chrono class is found in Inventory or Bank
        return bot.inventory.items.concat(...bot.bank.items).some((x) => ChronoClasses.includes(x.name));
    }

    /**
     * Generates a unique evaluation ID by combining a random alphanumeric string with a hexadecimal representation of the username, and scrambling the result.
     *
     * @returns A scrambled evaluation ID string.
     */
    private generateEvaluationID(): string {
        // Alphanumeric characters
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        // Generate a random alphanumeric string
        let randomString = "";
        for (let i = 0; i < 16; i++) randomString += chars[randomInt(0, chars.length)];

        // Convert username to hexadecimal string (C#'s BitConverter.ToString of the UTF-8 bytes)
        const usernameHex = [...Core.username()]
            .map((c) =>
                c.charCodeAt(0) < 128
                    ? c.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")
                    : encodeURIComponent(c).replaceAll("%", ""),
            )
            .join("");

        // Combine the random string with the hexadecimal string
        const combinedString = randomString + usernameHex;

        // Scramble the combined string
        return [...combinedString]
            .map((c) => ({ c, k: Math.random() }))
            .sort((a, b) => a.k - b.k)
            .map((x) => x.c)
            .join("");
    }

    /**
     * Builds and returns a status report summarizing the completion of Forge quests and any additional relevant information.
     *
     * @returns A formatted status report string.
     */
    getStatusReport(): string {
        // Call CheckForgeQuests to get the list of incomplete quests
        const incompleteQuests: string[] = [];
        const unlockedQuests = this.checkForgeQuests(incompleteQuests);

        // Build the report string
        const reportBuilder: string[] = [];
        reportBuilder.push(`Number of unlocked quests: ${unlockedQuests}`);

        if (incompleteQuests.length > 0) {
            reportBuilder.push("Incomplete quests:");
            for (const quest of incompleteQuests) {
                reportBuilder.push(quest);
            }
        } else {
            reportBuilder.push("All Forge Quests are completed!");
        }
        return reportBuilder.join("\n") + "\n";
    }

    /**
     * Gets the list of racial gear boosts excluding specific types.
     *
     * @returns An array of racial gear boosts, excluding the specified types.
     */
    private get racialGears(): RacialGearBoost[] {
        return (choices(RacialGearBoost) as RacialGearBoost[]).filter((x) => !RacialGearBoost.None.includes(x));
    }

    /**
     * Determines if an inventory item is neither a weapon nor armor.
     *
     * @param x The inventory item to evaluate.
     * @returns True if the item is neither a weapon nor armor; otherwise, false.
     */
    isNonWeapon(x: InventoryItem): boolean {
        return (
            x.category !== "Sword" &&
            x.category !== "Axe" &&
            x.category !== "Dagger" &&
            x.category !== "Gun" &&
            x.category !== "HandGun" &&
            x.category !== "Rifle" &&
            x.category !== "Bow" &&
            x.category !== "Mace" &&
            x.category !== "Gauntlet" &&
            x.category !== "Polearm" &&
            x.category !== "Staff" &&
            x.category !== "Wand" &&
            x.category !== "Whip"
        );
    }

    private isNumeric(str: string): boolean {
        // C# double.TryParse
        return str.trim() !== "" && !isNaN(Number(str));
    }

    masterofWarMeta(): boolean {
        // Define unwanted meta types as a HashSet for faster lookups
        const unwantedMetaTypes = new Set(["AutoAdd", "Drakath", "anim", "chance", "Necromancer", "NoSell"]);

        // Check for at least one item with 4 or more valid meta types
        let hasValidItem = false;

        // Concatenate inventory and bank items, then filter for Armor or Pet categories
        for (const item of bot.inventory.items
            .concat(...bot.bank.items)
            .filter(
                (item) => item != null && item.meta != null && (item.category === "Armor" || item.category === "Pet"),
            )) {
            // Clean unwanted meta types from the item's meta string
            let cleanedMeta = [...unwantedMetaTypes].reduce(
                (currentMeta, unwanted) =>
                    currentMeta
                        .replaceAll(unwanted + ",", "")
                        .replaceAll("," + unwanted, "")
                        .replaceAll(unwanted, ""),
                item.meta,
            );
            // Handle cases without a comma

            // Remove purely numeric meta entries
            cleanedMeta = cleanedMeta
                .split("\n")
                .filter((x) => x)
                .flatMap((line) => line.split(","))
                .filter((entry) => !!entry?.trim() && !this.isNumeric(entry.split(":")[0]) && entry.includes(":"))
                .join(",");
            // Ensure it has a key-value structure

            // Count valid meta pairs
            const validMetaCount = cleanedMeta
                .split(",")
                .filter((x) => x)
                .map((metaEntry) => metaEntry.split(":"))
                .filter(
                    (metaPair) => metaPair.length === 2 && metaPair[1].trim() !== "" && Number(metaPair[1]) >= 1.3,
                ).length;
            // Count only if the value is >= 1.3

            // Log the item and its metas if it has 4 or more valid meta types and hasn't been logged yet
            if (validMetaCount >= 4) {
                hasValidItem = true;
                // Indicate that a valid item has been found
                break;
                // Break the loop as soon as a valid item is found
            }
        }

        // Return true if at least one item with 4 or more valid meta types is found
        return hasValidItem;
    }

    //#endregion
}

export default function main(): void {
    const script = new CheckArmyRoles();
    script.evaluate();
}
