/*
name: Daily Gifts
description: This will get all of the available gifts upto this date.
tags: daily-gifts, rare-items
*/
// Port of Scripts/Other/0CurrentDailyGifts.cs.

import { bot, choices, defineScriptOptions, option } from "turu";
import { configEnum, Core } from "../core/CoreBots";
import { CoreLegion } from "../legion/CoreLegion";

const Legion = new CoreLegion();

export enum Month {
    January = 1,
    February = 2,
    March = 3,
    April = 4,
    May = 5,
    June = 6,
    July = 7,
    August = 8,
    September = 9,
    October = 10,
    November = 11,
    December = 12,
}

export enum DailyGiftsMode {
    All_Chronological = 0,
    Rare_first_then_Permanent = 1,
    Permanent_first_then_Rare = 2,
    Permanent_only = 3,
    Rare_only = 4,
}

export class CurrentDailyGifts {
    getAllGifts(mode: DailyGiftsMode): void {
        const Day = 29;
        const Month = 3;
        const Year = 2023;
        const lastUpdate = new Date(Year, Month - 1, Day).getTime();
        Core.logger("Last update to this bot was on: " + this.formatDate(lastUpdate));

        this.mode = mode;
        Core.logger("Selected mode: " + DailyGiftsMode[mode].replaceAll("_", " "));

        for (let i = 0; i < 2; i++) {
            //#region Old Permanent Gifts
            //Any gifts before this are either permanent or are gone. You guys can add more permanent ones if you feel like doing grunt work.
            //GetGift(Permanent, "map", "monster", "");
            this.getGift(
                this.permanent,
                "legionarena",
                "Blade Master",
                "Soulfire Scarf",
                "Soulfire Sheath",
                "Soulfire Sheath + Scarf",
            );
            this.getGift(
                this.permanent,
                "maul",
                "Vending Machine",
                "Carmel Sandwich Cookie",
                "Carmel Sandwich Cookies",
                "Chocolate Sandwich Cookie",
                "Dual Sandwich Cookies",
                "Grilled Provolone Sandwich",
                "Milanesa And Mashed Potatoes",
                "Sweet Tart",
                "Sweet Tart with Coconut",
            );
            this.getGift(this.permanent, "garden", "Fa", "Re and Fa House Guest Duo");
            this.getGift(
                this.permanent,
                "garden",
                "Creature 83",
                "Creature 83 Bat",
                "Bag of Creature 83 Fluffles",
                "Creature 83 Bats",
                "Creature 83 Hoodie",
                "Creature 83 Hood + Locks",
                "Creature 83 Hood",
            );
            this.getGift(
                this.permanent,
                "eden",
                "Klawaii Machine",
                "Apa's Tour Guide Morph",
                "Crystallis Megaphone",
                "Eden City Tour Flag",
                "Eden Tour Guide's Vest",
                "Eta's Tour Guide Morph",
                "Furled Eden City Umbrella",
                "Key to Eden City",
                "Keys to Eden City",
                "Rainy Day Tour Guide",
            );
            this.getGift(
                this.permanent,
                "garden",
                "Creature 83",
                "Chibi Darkon's Shag",
                "Chibi Darkon's Twintails",
                "Chibi Drago's Shag",
                "Chibi Drago's Twintails",
                "Chibi Fa's Shag",
                "Chibi Fa's Twintails",
                "Chibi La's Shag",
                "Chibi La's Twintails",
                "Chibi Mi's Shag",
                "Chibi Mi's Twintails",
                "Chibi Re's Shag",
                "Chibi Re's Twintails",
                "Chibi So's Shag",
                "Chibi So's Twintails",
                "Chibi Suki's Shag",
                "Chibi Suki's Twintails",
                "Chibi Ti's Shag",
                "Chibi Ti's Twintails",
            );
            this.getGift(
                this.permanent,
                "garden",
                "Creature 72",
                "Chibi Darkon's Pillow",
                "Chibi Drago's Pillow",
                "Chibi Fa's Pillow",
                "Chibi La's Pillow",
                "Chibi Mi's Pillow",
                "Chibi Re's Pillow",
                "Chibi So's Pillow",
                "Chibi Suki's Pillow",
                "Chibi Ti's Pillow",
            );
            // GetGift(Permanent, "eridani", 25, "Malevolent Hourglass");
            this.getGift(
                this.permanent,
                "falcontower",
                "Alteon",
                "Alteon's Dragon Sword",
                "Alteon's Polished Dragon Sword",
            );
            this.getGift(this.permanent, "aqlesson", "Carnax", "Guardian Blade Evolution", "Sanctified Guardian Blade");
            this.getGift(
                this.permanent,
                "superdeath",
                "Super Death",
                "HeroSmash Electina Guard",
                "HeroSmash General Smash Guard",
                "HeroSmash Hottica Guard",
                "HeroSmash Rider Guard",
                "HeroSmash Ultimate Good Guard",
                "HeroSmash Ultimate Evil Guard",
            );
            // GetGift(Permanent, "sepulchure", "Dark Sepulchure", "Gravelyn's Champion Wings", "Gravelyn's Purified DoomBlade", "Vampragon of DOOM");
            this.getGift(
                this.permanent,
                "dflesson",
                "Fluffy the Dracolich",
                "Zurvana's Blessing",
                "Zurvana's Wrath",
                "Zurvana's Wrath",
                "Zurvana's Pity",
                "Zurvana's Pity",
            );
            this.getGift(this.permanent, "mqlesson", "Dragonoid", "Dragonoid Edge", "Dragonoid Edges");
            this.getGift(this.permanent, "aqw3d", "Trolluk", "Underworld Anguish Scythe");
            // GetGift(Permanent, "lavarockbay", "Kalayo", "Lavarock Orb Pet");
            // GetGift(Permanent, "burningbeach", "Lava Guardian", "Burnt Ember Scrap Pet");
            this.getGift(
                this.permanent,
                "twilightzone",
                "Leviathan",
                "Fallen Leviathan's Spear",
                "Staff of the Twilight Sea God",
                "Sea Dragon's Scimitars",
                "Sea Dragon's Scimitar",
            );

            //#endregion
            //GetGift(AvailableUntil(30, 11, 2022), "moonlab", "Nightmare Zorbak", "Zorbak's VordredSlayer", "Zorbak's VordredSlayers");
            //GetGift(AvailableUntil(1, 1, 2022), "tricktown", "Madam Ester", "Twilleven's Power", "Zorbaknar");
            //GetGift(AvailableUntil(1, 1, 2022), "birthday", "Twilly Pinata", "Enchanted League Competitor's Hair", "Enchanted League Competitor's Locks", "Enchanted League Competitor's Locks and Shades", "Enchanted League Competitor's Shades", "League Competitor's Hair Morph", "League Competitor's Locks Morph", "League Competitor's Shaded Locks Morph", "League Competitor's Shades Morph", "Competitor Watch", "Custom Competitor's Watch", "Custom Competitor's Phone", "Competitor's Cane", "Custom Competitor's Cane");
            //GetGift(AvailableUntil(30, 11, 2022), "deathofgames", "Titan Fluffy", "Enchanted Transcendence Blade", "Enchanted Transcendence Blades", "Transcendence Blade", "Transcendence Blades");
            //GetGift(AvailableUntil(30, 11, 2022), "citadelruins", "Grand Inquisitor Murry", "Crimson Grand Inquisitor Armor", "Grand Inquisitor's Cape", "Crimson Grand Inquisitor's Bearded Headdress", "Crimson Grand Inquisitor's Collared Headdress", "Crimson Grand Inquisitor's Headdress", "Crimson Grand Inquisitor's Shaded Headdress");
            //GetGift(AvailableUntil(30, 11, 2022), "harvestqueen", "Harvest Queen", "Cursed Pumpkin Pet", "Cute Pumpkin Pet");
            //GetGift(AvailableUntil(30, 11, 2022), "birdswithharms", "Turking", "Harvest Assassin", "Harvest Assassin's Cape", "Harvest Assassin's Hood", "Harvest Assassin's Blades", "Harvest Assassin's Sword + Axe", "Harvest Assassin's Blade");
            //GetGift(AvailableUntil(9, 12, 2022), "ebiltakeover", "Ebil Jack Sprat", "Pink POSE! Pitchfork", "Pitchfork of Shadows");
            //GetGift(AvailableUntil(9, 12, 2022), "hbchallenge", "Module 005", "Module 005 Chibi Pet");
            //GetGift(AvailableUntil(9, 12, 2022), "ebiltakeover", "Ebil Red Dragon", "Darkened Adherent Faceplate", "Darken", "Darken Helm", "Prisma Guard", "Prisma Cracked Orb", "Prisma Plunger", "Prisma Shoe-Chucks");
            //GetGift(AvailableUntil(9, 12, 2022), "blackfridaywar", "Deal Bot 2.0", "Rose Phoenix Sword", "Obsidian Phoenix Sword");
            //GetGift(AvailableUntil(9, 12, 2022), "dreammaster", "Calico Cobby", "Cute Calico Cobby Pet");
            //GetGift(AvailableUntil(31, 12, 2022), "ebilcorphq", "Master Chairman", "Suave Suit of Ebil", "Chic Frostval Locks", "Chic Frostval Locks + Glasses", "Chic Locks", "Chic Locks + Glasses", "Suave Frostval Hair + Glasses", "Suave Frostval Hat", "Suave Hair", "Suave Hair + Glasses", "Classy Cane of Ebil", "Elegant Cane of Ebil");
            //GetGift(AvailableUntil(31, 12, 2022), "Helsgrove", "Helsdottir", "Frostval Barbarian Axe", "Frostval Barbarian Axes");
            //GetGift(AvailableUntil(31, 12, 2022), "deerhunt", "Deer?", "Little Reindeer Morph", "Reind'AWWW Moglin");
            //GetGift(AvailableUntil(31, 12, 2022), "yulecat", "Kitty Yu Yule", "Beleen's Festive Frostval Outfit", "Beleen's Festive Hero Hat + Locks", "Beleen's Festive Hero Hat + Hair");
            //GetGift(AvailableUntil(31, 12, 2022), "ultrafrostfang", "Ultra Frost Fang", "Baby Frost Dragon");
            //GetGift(AvailableUntil(31, 12, 2022), "snowview", "Arctic Fox", "Arctic Fox Guard", "Arctic Fox Guard At Rest", "Arctic Fox Pet");
            //GetGift(AvailableUntil(31, 12, 2022), "deerhunt", "Zweinichthirsch", "Spirit Of Frostval", "Frostval Holly + Candle");

            //#region January 2023
            //GetGift(AvailableUntil(14, 1), "snowview", "Vaderix", "Dire Wolf Pup");
            //GetGift(AvailableUntil(31, 1), "snowviewrace", "Bandit", "Frostlorn Hair", "Frostlorn Locks");
            //GetGift(AvailableUntil(31, 1), "carolinn", "Frostval Deer", "CandyCane Capybara Pet");
            //GetGift(AvailableUntil(31, 1), "everfrost", "Chillbite", "Ancient Axe of the Archipelago");
            //GetGift(AvailableUntil(31, 1), "newyear", "2023 Ball", "Chaotic Chrono Eye", "New Year Dawning", "Elegant Bejeweled Cane", "AntiRetrograde Clock", "Nascent ChronoWeaver's Runes", "Frigid Wolf Spear");
            //GetGift(AvailableUntil(31, 1), "timeretaliate", "Retrograde Maw", "Nascent ChronoWeaver's Clock", "Polychronic Magister's Hourglasses", "Polychronic Magister's Hourglass", "Chronobound Gear", "Nascent Temporal Portal");
            //GetGift(AvailableUntil(31, 1), "timeretaliate", $"Min’et’s Corpse", "Astromancer's Shag", "Astromancer's Locks", "Astromancer's Cowl + locks", "Astromancer's Cowl", "BlackHole Shrine", "Astral Balance", "Astral Lantern");
            //GetGift(AvailableUntil(31, 1), "timeritual", "Chronocide", "Space-timeless Claws", "Space-timeless Sword", "Space-timeless Staff", "Space-timeless Daggers", "Space-timeless Axe", "Hollowborn Alchemist's Fist");
            this.getGift(
                this.permanent,
                "brokenwoods",
                "Eldritch Amalgamation",
                "Diabolical Warden's Katana",
                "Diabolical Warden's Katanas",
                "Possessed Diabolical Blade",
                "Inflamed Diabolical Tail",
                "Diabolical Banner",
                "Diabolical Bed",
                "Diablocal BookShelf",
                "Diabolical Torch",
            );
            //Bot.Quests.UpdateQuest(7874);
            //GetGift(AvailableUntil(31, 1), "dreampalace", "Zahad", "Mana Rift", "Mana Spiral", "Golden Hawk of Dreams Statue", "Golden Lion of Dreams Statue");
            //GetGift(AvailableUntil(31, 1), "tercessuinotlim", "Dark Makai", "Birthday Helm + Locks of Evil", "Birthday Helm + Locks of Good", "Birthday Helm of Evil", "Birthday Helm of Good");

            //#endregion
            //#region December 2025
            //Shop items
            if (Date.now() <= this.availableUntil(31, 12)) {
                if (!Core.checkInventory("Darkest BladeMaster Assassin", undefined, { toInv: false })) {
                    if (!Core.checkInventory("Legion Token", 6666)) {
                        Legion.farmLegionToken(6666);
                    }

                    Core.buyItem("underworld", 238, "Darkest BladeMaster Assassin");
                }
            }

            if (Date.now() <= this.availableUntil(31, 12)) {
                if (!Core.checkInventory("CyberStrike Achievement Blade", undefined, { toInv: false })) {
                    Core.buyItem("ebilmegamall", 2641, "CyberStrike Achievement Blade");
                }

                if (!Core.checkInventory("CyberStrike Achievement Blades", undefined, { toInv: false })) {
                    Core.buyItem("ebilmegamall", 2641, "CyberStrike Achievement Blades");
                }

                if (!Core.checkInventory("CyberStrike Blade Pet", undefined, { toInv: false })) {
                    Core.buyItem("ebilmegamall", 2641, "CyberStrike Blade Pet");
                }
            }

            //Drop Items
            this.getGift(
                this.availableUntil(31, 12),
                "ebilmegamall",
                "Black BOGOdrone Prime",
                "Cyber Hacker Ninja",
                "Umbra Cobra's Serpentine Staff",
            );
            this.getGift(
                this.availableUntil(31, 12),
                "shinkansen",
                "Saint Apa",
                "Crystallis Saint's Hair",
                "Crystallis Sovereign's Locks",
            );
            this.getGift(
                this.availableUntil(31, 12),
                "shinkansen",
                "Saint Eta",
                "Brilliant Hood of The Anomaly",
                "Radiant Hood of the Anomaly",
            );

            //#endregion
            //GetGift(AvailableUntil(1, 1), "map", "monster", "");
            //GetGift(Permanent, "map", "monster", "");

            this.secondHalf = true;
            if (mode === 0 || mode >= 3) {
                break;
            }
        }
    }

