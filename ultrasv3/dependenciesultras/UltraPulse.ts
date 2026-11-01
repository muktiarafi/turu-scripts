/*
name: UltraPulse
description: 5-second wall-clock pulse generator for Ultra taunt systems.
tags: ultra, pulse, taunt
*/
// Port of Scripts/Ultrasv3/DependenciesUltras/UltraPulse.cs.
//
// Turu: times are Unix milliseconds (C#'s `DateTime`).

export class UltraPulse {
    static currentPulse(fightStart: number, pulseIntervalSec = 5): number {
        return Math.trunc((Date.now() - fightStart) / 1000 / pulseIntervalSec);
    }
}
