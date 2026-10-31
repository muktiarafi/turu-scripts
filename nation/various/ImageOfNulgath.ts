/*
name: Image of Nulgath
description: This script will farm the "Image of Nulgath" quest rewards.
tags: image of nulgath,nulgath gifts,Fiendish Zweihander Blade, fiendish,zweihandler,Fiendish Zweihander of Bhamud,bhamud
*/
// Port of Scripts/Nation/Various/ImageOfNulgath.cs.

import { ClassType, Core } from "../../core/CoreBots";
import { JuggernautItemsofNulgath, RewardsSelection } from "./JuggernautItems";
import { TempleDelve } from "../../seasonal/staffbirthdays/nulgath/TempleDelve";
import { VoidChasm } from "../../story/nation/VoidChasm";

const Jug = new JuggernautItemsofNulgath();
const TD = new TempleDelve();
const VC = new VoidChasm();

export class ImageOfNulgath {
    getRewards(): void {
        if (Core.checkInventory(Core.questRewards(10019))) {
            return;
        }

        const acceptReqs = Core.ensureLoad(10019).acceptRequirements.map((req) => req.name);
        const reqs = Core.ensureLoad(10019).requirements.map((req) => req.name);

        Core.addDrop(...[...acceptReqs, ...reqs]);

        if (!Core.checkInventory(acceptReqs)) {
            Core.logger("Getting prerequirements for the quest.");

            // Nulgath Armor
            Jug.juggItems(RewardsSelection.Nulgath_Armor);

            // Spoils of War
            Core.equipClass(ClassType.Solo);
            Core.huntMonsterQuest(8582, ["darkwarnation", "War", ClassType.Solo]);

            // Doomed Extract
            TD.storyline();
            Core.huntMonsterQuest(
                9090,
                ["templedelve", "Infested Nation", ClassType.Farm],
                ["templedelve", "Doomed Fiend", ClassType.Solo],
                ["templedelve", "Delirious Elemental", ClassType.Farm],
            );

            // Void Remnant
            VC.storyline();
            Core.huntMonsterQuest(
                9553,
                ["voidchasm", "Carcano", ClassType.Solo],
                ["voidchasm", "Carnage", ClassType.Solo],
                ["voidchasm", "The Hushed", ClassType.Farm],
            );
        }

        const RewardOptions = Core.ensureLoad(10019).rewards;

        for (const item of RewardOptions) {
            Core.addDrop(item.name);
        }

        Core.equipClass(ClassType.Farm);

        for (const Reward of RewardOptions) {
            // C# returns here, so owning the first reward ended the script before the others.
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                continue;
            }

            Core.farmingLogger(Reward.name, 1);

            Core.ensureAccept(10019);
            Core.huntMonster("fiendshard", "Dirtlicker", "Dirtlicker's Reward", undefined, { isTemp: false });
            Core.huntMonster("shadowblast", "Crag and Bamboozle", "Crag and Bamboozle's Reward", undefined, {
                isTemp: false,
            });
            Core.huntMonster("citadel", "Death's Head", "Death's Head Reward", undefined, { isTemp: false });
            Core.huntMonster("underlair", "ArchFiend DragonKnight", "ArchFiend DragonKnight's Reward", undefined, {
                isTemp: false,
            });
            Core.huntMonster("evilwardage", "Klunk", "Klunk's Reward", undefined, { isTemp: false });
            Core.ensureComplete(10019, Reward.id);
            Core.toBank(Reward.name);
        }
    }
}

export default function main(): void {
    const script = new ImageOfNulgath();
    Core.setOptions();

    script.getRewards();

    Core.setOptions(false);
}
