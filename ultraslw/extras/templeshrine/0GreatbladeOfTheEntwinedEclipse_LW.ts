/*
name: Greatblade of the Entwined Eclipse LW
description: Coordinates four accounts through the Temple Shrine dungeons and merges the Greatblade.
tags: temple shrine, dungeon, army, corelonewolf, master
*/
// Port of Extras/TempleShrine/0GreatbladeOfTheEntwinedEclipse_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../../../core/CoreBots";
import { CoreLoneWolf } from "../../CoreLoneWolf";
import { ArmyComposition as AscendEclipse_LWArmyComposition, AscendEclipse_LW } from "./AscendEclipse_LW";
import { ArmyComposition as MidnightSun_LWArmyComposition, MidnightSun_LW } from "./MidnightSun_LW";
import { ArmyComposition as SolsticeMoon_LWArmyComposition, SolsticeMoon_LW } from "./SolsticeMoon_LW";
import { ArmyComposition, VictorMatsuriMaskado_LW } from "./VictorMatsuriMaskado_LW";

const LoneWolf = new CoreLoneWolf();

export class GreatbladeOfTheEntwinedEclipse_LW {
    private static readonly logPrefix = "Greatblade Entwined Eclipse LW";
    private static readonly syncFileName = "0GreatbladeOfTheEntwinedEclipse_LW.sync";
    private static readonly mergeMap = "templeshrine";
    private static readonly mergeShopId = 2303;

    private static readonly victor = "Victor of the Festival";
    private static readonly rite = "Rite of Ascension";
    private static readonly sunlight = "Sliver of Sunlight";
    private static readonly moonlight = "Sliver of Moonlight";
    private static readonly eclipticOffering = "Ecliptic Offering";

    private static readonly solarbrand = "Solarbrand";
    private static readonly lunarbrand = "Lunarbrand";
    private static readonly umbrabrand = "Umbrabrand";
    private static readonly burningSun = "Blade of the Burning Sun";
    private static readonly glowingMoon = "Blade of the Glowing Moon";
    private static readonly boundEclipse = "Blade of the Bound Eclipse";
    private static readonly midnightGreatblade = "Greatblade of the Midnight Sun";
    private static readonly solsticeGreatblade = "Greatblade of the Solstice Moon";
    private static readonly entwinedGreatblade = "Greatblade of the Entwined Eclipse";

    private static readonly riteShopItemId = 10741;
    private static readonly solarbrandShopItemId = 10744;
    private static readonly lunarbrandShopItemId = 10745;
    private static readonly umbrabrandShopItemId = 10746;
    private static readonly burningSunShopItemId = 10747;
    private static readonly glowingMoonShopItemId = 10748;
    private static readonly boundEclipseShopItemId = 10749;
    private static readonly midnightGreatbladeShopItemId = 10750;
    private static readonly solsticeGreatbladeShopItemId = 10751;
    private static readonly entwinedGreatbladeShopItemId = 10752;

    private playerAlias: string = "";
    private buybackMethod: boolean = false;

    static readonly setup = [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
        option.bool("UseEnhancements", "Use Enhancements", "Prepare the assigned enhancement loadouts.", true),
        option.bool("UsePotions", "Use Potions", "Prepare and use the assigned potion loadouts.", true),
    ];

    static readonly temple_Shrine = [
        option.choice(
            "VictorMatsuriComposition",
            "Victor Matsuri Composition",
            "Default: LR / SC / AP / LOO\nStable: VDK / SC / AP / LOO",
            choices(ArmyComposition),
            ArmyComposition.Default,
        ),
        option.choice(
            "MidnightSunComposition",
            "Midnight Sun Composition",
            "Default: LR / SC / AP / LOO\nStable: VDK / SC / AP / LOO\nReliable: Shaman / SC / AP / LOO\nPay2Win: Guardian / AP / LR / LOO",
            choices(MidnightSun_LWArmyComposition),
            MidnightSun_LWArmyComposition.Default,
        ),
        option.choice(
            "SolsticeMoonComposition",
            "Solstice Moon Composition",
            "Default: LR / SC / AP / LOO\nStable: VDK / SC / AP / LOO\nReliable: Shaman / SC / AP / LOO\nPay2Win: Guardian / AP / LR / LOO",
            choices(SolsticeMoon_LWArmyComposition),
            SolsticeMoon_LWArmyComposition.Default,
        ),
        option.choice(
            "AscendEclipseComposition",
            "Ascend Eclipse Composition",
            "Default: LR / SC / AP / LOO\nStable: VDK / SC / AP / LOO\nPay2Win: Guardian / AP / LR / LOO",
            choices(AscendEclipse_LWArmyComposition),
            AscendEclipse_LWArmyComposition.Default,
        ),
        option.bool(
            "BuybackMethod",
            "Buyback Method?",
            "Farm 155 of every raw material on all four accounts without merging the Greatblade.",
            false,
        ),
    ];

