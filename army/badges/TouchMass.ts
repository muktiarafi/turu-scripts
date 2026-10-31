/*
name: TouchMass
description: gets u the million kills for the `Touch Mass` badge
tags: touch, mass, badge, starfield, badge
*/
// Port of Scripts/Army/Badges/TouchMass.cs.
// The Ultras' CoreEngine (C#'s `Core`) and CoreUltra are army/CoreArmySync's CoreArmyEngine and CoreArmySync.

import { bot, defineScriptOptions } from "turu";
import { CoreArmyLite } from "../CoreArmyLite";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreArmyEngine, CoreArmySync } from "../CoreArmySync";

const Army = new CoreArmyLite();
const Engine = new CoreArmyEngine();
const Ultra = new CoreArmySync();

export class TouchMass {
    stupidQuest(): void {
        if (Core.hasWebBadge(this.badge)) {
            Core.logger(`Already have the ${this.badge} badge`);
            return;
        }

        if (Army.players().length <= 0) {
            Core.logger(
                "Players empty, please add players to the options ( scripts botton > edit scripts option > insert account names exactly as is)",
            );
            return;
        }
        Core.equipClass(ClassType.Farm);
        const map = "starfield";
        const syncPath = Ultra.resolveSyncPath("UltraItemCheck.sync");
        bot.sleep(2500);
        Core.logger(`Players in Army: ${Army.players().length}`);

        Core.privateRooms = true;
        Core.privateRoomNumber = Army.getRoomNr();
        Core.logger("Setting Additional options to try and mitigate some lag.");

        Core.addDrop(86808);
        // Stars Destroyed
        Core.ensureAccept(9818);

        Engine.join(map);
        Core.jump("r3", "Left");

        if (Army.players().length > 1) {
            Ultra.waitForArmy(Army.players().length - 1, "StupidQuest.sync");
        }

        bot.player.setSpawnPoint();
        bot.sleep(1500);
        bot.options.aggroMonsters = true;

        while (!bot.shouldExit) {
            if (Ultra.checkArmyProgressBool(() => Core.hasWebBadge(this.badge), syncPath)) {
                bot.options.aggroMonsters = false;
                Core.jump("Enter", "Spawn");
                Core.logger("All players finished farm.");
                break;
            }

            // Dead → wait for respawn
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            bot.combat.attack("*");
            bot.sleep(500);
        }
    }

    private readonly badge = "Touch Mass";

    setAdditonOptions(): void {
        // Ensure options are enabled.. map laggy af?
        Core.logger("Enabling LagKiller");
        bot.options.lagKiller = true;
        Core.sleep();

        Core.logger("Setting FPS to 10");
        bot.options.setFps = 10;
        Core.sleep();

        Core.logger("Setting Custom Name to 'AE made this quest for botters'");
        bot.options.customName = "AE made this quest for botters";
        bot.options.customGuild = `🖕`;
        Core.sleep();

        Core.logger("Accepting AC Drops");
        bot.options.acceptACDrops = true;
        Core.sleep();

        Core.logger("Freezing monster positions");
        bot.lite.freezeMonsterPosition = true;
        Core.sleep();

        Core.logger("Enabling Custom Drops UI");
        bot.lite.customDropsUI = true;
        Core.sleep();

        Core.logger("Disabling Red Warning");
        bot.lite.disableRedWarning = true;
        Core.sleep();

        Core.logger("Disabling Self Animation");
        bot.lite.disableSelfAnimation = true;
        Core.sleep();

        Core.logger("Disabling Skill Animation");
        bot.lite.disableSkillAnimation = true;
        Core.sleep();

        Core.logger("Disabling Weapon Animation");
        bot.lite.disableWeaponAnimation = true;
        Core.sleep();

        Core.logger("Disabling Monster Animation");
        bot.lite.disableMonsterAnimation = true;
        Core.sleep();

        Core.logger("Disabling Damage Strobe");
        bot.lite.disableDamageStrobe = true;
        Core.sleep();
    }
}

export const scriptOptions = defineScriptOptions(
    "Starfield Badge",
    [Army.player1, Army.player2, Army.player3, Army.player4, Army.player5, Army.packetDelay, Core.skipOptions],
    true,
);

export default function main(): void {
    const script = new TouchMass();
    Core.setOptions(undefined, { disableClassSwap: true });
    script.setAdditonOptions();
    script.stupidQuest();
    Core.setOptions(false);
}
