/*
name: Gachapon Machine
description: does either "I heard you like Gacha" or "Kotapon II: Get'cha Gear" for a bunch of items
tags: i heard you like gacha, kotapon ii: get'cha gear, gacha, gachaponmachine
*/
// Port of Scripts/Other/GachaponMachineQuests.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../core/CoreBots";
import { Eden } from "../story/Eden";

const eden = new Eden();

export class GachaponMachine {
    readonly rewards: string[] = [
        "Onsen Locks",
        "Onsen Long Locks",
        "Onsen Ponytail",
        "Onsen Bob",
        "Crystallis Bob",
        "Onsen Shag",
        "Onsen Hair",
        "Onsen MopTop",
        "Onsen Spikes",
        "Onsen Spikes + Ponytail",
        "Crystallis Candied Strawberries",
        "Crystallis Cheesedog",
        "Crystallis Dango",
        "Onsen Treats",
        "Gigantic Crystallis Cheesedog",
        "Gigantic Crystallis Dango",
        "Crystallis Onsen Milk",
        "Onsen Smile",
        "Onsen ManBun",
        "Crystallis Proto Morph + Locks",
        "Crystallis Proto Morph + Hair",
    ];

    readonly rewards2: string[] = [
        "Smug Face 001",
        "Totally Normal Face 001",
        "Smug Face 002",
        "Totally Normal Face 002",
        "Totally Not a Killer Face 002",
        "Math Notebook",
        "KotaBear 023M",
        "KotaBear 023XL",
        "KotaPon Prize A",
        "Klawaii Prisoner",
        "Klawaii Prisoner Hair",
        "Klawaii Prisoner Locks",
        "KotaPon Prize A Morph Hair",
        "KotaPon Prize A Morph Locks",
        "KotaPon Prize D",
        "Klawaii Enlightenment",
        "KotaPon Prize B",
        "KotaPon Prize C",
        "Eden Formal Outfit",
        "Eden Formal Hair",
        "Eden Formal Locks",
        "Eden High Formal Hair",
        "Eden High Formal Locks",
        "Eden High Formal Cape",
        "Eden Judgement Blade",
        "Eden Judgement Blades",
        "Eden Formal Cane",
        "A Story of Eden: Light Novel",
        "A Story of Eden: Special Edition",
    ];

    gacha(): void {
        eden.storyLine();
        Core.addDrop(...this.rewards);
        Core.addDrop(...this.rewards2);

        //1st Quest
        let i = 1;
        Core.logger("Farming [I heard you like Gacha] Quest");
        while (!bot.shouldExit && !Core.checkInventory(this.rewards, undefined, { toInv: false })) {
            Core.ensureAccept(7781);
            Core.buyItem("onsen", 1926, "Gachapon Coin");
            Core.huntMonster("yokaigrave", "Skello Kitty", "Skello Kitty Bone");
            Core.ensureCompleteChoose(7781);
            Core.toBank(...this.rewards);
            Core.logger(`Completed x${i++}`);
        }
        Core.logger("All drops acquired from [I heard you like Gacha] Quest");

        //2nd Quest
        i = 1;
        Core.logger("Farming [Kotapon II: Get'cha Gear] Quest");
        while (!bot.shouldExit && !Core.checkInventory(this.rewards2, undefined, { toInv: false })) {
            Core.ensureAccept(8802);
            Core.huntMonster("eden", "Cosplayer Anomaly", "Eden Resident Token", 10);
            Core.huntMonster("eden", "Klawaii Machine", "Klawaii Coin");
            Core.ensureCompleteChoose(8802);
            Core.toBank(...this.rewards2);
            Core.logger(`Completed x${i++}`);
        }
        Core.logger("All drops acquired from [Kotapon II: Get'cha Gear] Quest");
    }
}

export default function main(): void {
    const script = new GachaponMachine();
    Core.bankingBlackList.push(...script.rewards);
    Core.bankingBlackList.push(...script.rewards2);
    Core.setOptions();

    script.gacha();

    Core.setOptions(false);
}
