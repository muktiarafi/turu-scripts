/*
name: CLW Test Army 7
description: Tests CoreLoneWolf Army synchronization with seven players.
tags: prototype, corelonewolf, army, sync, seven-player, test
*/
// Port of Extras/CLWTestArmy7.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreLoneWolf } from "../CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export class CLWTestArmy7 {
    private static readonly skills: number[] = [1, 2, 3, 4];

    private static readonly logPrefix = "CLW Test Army 7";
    private static readonly syncFileName = "CLWTestArmy7.sync";
    private static readonly mapName = "classhall";
    private static readonly fightCell = "r4";
    private static readonly fightPad = "Left";
    private static readonly monsterMapId = 1;
    private static readonly combatDuration = 10000;

    private playerAlias: string = "";
    private privateRoomNumber: number = 0;

    runPrototype(): void {
        this.privateRoomNumber = bot.config!.get<number>("PrivateRoomNumber");
        if (!LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber)) {
            return;
        }

        if (!LoneWolf.startArmySync(CLWTestArmy7.syncFileName, 7)) {
            return;
        }

        if (!LoneWolf.validateHouseRequirements()) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        Core.logger(`${CLWTestArmy7.logPrefix} started as ${this.playerAlias}.`);

        if (!this.joinClassHall() || !this.runCombat() || !this.returnHome()) {
            return;
        }

        this.runStopTest();
    }

    private joinClassHall(): boolean {
        Core.join(`${CLWTestArmy7.mapName}-${this.privateRoomNumber}`);
        Core.jump(CLWTestArmy7.fightCell, CLWTestArmy7.fightPad);

        if (bot.shouldExit) {
            return false;
        }

        return this.sync("CLASSHALL_READY");
    }

    private runCombat(): boolean {
        LoneWolf.startSkillEngine(CLWTestArmy7.skills, this.playerAlias, false, CLWTestArmy7.logPrefix);
        Core.logger(`${CLWTestArmy7.logPrefix} ${this.playerAlias} started the custom skill engine.`);

        try {
            bot.combat.attack(CLWTestArmy7.monsterMapId);
            Core.logger(`${CLWTestArmy7.logPrefix} ${this.playerAlias} started the 10 second combat test.`);
            bot.sleep(CLWTestArmy7.combatDuration);
        } finally {
            LoneWolf.stopSkillEngine();
            bot.combat.cancelTarget();
        }

        if (bot.shouldExit) {
            return false;
        }

        Core.logger(`${CLWTestArmy7.logPrefix} ${this.playerAlias} completed the combat test.`);
        return this.sync("COMBAT_COMPLETE");
    }

    private returnHome(): boolean {
        bot.send.packet(`%xt%zm%house%1%${bot.player.username}%`);
        bot.wait.forMapLoad("house");

        if (bot.shouldExit) {
            return false;
        }

        Core.logger(`${CLWTestArmy7.logPrefix} ${this.playerAlias} reached its own house.`);
        return this.sync("HOME_READY");
    }

    private runStopTest(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);

            if (bot.shouldExit) {
                return;
            }

            if (LoneWolf.stopArmySync("TEST_COMPLETE")) {
                Core.logger(`${CLWTestArmy7.logPrefix} playerOne published TEST_COMPLETE.`);
            } else {
                Core.logger(`${CLWTestArmy7.logPrefix} playerOne could not publish TEST_COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${CLWTestArmy7.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${CLWTestArmy7.logPrefix} ${this.playerAlias} detected TEST_COMPLETE.`);
        }
    }

    private sync(step: string): boolean {
        Core.logger(`${CLWTestArmy7.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${CLWTestArmy7.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private getPlayerAlias(): string {
        if (LoneWolf.isArmyPlayer(1)) {
            return "playerOne";
        }

        if (LoneWolf.isArmyPlayer(2)) {
            return "playerTwo";
        }

        if (LoneWolf.isArmyPlayer(3)) {
            return "playerThree";
        }

        if (LoneWolf.isArmyPlayer(4)) {
            return "playerFour";
        }

        if (LoneWolf.isArmyPlayer(5)) {
            return "playerFive";
        }

        if (LoneWolf.isArmyPlayer(6)) {
            return "playerSix";
        }

        return "playerSeven";
    }
}

export const scriptOptions = defineScriptOptions(
    "CLWTestArmy7",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        LoneWolf.player5,
        LoneWolf.player6,
        LoneWolf.player7,
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
    ],
    true,
);

export default function main(): void {
    const script = new CLWTestArmy7();
    bot.skills.stop();
    bot.options.infiniteRange = true;
    bot.config?.configure();

    try {
        script.runPrototype();
    } finally {
        LoneWolf.stopSkillEngine();
    }
}