    run(): void {
        const privateRoomNumber = bot.config!.get<number>("Setup", "PrivateRoomNumber");
        if (!LoneWolf.validatePrivateRoomNumber(privateRoomNumber)) {
            return;
        }

        if (!LoneWolf.startArmySync(GreatbladeOfTheEntwinedEclipse_LW.syncFileName, 4, "Setup")) {
            return;
        }

        if (!LoneWolf.validateHouseRequirements()) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        this.buybackMethod = bot.config.get<boolean>("Temple_Shrine", "BuybackMethod");
        this.registerDrops();

        Core.logger(
            `${GreatbladeOfTheEntwinedEclipse_LW.logPrefix} started as ${this.playerAlias} using the ${this.buybackMethod ? "Buyback" : "automatic Greatblade"} method.`,
        );

        if (!this.prepareRiteOfAscension()) {
            return;
        }

        const sunlightTarget = this.buybackMethod ? 155 : 215;
        const moonlightTarget = this.buybackMethod ? 155 : 215;
        const midnightSun = new MidnightSun_LW();
        const solsticeMoon = new SolsticeMoon_LW();
        const ascendEclipse = new AscendEclipse_LW();

        if (
            !this.farmMaterial(
                GreatbladeOfTheEntwinedEclipse_LW.sunlight,
                sunlightTarget,
                "SUNLIGHT_READY",
                "SUNLIGHT",
                midnightSun.runOnceFromMaster.bind(midnightSun),
                undefined,
                midnightSun.startFromMaster.bind(midnightSun),
                midnightSun.stopFromMaster.bind(midnightSun),
            ) ||
            !this.farmMaterial(
                GreatbladeOfTheEntwinedEclipse_LW.moonlight,
                moonlightTarget,
                "MOONLIGHT_READY",
                "MOONLIGHT",
                solsticeMoon.runOnceFromMaster.bind(solsticeMoon),
                undefined,
                solsticeMoon.startFromMaster.bind(solsticeMoon),
                solsticeMoon.stopFromMaster.bind(solsticeMoon),
            ) ||
            !this.farmMaterial(
                GreatbladeOfTheEntwinedEclipse_LW.eclipticOffering,
                155,
                "ECLIPTIC_READY",
                "ECLIPTIC",
                ascendEclipse.runOnceFromMaster.bind(ascendEclipse),
                undefined,
                ascendEclipse.startFromMaster.bind(ascendEclipse),
                ascendEclipse.stopFromMaster.bind(ascendEclipse),
            )
        ) {
            return;
        }

        if (this.buybackMethod) {
            if (!this.sync("BUYBACK_MATERIALS_READY")) {
                return;
            }

            Core.logger(
                `${GreatbladeOfTheEntwinedEclipse_LW.logPrefix} ${this.playerAlias} reached 155 ${GreatbladeOfTheEntwinedEclipse_LW.sunlight}, ${GreatbladeOfTheEntwinedEclipse_LW.moonlight}, and ${GreatbladeOfTheEntwinedEclipse_LW.eclipticOffering}.`,
            );
            this.stopArmy("BUYBACK_COMPLETE");
            return;
        }

        if (!this.sync("MATERIALS_READY")) {
            return;
        }

        const mergeSucceeded =
            this.owns(GreatbladeOfTheEntwinedEclipse_LW.entwinedGreatblade) || this.mergeGreatblade();
        if (!mergeSucceeded) {
            LoneWolf.sendArmySignal("GREATBLADE_FAILURE");
        } else {
            LoneWolf.sendArmySignal("GREATBLADE_READY");
        }

        if (!this.sync("GREATBLADE_RESULT")) {
            return;
        }

        if (this.anyPlayerSignaled("GREATBLADE_FAILURE")) {
            this.armyFailure("At least one player could not merge the Greatblade of the Entwined Eclipse.");
            return;
        }

        if (!this.allPlayersSignaled("GREATBLADE_READY")) {
            this.armyFailure("Greatblade completion could not be confirmed for all four players.");
            return;
        }

        Core.logger(`${GreatbladeOfTheEntwinedEclipse_LW.logPrefix} every player completed the Greatblade workflow.`);
        this.stopArmy("GREATBLADE_COMPLETE");
    }

