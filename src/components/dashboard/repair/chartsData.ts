import { BarChartData } from "../../charts/responsiveBarChart/types";
import { LineChartData } from "../../charts/responsiveLineChart/types";
import {
  BusinessMetric,
  BusinessMetricStoreLocation,
  Month,
  RepairCategory,
  RepairDailyMetric,
  RepairMonthlyMetric,
  RepairYearlyMetric,
  Year,
} from "../types";

type RepairMetricChartsKey = "unitsRepaired" | "revenue";
type RepairMetricBarCharts = Record<RepairMetricChartsKey, BarChartData[]>;
type RepairMetricLineCharts = {
  revenue: { id: "Revenue"; data: { x: string; y: number }[] }[];
  unitsRepaired: { id: "Units Repaired"; data: { x: string; y: number }[] }[];
};

type CreateSelectedDateRepairMetricsInput = {
  businessMetrics: BusinessMetric[];
  day: string;
  month: Month;
  months: Month[];
  selectedRepairCategory: RepairCategory | "All Repairs";
  storeLocation: BusinessMetricStoreLocation;
  year: Year;
};

type SelectedDateRepairMetrics = {
  dayRepairMetrics: {
    selectedDayMetrics?: RepairDailyMetric;
    prevDayMetrics?: RepairDailyMetric;
  };
  monthRepairMetrics: {
    selectedMonthMetrics?: RepairMonthlyMetric;
    prevMonthMetrics?: RepairMonthlyMetric;
  };
  yearRepairMetrics: {
    selectedYearMetrics?: RepairYearlyMetric;
    prevYearMetrics?: RepairYearlyMetric;
  };
};

function returnSelectedDateRepairMetrics({
  businessMetrics,
  day,
  month,
  months,
  selectedRepairCategory,
  storeLocation,
  year,
}: CreateSelectedDateRepairMetricsInput): SelectedDateRepairMetrics {
  const currentStoreMetrics = businessMetrics.find(
    (businessMetric) => businessMetric.storeLocation === storeLocation
  );

  const selectedRepairMetrics = currentStoreMetrics?.repairMetrics.find(
    (repairMetric) => repairMetric.name === selectedRepairCategory
  );

  const selectedYearMetrics = selectedRepairMetrics?.yearlyMetrics.find(
    (yearlyMetric) => yearlyMetric.year === year
  );
  const prevYearMetrics = selectedRepairMetrics?.yearlyMetrics.find(
    (yearlyMetric) => yearlyMetric.year === (parseInt(year) - 1).toString()
  );

  const selectedMonthMetrics = selectedYearMetrics?.monthlyMetrics.find(
    (monthlyMetric) => monthlyMetric.month === month
  );
  const prevPrevYearMetrics = selectedRepairMetrics?.yearlyMetrics.find(
    (yearlyMetric) => yearlyMetric.year === (parseInt(year) - 2).toString()
  );

  const prevMonthMetrics =
    month === "January"
      ? prevPrevYearMetrics?.monthlyMetrics.find(
          (monthlyMetric) => monthlyMetric.month === "December"
        )
      : selectedYearMetrics?.monthlyMetrics.find(
          (monthlyMetric) => monthlyMetric.month === months[months.indexOf(month) - 1]
        );

  const selectedDayMetrics = selectedMonthMetrics?.dailyMetrics.find(
    (dailyMetric) => dailyMetric.day === day
  );

  const prevDayMetrics =
    day === "01"
      ? prevMonthMetrics?.dailyMetrics.reduce<RepairDailyMetric | undefined>(
          (acc, prevMonthDailyMetric) => {
            const { day: prevDay } = prevMonthDailyMetric;

            if (
              prevDay === "31" ||
              prevDay === "30" ||
              prevDay === "29" ||
              prevDay === "28"
            ) {
              acc = prevMonthDailyMetric;
            }

            return acc;
          },
          void 0
        )
      : selectedMonthMetrics?.dailyMetrics.find(
          (dailyMetric) =>
            dailyMetric.day === (parseInt(day) - 1).toString().padStart(2, "0")
        );

  return {
    dayRepairMetrics: { selectedDayMetrics, prevDayMetrics },
    monthRepairMetrics: { selectedMonthMetrics, prevMonthMetrics },
    yearRepairMetrics: { selectedYearMetrics, prevYearMetrics },
  };
}

