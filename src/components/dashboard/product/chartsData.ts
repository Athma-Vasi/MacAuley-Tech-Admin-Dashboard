import { ProductMetricsDocument, SafeResult } from "../../../types";
import { createSafeErrorResult, createSafeSuccessResult } from "../../../utils";
import { BarChartData } from "../../charts/responsiveBarChart/types";
import { CalendarChartData } from "../../charts/responsiveCalendarChart/types";
import { LineChartData } from "../../charts/responsiveLineChart/types";
import { PieChartData } from "../../charts/responsivePieChart/types";
import { MONTHS } from "../constants";
import {
  DashboardCalendarView,
  Month,
  ProductDailyMetric,
  ProductMonthlyMetric,
  ProductYearlyMetric,
  Year,
} from "../types";

type SelectedDateProductMetrics = {
  dayProductMetrics: {
    selectedDayMetrics?: ProductDailyMetric;
    prevDayMetrics?: ProductDailyMetric;
  };
  monthProductMetrics: {
    selectedMonthMetrics?: ProductMonthlyMetric;
    prevMonthMetrics?: ProductMonthlyMetric;
  };
  yearProductMetrics: {
    selectedYearMetrics?: ProductYearlyMetric;
    prevYearMetrics?: ProductYearlyMetric;
  };
};

type CreateSelectedDateProductMetricsInput = {
  productMetricsDocument: ProductMetricsDocument;
  day: string;
  month: Month;
  months: Month[];
  year: Year;
};

function returnSelectedDateProductMetricsSafe({
  productMetricsDocument,
  day,
  month,
  months,
  year,
}: CreateSelectedDateProductMetricsInput): SafeResult<
  SelectedDateProductMetrics
