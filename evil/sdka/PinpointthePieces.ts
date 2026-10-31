/*
name: Pinpoint the Pieces Quests
description: This script will do "Pinpoint the Pieces" quest using the chosen method.
tags: pinpoint, pieces, sdka, dagger, blade, broadsword, scythe, mace, bow
*/
// Port of Scripts/Evil/SDKA/PinpointthePieces.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { ClassType, configEnum, Core } from "../../core/CoreBots";
import { CoreSDKA } from "./CoreSDKA";

const SDKA = new CoreSDKA();

export enum PinpointIDs {
    Dagger = 2181,
    Blade = 2182,
    Broadsword = 2183,
    Scythe = 2184,
    Mace = 2185,
    Bow = 2186,
}

export class PinpointthePieces_Any {
    optionStorage = "Pinpoint_the_Pieces";

    pinpoint(): void {
        Core.equipClass(ClassType.Farm);
        const questID = configEnum("questID", PinpointIDs, PinpointIDs.Dagger) ?? PinpointIDs.Dagger;

        const QuestRewards = [...Core.ensureLoad(questID).rewards];

        for (const reward of QuestRewards) {
            while (!bot.shouldExit && !Core.checkInventory(reward.id, reward.maxStack)) {
                SDKA.pinpointthePieces(questID, [reward.name], [reward.maxStack]);
            }
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "PinpointthePieces_Any",
    [
        Core.skipOptions,
        option.choice(
            "questID",
            "Quest ID",
            "ID of the desired Pinpoint quest to do.",
            choices(PinpointIDs),
            PinpointIDs[PinpointIDs.Dagger],
        ),
    ],
    true,
);

export default function main(): void {
    const script = new PinpointthePieces_Any();
    Core.setOptions();

    script.pinpoint();

    Core.setOptions(false);
}
