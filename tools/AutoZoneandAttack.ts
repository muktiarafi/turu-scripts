/*
name: Auto Zone and ttack
description:  This tool will automatically move to the specified zones and attack monsters.
tags:  autozone, nightmare carnax, ultradage, moreskulls
*/
// Port of Scripts/Tools/AutoZoneandAttack.cs.
// Turu: C# moves on a Task.Run (wait 300 ms, walk, stay busy 2.5 s); here a `bot.handlers.once`
// timer walks and `moveTaskUntil` stands for the running task. Its CancellationTokenSources are
// the `*Active` switches.

import { bot, choices, ClassUseMode, defineScriptOptions, type EventMap, option, SkillUseMode } from "turu";
import { CoreAdvanced, EnhancementType, WeaponSpecial } from "../core/CoreAdvanced";
import { ClassType, Core, randomInt } from "../core/CoreBots";

const Adv = new CoreAdvanced();

export enum PickYourBoss {
    None = "None",
    NightmareCarnax = "NightmareCarnax",
    UltraDage = "UltraDage",
    MoreSkulls = "MoreSkulls",
}

export class AAWithMove {
    // Entry point for auto-move depending on current map
    autoMove(): void {
        const boss = bot.config!.get<PickYourBoss>("PickYourBoss");
        const AttemptSoloNMCarnax = bot.config!.get<boolean>("AttemptSoloNMCarnax");
        switch (boss) {
            case PickYourBoss.NightmareCarnax:
                this.farmDarkCarnax(AttemptSoloNMCarnax);
                break;
            case PickYourBoss.UltraDage:
                this.farmUltraDage();
                break;
            case PickYourBoss.MoreSkulls:
                this.setupMoreSkulls();
                break;
            default:
                break;
        }
    }

    //#region DarkCarnax Farming
    private darkCarnaxActive = false;

    private farmDarkCarnax(attemptSolo: boolean): void {
        this.darkCarnaxActive = true;
        Core.addDrop("Synthetic Viscera");
        Core.jump("Boss", "Left");
        bot.player.setSpawnPoint();
        Core.registerQuests(8872);
        bot.options.attackWithoutTarget = true;

        bot.events.on("runToArea", this.moveNightmareCarnax);

        if (attemptSolo) {
            if (Core.checkInventory("Dragon of Time")) {
                Core.equip("Dragon of Time");
                bot.skills.startSkills("3|2|4|2|1|2", 250, SkillUseMode.WaitForCooldown);
            } else if (Core.checkInventory("Healer (Rare)")) {
                bot.skills.startAdvanced("Healer (Rare)", true, ClassUseMode.Base);
            } else if (Core.checkInventory("Healer")) {
                bot.skills.startAdvanced("Healer", true, ClassUseMode.Base);
            } else {
                Core.equipClass(ClassType.Solo);
            }

            Adv.gearStore(undefined, { enhAfter: true });
            Adv.enhanceEquipped(EnhancementType.Healer, { wSpecial: WeaponSpecial.Elysium });
        }

        while (!bot.shouldExit) {
            while (!bot.shouldExit && !bot.player.alive) {
                bot.sleep(1000);
            }

            if (bot.map.name !== "DarkCarnax") {
                Core.join("DarkCarnax", "Boss", "Right");
            }
            if (bot.player.cell !== "Boss") {
                Core.jump("Boss", "Right");
            }

            if (!bot.player.hasTarget) {
                bot.combat.attack("*");
            } else {
                bot.wait.forMonsterDeath();
                bot.combat.cancelTarget();
            }
        }

        this.darkCarnaxActive = false;
        bot.handlers.remove("AutoZoneMove");
        bot.events.off("runToArea", this.moveNightmareCarnax);
        Core.cancelRegisteredQuests();
        bot.options.attackWithoutTarget = false;
        Adv.gearStore(true, { enhAfter: true });
    }

    /** Until when the last move runs (C#'s `moveTask` is not completed). */
    private moveTaskUntil = 0;
    private currentZone = "";
    private lastMove: number = 0;
    private readonly moveCooldown: number = 2 * 1000;

    private moveNightmareCarnax = ({ zone }: EventMap["runToArea"]): void => {
        if (!this.darkCarnaxActive) {
            return;
        }

        const zoneLower = zone.toLowerCase();

        if (zoneLower === this.currentZone) {
            return;
        }

        if (Date.now() - this.lastMove < this.moveCooldown) {
            return;
        }

        if (Date.now() < this.moveTaskUntil) {
            return;
        }

        this.currentZone = zoneLower;
        this.lastMove = Date.now();

        this.moveTaskUntil = Date.now() + 300 + 2500;
        bot.handlers.once("AutoZoneMove", 300, () => {
            const y = randomInt(380, 475);
            const x =
                zoneLower === "a" ? randomInt(600, 931) : zoneLower === "b" ? randomInt(25, 326) : randomInt(325, 601);

            if (this.darkCarnaxActive) {
                bot.player.walkTo(x, y);
            }
        });
    };

    //#endregion
    //#region UltraDage Farming
    private ultraDageActive = false;

