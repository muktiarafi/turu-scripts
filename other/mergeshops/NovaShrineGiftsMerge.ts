/*
name: Nova Shrine Gifts Merge
description: This bot will farm the items belonging to the selected mode for the Nova Shrine Gifts Merge [2458] in /novashrine
tags: nova, shrine, gifts, merge, novashrine, star, light, destiny, celestial, paladin, winged, nightsky, cloak, lights, stella, empyrean, wings, tail, empyreans, claws, reaver, reavers
*/
// Port of Scripts/Other/MergeShops/NovaShrineGiftsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { AscendedDrakathGear } from "../../chaos/AscendedDrakathGear";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { SanctifiedLightofDestiny } from "../../good/blod/1SanctifiedLightofDestiny";
import { UltimateBLoD } from "../../good/blod/2UltimateBlindingLightofDestiny";
import { CoreBLOD } from "../../good/blod/CoreBLOD";
import { CoreHollowbornPaladin } from "../../hollowborn/hollowbornpaladin/CoreHollowbornPaladin";
import { DragonBladeofNulgath } from "../../nation/various/DragonBlade[mem]";
import { VoidPaladin } from "../../nation/various/VoidPaladin";
import { DreadspaceReplicatorMerge } from "./DreadspaceReplicatorMerge";
import { CyseroItemUpgrade } from "../weapons/CyseroItemUpgradeQuests";
import { ObsidianLightofDestiny } from "../weapons/ObsidianLightofDestiny";
import { StreamwarMerge } from "../../shadowsofwar/mergeshops/StreamwarMerge";
import { CoreDOY } from "../../story/dragonsofyokai/CoreDOY";

const Adv = new CoreAdvanced();
const ADG = new AscendedDrakathGear();
const DRM = new DreadspaceReplicatorMerge();
const VP = new VoidPaladin();
const CIU = new CyseroItemUpgrade();
const CHP = new CoreHollowbornPaladin();
const obsidianLightofDestiny = new ObsidianLightofDestiny();
const ultimateBLoD = new UltimateBLoD();
const sanctifiedLightofDestiny = new SanctifiedLightofDestiny();
const DBoN = new DragonBladeofNulgath();
const BLOD = new CoreBLOD();
const coreDOY = new CoreDOY();
const streamwarMerge = new StreamwarMerge();

