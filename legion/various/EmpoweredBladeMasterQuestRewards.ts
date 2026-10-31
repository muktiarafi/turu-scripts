/*
name: EmpoweredBladeMasterQuestRewards
description: null
tags: null
*/
// Port of Scripts/Legion/Various/EmpoweredBladeMasterQuestRewards.cs.

import { bot, choices, defineScriptOptions, type EventMap, option } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, configEnum, Core, randomInt } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreLegion } from "../CoreLegion";
import { DageChallengeStory } from "../../story/legion/DageChallengeStory";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const Legion = new CoreLegion();
const DageChallenge = new DageChallengeStory();

export enum Rewards {
    Empowered_Blade_Master = 68470,
    Empowered_Blade_Masters_Katana = 68471,
    Empowered_Dual_Katanas = 68472,
}

export class EmpoweredBladeMaster {
    getSet(): void {
        // if (!Core.CheckInventory(new[] { "BladeMaster's Dual Katanas", "Living BladeMaster", "Dark Unicorn Rib" }))
        //     return;

        DageChallenge.dageChallengeQuests();

        const RewardOptions = Core.ensureLoad(8554).rewards;

        Core.addDrop(...RewardOptions.map((x) => x.name));

        Farm.experience(95);
        Core.equipClass(ClassType.Solo);

        if (bot.config!.get<boolean>("GetAllRewards")) {
            Core.registerQuests(8554);
        } else {
            Core.ensureAccept(8554);
        }

        for (const Reward of RewardOptions) {
            // C# returns here, so owning the first reward ended the script before the others.
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                continue;
            }

            Core.farmingLogger(Reward.name, 1);

            Legion.farmLegionToken(15000);
            this.dageInsignia(30);
            if (!bot.config!.get<boolean>("GetAllRewards")) {
                Core.ensureComplete(8554, configEnum("RewardSelect", Rewards, Rewards.Empowered_Blade_Master));
                return;
            }
            Core.jumpWait();
            Core.toBank(Reward.name);
        }
        Core.cancelRegisteredQuests();
    }

    dageInsignia(quant: number): void {
        const Event_RunToArea = ({ zone }: EventMap["runToArea"]): void => {
            switch (zone.toLowerCase()) {
                case "a":
                    //Move to the left
                    bot.player.walkTo(randomInt(40, 175), randomInt(400, 410), 8);
                    break;
                case "b":
                    //Move to the right
                    bot.player.walkTo(randomInt(760, 930), randomInt(410, 415), 8);
                    break;
                default:
                    //Move to the center
                    bot.player.walkTo(randomInt(480, 500), randomInt(300, 420), 8);
                    break;
            }
        };
        //Dage the Evil Insignia
        bot.events.on("runToArea", Event_RunToArea);
        if (!Core.checkInventory("Dage the Evil Insignia", 30)) {
            if (bot.quests.isDailyComplete(8547)) {
                Core.logger("Can't accept quest 8547 because the weekly is complete", undefined, {
                    messageBox: true,
                    stopBot: true,
                });
            }
            Core.ensureAccept(8547);
            Core.equipClass(ClassType.Solo);

            Adv.boostKillMonster(
                "UltraDage",
                "Boss",
                "Right",
                "Dage the Dark Lord",
                "Dage the Dark Lord Defeated",
                undefined,
                { isTemp: false, publicRoom: false },
            );

            Core.ensureComplete(8547);
            bot.wait.forPickup("Dage the Evil Insignia");
        }
        bot.events.off("runToArea", Event_RunToArea);
    }
}

export const scriptOptions = defineScriptOptions(
    "EmpoweredBladeMasterRewards",
    [
        Core.skipOptions,
        option.bool(
            "GetAllRewards",
            "Pick Automatically",
            "if true, does the quest till you have all the rewards possible. otherwise Gets selcted item",
            false,
        ),
        option.choice(
            "RewardSelect",
            "Choose Your Reward",
            "",
            choices(Rewards),
            Rewards[Rewards.Empowered_Blade_Master],
        ),
    ],
    true,
);

export default function main(): void {
    const script = new EmpoweredBladeMaster();
    Core.setOptions();

    script.getSet();

    Core.setOptions(false);
}
