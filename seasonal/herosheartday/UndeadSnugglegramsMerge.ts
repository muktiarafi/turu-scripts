/*
name: Undead Snugglegrams Merge
description: This bot will farm the items belonging to the selected mode for the Undead Snugglegrams Merge [2682] in /heartsdaygrave
tags: undead, snugglegrams, merge, heartsdaygrave, swordhaven, pendragon, noble, saber, pure, nobility, emblem, shield, promised, victory, knighthood, conferment, shadowscythe, visionary, plume, tarnished, unwavering, spite, condemnation, doomknight, tyrant, plate, collar, oppression, darkness, doomed, tyrannical, royal, valiant, guard, silver, ehangwen, forsaken, crimson, halberd, horns, barbute, tyrants, gaze, devastation, destruction
*/
// Port of Scripts/Seasonal/HerosHeartDay/UndeadSnugglegramsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { HeartsDayGrave } from "./heartsdaygrave";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const heartsdaygrave = new HeartsDayGrave();

export class UndeadSnugglegramsMerge {
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
                //#region Items not setup
                case "Heart of Steel":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.registerQuests(!Core.isMember ? 10602 : 10603);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("heartsdaygrave", "Illusionist Zio", "Zio's Discount Chocolates");
                        Core.huntMonster("heartsdaygrave", "Warlord Vaioh", "Vaioh's Snugglegram");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Doomknight Tyrant Skull":

                case "Doomknight Tyrant Helm":

