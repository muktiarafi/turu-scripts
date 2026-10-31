/*
name: Atlas Falls Gear Merge
description: This bot will farm the items belonging to the selected mode for the Atlas Falls Gear Merge [2568] in /atlasfalls
tags: atlas, falls, gear, merge, atlasfalls, underworld, gatekeeper, galea, flag, sheathed, alexiares, key, territory, unconquerable, anicetus, keys, elite, lone, wolf, jagged, lupo, pet, azione, solo, legion, necromancer, cowl, sovereign, banner, crown, evanescence, hand, hands, hraesvelgr, shield, rider, horns, undead, urla, spear, halberd, ulare, guard, sworn, promised, empowered, cloak, terror, enyo, eclipse, eclipses
*/
// Port of Scripts/Legion/MergeShops/AtlasFallsGearMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";
import { AtlasFalls } from "../../story/legion/AtlasFalls";

const Adv = new CoreAdvanced();
const AF = new AtlasFalls();
const Legion = new CoreLegion();

export class AtlasFallsGearMerge {
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
                case "Atlas Regalia":
                    Core.farmingLogger(req.name, quant);
                    if (Core.checkInventory("Chaos Avenger")) {
                        Core.useBossClass();
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonsterQuest(10137, "atlasfalls", "King Zedek");
                            bot.wait.forPickup(req.name);
                        }
                    } else {
                        Core.logger(`${req.name} requires army, please farm it manually.`, undefined, {
                            stopBot: true,
                        });
                    }
                    break;
                case "Arethusa's Black Steel":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("atlasfalls", "Princess Arethusa", req.name, quant, {
                        isTemp: false,
                        log: false,
                        publicRoom: true,
                    });
                    break;
                case "Sundered Soul of Atlas":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("atlasfalls", "Sundered Soul", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Atlas Crest":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("atlaskingdom", "Atlas Light Magus", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
            }
        };
        AF.storyline();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("atlasfalls", 2568, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "84718",
            "Underworld Gatekeeper",
            'Mode: [select] only\nShould the bot buy "Underworld Gatekeeper" ?',
            false,
        ),
        option.bool(
            "84719",
            "Underworld Gatekeeper Galea",
            'Mode: [select] only\nShould the bot buy "Underworld Gatekeeper Galea" ?',
            false,
        ),
        option.bool(
            "84720",
            "Underworld Gatekeeper Helm",
            'Mode: [select] only\nShould the bot buy "Underworld Gatekeeper Helm" ?',
            false,
        ),
        option.bool("84721", "Underworld Flag", 'Mode: [select] only\nShould the bot buy "Underworld Flag" ?', false),
        option.bool(
            "84722",
            "Sheathed Alexiares Key",
            'Mode: [select] only\nShould the bot buy "Sheathed Alexiares Key" ?',
            false,
        ),
        option.bool(
            "84723",
            "Underworld Territory",
            'Mode: [select] only\nShould the bot buy "Underworld Territory" ?',
            false,
        ),
        option.bool(
            "84724",
            "Unconquerable Anicetus",
            'Mode: [select] only\nShould the bot buy "Unconquerable Anicetus" ?',
            false,
        ),
        option.bool(
            "84725",
            "Dual Unconquerable Anicetus",
            'Mode: [select] only\nShould the bot buy "Dual Unconquerable Anicetus" ?',
            false,
        ),
        option.bool("84726", "Alexiares Key", 'Mode: [select] only\nShould the bot buy "Alexiares Key" ?', false),
        option.bool("84727", "Alexiares Keys", 'Mode: [select] only\nShould the bot buy "Alexiares Keys" ?', false),
        option.bool(
            "84728",
            "Anicetus and Alexiares",
            'Mode: [select] only\nShould the bot buy "Anicetus and Alexiares" ?',
            false,
        ),
        option.bool("92786", "Atlas Elite", 'Mode: [select] only\nShould the bot buy "Atlas Elite" ?', false),
        option.bool("92787", "Atlas Elite Helm", 'Mode: [select] only\nShould the bot buy "Atlas Elite Helm" ?', false),
        option.bool(
            "92649",
            "Underworld Lone Wolf",
            'Mode: [select] only\nShould the bot buy "Underworld Lone Wolf" ?',
            false,
        ),
        option.bool(
            "92652",
            "Underworld Lone Wolf Mask",
            'Mode: [select] only\nShould the bot buy "Underworld Lone Wolf Mask" ?',
            false,
        ),
        option.bool(
            "92653",
            "Underworld Lone Wolf Hair",
            'Mode: [select] only\nShould the bot buy "Underworld Lone Wolf Hair" ?',
            false,
        ),
        option.bool(
            "92654",
            "Underworld Lone Wolf Locks",
            'Mode: [select] only\nShould the bot buy "Underworld Lone Wolf Locks" ?',
            false,
        ),
        option.bool(
            "92655",
            "Jagged Underworld Spikes",
            'Mode: [select] only\nShould the bot buy "Jagged Underworld Spikes" ?',
            false,
        ),
        option.bool(
            "92657",
            "Underworld Lupo Pet",
            'Mode: [select] only\nShould the bot buy "Underworld Lupo Pet" ?',
            false,
        ),
        option.bool("92658", "Azione Solo", 'Mode: [select] only\nShould the bot buy "Azione Solo" ?', false),
        option.bool("92659", "Dual Azione Solo", 'Mode: [select] only\nShould the bot buy "Dual Azione Solo" ?', false),
        option.bool(
            "92788",
            "Legion Necromancer",
            'Mode: [select] only\nShould the bot buy "Legion Necromancer" ?',
            false,
        ),
        option.bool(
            "92789",
            "Legion Necromancer Cowl",
            'Mode: [select] only\nShould the bot buy "Legion Necromancer Cowl" ?',
            false,
        ),
        option.bool("92835", "Legion Sovereign", 'Mode: [select] only\nShould the bot buy "Legion Sovereign" ?', false),
        option.bool(
            "92837",
            "Legion Sovereign Helm",
            'Mode: [select] only\nShould the bot buy "Legion Sovereign Helm" ?',
            false,
        ),
        option.bool(
            "92839",
            "Legion Sovereign Locks",
            'Mode: [select] only\nShould the bot buy "Legion Sovereign Locks" ?',
            false,
        ),
        option.bool(
            "92841",
            "Legion Sovereign Banner",
            'Mode: [select] only\nShould the bot buy "Legion Sovereign Banner" ?',
            false,
        ),
        option.bool(
            "92843",
            "Legion Sovereign Crown",
            'Mode: [select] only\nShould the bot buy "Legion Sovereign Crown" ?',
            false,
        ),
        option.bool("92844", "Evanescence", 'Mode: [select] only\nShould the bot buy "Evanescence" ?', false),
        option.bool("92845", "Dual Evanescence", 'Mode: [select] only\nShould the bot buy "Dual Evanescence" ?', false),
        option.bool(
            "92849",
            "Hand of the Legion Sovereign",
            'Mode: [select] only\nShould the bot buy "Hand of the Legion Sovereign" ?',
            false,
        ),
        option.bool(
            "92850",
            "Hands of the Legion Sovereign",
            'Mode: [select] only\nShould the bot buy "Hands of the Legion Sovereign" ?',
            false,
        ),
        option.bool("92231", "Hraesvelgr", 'Mode: [select] only\nShould the bot buy "Hraesvelgr" ?', false),
        option.bool("92232", "Dual Hraesvelgr", 'Mode: [select] only\nShould the bot buy "Dual Hraesvelgr" ?', false),
        option.bool(
            "92237",
            "Hraesvelgr Shield",
            'Mode: [select] only\nShould the bot buy "Hraesvelgr Shield" ?',
            false,
        ),
        option.bool(
            "93078",
            "Underworld Lone Wolf Rider",
            'Mode: [select] only\nShould the bot buy "Underworld Lone Wolf Rider" ?',
            false,
        ),
        option.bool(
            "92651",
            "Underworld Lone Wolf Horns",
            'Mode: [select] only\nShould the bot buy "Underworld Lone Wolf Horns" ?',
            false,
        ),
        option.bool(
            "92663",
            "Undead Urla Spear",
            'Mode: [select] only\nShould the bot buy "Undead Urla Spear" ?',
            false,
        ),
        option.bool("92664", "Halberd of Ulare", 'Mode: [select] only\nShould the bot buy "Halberd of Ulare" ?', false),
        option.bool(
            "92665",
            "Underworld Lone Wolf Guard",
            'Mode: [select] only\nShould the bot buy "Underworld Lone Wolf Guard" ?',
            false,
        ),
        option.bool(
            "92834",
            "Sworn Legion Sovereign",
            'Mode: [select] only\nShould the bot buy "Sworn Legion Sovereign" ?',
            false,
        ),
        option.bool(
            "92836",
            "Promised Legion Sovereign",
            'Mode: [select] only\nShould the bot buy "Promised Legion Sovereign" ?',
            false,
        ),
        option.bool(
            "92838",
            "Legion Sovereign Horns",
            'Mode: [select] only\nShould the bot buy "Legion Sovereign Horns" ?',
            false,
        ),
        option.bool(
            "92840",
            "Empowered Legion Sovereign Locks",
            'Mode: [select] only\nShould the bot buy "Empowered Legion Sovereign Locks" ?',
            false,
        ),
        option.bool(
            "92842",
            "Legion Sovereign Cloak",
            'Mode: [select] only\nShould the bot buy "Legion Sovereign Cloak" ?',
            false,
        ),
        option.bool("92846", "Terror of Enyo", 'Mode: [select] only\nShould the bot buy "Terror of Enyo" ?', false),
        option.bool("92847", "Eclipse of Enyo", 'Mode: [select] only\nShould the bot buy "Eclipse of Enyo" ?', false),
        option.bool("92848", "Eclipses of Enyo", 'Mode: [select] only\nShould the bot buy "Eclipses of Enyo" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AtlasFallsGearMerge.select,
});

export default function main(): void {
    const script = new AtlasFallsGearMerge();
    Core.bankingBlackList.push(
        "Atlas Regalia",
        "Arethusa's Black Steel",
        "Sundered Soul of Atlas",
        "Atlas Crest",
        "Legion Token",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
