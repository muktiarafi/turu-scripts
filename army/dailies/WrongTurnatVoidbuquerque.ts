/*
name: WrongTurnatVoidbuquerque
description: `wrong turn at voidbuquerque` quest with an army.
tags: nation, wrong turn at voidbuquerque, WrongTurnatVoidbuquerque
*/
// Port of Scripts/Army/Dailies/WrongTurnatVoidbuquerque.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { CoreArmyLite } from "../CoreArmyLite";
import { Core } from "../../core/CoreBots";
import { CoreEngine } from "../../ultrasv3/entwined eclipse/CoreEngine";
import { CoreUltra } from "../../ultrasv3/entwined eclipse/CoreUltra";

const coreEngine = new CoreEngine();
const Ultra = new CoreUltra();
const sArmy = new CoreArmyLite();

export enum Rewards {
    Tainted_Gem = 4769,
    Dark_Crystal_Shard = 4770,
    Diamond_of_Nulgath = 4771,
    Totem_of_Nulgath = 5357,
    Gem_of_Nulgath = 6136,
    Blood_Gem_of_the_Archfiend = 22332,
}

export class WrongTurnatVoidbuquerque {
    reward: Rewards = null!;
    taunter: string = "";

    isTaunter(): boolean {
        return coreEngine.hasClassEquipped(this.taunter);
    }

    doVoidbuquerque(): void {
        Core.addDrop(
            `Xyfrag's ??? Essence`,
            `Flibbitiestgibbet's ??? Essence`,
            `Nightbane's ??? Essence`,
            `Xyfrag's Slimy Tooth`,
            "Void Energy",
        );
        Core.addDrop(73861, 73862, 73863, this.reward);
        Core.logger(`Reward Selected; ${Rewards[this.reward]}`);
        Core.ensureAccept(9091);

        Ultra.useAlchemyPotions(Ultra.getBestTonicPotion(), Ultra.getBestElixirPotion());
        if (this.isTaunter()) {
            bot.events.on("extensionPacket", Ultra.genericChargeListener);
            Ultra.getScrollOfEnrage();
        }
        this.xyfrag();

        Ultra.useAlchemyPotions(Ultra.getBestTonicPotion(), Ultra.getBestElixirPotion());
        this.flib();

        Ultra.useAlchemyPotions(Ultra.getBestTonicPotion(), Ultra.getBestElixirPotion());
        this.nightBane();

        Core.ensureComplete(9091, this.reward);
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
            if (Ultra.checkArmyProgressBool(() => Core.checkInventory(73861), syncPath)) {
                /* Flibbitiestgibbet's ??? Essence */
                Core.jumpWait();
                Core.logger('All players finished farming "Flibbitiestgibbet\'s ??? Essence".');
                break;
            }

            // Dead → wait for respawn
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            bot.combat.attack(Boss);
            bot.sleep(500);
        }
    }

    nightBane(): void {
        const map = "voidnightbane";
        const Boss = "Nightbane";
        const syncPath = Ultra.resolveSyncPath("ArmyBool.sync");
        Ultra.clearSyncFile(syncPath);
        bot.sleep(2500);
        Core.logger(`Players in Curreny Army: ${sArmy.players().length}`);
        coreEngine.join(map);
        coreEngine.chooseBestCell(Boss);
        if (sArmy.players().length > 1) {
            Ultra.waitForArmy(sArmy.players().length - 1, "Nightbane.sync");
        }
        bot.player.setSpawnPoint();
        bot.sleep(1500);
        bot.options.aggroMonsters = true;
        while (!bot.shouldExit) {
            if (Ultra.checkArmyProgressBool(() => Core.checkInventory(73862), syncPath)) {
                /* Nightbane's ??? Essence */
                Core.jumpWait();
                Core.logger('All players finished farming "Nightbane\'s ??? Essence".');
                break;
            }

            // Dead → wait for respawn
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            bot.combat.attack(Boss);
            bot.sleep(500);
        }
    }

    xyfrag(): void {
        const map = "voidxyfrag";
        const boss = "Xyfrag";

        const syncPath = Ultra.resolveSyncPath("UltraItemCheck.sync");
        Ultra.clearSyncFile(syncPath);
        bot.sleep(2500);

        // 'Wrong Turn at Voidbuquerque' && 'Doom Spikes'
        Core.ensureAcceptmultiple(9091, 9418);

        coreEngine.join(map);
        if (sArmy.players().length > 1) {
            Ultra.waitForArmy(sArmy.players().length - 1, "Xyfrag.sync");
        }
        coreEngine.chooseBestCell(boss);
        bot.player.setSpawnPoint();
        coreEngine.enableSkills();
        while (!bot.shouldExit) {
            if (Ultra.checkArmyProgressBool(() => Core.checkInventory(73863), syncPath)) {
                /* Xyfrag's ??? Essence */
                bot.events.off("extensionPacket", Ultra.genericChargeListener);
                Core.jumpWait();
                Core.logger('All players finished farming "Xyfrag\'s ??? Essence".');
                break;
            }
            // Dead → wait for respawn
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            if (coreEngine.hasClassEquipped(this.taunter)) {
                coreEngine.disableSkills();
                if (bot.player.hasTarget && bot.skills.canUseSkill(5)) {
                    while (!bot.shouldExit) {
                        if (bot.skills.canUseSkill(5)) {
                            bot.skills.useSkill(5);
                        }
                        bot.sleep(500);

                        if (bot.player.hasTarget && bot.target.auras.some((x) => x != null && x.name === "Focus")) {
                            coreEngine.enableSkills();
                            break;
                        }
                    }

                    bot.sleep(300);
                }
            }

            bot.combat.attack(boss);
            bot.sleep(500);
        }
        bot.events.off("extensionPacket", Ultra.genericChargeListener);
    }
}

export const scriptOptions = defineScriptOptions(
    "voidbuquerque",
    [
        option.text("taunter", "Taunter Class", "Insert the name of the class that will taunt", "ArchPaladin"),
        option.choice(
            "reward",
            "Reward Item",
            "Select the reward item to grant",
            choices(Rewards),
            Rewards[Rewards.Tainted_Gem],
        ),
        sArmy.player1,
        sArmy.player2,
        sArmy.player3,
        sArmy.player4,
        sArmy.player5,
        sArmy.player6,
        sArmy.player7,
        sArmy.packetDelay,
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new WrongTurnatVoidbuquerque();
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
            "Players empty or less then 4 (7 reccomended), please add players to the options ( scripts botton > edit scripts option > insert account names exactly as is)",
        );
        return;
    }

    script.taunter = (bot.config!.get<string>("taunter") ?? "").trim();
    const rewardStr = bot.config!.get<string>("reward") ?? "Tainted_Gem";
    script.reward = Rewards[rewardStr.replaceAll(" ", "_") as keyof typeof Rewards] as Rewards;
    coreEngine.boot();

    script.doVoidbuquerque();

    Core.setOptions(false);
}
