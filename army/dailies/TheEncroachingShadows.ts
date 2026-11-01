/*
name: TheEncroachingShadows
description: `The Encroaching Shadows` quest with an army.
tags: The Encroaching Shadows, TheEncroachingShadows, Encroaching, Shadows, army, void aura
*/
// Port of Scripts/Army/Dailies/TheEncroachingShadows.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreArmyLite } from "../CoreArmyLite";
import { Core } from "../../core/CoreBots";
import { CoreEngine } from "../../ultrasv3/entwined eclipse/CoreEngine";
import { CoreUltra } from "../../ultrasv3/entwined eclipse/CoreUltra";

const coreEngine = new CoreEngine();
const Ultra = new CoreUltra();
const sArmy = new CoreArmyLite();

export class TheEncroachingShadows {
    taunter: string = "";

    isTaunter(): boolean {
        return coreEngine.hasClassEquipped(this.taunter);
    }

    doEnchroach(): void {
        Core.ensureAcceptmultiple(8653, 9091);
        Core.logger(
            "Also accepting [9091] to get flib's ess whilst we do this incase ya wanna do the other army daily",
        );

        Ultra.useAlchemyPotions(Ultra.getBestTonicPotion(), Ultra.getBestElixirPotion());
        if (this.isTaunter()) {
            bot.events.on("extensionPacket", Ultra.genericChargeListener);
            Ultra.getScrollOfEnrage();
        }
        bot.drops.add(
            `Flibbitiestgibbet's ??? Essence`,
            "Glacial Pinion",
            "Hydra Eyeball",
            "Flibbitigiblets",
            "Void Essentia",
            "Void Energy",
            "Chest Plate",
        );
        Core.addDrop(70052, 70053, 70054, 73862);

        Ultra.useAlchemyPotions(Ultra.getBestTonicPotion(), Ultra.getBestElixirPotion());
        this.flib();
        Ultra.useAlchemyPotions(Ultra.getBestTonicPotion(), Ultra.getBestElixirPotion());
        this.iceWing();
        Ultra.useAlchemyPotions(Ultra.getBestTonicPotion(), Ultra.getBestElixirPotion());
        this.hydra90();

        Core.abandonQuest(9091);
        Core.ensureComplete(8653);
        Core.logger("All players finished farm.");
    }

    flib(): void {
        const map = "voidflibbi";
        const Boss = "Flibbitiestgibbet";
        const syncPath = Ultra.resolveSyncPath("ArmyBool.sync");
        Ultra.clearSyncFile(syncPath);
        bot.sleep(2500);
        Core.logger(`Players in Curreny Army: ${sArmy.players().length}`);
        coreEngine.join(map);
        if (sArmy.players().length > 1) {
            Ultra.waitForArmy(sArmy.players().length - 1, "VoidFlib.sync");
        }
        coreEngine.chooseBestCell(Boss);
        bot.player.setSpawnPoint();
        bot.sleep(1500);
        bot.options.aggroMonsters = true;
        while (!bot.shouldExit) {
            bot.drops.add("Glacial Pinion", "Hydra Eyeball", "Flibbitigiblets", "Void Energy");
            Core.addDrop(70052, 70053, 70054);

            if (Ultra.checkArmyProgressBool(() => Core.checkInventory(70054), syncPath)) {
                Core.jumpWait();
                Core.logger('All players finished farming "Flibbitigiblets".');
                break;
            }

            // Dead → wait for respawn
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            if (!bot.player.hasTarget) {
                bot.combat.attack(Boss);
            }
            bot.sleep(500);
        }
    }

    iceWing(): void {
        const map = "icewing";
        const Boss = "Warlord Icewing";
        const syncPath = Ultra.resolveSyncPath("ArmyBool.sync");
        Ultra.clearSyncFile(syncPath);
        bot.sleep(2500);
        Core.logger(`Players in Curreny Army: ${sArmy.players().length}`);
        coreEngine.join(map);
        coreEngine.chooseBestCell(Boss);
        if (sArmy.players().length > 1) {
            Ultra.waitForArmy(sArmy.players().length - 1, "WarlordIcewing.sync");
        }
        bot.player.setSpawnPoint();
        bot.sleep(1500);
        bot.options.aggroMonsters = true;
        while (!bot.shouldExit) {
            if (Ultra.checkArmyProgressBool(() => Core.checkInventory(70052), syncPath)) {
                Core.jumpWait();
                Core.logger('All players finished farming "Glacial Pinion".');
                break;
            }

            // Dead → wait for respawn
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            if (!bot.player.hasTarget) {
                bot.combat.attack(Boss);
            }
            bot.sleep(500);
        }
    }

    hydra90(): void {
        const map = "hydrachallenge";
        const boss = `Hydra Head 90`;
        const syncPath = Ultra.resolveSyncPath("UltraItemCheck.sync");
        Ultra.clearSyncFile(syncPath);
        bot.sleep(2500);

        coreEngine.join(map);
        if (sArmy.players().length > 1) {
            Ultra.waitForArmy(sArmy.players().length - 1, "HydraHead90.sync");
        }
        coreEngine.chooseBestCell(boss);
        bot.player.setSpawnPoint();
        coreEngine.enableSkills();

        while (!bot.shouldExit) {
            if (Ultra.checkArmyProgressBool(() => Core.checkInventory(70053, 3), syncPath)) {
                Core.jumpWait();
                Core.logger('All players finished farming "Hydra Eyeball".');
                break;
            }
            // Dead → wait for respawn
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            if (!bot.player.hasTarget) {
                bot.combat.attack(boss);
            }
            bot.sleep(500);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "voidbuquerque",
    [
        option.text("taunter", "Taunter Class", "Insert the name of the class that will taunt", "ArchPaladin"),
        sArmy.player1,
        sArmy.player2,
        sArmy.player3,
        sArmy.player4,
        sArmy.player5,
        sArmy.player6,
        sArmy.packetDelay,
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new TheEncroachingShadows();
    Core.bankingBlackList.push(`Flibbitiestgibbet's ??? Essence`, `Nightbane's ??? Essence`, `Xyfrag's ??? Essence`);

    if (
        bot.config != null &&
        bot.config.has(Core.skipOptions.name) &&
        !bot.config.get<boolean>(Core.skipOptions.name)
    ) {
        bot.config.configure();
    }

    if (sArmy.players().length < 4) {
        Core.logger(
            "Players empty or less then 4 (6 reccomended), please add players to the options ( scripts botton > edit scripts option > insert account names exactly as is)",
        );
        return;
    }

    script.taunter = (bot.config!.get<string>("taunter") ?? "").trim();
    coreEngine.boot();

    script.doEnchroach();

    Core.setOptions(false);
}
