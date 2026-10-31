/*
name: FiendVoid Merge
description: This bot will farm the items belonging to the selected mode for the FiendVoid Merge [2669] in /fiendvoid
tags: fiendvoid, merge, fiendvoid, baleful, scolex, void, fiendish, frenzy, ascension, bonebound, nulgath, ivory, fiend, skull, shell, voids, death, drive, covenant, bone, covenants, nation, boneforged, spines, todestrieb, undying
*/
// Port of Scripts/Other/MergeShops/FiendVoidMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreNSOD } from "../../evil/nsod/CoreNSOD";
import { CoreNation } from "../../nation/CoreNation";
import { FiendVoid } from "../../story/nation/FiendVoid";

const Adv = new CoreAdvanced();
const Nation = new CoreNation();
const NSoD = new CoreNSOD();
const fiendVoid = new FiendVoid();

export class FiendVoidMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buildItemCache(): Set<string> {
        const cache: Set<string> = new Set();

        for (const item of bot.inventory.items) {
            if (item?.name != null) {
                cache.add(item.name);
            }
        }

        if (bot.bank.items != null) {
            for (const item of bot.bank.items) {
                if (item?.name != null) {
                    cache.add(item.name);
                }
            }
        }

        return cache;
    }

    bossDrops: string[] = [
        "Abyssal Corruption Kama",
        "Abyssal Corruption Kamas",
        "Abyssal Master Backsword",
        "Abyssal Master Backswords",
        "Fiendish Apprentice Grin",
        "Fiendish Deathstalker Cloak",
        "Nation's Legacy Plaque",
        "ShadowBone Covenant",
        "ShadowBone Covenants",
        "ShadowBone Shell",
        "ShadowBone Skull",
        "ShadowBone Void of Nulgath",
    ];

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
                case "Bones from the Void Realm":
                    NSoD.bonesVoidRealm(1);
                    break;
                case "ArchFiend Bone": {
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    const itemCache = this.buildItemCache();
                    Core.addDrop(...this.bossDrops.filter((drop) => !itemCache.has(drop)));
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(Core.isMember ? 10571 : 10570);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("fiendvoid", "Void Fang", "Diluted Venom", 6, { isTemp: false });
                        Core.huntMonster("fiendvoid", "Arachnid Seeker", "Seeker Thorax", 6, { isTemp: false });
                        Core.huntMonster("fiendvoid", "Archfiend Casimir", "Covetous Hand", 1, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                }
                //#endregion
                //#region Known items
                case "Unidentified 13":
                    Nation.farmUni13(quant);
                    break;
                case "Blood Gem of the Archfiend":
                    Nation.farmBloodGem(quant);
                    break;
                case "Totem of Nulgath":
                    Nation.farmTotemofNulgath(quant);
                    break;
                case "Unidentified 23":
                    Core.farmingLogger(req.name, quant);
                    Nation.theAssistant("Unidentified 23", quant);
                    break;
                case "Diamond of Nulgath":
                    Nation.farmDiamondofNulgath(quant);
                    break;
                case "Gem of Nulgath":
                    Nation.farmGemofNulgath(quant);
                    break;
                case "Nulgath's Approval":
                    Nation.approvalAndFavor(quant, 0);
                    break;
                case "Voucher of Nulgath (non-mem)":
                    Nation.farmVoucher({ member: false });
                    break;
                case "Dark Crystal Shard":
                    Nation.farmDarkCrystalShard(quant);
                    break;
                case "Tainted Gem":
                    Nation.farmTaintedGem(quant);
                    break;
                //#endregion
            }
        };
        fiendVoid.fiendVoid_Questline();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("fiendvoid", 2669, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "98491",
            "Baleful Scolex of the Void",
            'Mode: [select] only\nShould the bot buy "Baleful Scolex of the Void" ?',
            false,
        ),
        option.bool(
            "98492",
            "Fiendish Frenzy of Ascension",
            'Mode: [select] only\nShould the bot buy "Fiendish Frenzy of Ascension" ?',
            false,
        ),
        option.bool(
            "98646",
            "Bonebound Void of Nulgath",
            'Mode: [select] only\nShould the bot buy "Bonebound Void of Nulgath" ?',
            false,
        ),
        option.bool(
            "98647",
            "Ivory Fiend Skull",
            'Mode: [select] only\nShould the bot buy "Ivory Fiend Skull" ?',
            false,
        ),
        option.bool(
            "98648",
            "Ivory Fiend Shell",
            'Mode: [select] only\nShould the bot buy "Ivory Fiend Shell" ?',
            false,
        ),
        option.bool(
            "98649",
            "Void's Death Drive",
            'Mode: [select] only\nShould the bot buy "Void\'s Death Drive" ?',
            false,
        ),
        option.bool(
            "98650",
            "Fiendish Covenant of Bone",
            'Mode: [select] only\nShould the bot buy "Fiendish Covenant of Bone" ?',
            false,
        ),
        option.bool(
            "98651",
            "Fiendish Covenants of Bone",
            'Mode: [select] only\nShould the bot buy "Fiendish Covenants of Bone" ?',
            false,
        ),
        option.bool(
            "98652",
            "Nation Covenant of Bone",
            'Mode: [select] only\nShould the bot buy "Nation Covenant of Bone" ?',
            false,
        ),
        option.bool(
            "98653",
            "Nation Covenants of Bone",
            'Mode: [select] only\nShould the bot buy "Nation Covenants of Bone" ?',
            false,
        ),
        option.bool(
            "98654",
            "Boneforged Void of Nulgath",
            'Mode: [select] only\nShould the bot buy "Boneforged Void of Nulgath" ?',
            false,
        ),
        option.bool("98655", "Ivory Fiend Helm", 'Mode: [select] only\nShould the bot buy "Ivory Fiend Helm" ?', false),
        option.bool(
            "98656",
            "Ivory Fiend Spines",
            'Mode: [select] only\nShould the bot buy "Ivory Fiend Spines" ?',
            false,
        ),
        option.bool(
            "98657",
            "Void's Todestrieb",
            'Mode: [select] only\nShould the bot buy "Void\'s Todestrieb" ?',
            false,
        ),
        option.bool(
            "98658",
            "Undying Covenant of Bone",
            'Mode: [select] only\nShould the bot buy "Undying Covenant of Bone" ?',
            false,
        ),
        option.bool(
            "98659",
            "Undying Covenants of Bone",
            'Mode: [select] only\nShould the bot buy "Undying Covenants of Bone" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FiendVoidMerge.select,
});

export default function main(): void {
    const script = new FiendVoidMerge();
    Core.bankingBlackList.push(
        "Unidentified 13",
        "Blood Gem of the Archfiend",
        "Totem of Nulgath",
        "Bones from the Void Realm",
        "Unidentified 23",
        "ArchFiend Bone",
        "Diamond of Nulgath",
        "Gem of Nulgath",
        "Nulgath's Approval",
        "Voucher of Nulgath (non-mem)",
        "Dark Crystal Shard",
        "Tainted Gem",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
