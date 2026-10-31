/*
name: Arcana Invoker (Class)
description: This script will get Arcana Invoker class.
tags: arcana, invoker, class, arcana invoker, darkon, astravia, garden
*/
// Port of Scripts/Other/Classes/ArcanaInvoker[Non-Insignia].cs.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreStory } from "../../core/CoreStory";
import { ArcanaInvokerResourceMerge } from "../../darkon/mergeshops/ArcanaInvokerResourceMerge";
import { CoreAstravia } from "../../story/elegyofmadness(darkon)/CoreAstravia";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const Astravia = new CoreAstravia();
const AIRM = new ArcanaInvokerResourceMerge();
const Story = new CoreStory();

export class ArcanaInvoker {
    getBadge: boolean = false;

    getAI(rankUpClass = true): void {
        this.getBadge = bot.config!.get<boolean>("Badge");
        bot.log(`Get Badge Enabled (if you iodaded)?: ${this.getBadge}`);
        if (this.getBadge && Core.hasWebBadge("Arcana Invoker")) {
            if (rankUpClass) {
                Adv.rankUpClass("Arcana Invoker");
            }
            return;
        }

        if (!this.getBadge && Core.checkInventory("Arcana Invoker")) {
            if (rankUpClass) {
                Adv.rankUpClass("Arcana Invoker");
            }
            return;
        }

        this.doStory();

        // Checks require for ioda user .. why would you want 2...?
        if (!Core.checkInventory("Arcana Invoker")) {
            Adv.buyItem("arcana", 2436, "Arcana Invoker");
        }

        if (rankUpClass) {
            Adv.rankUpClass("Arcana Invoker");
        }
    }

    doStory(): void {
        if (Core.isCompletedBefore(9697)) {
            return;
        }

        Farm.experience(80);
        Astravia.theWorld();

        Story.preLoad(this.doStory);

        // Your Garden (9693)
        if (!Story.questProgression(9693)) {
            Core.ensureAccept(9693);
            // ItemBase[] reqs = Core.EnsureLoad(9693).Requirements.ToArray();
            Core.killMonster("oaklore", "r1", "Spawn", "Undead Infantry", "0 - The Fool's Humble Beginnings", 1, {
                isTemp: false,
            });
            for (const req of [
                ...Core.ensureLoad(9693).requirements.filter((x) => x.name !== "0 - The Fool's Humble Beginnings"),
            ].sort((a, b) =>
                compare(((x) => parseInt(x.name.split(" ")[0]))(a), ((x) => parseInt(x.name.split(" ")[0]))(b)),
            )) {
                if (Core.checkInventory(req.name, req.quantity)) {
                    continue;
                }

                Core.logger(req.name);
                AIRM.buyAllMerge(req.name);
            }
            Core.ensureComplete(9693);
        }

        // Love and Loss (9694)
        if (!Story.questProgression(9694)) {
            Core.ensureAccept(9694);

            for (const req of [...Core.ensureLoad(9694).requirements].sort((a, b) =>
                compare(((x) => parseInt(x.name.split(" ")[0]))(a), ((x) => parseInt(x.name.split(" ")[0]))(b)),
            )) {
                if (Core.checkInventory(req.name, req.quantity)) {
                    continue;
                }

                Core.logger(req.name);
                // Logging the item name
                while (!bot.shouldExit && !Core.checkInventory(req.name, req.quantity)) {
                    AIRM.buyAllMerge(req.name);
                }

                bot.wait.forPickup(req.name);
            }
            Core.ensureComplete(9694);
        }

        // Dawn Before Dusk (9695)
        if (!Story.questProgression(9695)) {
            Core.ensureAccept(9695);
            for (const req of [...Core.ensureLoad(9695).requirements].sort((a, b) =>
                compare(
                    ((x) => {
                        const parts = x.name.split(" ");
                        if (parts.length > 0 && /^\s*[+-]?\d+\s*$/.test(parts[0])) {
                            return parseInt(parts[0]);
                        }
                        return 2147483647;
                        // If parsing fails, place it at the end
                    })(a),
                    ((x) => {
                        const parts = x.name.split(" ");
                        if (parts.length > 0 && /^\s*[+-]?\d+\s*$/.test(parts[0])) {
                            return parseInt(parts[0]);
                        }
                        return 2147483647;
                        // If parsing fails, place it at the end
                    })(b),
                ),
            )) {
                if (Core.checkInventory(req.name, req.quantity)) {
                    continue;
                }

                Core.logger(req.name);
                while (!bot.shouldExit && !Core.checkInventory(req.name, req.quantity)) {
                    AIRM.buyAllMerge(req.name);
                }
                bot.wait.forPickup(req.name);
            }
            Core.ensureComplete(9695);
        }

        // Dusk Before Dawn (9696)
        if (!Story.questProgression(9696)) {
            Core.ensureAccept(9696);

            for (const req of [...Core.ensureLoad(9696).requirements].sort((a, b) =>
                compare(
                    ((x) => {
                        const parts = x.name.split(" ");
                        if (parts.length > 0 && /^\s*[+-]?\d+\s*$/.test(parts[0])) {
                            return parseInt(parts[0]);
                        }
                        return 2147483647;
                        // If parsing fails, place it at the end
                    })(a),
                    ((x) => {
                        const parts = x.name.split(" ");
                        if (parts.length > 0 && /^\s*[+-]?\d+\s*$/.test(parts[0])) {
                            return parseInt(parts[0]);
                        }
                        return 2147483647;
                        // If parsing fails, place it at the end
                    })(b),
                ),
            )) {
                if (Core.checkInventory(req.name, req.quantity)) {
                    continue;
                }

                Core.logger(req.name);
                while (!bot.shouldExit && !Core.checkInventory(req.name, req.quantity)) {
                    AIRM.buyAllMerge(req.name);
                }
                bot.wait.forPickup(req.name);
            }
            Core.ensureComplete(9696);
        }

        // Endless Beginning, Final Ends (9697)
        if (!Story.questProgression(9697)) {
            Core.ensureAccept(9697);
            for (const req of [...Core.ensureLoad(9697).requirements].sort((a, b) =>
                compare(
                    ((x) => {
                        const parts = x.name.split(" ");
                        if (parts.length > 0 && /^\s*[+-]?\d+\s*$/.test(parts[0])) {
                            return parseInt(parts[0]);
                        }
                        return 2147483647;
                        // If parsing fails, place it at the end
                    })(a),
                    ((x) => {
                        const parts = x.name.split(" ");
                        if (parts.length > 0 && /^\s*[+-]?\d+\s*$/.test(parts[0])) {
                            return parseInt(parts[0]);
                        }
                        return 2147483647;
                        // If parsing fails, place it at the end
                    })(b),
                ),
            )) {
                if (Core.checkInventory(req.name, req.quantity)) {
                    continue;
                }

                Core.logger(req.name);
                while (!bot.shouldExit && !Core.checkInventory(req.name, req.quantity)) {
                    AIRM.buyAllMerge(req.name);
                }
                bot.wait.forPickup(req.name);
            }
            Core.ensureComplete(9697);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "AIClassBadge",
    [
        option.bool(
            "Badge",
            "Badge (For ioda users)",
            "For those that retardedly ioda-ed this class... you'll have todo enable this so it can go do the quests.",
            false,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new ArcanaInvoker();
    Core.setOptions();

    script.getAI();

    Core.setOptions(false);
}

function compare(a: any, b: any): number {
    return a < b ? -1 : a > b ? 1 : 0;
}