type ReturnRepairChartsInput = {
  businessMetrics: BusinessMetric[];
  months: Month[];
  selectedRepairCategory: RepairCategory | "All Repairs";
  selectedDateRepairMetrics: SelectedDateRepairMetrics;
  storeLocation: BusinessMetricStoreLocation;
};

type RepairMetricsCharts = {
  dailyCharts: {
    bar: RepairMetricBarCharts;
    line: RepairMetricLineCharts;
  };
  monthlyCharts: {
    bar: RepairMetricBarCharts;
    line: RepairMetricLineCharts;
  };
  yearlyCharts: {
    bar: RepairMetricBarCharts;
    line: RepairMetricLineCharts;
  };
};

/**
 * repairMetrics: {
    name: RepairCategory;
    yearlyMetrics: {
      year: string;
      revenue: number;
      unitsRepaired: number;

      monthlyMetrics: {
        month: string;
        revenue: number;
        unitsRepaired: number;

        dailyMetrics: {
          day: string;
          revenue: number;
          unitsRepaired: number;
        }[];
      }[];
    }[];    
  }[]
 */

async function createRepairMetricsCharts({
  businessMetrics,
  months,
  selectedDateRepairMetrics,
  selectedRepairCategory,
  storeLocation,
}: ReturnRepairChartsInput): Promise<RepairMetricsCharts> {
  const {
    yearRepairMetrics: { selectedYearMetrics },
  } = selectedDateRepairMetrics;
  const selectedYear =
    selectedYearMetrics?.year ?? (new Date().getFullYear().toString() as Year);

  const {
    monthRepairMetrics: { selectedMonthMetrics },
  } = selectedDateRepairMetrics;
  const selectedMonth = selectedMonthMetrics?.month ?? "January";
  const monthNumber = (months.indexOf(selectedMonth) + 1).toString().padStart(2, "0");

  const currentStoreMetrics = businessMetrics.find(
    (businessMetric) => businessMetric.storeLocation === storeLocation
  );

  const repairMetrics = currentStoreMetrics?.repairMetrics.find(
    (repairMetric) => repairMetric.name === selectedRepairCategory
  );

  const BAR_CHART_DATA_TEMPLATE: RepairMetricBarCharts = {
    revenue: [],
    unitsRepaired: [],
  };

  const LINE_CHART_DATA_TEMPLATE: RepairMetricLineCharts = {
    revenue: [{ id: "Revenue", data: [] }],
    unitsRepaired: [{ id: "Units Repaired", data: [] }],
  };

  const [dailyRepairMetrics, monthlyRepairMetrics, yearlyRepairMetrics] =
    await Promise.all([
      createDailyRepairCharts({
        barChartsTemplate: BAR_CHART_DATA_TEMPLATE,
        dailyMetrics: selectedMonthMetrics?.dailyMetrics,
        lineChartsTemplate: LINE_CHART_DATA_TEMPLATE,
        monthNumber,
        selectedYear,
      }),
      createMonthlyRepairCharts({
        barChartsTemplate: BAR_CHART_DATA_TEMPLATE,
        lineChartsTemplate: LINE_CHART_DATA_TEMPLATE,
        monthlyMetrics: selectedYearMetrics?.monthlyMetrics,
        selectedYear,
      }),
      createYearlyRepairCharts({
        barChartsTemplate: BAR_CHART_DATA_TEMPLATE,
        lineChartsTemplate: LINE_CHART_DATA_TEMPLATE,
        yearlyMetrics: repairMetrics?.yearlyMetrics,
      }),
    ]);

  return {
    dailyCharts: dailyRepairMetrics,
    monthlyCharts: monthlyRepairMetrics,
    yearlyCharts: yearlyRepairMetrics,
  };
}

type CreateDailyRepairChartsInput = {
  barChartsTemplate: RepairMetricBarCharts;
  dailyMetrics?: RepairDailyMetric[];
  lineChartsTemplate: RepairMetricLineCharts;
  monthNumber: string;
  selectedYear: Year;
};

