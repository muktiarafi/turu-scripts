/*
name: SecondSpeakerPrismaticSeams
description: does the 'Mega Timestream Medals' quest for prismatic seams
tags: null
*/
// Port of Scripts/Other/Various/SecondSpeakerPrismaticSeams.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreSoW } from "../../story/shadowsofwar/CoreSoW";

const SoW = new CoreSoW();

export class SecondSpeakerPrismaticSeams {
    example(TestMode = false): void {
        Core.logger(
            bot.config?.get<boolean>("Use Public Boss") === true
                ? "Public Boss is enabled, THIS IS VERY RISKY!"
                : "Public Boss room Disabled",
            bot.config?.get<boolean>("Use Public Boss") === true ? "****WARNING***" : "****INFO***",
        );

        //Test Stuff Below here
        SoW.timestreamWar();
        if (bot.config?.get<boolean>("Use Public Boss") === true) {
            Core.logger(
                "Joining whitemap then back to streamwar to avoid being stuck in private room from doing the story.",
            );
            Core.join("whitemap");
            Core.privateRooms = false;
        }

        Core.join("streamwar", undefined, undefined, {
            publicRoom: bot.config?.get<boolean>("Use Public Boss") === true,
        });

        Core.logger(
            "This Script will use the class you have set as your `SoloClass` in your CBO options.(options > corebots > solo class)\n" +
                "If you want to use a different class, change your CBO options.",
        );
        Core.equipClass(ClassType.Solo);
        Core.addDrop("Prismatic Seams");
        Core.registerQuests(8815);
        Core.farmingLogger("Prismatic Seams", 2000);
        while (!bot.shouldExit && !Core.checkInventory("Prismatic Seams", 2000)) {
            if (bot.map.name !== "streamwar") {
                Core.join("streamwar", undefined, undefined, {
                    publicRoom: bot.config?.get<boolean>("Use Public Boss") === true,
                });
                bot.wait.forMapLoad("streamwar");
            }
            if (bot.player.cell !== "r5") {
                Core.jump("r5", "Left");
                bot.wait.forCellChange("r5");
            }
            bot.combat.attack("Second Speaker");
            Core.sleep(500);
            if (Core.checkInventory("Prismatic Seams", 2000)) {
                break;
            }
        }
        // Safely Exit Boss Room to the neighboring room
        Core.sleep(1500);
        Core.jump("r4", "Right");
        Core.cancelRegisteredQuests();
        bot.wait.forPickup("Prismatic Seams");
    }
}

export const scriptOptions = defineScriptOptions(
    "SecondSpeakerPrismaticSeams",
    [option.bool("Use Public Boss", "Use public rooms for this boss... [RISKY]", "", false), Core.skipOptions],
    true,
);

export default function main(): void {
    const script = new SecondSpeakerPrismaticSeams();
    Core.setOptions();

    script.example();

    Core.setOptions(false);
}
