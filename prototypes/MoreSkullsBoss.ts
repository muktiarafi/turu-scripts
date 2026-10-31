/*
name: MoreSkullsWorldBoss
description: null
tags: null
*/
// Port of Scripts/Prototypes/MoreSkullsBoss.cs.

import { bot, type EventMap } from "turu";
import { CoreAdvanced } from "../core/CoreAdvanced";
import { ClassType, Core, randomInt } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Adv = new CoreAdvanced();
const Story = new CoreStory();

export class MoreSkullsWorldBoss {
    getMaxPristineSkull(): number {
        const quest = bot.quests.ensureLoad(10288);
        if (quest == null) {
            return 1;
            // Default max stack if quest is not found
        }
        const reward = quest.rewards.find((r) => r.name === "Pristine Skull") ?? null;
        return reward?.maxStack ?? 1;
    }

    // C# moves on a Task (cancelled when the farm ends); here a one-shot handler walks after the
    // delay, and a move counts as running until `zoneMovingUntil`.
    zoneMovingUntil = 0;
    moving = false;

    setup(quant: number | null = null): void {
        this.lichWar();

        if (!bot.player.isMember && !Core.isSeasonalMapActive("MoreSkulls")) {
            return;
        }

        const target = quant ?? this.getMaxPristineSkull();
        if (Core.checkInventory("Pristine Skull", target)) {
            return;
        }

        Core.equipClass(ClassType.Solo);
        this.moving = true;
        // Create token
        bot.events.on("extensionPacket", this.fuckyou);
        Core.addDrop("Pristine Skull");
        bot.options.attackWithoutTarget = true;
        Core.farmingLogger("Pristine Skull", target);
        while (!bot.shouldExit && !Core.checkInventory("Pristine Skull", target)) {
            Core.ensureAccept(!Core.isCompletedBefore(10288) ? 10287 : Core.isMember ? 10289 : 10288);
            while (!bot.shouldExit && !bot.player.alive) {}

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

            if (
                bot.quests.canCompleteFullCheck(!Core.isCompletedBefore(10288) ? 10287 : Core.isMember ? 10289 : 10288)
            ) {
                Core.ensureComplete(!Core.isCompletedBefore(10288) ? 10287 : Core.isMember ? 10289 : 10288);
            }

            bot.sleep(500);
        }

        // Cleanup
        this.moving = false;
        bot.handlers.remove("MoreSkullsMove");
        bot.events.off("extensionPacket", this.fuckyou);
        bot.options.attackWithoutTarget = false;
    }

    lastZoneChange: number = 0;
    readonly zoneChangeCooldown: number = 2 * 1000;
    currentZone = "";

    fuckyou = (packet: EventMap["extensionPacket"]): void => {
        if (!this.moving) {
            return;
        }
        // Token already cancelled, script likely ended

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
        const zone = args?.zoneSet?.toString()?.trim();
        if (!zone || zone === this.currentZone) {
            return;
        }

        if (Date.now() - this.lastZoneChange < this.zoneChangeCooldown) {
            return;
        }

        this.currentZone = zone;
        this.lastZoneChange = Date.now();

        // Skip if a move is still running
        if (Date.now() < this.zoneMovingUntil) {
            return;
        }

        // Randomize the delay to avoid being too predictable
        const delay = randomInt(500, 1500);
        this.zoneMovingUntil = Date.now() + delay + 500;
        bot.handlers.once("MoreSkullsMove", delay, () => {
            if (!this.moving) return;
            let x: number, y: number;

            // Determine the coordinates based on the zone
            // Zones are defined by their names, e.g., "A", "B", etc. ( gotten from the packet data via Packets > Intercepter)
            switch (zone) {
                case "A":
                    if (bot.player.x >= 741 && bot.player.x <= 832 && bot.player.y >= 402 && bot.player.y <= 446) {
                        return;
                    }
                    x = randomInt(741, 833);
                    y = randomInt(402, 447);
                    break;
                case "B":
                    if (bot.player.x >= 721 && bot.player.x <= 819 && bot.player.y >= 330 && bot.player.y <= 371) {
                        return;
                    }
                    x = randomInt(721, 820);
                    y = randomInt(330, 372);
                    break;
                default:
                    // Do nothing on unknown zone
                    return;
            }

            if (bot.player.x === x && bot.player.y === y) {
                return;
            }

            bot.player.walkTo(x, y);
        });
    };

    lichWar(): void {
        Story.preLoad(this.lichWar);

        if (Core.isCompletedBefore(10287)) {
            return;
        }

        Adv.gearStore(undefined, { enhAfter: true });
        Core.equipClass(ClassType.Farm);

        // Grimskull War Medal
        // Mega Grimskull War Medal
        if (!Story.questProgression(10284)) {
            /* Undead Giants */
            Core.ensureAcceptmultiple(10282, 10283);

            Core.killMonster("lichwar", "r6", "Left", "*", "Grimskull War Medal", 5);
            Core.ensureComplete(10282);
        }

        // Undead Giants
        Core.ensureAccept(10284);
        Core.huntMonster("lichwar", "Noxus Giant", "Noxus Giant Slain", 5);
        Core.ensureComplete(10284);

        // It Takes Two to Tango
        Core.ensureAccept(10281);
        Core.equipClass(ClassType.Solo);
        Core.huntMonster("lichwar", "Rax-goreless", "Rax-goreless Defeated");
        Core.huntMonster("lichwar", "Armadeddon", "Armadeddon Defeated");
        Core.ensureComplete(10281);
        Adv.gearStore(true, { enhAfter: true });
    }
}

export default function main(): void {
    const script = new MoreSkullsWorldBoss();
    Core.bankingBlackList.push("Pristine Skull");
    Core.setOptions(undefined, { disableClassSwap: true });

    Core.oneTimeMessage(
        "WARNING",
        "During the script, when it Does the zone bit, there will be a momentary Freeze (blame flash), dw about it itll continue",
        true,
        true,
    );
    script.setup(script.getMaxPristineSkull());

    Core.setOptions(false);
}
