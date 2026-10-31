/*
name: Item Enhancement Manager
description: Unbanks and enhances selected weapons, helms, and capes, leaving them in inventory. Bypasses Disable AutoEnhance.
tags: enhancement, unbank, weapon, helm, cape, inventory
*/
// Port of Scripts/Enhancement/ItemEnhancementManager.cs.

import { bot, choices, defineScriptOptions, option, type ScriptOption } from "turu";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";

const Adv = new CoreAdvanced();

export enum WeaponEnhancement {
    None = "None",
    Forge = "Forge",
    Lacerate = "Lacerate",
    Smite = "Smite",
    Valiance = "Valiance",
    Arcanas_Concerto = "Arcanas_Concerto",
    Acheron = "Acheron",
    Elysium = "Elysium",
    Praxis = "Praxis",
    Dauntless = "Dauntless",
    Ravenous = "Ravenous",
    Spiral_Carve = "Spiral_Carve",
    Awe_Blast = "Awe_Blast",
    Health_Vamp = "Health_Vamp",
    Mana_Vamp = "Mana_Vamp",
    Powerword_Die = "Powerword_Die",
    Fighter = "Fighter",
    Thief = "Thief",
    Hybrid = "Hybrid",
    Wizard = "Wizard",
    Healer = "Healer",
    SpellBreaker = "SpellBreaker",
    Lucky = "Lucky",
}

export enum HelmEnhancement {
    None = "None",
    Forge = "Forge",
    Vim = "Vim",
    Examen = "Examen",
    Anima = "Anima",
    Pneuma = "Pneuma",
    Hearty = "Hearty",
    Fighter = "Fighter",
    Thief = "Thief",
    Hybrid = "Hybrid",
    Wizard = "Wizard",
    Healer = "Healer",
    SpellBreaker = "SpellBreaker",
    Lucky = "Lucky",
}

export enum CapeEnhancement {
    None = "None",
    Forge = "Forge",
    Absolution = "Absolution",
    Avarice = "Avarice",
    Vainglory = "Vainglory",
    Penitence = "Penitence",
    Lament = "Lament",
    Fighter = "Fighter",
    Thief = "Thief",
    Hybrid = "Hybrid",
    Wizard = "Wizard",
    Healer = "Healer",
    SpellBreaker = "SpellBreaker",
    Lucky = "Lucky",
}

export class ItemEnhancementManager {
    // Retain the prototype storage key so existing item selections are preserved.

    static readonly skip_Options = [Core.skipOptions];

    static readonly weapon = [
        option.text("WeaponItem1", "Item 1", "Weapon name. Leave blank to skip.", ""),
        option.choice(
            "WeaponEnhancement1",
            "Enhancement 1",
            "Enhancement for Item 1.",
            choices(WeaponEnhancement),
            WeaponEnhancement.None,
        ),
        option.text("WeaponItem2", "Item 2", "Weapon name. Leave blank to skip.", ""),
        option.choice(
            "WeaponEnhancement2",
            "Enhancement 2",
            "Enhancement for Item 2.",
            choices(WeaponEnhancement),
            WeaponEnhancement.None,
        ),
        option.text("WeaponItem3", "Item 3", "Weapon name. Leave blank to skip.", ""),
        option.choice(
            "WeaponEnhancement3",
            "Enhancement 3",
            "Enhancement for Item 3.",
            choices(WeaponEnhancement),
            WeaponEnhancement.None,
        ),
        option.text("WeaponItem4", "Item 4", "Weapon name. Leave blank to skip.", ""),
        option.choice(
            "WeaponEnhancement4",
            "Enhancement 4",
            "Enhancement for Item 4.",
            choices(WeaponEnhancement),
            WeaponEnhancement.None,
        ),
        option.text("WeaponItem5", "Item 5", "Weapon name. Leave blank to skip.", ""),
        option.choice(
            "WeaponEnhancement5",
            "Enhancement 5",
            "Enhancement for Item 5.",
            choices(WeaponEnhancement),
            WeaponEnhancement.None,
        ),
    ];

