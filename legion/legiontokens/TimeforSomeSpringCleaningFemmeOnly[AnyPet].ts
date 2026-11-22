/*
name: TimeforSomeSpringCleaning[AnyPet] (Femme Cult Worshiper only)
description: Farms Legion Tokens with your Spring Cleaning pet's "Time for Some Spring Cleaning" quest, killing only Femme Cult Worshiper in fotia r5.
tags: legion, legion token, fotia, femme cult worshiper
*/
// Turu: a variant of TimeforSomeSpringCleaning[AnyPet].ts (CoreLegion.ltShogunParagon), which farms
// the other requirements in fotia's Enter cell. Everything "Time for Some Spring Cleaning" asks
// for also drops from Femme Cult Worshiper, so this one stays in r5. It leaves out "Clear a Path",
// which still needs the Enter cell.

import { bot, defineScriptOptions, option } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

// [PetID, QuestID ("Time for Some Spring Cleaning")], as CoreLegion.ltShogunParagon.
const questData: [number, number][] = [
    [84900, 9649],
    [84899, 9646],
    [84965, 9663],
    [49926, 7073],
    [47578, 6750],
    [47614, 6756],
    [38792, 5756],
    [38621, 5755],
];

export class TimeforSomeSpringCleaningFemmeOnly {
    farm(quant = 50000, log = false): void {
        if (Core.checkInventory("Legion Token", quant)) {
            Core.farmingLogger("Legion Token", quant);
            return;
        }

        const owned = new Set(bot.inventory.items.concat(bot.bank.items).map((i) => i.id));
        const [petId, questId] = questData.find((q) => owned.has(q[0])) ?? [0, 0];
        if (petId === 0) {
            Core.logger("No Pet owned for 'Time for Some Spring Cleaning' or pet missing from our list");
            return;
        }

        const quest = Core.ensureLoad(questId);
        if (quest.id === 0) {
            Core.logger(`QuestID ${questId} missing from QuestData.json!`, undefined, { messageBox: true });
            return;
        }

        Core.addDrop(...new Set(quest.rewards.filter((r) => r != null && r.quantity < r.maxStack).map((r) => r.name)));
        bot.log(`✔️ Quest Pet Owned\nPetID: [${petId}]\nQuestID: [${quest.id}]`);

        const requirements = quest.requirements.filter((r) => r != null && r.id !== 0);

        Core.equipClass(ClassType.Farm);
        Core.farmingLogger("Legion Token", quant);
        Core.addDrop("Legion Token");
        Core.registerQuests(quest.id);

        while (!bot.shouldExit && !Core.checkInventory("Legion Token", quant)) {
            for (const req of requirements) {
                if (bot.tempInv.contains(req.name, req.quantity)) continue;
                Core.killMonster("fotia", "r5", "Left", "Femme Cult Worshiper", req.name, req.quantity, { log });
                if (Core.checkInventory("Legion Token", quant)) break;
            }
        }
        Core.cancelRegisteredQuests();
    }
}

export const scriptOptions = defineScriptOptions(
    "SpringCleaningFemmeOnly",
    [
        option.bool("Enable Logger?", "Toggle Farm Logging", 'Toggles the "Farming item (x/x)" lines.', false),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    Core.setOptions();

    new TimeforSomeSpringCleaningFemmeOnly().farm(50000, bot.config!.get<boolean>("Enable Logger?"));

    Core.setOptions(false);
}
