/*
name: Swag Token A
description: Farms Swag Token As with mem and non-mem methods
tags: swag token a, swag token b, swag token c, swag token d
*/
// Port of Scripts/Farm/SwagTokenA.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";

const Farm = new CoreFarms();

export class SwagTokenA {
    getToken(): void {
        Farm.swagTokenA();
    }
}

export default function main(): void {
    const script = new SwagTokenA();
    Core.bankingBlackList.push(
        "Super-Fan Swag Token A",
        "Super-Fan Swag Token B",
        "Super-Fan Swag Token C",
        "Super-Fan Swag Token D",
    );
    Core.setOptions();

    script.getToken();
    Core.setOptions(false);
}
