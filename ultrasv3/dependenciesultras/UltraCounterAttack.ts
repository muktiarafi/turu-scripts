/*
name: UltraCounterAttack
description: Detects the "Counter Attack" aura (4s) via ExtensionPacketReceived.
             Stops attacking immediately and resumes via a 4s timer when the aura expires.
             No messenger dependency — purely aura-based.
tags: ultra, counter, attack
*/
// Port of Scripts/Ultrasv3/DependenciesUltras/UltraCounterAttack.cs.
//
// Turu: the 4 s resume timer (C#'s `Task.Run` with `Task.Delay`) is a task of core/CoreTasks.ts.

import { bot, type EventMap } from "turu";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { tasks } from "../../core/CoreTasks";

/** The resume timer's task (C#'s `_timerCts`). */
const TIMER_TASK = "UltraCounterAttackTimer";

export class UltraCounterAttack {
    private static _enabled = false;
    private static _counterActive = false;
    private static _savedTarget: string | null = null;

    /**
     * Enables Counter Attack handling. Listens for the "Counter Attack" aura on
     * every server packet. On aura appeared → StopAttacking + 4s timer.
     * On timer expiry → resume attacking. The aura fade is NOT used for resume
     * because CancelTarget (triggered by StopAttacking) wipes the target, making
     * consecutive aura checks unreliable. The 4s timer is the source of truth.
     */
    static enable(): void {
        if (UltraCounterAttack._enabled) {
            return;
        }

        UltraCounterAttack._enabled = true;
        UltraCounterAttack._counterActive = false;
        UltraCounterAttack._savedTarget = null;
        tasks.cancel(TIMER_TASK);

        bot.events.on("extensionPacket", UltraCounterAttack.onExtensionPacket);

        Core.logger("[UltraCounterAttack] Enabled.");
    }

    /** Disables Counter Attack handling, unsubscribes listeners, and cleans up state. */
    static disable(): void {
        if (!UltraCounterAttack._enabled) {
            return;
        }

        UltraCounterAttack._enabled = false;
        UltraCounterAttack._counterActive = false;
        UltraCounterAttack._savedTarget = null;

        tasks.cancel(TIMER_TASK);

        bot.events.off("extensionPacket", UltraCounterAttack.onExtensionPacket);
        bot.combat.stopAttacking = false;

        Core.logger("[UltraCounterAttack] Disabled.");
    }

    /**
     * Fires on every server packet. Detects the "Counter Attack" aura (4s reflect).
     * On first sight of the aura → stop attacking + 4s timer.
     * When the aura is not visible (target wiped by CancelTarget) → just reset flag
     * so the next Counter Attack is detected. The 4s timer handles the resume.
     */
    private static onExtensionPacket = (_packet: EventMap["extensionPacket"]): void => {
        try {
            const auraNow =
                bot.player?.alive === true &&
                bot.player.hasTarget &&
                bot.target?.auras?.some((a) => a != null && a.name === "Counter Attack") === true;

            if (auraNow && !UltraCounterAttack._counterActive) {
                UltraCounterAttack.startCounterAttackTimer("aura");
            } else if (!auraNow && UltraCounterAttack._counterActive) {
                // Target likely wiped by CancelTarget — just reset the flag so the
                // next Counter Attack is detected. The 4s timer handles the resume.
                UltraCounterAttack._counterActive = false;
            }
        } catch (error) {
            rethrowIfStopped(error);
        }
    };

    /**
     * Sets StopAttacking = true, saves the target name, and fires a background
     * Task that resumes attacking after 4 seconds. No messenger interaction.
     */
    private static startCounterAttackTimer(source: string): void {
        UltraCounterAttack._counterActive = true;
        UltraCounterAttack._savedTarget = bot.player.target?.name ?? null;
        bot.combat.stopAttacking = true;
        Core.logger(`[UltraCounterAttack] Counter Attack aura detected (${source}) — stopping attacks for 4s.`);

        // Replaces (cancels) a running timer, as C# cancels `_timerCts`.
        tasks.start(TIMER_TASK, function* () {
            yield 4000;

            bot.combat.stopAttacking = false;
            if (UltraCounterAttack._savedTarget?.trim()) {
                bot.combat.attack(UltraCounterAttack._savedTarget);
            }
            UltraCounterAttack._savedTarget = null;
            Core.logger("[UltraCounterAttack] Counter Attack window expired — resuming attacks.");
        });
    }

    /** Whether Counter Attack handling is currently enabled. */
    static get isEnabled(): boolean {
        return UltraCounterAttack._enabled;
    }

    /** Whether a Counter Attack is currently active (attacks are being stopped). */
    static get isActive(): boolean {
        return UltraCounterAttack._counterActive;
    }
}
