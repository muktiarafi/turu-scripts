/*
name: Victors Reward Merge
description: This bot will farm the items belonging to the selected mode for the Victors Reward Merge [2594] in /coliseum
tags: victors, reward, merge, coliseum, floating, sapphire, orbs, manifestation, void, phantasm, tail, black, moon, deep, marauder, berserker, morph, fugitive, mutative, orb, pet, rippling, katana, katanas, sheathed, ivory, thorn, crux, nyx, cruxes, violet, sharp, crew, cut, professional, acidic, raylock, abandoned, undead, skull, arena, forked, scorpions, stinger, ominous, bloodstaff, arrogant, angel, spines, gilded, gunslinger, bounty, hunter, ornate, gold, pistol, pistols, shotgun, rush, knife, knives, beard, , backup, keelia, master, aeris, battlespire, gildead, red, dead, dread, rottouched, northern, bonebreaker, barbarian, wilds, bonebreakers, war, crest, woolly, fur, skullcrusher, totem, totems, barbaric, bonecrusher, bonecrushers, cleaver, cleavers, sturdy, wooden, shield
*/
// Port of Scripts/Other/MergeShops/VictorsRewardMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class VictorsRewardMerge {
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
                case "Silver Victory Laurel": {
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    const svlQuests: number[] = [];
                    if (Core.isMember && bot.quests.isAvailable(10304)) {
                        svlQuests.push(10304);
                    } else if (bot.quests.isAvailable(10303)) {
                        svlQuests.push(10303);
                    }
                    if (svlQuests.length > 0) {
                        Core.registerQuests(...[...svlQuests]);
                        for (let i = 0; i < svlQuests.length; i++) {
                            Core.huntMonster("coliseum", "Devoted Cultist", "Level 25 Boss Defeated", undefined, {
                                log: false,
                            });
                            bot.wait.forPickup(req.name);
                        }
                        Core.cancelRegisteredQuests();
                    }
                    Core.huntMonster("coliseum", "Devoted Cultist", req.name, quant, { isTemp: false, log: false });
                    break;
                }
                case "Gold Victory Laurel": {
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    const gvlQuests: number[] = [];
                    if (Core.isMember && bot.quests.isAvailable(10306)) {
                        gvlQuests.push(10306);
                    } else if (bot.quests.isAvailable(10305)) {
                        gvlQuests.push(10305);
                    }
                    if (gvlQuests.length > 0) {
                        Core.registerQuests(...[...gvlQuests]);
                        for (let i = 0; i < gvlQuests.length; i++) {
                            Core.huntMonster("coliseum", "Incubus", "Level 50 Boss Defeated", undefined, {
                                log: false,
                            });
                            bot.wait.forPickup(req.name);
                        }
                        Core.cancelRegisteredQuests();
                    }
                    Core.huntMonster("coliseum", "Incubus", req.name, quant, { isTemp: false, log: false });
                    break;
                }
                case "Platinum Victory Laurel": {
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    const pvlQuests: number[] = [];
                    if (Core.isMember && bot.quests.isAvailable(10308)) {
                        pvlQuests.push(10308);
                    } else if (bot.quests.isAvailable(10307)) {
                        pvlQuests.push(10307);
                    }
                    if (pvlQuests.length > 0) {
                        Core.registerQuests(...[...pvlQuests]);
                        Core.equipClass(ClassType.Solo);
                        for (let i = 0; i < pvlQuests.length; i++) {
                            Core.huntMonster("coliseum", "The HeartBreaker", "Level 75 Boss Defeated", undefined, {
                                log: false,
                            });
                            bot.wait.forPickup(req.name);
                        }
                        Core.cancelRegisteredQuests();
                    }
                    Core.huntMonster("coliseum", "The HeartBreaker", req.name, quant, { isTemp: false, log: false });
                    break;
                }
                //#endregion
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("coliseum", 2594, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "30953",
            "Floating Sapphire Orbs",
            'Mode: [select] only\nShould the bot buy "Floating Sapphire Orbs" ?',
            false,
        ),
        option.bool(
            "75306",
            "Manifestation of the Void",
            'Mode: [select] only\nShould the bot buy "Manifestation of the Void" ?',
            false,
        ),
        option.bool("82170", "Phantasm Tail", 'Mode: [select] only\nShould the bot buy "Phantasm Tail" ?', false),
        option.bool(
            "83078",
            "Black Moon Dagger",
            'Mode: [select] only\nShould the bot buy "Black Moon Dagger" ?',
            false,
        ),
        option.bool(
            "83079",
            "Black Moon Daggers",
            'Mode: [select] only\nShould the bot buy "Black Moon Daggers" ?',
            false,
        ),
        option.bool(
            "83852",
            "Deep Void Marauder",
            'Mode: [select] only\nShould the bot buy "Deep Void Marauder" ?',
            false,
        ),
        option.bool(
            "83853",
            "Deep Void Berserker",
            'Mode: [select] only\nShould the bot buy "Deep Void Berserker" ?',
            false,
        ),
        option.bool(
            "83854",
            "Deep Void Marauder Morph",
            'Mode: [select] only\nShould the bot buy "Deep Void Marauder Morph" ?',
            false,
        ),
        option.bool(
            "83855",
            "Deep Void Berserker Morph",
            'Mode: [select] only\nShould the bot buy "Deep Void Berserker Morph" ?',
            false,
        ),
        option.bool(
            "83856",
            "Deep Void Fugitive Morph",
            'Mode: [select] only\nShould the bot buy "Deep Void Fugitive Morph" ?',
            false,
        ),
        option.bool(
            "83857",
            "Deep Void Marauder Tail",
            'Mode: [select] only\nShould the bot buy "Deep Void Marauder Tail" ?',
            false,
        ),
        option.bool(
            "83859",
            "Mutative Void Orb Pet",
            'Mode: [select] only\nShould the bot buy "Mutative Void Orb Pet" ?',
            false,
        ),
        option.bool(
            "83860",
            "Mutative Deep Void",
            'Mode: [select] only\nShould the bot buy "Mutative Deep Void" ?',
            false,
        ),
        option.bool(
            "83862",
            "Rippling Void Katana",
            'Mode: [select] only\nShould the bot buy "Rippling Void Katana" ?',
            false,
        ),
        option.bool(
            "83863",
            "Rippling Void Katanas",
            'Mode: [select] only\nShould the bot buy "Rippling Void Katanas" ?',
            false,
        ),
        option.bool(
            "84699",
            "Sheathed Ivory Thorn",
            'Mode: [select] only\nShould the bot buy "Sheathed Ivory Thorn" ?',
            false,
        ),
        option.bool(
            "84702",
            "Sheathed Ivory Blade",
            'Mode: [select] only\nShould the bot buy "Sheathed Ivory Blade" ?',
            false,
        ),
        option.bool("87501", "Crux of Nyx", 'Mode: [select] only\nShould the bot buy "Crux of Nyx" ?', false),
        option.bool("87502", "Cruxes of Nyx", 'Mode: [select] only\nShould the bot buy "Cruxes of Nyx" ?', false),
        option.bool("87511", "Crux of Violet", 'Mode: [select] only\nShould the bot buy "Crux of Violet" ?', false),
        option.bool("87512", "Cruxes of Violet", 'Mode: [select] only\nShould the bot buy "Cruxes of Violet" ?', false),
        option.bool("87751", "Sharp Crew Cut", 'Mode: [select] only\nShould the bot buy "Sharp Crew Cut" ?', false),
        option.bool(
            "87753",
            "Sharp Professional Locks",
            'Mode: [select] only\nShould the bot buy "Sharp Professional Locks" ?',
            false,
        ),
        option.bool(
            "87756",
            "Sharp Crew Cut Morph",
            'Mode: [select] only\nShould the bot buy "Sharp Crew Cut Morph" ?',
            false,
        ),
        option.bool(
            "87757",
            "Sharp Professional Visage",
            'Mode: [select] only\nShould the bot buy "Sharp Professional Visage" ?',
            false,
        ),
        option.bool("88451", "Acidic Raylock", 'Mode: [select] only\nShould the bot buy "Acidic Raylock" ?', false),
        option.bool("89419", "Abandoned Undead", 'Mode: [select] only\nShould the bot buy "Abandoned Undead" ?', false),
        option.bool(
            "89420",
            "Abandoned Undead Skull",
            'Mode: [select] only\nShould the bot buy "Abandoned Undead Skull" ?',
            false,
        ),
        option.bool(
            "90230",
            "Arena Victor's Spikes",
            'Mode: [select] only\nShould the bot buy "Arena Victor\'s Spikes" ?',
            false,
        ),
        option.bool(
            "90231",
            "Arena Victor's Locks",
            'Mode: [select] only\nShould the bot buy "Arena Victor\'s Locks" ?',
            false,
        ),
        option.bool(
            "90242",
            "Forked Scorpion's Stinger",
            'Mode: [select] only\nShould the bot buy "Forked Scorpion\'s Stinger" ?',
            false,
        ),
        option.bool(
            "90244",
            "Ominous BloodStaff",
            'Mode: [select] only\nShould the bot buy "Ominous BloodStaff" ?',
            false,
        ),
        option.bool(
            "90245",
            "Arrogant BloodStaff",
            'Mode: [select] only\nShould the bot buy "Arrogant BloodStaff" ?',
            false,
        ),
        option.bool(
            "91109",
            "Angel of the Void Spines",
            'Mode: [select] only\nShould the bot buy "Angel of the Void Spines" ?',
            false,
        ),
        option.bool(
            "93398",
            "Gilded Gunslinger",
            'Mode: [select] only\nShould the bot buy "Gilded Gunslinger" ?',
            false,
        ),
        option.bool(
            "93399",
            "Gilded Bounty Hunter",
            'Mode: [select] only\nShould the bot buy "Gilded Bounty Hunter" ?',
            false,
        ),
        option.bool(
            "93411",
            "Ornate Gold Pistol",
            'Mode: [select] only\nShould the bot buy "Ornate Gold Pistol" ?',
            false,
        ),
        option.bool(
            "93412",
            "Ornate Gold Pistols",
            'Mode: [select] only\nShould the bot buy "Ornate Gold Pistols" ?',
            false,
        ),
        option.bool(
            "93413",
            "Ornate Gold Shotgun",
            'Mode: [select] only\nShould the bot buy "Ornate Gold Shotgun" ?',
            false,
        ),
        option.bool("93414", "Gold Rush Knife", 'Mode: [select] only\nShould the bot buy "Gold Rush Knife" ?', false),
        option.bool("93415", "Gold Rush Knives", 'Mode: [select] only\nShould the bot buy "Gold Rush Knives" ?', false),
        option.bool("93416", "Ornate Gold Guns", 'Mode: [select] only\nShould the bot buy "Ornate Gold Guns" ?', false),
        option.bool(
            "93401",
            "Gilded Gunslinger Hair",
            'Mode: [select] only\nShould the bot buy "Gilded Gunslinger Hair" ?',
            false,
        ),
        option.bool(
            "93402",
            "Gilded Gunslinger Locks",
            'Mode: [select] only\nShould the bot buy "Gilded Gunslinger Locks" ?',
            false,
        ),
        option.bool(
            "93403",
            "Gilded Gunslinger Beard",
            'Mode: [select] only\nShould the bot buy "Gilded Gunslinger Beard" ?',
            false,
        ),
        option.bool(
            "93405",
            "Gilded Gunslinger Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Gilded Gunslinger Hat + Locks" ?',
            false,
        ),
        option.bool(
            "93406",
            "Gilded Gunslinger Hat",
            'Mode: [select] only\nShould the bot buy "Gilded Gunslinger Hat" ?',
            false,
        ),
        option.bool(
            "93410",
            "Backup Ornate Gold Shotgun",
            'Mode: [select] only\nShould the bot buy "Backup Ornate Gold Shotgun" ?',
            false,
        ),
        option.bool(
            "95658",
            "Keelia the Arena Master",
            'Mode: [select] only\nShould the bot buy "Keelia the Arena Master" ?',
            false,
        ),
        option.bool(
            "95659",
            "Aeris BattleSpire Arena Master",
            'Mode: [select] only\nShould the bot buy "Aeris BattleSpire Arena Master" ?',
            false,
        ),
        option.bool(
            "93400",
            "GilDead Gunslinger",
            'Mode: [select] only\nShould the bot buy "GilDead Gunslinger" ?',
            false,
        ),
        option.bool("93404", "Red Dead Skull", 'Mode: [select] only\nShould the bot buy "Red Dead Skull" ?', false),
        option.bool("93407", "Red Dead Locks", 'Mode: [select] only\nShould the bot buy "Red Dead Locks" ?', false),
        option.bool("93408", "Red Dead Beard", 'Mode: [select] only\nShould the bot buy "Red Dead Beard" ?', false),
        option.bool("93433", "Dread Gunslinger", 'Mode: [select] only\nShould the bot buy "Dread Gunslinger" ?', false),
        option.bool(
            "93434",
            "Dread Bounty Hunter",
            'Mode: [select] only\nShould the bot buy "Dread Bounty Hunter" ?',
            false,
        ),
        option.bool(
            "93435",
            "Dread Dead Gunslinger",
            'Mode: [select] only\nShould the bot buy "Dread Dead Gunslinger" ?',
            false,
        ),
        option.bool("93436", "Dread Dead Skull", 'Mode: [select] only\nShould the bot buy "Dread Dead Skull" ?', false),
        option.bool(
            "93437",
            "Dread Gunslinger Locks",
            'Mode: [select] only\nShould the bot buy "Dread Gunslinger Locks" ?',
            false,
        ),
        option.bool(
            "93438",
            "Dread Gunslinger Hat",
            'Mode: [select] only\nShould the bot buy "Dread Gunslinger Hat" ?',
            false,
        ),
        option.bool("93439", "Dread Dead Locks", 'Mode: [select] only\nShould the bot buy "Dread Dead Locks" ?', false),
        option.bool("93440", "Dread Dead Beard", 'Mode: [select] only\nShould the bot buy "Dread Dead Beard" ?', false),
        option.bool(
            "93442",
            "Backup Rot-Touched Shotgun",
            'Mode: [select] only\nShould the bot buy "Backup Rot-Touched Shotgun" ?',
            false,
        ),
        option.bool(
            "93443",
            "Rot-Touched Pistol",
            'Mode: [select] only\nShould the bot buy "Rot-Touched Pistol" ?',
            false,
        ),
        option.bool(
            "93444",
            "Rot-Touched Pistols",
            'Mode: [select] only\nShould the bot buy "Rot-Touched Pistols" ?',
            false,
        ),
        option.bool(
            "93445",
            "Rot-Touched Shotgun",
            'Mode: [select] only\nShould the bot buy "Rot-Touched Shotgun" ?',
            false,
        ),
        option.bool(
            "93446",
            "Rot-Touched Knife",
            'Mode: [select] only\nShould the bot buy "Rot-Touched Knife" ?',
            false,
        ),
        option.bool(
            "93447",
            "Rot-Touched Knives",
            'Mode: [select] only\nShould the bot buy "Rot-Touched Knives" ?',
            false,
        ),
        option.bool("93448", "Rot-Touched Guns", 'Mode: [select] only\nShould the bot buy "Rot-Touched Guns" ?', false),
        option.bool(
            "97993",
            "Northern BoneBreaker Barbarian",
            'Mode: [select] only\nShould the bot buy "Northern BoneBreaker Barbarian" ?',
            false,
        ),
        option.bool(
            "97994",
            "Northern Wilds Hair",
            'Mode: [select] only\nShould the bot buy "Northern Wilds Hair" ?',
            false,
        ),
        option.bool(
            "97995",
            "Northern Wilds Locks",
            'Mode: [select] only\nShould the bot buy "Northern Wilds Locks" ?',
            false,
        ),
        option.bool(
            "97996",
            "Northern Wilds Morph",
            'Mode: [select] only\nShould the bot buy "Northern Wilds Morph" ?',
            false,
        ),
        option.bool(
            "97997",
            "Northern Wilds Visage",
            'Mode: [select] only\nShould the bot buy "Northern Wilds Visage" ?',
            false,
        ),
        option.bool(
            "97998",
            "BoneBreaker's War Crest",
            'Mode: [select] only\nShould the bot buy "BoneBreaker\'s War Crest" ?',
            false,
        ),
        option.bool(
            "97999",
            "Woolly Northern Fur",
            'Mode: [select] only\nShould the bot buy "Woolly Northern Fur" ?',
            false,
        ),
        option.bool(
            "98000",
            "Skullcrusher Totem",
            'Mode: [select] only\nShould the bot buy "Skullcrusher Totem" ?',
            false,
        ),
        option.bool(
            "98001",
            "Skullcrusher Totems",
            'Mode: [select] only\nShould the bot buy "Skullcrusher Totems" ?',
            false,
        ),
        option.bool(
            "98002",
            "Barbaric Bonecrusher",
            'Mode: [select] only\nShould the bot buy "Barbaric Bonecrusher" ?',
            false,
        ),
        option.bool(
            "98003",
            "Barbaric Bonecrushers",
            'Mode: [select] only\nShould the bot buy "Barbaric Bonecrushers" ?',
            false,
        ),
        option.bool(
            "98004",
            "Barbaric Skull Cleaver",
            'Mode: [select] only\nShould the bot buy "Barbaric Skull Cleaver" ?',
            false,
        ),
        option.bool(
            "98005",
            "Barbaric Skull Cleavers",
            'Mode: [select] only\nShould the bot buy "Barbaric Skull Cleavers" ?',
            false,
        ),
        option.bool(
            "98006",
            "Sturdy Wooden Shield",
            'Mode: [select] only\nShould the bot buy "Sturdy Wooden Shield" ?',
            false,
        ),
        option.bool(
            "98007",
            "Barbaric Skull Cleaver and Shield",
            'Mode: [select] only\nShould the bot buy "Barbaric Skull Cleaver and Shield" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: VictorsRewardMerge.select,
});

export default function main(): void {
    const script = new VictorsRewardMerge();
    Core.bankingBlackList.push("Silver Victory Laurel", "Gold Victory Laurel", "Platinum Victory Laurel");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
