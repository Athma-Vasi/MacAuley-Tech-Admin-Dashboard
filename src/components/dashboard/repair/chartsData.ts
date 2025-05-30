import { RepairMetricsDocument, SafeResult } from "../../../types";
import { createSafeErrorResult, createSafeSuccessResult } from "../../../utils";
import { BarChartData } from "../../charts/responsiveBarChart/types";
import { CalendarChartData } from "../../charts/responsiveCalendarChart/types";
import { LineChartData } from "../../charts/responsiveLineChart/types";
import { MONTHS } from "../constants";
import {
  DashboardCalendarView,
  Month,
  RepairDailyMetric,
  RepairMonthlyMetric,
  RepairYearlyMetric,
  Year,
} from "../types";
import { RepairSubMetric } from "./types";

type RepairMetricChartsKey = "unitsRepaired" | "revenue";
type RepairMetricBarCharts = Record<RepairMetricChartsKey, BarChartData[]>;
type RepairMetricLineCharts = {
  revenue: { id: "Revenue"; data: { x: string; y: number }[] }[];
  unitsRepaired: { id: "Units Repaired"; data: { x: string; y: number }[] }[];
};

type CreateSelectedDateRepairMetricsInput = {
  day: string;
  month: Month;
  months: Month[];
  repairMetricsDocument: RepairMetricsDocument;
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

function returnSelectedDateRepairMetricsSafe({
  repairMetricsDocument,
  day,
  month,
  months,
  year,
}: CreateSelectedDateRepairMetricsInput): SafeResult<
  SelectedDateRepairMetrics
> {
  try {
    const selectedYearMetrics = repairMetricsDocument.yearlyMetrics.find(
      (yearlyMetric) => yearlyMetric.year === year,
    );
    if (!selectedYearMetrics) {
      return createSafeErrorResult("Selected yearly metrics not found");
    }

    const prevYearMetrics = repairMetricsDocument.yearlyMetrics.find(
      (yearlyMetric) => yearlyMetric.year === (parseInt(year) - 1).toString(),
    );
    if (!prevYearMetrics) {
      return createSafeErrorResult("Previous yearly metrics not found");
    }

    const selectedMonthMetrics = selectedYearMetrics?.monthlyMetrics.find(
      (monthlyMetric) => monthlyMetric.month === month,
    );
    if (!selectedMonthMetrics) {
      return createSafeErrorResult("Monthly metrics not found");
    }

    const prevPrevYearMetrics = repairMetricsDocument.yearlyMetrics.find(
      (yearlyMetric) => yearlyMetric.year === (parseInt(year) - 2).toString(),
    );
    if (!prevPrevYearMetrics) {
      return createSafeErrorResult(
        "Previous previous yearly metrics not found",
      );
    }

    const prevMonthMetrics = month === "January"
      ? prevPrevYearMetrics?.monthlyMetrics.find(
        (monthlyMetric) => monthlyMetric.month === "December",
      )
      : selectedYearMetrics?.monthlyMetrics.find(
        (monthlyMetric) =>
          monthlyMetric.month === months[months.indexOf(month) - 1],
      );
    if (!prevMonthMetrics) {
      return createSafeErrorResult("Previous monthly metrics not found");
    }

    const selectedDayMetrics = selectedMonthMetrics?.dailyMetrics.find(
      (dailyMetric) => dailyMetric.day === day,
    );
    if (!selectedDayMetrics) {
      return createSafeErrorResult("Daily metrics not found");
    }

    const prevDayMetrics = day === "01"
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
        void 0,
      )
      : selectedMonthMetrics?.dailyMetrics.find(
        (dailyMetric) =>
          dailyMetric.day === (parseInt(day) - 1).toString().padStart(2, "0"),
      );
    if (!prevDayMetrics) {
      return createSafeErrorResult("Previous daily metrics not found");
    }

    return createSafeSuccessResult(
      {
        dayRepairMetrics: { selectedDayMetrics, prevDayMetrics },
        monthRepairMetrics: { selectedMonthMetrics, prevMonthMetrics },
        yearRepairMetrics: { selectedYearMetrics, prevYearMetrics },
      },
    );
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

type ReturnRepairChartsInput = {
  repairMetricsDocument: RepairMetricsDocument;
  months: Month[];
  selectedDateRepairMetrics: SelectedDateRepairMetrics;
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

function createRepairMetricsChartsSafe({
  repairMetricsDocument,
  months,
  selectedDateRepairMetrics,
}: ReturnRepairChartsInput): SafeResult<RepairMetricsCharts> {
  if (!repairMetricsDocument) {
    return createSafeErrorResult("No repair metrics data found");
  }
  if (!selectedDateRepairMetrics) {
    return createSafeErrorResult("No selected date repair metrics data found");
  }

  const BAR_CHART_DATA_TEMPLATE: RepairMetricBarCharts = {
    revenue: [],
    unitsRepaired: [],
  };

  const LINE_CHART_DATA_TEMPLATE: RepairMetricLineCharts = {
    revenue: [{ id: "Revenue", data: [] }],
    unitsRepaired: [{ id: "Units Repaired", data: [] }],
  };

  try {
    const {
      yearRepairMetrics: { selectedYearMetrics },
    } = selectedDateRepairMetrics;
    const selectedYear = selectedYearMetrics?.year ??
      (new Date().getFullYear().toString() as Year);

    const {
      monthRepairMetrics: { selectedMonthMetrics },
    } = selectedDateRepairMetrics;
    const selectedMonth = selectedMonthMetrics?.month ?? "January";
    const monthNumber = (months.indexOf(selectedMonth) + 1).toString().padStart(
      2,
      "0",
    );

    const dailyRepairChartsSafeResult = createDailyRepairChartsSafe({
      barChartsTemplate: BAR_CHART_DATA_TEMPLATE,
      dailyMetrics: selectedMonthMetrics?.dailyMetrics,
      lineChartsTemplate: LINE_CHART_DATA_TEMPLATE,
      monthNumber,
      selectedYear,
    });
    if (dailyRepairChartsSafeResult.err) {
      return dailyRepairChartsSafeResult;
    }
    if (dailyRepairChartsSafeResult.val.none) {
      return createSafeErrorResult("Error creating daily repair charts");
    }

    const monthlyRepairChartsSafeResult = createMonthlyRepairChartsSafe({
      barChartsTemplate: BAR_CHART_DATA_TEMPLATE,
      lineChartsTemplate: LINE_CHART_DATA_TEMPLATE,
      monthlyMetrics: selectedYearMetrics?.monthlyMetrics,
      selectedYear,
    });
    if (monthlyRepairChartsSafeResult.err) {
      return monthlyRepairChartsSafeResult;
    }
    if (monthlyRepairChartsSafeResult.val.none) {
      return createSafeErrorResult("Error creating monthly repair charts");
    }

    const yearlyRepairChartsSafeResult = createYearlyRepairChartsSafe({
      barChartsTemplate: BAR_CHART_DATA_TEMPLATE,
      lineChartsTemplate: LINE_CHART_DATA_TEMPLATE,
      yearlyMetrics: repairMetricsDocument.yearlyMetrics,
    });
    if (yearlyRepairChartsSafeResult.err) {
      return yearlyRepairChartsSafeResult;
    }
    if (yearlyRepairChartsSafeResult.val.none) {
      return createSafeErrorResult("Error creating yearly repair charts");
    }

    return createSafeSuccessResult({
      dailyCharts: dailyRepairChartsSafeResult.val.val,
      monthlyCharts: monthlyRepairChartsSafeResult.val.val,
      yearlyCharts: yearlyRepairChartsSafeResult.val.val,
    });
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

type CreateDailyRepairChartsInput = {
  barChartsTemplate: RepairMetricBarCharts;
  dailyMetrics?: RepairDailyMetric[];
  lineChartsTemplate: RepairMetricLineCharts;
  monthNumber: string;
  selectedYear: Year;
};

function createDailyRepairChartsSafe({
  barChartsTemplate,
  dailyMetrics,
  lineChartsTemplate,
}: CreateDailyRepairChartsInput): SafeResult<
  RepairMetricsCharts["dailyCharts"]
> {
  if (!dailyMetrics) {
    return createSafeErrorResult("No daily metrics data found");
  }

  try {
    const [dailyRepairMetricsBarCharts, dailyRepairMetricsLineCharts] =
      dailyMetrics.reduce(
        (dailyRepairChartsAcc, dailyRepairMetric) => {
          const [
            dailyRepairMetricBarChartsAcc,
            dailyRepairMetricLineChartsAcc,
          ] = dailyRepairChartsAcc;

          const { day, revenue, unitsRepaired } = dailyRepairMetric;

          const dailyUnitsRepairedBarChart: BarChartData = {
            Days: day,
            "Units Repaired": unitsRepaired,
          };
          dailyRepairMetricBarChartsAcc.unitsRepaired.push(
            dailyUnitsRepairedBarChart,
          );

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
              (lineChartData: LineChartData) =>
                lineChartData.id === "Units Repaired",
            )
            ?.data.push(dailyRepairUnitsRepairedLineChart);

          const dailyRepairRevenueLineChart = {
            x: day,
            y: revenue,
          };
          dailyRepairMetricLineChartsAcc.revenue
            .find((lineChartData: LineChartData) =>
              lineChartData.id === "Revenue"
            )
            ?.data.push(dailyRepairRevenueLineChart);

          return dailyRepairChartsAcc;
        },
        [
          structuredClone(barChartsTemplate),
          structuredClone(lineChartsTemplate),
        ],
      );

    return createSafeSuccessResult({
      bar: dailyRepairMetricsBarCharts,
      line: dailyRepairMetricsLineCharts,
    });
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

type CreateMonthlyRepairChartsInput = {
  barChartsTemplate: RepairMetricBarCharts;
  lineChartsTemplate: RepairMetricLineCharts;
  monthlyMetrics?: RepairMonthlyMetric[];
  selectedYear: Year;
};

function createMonthlyRepairChartsSafe({
  barChartsTemplate,
  lineChartsTemplate,
  monthlyMetrics,
  selectedYear,
}: CreateMonthlyRepairChartsInput): SafeResult<
  RepairMetricsCharts["monthlyCharts"]
> {
  if (!monthlyMetrics) {
    return createSafeErrorResult("No monthly metrics data found");
  }

  try {
    const [monthlyRepairMetricsBarCharts, monthlyRepairMetricsLineCharts] =
      monthlyMetrics.reduce(
        (monthlyRepairChartsAcc, monthlyRepairMetric) => {
          const [
            monthlyRepairMetricBarChartsAcc,
            monthlyRepairMetricLineChartsAcc,
          ] = monthlyRepairChartsAcc;

          const { month, revenue, unitsRepaired } = monthlyRepairMetric;

          // prevents current month of current year from being added to charts
          const currentYear = new Date().getFullYear().toString();
          const isCurrentYear = selectedYear === currentYear;
          const currentMonth = new Date().toLocaleString("default", {
            month: "long",
          });
          const isCurrentMonth = month === currentMonth;

          if (isCurrentYear && isCurrentMonth) {
            return monthlyRepairChartsAcc;
          }

          const monthlyUnitsRepairedBarChart: BarChartData = {
            Months: month,
            "Units Repaired": unitsRepaired,
          };
          monthlyRepairMetricBarChartsAcc.unitsRepaired.push(
            monthlyUnitsRepairedBarChart,
          );

          const monthlyRevenueBarChart: BarChartData = {
            Months: month,
            Revenue: revenue,
          };
          monthlyRepairMetricBarChartsAcc.revenue.push(
            monthlyRevenueBarChart,
          );

          const monthlyRepairUnitsRepairedLineChart = {
            x: month,
            y: unitsRepaired,
          };
          monthlyRepairMetricLineChartsAcc.unitsRepaired
            .find(
              (lineChartData: LineChartData) =>
                lineChartData.id === "Units Repaired",
            )
            ?.data.push(monthlyRepairUnitsRepairedLineChart);

          const monthlyRepairRevenueLineChart = {
            x: month,
            y: revenue,
          };
          monthlyRepairMetricLineChartsAcc.revenue
            .find((lineChartData: LineChartData) =>
              lineChartData.id === "Revenue"
            )
            ?.data.push(monthlyRepairRevenueLineChart);

          return monthlyRepairChartsAcc;
        },
        [
          structuredClone(barChartsTemplate),
          structuredClone(lineChartsTemplate),
        ],
      );

    return createSafeSuccessResult({
      bar: monthlyRepairMetricsBarCharts,
      line: monthlyRepairMetricsLineCharts,
    });
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

type CreateYearlyRepairChartsInput = {
  barChartsTemplate: RepairMetricBarCharts;
  lineChartsTemplate: RepairMetricLineCharts;
  yearlyMetrics?: RepairYearlyMetric[];
};

function createYearlyRepairChartsSafe({
  barChartsTemplate,
  lineChartsTemplate,
  yearlyMetrics,
}: CreateYearlyRepairChartsInput): SafeResult<
  RepairMetricsCharts["yearlyCharts"]
> {
  if (!yearlyMetrics) {
    return createSafeErrorResult("No yearly metrics data found");
  }

  try {
    const [yearlyRepairMetricsBarCharts, yearlyRepairMetricsLineCharts] =
      yearlyMetrics.reduce(
        (yearlyRepairChartsAcc, yearlyRepairMetric) => {
          const [
            yearlyRepairMetricBarChartsAcc,
            yearlyRepairMetricLineChartsAcc,
          ] = yearlyRepairChartsAcc;

          const { year, revenue, unitsRepaired } = yearlyRepairMetric;

          const yearlyUnitsRepairedBarChart: BarChartData = {
            Years: year,
            "Units Repaired": unitsRepaired,
          };
          yearlyRepairMetricBarChartsAcc.unitsRepaired.push(
            yearlyUnitsRepairedBarChart,
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
              (lineChartData: LineChartData) =>
                lineChartData.id === "Units Repaired",
            )
            ?.data.push(yearlyRepairUnitsRepairedLineChart);

          const yearlyRepairRevenueLineChart = {
            x: year,
            y: revenue,
          };
          yearlyRepairMetricLineChartsAcc.revenue
            .find((lineChartData: LineChartData) =>
              lineChartData.id === "Revenue"
            )
            ?.data.push(yearlyRepairRevenueLineChart);

          return yearlyRepairChartsAcc;
        },
        [
          structuredClone(barChartsTemplate),
          structuredClone(lineChartsTemplate),
        ],
      );

    return createSafeSuccessResult({
      bar: yearlyRepairMetricsBarCharts,
      line: yearlyRepairMetricsLineCharts,
    });
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

function returnCalendarViewRepairCharts(
  calendarView: DashboardCalendarView,
  repairMetricsCharts: RepairMetricsCharts,
) {
  return calendarView === "Daily"
    ? repairMetricsCharts.dailyCharts
    : calendarView === "Monthly"
    ? repairMetricsCharts.monthlyCharts
    : repairMetricsCharts.yearlyCharts;
}

type RepairMetricCalendarCharts = {
  revenue: CalendarChartData[];
  unitsRepaired: CalendarChartData[];
};

function createRepairMetricsCalendarChartsSafe(
  calendarView: DashboardCalendarView,
  selectedDateRepairMetrics: SelectedDateRepairMetrics,
  selectedYYYYMMDD: string,
): SafeResult<{
  currentYear: RepairMetricCalendarCharts;
  previousYear: RepairMetricCalendarCharts;
}> {
  if (!selectedDateRepairMetrics) {
    return createSafeErrorResult("No selected date repair metrics data found");
  }

  const repairCalendarChartTemplate: RepairMetricCalendarCharts = {
    revenue: [],
    unitsRepaired: [],
  };

  try {
    const { yearRepairMetrics: { selectedYearMetrics, prevYearMetrics } } =
      selectedDateRepairMetrics;

    const [currentYear, previousYear] = [
      createDailyRepairCalendarCharts(
        selectedYearMetrics,
        structuredClone(repairCalendarChartTemplate),
      ),
      createDailyRepairCalendarCharts(
        prevYearMetrics,
        structuredClone(repairCalendarChartTemplate),
      ),
    ];

    function createDailyRepairCalendarCharts(
      yearlyMetrics: RepairYearlyMetric | undefined,
      calendarChartsTemplate: RepairMetricCalendarCharts,
    ): RepairMetricCalendarCharts {
      if (!yearlyMetrics) {
        return calendarChartsTemplate;
      }

      let selectedMetrics: Array<RepairMonthlyMetric> = [];

      if (calendarView === "Daily") {
        const selectedMonthMetrics = yearlyMetrics.monthlyMetrics.find(
          (monthlyMetric) => {
            const { month } = monthlyMetric;
            const monthIdx = MONTHS.indexOf(month) + 1;
            return monthIdx === parseInt(selectedYYYYMMDD.split("-")[1]);
          },
        );

        if (!selectedMonthMetrics) {
          return calendarChartsTemplate;
        }

        selectedMetrics = [selectedMonthMetrics];
      }

      if (calendarView === "Monthly" || calendarView === "Yearly") {
        selectedMetrics = yearlyMetrics.monthlyMetrics;
      }

      if (selectedMetrics.length === 0) {
        return calendarChartsTemplate;
      }

      const repairCalendarCharts = selectedMetrics.reduce(
        (resultAcc, monthlyMetric) => {
          const { dailyMetrics, month } = monthlyMetric;
          const monthNumber = MONTHS.indexOf(month) + 1;

          dailyMetrics.forEach((dailyMetric) => {
            const { revenue, unitsRepaired } = dailyMetric;
            const day = `${yearlyMetrics.year}-${
              monthNumber.toString().padStart(2, "0")
            }-${dailyMetric.day}`;

            // revenue

            resultAcc.revenue.push({
              day,
              value: revenue,
            });

            // units repaired

            resultAcc.unitsRepaired.push({
              day,
              value: unitsRepaired,
            });
          });

          return resultAcc;
        },
        calendarChartsTemplate,
      );

      return repairCalendarCharts;
    }

    return createSafeSuccessResult({
      currentYear,
      previousYear,
    });
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

function returnSelectedRepairCalendarCharts(
  calendarChartsData: {
    currentYear: RepairMetricCalendarCharts | null;
    previousYear: RepairMetricCalendarCharts | null;
  },
  calendarChartYAxis: RepairSubMetric,
): Array<CalendarChartData> {
  const defaultValue = [{
    day: "",
    value: 0,
  }];

  const { currentYear, previousYear } = calendarChartsData;
  if (
    currentYear === null || previousYear === null
  ) {
    return defaultValue;
  }

  const currentYearCharts = calendarChartYAxis === "revenue"
    ? currentYear.revenue
    : currentYear.unitsRepaired;
  const previousYearCharts = calendarChartYAxis === "revenue"
    ? previousYear.revenue
    : previousYear.unitsRepaired;

  return currentYearCharts.concat(previousYearCharts);
}

export {
  createRepairMetricsCalendarChartsSafe,
  createRepairMetricsChartsSafe,
  returnCalendarViewRepairCharts,
  returnSelectedDateRepairMetricsSafe,
  returnSelectedRepairCalendarCharts,
};
export type {
  RepairMetricBarCharts,
  RepairMetricCalendarCharts,
  RepairMetricChartsKey,
  RepairMetricLineCharts,
  RepairMetricsCharts,
  SelectedDateRepairMetrics,
};