    private farmUltraDage(): void {
        this.ultraDageActive = true;
        Core.addDrop("Dage the Evil Insignia");
        Core.jump("Boss", "Right");
        bot.player.setSpawnPoint();
        bot.events.on("runToArea", this.moveUltraDage);
        bot.options.attackWithoutTarget = true;

        while (!bot.shouldExit) {
            while (!bot.shouldExit && !bot.player.alive) {
                bot.sleep(1000);
            }

            if (bot.map.name !== "UltraDage") {
                Core.join("UltraDage", "Boss", "Right");
            }
            if (bot.player.cell !== "Boss") {
                Core.jump("Boss", "Right");
            }

            if (!bot.player.hasTarget) {
                bot.combat.attack("*");
            } else {
                bot.wait.forMonsterDeath();
                bot.combat.cancelTarget();
            }
        }

        this.ultraDageActive = false;
        bot.handlers.remove("AutoZoneMove");
        bot.events.off("runToArea", this.moveUltraDage);
        bot.options.attackWithoutTarget = false;
    }

    private moveUltraDage = ({ zone }: EventMap["runToArea"]): void => {
        if (!this.ultraDageActive) {
            return;
        }

        const zoneLower = zone.toLowerCase();

        if (zoneLower === this.currentZone) {
            return;
        }

        if (Date.now() - this.lastMove < this.moveCooldown) {
            return;
        }

        if (Date.now() < this.moveTaskUntil) {
            return;
        }

        this.currentZone = zoneLower;
        this.lastMove = Date.now();

        this.moveTaskUntil = Date.now() + 300 + 2500;
        bot.handlers.once("AutoZoneMove", 300, () => {
            const y =
                zoneLower === "a" ? randomInt(400, 410) : zoneLower === "b" ? randomInt(410, 415) : randomInt(300, 420);

            const x =
                zoneLower === "a" ? randomInt(40, 175) : zoneLower === "b" ? randomInt(760, 930) : randomInt(480, 500);

            if (this.ultraDageActive) {
                bot.player.walkTo(x, y);
            }
        });
    };

    //#endregion
    //#region MoreSkulls Farming (Setup + Movement)
    private moreSkullsActive = false;

    setupMoreSkulls(): void {
        this.moreSkullsActive = true;
        bot.events.on("extensionPacket", this.fuckyou);
        Core.addDrop("Pristine Skull");
        if (Core.isCompletedBefore(10288)) {
            Core.registerQuests(10288);
        }

        bot.options.attackWithoutTarget = true;

        while (!bot.shouldExit) {
            while (!bot.shouldExit && !bot.player.alive) {
                bot.sleep(1000);
            }

            if (bot.map.name !== "MoreSkulls") {
                Core.join("MoreSkulls", "r2", "Left");
            }

            if (bot.player.cell !== "r2") {
                Core.jump("r2");
            }

            if (!bot.player.hasTarget) {
                bot.combat.attack("*");
            } else {
                bot.wait.forMonsterDeath();
                bot.combat.cancelTarget();
            }

            bot.sleep(500);
        }

        this.moreSkullsActive = false;
        bot.handlers.remove("AutoZoneMove");
        bot.events.off("extensionPacket", this.fuckyou);
        bot.options.attackWithoutTarget = false;
    }

    private fuckyou = (packet: EventMap["extensionPacket"]): void => {
        if (!this.moreSkullsActive) {
            return;
        }

        const type = packet["params"]?.type;
        if (type !== "json") {
            return;
        }

        const data = packet["params"]?.dataObj;
        const cmd = data?.cmd?.toString();
        if (cmd !== "event") {
            return;
        }

        const args = data?.args;
        if (args == null) {
            return;
        }

        const zone = args.zoneSet?.toString()?.trim();
        if (!zone) {
            return;
        }

        if (zone === this.currentZone) {
            return;
        }

        if (Date.now() - this.lastMove < this.moveCooldown) {
            return;
        }

        if (Date.now() < this.moveTaskUntil) {
            return;
        }

        this.currentZone = zone;
        this.lastMove = Date.now();

        this.moveTaskUntil = Date.now() + 300;
        bot.handlers.once("AutoZoneMove", 300, () => {
            let x = 0,
                y = 0;
            switch (zone.toUpperCase()) {
                case "A":
                    if (bot.player.x >= 685 && bot.player.x <= 869 && bot.player.y >= 400 && bot.player.y <= 409) {
                        return;
                    }
                    x = randomInt(685, 870);
                    y = randomInt(400, 410);
                    break;
                case "B":
                    if (bot.player.x >= 646 && bot.player.x <= 861 && bot.player.y >= 333 && bot.player.y <= 367) {
                        return;
                    }
                    x = randomInt(646, 862);
                    y = randomInt(333, 368);
                    break;
                default:
                    return;
            }

            if (this.moreSkullsActive) {
                bot.player.walkTo(x, y, 8);
            }
        });
    };

    //#endregion
}

export const scriptOptions = defineScriptOptions(
    "AutoZoneandAttack",
    [
        option.choice(
            "PickYourBoss",
            "Choose Your Boss",
            "Select the boss you want to farm",
            choices(PickYourBoss),
            PickYourBoss.None,
        ),
        option.bool(
            "AttemptSoloNMCarnax",
            "Attempt Solo Nightmare Carnax",
            "If you have the Dragon of Time, this will attempt to solo Nightmare Carnax.",
            false,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new AAWithMove();
    Core.setOptions(undefined, { disableClassSwap: true });

    script.autoMove();

    Core.setOptions(false);
}
