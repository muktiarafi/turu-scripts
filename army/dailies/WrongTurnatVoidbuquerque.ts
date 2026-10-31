/*
name: WrongTurnatVoidbuquerque
description: `wrong turn at voidbuquerque` quest with an army.
tags: nation, wrong turn at voidbuquerque, WrongTurnatVoidbuquerque
*/
// Port of Scripts/Army/Dailies/WrongTurnatVoidbuquerque.cs: a logged skip. It fights with the Ultras engine, which isn't ported:
//   Ultrasv3/Entwined Eclipse/CoreEngine.cs
//   Ultrasv3/Entwined Eclipse/CoreUltra.cs

import { Core } from "../../core/CoreBots";

export default function main(): void {
    Core.logger("This script runs on the Ultras' combat engine (Scripts/Ultrasv3), which Turu doesn't port. Skipping.");
}
