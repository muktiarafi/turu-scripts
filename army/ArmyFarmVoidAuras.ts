/*
name: Army Farm Void Auras
description: Solo-farms Void Auras using custom NSoD-style methods so army sync can be added later without modifying CoreNSOD.
tags: void aura, nsoD, farm, solo, army
*/
// Port of Scripts/Army/ArmyFarmVoidAuras.cs: a logged skip. It builds on the Ultras' engine, army helpers and enhancements, which aren't ported:
//   Ultrasv3/DependenciesUltras/CoreEnginev3.cs
//   Ultrasv3/DependenciesUltras/CoreUltrav3.cs
//   Ultrasv3/DependenciesUltras/UltraGeneral.cs
//   Ultrasv3/DependenciesUltras/UltraEnhancements.cs
//   Ultrasv3/ArmyDependencies/ArmyGeneral.cs

import { Core } from "../core/CoreBots";

export default function main(): void {
    Core.logger(
        "This script runs on the Ultras' engine and army helpers (Scripts/Ultrasv3), which Turu doesn't port. Skipping.",
    );
}
