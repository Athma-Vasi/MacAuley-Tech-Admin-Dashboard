import { Err, Some } from "ts-results";
import { RepairMetricsDocument, ResultSafeBox } from "../../../types";
import { createResultSafeBox } from "../../../utils";
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
}: CreateSelectedDateRepairMetricsInput): ResultSafeBox<
  SelectedDateRepairMetrics
> {
  try {
    const selectedYearMetrics = repairMetricsDocument.yearlyMetrics.find(
      (yearlyMetric) => yearlyMetric.year === year,
    );
    if (!selectedYearMetrics) {
      return new Err({
        data: Some("Yearly metrics not found"),
        kind: "error",
      });
    }

    const prevYearMetrics = repairMetricsDocument.yearlyMetrics.find(
      (yearlyMetric) => yearlyMetric.year === (parseInt(year) - 1).toString(),
    );
    if (!prevYearMetrics) {
      return new Err({
        data: Some("Previous yearly metrics not found"),
        kind: "error",
      });
    }

    const selectedMonthMetrics = selectedYearMetrics?.monthlyMetrics.find(
      (monthlyMetric) => monthlyMetric.month === month,
    );
    if (!selectedMonthMetrics) {
      return new Err({
        data: Some("Monthly metrics not found"),
        kind: "error",
      });
    }

    const prevPrevYearMetrics = repairMetricsDocument.yearlyMetrics.find(
      (yearlyMetric) => yearlyMetric.year === (parseInt(year) - 2).toString(),
    );
    if (!prevPrevYearMetrics) {
      return new Err({
        data: Some("Previous previous yearly metrics not found"),
        kind: "error",
      });
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
      return new Err({
        data: Some("Previous monthly metrics not found"),
        kind: "error",
      });
    }

    const selectedDayMetrics = selectedMonthMetrics?.dailyMetrics.find(
      (dailyMetric) => dailyMetric.day === day,
    );
    if (!selectedDayMetrics) {
      return new Err({
        data: Some("Daily metrics not found"),
        kind: "error",
      });
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
      return new Err({
        data: Some("Previous daily metrics not found"),
        kind: "error",
      });
    }

    return createResultSafeBox({
      data: Some({
        dayRepairMetrics: { selectedDayMetrics, prevDayMetrics },
        monthRepairMetrics: { selectedMonthMetrics, prevMonthMetrics },
        yearRepairMetrics: { selectedYearMetrics, prevYearMetrics },
      }),
      kind: "success",
    });
  } catch (error: unknown) {
    return new Err({
      data: Some(
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Unknown error",
      ),
      kind: "error",
    });
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
}: ReturnRepairChartsInput): ResultSafeBox<RepairMetricsCharts> {
  const BAR_CHART_DATA_TEMPLATE: RepairMetricBarCharts = {
    revenue: [],
    unitsRepaired: [],
  };

  const LINE_CHART_DATA_TEMPLATE: RepairMetricLineCharts = {
    revenue: [{ id: "Revenue", data: [] }],
    unitsRepaired: [{ id: "Units Repaired", data: [] }],
  };

  if (!repairMetricsDocument || !selectedDateRepairMetrics) {
    return createResultSafeBox({
      data: Some({
        dailyCharts: {
          bar: BAR_CHART_DATA_TEMPLATE,
          line: LINE_CHART_DATA_TEMPLATE,
        },
        monthlyCharts: {
          bar: BAR_CHART_DATA_TEMPLATE,
          line: LINE_CHART_DATA_TEMPLATE,
        },
        yearlyCharts: {
          bar: BAR_CHART_DATA_TEMPLATE,
          line: LINE_CHART_DATA_TEMPLATE,
        },
      }),
    });
  }

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

    const [
      dailyRepairChartsSafeResult,
      monthlyRepairChartsSafeResult,
      yearlyRepairChartsSafeResult,
    ] = [
      createDailyRepairChartsSafe({
        barChartsTemplate: BAR_CHART_DATA_TEMPLATE,
        dailyMetrics: selectedMonthMetrics?.dailyMetrics,
        lineChartsTemplate: LINE_CHART_DATA_TEMPLATE,
        monthNumber,
        selectedYear,
      }),
      createMonthlyRepairChartsSafe({
        barChartsTemplate: BAR_CHART_DATA_TEMPLATE,
        lineChartsTemplate: LINE_CHART_DATA_TEMPLATE,
        monthlyMetrics: selectedYearMetrics?.monthlyMetrics,
        selectedYear,
      }),
      createYearlyRepairChartsSafe({
        barChartsTemplate: BAR_CHART_DATA_TEMPLATE,
        lineChartsTemplate: LINE_CHART_DATA_TEMPLATE,
        yearlyMetrics: repairMetricsDocument.yearlyMetrics,
      }),
    ];

    if (
      dailyRepairChartsSafeResult.err ||
      dailyRepairChartsSafeResult.val.data.none
    ) {
      return createResultSafeBox({
        data: dailyRepairChartsSafeResult.val.data,
        message: Some("Error creating daily repair charts"),
      });
    }
    if (
      monthlyRepairChartsSafeResult.err ||
      monthlyRepairChartsSafeResult.val.data.none
    ) {
      return createResultSafeBox({
        data: monthlyRepairChartsSafeResult.val.data,
        message: Some("Error creating monthly repair charts"),
      });
    }
    if (
      yearlyRepairChartsSafeResult.err ||
      yearlyRepairChartsSafeResult.val.data.none
    ) {
      return createResultSafeBox({
        data: yearlyRepairChartsSafeResult.val.data,
        message: Some("Error creating yearly repair charts"),
      });
    }

    return createResultSafeBox({
      data: Some({
        dailyCharts: dailyRepairChartsSafeResult.val.data.val,
        monthlyCharts: monthlyRepairChartsSafeResult.val.data.val,
        yearlyCharts: yearlyRepairChartsSafeResult.val.data.val,
      }),
      kind: "success",
    });
  } catch (error: unknown) {
    return new Err({
      data: Some(
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Unknown error",
      ),
      kind: "error",
    });
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
}: CreateDailyRepairChartsInput): ResultSafeBox<
  RepairMetricsCharts["dailyCharts"]