    private prepareRiteOfAscension(): boolean {
        this.refreshBank();

        const needsRite = !this.owns(GreatbladeOfTheEntwinedEclipse_LW.rite);
        if (!needsRite && !LoneWolf.sendArmySignal("RITE_ALREADY_OWNED")) {
            return false;
        }

        if (!this.sync("RITE_STATUS_REPORTED")) {
            return false;
        }

        if (!this.allPlayersSignaled("RITE_ALREADY_OWNED")) {
            if (!new VictorMatsuriMaskado_LW().runFromMaster()) {
                LoneWolf.sendArmySignal("VICTOR_FAILURE");
            }

            this.refreshBank();

            if (needsRite && !this.owns(GreatbladeOfTheEntwinedEclipse_LW.victor)) {
                LoneWolf.sendArmySignal("VICTOR_FAILURE");
            }

            if (!this.sync("VICTOR_RESULT")) {
                return false;
            }

            if (this.anyPlayerSignaled("VICTOR_FAILURE")) {
                return this.armyFailure(
                    "Victor of the Festival could not be obtained for every player that needs a Rite of Ascension.",
                );
            }

            if (
                !this.farmMaterial(
                    GreatbladeOfTheEntwinedEclipse_LW.sunlight,
                    1,
                    "RITE_SUNLIGHT_READY",
                    "RITE_SUNLIGHT",
                    () => new MidnightSun_LW().runFromMaster(),
                    needsRite,
                ) ||
                !this.farmMaterial(
                    GreatbladeOfTheEntwinedEclipse_LW.moonlight,
                    1,
                    "RITE_MOONLIGHT_READY",
                    "RITE_MOONLIGHT",
                    () => new SolsticeMoon_LW().runFromMaster(),
                    needsRite,
                )
            ) {
                return false;
            }

            const riteMerged = !needsRite || this.mergeRite();
            if (!riteMerged) {
                LoneWolf.sendArmySignal("RITE_FAILURE");
            } else {
                LoneWolf.sendArmySignal("RITE_READY");
            }

            if (!this.sync("RITE_MERGE_RESULT")) {
                return false;
            }

            if (this.anyPlayerSignaled("RITE_FAILURE")) {
                return this.armyFailure("Rite of Ascension could not be merged for every required player.");
            }
        } else if (!LoneWolf.sendArmySignal("RITE_READY")) {
            return false;
        }

        if (!this.moveToInventory(GreatbladeOfTheEntwinedEclipse_LW.rite, 1)) {
            LoneWolf.sendArmySignal("RITE_INVENTORY_FAILURE");
        } else {
            LoneWolf.sendArmySignal("RITE_INVENTORY_READY");
        }

        if (!this.sync("RITE_INVENTORY_RESULT")) {
            return false;
        }

        if (this.anyPlayerSignaled("RITE_INVENTORY_FAILURE")) {
            return this.armyFailure("Rite of Ascension could not be moved into every player's inventory.");
        }

        if (!this.allPlayersSignaled("RITE_INVENTORY_READY")) {
            return this.armyFailure(
                "Rite of Ascension inventory readiness could not be confirmed for all four players.",
            );
        }

        return true;
    }