    //#region GetGift Functions
    /** Checks if the items have expired yet, and if not it farms it */
    private getGift(expiresAt: number, map: string, monster: string | number, ...items: string[]): void {
        if (expiresAt === this.permanent) {
            switch (this.mode) {
                case DailyGiftsMode.Permanent_first_then_Rare:
                    if (this.secondHalf) {
                        return;
                    }
                    break;
                case DailyGiftsMode.Rare_first_then_Permanent:
                    if (!this.secondHalf) {
                        return;
                    }
                    break;
                case DailyGiftsMode.Rare_only:
                    return;
            }
        } else {
            if (expiresAt + 1 * 86400000 < Date.now()) {
                return;
            }

            switch (this.mode) {
                case DailyGiftsMode.Permanent_first_then_Rare:
                    if (!this.secondHalf) {
                        return;
                    }
                    break;
                case DailyGiftsMode.Rare_first_then_Permanent:
                    if (this.secondHalf) {
                        return;
                    }
                    break;
                case DailyGiftsMode.Permanent_only:
                    return;
            }
        }

        if (!Core.isSeasonalMapActive(map)) {
            return;
        }

        // C# has two overloads: the monster by name, or by its map ID (looked up in the map).
        let monsterName = String(monster);
        if (typeof monster === "number") {
            const mapMonster = bot.monsters.mapMonsters.find((m) => m.mapId === monster);
            if (mapMonster == null) {
                Core.logger(
                    `Something went wrong, the bot could not find any monster by the MapID of ${monster} in ${map}. Please report.`,
                );
                return;
            }
            monsterName = mapMonster.name;
        }

        if (Core.checkInventory(items, undefined, { toInv: false })) {
            return;
        }

        bot.drops.add(...items);
        Core.logger(
            `Daily Gift from ${monsterName} in /${map.toLowerCase()}, ` +
                (expiresAt === this.permanent
                    ? "they're permanent. "
                    : `available untill ${this.formatDate(expiresAt)}. `) +
                `This monster drops the following items:\n[${new Date(Date.now()).toLocaleTimeString("sv-SE")}] (GetGift) "` +
                items.join('" | "') +
                '"',
        );

        for (const item of items) {
            if (typeof monster === "number") {
                Core.huntMonsterMapID(map, monster, item, 1, { isTemp: false, log: false });
            } else {
                Core.huntMonster(map, monster, item, 1, { isTemp: false, log: false });
            }
            Core.toBank(item);
        }
    }

    /** 07:00 UTC on that day (C# takes the month as a number or a `Month`). */
    private availableUntil(Day: number, Month: number, Year = 2025): number {
        return Date.UTC(Year, Month - 1, Day, 7, 0, 0);
    }

    /** The date part, as C#'s `ToString(CurrentUICulture.DateTimeFormat)[..10]` meant. */
    private formatDate(time: number): string {
        return new Date(time).toLocaleDateString();
    }

    private permanent: number = 8640000000000000;
    private mode: DailyGiftsMode = DailyGiftsMode.All_Chronological;
    private secondHalf = false;

    //#endregion
}

export const scriptOptions = defineScriptOptions(
    "CurrentDailyGifts",
    [
        Core.skipOptions,
        option.choice(
            "mode",
            "Daily Gift Mode",
            "Please select what behavior you would like the bot to have.",
            choices(DailyGiftsMode),
            DailyGiftsMode[DailyGiftsMode.All_Chronological],
        ),
    ],
    true,
);

export default function main(): void {
    const script = new CurrentDailyGifts();
    Core.setOptions();

    script.getAllGifts(configEnum("mode", DailyGiftsMode, DailyGiftsMode.All_Chronological));

    Core.setOptions(false);
}