    static readonly helm = [
        option.text("HelmItem1", "Item 1", "Helm name. Leave blank to skip.", ""),
        option.choice(
            "HelmEnhancement1",
            "Enhancement 1",
            "Enhancement for Item 1.",
            choices(HelmEnhancement),
            HelmEnhancement.None,
        ),
        option.text("HelmItem2", "Item 2", "Helm name. Leave blank to skip.", ""),
        option.choice(
            "HelmEnhancement2",
            "Enhancement 2",
            "Enhancement for Item 2.",
            choices(HelmEnhancement),
            HelmEnhancement.None,
        ),
        option.text("HelmItem3", "Item 3", "Helm name. Leave blank to skip.", ""),
        option.choice(
            "HelmEnhancement3",
            "Enhancement 3",
            "Enhancement for Item 3.",
            choices(HelmEnhancement),
            HelmEnhancement.None,
        ),
        option.text("HelmItem4", "Item 4", "Helm name. Leave blank to skip.", ""),
        option.choice(
            "HelmEnhancement4",
            "Enhancement 4",
            "Enhancement for Item 4.",
            choices(HelmEnhancement),
            HelmEnhancement.None,
        ),
        option.text("HelmItem5", "Item 5", "Helm name. Leave blank to skip.", ""),
        option.choice(
            "HelmEnhancement5",
            "Enhancement 5",
            "Enhancement for Item 5.",
            choices(HelmEnhancement),
            HelmEnhancement.None,
        ),
    ];

    static readonly cape = [
        option.text("CapeItem1", "Item 1", "Cape name. Leave blank to skip.", ""),
        option.choice(
            "CapeEnhancement1",
            "Enhancement 1",
            "Enhancement for Item 1.",
            choices(CapeEnhancement),
            CapeEnhancement.None,
        ),
        option.text("CapeItem2", "Item 2", "Cape name. Leave blank to skip.", ""),
        option.choice(
            "CapeEnhancement2",
            "Enhancement 2",
            "Enhancement for Item 2.",
            choices(CapeEnhancement),
            CapeEnhancement.None,
        ),
        option.text("CapeItem3", "Item 3", "Cape name. Leave blank to skip.", ""),
        option.choice(
            "CapeEnhancement3",
            "Enhancement 3",
            "Enhancement for Item 3.",
            choices(CapeEnhancement),
            CapeEnhancement.None,
        ),
        option.text("CapeItem4", "Item 4", "Cape name. Leave blank to skip.", ""),
        option.choice(
            "CapeEnhancement4",
            "Enhancement 4",
            "Enhancement for Item 4.",
            choices(CapeEnhancement),
            CapeEnhancement.None,
        ),
        option.text("CapeItem5", "Item 5", "Cape name. Leave blank to skip.", ""),
        option.choice(
            "CapeEnhancement5",
            "Enhancement 5",
            "Enhancement for Item 5.",
            choices(CapeEnhancement),
            CapeEnhancement.None,
        ),
    ];

    static readonly multiOptions = ["Weapon", "Helm", "Cape", "Skip_Options"];