    private farmMaterial(
        itemName: string,
        targetQuantity: number,
        readySignal: string,
        phaseName: string,
        runDungeon: () => boolean,
        localRequired = true,
        startDungeon: (() => boolean) | null = null,
        stopDungeon: (() => void) | null = null,
    ): boolean {
        let readyReported = false;
        let startAttempted = false;
        let cycle = 0;

        try {
            while (!bot.shouldExit) {
                this.refreshBank();

                const quantity = this.totalQuantity(itemName);
                if ((!localRequired || quantity >= targetQuantity) && !readyReported) {
                    if (!LoneWolf.sendArmySignal(readySignal)) {
                        return false;
                    }

                    readyReported = true;
                    Core.logger(
                        `${GreatbladeOfTheEntwinedEclipse_LW.logPrefix} ${this.playerAlias} is ready with ${quantity}/${targetQuantity} ${itemName}.`,
                    );
                }

                if (!this.sync(`${phaseName}_${cycle}_STATUS`)) {
                    return false;
                }

                if (this.allPlayersSignaled(readySignal)) {
                    return true;
                }

                if (!startAttempted && startDungeon != null) {
                    startAttempted = true;
                    if (!startDungeon()) {
                        return false;
                    }
                }

                const runSucceeded = runDungeon();
                if (!runSucceeded) {
                    LoneWolf.sendArmySignal(`${phaseName}_FAILURE`);
                }

                if (!this.sync(`${phaseName}_${cycle}_RUN`)) {
                    return false;
                }

                if (this.anyPlayerSignaled(`${phaseName}_FAILURE`)) {
                    return this.armyFailure(`The ${phaseName} dungeon run failed on at least one player.`);
                }

                cycle++;
            }

            return false;
        } finally {
            if (startAttempted) {
                stopDungeon?.();
            }
        }
    }

    private mergeRite(): boolean {
        if (
            !this.moveToInventory(GreatbladeOfTheEntwinedEclipse_LW.victor, 1) ||
            !this.moveToInventory(GreatbladeOfTheEntwinedEclipse_LW.sunlight, 1) ||
            !this.moveToInventory(GreatbladeOfTheEntwinedEclipse_LW.moonlight, 1)
        ) {
            return this.localFailure("The Rite of Ascension ingredients could not be moved into inventory.");
        }

        Core.buyItem(
            GreatbladeOfTheEntwinedEclipse_LW.mergeMap,
            GreatbladeOfTheEntwinedEclipse_LW.mergeShopId,
            GreatbladeOfTheEntwinedEclipse_LW.rite,
            1,
            GreatbladeOfTheEntwinedEclipse_LW.riteShopItemId,
        );
        if (!this.owns(GreatbladeOfTheEntwinedEclipse_LW.rite)) {
            return this.localFailure("Rite of Ascension could not be merged.");
        }

        Core.logger(
            `${GreatbladeOfTheEntwinedEclipse_LW.logPrefix} ${this.playerAlias} merged ${GreatbladeOfTheEntwinedEclipse_LW.rite}.`,
        );
        return true;
    }

