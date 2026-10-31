/*
name: Headless Horseman Gear
description: null
tags: null
*/
// Port of Scripts/Seasonal/Mogloween/GearSets/HeadlessHorsemanGear.cs.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { MogloweenSeasonalMerge } from "../mergeshops/MogloweenSeasonalMerge";

const Adv = new CoreAdvanced();
const MogloweenMerge = new MogloweenSeasonalMerge();

export class HeadlessHorsemanGear {
    getGear(): void {
        const QuestIDs = [9457, 9458, 9459, 9460, 9461];

        if (
            !Core.isSeasonalMapActive("mogloween") ||
            Core.checkInventory(Core.questRewards(...QuestIDs), undefined, { toInv: false })
        ) {
            Core.logger(
                Core.checkInventory(Core.questRewards(...QuestIDs))
                    ? "All Rewards Obtained."
                    : "Seasonal Map not available.",
            );
            return;
        }

        // Add all items to the drops
        Core.logger("Adding all drops & requirements to DropLog");

        for (const QuestID of QuestIDs) {
            Core.ensureLoad(QuestID)
                .requirements.concat(...Core.ensureLoad(QuestID).rewards)
                .forEach((item) => Core.addDrop(item.id));
        }

        // C# jumps with `goto case 9459` / `goto case 9460`, which runs that case's steps with the
        // later QuestID (accepting and completing the wrong quest) and then breaks, never doing the
        // later quest. Here the earlier quest is done first, with its own ID, then this one.
        const doQuest = (QuestID: number): void => {
            Core.initializeWithRetries(() => Core.ensureLoad(QuestID));

            if (!Core.checkInventory(Core.questRewards(QuestID))) {
                switch (QuestID) {
                    case 9457:
                        Core.logger("Get Required Quest item");
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("crescentmoon", "Royce", "Oversoul's Headless Horseman", undefined, {
                            isTemp: false,
                        });
                        Core.ensureAccept(QuestID);
                        Core.huntMonster("crescentmoon", "Royce", "Royce's Direclaw", 10, { isTemp: false });
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("pie", "Myst Yaga", "Yaga Staff", 15);
                        Core.huntMonster("twigsarcade", "Spirit Residue", "Spirit Residue", 15);
                        Core.huntMonster("bloodmoon", "Black Unicorn", "Chunk of Armor", 10);
                        Core.ensureComplete(QuestID);
                        break;
                    case 9458:
                        // The Horseman’s Cape 9458
                        Core.ensureAccept(QuestID);
                        Core.killMonster("mogloween", "Pit1", "Center", "Blister", "Torn Cloth", 10);
                        Core.huntMonster("necrocarnival", "ZaZOOOL", "Shadow of Screams", undefined, { isTemp: false });
                        Core.huntMonster("candycorn", "Malik-EYE ", "Knife", 1);
                        Core.ensureComplete(QuestID);
                        break;
                    case 9459:
                        // The Horseman’s Head 9459
                        Core.ensureAccept(QuestID);
                        // Pumpkin Grin
                        Adv.buyItem("asylum", 507, 36720, undefined, 21659);
                        Core.huntMonster("that", "Will O' The Wisp", "Flames", 30);
                        Core.huntMonster("twigsarcade", "Ectoplasm", "Ectoplasm", 20);
                        Core.huntMonster("tricktown", "Rotting Pumpkin", "Pumpkin Seeds", 50);
                        Core.ensureComplete(QuestID);
                        break;
                    case 9460:
                        if (!Core.checkInventory("Headtaking Headless Horseman")) {
                            doQuest(9459);
                        }
                        // The Horseman’s Axe 9460
                        Core.ensureAccept(QuestID);
                        Core.huntMonster("franken", "Frankenwerepire", "Shattered Metal Piece", 7);
                        Core.huntMonster("that", "Shattered Hope", "Lost Hope", 10);
                        Core.huntMonster("voltabolt", "Nightmare Dentist Chair", "Blade Sharpener");
                        Core.ensureComplete(QuestID);
                        break;
                    case 9461:
                        if (!Core.checkInventory("Oversoul's Rusted Head Axe")) {
                            doQuest(9460);
                        }
                        // The Horseman’s Second Axe 9461
                        Core.ensureAccept(QuestID);
                        MogloweenMerge.buyAllMerge("Sinister PumpKing Blade");
                        Core.huntMonster("necronaut", "necronaut", "Aged Metal", 5, { isTemp: false });
                        Core.huntMonster("mogloweengrave", "Zombie Terror", "Oversoul Essence", 15, { isTemp: false });
                        Core.huntMonster("cask", "Nitre Golem", "Potassium Nitrate", 10, { isTemp: false });
                        Core.huntMonster("that", "Congealed Fear", "Fear Essence", 15, { isTemp: false });
                        Core.ensureComplete(QuestID);
                        break;
                }
            }
        };
        for (const QuestID of QuestIDs) doQuest(QuestID);
    }
}

export default function main(): void {
    const script = new HeadlessHorsemanGear();
    Core.setOptions();

    script.getGear();

    Core.setOptions(false);
}
