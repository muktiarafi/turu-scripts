/*
name: null
description: null
tags: null
*/
// Port of Scripts/Ultrasv3/ArmyDependencies/ArmyGeneral.cs.

import { type Bot, bot as theBot } from "turu";
import { rethrowIfStopped } from "../../core/CoreBots";
import { type CoreUltrav3, lineTime, nowSeconds } from "../dependenciesultras/CoreUltrav3";
import { UltraGeneral } from "../dependenciesultras/UltraGeneral";

export class ArmyGeneral {
    static prepareSyncFiles(
        ultra: CoreUltrav3,
        auraSyncFile: string,
        essenceNames: string[],
        essenceSyncPrefix: string,
    ): void {
        if (ultra == null || !auraSyncFile?.trim() || essenceNames == null) return;

        try {
            ultra.clearSyncFile(ultra.resolveSyncPath(auraSyncFile));
        } catch (error) {
            rethrowIfStopped(error);
        }

        for (const essence of essenceNames.filter((e) => !!e?.trim())) {
            try {
                ultra.clearSyncFile(ultra.resolveSyncPath(ArmyGeneral.getSyncFileForItem(essenceSyncPrefix, essence)));
            } catch (error) {
                rethrowIfStopped(error);
            }
        }
    }

    static getSyncFileForItem(prefix: string, itemName: string): string {
        if (!prefix?.trim() || !itemName?.trim()) return "";

        const safeName = normalizeToFileName(itemName);
        return prefix.toLowerCase().endsWith(".sync")
            ? prefix.replaceAll(".sync", `_${safeName}.sync`)
            : `${prefix}_${safeName}.sync`;
    }

    static prepareClassSync(ultra: CoreUltrav3, bot: Bot, armySize: number, syncFilePath: string): void {
        if (ultra == null || armySize < 1 || !syncFilePath?.trim()) return;

        UltraGeneral.equipUltraDailyPresetClassesSafe(ultra, bot, syncFilePath, armySize);
    }

    static prepareStageSync(ultra: CoreUltrav3, syncFilePath: string): void {
        if (ultra == null || !syncFilePath?.trim()) return;

        try {
            ultra.clearSyncFile(ultra.resolveSyncPath(syncFilePath));
        } catch (error) {
            rethrowIfStopped(error);
        }
    }

    static isFullArmyActive(ultra: CoreUltrav3, syncFilePath: string, armySize: number): boolean {
        if (ultra == null || !syncFilePath?.trim() || armySize < 1) return false;

        const syncFile = ultra.resolveSyncPath(syncFilePath);
        const lines = ultra.readLines(syncFile);
        const now = nowSeconds();
        const staleThreshold = 600;
        let activeMembers = 0;

        for (const line of lines) {
            const parts = line.split(":");
            if (parts.length < 5) continue;

            const ts = lineTime(parts);
            if (ts == null) continue;

            if (now - ts > staleThreshold) continue;

            activeMembers++;
        }

        return activeMembers >= armySize;
    }

    static publishAndGetArmyStage(
        ultra: CoreUltrav3,
        _bot: Bot,
        ownStage: number,
        syncFilePath: string,
        armySize: number,
    ): number {
        if (ultra == null || !syncFilePath?.trim() || armySize < 1) return ownStage;

        const syncFile = ultra.resolveSyncPath(syncFilePath);
        const username = theBot.player.username;
        if (!username?.trim()) return ownStage;

        const key = username.replaceAll(":", "-");
        ultra.updateEntry(syncFile, key, String(ownStage));

        const lines = ultra.readLines(syncFile);
        const now = nowSeconds();
        const staleThreshold = 600;
        let minStage = ownStage;
        let activeMembers = 0;

        for (const line of lines) {
            const parts = line.split(":");
            if (parts.length < 3) continue;

            if (!/^-?\d+$/.test(parts[1])) continue;
            const stage = Number(parts[1]);
            const ts = lineTime(parts);
            if (ts == null) continue;

            if (now - ts > staleThreshold) continue;

            activeMembers++;
            minStage = Math.min(minStage, stage);
        }

        if (activeMembers < armySize) {
            // Not all army members have published their current stage yet.
            // Stay on the earliest possible stage until the full army is registered.
            minStage = 0;
        }

        return minStage;
    }
}

function normalizeToFileName(input: string): string {
    if (!input?.trim()) return "";

    let cleaned = "";
    for (const c of input) {
        // C#'s char.IsLetterOrDigit and char.IsWhiteSpace (Unicode).
        if (/[\p{L}\p{Nd}_-]/u.test(c)) cleaned += c;
        else if (/\s/.test(c) || c === "." || c === "," || c === "'" || c === '"') cleaned += "_";
    }

    const result = cleaned.replace(/^_+|_+$/g, "");
    return result || "item";
}