    private mergeGreatblade(): boolean {
        if (
            !this.ensureSolarbrand() ||
            !this.mergeItem(
                GreatbladeOfTheEntwinedEclipse_LW.burningSun,
                GreatbladeOfTheEntwinedEclipse_LW.burningSunShopItemId,
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.solarbrand, 1),
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.sunlight, 50),
            ) ||
            !this.mergeItem(
                GreatbladeOfTheEntwinedEclipse_LW.midnightGreatblade,
                GreatbladeOfTheEntwinedEclipse_LW.midnightGreatbladeShopItemId,
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.burningSun, 1),
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.sunlight, 100),
            ) ||
            !this.ensureLunarbrand() ||
            !this.mergeItem(
                GreatbladeOfTheEntwinedEclipse_LW.glowingMoon,
                GreatbladeOfTheEntwinedEclipse_LW.glowingMoonShopItemId,
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.lunarbrand, 1),
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.moonlight, 50),
            ) ||
            !this.mergeItem(
                GreatbladeOfTheEntwinedEclipse_LW.solsticeGreatblade,
                GreatbladeOfTheEntwinedEclipse_LW.solsticeGreatbladeShopItemId,
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.glowingMoon, 1),
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.moonlight, 100),
            ) ||
            !this.ensureSolarbrand() ||
            !this.mergeItem(
                GreatbladeOfTheEntwinedEclipse_LW.burningSun,
                GreatbladeOfTheEntwinedEclipse_LW.burningSunShopItemId,
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.solarbrand, 1),
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.sunlight, 50),
            ) ||
            !this.ensureLunarbrand() ||
            !this.mergeItem(
                GreatbladeOfTheEntwinedEclipse_LW.glowingMoon,
                GreatbladeOfTheEntwinedEclipse_LW.glowingMoonShopItemId,
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.lunarbrand, 1),
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.moonlight, 50),
            ) ||
            !this.ensureUmbrabrand() ||
            !this.mergeItem(
                GreatbladeOfTheEntwinedEclipse_LW.boundEclipse,
                GreatbladeOfTheEntwinedEclipse_LW.boundEclipseShopItemId,
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.burningSun, 1),
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.glowingMoon, 1),
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.umbrabrand, 1),
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.eclipticOffering, 50),
            ) ||
            !this.mergeItem(
                GreatbladeOfTheEntwinedEclipse_LW.entwinedGreatblade,
                GreatbladeOfTheEntwinedEclipse_LW.entwinedGreatbladeShopItemId,
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.boundEclipse, 1),
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.solsticeGreatblade, 1),
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.midnightGreatblade, 1),
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.eclipticOffering, 100),
            )
        ) {
            return false;
        }

        return this.owns(GreatbladeOfTheEntwinedEclipse_LW.entwinedGreatblade);
    }

    private ensureSolarbrand(): boolean {
        return this.mergeItem(
            GreatbladeOfTheEntwinedEclipse_LW.solarbrand,
            GreatbladeOfTheEntwinedEclipse_LW.solarbrandShopItemId,
            GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.sunlight, 5),
        );
    }

    private ensureLunarbrand(): boolean {
        return this.mergeItem(
            GreatbladeOfTheEntwinedEclipse_LW.lunarbrand,
            GreatbladeOfTheEntwinedEclipse_LW.lunarbrandShopItemId,
            GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.moonlight, 5),
        );
    }

    private ensureUmbrabrand(): boolean {
        if (this.owns(GreatbladeOfTheEntwinedEclipse_LW.umbrabrand)) {
            return true;
        }

        return (
            this.ensureSolarbrand() &&
            this.ensureLunarbrand() &&
            this.mergeItem(
                GreatbladeOfTheEntwinedEclipse_LW.umbrabrand,
                GreatbladeOfTheEntwinedEclipse_LW.umbrabrandShopItemId,
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.solarbrand, 1),
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.lunarbrand, 1),
                GreatbladeOfTheEntwinedEclipse_LW.requirement(GreatbladeOfTheEntwinedEclipse_LW.eclipticOffering, 5),
            )
        );
    }

    private mergeItem(outputName: string, shopItemId: number, ...requirements: MergeRequirement[]): boolean {
        if (this.owns(outputName)) {
            Core.logger(
                `${GreatbladeOfTheEntwinedEclipse_LW.logPrefix} ${this.playerAlias} already owns ${outputName}.`,
            );
            return true;
        }

        for (const requirement of requirements) {
            if (!this.moveToInventory(requirement.name, requirement.quantity)) {
                return this.localFailure(
                    `${outputName} could not be merged because ${requirement.name} x${requirement.quantity} is unavailable in inventory.`,
                );
            }
        }

        Core.buyItem(
            GreatbladeOfTheEntwinedEclipse_LW.mergeMap,
            GreatbladeOfTheEntwinedEclipse_LW.mergeShopId,
            outputName,
            1,
            shopItemId,
        );
        if (!this.owns(outputName)) {
            return this.localFailure(`${outputName} could not be merged.`);
        }

        Core.logger(`${GreatbladeOfTheEntwinedEclipse_LW.logPrefix} ${this.playerAlias} merged ${outputName}.`);
        return true;
    }

    private moveToInventory(itemName: string, quantity: number): boolean {
        if (bot.inventory.getQuantity(itemName) >= quantity) {
            return true;
        }

        this.refreshBank();
        if (this.totalQuantity(itemName) < quantity) {
            return false;
        }

        if (!Core.hasSpaceFor(bot.bank.getItem(itemName))) {
            return false;
        }

        bot.bank.ensureToInventory(itemName);
        return bot.wait.forTrue(() => bot.inventory.getQuantity(itemName) >= quantity, 20);
    }

    private refreshBank(): void {
        if (bot.flash.get<string>("ui.mcPopup.currentLabel") !== "Bank") {
            bot.bank.open();
        }

        bot.bank.load(false);
        bot.wait.forBankLoad(20);
    }

    private totalQuantity(itemName: string): number {
        return bot.inventory.getQuantity(itemName) + bot.bank.getQuantity(itemName);
    }

    private owns(itemName: string): boolean {
        return bot.inventory.contains(itemName) || bot.bank.contains(itemName);
    }

    private registerDrops(): void {
        bot.drops.add(
            GreatbladeOfTheEntwinedEclipse_LW.sunlight,
            GreatbladeOfTheEntwinedEclipse_LW.moonlight,
            GreatbladeOfTheEntwinedEclipse_LW.eclipticOffering,
            "Midnight Moondrop",
            "Solstice Sundew",
            "Midnight's Shadow",
            "Solstice's Shadow",
        );
    }

    private sync(step: string): boolean {
        Core.logger(`${GreatbladeOfTheEntwinedEclipse_LW.logPrefix} ${this.playerAlias} entering ${step}.`);
        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${GreatbladeOfTheEntwinedEclipse_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private allPlayersSignaled(signal: string): boolean {
        for (let playerNumber = 1; playerNumber <= 4; playerNumber++) {
            if (!LoneWolf.hasArmySignal(signal, playerNumber)) {
                return false;
            }
        }

        return true;
    }

    private anyPlayerSignaled(signal: string): boolean {
        for (let playerNumber = 1; playerNumber <= 4; playerNumber++) {
            if (LoneWolf.hasArmySignal(signal, playerNumber)) {
                return true;
            }
        }

        return false;
    }

    private getPlayerAlias(): string {
        for (let playerNumber = 1; playerNumber <= 4; playerNumber++) {
            if (LoneWolf.isArmyPlayer(playerNumber)) {
                return `player${GreatbladeOfTheEntwinedEclipse_LW.numberWord(playerNumber)}`;
            }
        }

        return "playerUnknown";
    }

    private static numberWord(playerNumber: number): string {
        return playerNumber === 1
            ? "One"
            : playerNumber === 2
              ? "Two"
              : playerNumber === 3
                ? "Three"
                : playerNumber === 4
                  ? "Four"
                  : "Unknown";
    }

    private stopArmy(reason: string): void {
        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);
            LoneWolf.stopArmySync(reason);
            return;
        }

        LoneWolf.syncArmy("STOP_CHECK");
    }

    private armyFailure(message: string): boolean {
        Core.logger(message, GreatbladeOfTheEntwinedEclipse_LW.logPrefix, { messageBox: true, stopBot: true });
        return false;
    }

    private localFailure(message: string): boolean {
        Core.logger(message, GreatbladeOfTheEntwinedEclipse_LW.logPrefix);
        return false;
    }

    private static requirement(name: string, quantity: number): MergeRequirement {
        return new MergeRequirement(name, quantity);
    }
}

export class MergeRequirement {
    constructor(name: string, quantity: number) {
        this.name = name;
        this.quantity = quantity;
    }

    name!: string;
    quantity!: number;
}

export const scriptOptions = defineScriptOptions("0GreatbladeOfTheEntwinedEclipse_LW", [], true, {
    Setup: GreatbladeOfTheEntwinedEclipse_LW.setup,
    Temple_Shrine: GreatbladeOfTheEntwinedEclipse_LW.temple_Shrine,
});

export default function main(): void {
    const script = new GreatbladeOfTheEntwinedEclipse_LW();
    bot.skills.stop();
    bot.options.infiniteRange = true;
    LoneWolf.setAntiLag();
    bot.config?.configure();
    script.run();
}