> {
  try {
    const selectedYearMetrics = productMetricsDocument.yearlyMetrics.find(
      (yearlyMetric) => yearlyMetric.year === year,
    );
    if (!selectedYearMetrics) {
      return createSafeErrorResult(
        "Selected yearly metrics not found",
      );
    }

    const prevYearMetrics = productMetricsDocument.yearlyMetrics.find(
      (yearlyMetric) => yearlyMetric.year === (parseInt(year) - 1).toString(),
    );
    if (!prevYearMetrics) {
      return createSafeErrorResult(
        "Previous yearly metrics not found",
      );
    }

    const selectedMonthMetrics = selectedYearMetrics?.monthlyMetrics.find(
      (monthlyMetric) => monthlyMetric.month === month,
    );
    if (!selectedMonthMetrics) {
      return createSafeErrorResult(
        "Selected monthly metrics not found",
      );
    }

    const prevPrevYearMetrics = productMetricsDocument.yearlyMetrics.find(
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
      return createSafeErrorResult(
        "Previous monthly metrics not found",
      );
    }

    const selectedDayMetrics = selectedMonthMetrics?.dailyMetrics.find(
      (dailyMetric) => dailyMetric.day === day,
    );
    if (!selectedDayMetrics) {
      return createSafeErrorResult(
        "Selected day metrics not found",
      );
    }

    const prevDayMetrics = day === "01"
      ? prevMonthMetrics?.dailyMetrics.reduce<ProductDailyMetric | undefined>(
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
      return createSafeErrorResult(
        "Previous day metrics not found",
      );
    }

    return createSafeSuccessResult({
      dayProductMetrics: { prevDayMetrics, selectedDayMetrics },
      monthProductMetrics: { prevMonthMetrics, selectedMonthMetrics },
      yearProductMetrics: { prevYearMetrics, selectedYearMetrics },
    });
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

type CreateProductMetricsChartsInput = {
  productMetricsDocument: ProductMetricsDocument;
  months: Month[];
  selectedDateProductMetrics: SelectedDateProductMetrics;
};

type ProductMetricsChartKey =
  | "total" // y-axis variables: total
  | "overview" // y-axis variables: online, inStore
  | "online" // y-axis variables: online
  | "inStore"; // y-axis variables: inStore

type ProductMetricsBarCharts = Record<ProductMetricsChartKey, BarChartData[]>; // y-axis variables: total, online, inStore

type ProductMetricsLineCharts = {
  total: { id: "Total"; data: { x: string; y: number }[] }[];
  overview: {
    id: "Online" | "In-Store";
    data: { x: string; y: number }[];
  }[];
  online: { id: "Online"; data: { x: string; y: number }[] }[];
  inStore: { id: "In-Store"; data: { x: string; y: number }[] }[];
};

/**
   * monthlyMetrics: {
      month: string;
      unitsSold: {
        total: number;
        online: number;
        inStore: number;
      };
      revenue: {
        total: number;
        online: number;
        inStore: number;
      }
      dailyMetrics: {
        day: string;
        unitsSold: {
          total: number;
          online: number;
          inStore: number;
        };
        revenue: {
          total: number;
          online: number;
          inStore: number;
        };
      }[];
    }[];
   */

type ProductMetricsCharts = {
  dailyCharts: {
    unitsSold: {
      bar: ProductMetricsBarCharts;
      line: ProductMetricsLineCharts;
      pie: PieChartData[];
    };
    revenue: {
      bar: ProductMetricsBarCharts;
      line: ProductMetricsLineCharts;
      pie: PieChartData[];
    };
  };
  monthlyCharts: {
    unitsSold: {
      bar: ProductMetricsBarCharts;
      line: ProductMetricsLineCharts;
      pie: PieChartData[];
    };
    revenue: {
      bar: ProductMetricsBarCharts;
      line: ProductMetricsLineCharts;
      pie: PieChartData[];
    };
  };
  yearlyCharts: {
    unitsSold: {
      bar: ProductMetricsBarCharts;
      line: ProductMetricsLineCharts;
      pie: PieChartData[];
    };
    revenue: {
      bar: ProductMetricsBarCharts;
      line: ProductMetricsLineCharts;
      pie: PieChartData[];
    };
  };
};

function createProductMetricsChartsSafe({
  productMetricsDocument,
  months,
  selectedDateProductMetrics,
}: CreateProductMetricsChartsInput): SafeResult<ProductMetricsCharts> {
  if (!productMetricsDocument) {
    return createSafeErrorResult(
      "Invalid product metrics document",
    );
  }
  if (!selectedDateProductMetrics) {
    return createSafeErrorResult(
      "Invalid selected date product metrics",
    );
  }

  const BAR_CHART_OBJ_TEMPLATE: ProductMetricsBarCharts = {
    total: [],
    overview: [],
    online: [],
    inStore: [],
  };

  const LINE_CHART_OBJ_TEMPLATE: ProductMetricsLineCharts = {
    total: [{ id: "Total", data: [] }],
    overview: [
      { id: "Online", data: [] },
      { id: "In-Store", data: [] },
    ],
    online: [{ id: "Online", data: [] }],
    inStore: [{ id: "In-Store", data: [] }],
  };

  try {
    const {
      yearProductMetrics: { selectedYearMetrics },
    } = selectedDateProductMetrics;
    const selectedYear = selectedYearMetrics?.year ?? "2023";

    const {
      monthProductMetrics: { selectedMonthMetrics },
    } = selectedDateProductMetrics;
    const selectedMonth = selectedMonthMetrics?.month ?? "January";
    const monthIndex = (months.indexOf(selectedMonth) + 1).toString().padStart(
      2,
      "0",
    );

    const {
      dayProductMetrics: { selectedDayMetrics },
    } = selectedDateProductMetrics;

    const dailyProductChartsResult = createDailyProductChartsSafe({
      barChartsTemplate: BAR_CHART_OBJ_TEMPLATE,
      dailyMetrics: selectedMonthMetrics?.dailyMetrics,
      lineChartsTemplate: LINE_CHART_OBJ_TEMPLATE,
      monthIndex,
      selectedDayMetrics,
      selectedYear,
    });
    if (dailyProductChartsResult.err) {
      return dailyProductChartsResult;
    }
    if (dailyProductChartsResult.val.none) {
      return createSafeErrorResult(
        "No daily product charts found",
      );
    }

    const monthlyProductChartsResult = createMonthlyProductChartsSafe({
      barChartsTemplate: BAR_CHART_OBJ_TEMPLATE,
      lineChartsTemplate: LINE_CHART_OBJ_TEMPLATE,
      monthlyMetrics: selectedYearMetrics?.monthlyMetrics,
      selectedMonthMetrics,
      selectedYear,
    });
    if (monthlyProductChartsResult.err) {
      return monthlyProductChartsResult;
    }
    if (monthlyProductChartsResult.val.none) {
      return createSafeErrorResult(
        "No monthly product charts found",
      );
    }

    const yearlyProductChartsResult = createYearlyProductChartsSafe({
      barChartsTemplate: BAR_CHART_OBJ_TEMPLATE,
      lineChartsTemplate: LINE_CHART_OBJ_TEMPLATE,
      selectedYearMetrics,
      yearlyMetrics: productMetricsDocument.yearlyMetrics,
    });
    if (yearlyProductChartsResult.err) {
      return yearlyProductChartsResult;
    }
    if (yearlyProductChartsResult.val.none) {
      return createSafeErrorResult(
        "No yearly product charts found",
      );
    }

    return createSafeSuccessResult({
      dailyCharts: dailyProductChartsResult.val.val,
      monthlyCharts: monthlyProductChartsResult.val.val,
      yearlyCharts: yearlyProductChartsResult.val.val,
    });
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

type CreateDailyProductChartsInput = {
  barChartsTemplate: ProductMetricsBarCharts;
  dailyMetrics?: ProductDailyMetric[];
  lineChartsTemplate: ProductMetricsLineCharts;
  monthIndex: string;
  selectedDayMetrics?: ProductDailyMetric;
  selectedYear: Year;
};

function createDailyProductChartsSafe({
  barChartsTemplate,
  dailyMetrics,
  lineChartsTemplate,
  selectedDayMetrics,
}: CreateDailyProductChartsInput): SafeResult<
  ProductMetricsCharts["dailyCharts"]
> {
  if (!dailyMetrics) {
    return createSafeErrorResult(
      "Invalid daily metrics",
    );
  }
  if (!selectedDayMetrics) {
    return createSafeErrorResult(
      "Invalid selected day metrics",
    );
  }

  try {
    const [
      dailyUnitsSoldBarCharts,
      dailyUnitsSoldLineCharts,

      dailyRevenueBarCharts,
      dailyRevenueLineCharts,
    ] = dailyMetrics.reduce(
      (dailyProductChartsAcc, dailyProductMetrics) => {
        const [
          dailyUnitsSoldBarChartsAcc,
          dailyUnitsSoldLineChartsAcc,

          dailyRevenueBarChartsAcc,
          dailyRevenueLineChartsAcc,
        ] = dailyProductChartsAcc;

        const { day, unitsSold, revenue } = dailyProductMetrics;

        // daily.unitsSold.bar

        const dailyUnitsSoldTotalBarChart: BarChartData = {
          Days: day,
          Total: unitsSold.total,
        };
        dailyUnitsSoldBarChartsAcc.total.push(dailyUnitsSoldTotalBarChart);

        const dailyUnitsSoldOverviewBarChart: BarChartData = {
          Days: day,
          "In-Store": unitsSold.inStore,
          Online: unitsSold.online,
        };
        dailyUnitsSoldBarChartsAcc.overview.push(
          dailyUnitsSoldOverviewBarChart,
        );

        const dailyUnitsSoldOnlineBarChart: BarChartData = {
          Days: day,
          Online: unitsSold.online,
        };
        dailyUnitsSoldBarChartsAcc.online.push(dailyUnitsSoldOnlineBarChart);

        const dailyUnitsSoldInStoreBarChart: BarChartData = {
          Days: day,
          "In-Store": unitsSold.inStore,
        };
        dailyUnitsSoldBarChartsAcc.inStore.push(
          dailyUnitsSoldInStoreBarChart,
        );

        // daily.unitsSold.line

        const dailyUnitsSoldTotalLineChart = {
          x: day,
          y: unitsSold.total,
        };
        dailyUnitsSoldLineChartsAcc.total
          .find((lineChartObj: LineChartData) => lineChartObj.id === "Total")
          ?.data.push(dailyUnitsSoldTotalLineChart);

        const dailyUnitsSoldOverviewOnlineLineChart = {
          x: day,
          y: unitsSold.online,
        };
        dailyUnitsSoldLineChartsAcc.overview
          .find((lineChartObj: LineChartData) => lineChartObj.id === "Online")
          ?.data.push(dailyUnitsSoldOverviewOnlineLineChart);

        const dailyUnitsSoldOverviewInStoreLineChart = {
          x: day,
          y: unitsSold.inStore,
        };
        dailyUnitsSoldLineChartsAcc.overview
          .find((lineChartObj: LineChartData) => lineChartObj.id === "In-Store")
          ?.data.push(dailyUnitsSoldOverviewInStoreLineChart);

        const dailyUnitsSoldOnlineLineChart = {
          x: day,
          y: unitsSold.online,
        };
        dailyUnitsSoldLineChartsAcc.online
          .find((lineChartObj: LineChartData) => lineChartObj.id === "Online")
          ?.data.push(dailyUnitsSoldOnlineLineChart);

        const dailyUnitsSoldInStoreLineChart = {
          x: day,
          y: unitsSold.inStore,
        };
        dailyUnitsSoldLineChartsAcc.inStore
          .find((lineChartObj: LineChartData) => lineChartObj.id === "In-Store")
          ?.data.push(dailyUnitsSoldInStoreLineChart);

        // daily.revenue.bar

        const dailyRevenueTotalBarChart: BarChartData = {
          Days: day,
          Total: revenue.total,
        };
        dailyRevenueBarChartsAcc.total.push(dailyRevenueTotalBarChart);

        const dailyRevenueOverviewBarChart: BarChartData = {
          Days: day,
          "In-Store": revenue.inStore,
          Online: revenue.online,
        };
        dailyRevenueBarChartsAcc.overview.push(dailyRevenueOverviewBarChart);

        const dailyRevenueOnlineBarChart: BarChartData = {
          Days: day,
          Online: revenue.online,
        };
        dailyRevenueBarChartsAcc.online.push(dailyRevenueOnlineBarChart);

        const dailyRevenueInStoreBarChart: BarChartData = {
          Days: day,
          "In-Store": revenue.inStore,
        };
        dailyRevenueBarChartsAcc.inStore.push(dailyRevenueInStoreBarChart);

        // daily.revenue.line

        const dailyRevenueTotalLineChart = {
          x: day,
          y: revenue.total,
        };
        dailyRevenueLineChartsAcc.total
          .find((lineChartObj: LineChartData) => lineChartObj.id === "Total")
          ?.data.push(dailyRevenueTotalLineChart);

        const dailyRevenueOverviewOnlineLineChart = {
          x: day,
          y: revenue.online,
        };
        dailyRevenueLineChartsAcc.overview
          .find((lineChartObj: LineChartData) => lineChartObj.id === "Online")
          ?.data.push(dailyRevenueOverviewOnlineLineChart);

        const dailyRevenueOverviewInStoreLineChart = {
          x: day,
          y: revenue.inStore,
        };
        dailyRevenueLineChartsAcc.overview
          .find((lineChartObj: LineChartData) => lineChartObj.id === "In-Store")
          ?.data.push(dailyRevenueOverviewInStoreLineChart);

        const dailyRevenueOnlineLineChart = {
          x: day,
          y: revenue.online,
        };
        dailyRevenueLineChartsAcc.online
          .find((lineChartObj: LineChartData) => lineChartObj.id === "Online")
          ?.data.push(dailyRevenueOnlineLineChart);

        const dailyRevenueInStoreLineChart = {
          x: day,
          y: revenue.inStore,
        };
        dailyRevenueLineChartsAcc.inStore
          .find((lineChartObj: LineChartData) => lineChartObj.id === "In-Store")
          ?.data.push(dailyRevenueInStoreLineChart);

        return dailyProductChartsAcc;
      },
      [
        structuredClone(barChartsTemplate),
        structuredClone(lineChartsTemplate),

        structuredClone(barChartsTemplate),
        structuredClone(lineChartsTemplate),
      ],
    );

    const dailyRevenuePieCharts: PieChartData[] = [
      {
        id: "In-Store",
        label: "In-Store",
        value: selectedDayMetrics.revenue.inStore,
      },
      {
        id: "Online",
        label: "Online",
        value: selectedDayMetrics.revenue.online,
      },
    ];

    const dailyUnitsSoldPieCharts: PieChartData[] = [
      {
        id: "In-Store",
        label: "In-Store",
        value: selectedDayMetrics.unitsSold.inStore,
      },
      {
        id: "Online",
        label: "Online",
        value: selectedDayMetrics.unitsSold.online,
      },
    ];

    return createSafeSuccessResult({
      revenue: {
        bar: dailyRevenueBarCharts,
        line: dailyRevenueLineCharts,
        pie: dailyRevenuePieCharts,
      },
      unitsSold: {
        bar: dailyUnitsSoldBarCharts,
        line: dailyUnitsSoldLineCharts,
        pie: dailyUnitsSoldPieCharts,
      },
    });
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

type CreateMonthlyProductChartsInput = {
  barChartsTemplate: ProductMetricsBarCharts;
  lineChartsTemplate: ProductMetricsLineCharts;
  monthlyMetrics?: ProductMonthlyMetric[];
  selectedMonthMetrics?: ProductMonthlyMetric;
  selectedYear: Year;
};

function createMonthlyProductChartsSafe({
  barChartsTemplate,
  lineChartsTemplate,
  monthlyMetrics,
  selectedMonthMetrics,
  selectedYear,
}: CreateMonthlyProductChartsInput): SafeResult<
  ProductMetricsCharts["monthlyCharts"]
> {
  if (!monthlyMetrics) {
    return createSafeErrorResult(
      "Invalid monthly metrics",
    );
  }
  if (!selectedMonthMetrics) {
    return createSafeErrorResult(
      "Invalid selected month metrics",
    );
  }

  try {
    const [
      monthlyUnitsSoldBarChartsObj,
      monthlyUnitsSoldLineChartsObj,

      monthlyRevenueBarChartsObj,
      monthlyRevenueLineChartsObj,
    ] = monthlyMetrics.reduce(
      (monthlyProductChartsAcc, monthlyProductMetrics) => {
        const [
          monthlyUnitsSoldBarChartsAcc,
          monthlyUnitsSoldLineChartsAcc,

          monthlyRevenueBarChartsAcc,
          monthlyRevenueLineChartsAcc,
        ] = monthlyProductChartsAcc;

        const { month, unitsSold, revenue } = monthlyProductMetrics;

        // prevents current month of current year from being added to charts
        const currentYear = new Date().getFullYear().toString();
        const isCurrentYear = selectedYear === currentYear;
        const currentMonth = new Date().toLocaleString("default", {
          month: "long",
        });
        const isCurrentMonth = month === currentMonth;

        if (isCurrentYear && isCurrentMonth) {
          return monthlyProductChartsAcc;
        }

        // monthly.unitsSold.bar

        const monthlyUnitsSoldTotalBarChart: BarChartData = {
          Months: month,
          Total: unitsSold.total,
        };
        monthlyUnitsSoldBarChartsAcc.total.push(
          monthlyUnitsSoldTotalBarChart,
        );

        const monthlyUnitsSoldOverviewBarChart: BarChartData = {
          Months: month,
          "In-Store": unitsSold.inStore,
          Online: unitsSold.online,
        };
        monthlyUnitsSoldBarChartsAcc.overview.push(
          monthlyUnitsSoldOverviewBarChart,
        );

        const monthlyUnitsSoldOnlineBarChart: BarChartData = {
          Months: month,
          Online: unitsSold.online,
        };
        monthlyUnitsSoldBarChartsAcc.online.push(
          monthlyUnitsSoldOnlineBarChart,
        );

        const monthlyUnitsSoldInStoreBarChart: BarChartData = {
          Months: month,
          "In-Store": unitsSold.inStore,
        };
        monthlyUnitsSoldBarChartsAcc.inStore.push(
          monthlyUnitsSoldInStoreBarChart,
        );

        // monthly.unitsSold.line

        const monthlyUnitsSoldTotalLineChart = {
          x: month,
          y: unitsSold.total,
        };
        monthlyUnitsSoldLineChartsAcc.total
          .find((lineChartObj: LineChartData) => lineChartObj.id === "Total")
          ?.data.push(monthlyUnitsSoldTotalLineChart);

        const monthlyUnitsSoldOverviewOnlineLineChart = {
          x: month,
          y: unitsSold.online,
        };
        monthlyUnitsSoldLineChartsAcc.overview
          .find((lineChartObj: LineChartData) => lineChartObj.id === "Online")
          ?.data.push(monthlyUnitsSoldOverviewOnlineLineChart);

        const monthlyUnitsSoldOverviewInStoreLineChart = {
          x: month,
          y: unitsSold.inStore,
        };
        monthlyUnitsSoldLineChartsAcc.overview
          .find((lineChartObj: LineChartData) => lineChartObj.id === "In-Store")
          ?.data.push(monthlyUnitsSoldOverviewInStoreLineChart);

        const monthlyUnitsSoldOnlineLineChart = {
          x: month,
          y: unitsSold.online,
        };
        monthlyUnitsSoldLineChartsAcc.online
          .find((lineChartObj: LineChartData) => lineChartObj.id === "Online")
          ?.data.push(monthlyUnitsSoldOnlineLineChart);

        const monthlyUnitsSoldInStoreLineChart = {
          x: month,
          y: unitsSold.inStore,
        };
        monthlyUnitsSoldLineChartsAcc.inStore
          .find((lineChartObj: LineChartData) => lineChartObj.id === "In-Store")
          ?.data.push(monthlyUnitsSoldInStoreLineChart);

        // monthly.revenue.bar

        const monthlyRevenueTotalBarChart: BarChartData = {
          Months: month,
          Total: revenue.total,
        };
        monthlyRevenueBarChartsAcc.total.push(monthlyRevenueTotalBarChart);

        const monthlyRevenueOverviewBarChart: BarChartData = {
          Months: month,
          "In-Store": revenue.inStore,
          Online: revenue.online,
        };
        monthlyRevenueBarChartsAcc.overview.push(
          monthlyRevenueOverviewBarChart,
        );

        const monthlyRevenueOnlineBarChart: BarChartData = {
          Months: month,
          Online: revenue.online,
        };
        monthlyRevenueBarChartsAcc.online.push(monthlyRevenueOnlineBarChart);

        const monthlyRevenueInStoreBarChart: BarChartData = {
          Months: month,
          "In-Store": revenue.inStore,
        };
        monthlyRevenueBarChartsAcc.inStore.push(
          monthlyRevenueInStoreBarChart,
        );

        // monthly.revenue.line

        const monthlyRevenueTotalLineChart = {
          x: month,
          y: revenue.total,
        };
        monthlyRevenueLineChartsAcc.total
          .find((lineChartObj: LineChartData) => lineChartObj.id === "Total")
          ?.data.push(monthlyRevenueTotalLineChart);

        const monthlyRevenueOverviewOnlineLineChart = {
          x: month,
          y: revenue.online,
        };
        monthlyRevenueLineChartsAcc.overview
          .find((lineChartObj: LineChartData) => lineChartObj.id === "Online")
          ?.data.push(monthlyRevenueOverviewOnlineLineChart);

        const monthlyRevenueOverviewInStoreLineChart = {
          x: month,
          y: revenue.inStore,
        };
        monthlyRevenueLineChartsAcc.overview
          .find((lineChartObj: LineChartData) => lineChartObj.id === "In-Store")
          ?.data.push(monthlyRevenueOverviewInStoreLineChart);

        const monthlyRevenueOnlineLineChart = {
          x: month,
          y: revenue.online,
        };
        monthlyRevenueLineChartsAcc.online
          .find((lineChartObj: LineChartData) => lineChartObj.id === "Online")
          ?.data.push(monthlyRevenueOnlineLineChart);

        const monthlyRevenueInStoreLineChart = {
          x: month,
          y: revenue.inStore,
        };
        monthlyRevenueLineChartsAcc.inStore
          .find((lineChartObj: LineChartData) => lineChartObj.id === "In-Store")
          ?.data.push(monthlyRevenueInStoreLineChart);

        return monthlyProductChartsAcc;
      },
      [
        structuredClone(barChartsTemplate),
        structuredClone(lineChartsTemplate),

        structuredClone(barChartsTemplate),
        structuredClone(lineChartsTemplate),
      ],
    );

    const monthlyRevenuePieCharts: PieChartData[] = [
      {
        id: "In-Store",
        label: "In-Store",
        value: selectedMonthMetrics.revenue.inStore,
      },
      {
        id: "Online",
        label: "Online",
        value: selectedMonthMetrics.revenue.online,
      },
    ];

    const monthlyUnitsSoldPieCharts: PieChartData[] = [
      {
        id: "In-Store",
        label: "In-Store",
        value: selectedMonthMetrics.unitsSold.inStore,
      },
      {
        id: "Online",
        label: "Online",
        value: selectedMonthMetrics.unitsSold.online,
      },
    ];

    return createSafeSuccessResult({
      revenue: {
        bar: monthlyRevenueBarChartsObj,
        line: monthlyRevenueLineChartsObj,
        pie: monthlyRevenuePieCharts,
      },
      unitsSold: {
        bar: monthlyUnitsSoldBarChartsObj,
        line: monthlyUnitsSoldLineChartsObj,
        pie: monthlyUnitsSoldPieCharts,
      },
    });
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

type CreateYearlyProductChartsInput = {
  barChartsTemplate: ProductMetricsBarCharts;
  lineChartsTemplate: ProductMetricsLineCharts;
  selectedYearMetrics?: ProductYearlyMetric;
  yearlyMetrics?: ProductYearlyMetric[];
};

function createYearlyProductChartsSafe({
  barChartsTemplate,
  lineChartsTemplate,
  selectedYearMetrics,
  yearlyMetrics,
}: CreateYearlyProductChartsInput): SafeResult<
  ProductMetricsCharts["yearlyCharts"]
> {
  if (!yearlyMetrics) {
    return createSafeErrorResult(
      "Invalid yearly metrics",
    );
  }
  if (!selectedYearMetrics) {
    return createSafeErrorResult(
      "Invalid selected year metrics",
    );
  }

  try {
    const [
      yearlyUnitsSoldBarChartsObj,
      yearlyUnitsSoldLineChartsObj,
      yearlyRevenueBarChartsObj,
      yearlyRevenueLineChartsObj,
    ] = yearlyMetrics.reduce(
      (yearlyProductChartsAcc, yearlyProductMetrics) => {
        const [
          yearlyUnitsSoldBarChartsAcc,
          yearlyUnitsSoldLineChartsAcc,
          yearlyRevenueBarChartsAcc,
          yearlyRevenueLineChartsAcc,
        ] = yearlyProductChartsAcc;

        const { year, unitsSold, revenue } = yearlyProductMetrics;

        // prevents current year from being added to charts
        const currentYear = new Date().getFullYear();
        if (year === currentYear.toString()) {
          return yearlyProductChartsAcc;
        }

        // yearly.unitsSold.bar

        const yearlyUnitsSoldTotalBarChart: BarChartData = {
          Years: year,
          Total: unitsSold.total,
        };
        yearlyUnitsSoldBarChartsAcc.total.push(yearlyUnitsSoldTotalBarChart);

        const yearlyUnitsSoldOverviewBarChart: BarChartData = {
          Years: year,
          "In-Store": unitsSold.inStore,
          Online: unitsSold.online,
        };
        yearlyUnitsSoldBarChartsAcc.overview.push(
          yearlyUnitsSoldOverviewBarChart,
        );

        const yearlyUnitsSoldOnlineBarChart: BarChartData = {
          Years: year,
          Online: unitsSold.online,
        };
        yearlyUnitsSoldBarChartsAcc.online.push(
          yearlyUnitsSoldOnlineBarChart,
        );

        const yearlyUnitsSoldInStoreBarChart: BarChartData = {
          Years: year,
          "In-Store": unitsSold.inStore,
        };
        yearlyUnitsSoldBarChartsAcc.inStore.push(
          yearlyUnitsSoldInStoreBarChart,
        );

        // yearly.unitsSold.line

        const yearlyUnitsSoldTotalLineChart = {
          x: year,
          y: unitsSold.total,
        };
        yearlyUnitsSoldLineChartsAcc.total
          .find((lineChartObj: LineChartData) => lineChartObj.id === "Total")
          ?.data.push(yearlyUnitsSoldTotalLineChart);

        const yearlyUnitsSoldOverviewOnlineLineChart = {
          x: year,
          y: unitsSold.online,
        };
        yearlyUnitsSoldLineChartsAcc.overview
          .find((lineChartObj: LineChartData) => lineChartObj.id === "Online")
          ?.data.push(yearlyUnitsSoldOverviewOnlineLineChart);

        const yearlyUnitsSoldOverviewInStoreLineChart = {
          x: year,
          y: unitsSold.inStore,
        };
        yearlyUnitsSoldLineChartsAcc.overview
          .find((lineChartObj: LineChartData) => lineChartObj.id === "In-Store")
          ?.data.push(yearlyUnitsSoldOverviewInStoreLineChart);

        const yearlyUnitsSoldOnlineLineChart = {
          x: year,
          y: unitsSold.online,
        };
        yearlyUnitsSoldLineChartsAcc.online
          .find((lineChartObj: LineChartData) => lineChartObj.id === "Online")
          ?.data.push(yearlyUnitsSoldOnlineLineChart);

        const yearlyUnitsSoldInStoreLineChart = {
          x: year,
          y: unitsSold.inStore,
        };
        yearlyUnitsSoldLineChartsAcc.inStore
          .find((lineChartObj: LineChartData) => lineChartObj.id === "In-Store")
          ?.data.push(yearlyUnitsSoldInStoreLineChart);

        // yearly.revenue.bar

        const yearlyRevenueTotalBarChart: BarChartData = {
          Years: year,
          Total: revenue.total,
        };
        yearlyRevenueBarChartsAcc.total.push(yearlyRevenueTotalBarChart);

        const yearlyRevenueOverviewBarChart: BarChartData = {
          Years: year,
          "In-Store": revenue.inStore,
          Online: revenue.online,
        };
        yearlyRevenueBarChartsAcc.overview.push(
          yearlyRevenueOverviewBarChart,
        );

        const yearlyRevenueOnlineBarChart: BarChartData = {
          Years: year,
          Online: revenue.online,
        };
        yearlyRevenueBarChartsAcc.online.push(yearlyRevenueOnlineBarChart);

        const yearlyRevenueInStoreBarChart: BarChartData = {
          Years: year,
          "In-Store": revenue.inStore,
        };
        yearlyRevenueBarChartsAcc.inStore.push(yearlyRevenueInStoreBarChart);

        // yearly.revenue.line

        const yearlyRevenueTotalLineChart = {
          x: year,
          y: revenue.total,
        };
        yearlyRevenueLineChartsAcc.total
          .find((lineChartObj: LineChartData) => lineChartObj.id === "Total")
          ?.data.push(yearlyRevenueTotalLineChart);

        const yearlyRevenueOverviewOnlineLineChart = {
          x: year,
          y: revenue.online,
        };
        yearlyRevenueLineChartsAcc.overview
          .find((lineChartObj: LineChartData) => lineChartObj.id === "Online")
          ?.data.push(yearlyRevenueOverviewOnlineLineChart);

        const yearlyRevenueOverviewInStoreLineChart = {
          x: year,
          y: revenue.inStore,
        };
        yearlyRevenueLineChartsAcc.overview
          .find((lineChartObj: LineChartData) => lineChartObj.id === "In-Store")
          ?.data.push(yearlyRevenueOverviewInStoreLineChart);

        const yearlyRevenueOnlineLineChart = {
          x: year,
          y: revenue.online,
        };
        yearlyRevenueLineChartsAcc.online
          .find((lineChartObj: LineChartData) => lineChartObj.id === "Online")
          ?.data.push(yearlyRevenueOnlineLineChart);

        const yearlyRevenueInStoreLineChart = {
          x: year,
          y: revenue.inStore,
        };
        yearlyRevenueLineChartsAcc.inStore
          .find((lineChartObj: LineChartData) => lineChartObj.id === "In-Store")
          ?.data.push(yearlyRevenueInStoreLineChart);

        return yearlyProductChartsAcc;
      },
      [
        structuredClone(barChartsTemplate),
        structuredClone(lineChartsTemplate),

        structuredClone(barChartsTemplate),
        structuredClone(lineChartsTemplate),
      ],
    );

    const yearlyRevenuePieCharts: PieChartData[] = [
      {
        id: "In-Store",
        label: "In-Store",
        value: selectedYearMetrics.revenue.inStore,
      },
      {
        id: "Online",
        label: "Online",
        value: selectedYearMetrics.revenue.online,
      },
    ];

    const yearlyUnitsSoldPieCharts: PieChartData[] = [
      {
        id: "In-Store",
        label: "In-Store",
        value: selectedYearMetrics.unitsSold.inStore,
      },
      {
        id: "Online",
        label: "Online",
        value: selectedYearMetrics.unitsSold.online,
      },
    ];

    return createSafeSuccessResult({
      revenue: {
        bar: yearlyRevenueBarChartsObj,
        line: yearlyRevenueLineChartsObj,
        pie: yearlyRevenuePieCharts,
      },
      unitsSold: {
        bar: yearlyUnitsSoldBarChartsObj,
        line: yearlyUnitsSoldLineChartsObj,
        pie: yearlyUnitsSoldPieCharts,
      },
    });
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

type ProductMetricsCalendarChartsKey = "total" | "online" | "inStore";
type ProductMetricsCalendarCharts = {
  revenue: {
    total: CalendarChartData[];
    online: CalendarChartData[];
    inStore: CalendarChartData[];
  };
  unitsSold: {
    total: CalendarChartData[];
    online: CalendarChartData[];
    inStore: CalendarChartData[];
  };
};

function createProductMetricsCalendarChartsSafe(
  calendarView: DashboardCalendarView,
  selectedDateProductMetrics: SelectedDateProductMetrics,
  selectedYYYYMMDD: string,
): SafeResult<{
  currentYear: ProductMetricsCalendarCharts;
  previousYear: ProductMetricsCalendarCharts;
}> {
  if (!selectedDateProductMetrics) {
    return createSafeErrorResult(
      "Invalid selected date product metrics",
    );
  }

  const productMetricsCalendarChartsTemplate: ProductMetricsCalendarCharts = {
    revenue: {
      total: [],
      online: [],
      inStore: [],
    },
    unitsSold: {
      total: [],
      online: [],
      inStore: [],
    },
  };

  try {
    const { yearProductMetrics: { selectedYearMetrics, prevYearMetrics } } =
      selectedDateProductMetrics;

    const [currentYear, previousYear] = [
      createDailyProductMetricsCalendarCharts(
        selectedYearMetrics,
        structuredClone(productMetricsCalendarChartsTemplate),
      ),
      createDailyProductMetricsCalendarCharts(
        prevYearMetrics,
        structuredClone(productMetricsCalendarChartsTemplate),
      ),
    ];

    function createDailyProductMetricsCalendarCharts(
      yearlyMetrics: ProductYearlyMetric | undefined,
      calendarChartsTemplate: ProductMetricsCalendarCharts,
    ): ProductMetricsCalendarCharts {
      if (!yearlyMetrics) {
        return calendarChartsTemplate;
      }

      let selectedMetrics: Array<ProductMonthlyMetric> = [];

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

      const productMetricsCalendarCharts = selectedMetrics
        .reduce((resultAcc, monthlyMetric) => {
          const { month, dailyMetrics } = monthlyMetric;
          const monthNumber = MONTHS.indexOf(month) + 1;

          dailyMetrics.forEach((dailyMetric) => {
            const { revenue, unitsSold } = dailyMetric;
            const day = `${yearlyMetrics.year}-${
              monthNumber.toString().padStart(2, "0")
            }-${dailyMetric.day}`;

            // revenue

            resultAcc.revenue.total.push({
              day,
              value: revenue.total,
            });

            resultAcc.revenue.online.push({
              day,
              value: revenue.online,
            });

            resultAcc.revenue.inStore.push({
              day,
              value: revenue.inStore,
            });

            // unitsSold

            resultAcc.unitsSold.total.push({
              day,
              value: unitsSold.total,
            });

            resultAcc.unitsSold.online.push({
              day,
              value: unitsSold.online,
            });

            resultAcc.unitsSold.inStore.push({
              day,
              value: unitsSold.inStore,
            });
          });

          return resultAcc;
        }, calendarChartsTemplate);

      return productMetricsCalendarCharts;
    }

    return createSafeSuccessResult({
      currentYear,
      previousYear,
    });
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

export {
  createProductMetricsCalendarChartsSafe,
  createProductMetricsChartsSafe,
  returnSelectedDateProductMetricsSafe,
};
export type {
  ProductMetricsBarCharts,
  ProductMetricsCalendarCharts,
  ProductMetricsCalendarChartsKey,
  ProductMetricsChartKey,
  ProductMetricsCharts,
  ProductMetricsLineCharts,
  SelectedDateProductMetrics,
};
