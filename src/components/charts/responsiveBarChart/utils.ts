import type { NivoFillPatternObject } from "../types";
import type { BarChartData } from "./types";

function createBarFillPatterns(barChartData: BarChartData[]): {
  barFillPatterns: NivoFillPatternObject[];
} {
  const barDataObj = barChartData[0];

  const barDataObjKeys = Object.keys(barDataObj).filter(
    (key) => key !== "Days" && key !== "Months" && key !== "Years",
  );

  const barFillPatterns = barDataObjKeys.map((barDataObjKey, idx) => {
    /**
     * { match: { id: 'Repair' }, id: 'dots' },
        { match: { id: 'In-Store' }, id: 'lines' },
     */
    const barFillPattern: NivoFillPatternObject = {
      match: { id: barDataObjKey },
      id: idx % 2 === 0 ? "dots" : "lines",
    };

    return barFillPattern;
  });

  return { barFillPatterns };
}

export { createBarFillPatterns };