> {
  if (!dailyMetrics) {
    return createResultSafeBox({
      data: Some({
        bar: barChartsTemplate,
        line: lineChartsTemplate,
      }),
    });
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

    return createResultSafeBox({
      data: Some({
        bar: dailyRepairMetricsBarCharts,
        line: dailyRepairMetricsLineCharts,
      }),
      kind: "success",
    });
  } catch (error: unknown) {
    return new Err({
      data: Some(
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Unknown error",
      ),
      kind: "error",
    });
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
}: CreateMonthlyRepairChartsInput): ResultSafeBox<
  RepairMetricsCharts["monthlyCharts"]
> {
  if (!monthlyMetrics) {
    return createResultSafeBox({
      data: Some({
        bar: barChartsTemplate,
        line: lineChartsTemplate,
      }),
    });
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

    return createResultSafeBox({
      data: Some({
        bar: monthlyRepairMetricsBarCharts,
        line: monthlyRepairMetricsLineCharts,
      }),
      kind: "success",
    });
  } catch (error: unknown) {
    return new Err({
      data: Some(
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Unknown error",
      ),
      kind: "error",
    });
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
}: CreateYearlyRepairChartsInput): ResultSafeBox<
  RepairMetricsCharts["yearlyCharts"]
> {
  if (!yearlyMetrics) {
    return createResultSafeBox({
      data: Some({
        bar: barChartsTemplate,
        line: lineChartsTemplate,
      }),
    });
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

    return createResultSafeBox({
      data: Some({
        bar: yearlyRepairMetricsBarCharts,
        line: yearlyRepairMetricsLineCharts,
      }),
      kind: "success",
    });
  } catch (error: unknown) {
    return new Err({
      data: Some(
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Unknown error",
      ),
      kind: "error",
    });
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
): ResultSafeBox<{
  currentYear: RepairMetricCalendarCharts;
  previousYear: RepairMetricCalendarCharts;
}> {
  const repairCalendarChartTemplate: RepairMetricCalendarCharts = {
    revenue: [],
    unitsRepaired: [],
  };

  if (!selectedDateRepairMetrics) {
    return createResultSafeBox({
      data: Some({
        currentYear: repairCalendarChartTemplate,
        previousYear: repairCalendarChartTemplate,
      }),
    });
  }

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

    return createResultSafeBox({
      data: Some({
        currentYear,
        previousYear,
      }),
      kind: "success",
    });
  } catch (error: unknown) {
    return new Err({
      data: Some(
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Unknown error",
      ),
      kind: "error",
    });
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