export class NovaShrineGiftsMerge {
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
                case "Star Piece":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("starfield", "r3", "bottom", "*", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                case "Ascended Light of Destiny":
                    ADG.ascendedGear("Ascended Light of Destiny");
                    break;
                case "Blackhole Light of Dread Space":
                    DRM.buyAllMerge(req.name);
                    break;
                case "Void Light of Destiny":
                    VP.sacrifice();
                    break;
                case "Polished Blinding Light of Destiny":
                    CIU.getPolishedBLoD();
                    break;
                case "Hollowborn Shadow of Fate":
                    CHP.hbShadowOfFate();
                    break;
                case "Obsidian Light of Destiny":
                    obsidianLightofDestiny.axe();
                    break;
                case "Ultimate Blinding Light of Destiny":
                    ultimateBLoD.ultimateBlindingLightofDestiny();
                    break;
                case "Sanctified Light of Destiny":
                    sanctifiedLightofDestiny.getSanctifiedLightofDestiny();
                    break;
                case "DragonBlade of Nulgath":

                case "Dark Dragon Slayer's Halberd":
                    if (!bot.player.isMember) {
                        streamwarMerge.buyAllMerge("Dark Dragon Slayer's Halberd");
                    } else {
                        DBoN.getDragonBlade(true);
                    }
                    Core.buyItem("novashrine", 2458, "Star Light of Destiny", 1, !bot.player.isMember ? 13334 : 13333);
                    break;
                case "Star of the Empyrean":
                    Core.logger(
                        `Cannot Obtain ${req.name} as its from an "Ultra", and Skua cannot do ultras. Please Wait until InsertCreates/adds this ultra to his Bot Collecetion (and update grim li to 1.5.2 for the newest handler)`,
                    );
                    break;
                case "ArchPaladin Armor":
                    Adv.buyItem("darkthronehub", 1303, req.name);
                    break;
                case "Blinding Aura":
                    BLOD.blindingAura(quant);
                    break;
                case "Cosmic Stardust":

                case "Nova Empyrean Tail":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9802);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("novashrine", "r2", "left", "Nova Empyrean", req.name, quant, {
                            isTemp: req.temp,
                        });
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        coreDOY.novaShrine();
        //Only edit the map and shopID here
        Adv.mergeItemisinShopExceptions = ["Green Dragon Slayer's Halberd"];
        Adv.startBuyAllMerge("novashrine", 2458, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "86372",
            "Star Light of Destiny",
            'Mode: [select] only\nShould the bot buy "Star Light of Destiny" ?',
            false,
        ),
        option.bool(
            "86846",
            "Celestial Paladin",
            'Mode: [select] only\nShould the bot buy "Celestial Paladin" ?',
            false,
        ),
        option.bool(
            "86847",
            "Celestial Paladin Winged Helm",
            'Mode: [select] only\nShould the bot buy "Celestial Paladin Winged Helm" ?',
            false,
        ),
        option.bool(
            "86848",
            "Celestial Paladin Helmet",
            'Mode: [select] only\nShould the bot buy "Celestial Paladin Helmet" ?',
            false,
        ),
        option.bool(
            "86849",
            "Celestial Nightsky Cloak",
            'Mode: [select] only\nShould the bot buy "Celestial Nightsky Cloak" ?',
            false,
        ),
        option.bool(
            "86916",
            "Star Lights of Destiny",
            'Mode: [select] only\nShould the bot buy "Star Lights of Destiny" ?',
            false,
        ),
        option.bool(
            "82857",
            "Stella Empyrean Axe",
            'Mode: [select] only\nShould the bot buy "Stella Empyrean Axe" ?',
            false,
        ),
        option.bool(
            "82858",
            "Stella Empyrean Axes",
            'Mode: [select] only\nShould the bot buy "Stella Empyrean Axes" ?',
            false,
        ),
        option.bool(
            "86854",
            "Nova Empyrean Wings",
            'Mode: [select] only\nShould the bot buy "Nova Empyrean Wings" ?',
            false,
        ),
        option.bool(
            "86855",
            "Nova Empyrean Wings and Tail",
            'Mode: [select] only\nShould the bot buy "Nova Empyrean Wings and Tail" ?',
            false,
        ),
        option.bool(
            "86858",
            "Nova Empyrean's Claws",
            'Mode: [select] only\nShould the bot buy "Nova Empyrean\'s Claws" ?',
            false,
        ),
        option.bool(
            "87394",
            "Star Light of the Empyrean",
            'Mode: [select] only\nShould the bot buy "Star Light of the Empyrean" ?',
            false,
        ),
        option.bool(
            "87395",
            "Star Lights of the Empyrean",
            'Mode: [select] only\nShould the bot buy "Star Lights of the Empyrean" ?',
            false,
        ),
        option.bool(
            "82861",
            "Stella Empyrean Reaver",
            'Mode: [select] only\nShould the bot buy "Stella Empyrean Reaver" ?',
            false,
        ),
        option.bool(
            "82862",
            "Stella Empyrean Reavers",
            'Mode: [select] only\nShould the bot buy "Stella Empyrean Reavers" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: NovaShrineGiftsMerge.select,
});

export default function main(): void {
    const script = new NovaShrineGiftsMerge();
    Core.bankingBlackList.push(
        "Star Piece",
        "Ascended Light of Destiny",
        "Blackhole Light of Dread Space",
        "Void Light of Destiny",
        "Polished Blinding Light of Destiny",
        "Hollowborn Shadow of Fate",
        "Obsidian Light of Destiny",
        "Ultimate Blinding Light of Destiny",
        "Sanctified Light of Destiny",
        "DragonBlade of Nulgath",
        "Star of the Empyrean",
        "ArchPaladin Armor",
        "Blinding Aura",
        "Cosmic Stardust",
        "Nova Empyrean Tail",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