async function createDailyRepairCharts({
  barChartsTemplate,
  dailyMetrics,
  lineChartsTemplate,
  monthNumber,
  selectedYear,
}: CreateDailyRepairChartsInput): Promise<RepairMetricsCharts["dailyCharts"]> {
  if (!dailyMetrics) {
    return new Promise((resolve) => {
      resolve({
        bar: barChartsTemplate,
        line: lineChartsTemplate,
      });
    });
  }

  return new Promise<RepairMetricsCharts["dailyCharts"]>((resolve) => {
    setTimeout(() => {
      const [dailyRepairMetricsBarCharts, dailyRepairMetricsLineCharts] =
        dailyMetrics.reduce(
          (dailyRepairChartsAcc, dailyRepairMetric) => {
            const [dailyRepairMetricBarChartsAcc, dailyRepairMetricLineChartsAcc] =
              dailyRepairChartsAcc;

            const { day, revenue, unitsRepaired } = dailyRepairMetric;

            const dailyUnitsRepairedBarChart: BarChartData = {
              Days: day,
              "Units Repaired": unitsRepaired,
            };
            dailyRepairMetricBarChartsAcc.unitsRepaired.push(dailyUnitsRepairedBarChart);

            const dailyRevenueBarChart: BarChartData = {
              Days: day,
              Revenue: revenue,
            };
            dailyRepairMetricBarChartsAcc.revenue.push(dailyRevenueBarChart);

            const dailyRepairUnitsRepairedLineChart = {
              x: day,
              y: unitsRepaired,
            };
            dailyRepairMetricLineChartsAcc.unitsRepaired
              .find(
                (lineChartData: LineChartData) => lineChartData.id === "Units Repaired"
              )
              ?.data.push(dailyRepairUnitsRepairedLineChart);

            const dailyRepairRevenueLineChart = {
              x: day,
              y: revenue,
            };
            dailyRepairMetricLineChartsAcc.revenue
              .find((lineChartData: LineChartData) => lineChartData.id === "Revenue")
              ?.data.push(dailyRepairRevenueLineChart);

            return dailyRepairChartsAcc;
          },
          [structuredClone(barChartsTemplate), structuredClone(lineChartsTemplate)]
        );

      resolve({
        bar: dailyRepairMetricsBarCharts,
        line: dailyRepairMetricsLineCharts,
      });
    }, 0);
  });
}

type CreateMonthlyRepairChartsInput = {
  barChartsTemplate: RepairMetricBarCharts;
  lineChartsTemplate: RepairMetricLineCharts;
  monthlyMetrics?: RepairMonthlyMetric[];
  selectedYear: Year;
};

async function createMonthlyRepairCharts({
  barChartsTemplate,
  lineChartsTemplate,
  monthlyMetrics,
  selectedYear,
}: CreateMonthlyRepairChartsInput): Promise<RepairMetricsCharts["monthlyCharts"]> {
  if (!monthlyMetrics) {
    return new Promise((resolve) => {
      resolve({
        bar: barChartsTemplate,
        line: lineChartsTemplate,
      });
    });
  }

  return new Promise<RepairMetricsCharts["monthlyCharts"]>((resolve) => {
    setTimeout(() => {
      const [monthlyRepairMetricsBarCharts, monthlyRepairMetricsLineCharts] =
        monthlyMetrics.reduce(
          (monthlyRepairChartsAcc, monthlyRepairMetric) => {
            const [monthlyRepairMetricBarChartsAcc, monthlyRepairMetricLineChartsAcc] =
              monthlyRepairChartsAcc;

            const { month, revenue, unitsRepaired } = monthlyRepairMetric;

            // prevents current month of current year from being added to charts
            const currentYear = new Date().getFullYear().toString();
            const isCurrentYear = selectedYear === currentYear;
            const currentMonth = new Date().toLocaleString("default", { month: "long" });
            const isCurrentMonth = month === currentMonth;

            if (isCurrentYear && isCurrentMonth) {
              return monthlyRepairChartsAcc;
            }

            const monthlyUnitsRepairedBarChart: BarChartData = {
              Months: month,
              "Units Repaired": unitsRepaired,
            };
            monthlyRepairMetricBarChartsAcc.unitsRepaired.push(
              monthlyUnitsRepairedBarChart
            );

            const monthlyRevenueBarChart: BarChartData = {
              Months: month,
              Revenue: revenue,
            };
            monthlyRepairMetricBarChartsAcc.revenue.push(monthlyRevenueBarChart);

            const monthlyRepairUnitsRepairedLineChart = {
              x: month,
              y: unitsRepaired,
            };
            monthlyRepairMetricLineChartsAcc.unitsRepaired
              .find(
                (lineChartData: LineChartData) => lineChartData.id === "Units Repaired"
              )
              ?.data.push(monthlyRepairUnitsRepairedLineChart);

            const monthlyRepairRevenueLineChart = {
              x: month,
              y: revenue,
            };
            monthlyRepairMetricLineChartsAcc.revenue
              .find((lineChartData: LineChartData) => lineChartData.id === "Revenue")
              ?.data.push(monthlyRepairRevenueLineChart);

            return monthlyRepairChartsAcc;
          },
          [structuredClone(barChartsTemplate), structuredClone(lineChartsTemplate)]
        );

      resolve({
        bar: monthlyRepairMetricsBarCharts,
        line: monthlyRepairMetricsLineCharts,
      });
    }, 0);
  });
}

