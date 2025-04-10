import { Group, Modal } from "@mantine/core";
import React from "react";
import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import {
    consolidateCardsAndStatisticsModals,
    DashboardCardInfo,
    returnCardElementsForYAxisVariable,
} from "./utilsTSX";

type StatisticsCardsProps = {
    barLineRadialChartYAxis: string;
    keyMap: Map<string, Set<string>>;
    selectedCards: Map<string, DashboardCardInfo>;
    statisticsElementsMap: Map<
        string,
        React.JSX.Element
    >;
};

function StatisticsCards(
    { barLineRadialChartYAxis, keyMap, selectedCards, statisticsElementsMap }:
        StatisticsCardsProps,
) {
    const [modalsOpenedState, setModalsOpenedState] = React.useState<
        Array<boolean>
    >(
        Array.from({ length: statisticsElementsMap.size }, () => false),
    );
    const { globalState: { themeObject } } = useGlobalState();

    const { cardBgGradient, themeColorShade } = returnThemeColors({
        colorsSwatches: COLORS_SWATCHES,
        themeObject,
    });

    // const consolidatedCards = consolidateCardsAndStatistics(
    //     selectedCards,
    //     statisticsElementsMap,
    // );
    const consolidatedCards = consolidateCardsAndStatisticsModals({
        modalsOpenedState,
        selectedCards,
        setModalsOpenedState,
    });

    const cardsWithStatisticsElements = returnCardElementsForYAxisVariable(
        consolidatedCards,
        barLineRadialChartYAxis,
        keyMap,
    );

    console.group("StatisticsCards State");
    console.log(modalsOpenedState);
    console.groupEnd();

    console.group("StatisticsCards Props");
    console.log("barLineRadialChartYAxis", barLineRadialChartYAxis);
    console.log("keyMap", keyMap);
    console.log("selectedCards", selectedCards);
    console.log("statisticsElementsMap", statisticsElementsMap);
    console.groupEnd();

    const statisticsModals = returnStatisticsModals(
        {
            modalsOpenedState,
            setModalsOpenedState,
            statisticsElementsMap,
            themeColorShade,
        },
    );

    return (
        <div className="statistics-elements-container">
            {statisticsModals}
            {cardsWithStatisticsElements}
        </div>
    );
}

function returnStatisticsModals(
    {
        modalsOpenedState,
        setModalsOpenedState,
        statisticsElementsMap,
        themeColorShade,
    }: {
        modalsOpenedState: boolean[];
        setModalsOpenedState: React.Dispatch<React.SetStateAction<boolean[]>>;
        statisticsElementsMap: Map<string, React.JSX.Element>;
        themeColorShade: string;
    },
) {
    return Array.from(statisticsElementsMap).reduce(
        (acc, entry, idx) => {
            const [key, element] = entry;

            const modal = (
                <Modal
                    centered
                    closeButtonProps={{ color: themeColorShade }}
                    key={`${key}-${idx}-modal`}
                    opened={modalsOpenedState[idx]}
                    onClose={() =>
                        setModalsOpenedState((prev) => {
                            const newStates = [...prev];
                            newStates[idx] = !newStates[idx];
                            return newStates;
                        })}
                    transitionProps={{
                        transition: "fade",
                        duration: 200,
                        timingFunction: "ease-in-out",
                    }}
                    maw={400}
                    miw={250}
                >
                    <Group>{element}</Group>
                </Modal>
            );
            acc.push(modal);

            return acc;
        },
        [] as React.JSX.Element[],
    );
}

export { StatisticsCards };
