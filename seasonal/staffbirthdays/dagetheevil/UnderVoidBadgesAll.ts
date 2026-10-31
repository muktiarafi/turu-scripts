/*
name: (Badge) UnderVoid Badges
description: This will get all 4 bades in undervoid
tags: badge, undervoid, conquest victor, war victor, famine vitor, death victor
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/UnderVoidBadgesAll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../../core/CoreBots";
import { CoreDailies } from "../../../core/CoreDailies";
import { CoreDageBirthday } from "./CoreDageBirthday";

const Daily = new CoreDailies();
const Dage = new CoreDageBirthday();

export class UnderVoidBadgesAll {
    doAll(): void {
        this.conquestVictor();
        this.warVictor();
        this.famineVitor();
        this.deathVictor();
    }

    conquestVictor(): void {
        if (!Core.isSeasonalMapActive("undervoid")) {
            return;
        }

        Dage.undervoid();
        Core.equipClass(ClassType.Solo);
        Core.addDrop("Conquest's Pride");

        if (Core.hasWebBadge(this.badge1)) {
            Core.logger(`Already have the ${this.badge1} badge`);
            return;
        } else if (Daily.checkDailyv2(3411)) {
            Core.logger(`Doing UnderVoid Quest for ${this.badge1} badge`);
            Core.ensureAccept(3411);
            Core.huntMonster("undervoid", "Conquest", "Conquest Defeated");
            Core.ensureComplete(3411);
            if (Core.checkInventory("Conquest's Pride", 7)) {
                Core.chainComplete(3415);
            }
        }
    }

    warVictor(): void {
        if (!Core.isSeasonalMapActive("undervoid") || !Core.isCompletedBefore(3415)) {
            Core.logger(
                !Core.isSeasonalMapActive("undervoid")
                    ? `Map not Avaiable`
                    : `Quest Not Unlocked Yet. each Daily takes 7x the previou (wtf i know right)`,
            );
            return;
        }

        Dage.undervoid();
        Core.equipClass(ClassType.Solo);
        Core.addDrop("War's Pride");

        if (Core.hasWebBadge(this.badge2)) {
            Core.logger(`Already have the ${this.badge2} badge`);
            return;
        } else if (Daily.checkDailyv2(3412)) {
            Core.logger(`Doing UnderVoid Quest for ${this.badge2} badge`);
            Core.ensureAccept(3412);
            Core.huntMonster("undervoid", "War", "War Defeated");
            Core.ensureComplete(3412);

            if (Core.checkInventory("War's Pride", 7)) {
                Core.chainComplete(3416);
            }
        }
    }

    famineVitor(): void {
        if (!Core.isSeasonalMapActive("undervoid") || !Core.isCompletedBefore(3416)) {
            Core.logger(
                !Core.isSeasonalMapActive("undervoid")
                    ? `Map not Avaiable`
                    : `Quest Not Unlocked Yet. each Daily takes 7x the previou (wtf i know right)`,
            );
            return;
        }

        Dage.undervoid();
        Core.equipClass(ClassType.Solo);
        Core.addDrop("Famine's Pride");

        if (Core.hasWebBadge(this.badge3)) {
            Core.logger(`Already have the ${this.badge3} badge`);
            return;
        } else if (Daily.checkDailyv2(3413)) {
            Core.logger(`Doing UnderVoid Quest for ${this.badge3} badge`);
            Core.ensureAccept(3413);
            Core.huntMonster("undervoid", "Famine", "Famine Defeated");
            Core.ensureComplete(3413);

            if (Core.checkInventory("Famine's Pride", 7)) {
                Core.chainComplete(3417);
            }
        }
    }

    deathVictor(): void {
        if (!Core.isSeasonalMapActive("undervoid") || !Core.isCompletedBefore(3417)) {
            Core.logger(
                !Core.isSeasonalMapActive("undervoid")
                    ? `Map not Avaiable`
                    : `Quest Not Unlocked Yet. each Daily takes 7x the previou (wtf i know right)`,
            );
            return;
        }

        Dage.undervoid();
        Core.equipClass(ClassType.Solo);
        Core.addDrop("Death's Pride");

        if (Core.hasWebBadge(this.badge4)) {
            Core.logger(`Already have the ${this.badge4} badge`);
            return;
        } else if (Daily.checkDailyv2(3414)) {
            Core.logger(`Doing UnderVoid Quest for ${this.badge4} badge`);
            Core.ensureAccept(3414);
            Core.huntMonster("undervoid", "Death", "Death Defeated");
            Core.ensureComplete(3414);

            if (Core.checkInventory("Death's Pride", 7)) {
                Core.chainComplete(3418);
            }
        }
    }

    private readonly badge1 = "Conquest Victor";
    private readonly badge2 = "War Victor";
    private readonly badge3 = "Famine Victor";
    private readonly badge4 = "Death Victor";
}

export default function main(): void {
    const script = new UnderVoidBadgesAll();
    Core.setOptions();

    script.doAll();

    Core.setOptions(false);
}
