/*
name: Starsword Merge
description: This bot will farm the items belonging to the selected mode for the Starsword Merge [1154] in /dragonroad
tags: upholder, starsword, merge, dragonroad, lava, backblades, reversed, orange, star, scythe, cloud, rider, mirrored, kings, mirror, chronomancers, prophets, djinns, werepyres, twins, mages, bards, starguitar, samurais, mana, knights, drows, escherions, kimberlys, kitsunes, ledgermaynes, lionfangs, vaths, alteons, iadoas, khasaandas, tibicenass, wolfwings, xiangs, eternal, dragons, imbalanced, debris, awe, mechquest, memorial, dragonfable, shadows, black, dragon, oni, queen, monsters, shadowflame, epicduel, biobeasts, twillys, twigs, zorbaks
*/
// Port of Scripts/Other/MergeShops/StarswordMerge[Upholder].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { DragonRoad } from "../../story/DragonRoad[Upholder]";

const Adv = new CoreAdvanced();
const DR = new DragonRoad();

export class StarswordMerge {
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
                case "Dragon Crystal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(4549);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //Gather Energy Beans 4549
                        Core.getMapItem(3760, 4, "DragonRoad");
                        Core.huntMonster("DragonRoad", "Desert Wolf Bandit", "Energy Bean", 3, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        if (!Core.isUpholder()) {
            Core.logger("Upholder Required.");
            return;
        }
        DR.storyLine();
        Core.buyItem("dragonroad", 2342, "DragonRoad Merge Access Card");
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("dragonroad", 1154, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "31352",
            "Lava Starsword Backblades",
            'Mode: [select] only\nShould the bot buy "Lava Starsword Backblades" ?',
            false,
        ),
        option.bool(
            "31351",
            "Reversed Lava Starsword Backblades",
            'Mode: [select] only\nShould the bot buy "Reversed Lava Starsword Backblades" ?',
            false,
        ),
        option.bool(
            "31265",
            "Reversed Orange Starsword Backblades",
            'Mode: [select] only\nShould the bot buy "Reversed Orange Starsword Backblades" ?',
            false,
        ),
        option.bool(
            "31270",
            "Orange Starsword Backblades",
            'Mode: [select] only\nShould the bot buy "Orange Starsword Backblades" ?',
            false,
        ),
        option.bool("31333", "Lava Star Scythe", 'Mode: [select] only\nShould the bot buy "Lava Star Scythe" ?', false),
        option.bool(
            "31325",
            "Orange Star Scythe",
            'Mode: [select] only\nShould the bot buy "Orange Star Scythe" ?',
            false,
        ),
        option.bool(
            "31322",
            "Orange Star Polearm",
            'Mode: [select] only\nShould the bot buy "Orange Star Polearm" ?',
            false,
        ),
        option.bool(
            "31318",
            "Lava Star Polearm",
            'Mode: [select] only\nShould the bot buy "Lava Star Polearm" ?',
            false,
        ),
        option.bool(
            "31309",
            "Orange Star Daggers",
            'Mode: [select] only\nShould the bot buy "Orange Star Daggers" ?',
            false,
        ),
        option.bool(
            "31305",
            "Lava Star Daggers",
            'Mode: [select] only\nShould the bot buy "Lava Star Daggers" ?',
            false,
        ),
        option.bool(
            "31296",
            "Orange Star Staff",
            'Mode: [select] only\nShould the bot buy "Orange Star Staff" ?',
            false,
        ),
        option.bool("31292", "Lava Star Staff", 'Mode: [select] only\nShould the bot buy "Lava Star Staff" ?', false),
        option.bool("31284", "Cloud Rider Hair", 'Mode: [select] only\nShould the bot buy "Cloud Rider Hair" ?', false),
        option.bool("31282", "Cloud Rider", 'Mode: [select] only\nShould the bot buy "Cloud Rider" ?', false),
        option.bool("31372", "Starsword Helm", 'Mode: [select] only\nShould the bot buy "Starsword Helm" ?', false),
        option.bool("31370", "Starsword Armor", 'Mode: [select] only\nShould the bot buy "Starsword Armor" ?', false),
        option.bool(
            "56765",
            "Mirrored King's Star Sword",
            'Mode: [select] only\nShould the bot buy "Mirrored King\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "56766",
            "Mirror Chronomancer's Star Sword",
            'Mode: [select] only\nShould the bot buy "Mirror Chronomancer\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "56767",
            "Mirrored Prophet's Star Sword",
            'Mode: [select] only\nShould the bot buy "Mirrored Prophet\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "56768",
            "Mirrored Djinn's Star Sword",
            'Mode: [select] only\nShould the bot buy "Mirrored Djinn\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "56769",
            "Mirrored Werepyre's Star Sword",
            'Mode: [select] only\nShould the bot buy "Mirrored Werepyre\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "56770",
            "Mirrored Twin's Star Sword",
            'Mode: [select] only\nShould the bot buy "Mirrored Twin\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "56777",
            "Mirrored Mage's Star Sword",
            'Mode: [select] only\nShould the bot buy "Mirrored Mage\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "56778",
            "Mirrored Bard's StarGuitar",
            'Mode: [select] only\nShould the bot buy "Mirrored Bard\'s StarGuitar" ?',
            false,
        ),
        option.bool(
            "56779",
            "Mirrored Samurai's Star Sword",
            'Mode: [select] only\nShould the bot buy "Mirrored Samurai\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "56780",
            "Mirrored Mana Star Sword",
            'Mode: [select] only\nShould the bot buy "Mirrored Mana Star Sword" ?',
            false,
        ),
        option.bool(
            "56781",
            "Mirrored Knight's Star Sword",
            'Mode: [select] only\nShould the bot buy "Mirrored Knight\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "56782",
            "Mirrored Drow's Star Sword",
            'Mode: [select] only\nShould the bot buy "Mirrored Drow\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "64000",
            "Escherion's Star Sword",
            'Mode: [select] only\nShould the bot buy "Escherion\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "64001",
            "Kimberly's Star Sword",
            'Mode: [select] only\nShould the bot buy "Kimberly\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "64002",
            "Kitsune's Star Sword",
            'Mode: [select] only\nShould the bot buy "Kitsune\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "64003",
            "Ledgermayne's Star Sword",
            'Mode: [select] only\nShould the bot buy "Ledgermayne\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "64004",
            "Lionfang's Star Sword",
            'Mode: [select] only\nShould the bot buy "Lionfang\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "64005",
            "Vath's Star Sword",
            'Mode: [select] only\nShould the bot buy "Vath\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "64006",
            "Alteon's Star Sword",
            'Mode: [select] only\nShould the bot buy "Alteon\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "64007",
            "Iadoa's Star Sword",
            'Mode: [select] only\nShould the bot buy "Iadoa\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "64008",
            "Khasaanda's Star Sword",
            'Mode: [select] only\nShould the bot buy "Khasaanda\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "64009",
            "Tibicenas's Star Sword",
            'Mode: [select] only\nShould the bot buy "Tibicenas\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "64010",
            "Wolfwing's Star Sword",
            'Mode: [select] only\nShould the bot buy "Wolfwing\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "64011",
            "Xiang's Star Sword",
            'Mode: [select] only\nShould the bot buy "Xiang\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "64012",
            "Eternal Dragon's Star Sword",
            'Mode: [select] only\nShould the bot buy "Eternal Dragon\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "57023",
            "Imbalanced King's Star Sword",
            'Mode: [select] only\nShould the bot buy "Imbalanced King\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "72811",
            "Star Sword of Debris",
            'Mode: [select] only\nShould the bot buy "Star Sword of Debris" ?',
            false,
        ),
        option.bool(
            "72825",
            "Star Sword of Awe",
            'Mode: [select] only\nShould the bot buy "Star Sword of Awe" ?',
            false,
        ),
        option.bool(
            "72871",
            "MechQuest Memorial Star Sword",
            'Mode: [select] only\nShould the bot buy "MechQuest Memorial Star Sword" ?',
            false,
        ),
        option.bool(
            "72893",
            "DragonFable Memorial Star Sword",
            'Mode: [select] only\nShould the bot buy "DragonFable Memorial Star Sword" ?',
            false,
        ),
        option.bool(
            "72909",
            "Star Sword of Shadows",
            'Mode: [select] only\nShould the bot buy "Star Sword of Shadows" ?',
            false,
        ),
        option.bool(
            "73041",
            "Black Dragon Star Sword",
            'Mode: [select] only\nShould the bot buy "Black Dragon Star Sword" ?',
            false,
        ),
        option.bool("73042", "Oni Star Sword", 'Mode: [select] only\nShould the bot buy "Oni Star Sword" ?', false),
        option.bool(
            "73043",
            "Queen of Monsters Memorial Star Sword",
            'Mode: [select] only\nShould the bot buy "Queen of Monsters Memorial Star Sword" ?',
            false,
        ),
        option.bool(
            "73044",
            "Shadowflame Star Sword",
            'Mode: [select] only\nShould the bot buy "Shadowflame Star Sword" ?',
            false,
        ),
        option.bool(
            "80421",
            "EpicDuel Memorial Star Sword",
            'Mode: [select] only\nShould the bot buy "EpicDuel Memorial Star Sword" ?',
            false,
        ),
        option.bool(
            "80422",
            "BioBeasts Memorial Star Sword",
            'Mode: [select] only\nShould the bot buy "BioBeasts Memorial Star Sword" ?',
            false,
        ),
        option.bool(
            "80423",
            "Twilly's Star Sword",
            'Mode: [select] only\nShould the bot buy "Twilly\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "80424",
            "Twig's Star Sword",
            'Mode: [select] only\nShould the bot buy "Twig\'s Star Sword" ?',
            false,
        ),
        option.bool(
            "80425",
            "Zorbak's Star Sword",
            'Mode: [select] only\nShould the bot buy "Zorbak\'s Star Sword" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: StarswordMerge.select,
});

export default function main(): void {
    const script = new StarswordMerge();
    Core.bankingBlackList.push("Dragon Crystal");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
