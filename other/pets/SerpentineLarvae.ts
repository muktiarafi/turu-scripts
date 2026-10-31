/*
name: serpentine larvae set
description: gets pet, does quest, gets set
tags: serpentine larvae, set
*/
// Port of Scripts/Other/Pets/SerpentineLarvae.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreNation } from "../../nation/CoreNation";

const Adv = new CoreAdvanced();
const Nation = new CoreNation();

export class SerpentineLarvae {
    doQuest(): void {
        Core.huntMonster("darkalliance", "Shadowflame Nulgath", "Serpentine Larvae", undefined, {
            isTemp: false,
            log: false,
        });
        this.autoReward(8944);
        Core.trashCan("Tainted Soul", "Blade of Holy Might", "Infected Dragon Soul");
    }

    autoReward(questID = 0, quant = 1): void {
        const RewardOptions = Core.ensureLoad(questID).rewards;

        for (const item of RewardOptions) {
            Core.addDrop(item.id);
        }

        Core.equipClass(ClassType.Solo);

        for (const item of RewardOptions) {
            if (!Core.checkInventory(item.id)) {
                Core.farmingLogger(item.name, 1);
            }

            while (!bot.shouldExit && !Core.checkInventory(item.id, quant)) {
                Core.ensureAccept(questID);
                Core.huntMonster(Core.isMember ? "nulgath" : "evilmarsh", "Tainted Elemental", "Tainted Soul", 5, {
                    isTemp: false,
                    log: false,
                });
                Core.huntMonster("northlands", "Aisha's Drake", "Blade of Holy Might", undefined, {
                    isTemp: false,
                    log: false,
                });
                Nation.farmDarkCrystalShard(10);
                Nation.farmTaintedGem(15);
                Adv.buyItem("evilwarnul", 456, "Oversoul Witch of Nulgath");
                Core.huntMonster("dragonhame", "Infected Dragon", "Infected Dragon Soul", 5, {
                    isTemp: false,
                    log: false,
                });
                Core.ensureComplete(questID, item.id);
            }
        }
    }
}

export default function main(): void {
    const script = new SerpentineLarvae();
    Core.setOptions();

    script.doQuest();

    Core.setOptions(false);
}
