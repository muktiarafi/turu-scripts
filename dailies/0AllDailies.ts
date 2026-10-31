/*
name: All Dailies
description: Does all the avaiable dailies.
tags: all dailies, dailies, daily, all
*/
// Port of Scripts/Dailies/0AllDailies.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";
import { LordOfOrder } from "./LordOfOrder";
import { MineCrafting } from "./MineCrafting";
import { CoreSDKA } from "../evil/sdka/CoreSDKA";
import { Friendship } from "../story/Friendship";
import { GlaceraStory } from "../story/Glacera";

const Daily = new CoreDailies();
const LOO = new LordOfOrder();
const Glac = new GlaceraStory();
const FR = new Friendship();
const CSDKA = new CoreSDKA();
const mineCrafting = new MineCrafting();

export enum DailySet {
    Recommended = "Recommended",
    All = "All",
    All_Without_Friendship = "All_Without_Friendship",
}

export class FarmAllDailies {
    //private BankAllItems BAI = new();

    doAllDailies(Set: DailySet = DailySet.All): void {
        if (Set === DailySet.Recommended) {
            Core.logger(`Doing selected set of dailies: Recommended`);

            // LoO
            if (!Core.checkInventory([50741, 50576], undefined, { any: true, toInv: false })) {
                LOO.getLoO();
            } else {
                Core.toBank(50741, 50576);
            }

            // Pyromancer
            if (!Core.checkInventory([12811, 12812], undefined, { any: true, toInv: false })) {
                Daily.pyromancer();
            } else {
                Core.toBank(12811, 12812);
            }

            Daily.shadowScytheClass();
            Daily.wheelofDoom();
            Daily.freeDailyBoost();
            Daily.collectorClass();
            Glac.frozenTower();

            // Cryomancer
            if (!Core.checkInventory("Cryomancer", undefined, { toInv: false })) {
                Daily.cryomancer();
            } else {
                Core.toBank("Cryomancer");
            }

            Daily.eldersBlood();
            Daily.sparrowsBlood();
            Daily.shadowShroud();
            Daily.dagesScrollFragment();
            mineCrafting.doMinecrafting();
            Daily.cryptoToken();

            Core.logger("Recommended Dailies finished!");
        } else {
            Core.logger(`Doing selected set of dailies: All`);

            // LoO
            if (!Core.checkInventory([50741, 50576], undefined, { any: true, toInv: false })) {
                LOO.getLoO();
            } else {
                Core.toBank(50741, 50576);
            }

            // Pyromancer
            if (!Core.checkInventory([12811, 12812], undefined, { any: true, toInv: false })) {
                Daily.pyromancer();
            } else {
                Core.toBank(12811, 12812);
            }

            Daily.shadowScytheClass();
            Daily.wheelofDoom();
            Daily.freeDailyBoost();
            Daily.collectorClass();
            Glac.frozenTower();

            // Cryomancer
            if (!Core.checkInventory("Cryomancer", undefined, { toInv: false })) {
                Daily.cryomancer();
            } else {
                Core.toBank("Cryomancer");
            }

            Daily.eldersBlood();
            Daily.pearlOfNulgath();
            Daily.cryptoToken();
            Daily.shadowShroud();
            mineCrafting.doMinecrafting();
            Daily.sparrowsBlood();
            Daily.beastMasterChallenge();
            Daily.fungiforaFunGuy();
            CSDKA.unlockHardCoreMetals();

            Daily.hardCoreMetals(
                ["Arsenic", "Beryllium", "Chromium", "Palladium", "Rhodium", "Thorium", "Mercury"],
                10,
                { toBank: true },
            );

            Daily.goldenInquisitor();
            Daily.breakIntotheHoard({ keepReward: false, bank: false });
            Daily.eldenRuby();
            Daily.nCSGem();
            Daily.enchantedDarkBlood();
            Daily.madWeaponSmith();
            Daily.cyserosSuperHammer();
            Daily.brightKnightArmor();
            Daily.grumbleGrumble();
            Daily.tenacityChallenge();
            Daily.monthlyTreasureChestKeys();
            Daily.powerGem();
            Daily.designNotes();
            Daily.moglinPets();

            if (Set === DailySet.All) {
                FR.completeStory();
                Daily.friendships();
            }

            Daily.dagesScrollFragment();

            Core.logger('"All" Dailies finished!');
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "FarmAllDailies",
    [
        option.choice(
            "Select Dailies Set",
            "Dailies set: Recommended or All?",
            "only do the few that we recommend to make it a bit quicker?",
            choices(DailySet),
            DailySet.All,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new FarmAllDailies();
    Core.bankingBlackList.push("Lord of Order");
    Core.setOptions();

    script.doAllDailies(bot.config!.get<DailySet>("Select Dailies Set"));

    Core.setOptions(false);
}
