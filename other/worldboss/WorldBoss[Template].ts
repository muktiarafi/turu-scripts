/*
name: KillWorldBoss
description: Kills the world boss to max Flame of the Magnum Opus from Flame of the Beyond
tags: world, boss, worldboss, world boss, Flame of the Magnum Opus, Flame of the Beyond
*/
// Port of Scripts/Other/WorldBoss/WorldBoss[Template].cs.

import { bot, type EventMap } from "turu";
import { ClassType, Core, randomInt } from "../../core/CoreBots";

export class KillWorldBoss {
    readonly drops: Map<string, number> = new Map([
        ["Drop1", 1],
        ["Drop2", 1],
    ]);

    readonly map = "Map";
    readonly cell = "WB Cell";
    readonly pad = "WB Pad";

    worldBoss(): void {
        Core.registerQuests(10702);
        Core.addDrop(...[...this.drops.keys()]);
        for (const d of this.drops) {
            Core.farmingLogger(d[0], d[1]);
        }

        if (!!Core.bossClass) {
            Core.equipClass(ClassType.Boss);
        } else {
            bot.log(
                "BossClass is empty/unselected in CBO, we'll use the Solo class or if that's empty, the currently equipped class.",
            );
            Core.equipClass(ClassType.Solo);
        }

        bot.events.on("extensionPacket", this.listener);
        bot.options.attackWithoutTarget = true;

        while (!bot.shouldExit && ![...this.drops].every((d) => Core.checkInventory(d[0], d[1]))) {
            if (bot.map.name !== this.map) {
                Core.join(this.map);
            }
            if (bot.player.cell !== this.cell) {
                Core.jump(this.cell, this.pad);
            }
            bot.combat.attack("*");
            bot.sleep(200);
            if ([...this.drops].every((d) => Core.checkInventory(d[0], d[1]))) {
                break;
            }
        }

        bot.options.attackWithoutTarget = false;
        bot.events.off("extensionPacket", this.listener);
    }

    listener = (packet: EventMap["extensionPacket"]): void => {
        if (packet?.["params"]?.type?.toString() !== "json") {
            return;
        }
        if (!bot.player.alive) {
            return;
        }
        const data = packet["params"].dataObj;
        if (data?.cmd?.toString() !== "event") {
            return;
        }
        const zoneSet = data?.args?.zoneSet?.toString();
        if (!zoneSet) {
            return;
        }

        const px = bot.player.x;
        const py = bot.player.y;

        // Zone A active, walk right
        if (zoneSet.toUpperCase() === "A") {
            /* box of : 
            x: 550, y: 339
            x: 678, y: 465
            */
            if (px >= 550 && px <= 678 && py >= 339 && py <= 465) {
                return;
            }

            const randX = randomInt(550, 678);
            const randY = randomInt(339, 465);
            // C# walks on a Task.Run; listeners run between bot calls here, so it walks at once.
            bot.player.walkTo(randX, randY);
            return;
        }

        // Zone B active, walk left
        if (zoneSet.toUpperCase() === "B") {
            /* box of : 
            x: 426, y: 359
            x: 211, y: 445
            */
            if (px >= 211 && px <= 426 && py >= 359 && py <= 445) {
                return;
            }

            const randX = randomInt(211, 426);
            const randY = randomInt(359, 445);
            bot.player.walkTo(randX, randY);
            return;
        }
    };
}

export default function main(): void {
    const script = new KillWorldBoss();
    // Core.BankingBlackList.AddRange(new[] { "item1", "Item2", "Etc" });
    Core.setOptions(undefined, { disableClassSwap: true });

    script.worldBoss();

    Core.setOptions(false);
}
