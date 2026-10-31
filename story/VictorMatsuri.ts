/*
name: Victor Matsuri
description: This script will complete the Empress Ai No Miko's questline in /victormatsuri.
tags: victor matsuri, victormatsuri, empress ai no miko,ai no miko,matsuri,victor,rite of ascension,rite,victor of the festival,eclipse
*/
// Port of Scripts/Story/VictorMatsuri.cs.

import { bot } from "turu";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../core/CoreAdvanced";
import { ClassType, Core, formatForCompare } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();
const Adv = new CoreAdvanced();

export class VictorMatsuri {
    // Flags for event-driven action
    private counterAttackTriggered = false;
    private lastCounterAttack: number = 0;

    storyline(merge = false): void {
        if (merge ? Core.isCompletedBefore(10292) : Core.isCompletedBefore(10295)) {
            return;
        }

        Story.preLoad(this.storyline);

        //#region Useable Monsters
        const UseableMonsters = [
            "Kitsune Himawari", // UseableMonsters[0],
            "NeOni", // UseableMonsters[1],
            "Narcis Arrhythmia", // UseableMonsters[2],
            "Haruki Matsuoka", // UseableMonsters[3],
            "Lady Laidronette", // UseableMonsters[4],
            "Masakado", // UseableMonsters[5]
        ];
        //#endregion Useable Monsters
        // 10290 | In Kuzunoha's Image
        if (!Story.questProgression(10290)) {
            Core.huntMonsterQuest(10290, ["victormatsuri", UseableMonsters[0], ClassType.Solo]);
        }

        // 10291 | NeOni Blue
        if (!Story.questProgression(10291)) {
            Core.huntMonsterQuest(10291, ["victormatsuri", UseableMonsters[1], ClassType.Solo]);
        }

        // 10292 | Embodiment of Scarlet
        if (!Story.questProgression(10292)) {
            Core.huntMonsterQuest(10292, ["victormatsuri", UseableMonsters[2], ClassType.Solo]);
        }

        if (merge) {
            return;
        }

        // 10293 | Onihitokuchi
        if (!Story.questProgression(10293)) {
            Core.huntMonsterQuest(10293, ["victormatsuri", UseableMonsters[3], ClassType.Solo]);
        }

        // 10294 | Tsukihime
        if (!Story.questProgression(10294)) {
            Core.huntMonsterQuest(10294, ["victormatsuri", UseableMonsters[4], ClassType.Solo]);
        }

        // 10295 | Kanmu Heishi
        if (!Story.questProgression(10295)) {
            Core.ensureAccept(10295);
            // Replace with actual message if different
            // C# passes `Requirements[0].ToString()` ("[ID]\t(Item) Name x1"), which no item
            // matches, so the kill loop never ends; the item is its name.
            this.killMasakado(
                "victormatsuri",
                "r8",
                "Left",
                "Masakado",
                ["Masakado prepares a counter attack!"],
                Core.ensureLoad(10295).requirements[0].name,
                1,
                Core.ensureLoad(10295).requirements[0].temp,
                true,
            );
            Core.ensureComplete(10295);
        }
    }