    run(): void {
        for (const category of ItemEnhancementManager.multiOptions) {
            if (category === "Skip_Options") {
                continue;
            }

            for (let index = 1; index <= 5; index++) {
                if (bot.shouldExit) {
                    return;
                }

                const itemName = (bot.config.get<string>(category, category + "Item" + index) ?? "").trim();
                if (itemName.length === 0) {
                    continue;
                }

                // The choice options save the member's name.
                const selection = String(bot.config.get<string>(category, category + "Enhancement" + index));
                if (selection === "None") {
                    continue;
                }

                let item =
                    bot.inventory.items
                        .concat(...bot.bank.items)
                        .find(
                            (candidate) =>
                                candidate != null && candidate.name?.trim().toLowerCase() === itemName.toLowerCase(),
                        ) ?? null;
                const logName = [...(item?.name ?? itemName)]
                    .filter((character) => character >= " " && character <= "~" && "%<>&\"'".indexOf(character) < 0)
                    .join("");
                if (item == null) {
                    Core.logger(
                        `${category} item ${index} - ${logName} was not found in inventory or bank. Check the configured name.`,
                    );
                    continue;
                }

                if (
                    (category === "Weapon" && item.equipSlot !== "Weapon") ||
                    (category === "Helm" && item.category.toLowerCase() !== "helm") ||
                    (category === "Cape" && item.category.toLowerCase() !== "cape")
                ) {
                    Core.logger(
                        `${category} item ${index} - ${logName} [ID ${item.id}] is in the wrong equipment section. Skipping.`,
                    );
                    continue;
                }

                // C# Enum.TryParse + Enum.IsDefined on the selected name.
                let type: EnhancementType = EnhancementType[selection as keyof typeof EnhancementType];
                const regular = type !== undefined;
                let weapon = WeaponSpecial.None;
                let helm = HelmSpecial.None;
                let cape = CapeSpecial.None;
                if (!regular) {
                    type = EnhancementType.Lucky;
                    if (category === "Weapon") {
                        const parsed = WeaponSpecial[selection as keyof typeof WeaponSpecial];
                        if (parsed === undefined) {
                            continue;
                        }
                        weapon = parsed;
                        if (weapon === WeaponSpecial.Forge) {
                            Core.logger(
                                `Weapon item ${index} - ${logName} [ID ${item.id}]: Forge is not supported by the current Core enhancement route. Skipping.`,
                            );
                            continue;
                        }
                        if (weapon >= 2 && weapon <= 6 && !Adv.uAwe()) {
                            Core.logger(
                                `Weapon item ${index} - ${logName} [ID ${item.id}] requires unlocked Awe enhancements. Skipping.`,
                            );
                            continue;
                        }
                        if (typeof EnhancementType[item.enhancementPatternId] === "string") {
                            type = item.enhancementPatternId as EnhancementType;
                        }
                    } else if (category === "Helm") {
                        const parsed = HelmSpecial[selection as keyof typeof HelmSpecial];
                        if (parsed === undefined) {
                            continue;
                        }
                        helm = parsed;
                    } else {
                        const parsed = CapeSpecial[selection as keyof typeof CapeSpecial];
                        if (parsed === undefined) {
                            continue;
                        }
                        cape = parsed;
                    }
                }

                Core.bankingBlackList.push(item.name);
                const itemID = item.id;
                Core.unbank(itemID);
                item = bot.inventory.items.find((candidate) => candidate.id === itemID) ?? null;
                if (item == null) {
                    Core.logger(
                        `${category} item ${index} - ${logName} [ID ${itemID}] could not be moved into inventory. Skipping.`,
                    );
                    continue;
                }

                Core.logger(
                    `Applying ${selection.replaceAll("_", " ")} to ${category} item ${index} - ${logName} [ID ${itemID}].`,
                );
                Adv.enhanceItem(item.name, type, {
                    cSpecial: cape,
                    hSpecial: helm,
                    wSpecial: weapon,
                    logging: true,
                    bypassDisableAutoEnhance: true,
                });
                const applied = bot.wait.forTrue(() => {
                    const updated = bot.inventory.items.find((candidate) => candidate.id === itemID) ?? null;
                    if (updated == null || updated.enhancementLevel <= 0) {
                        return false;
                    }
                    if (weapon !== WeaponSpecial.None) {
                        return Number(Core.getItemProperty<number>(updated, "ProcID")) === weapon;
                    }
                    if (helm !== HelmSpecial.None) {
                        return updated.enhancementPatternId === helm;
                    }
                    if (cape !== CapeSpecial.None) {
                        return updated.enhancementPatternId === cape;
                    }
                    return updated.enhancementPatternId === type;
                }, 10);

                if (applied) {
                    Core.logger(
                        `Verified ${category} item ${index} - ${logName} [ID ${itemID}]. The item remains in inventory.`,
                    );
                } else {
                    Core.logger(
                        `Could not verify the selected enhancement for ${category} item ${index} - ${logName} [ID ${itemID}]. Check the Core enhancement logs.`,
                    );
                }
            }
        }

        Core.logger("Item enhancement pass finished.");
    }
}

export const scriptOptions = defineScriptOptions("ItemEnhancementPrototype", [], true, {
    Weapon: ItemEnhancementManager.weapon,
    Helm: ItemEnhancementManager.helm,
    Cape: ItemEnhancementManager.cape,
    Skip_Options: ItemEnhancementManager.skip_Options,
});

export default function main(): void {
    const script = new ItemEnhancementManager();
    if (!bot.config.get<boolean>("Skip_Options", Core.skipOptions.name)) {
        bot.config.configure();
    }
    if (bot.shouldExit) {
        return;
    }

    const groups: [string, ScriptOption[]][] = [
        ["Weapon", ItemEnhancementManager.weapon],
        ["Helm", ItemEnhancementManager.helm],
        ["Cape", ItemEnhancementManager.cape],
    ];
    const itemNames = groups
        .flatMap(([group, options]) =>
            options
                .filter((option) => option.kind === "text")
                .map((option) => (bot.config.get<string>(group, option.name) ?? "").trim()),
        )
        .filter((name) => name.length > 0);
    Core.bankingBlackList.push(...itemNames);
    Core.bankingBlackList.push(
        ...bot.inventory.items
            .filter((item) => itemNames.some((name) => item.name?.trim().toLowerCase() === name.toLowerCase()))
            .map((item) => item.name),
    );

    Core.setOptions(undefined, { disableClassSwap: true });
    try {
        script.run();
    } finally {
        Core.setOptions(false);
    }
}
