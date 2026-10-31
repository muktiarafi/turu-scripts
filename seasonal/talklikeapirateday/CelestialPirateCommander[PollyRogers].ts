/*
name: Celestial Pirate Commander (Polly Rogers)
description: This will farm the Celestial Pirate Commander items and (Polly Rogers) pet.
tags: farm, pet, polly-rogers, celestial-pirate-commander, pirate
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/CelestialPirateCommander[PollyRogers].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { ClassType, configEnum, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export enum CPCReward {
    All = 0,
    PollyRoger = 56776,
    CelestialPirateCommander = 56588,
    CommandersHat = 56589,
    CommandersLocks = 56590,
    LocksAndHat = 56591,
    Wings = 56592,
    BackBlade = 56593,
    WingsAndBlade = 56594,
    Sword = 56595,
    HatAndMorph = 56596,
    MorphAndLocks = 56597,
    Plank = 56619,
}

export class CelestialPirateCommander {
    rewards: string[] = [
        "Celestial Pirate Commander",
        "Celestial Commander's Hat",
        "Celestial Commander's Locks",
        "Celestial Commander's Locks + Hat",
        "Celestial Commander's Wings",
        "Celestial Commander's Back Blade",
        "Celestial Commander's Wings+ Blade",
        "Celestial Commander's Sword",
        "Celestial Commander's Hat + Morph",
        "Celestial Commander's Morph + Locks",
        "Celestial Commander's Plank",
        "Polly Roger",
    ];

    // Declare `Reward` at class level using a void.. type thing
    get reward(): CPCReward {
        return configEnum("CPCReward", CPCReward, CPCReward.All);
    }

    getCPC(Reward: CPCReward): void {
        if (!bot.quests.isAvailable(7713)) {
            Core.logger("Not the right season ya dummy");
            return;
        }

        if (Reward !== CPCReward.All && Core.checkInventory(Reward)) {
            Core.logger(`You already have the selected reward`);
            return;
        }

        Farm.experience(80);

        let i = 1;
        Core.addDrop(...this.rewards);

        while (
            !bot.shouldExit &&
            (Reward === CPCReward.All
                ? !Core.checkInventory(this.rewards, undefined, { toInv: false })
                : !Core.checkInventory(Reward))
        ) {
            Core.ensureAccept(7713);
            Core.equipClass(ClassType.Dodge);

            Core.huntMonster("frozenlair", "Legion Lich Lord", "Sapphire Orb", 5, { isTemp: false, publicRoom: true });

            Core.equipClass(ClassType.Solo);

            Core.huntMonster("lostruinswar", "Diabolical Warlord", "Rumors of the Celestial Commander", 5, {
                isTemp: false,
                publicRoom: true,
            });

            Core.huntMonster("iceplane", "Animus of Ice", "Starlit Journal Page 1 Scraps", 10, { isTemp: false });

            Core.huntMonster("ivoliss", "Ivoliss", "Starlit Journal Page 2 Scraps", 10, {
                isTemp: false,
                publicRoom: true,
            });

            Core.huntMonster("voidnightbane", "Nightbane", "Starlit Journal Page 3 Scraps", 10, {
                isTemp: false,
                publicRoom: true,
            });

            Core.huntMonster("extinction", "Ultra SN.O.W.", "Starlit Journal Page 4 Scraps", 10, {
                isTemp: false,
                publicRoom: true,
            });

            Core.huntMonster("starsinc", "Empowered Prime", "Map of the Celestial Seas", 1, {
                isTemp: false,
                publicRoom: true,
            });

            //why the fuck was the class buffed!?
            const usethis =
                bot.inventory.items
                    .concat(...bot.bank.items)
                    .find((n) => n.name === "Yami no Ronin" || n.name.startsWith("Chaos Slayer")) ?? null;
            if (usethis != null) {
                Core.equip(usethis.id);
                Core.equip(...Core.farmGear);
                if (usethis.name === "Yami no Ronin") {
                    bot.skills.startAdvanced("1 | 4");
                }
            } else {
                Core.equipClass(ClassType.Dodge);
            }

            Core.huntMonster("underlair", "ArchFiend DragonLord", "Coffer of the Stars", 1, {
                isTemp: false,
                publicRoom: true,
            });

            Core.equipClass(ClassType.Solo);

            if (Reward !== CPCReward.All) {
                Core.ensureComplete(7713, Reward);
                return;
            } else {
                // Complete for first unowned if reward == `Any`
                Core.ensureCompleteChoose(7713);
                Core.toBank(...this.rewards);
                Core.logger(`Completed x${i++}`);
            }
        }

        Core.logger(
            Reward === CPCReward.All ? "You already have all the drops" : "You already have the selected reward",
        );
    }
}

export const scriptOptions = defineScriptOptions(
    "CelestialPiriateCommander",
    [
        option.choice(
            "CPCReward",
            "Which reward do you want?",
            "Select a specific reward or Any to farm everything",
            choices(CPCReward),
            CPCReward[CPCReward.All],
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new CelestialPirateCommander();
    Core.setOptions();

    script.getCPC(script.reward);

    Core.setOptions(false);
}
