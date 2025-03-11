import type { NivoFillPatternObject } from "../types";
import type { PieChartData } from "./types";

function createPieFillPatterns(
    pieChartData: PieChartData[],
) {
    return pieChartData.map(
        (pieChartData: PieChartData, chartIdx) => {
            const { id } = pieChartData;
            const fillPattern: NivoFillPatternObject = {
                match: {
                    id,
                },
                id: chartIdx % 2 === 0 ? "dots" : "lines",
            };

            return fillPattern;
        },
    );
}

export { createPieFillPatterns };
