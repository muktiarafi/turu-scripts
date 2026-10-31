/*
name: Caladbolg
description: null
tags: null
*/
// Port of Scripts/Legion/Various/Caladbolg.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const Legion = new CoreLegion();
const Adv = new CoreAdvanced();

export class Caladbolg {
    getCaladbolg(otherRewards = false): void {
        const target = otherRewards ? ["Caladbolg", "Caladboogly", "Dual Caladbolgs"] : ["Caladbolg"];
        if (Core.checkInventory(target)) {
            return;
        }

        if (!Core.checkInventory("Altar Of Caladbolg")) {
            Core.logger('This bot requires you to have a "Altar Of Caladbolg". Stopping the bot.', undefined, {
                messageBox: true,
            });
            return;
        }

        if (!Core.checkInventory("Legion Titan")) {
            if (!Core.checkInventory("Essence of the Undead Legend")) {
                Core.logger(
                    'This bot requires you to have a "Essence of the Undead Legend" (Seasonal - March). Stopping the bot.',
                    undefined,
                    { messageBox: true },
                );
                return;
            }
            if (!Core.checkInventory("Undead Legend")) {
                if (!Core.checkInventory("Undead Legion Overlord")) {
                    Legion.farmLegionToken(300);
                    Adv.buyItem("underworld", 238, "Undead Legion Overlord");
                }

                Legion.farmLegionToken(200);
                Adv.buyItem("underworld", 238, "Undead Legend");
            }

            Adv.buyItem("underworld", 238, "Legion Titan");
        }
        const QuestID = Core.checkInventory(11953) ? 1960 : 3419;
        Core.addDrop(...Core.ensureLoad(QuestID).rewards.map((x) => x.name));

        Core.registerQuests(QuestID);
        while (!bot.shouldExit && !Core.checkInventory(target)) {
            if (!Core.checkInventory("Legion Token", 5)) {
                Legion.farmLegionToken(5);
            }
            Core.killMonster("underworld", "r9", "Left", 20, 13148, undefined, { isTemp: true });
        }
        Core.cancelRegisteredQuests();
    }
}

export const scriptOptions = defineScriptOptions("Caladbolg", [
    option.bool("other", "Other Rewards", "If True, the bot will also get the Dual Caladbolgs and Caladboogly", false),
]);

export default function main(): void {
    const script = new Caladbolg();
    Core.setOptions();

    script.getCaladbolg(bot.config!.get<boolean>("other"));

    Core.setOptions(false);
}