                case "Ether of Darkness":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("heartsdaygrave", "Warlord Vaioh", req.name, req.quantity, { isTemp: req.temp });
                    Core.cancelRegisteredQuests();
                    break;
                case "Gold Voucher 25k":
                    Farm.voucher(req.name, req.quantity);
                    break;
                //#endregion
            }
        };
        heartsdaygrave.doStory();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("heartsdaygrave", 2682, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "99108",
            "Swordhaven Pendragon",
            'Mode: [select] only\nShould the bot buy "Swordhaven Pendragon" ?',
            false,
        ),
        option.bool(
            "99109",
            "Noble Swordhaven Pendragon",
            'Mode: [select] only\nShould the bot buy "Noble Swordhaven Pendragon" ?',
            false,
        ),
        option.bool("99112", "Noble Saber Hair", 'Mode: [select] only\nShould the bot buy "Noble Saber Hair" ?', false),
        option.bool(
            "99113",
            "Noble Saber Locks",
            'Mode: [select] only\nShould the bot buy "Noble Saber Locks" ?',
            false,
        ),
        option.bool(
            "99117",
            "Pure Nobility Cape",
            'Mode: [select] only\nShould the bot buy "Pure Nobility Cape" ?',
            false,
        ),
        option.bool(
            "99118",
            "Swordhaven Emblem Shield",
            'Mode: [select] only\nShould the bot buy "Swordhaven Emblem Shield" ?',
            false,
        ),
        option.bool(
            "99120",
            "Sword of Promised Victory",
            'Mode: [select] only\nShould the bot buy "Sword of Promised Victory" ?',
            false,
        ),
        option.bool(
            "99122",
            "Knighthood Conferment",
            'Mode: [select] only\nShould the bot buy "Knighthood Conferment" ?',
            false,
        ),
        option.bool(
            "99125",
            "Shadowscythe Visionary",
            'Mode: [select] only\nShould the bot buy "Shadowscythe Visionary" ?',
            false,
        ),
        option.bool(
            "99126",
            "Noble Shadowscythe Visionary",
            'Mode: [select] only\nShould the bot buy "Noble Shadowscythe Visionary" ?',
            false,
        ),
        option.bool(
            "99129",
            "Shadowscythe Visionary Helm",
            'Mode: [select] only\nShould the bot buy "Shadowscythe Visionary Helm" ?',
            false,
        ),
        option.bool(
            "99131",
            "Shadowscythe Visionary Plume",
            'Mode: [select] only\nShould the bot buy "Shadowscythe Visionary Plume" ?',
            false,
        ),
        option.bool(
            "99132",
            "Tarnished Nobility Cape",
            'Mode: [select] only\nShould the bot buy "Tarnished Nobility Cape" ?',
            false,
        ),
        option.bool(
            "99133",
            "Shadowscythe Emblem Shield",
            'Mode: [select] only\nShould the bot buy "Shadowscythe Emblem Shield" ?',
            false,
        ),
        option.bool(
            "99135",
            "Sword of Unwavering Spite",
            'Mode: [select] only\nShould the bot buy "Sword of Unwavering Spite" ?',
            false,
        ),
        option.bool(
            "99137",
            "Knighthood Condemnation",
            'Mode: [select] only\nShould the bot buy "Knighthood Condemnation" ?',
            false,
        ),
        option.bool(
            "99327",
            "Doomknight Tyrant",
            'Mode: [select] only\nShould the bot buy "Doomknight Tyrant" ?',
            false,
        ),
        option.bool(
            "99329",
            "Doomknight Tyrant Plate",
            'Mode: [select] only\nShould the bot buy "Doomknight Tyrant Plate" ?',
            false,
        ),
        option.bool(
            "99333",
            "Doomknight Tyrant Collar",
            'Mode: [select] only\nShould the bot buy "Doomknight Tyrant Collar" ?',
            false,
        ),
        option.bool(
            "99337",
            "Oppression of Darkness",
            'Mode: [select] only\nShould the bot buy "Oppression of Darkness" ?',
            false,
        ),
        option.bool(
            "99339",
            "Doomed Tyrannical Gauntlets",
            'Mode: [select] only\nShould the bot buy "Doomed Tyrannical Gauntlets" ?',
            false,
        ),
        option.bool(
            "99340",
            "Tyrannical Shield Gauntlets",
            'Mode: [select] only\nShould the bot buy "Tyrannical Shield Gauntlets" ?',
            false,
        ),
        option.bool(
            "99110",
            "Royal Swordhaven Pendragon",
            'Mode: [select] only\nShould the bot buy "Royal Swordhaven Pendragon" ?',
            false,
        ),
        option.bool(
            "99111",
            "Valiant Swordhaven Pendragon",
            'Mode: [select] only\nShould the bot buy "Valiant Swordhaven Pendragon" ?',
            false,
        ),
        option.bool(
            "99115",
            "Swordhaven Pendragon Guard",
            'Mode: [select] only\nShould the bot buy "Swordhaven Pendragon Guard" ?',
            false,
        ),
        option.bool(
            "99116",
            "Swordhaven Pendragon Plume",
            'Mode: [select] only\nShould the bot buy "Swordhaven Pendragon Plume" ?',
            false,
        ),
        option.bool("99124", "Silver Ehangwen", 'Mode: [select] only\nShould the bot buy "Silver Ehangwen" ?', false),
        option.bool(
            "99127",
            "Royal Shadowscythe Visionary",
            'Mode: [select] only\nShould the bot buy "Royal Shadowscythe Visionary" ?',
            false,
        ),
        option.bool(
            "99128",
            "Forsaken Shadowscythe Visionary",
            'Mode: [select] only\nShould the bot buy "Forsaken Shadowscythe Visionary" ?',
            false,
        ),
        option.bool(
            "99130",
            "Shadowscythe Visionary Guard",
            'Mode: [select] only\nShould the bot buy "Shadowscythe Visionary Guard" ?',
            false,
        ),
        option.bool("99139", "Crimson Halberd", 'Mode: [select] only\nShould the bot buy "Crimson Halberd" ?', false),
        option.bool(
            "99330",
            "Doomknight Tyrant Horns",
            'Mode: [select] only\nShould the bot buy "Doomknight Tyrant Horns" ?',
            false,
        ),
        option.bool(
            "99331",
            "Doomknight Tyrant Barbute",
            'Mode: [select] only\nShould the bot buy "Doomknight Tyrant Barbute" ?',
            false,
        ),
        option.bool(
            "99335",
            "Doomknight Tyrant's Gaze",
            'Mode: [select] only\nShould the bot buy "Doomknight Tyrant\'s Gaze" ?',
            false,
        ),
        option.bool(
            "99341",
            "Tyrannical Devastation",
            'Mode: [select] only\nShould the bot buy "Tyrannical Devastation" ?',
            false,
        ),
        option.bool(
            "99342",
            "Tyrannical Destruction",
            'Mode: [select] only\nShould the bot buy "Tyrannical Destruction" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: UndeadSnugglegramsMerge.select,
});

export default function main(): void {
    const script = new UndeadSnugglegramsMerge();
    Core.bankingBlackList.push(
        "Heart of Steel",
        "Doomknight Tyrant Helm",
        "Doomknight Tyrant Skull",
        "Ether of Darkness",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
