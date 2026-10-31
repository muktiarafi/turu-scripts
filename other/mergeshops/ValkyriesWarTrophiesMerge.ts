/*
name: Valkyries War Trophies Merge
description: This bot will farm the items belonging to the selected mode for the Valkyries War Trophies Merge [2737] in /carcossacourt
tags: valkyries, war, trophies, merge, carcossacourt, valkyrie, doom, corrupt, shadowreaper, unreal, concordia, wings, harmonia, dark, carcossa, doomed, dulcinea, twin, bryn, morph, sealed, grand, spear, lorelei, scythe, skullstaff
*/
// Port of Scripts/Other/MergeShops/ValkyriesWarTrophiesMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreSDKA } from "../../evil/sdka/CoreSDKA";
import { MirrorRealmMerge } from "./MirrorRealmMerge";
import { SRoD } from "../weapons/ShadowReaperOfDoom";
import { ShadowMerge } from "../../seasonal/friday13th/mergeshops/ShadowMerge";

const Adv = new CoreAdvanced();
const sRoD = new SRoD();
const SDKA = new CoreSDKA();
const MRM = new MirrorRealmMerge();
const shadowMerge = new ShadowMerge();

export class ValkyriesWarTrophiesMerge {
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
                case "A Revelation":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(10778, 10779);
                    Core.killMonster("carcossacourt", "r5", "Left", "*", req.name, req.quantity, { isTemp: req.temp });
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                case "Doom Aura": {
                    const ptp = new Map([
                        ["Necrotic Scythe of Scourge", 2184],
                        ["Necrotic Daggers of Destruction", 2181],
                        ["Necrotic Shade Blade", 2182],
                        ["Necrotic Broadsword of Bane", 2183],
                        ["Necrotic Mace of Misery", 2185],
                        ["Necrotic Bow of the Shadow", 2186],
                    ]);
                    let weapon: string | null = null;
                    for (const item of [...ptp.keys()]) {
                        if (!Core.checkInventory(item)) {
                            continue;
                        }

                        weapon = item;
                        break;
                    }
                    if (weapon == null) {
                        Core.logger(`Missing any valid Necrotic weapon to acquire ${req.name}`);
                        return;
                    }
                    // Uses the first owned weapon found.
                    SDKA.pinpointthePieces(ptp.get(weapon)!, ["Doom Aura"], [req.quantity]);
                    break;
                }
                case "Fabled Doom Blade":
                    shadowMerge.buyAllMerge(req.name);
                    break;
                case "True Doomknight Helm":
                    Adv.buyItem("terminatemple", 2343, req.name);
                    break;
                case "Twin Blades of Doom":

                case "SkullStaff of Doom":
                    MRM.buyAllMerge(req.name);
                    break;
                case "ShadowReaper Of Doom":
                    sRoD.shadowReaperOfDoom();
                    break;
            }
        };
        // ValkyriesWarTrophiesMerge
        // Adv.MergeItemisinShopExceptions =
        // [
        //     "item",
        //     "item2",
        //     "item3"
        // ];

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("carcossacourt", 2737, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "101521",
            "Valkyrie of Doom",
            'Mode: [select] only\nShould the bot buy "Valkyrie of Doom" ?',
            false,
        ),
        option.bool(
            "101755",
            "Corrupt ShadowReaper of Doom",
            'Mode: [select] only\nShould the bot buy "Corrupt ShadowReaper of Doom" ?',
            false,
        ),
        option.bool(
            "101756",
            "Unreal ShadowReaper of Doom",
            'Mode: [select] only\nShould the bot buy "Unreal ShadowReaper of Doom" ?',
            false,
        ),
        option.bool(
            "101526",
            "Valkyrie's Concordia Wings",
            'Mode: [select] only\nShould the bot buy "Valkyrie\'s Concordia Wings" ?',
            false,
        ),
        option.bool(
            "101527",
            "Valkyrie's Doom Wings",
            'Mode: [select] only\nShould the bot buy "Valkyrie\'s Doom Wings" ?',
            false,
        ),
        option.bool(
            "101528",
            "Valkyrie's Harmonia Wings",
            'Mode: [select] only\nShould the bot buy "Valkyrie\'s Harmonia Wings" ?',
            false,
        ),
        option.bool(
            "101770",
            "Dark Carcossa Daggers",
            'Mode: [select] only\nShould the bot buy "Dark Carcossa Daggers" ?',
            false,
        ),
        option.bool(
            "101766",
            "Dual Doomed Dulcinea",
            'Mode: [select] only\nShould the bot buy "Dual Doomed Dulcinea" ?',
            false,
        ),
        option.bool(
            "101759",
            "Corrupt Twin Blades of Doom",
            'Mode: [select] only\nShould the bot buy "Corrupt Twin Blades of Doom" ?',
            false,
        ),
        option.bool(
            "101760",
            "Unreal Twin Blades of Doom",
            'Mode: [select] only\nShould the bot buy "Unreal Twin Blades of Doom" ?',
            false,
        ),
        option.bool(
            "101522",
            "Valkyrie Bryn Mask Morph",
            'Mode: [select] only\nShould the bot buy "Valkyrie Bryn Mask Morph" ?',
            false,
        ),
        option.bool(
            "101523",
            "Valkyrie Bryn Mask",
            'Mode: [select] only\nShould the bot buy "Valkyrie Bryn Mask" ?',
            false,
        ),
        option.bool(
            "101524",
            "Valkyrie Bryn Locks",
            'Mode: [select] only\nShould the bot buy "Valkyrie Bryn Locks" ?',
            false,
        ),
        option.bool(
            "101525",
            "Sealed Valkyrie Mask",
            'Mode: [select] only\nShould the bot buy "Sealed Valkyrie Mask" ?',
            false,
        ),
        option.bool(
            "101529",
            "Grand Spear Lorelei",
            'Mode: [select] only\nShould the bot buy "Grand Spear Lorelei" ?',
            false,
        ),
        option.bool(
            "101771",
            "Dark Carcossa Scythe",
            'Mode: [select] only\nShould the bot buy "Dark Carcossa Scythe" ?',
            false,
        ),
        option.bool(
            "101757",
            "Corrupt Skullstaff of Doom",
            'Mode: [select] only\nShould the bot buy "Corrupt Skullstaff of Doom" ?',
            false,
        ),
        option.bool(
            "101758",
            "Unreal Skullstaff of Doom",
            'Mode: [select] only\nShould the bot buy "Unreal Skullstaff of Doom" ?',
            false,
        ),
        option.bool("101765", "Doomed Dulcinea", 'Mode: [select] only\nShould the bot buy "Doomed Dulcinea" ?', false),
        option.bool(
            "101769",
            "Dark Carcossa Dagger",
            'Mode: [select] only\nShould the bot buy "Dark Carcossa Dagger" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ValkyriesWarTrophiesMerge.select,
});

export default function main(): void {
    const script = new ValkyriesWarTrophiesMerge();
    Core.bankingBlackList.push(
        "A Revelation",
        "Fabled Doom Blade",
        "ShadowReaper Of Doom",
        "Doom Aura",
        "True Doomknight Helm",
        "Twin Blades of Doom",
        "SkullStaff of Doom",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