    killMasakado(
        map: string,
        cell: string,
        pad: string,
        monster: string,
        auraNames: string[],
        item: string | null = null,
        quant = 1,
        isTemp = false,
        log = true,
        ItemToUse = 0,
        SafeItem = 0,
    ): void {
        const AuraListener = (packet: any): void => {
            if (packet["params"]?.type !== "json") {
                return;
            }

            const data = packet["params"]?.dataObj;
            if (String(data == null || data?.cmd) !== "ct") {
                return;
            }
            const anims = data?.anims;
            if (anims == null) {
                return;
            }
            for (const a of anims) {
                const auraName = String(a?.["msg"]);

                if (!auraName || !auraNames.includes(auraName)) {
                    continue;
                }

                // Throttle cooldown
                if (Date.now() - lastAuraTrigger < auraCooldown) {
                    continue;
                }

                lastAuraTrigger = Date.now();

                // Set flag for main loop to handle
                this.counterAttackTriggered = true;
                this.lastCounterAttack = Date.now();

                break;
                // react to only one aura per packet
            }
        };
        const EquipRetry = (id: number): void => {
            Core.equip(id);
            bot.wait.forTrue(() => bot.inventory.isEquipped(id), 20);
            bot.sleep(2000);
            Core.equip(id);
            // Flash refresh workaround
            bot.sleep(2000);
        };
        // return if item already in inventory
        if (item != null && (isTemp ? bot.tempInv.contains(item, quant) : Core.checkInventory(item, quant))) {
            return;
        }

        // if Legion Revenant class not owned, log and return
        if (!Core.checkInventory("Legion Revenant")) {
            Core.logger("You need to own the Legion Revenant class to use this script.");
            return;
        }

        // Check for praxis only first (as it's the most important and 100% required)
        if (!Adv.uPraxis()) {
            Core.logger("You **HAVE** to have the Praxis enhancement to kill Masakado with this script.");
            return;
        }

        // Then check for penitence and pneuma
        if (!Adv.uPenitence() || !Adv.uPneuma()) {
            Core.logger(
                "You need to have the Penitence cape and Pneuma helm enhancements to kill Masakado with this script.",
            );
            return;
        }

        Adv.gearStore(undefined, { enhAfter: true });
        Core.equip("Legion Revenant");
        Adv.enhanceEquipped(EnhancementType.Wizard, {
            cSpecial: CapeSpecial.Penitence,
            hSpecial: HelmSpecial.Pneuma,
            wSpecial: WeaponSpecial.Praxis,
        });

        let lastAuraTrigger = 0;
        const auraCooldown = 0 * 1000;
        monster = formatForCompare(monster.trim());

        // Reset trigger flag
        this.counterAttackTriggered = false;
        this.lastCounterAttack = 0;

        bot.events.on("extensionPacket", AuraListener);

        //#region Setup Item Equip (optional)
        if (ItemToUse > 0) {
            const fallbackPotion = 1749;
            const equipSafe = SafeItem > 0 ? SafeItem : fallbackPotion;

            if (!Core.checkInventory(equipSafe)) {
                Adv.buyItem("embersea", 1100, fallbackPotion, 10, 1, 17966);
            }

            EquipRetry(equipSafe);
            Core.equip(ItemToUse);
        }
        //#endregion
        if (item == null) {
            if (log) {
                Core.logger(`Killing ${monster}`);
            }
            bot.kill.monster(monster);
        } else {
            if (!isTemp) {
                Core.addDrop(item);
            }
            if (log) {
                Core.farmingLogger(item, quant);
            }

            while (!bot.shouldExit && !Core.checkInventory(item, quant)) {
                while (!bot.shouldExit && !bot.player.alive) {
                    bot.sleep(500);
                }

                if (bot.map.name !== map) {
                    Core.join(map, cell, pad);
                }
                if (bot.player.cell !== cell) {
                    Core.jump(cell, pad);
                }

                if (!this.counterAttackTriggered) {
                    bot.combat.attack(monster);
                }
                bot.sleep(500);

                // Handle counter attack outside the listener
                if (this.counterAttackTriggered && (Date.now() - this.lastCounterAttack) / 1000 < 5) {
                    if (bot.player.target == null || bot.player.target.name !== "Masakado") {
                        bot.combat.attack("Masakado");
                    }
                    bot.sleep(1000);
                    bot.skills.useSkill(3);
                    bot.sleep(3000);
                    bot.skills.useSkill(3);
                    this.counterAttackTriggered = false;
                }

                if (
                    isTemp
                        ? bot.tempInv.contains(item, quant)
                        : bot.inventory.contains(item, quant) || bot.bank.contains(item, quant)
                ) {
                    break;
                }
            }
        }

        bot.events.off("extensionPacket", AuraListener);
        Adv.gearStore(true, { enhAfter: true });
    }
}

export default function main(): void {
    const script = new VictorMatsuri();
    Core.setOptions();

    script.storyline();

    Core.setOptions(false);
}
