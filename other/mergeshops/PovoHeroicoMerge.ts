/*
name: Povo Heroico Merge
description: Farms the Povo Heroico Merge [2620] in /povoheroico.
tags: povoheroico, merge, povo, heroico, merge
*/
// Port of Scripts/Other/MergeShops/PovoHeroicoMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class PovoHeroico {
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                return;
            }

            switch (req.name) {
                case "Cabelo do Meio-Dia":

                case "Corrente da Liberdade":

                case "Corrente do Sol":

                case "Correntes da Liberdade":

                case "Correntes do Sol":

                case "Corte do Meio-Dia":

                case "Face do Meio-Dia":

                case "Maxado de Assís":

                case "Moeda Real do Sol":

                case "Nascer do Sol":

                case "Olhar do Meio-Dia":

                case "Raios de Sol":

                case "Raios Fúlgidos":

                case "Runa do Sol da Liberdade":

                case "Símbolo do Sol da Liberdade":

                case "Sol da Liberdade":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("povoheroico", "Sol Da Liberdade", req.name, quant, { isTemp: req.temp });
                    break;
                default: {
                    const shouldStop = !Adv.matsOnly || !this.dontStopMissingIng;
                    Core.logger(`The bot hasn't been taught how to get ${req.name}.`, undefined, {
                        messageBox: shouldStop,
                        stopBot: shouldStop,
                    });
                    break;
                }
            }
        };
        Adv.startBuyAllMerge("povoheroico", 2620, findIngredients, buyOnlyThis, { buyMode });
    }

    static readonly select = [
        option.bool(
            "103081",
            "Sol Encantado da Liberdade",
            'Mode: [select] only\nShould the bot buy "Sol Encantado da Liberdade" ?',
            false,
        ),
        option.bool(
            "103089",
            "Maxado de Assís Encantado",
            'Mode: [select] only\nShould the bot buy "Maxado de Assís Encantado" ?',
            false,
        ),
        option.bool(
            "103086",
            "Raios de Sol Encantados",
            'Mode: [select] only\nShould the bot buy "Raios de Sol Encantados" ?',
            false,
        ),
        option.bool(
            "103087",
            "Símbolo Encantado do Sol da Liberdade",
            'Mode: [select] only\nShould the bot buy "Símbolo Encantado do Sol da Liberdade" ?',
            false,
        ),
        option.bool(
            "103093",
            "Correntes Encantadas da Liberdade",
            'Mode: [select] only\nShould the bot buy "Correntes Encantadas da Liberdade" ?',
            false,
        ),
        option.bool(
            "103095",
            "Correntes Encantadas do Sol",
            'Mode: [select] only\nShould the bot buy "Correntes Encantadas do Sol" ?',
            false,
        ),
        option.bool(
            "103090",
            "Raios Fúlgidos Encatados",
            'Mode: [select] only\nShould the bot buy "Raios Fúlgidos Encatados" ?',
            false,
        ),
        option.bool(
            "103091",
            "Nascer do Sol Encantado",
            'Mode: [select] only\nShould the bot buy "Nascer do Sol Encantado" ?',
            false,
        ),
        option.bool(
            "103082",
            "Olhar Encantado do Meio-Dia",
            'Mode: [select] only\nShould the bot buy "Olhar Encantado do Meio-Dia" ?',
            false,
        ),
        option.bool(
            "103083",
            "Face Encantada do Meio-Dia",
            'Mode: [select] only\nShould the bot buy "Face Encantada do Meio-Dia" ?',
            false,
        ),
        option.bool(
            "103084",
            "Cabelo Encantado do Meio-Dia",
            'Mode: [select] only\nShould the bot buy "Cabelo Encantado do Meio-Dia" ?',
            false,
        ),
        option.bool(
            "103085",
            "Corte Encantado do Meio-Dia",
            'Mode: [select] only\nShould the bot buy "Corte Encantado do Meio-Dia" ?',
            false,
        ),
        option.bool(
            "103092",
            "Corrente Encantada da Liberdade",
            'Mode: [select] only\nShould the bot buy "Corrente Encantada da Liberdade" ?',
            false,
        ),
        option.bool(
            "103094",
            "Corrente Encantada do Sol",
            'Mode: [select] only\nShould the bot buy "Corrente Encantada do Sol" ?',
            false,
        ),
        option.bool(
            "103088",
            "Runa Encantada do Sol da Liberdade",
            'Mode: [select] only\nShould the bot buy "Runa Encantada do Sol da Liberdade" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: PovoHeroico.select,
});

export default function main(): void {
    const script = new PovoHeroico();
    Core.bankingBlackList.push(
        "Cabelo do Meio-Dia",
        "Corrente da Liberdade",
        "Corrente do Sol",
        "Correntes da Liberdade",
        "Correntes do Sol",
        "Corte do Meio-Dia",
        "Face do Meio-Dia",
        "Maxado de Assís",
        "Moeda Real do Sol",
        "Nascer do Sol",
        "Olhar do Meio-Dia",
        "Raios de Sol",
        "Raios Fúlgidos",
        "Runa do Sol da Liberdade",
        "Símbolo do Sol da Liberdade",
        "Sol da Liberdade",
    );
    Core.setOptions();
    script.buyAllMerge();
    Core.setOptions(false);
}
