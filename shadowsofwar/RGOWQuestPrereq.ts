/*
name: Radiant Goddess of War PreReqs
description: Farms the six item requirements needed to accept quest 9184, The Goddess of War. This script does not complete the quest or obtain Radiant Goddess of War.
tags: radiant goddess of war, rgow, goddess of war, prerequisites, prereqs
*/
// Port of Scripts/ShadowsOfWar/RGOWQuestPrereq.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { DrakathArmorBot } from "../chaos/DrakathsArmor";
import { Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";
import { Awescended } from "../good/gearofawe/Awescended";
import { CoreHollowbornPaladin } from "../hollowborn/hollowbornpaladin/CoreHollowbornPaladin";
import { FireChampionsArmor } from "../other/armor/FireChampionsArmor";
import { MalgorsArmorSet } from "../other/armor/MalgorsArmorSet";
import { BeetleQuests } from "../seasonal/staffbirthdays/nulgath/BeetleQuests";
import { CoreSoW } from "../story/shadowsofwar/CoreSoW";

const Farm = new CoreFarms();
const SoW = new CoreSoW();
const DAB = new DrakathArmorBot();
const FCA = new FireChampionsArmor();
const beetleQuests = new BeetleQuests();
const awescended = new Awescended();
const HBP = new CoreHollowbornPaladin();
const malgorsArmorSet = new MalgorsArmorSet();

export class RadiantGoddessOfWarPreReqs {
    readonly requiredItems: string[] = [
        "Empowered Drakath Armor",
        "Fire Champion's Armor",
        "Void Beetle Warlord",
        "Malgor the ShadowLord",
        "Classic Hollowborn Paladin Armor",
        "Awescended",
    ];

    getPrereqs(): void {
        if (Core.checkInventory("Radiant Goddess of War")) {
            Core.logger("Radiant Goddess of War is already owned");
            return;
        }

        if (!Core.checkInventory(this.requiredItems)) {
            SoW.completeCoreSoW();
            Farm.experience();
            this.getEmpoweredDrakathArmor();
            FCA.getFireChampsArmor();
            beetleQuests.warlordRewards("Void Beetle Warlord");
            awescended.getAwe();
            HBP.getSpecific("Classic Hollowborn Paladin Armor");
            malgorsArmorSet.getSet(false, ["Malgor the ShadowLord"]);
        }

        if (Core.checkInventory(this.requiredItems)) {
            Core.logger('All item requirements needed to accept the quest "The Goddess of War" are ready.');
        } else {
            for (const item of this.requiredItems) {
                if (!Core.checkInventory(item)) {
                    Core.logger(`Missing requirement for quest 9184, The Goddess of War: ${item}`);
                }
            }
        }

        Core.logger("Next: Run UltraSpeakerMergePreReqs.cs to obtain Goddess Of War armor and complete the quest");
    }

    private getEmpoweredDrakathArmor(): void {
        if (Core.checkInventory("Empowered Drakath Armor")) {
            return;
        }

        if (!bot.config!.get<boolean>("UseInsigsonEmpDrkArm")) {
            Core.logger("Empowered Drakath Armor was skipped because insignia use is disabled");
            return;
        }

        if (!Core.checkInventory("Champion Drakath Insignia", 5)) {
            Core.logger("Empowered Drakath Armor requires 5 Champion Drakath Insignias");
            return;
        }

        DAB.drakathArmor();

        if (!Core.checkInventory("Drakath Armor")) {
            Core.logger("Empowered Drakath Armor could not be bought because Drakath Armor is missing");
            return;
        }

        Farm.chaosMilitiaREP();
        Core.buyItem("championdrakath", 2055, "Empowered Drakath Armor");
    }
}

export const scriptOptions = defineScriptOptions(
    "RGoWPreReqs",
    [
        option.bool(
            "UseInsigsonEmpDrkArm",
            "Use Insignias for Empowered Drakath Armor?",
            'Spend 5 Champion Drakath Insignias on Empowered Drakath Armor, which is required to accept quest 9184, "The Goddess of War."',
            false,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new RadiantGoddessOfWarPreReqs();
    Core.bankingBlackList.push(...script.requiredItems);
    Core.bankingBlackList.push("Drakath Armor", "Champion Drakath Insignia");
    Core.setOptions();

    try {
        script.getPrereqs();
    } finally {
        Core.setOptions(false);
    }
}