type CreateYearlyRepairChartsInput = {
  barChartsTemplate: RepairMetricBarCharts;
  lineChartsTemplate: RepairMetricLineCharts;
  yearlyMetrics?: RepairYearlyMetric[];
};

async function createYearlyRepairCharts({
  barChartsTemplate,
  lineChartsTemplate,
  yearlyMetrics,
}: CreateYearlyRepairChartsInput): Promise<RepairMetricsCharts["yearlyCharts"]> {
  if (!yearlyMetrics) {
    return new Promise((resolve) => {
      resolve({
        bar: barChartsTemplate,
        line: lineChartsTemplate,
      });
    });
  }

  return new Promise<RepairMetricsCharts["yearlyCharts"]>((resolve) => {
    setTimeout(() => {
      const [yearlyRepairMetricsBarCharts, yearlyRepairMetricsLineCharts] =
        yearlyMetrics.reduce(
          (yearlyRepairChartsAcc, yearlyRepairMetric) => {
            const [yearlyRepairMetricBarChartsAcc, yearlyRepairMetricLineChartsAcc] =
              yearlyRepairChartsAcc;

            const { year, revenue, unitsRepaired } = yearlyRepairMetric;

            const yearlyUnitsRepairedBarChart: BarChartData = {
              Years: year,
              "Units Repaired": unitsRepaired,
            };
            yearlyRepairMetricBarChartsAcc.unitsRepaired.push(
              yearlyUnitsRepairedBarChart
            );

            const yearlyRevenueBarChart: BarChartData = {
              Years: year,
              Revenue: revenue,
            };
            yearlyRepairMetricBarChartsAcc.revenue.push(yearlyRevenueBarChart);

            const yearlyRepairUnitsRepairedLineChart = {
              x: year,
              y: unitsRepaired,
            };
            yearlyRepairMetricLineChartsAcc.unitsRepaired
              .find(
                (lineChartData: LineChartData) => lineChartData.id === "Units Repaired"
              )
              ?.data.push(yearlyRepairUnitsRepairedLineChart);

            const yearlyRepairRevenueLineChart = {
              x: year,
              y: revenue,
            };
            yearlyRepairMetricLineChartsAcc.revenue
              .find((lineChartData: LineChartData) => lineChartData.id === "Revenue")
              ?.data.push(yearlyRepairRevenueLineChart);

            return yearlyRepairChartsAcc;
          },
          [structuredClone(barChartsTemplate), structuredClone(lineChartsTemplate)]
        );

      resolve({
        bar: yearlyRepairMetricsBarCharts,
        line: yearlyRepairMetricsLineCharts,
      });
    }, 0);
  });
}

export { createRepairMetricsCharts, returnSelectedDateRepairMetrics };
export type {
  RepairMetricBarCharts,
  RepairMetricChartsKey,
  RepairMetricLineCharts,
  RepairMetricsCharts,
  SelectedDateRepairMetrics,
};
