/*
name: TimeforSomeSpringCleaning[AnyPet] (Femme Cult Worshiper only)
description: Farms Legion Tokens with your Spring Cleaning pet's quests ("Time for Some Spring Cleaning" and "Clear a Path"), killing only Femme Cult Worshiper in fotia r5.
tags: legion, legion token, fotia, femme cult worshiper
*/
// Turu: a variant of TimeforSomeSpringCleaning[AnyPet].ts (CoreLegion.ltShogunParagon), which farms
// the other requirements in fotia's Enter cell. Every item both quests ask for also drops from
// Femme Cult Worshiper, so this one stays in r5 for all of them.

import { bot, defineScriptOptions, option } from "turu";
import type { QuestItem } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import type { QuestData } from "../../core/CoreBots";
// [PetID, MainQuestID ("Time for Some Spring Cleaning"), SideQuestID ("Clear a Path")], as CoreLegion.ltShogunParagon.
const questData: [number, number, number][] = [
    [84900, 9649, 9648],
    [84899, 9646, 9645],
    [84965, 9663, 9662],
    [49926, 7073, 7072],
    [47578, 6750, 6749],
    [47614, 6756, 6754],
    [38792, 5756, 5754],
    [38621, 5755, 5753],
];

export class TimeforSomeSpringCleaningFemmeOnly {
    farm(quant = 50000, doClearAPath = true, log = false): void {
        if (Core.checkInventory("Legion Token", quant)) {
            Core.farmingLogger("Legion Token", quant);
            return;
        }

        const owned = new Set(bot.inventory.items.concat(bot.bank.items).map((i) => i.id));
        const [petId, mainQuestId, sideQuestId] = questData.find((q) => owned.has(q[0])) ?? [0, 0, 0];
        if (petId === 0) {
            Core.logger("No Pet owned for 'Time for Some Spring Cleaning' or pet missing from our list");
            return;
        }

        const questList: QuestData[] = [];
        for (const id of doClearAPath ? [mainQuestId, sideQuestId] : [mainQuestId]) {
            const quest = Core.ensureLoad(id);
            if (quest.id === 0) {
                Core.logger(`QuestID ${id} missing from QuestData.json!`, undefined, { messageBox: true });
                return;
            }
            questList.push(quest);
        }

        for (const quest of questList)
            Core.addDrop(
                ...new Set(quest.rewards.filter((r) => r != null && r.quantity < r.maxStack).map((r) => r.name)),
            );
        bot.log(`✔️ Quest Pet Owned\nPetID: [${petId}]\nQuestID(s): [${questList.map((q) => q.id).join(", ")}]`);

        const requirements = new Map<number, [QuestItem, number]>();
        for (const quest of questList)
            for (const req of quest.requirements)
                if (req != null && req.id !== 0 && !requirements.has(req.id))
                    requirements.set(req.id, [req, req.quantity]);

        Core.equipClass(ClassType.Farm);
        Core.farmingLogger("Legion Token", quant);
        Core.addDrop("Legion Token");
        Core.registerQuests(...questList.map((q) => q.id));

        while (!bot.shouldExit && !Core.checkInventory("Legion Token", quant)) {
            for (const [questItem, itemQuant] of requirements.values()) {
                if (bot.tempInv.contains(questItem.name, itemQuant)) continue;
                Core.killMonster("fotia", "r5", "Left", "Femme Cult Worshiper", questItem.name, itemQuant, { log });
                if (Core.checkInventory("Legion Token", quant)) break;
            }
        }
        Core.cancelRegisteredQuests();
    }
}

export const scriptOptions = defineScriptOptions(
    "SpringCleaningFemmeOnly",
    [
        option.bool(
            "DoClearaPath",
            'Do the "Clear a Path" Quest',
            'Also does the "Clear a Path" quest during the Legion Token farm.',
            true,
        ),
        option.bool("Enable Logger?", "Toggle Farm Logging", 'Toggles the "Farming item (x/x)" lines.', false),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    Core.setOptions();

    new TimeforSomeSpringCleaningFemmeOnly().farm(
        50000,
        bot.config!.get<boolean>("DoClearaPath"),
        bot.config!.get<boolean>("Enable Logger?"),
    );

    Core.setOptions(false);
}
