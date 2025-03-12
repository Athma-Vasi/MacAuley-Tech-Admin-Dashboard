import { toFixedFloat } from "../../../utils";
import { BarChartData } from "../../charts/responsiveBarChart/types";
import { LineChartData } from "../../charts/responsiveLineChart/types";
import { PieChartData } from "../../charts/responsivePieChart/types";
import {
  BusinessMetric,
  BusinessMetricStoreLocation,
  DailyFinancialMetric,
  DashboardCalendarView,
  Month,
  MonthlyFinancialMetric,
  Year,
  YearlyFinancialMetric,
} from "../types";

type SelectedDateFinancialMetrics = {
  dayFinancialMetrics: {
    selectedDayMetrics?: DailyFinancialMetric;
    prevDayMetrics?: DailyFinancialMetric;
  };
  monthFinancialMetrics: {
    selectedMonthMetrics?: MonthlyFinancialMetric;
    prevMonthMetrics?: MonthlyFinancialMetric;
  };
  yearFinancialMetrics: {
    selectedYearMetrics?: YearlyFinancialMetric;
    prevYearMetrics?: YearlyFinancialMetric;
  };
};

function returnSelectedDateFinancialMetrics({
  businessMetrics,
  day,
  month,
  months,
  storeLocation,
  year,
}: {
  businessMetrics: BusinessMetric[];
  day: string;
  month: Month;
  months: Month[];
  storeLocation: BusinessMetricStoreLocation;
  year: Year;
}): SelectedDateFinancialMetrics {
  const currentStoreMetrics = businessMetrics.find(
    (businessMetric) => businessMetric.storeLocation === storeLocation
  );

  const selectedYearMetrics = currentStoreMetrics?.financialMetrics.find(
    (yearlyMetric) => yearlyMetric.year === year
  );
  const prevYearMetrics = currentStoreMetrics?.financialMetrics.find(
    (yearlyMetric) => yearlyMetric.year === (parseInt(year) - 1).toString()
  );

  const selectedMonthMetrics = selectedYearMetrics?.monthlyMetrics.find(
    (monthlyMetric) => monthlyMetric.month === month
  );
  const prevPrevYearMetrics = currentStoreMetrics?.financialMetrics.find(
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
      ? prevMonthMetrics?.dailyMetrics.reduce<DailyFinancialMetric | undefined>(
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
    yearFinancialMetrics: { selectedYearMetrics, prevYearMetrics },
    monthFinancialMetrics: { selectedMonthMetrics, prevMonthMetrics },
    dayFinancialMetrics: { selectedDayMetrics, prevDayMetrics },
  };
}

type ReturnFinancialMetricsChartsInput = {
  businessMetrics: BusinessMetric[];
  months: Month[];
  selectedDateFinancialMetrics: SelectedDateFinancialMetrics;
  storeLocation: BusinessMetricStoreLocation;
};

/**
 * dailyMetrics: {
        day: string;
        averageOrderValue: number;
        conversionRate: number;
        netProfitMargin: number;
      
        expenses: {
          total: number;
          repair: number;
          sales: {
            total: number;
            inStore: number;
            online: number;
          };
        };
      
        profit: {
          total: number;
          repair: number;
          sales: {
            total: number;
            inStore: number;
            online: number;
          };
        };
      
        revenue: {
          total: number;
          repair: number;
          sales: {
            total: number;
            inStore: number;
            online: number;
          };
        };
      
        transactions: {
          total: number;
          repair: number;
          sales: {
            total: number;
            inStore: number;
            online: number;
          };
        };                     
      }[];
 */

type FinancialMetricsBarLineChartsKey =
  | "total" // y-axis variables: total
  | "all" // y-axis variables: repair, in-store, online
  | "overview" // y-axis variables: sales, repair
  | "repair" // y-axis variables: repair
  | "sales" // y-axis variables: in-store, online
  | "inStore" // y-axis variables: in-store
  | "online"; // y-axis variables: online

type FinancialMetricsBarCharts = Record<FinancialMetricsBarLineChartsKey, BarChartData[]>; // y-axis variables: total, repair, in-store, online

type FinancialMetricLineCharts = {
  total: { id: "Total"; data: { x: string; y: number }[] }[];
  all: {
    id: "Repair" | "In Store" | "Online";
    data: { x: string; y: number }[];
  }[];
  overview: {
    id: "Repair" | "Sales";
    data: { x: string; y: number }[];
  }[];
  repair: { id: "Repair"; data: { x: string; y: number }[] }[];
  sales: {
    id: "In Store" | "Online";
    data: { x: string; y: number }[];
  }[];
  inStore: { id: "In Store"; data: { x: string; y: number }[] }[];
  online: { id: "Online"; data: { x: string; y: number }[] }[];
}; // y-axis variables: total, repair, in-store, online

type FinancialMetricsOtherMetricsChartsKey =
  | "averageOrderValue" // y-axis variables: average order value
  | "conversionRate" // y-axis variables: conversion rate
  | "netProfitMargin"; // y-axis variables: net profit margin

type FinancialOtherMetricsBarCharts = Record<
  FinancialMetricsOtherMetricsChartsKey,
  BarChartData[]
>; // y-axis variables: average order value, conversion rate, net profit margin

type FinancialOtherMetricsLineCharts = {
  averageOrderValue: {
    id: "Average Order Value";
    data: { x: string; y: number }[];
  }[];
  conversionRate: { id: "Conversion Rate"; data: { x: string; y: number }[] }[];
  netProfitMargin: {
    id: "Net Profit Margin";
    data: { x: string; y: number }[];
  }[];
}; // y-axis variables: average order value, conversion rate, net profit margin

type FinancialMetricsPieChartsKey =
  | "overview" // y-axis variables: repair, sales
  | "all" // y-axis variables: repair, in-store, online
  | "sales"; // y-axis variables: in-store, online

type FinancialMetricsPieCharts = Record<FinancialMetricsPieChartsKey, PieChartData[]>; // y-axis variables: repair, sales, in-store, online

type FinancialMetricsCharts = {
  dailyCharts: {
    profit: {
      bar: FinancialMetricsBarCharts;
      line: FinancialMetricLineCharts;
      pie: FinancialMetricsPieCharts;
    };
    expenses: {
      bar: FinancialMetricsBarCharts;
      line: FinancialMetricLineCharts;
      pie: FinancialMetricsPieCharts;
    };
    revenue: {
      bar: FinancialMetricsBarCharts;
      line: FinancialMetricLineCharts;
      pie: FinancialMetricsPieCharts;
    };
    transactions: {
      bar: FinancialMetricsBarCharts;
      line: FinancialMetricLineCharts;
      pie: FinancialMetricsPieCharts;
    };
    otherMetrics: {
      bar: FinancialOtherMetricsBarCharts;
      line: FinancialOtherMetricsLineCharts;
    };
  };
  monthlyCharts: {
    profit: {
      bar: FinancialMetricsBarCharts;
      line: FinancialMetricLineCharts;
      pie: FinancialMetricsPieCharts;
    };
    expenses: {
      bar: FinancialMetricsBarCharts;
      line: FinancialMetricLineCharts;
      pie: FinancialMetricsPieCharts;
    };
    revenue: {
      bar: FinancialMetricsBarCharts;
      line: FinancialMetricLineCharts;
      pie: FinancialMetricsPieCharts;
    };
    transactions: {
      bar: FinancialMetricsBarCharts;
      line: FinancialMetricLineCharts;
      pie: FinancialMetricsPieCharts;
    };
    otherMetrics: {
      bar: FinancialOtherMetricsBarCharts;
      line: FinancialOtherMetricsLineCharts;
    };
  };
  yearlyCharts: {
    profit: {
      bar: FinancialMetricsBarCharts;
      line: FinancialMetricLineCharts;
      pie: FinancialMetricsPieCharts;
    };
    expenses: {
      bar: FinancialMetricsBarCharts;
      line: FinancialMetricLineCharts;
      pie: FinancialMetricsPieCharts;
    };
    revenue: {
      bar: FinancialMetricsBarCharts;
      line: FinancialMetricLineCharts;
      pie: FinancialMetricsPieCharts;
    };
    transactions: {
      bar: FinancialMetricsBarCharts;
      line: FinancialMetricLineCharts;
      pie: FinancialMetricsPieCharts;
    };
    otherMetrics: {
      bar: FinancialOtherMetricsBarCharts;
      line: FinancialOtherMetricsLineCharts;
    };
  };
};

async function createFinancialMetricsCharts({
  businessMetrics,
  months,
  selectedDateFinancialMetrics,
  storeLocation,
}: ReturnFinancialMetricsChartsInput): Promise<FinancialMetricsCharts> {
  const {
    yearFinancialMetrics: { selectedYearMetrics },
  } = selectedDateFinancialMetrics;
  const selectedYear = selectedYearMetrics?.year ?? "2023";

  const {
    monthFinancialMetrics: { selectedMonthMetrics },
  } = selectedDateFinancialMetrics;

  const {
    dayFinancialMetrics: { selectedDayMetrics },
  } = selectedDateFinancialMetrics;

  const BAR_CHARTS_TEMPLATE: FinancialMetricsBarCharts = {
    total: [],
    all: [],
    overview: [],
    repair: [],
    sales: [],
    inStore: [],
    online: [],
  };

  const LINE_CHARTS_TEMPLATE: FinancialMetricLineCharts = {
    total: [{ id: "Total", data: [] }],
    all: [
      { id: "Repair", data: [] },
      { id: "In Store", data: [] },
      { id: "Online", data: [] },
    ],
    overview: [
      { id: "Repair", data: [] },
      { id: "Sales", data: [] },
    ],
    repair: [{ id: "Repair", data: [] }],
    sales: [
      { id: "In Store", data: [] },
      { id: "Online", data: [] },
    ],
    inStore: [{ id: "In Store", data: [] }],
    online: [{ id: "Online", data: [] }],
  };

  const OTHER_METRICS_BAR_CHARTS_TEMPLATE: FinancialOtherMetricsBarCharts = {
    averageOrderValue: [],
    conversionRate: [],
    netProfitMargin: [],
  };

  const OTHER_METRICS_LINE_CHARTS_TEMPLATE: FinancialOtherMetricsLineCharts = {
    averageOrderValue: [{ id: "Average Order Value", data: [] }],
    conversionRate: [{ id: "Conversion Rate", data: [] }],
    netProfitMargin: [{ id: "Net Profit Margin", data: [] }],
  };

  const PIE_CHARTS_TEMPLATE: FinancialMetricsPieCharts = {
    overview: [],
    all: [],
    sales: [],
  };

  // selected store's business metrics
  const currentStoreMetrics = businessMetrics.find(
    (businessMetric) => businessMetric.storeLocation === storeLocation
  );

  const [dailyFinancialCharts, monthlyFinancialCharts, yearlyFinancialCharts] =
    await Promise.all([
      createDailyFinancialCharts({
        barChartsTemplate: BAR_CHARTS_TEMPLATE,
        dailyMetrics: selectedMonthMetrics?.dailyMetrics,
        lineChartsTemplate: LINE_CHARTS_TEMPLATE,
        otherMetricsBarChartsTemplate: OTHER_METRICS_BAR_CHARTS_TEMPLATE,
        otherMetricsLineChartsTemplate: OTHER_METRICS_LINE_CHARTS_TEMPLATE,
        pieChartsTemplate: PIE_CHARTS_TEMPLATE,
        selectedDayMetrics,
      }),
      createMonthlyFinancialCharts({
        barChartsTemplate: BAR_CHARTS_TEMPLATE,
        lineChartsTemplate: LINE_CHARTS_TEMPLATE,
        otherMetricsBarChartsTemplate: OTHER_METRICS_BAR_CHARTS_TEMPLATE,
        otherMetricsLineChartsTemplate: OTHER_METRICS_LINE_CHARTS_TEMPLATE,
        pieChartsTemplate: PIE_CHARTS_TEMPLATE,
        months,
        selectedYear,
        monthlyMetrics: selectedYearMetrics?.monthlyMetrics,
        selectedMonthMetrics,
      }),
      createYearlyFinancialCharts({
        barChartsTemplate: BAR_CHARTS_TEMPLATE,
        lineChartsTemplate: LINE_CHARTS_TEMPLATE,
        otherMetricsBarChartsTemplate: OTHER_METRICS_BAR_CHARTS_TEMPLATE,
        otherMetricsLineChartsTemplate: OTHER_METRICS_LINE_CHARTS_TEMPLATE,
        pieChartsTemplate: PIE_CHARTS_TEMPLATE,
        selectedYearMetrics,
        yearlyMetrics: currentStoreMetrics?.financialMetrics,
      }),
    ]);

  return {
    dailyCharts: dailyFinancialCharts,
    monthlyCharts: monthlyFinancialCharts,
    yearlyCharts: yearlyFinancialCharts,
  };
}

type CreateDailyFinancialChartsInput = {
  barChartsTemplate: FinancialMetricsBarCharts;
  dailyMetrics?: DailyFinancialMetric[];
  lineChartsTemplate: FinancialMetricLineCharts;
  otherMetricsBarChartsTemplate: FinancialOtherMetricsBarCharts;
  otherMetricsLineChartsTemplate: FinancialOtherMetricsLineCharts;
  pieChartsTemplate: FinancialMetricsPieCharts;
  selectedDayMetrics?: DailyFinancialMetric;
};
async function createDailyFinancialCharts({
  barChartsTemplate,
  dailyMetrics,
  lineChartsTemplate,
  otherMetricsBarChartsTemplate,
  otherMetricsLineChartsTemplate,
  pieChartsTemplate,
  selectedDayMetrics,
}: CreateDailyFinancialChartsInput): Promise<FinancialMetricsCharts["dailyCharts"]> {
  if (!dailyMetrics || !selectedDayMetrics) {
    return new Promise((resolve) => {
      resolve({
        profit: {
          bar: barChartsTemplate,
          line: lineChartsTemplate,
          pie: pieChartsTemplate,
        },
        expenses: {
          bar: barChartsTemplate,
          line: lineChartsTemplate,
          pie: pieChartsTemplate,
        },
        revenue: {
          bar: barChartsTemplate,
          line: lineChartsTemplate,
          pie: pieChartsTemplate,
        },
        transactions: {
          bar: barChartsTemplate,
          line: lineChartsTemplate,
          pie: pieChartsTemplate,
        },
        otherMetrics: {
          bar: otherMetricsBarChartsTemplate,
          line: otherMetricsLineChartsTemplate,
        },
      });
    });
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const [
        dailyProfitBarCharts,
        dailyProfitLineCharts,

        dailyExpensesBarCharts,
        dailyExpensesLineCharts,

        dailyRevenueBarCharts,
        dailyRevenueLineCharts,

        dailyTransactionsBarCharts,
        dailyTransactionsLineCharts,

        dailyOtherMetricsBarCharts,
        dailyOtherMetricsLineCharts,
      ] = dailyMetrics.reduce(
        (dailyMetricsChartsAcc, dailyMetric) => {
          const [
            dailyProfitBarChartsAcc,
            dailyProfitLineChartsAcc,

            dailyExpensesBarChartsAcc,
            dailyExpensesLineChartsAcc,

            dailyRevenueBarChartsAcc,
            dailyRevenueLineChartsAcc,

            dailyTransactionsBarChartsAcc,
            dailyTransactionsLineChartsAcc,

            dailyOtherMetricsBarChartsAcc,
            dailyOtherMetricsLineChartsAcc,
          ] = dailyMetricsChartsAcc;

          const {
            day,
            profit: { total: totalProfit, repair: repairProfit, sales: salesProfit },
          } = dailyMetric;

          // profit

          // profit -> bar chart

          const dailyProfitTotalBarChart: BarChartData = {
            Days: day,
            Total: totalProfit,
          };
          dailyProfitBarChartsAcc.total.push(dailyProfitTotalBarChart);

          const dailyProfitAllBarChart: BarChartData = {
            Days: day,
            Repair: repairProfit,
            "In Store": salesProfit.inStore,
            Online: salesProfit.online,
          };
          dailyProfitBarChartsAcc.all.push(dailyProfitAllBarChart);

          const dailyProfitOverviewBarChart: BarChartData = {
            Days: day,
            Repair: repairProfit,
            Sales: salesProfit.total,
          };
          dailyProfitBarChartsAcc.overview.push(dailyProfitOverviewBarChart);

          const dailyProfitRepairBarChart: BarChartData = {
            Days: day,
            Repair: repairProfit,
          };
          dailyProfitBarChartsAcc.repair.push(dailyProfitRepairBarChart);

          const dailyProfitSalesBarChart: BarChartData = {
            Days: day,
            "In Store": salesProfit.inStore,
            Online: salesProfit.online,
          };
          dailyProfitBarChartsAcc.sales.push(dailyProfitSalesBarChart);

          const dailyProfitInStoreBarChart: BarChartData = {
            Days: day,
            "In Store": salesProfit.inStore,
          };
          dailyProfitBarChartsAcc.inStore.push(dailyProfitInStoreBarChart);

          const dailyProfitOnlineBarChart: BarChartData = {
            Days: day,
            Online: salesProfit.online,
          };
          dailyProfitBarChartsAcc.online.push(dailyProfitOnlineBarChart);

          // profit -> line chart

          const dailyProfitTotalLineChart = {
            x: day,
            y: totalProfit,
          };
          dailyProfitLineChartsAcc.total
            .find((lineChartData: LineChartData) => lineChartData.id === "Total")
            ?.data.push(dailyProfitTotalLineChart);

          const dailyProfitAllRepairLineChart = {
            x: day,
            y: repairProfit,
          };
          dailyProfitLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(dailyProfitAllRepairLineChart);

          const dailyProfitAllInStoreLineChart = {
            x: day,
            y: salesProfit.inStore,
          };
          dailyProfitLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(dailyProfitAllInStoreLineChart);

          const dailyProfitAllOnlineLineChart = {
            x: day,
            y: salesProfit.online,
          };
          dailyProfitLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(dailyProfitAllOnlineLineChart);

          const dailyProfitOverviewRepairLineChart = {
            x: day,
            y: repairProfit,
          };
          dailyProfitLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(dailyProfitOverviewRepairLineChart);

          const dailyProfitOverviewSalesLineChart = {
            x: day,
            y: salesProfit.total,
          };
          dailyProfitLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Sales")
            ?.data.push(dailyProfitOverviewSalesLineChart);

          const dailyProfitRepairLineChart = {
            x: day,
            y: repairProfit,
          };
          dailyProfitLineChartsAcc.repair
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(dailyProfitRepairLineChart);

          const dailyProfitSalesInStoreLineChart = {
            x: day,
            y: salesProfit.inStore,
          };
          dailyProfitLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(dailyProfitSalesInStoreLineChart);

          const dailyProfitSalesOnlineLineChart = {
            x: day,
            y: salesProfit.online,
          };
          dailyProfitLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(dailyProfitSalesOnlineLineChart);

          const dailyProfitInStoreLineChart = {
            x: day,
            y: salesProfit.inStore,
          };
          dailyProfitLineChartsAcc.inStore
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(dailyProfitInStoreLineChart);

          const dailyProfitOnlineLineChart = {
            x: day,
            y: salesProfit.online,
          };
          dailyProfitLineChartsAcc.online
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(dailyProfitOnlineLineChart);

          // expenses
          const {
            expenses: {
              total: totalExpenses,
              repair: repairExpenses,
              sales: salesExpenses,
            },
          } = dailyMetric;

          // expenses -> bar chart

          const dailyExpensesTotalBarChart: BarChartData = {
            Days: day,
            Total: totalExpenses,
          };
          dailyExpensesBarChartsAcc.total.push(dailyExpensesTotalBarChart);

          const dailyExpensesAllBarChart: BarChartData = {
            Days: day,
            Repair: repairExpenses,
            "In Store": salesExpenses.inStore,
            Online: salesExpenses.online,
          };
          dailyExpensesBarChartsAcc.all?.push(dailyExpensesAllBarChart);

          const dailyExpensesOverviewBarChart: BarChartData = {
            Days: day,
            Repair: repairExpenses,
            Sales: salesExpenses.total,
          };
          dailyExpensesBarChartsAcc.overview.push(dailyExpensesOverviewBarChart);

          const dailyExpensesRepairBarChart: BarChartData = {
            Days: day,
            Repair: repairExpenses,
          };
          dailyExpensesBarChartsAcc.repair.push(dailyExpensesRepairBarChart);

          const dailyExpensesSalesBarChart: BarChartData = {
            Days: day,
            "In Store": salesExpenses.inStore,
            Online: salesExpenses.online,
          };
          dailyExpensesBarChartsAcc.sales.push(dailyExpensesSalesBarChart);

          const dailyExpensesInStoreBarChart: BarChartData = {
            Days: day,
            "In Store": salesExpenses.inStore,
          };
          dailyExpensesBarChartsAcc.inStore.push(dailyExpensesInStoreBarChart);

          const dailyExpensesOnlineBarChart: BarChartData = {
            Days: day,
            Online: salesExpenses.online,
          };
          dailyExpensesBarChartsAcc.online.push(dailyExpensesOnlineBarChart);

          // expenses -> line chart

          const dailyExpensesTotalLineChart = {
            x: day,
            y: totalExpenses,
          };
          dailyExpensesLineChartsAcc.total
            .find((lineChartData: LineChartData) => lineChartData.id === "Total")
            ?.data.push(dailyExpensesTotalLineChart);

          const dailyExpensesAllRepairLineChart = {
            x: day,
            y: repairExpenses,
          };
          dailyExpensesLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(dailyExpensesAllRepairLineChart);

          const dailyExpensesAllInStoreLineChart = {
            x: day,
            y: salesExpenses.inStore,
          };
          dailyExpensesLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(dailyExpensesAllInStoreLineChart);

          const dailyExpensesAllOnlineLineChart = {
            x: day,
            y: salesExpenses.online,
          };
          dailyExpensesLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(dailyExpensesAllOnlineLineChart);

          const dailyExpensesOverviewRepairLineChart = {
            x: day,
            y: repairExpenses,
          };
          dailyExpensesLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(dailyExpensesOverviewRepairLineChart);

          const dailyExpensesOverviewSalesLineChart = {
            x: day,
            y: salesExpenses.total,
          };
          dailyExpensesLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Sales")
            ?.data.push(dailyExpensesOverviewSalesLineChart);

          const dailyExpensesRepairLineChart = {
            x: day,
            y: repairExpenses,
          };
          dailyExpensesLineChartsAcc.repair
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(dailyExpensesRepairLineChart);

          const dailyExpensesSalesInStoreLineChart = {
            x: day,
            y: salesExpenses.inStore,
          };
          dailyExpensesLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(dailyExpensesSalesInStoreLineChart);

          const dailyExpensesSalesOnlineLineChart = {
            x: day,
            y: salesExpenses.online,
          };
          dailyExpensesLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(dailyExpensesSalesOnlineLineChart);

          const dailyExpensesInStoreLineChart = {
            x: day,
            y: salesExpenses.inStore,
          };
          dailyExpensesLineChartsAcc.inStore
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(dailyExpensesInStoreLineChart);

          const dailyExpensesOnlineLineChart = {
            x: day,
            y: salesExpenses.online,
          };
          dailyExpensesLineChartsAcc.online
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(dailyExpensesOnlineLineChart);

          // revenue
          const {
            revenue: { total: totalRevenue, repair: repairRevenue, sales: salesRevenue },
          } = dailyMetric;

          // revenue -> bar chart

          const dailyRevenueTotalBarChart: BarChartData = {
            Days: day,
            Total: totalRevenue,
          };
          dailyRevenueBarChartsAcc.total.push(dailyRevenueTotalBarChart);

          const dailyRevenueAllBarChart: BarChartData = {
            Days: day,
            Repair: repairRevenue,
            "In Store": salesRevenue.inStore,
            Online: salesRevenue.online,
          };
          dailyRevenueBarChartsAcc.all.push(dailyRevenueAllBarChart);

          const dailyRevenueOverviewBarChart: BarChartData = {
            Days: day,
            Repair: repairRevenue,
            Sales: salesRevenue.total,
          };
          dailyRevenueBarChartsAcc.overview.push(dailyRevenueOverviewBarChart);

          const dailyRevenueRepairBarChart: BarChartData = {
            Days: day,
            Repair: repairRevenue,
          };
          dailyRevenueBarChartsAcc.repair.push(dailyRevenueRepairBarChart);

          const dailyRevenueSalesBarChart: BarChartData = {
            Days: day,
            "In Store": salesRevenue.inStore,
            Online: salesRevenue.online,
          };
          dailyRevenueBarChartsAcc.sales.push(dailyRevenueSalesBarChart);

          const dailyRevenueInStoreBarChart: BarChartData = {
            Days: day,
            "In Store": salesRevenue.inStore,
          };
          dailyRevenueBarChartsAcc.inStore.push(dailyRevenueInStoreBarChart);

          const dailyRevenueOnlineBarChart: BarChartData = {
            Days: day,
            Online: salesRevenue.online,
          };
          dailyRevenueBarChartsAcc.online.push(dailyRevenueOnlineBarChart);

          // revenue -> line chart

          const dailyRevenueTotalLineChart = {
            x: day,
            y: totalRevenue,
          };
          dailyRevenueLineChartsAcc.total
            .find((lineChartData: LineChartData) => lineChartData.id === "Total")
            ?.data.push(dailyRevenueTotalLineChart);

          const dailyRevenueAllRepairLineChart = {
            x: day,
            y: repairRevenue,
          };
          dailyRevenueLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(dailyRevenueAllRepairLineChart);

          const dailyRevenueAllInStoreLineChart = {
            x: day,
            y: salesRevenue.inStore,
          };
          dailyRevenueLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(dailyRevenueAllInStoreLineChart);

          const dailyRevenueAllOnlineLineChart = {
            x: day,
            y: salesRevenue.online,
          };
          dailyRevenueLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(dailyRevenueAllOnlineLineChart);

          const dailyRevenueOverviewRepairLineChart = {
            x: day,
            y: repairRevenue,
          };
          dailyRevenueLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(dailyRevenueOverviewRepairLineChart);

          const dailyRevenueOverviewSalesLineChart = {
            x: day,
            y: salesRevenue.total,
          };
          dailyRevenueLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Sales")
            ?.data.push(dailyRevenueOverviewSalesLineChart);

          const dailyRevenueRepairLineChart = {
            x: day,
            y: repairRevenue,
          };
          dailyRevenueLineChartsAcc.repair
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(dailyRevenueRepairLineChart);

          const dailyRevenueSalesInStoreLineChart = {
            x: day,
            y: salesRevenue.inStore,
          };
          dailyRevenueLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(dailyRevenueSalesInStoreLineChart);

          const dailyRevenueSalesOnlineLineChart = {
            x: day,
            y: salesRevenue.online,
          };
          dailyRevenueLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(dailyRevenueSalesOnlineLineChart);

          const dailyRevenueInStoreLineChart = {
            x: day,
            y: salesRevenue.inStore,
          };
          dailyRevenueLineChartsAcc.inStore
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(dailyRevenueInStoreLineChart);

          const dailyRevenueOnlineLineChart = {
            x: day,
            y: salesRevenue.online,
          };
          dailyRevenueLineChartsAcc.online
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(dailyRevenueOnlineLineChart);

          // transactions
          const {
            transactions: {
              total: totalTransactions,
              repair: repairTransactions,
              sales: salesTransactions,
            },
          } = dailyMetric;

          // transactions -> bar chart

          const dailyTransactionsTotalBarChart: BarChartData = {
            Days: day,
            Total: totalTransactions,
          };
          dailyTransactionsBarChartsAcc.total.push(dailyTransactionsTotalBarChart);

          const dailyTransactionsAllBarChart: BarChartData = {
            Days: day,
            Repair: repairTransactions,
            "In Store": salesTransactions.inStore,
            Online: salesTransactions.online,
          };
          dailyTransactionsBarChartsAcc.all?.push(dailyTransactionsAllBarChart);

          const dailyTransactionsOverviewBarChart: BarChartData = {
            Days: day,
            Repair: repairTransactions,
            Sales: salesTransactions.total,
          };
          dailyTransactionsBarChartsAcc.overview.push(dailyTransactionsOverviewBarChart);

          const dailyTransactionsRepairBarChart: BarChartData = {
            Days: day,
            Repair: repairTransactions,
          };
          dailyTransactionsBarChartsAcc.repair.push(dailyTransactionsRepairBarChart);

          const dailyTransactionsSalesBarChart: BarChartData = {
            Days: day,
            "In Store": salesTransactions.inStore,
            Online: salesTransactions.online,
          };
          dailyTransactionsBarChartsAcc.sales.push(dailyTransactionsSalesBarChart);

          const dailyTransactionsInStoreBarChart: BarChartData = {
            Days: day,
            "In Store": salesTransactions.inStore,
          };
          dailyTransactionsBarChartsAcc.inStore.push(dailyTransactionsInStoreBarChart);

          const dailyTransactionsOnlineBarChart: BarChartData = {
            Days: day,
            Online: salesTransactions.online,
          };
          dailyTransactionsBarChartsAcc.online.push(dailyTransactionsOnlineBarChart);

          // transactions -> line chart

          const dailyTransactionsTotalLineChart = {
            x: day,
            y: totalTransactions,
          };
          dailyTransactionsLineChartsAcc.total
            .find((lineChartData: LineChartData) => lineChartData.id === "Total")
            ?.data.push(dailyTransactionsTotalLineChart);

          const dailyTransactionsAllRepairLineChart = {
            x: day,
            y: repairTransactions,
          };
          dailyTransactionsLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(dailyTransactionsAllRepairLineChart);

          const dailyTransactionsAllInStoreLineChart = {
            x: day,
            y: salesTransactions.inStore,
          };
          dailyTransactionsLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(dailyTransactionsAllInStoreLineChart);

          const dailyTransactionsAllOnlineLineChart = {
            x: day,
            y: salesTransactions.online,
          };
          dailyTransactionsLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(dailyTransactionsAllOnlineLineChart);

          const dailyTransactionsOverviewRepairLineChart = {
            x: day,
            y: repairTransactions,
          };
          dailyTransactionsLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(dailyTransactionsOverviewRepairLineChart);

          const dailyTransactionsOverviewSalesLineChart = {
            x: day,
            y: salesTransactions.total,
          };
          dailyTransactionsLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Sales")
            ?.data.push(dailyTransactionsOverviewSalesLineChart);

          const dailyTransactionsRepairLineChart = {
            x: day,
            y: repairTransactions,
          };
          dailyTransactionsLineChartsAcc.repair
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(dailyTransactionsRepairLineChart);

          const dailyTransactionsSalesInStoreLineChart = {
            x: day,
            y: salesTransactions.inStore,
          };
          dailyTransactionsLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(dailyTransactionsSalesInStoreLineChart);

          const dailyTransactionsSalesOnlineLineChart = {
            x: day,
            y: salesTransactions.online,
          };
          dailyTransactionsLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(dailyTransactionsSalesOnlineLineChart);

          const dailyTransactionsInStoreLineChart = {
            x: day,
            y: salesTransactions.inStore,
          };
          dailyTransactionsLineChartsAcc.inStore
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(dailyTransactionsInStoreLineChart);

          const dailyTransactionsOnlineLineChart = {
            x: day,
            y: salesTransactions.online,
          };
          dailyTransactionsLineChartsAcc.online
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(dailyTransactionsOnlineLineChart);

          // other metrics
          const { averageOrderValue, conversionRate, netProfitMargin } = dailyMetric;

          // other metrics -> bar chart

          const dailyOtherMetricsTotalBarChart: BarChartData = {
            Days: day,
            "Average Order Value": averageOrderValue,
          };
          dailyOtherMetricsBarChartsAcc.averageOrderValue?.push(
            dailyOtherMetricsTotalBarChart
          );

          const dailyOtherMetricsAllBarChart: BarChartData = {
            Days: day,
            "Conversion Rate": toFixedFloat(conversionRate * 100, 2),
          };
          dailyOtherMetricsBarChartsAcc.conversionRate?.push(
            dailyOtherMetricsAllBarChart
          );

          const dailyOtherMetricsOverviewBarChart: BarChartData = {
            Days: day,
            "Net Profit Margin": toFixedFloat(netProfitMargin * 100, 2),
          };
          dailyOtherMetricsBarChartsAcc.netProfitMargin?.push(
            dailyOtherMetricsOverviewBarChart
          );

          // other metrics -> line chart

          const dailyOtherMetricsAverageOrderValueLineChart = {
            x: day,
            y: averageOrderValue,
          };
          dailyOtherMetricsLineChartsAcc.averageOrderValue
            ?.find(
              (lineChartData: LineChartData) => lineChartData.id === "Average Order Value"
            )
            ?.data.push(dailyOtherMetricsAverageOrderValueLineChart);

          const dailyOtherMetricsConversionRateLineChart = {
            x: day,
            y: toFixedFloat(conversionRate * 100, 2),
          };
          dailyOtherMetricsLineChartsAcc.conversionRate
            ?.find(
              (lineChartData: LineChartData) => lineChartData.id === "Conversion Rate"
            )
            ?.data.push(dailyOtherMetricsConversionRateLineChart);

          const dailyOtherMetricsNetProfitMarginLineChart = {
            x: day,
            y: toFixedFloat(netProfitMargin * 100, 2),
          };
          dailyOtherMetricsLineChartsAcc.netProfitMargin
            ?.find(
              (lineChartData: LineChartData) => lineChartData.id === "Net Profit Margin"
            )
            ?.data.push(dailyOtherMetricsNetProfitMarginLineChart);

          return dailyMetricsChartsAcc;
        },
        [
          structuredClone(barChartsTemplate),
          structuredClone(lineChartsTemplate),

          structuredClone(barChartsTemplate),
          structuredClone(lineChartsTemplate),

          structuredClone(barChartsTemplate),
          structuredClone(lineChartsTemplate),

          structuredClone(barChartsTemplate),
          structuredClone(lineChartsTemplate),

          structuredClone(otherMetricsBarChartsTemplate),
          structuredClone(otherMetricsLineChartsTemplate),
        ]
      );

      // daily -> profit -> pie charts
      const dailyProfitRepairPieChart = {
        id: "Repair",
        label: "Repair",
        value: selectedDayMetrics.profit.repair,
      };
      const dailyProfitSalesPieChart = {
        id: "Sales",
        label: "Sales",
        value: selectedDayMetrics.profit.sales.total,
      };
      const dailyProfitSalesInStorePieChart = {
        id: "In Store",
        label: "In Store",
        value: selectedDayMetrics.profit.sales.inStore,
      };
      const dailyProfitSalesOnlinePieChart = {
        id: "Online",
        label: "Online",
        value: selectedDayMetrics.profit.sales.online,
      };

      const dailyProfitPieCharts = {
        overview: [dailyProfitRepairPieChart, dailyProfitSalesPieChart],
        all: [
          dailyProfitRepairPieChart,
          dailyProfitSalesInStorePieChart,
          dailyProfitSalesOnlinePieChart,
        ],
        sales: [dailyProfitSalesInStorePieChart, dailyProfitSalesOnlinePieChart],
      };

      // daily -> expenses -> pie charts
      const dailyExpensesRepairPieChart = {
        id: "Repair",
        label: "Repair",
        value: selectedDayMetrics.expenses.repair,
      };
      const dailyExpensesSalesPieChart = {
        id: "Sales",
        label: "Sales",
        value: selectedDayMetrics.expenses.sales.total,
      };
      const dailyExpensesSalesInStorePieChart = {
        id: "In Store",
        label: "In Store",
        value: selectedDayMetrics.expenses.sales.inStore,
      };
      const dailyExpensesSalesOnlinePieChart = {
        id: "Online",
        label: "Online",
        value: selectedDayMetrics.expenses.sales.online,
      };

      const dailyExpensesPieCharts = {
        overview: [dailyExpensesRepairPieChart, dailyExpensesSalesPieChart],
        all: [
          dailyExpensesRepairPieChart,
          dailyExpensesSalesInStorePieChart,
          dailyExpensesSalesOnlinePieChart,
        ],
        sales: [dailyExpensesSalesInStorePieChart, dailyExpensesSalesOnlinePieChart],
      };

      // daily -> revenue -> pie charts
      const dailyRevenueRepairPieChart = {
        id: "Repair",
        label: "Repair",
        value: selectedDayMetrics.revenue.repair,
      };
      const dailyRevenueSalesPieChart = {
        id: "Sales",
        label: "Sales",
        value: selectedDayMetrics.revenue.sales.total,
      };
      const dailyRevenueSalesInStorePieChart = {
        id: "In Store",
        label: "In Store",
        value: selectedDayMetrics.revenue.sales.inStore,
      };
      const dailyRevenueSalesOnlinePieChart = {
        id: "Online",
        label: "Online",
        value: selectedDayMetrics.revenue.sales.online,
      };

      const dailyRevenuePieCharts = {
        overview: [dailyRevenueRepairPieChart, dailyRevenueSalesPieChart],
        all: [
          dailyRevenueRepairPieChart,
          dailyRevenueSalesInStorePieChart,
          dailyRevenueSalesOnlinePieChart,
        ],
        sales: [dailyRevenueSalesInStorePieChart, dailyRevenueSalesOnlinePieChart],
      };

      // daily -> transactions -> pie charts
      const dailyTransactionsRepairPieChart = {
        id: "Repair",
        label: "Repair",
        value: selectedDayMetrics.transactions.repair,
      };
      const dailyTransactionsSalesPieChart = {
        id: "Sales",
        label: "Sales",
        value: selectedDayMetrics.transactions.sales.total,
      };
      const dailyTransactionsSalesInStorePieChart = {
        id: "In Store",
        label: "In Store",
        value: selectedDayMetrics.transactions.sales.inStore,
      };
      const dailyTransactionsSalesOnlinePieChart = {
        id: "Online",
        label: "Online",
        value: selectedDayMetrics.transactions.sales.online,
      };

      const dailyTransactionsPieCharts = {
        overview: [dailyTransactionsRepairPieChart, dailyTransactionsSalesPieChart],
        all: [
          dailyTransactionsRepairPieChart,
          dailyTransactionsSalesInStorePieChart,
          dailyTransactionsSalesOnlinePieChart,
        ],
        sales: [
          dailyTransactionsSalesInStorePieChart,
          dailyTransactionsSalesOnlinePieChart,
        ],
      };

      resolve({
        profit: {
          bar: dailyProfitBarCharts,
          line: dailyProfitLineCharts,
          pie: dailyProfitPieCharts,
        },
        expenses: {
          bar: dailyExpensesBarCharts,
          line: dailyExpensesLineCharts,
          pie: dailyExpensesPieCharts,
        },
        revenue: {
          bar: dailyRevenueBarCharts,
          line: dailyRevenueLineCharts,
          pie: dailyRevenuePieCharts,
        },
        transactions: {
          bar: dailyTransactionsBarCharts,
          line: dailyTransactionsLineCharts,
          pie: dailyTransactionsPieCharts,
        },
        otherMetrics: {
          bar: dailyOtherMetricsBarCharts,
          line: dailyOtherMetricsLineCharts,
        },
      });
    }, 0);
  });
}

type CreateMonthlyFinancialChartsInput = {
  barChartsTemplate: FinancialMetricsBarCharts;
  lineChartsTemplate: FinancialMetricLineCharts;
  monthlyMetrics?: MonthlyFinancialMetric[];
  months: Month[];
  otherMetricsBarChartsTemplate: FinancialOtherMetricsBarCharts;
  otherMetricsLineChartsTemplate: FinancialOtherMetricsLineCharts;
  pieChartsTemplate: FinancialMetricsPieCharts;
  selectedMonthMetrics?: MonthlyFinancialMetric;
  selectedYear: Year;
};
async function createMonthlyFinancialCharts({
  barChartsTemplate,
  lineChartsTemplate,
  monthlyMetrics,
  months,
  otherMetricsBarChartsTemplate,
  otherMetricsLineChartsTemplate,
  pieChartsTemplate,
  selectedMonthMetrics,
  selectedYear,
}: CreateMonthlyFinancialChartsInput): Promise<FinancialMetricsCharts["monthlyCharts"]> {
  if (!monthlyMetrics || !selectedMonthMetrics) {
    return new Promise((resolve) => {
      resolve({
        profit: {
          bar: barChartsTemplate,
          line: lineChartsTemplate,
          pie: pieChartsTemplate,
        },
        expenses: {
          bar: barChartsTemplate,
          line: lineChartsTemplate,
          pie: pieChartsTemplate,
        },
        revenue: {
          bar: barChartsTemplate,
          line: lineChartsTemplate,
          pie: pieChartsTemplate,
        },
        transactions: {
          bar: barChartsTemplate,
          line: lineChartsTemplate,
          pie: pieChartsTemplate,
        },
        otherMetrics: {
          bar: otherMetricsBarChartsTemplate,
          line: otherMetricsLineChartsTemplate,
        },
      });
    });
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const [
        monthlyProfitBarCharts,
        monthlyProfitLineCharts,

        monthlyExpensesBarCharts,
        monthlyExpensesLineCharts,

        monthlyRevenueBarCharts,
        monthlyRevenueLineCharts,

        monthlyTransactionsBarCharts,
        monthlyTransactionsLineCharts,

        monthlyOtherMetricsBarCharts,
        monthlyOtherMetricsLineCharts,
      ] = monthlyMetrics.reduce(
        (monthlyMetricsChartsAcc, monthlyMetric) => {
          const [
            monthlyProfitBarChartsAcc,
            monthlyProfitLineChartsAcc,

            monthlyExpensesBarChartsAcc,
            monthlyExpensesLineChartsAcc,

            monthlyRevenueBarChartsAcc,
            monthlyRevenueLineChartsAcc,

            monthlyTransactionsBarChartsAcc,
            monthlyTransactionsLineChartsAcc,

            monthlyOtherMetricsBarChartsAcc,
            monthlyOtherMetricsLineChartsAcc,
          ] = monthlyMetricsChartsAcc;

          const { month } = monthlyMetric;

          // prevents current month of current year from being added to charts
          const currentYear = new Date().getFullYear().toString();
          const isCurrentYear = selectedYear === currentYear;
          const currentMonth = new Date().toLocaleString("default", { month: "long" });
          const isCurrentMonth = month === currentMonth;

          if (isCurrentYear && isCurrentMonth) {
            return monthlyMetricsChartsAcc;
          }

          // profit

          const {
            profit: {
              total: monthlyTotalProfit,
              repair: monthlyRepairProfit,
              sales: monthlySalesProfit,
            },
          } = monthlyMetric;

          // profit -> bar chart

          const monthlyProfitTotalBarChart: BarChartData = {
            Months: month,
            Total: monthlyTotalProfit,
          };
          monthlyProfitBarChartsAcc.total.push(monthlyProfitTotalBarChart);

          const monthlyProfitAllBarChart: BarChartData = {
            Months: month,
            Repair: monthlyRepairProfit,
            "In Store": monthlySalesProfit.inStore,
            Online: monthlySalesProfit.online,
          };
          monthlyProfitBarChartsAcc.all?.push(monthlyProfitAllBarChart);

          const monthlyProfitOverviewBarChart: BarChartData = {
            Months: month,
            Repair: monthlyRepairProfit,
            Sales: monthlySalesProfit.total,
          };
          monthlyProfitBarChartsAcc.overview.push(monthlyProfitOverviewBarChart);

          const monthlyProfitRepairBarChart: BarChartData = {
            Months: month,
            Repair: monthlyRepairProfit,
          };
          monthlyProfitBarChartsAcc.repair.push(monthlyProfitRepairBarChart);

          const monthlyProfitSalesBarChart: BarChartData = {
            Months: month,
            "In Store": monthlySalesProfit.inStore,
            Online: monthlySalesProfit.online,
          };
          monthlyProfitBarChartsAcc.sales.push(monthlyProfitSalesBarChart);

          const monthlyProfitInStoreBarChart: BarChartData = {
            Months: month,
            "In Store": monthlySalesProfit.inStore,
          };
          monthlyProfitBarChartsAcc.inStore.push(monthlyProfitInStoreBarChart);

          const monthlyProfitOnlineBarChart: BarChartData = {
            Months: month,
            Online: monthlySalesProfit.online,
          };
          monthlyProfitBarChartsAcc.online.push(monthlyProfitOnlineBarChart);

          // profit -> line chart

          const monthlyProfitTotalLineChart = {
            x: month,
            y: monthlyTotalProfit,
          };
          monthlyProfitLineChartsAcc.total
            .find((lineChartData: LineChartData) => lineChartData.id === "Total")
            ?.data.push(monthlyProfitTotalLineChart);

          const monthlyProfitAllRepairLineChart = {
            x: month,
            y: monthlyRepairProfit,
          };
          monthlyProfitLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(monthlyProfitAllRepairLineChart);

          const monthlyProfitAllInStoreLineChart = {
            x: month,
            y: monthlySalesProfit.inStore,
          };
          monthlyProfitLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(monthlyProfitAllInStoreLineChart);

          const monthlyProfitAllOnlineLineChart = {
            x: month,
            y: monthlySalesProfit.online,
          };
          monthlyProfitLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(monthlyProfitAllOnlineLineChart);

          const monthlyProfitOverviewRepairLineChart = {
            x: month,
            y: monthlyRepairProfit,
          };
          monthlyProfitLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(monthlyProfitOverviewRepairLineChart);

          const monthlyProfitOverviewSalesLineChart = {
            x: month,
            y: monthlySalesProfit.total,
          };
          monthlyProfitLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Sales")
            ?.data.push(monthlyProfitOverviewSalesLineChart);

          const monthlyProfitRepairLineChart = {
            x: month,
            y: monthlyRepairProfit,
          };
          monthlyProfitLineChartsAcc.repair
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(monthlyProfitRepairLineChart);

          const monthlyProfitSalesInStoreLineChart = {
            x: month,
            y: monthlySalesProfit.inStore,
          };
          monthlyProfitLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(monthlyProfitSalesInStoreLineChart);

          const monthlyProfitSalesOnlineLineChart = {
            x: month,
            y: monthlySalesProfit.online,
          };
          monthlyProfitLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(monthlyProfitSalesOnlineLineChart);

          const monthlyProfitInStoreLineChart = {
            x: month,
            y: monthlySalesProfit.inStore,
          };
          monthlyProfitLineChartsAcc.inStore
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(monthlyProfitInStoreLineChart);

          const monthlyProfitOnlineLineChart = {
            x: month,
            y: monthlySalesProfit.online,
          };
          monthlyProfitLineChartsAcc.online
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(monthlyProfitOnlineLineChart);

          // expenses

          const {
            expenses: {
              total: monthlyTotalExpenses,
              repair: monthlyRepairExpenses,
              sales: monthlySalesExpenses,
            },
          } = monthlyMetric;

          // expenses -> bar chart

          const monthlyExpensesTotalBarChart: BarChartData = {
            Months: month,
            Total: monthlyTotalExpenses,
          };
          monthlyExpensesBarChartsAcc.total.push(monthlyExpensesTotalBarChart);

          const monthlyExpensesAllBarChart: BarChartData = {
            Months: month,
            Repair: monthlyRepairExpenses,
            "In Store": monthlySalesExpenses.inStore,
            Online: monthlySalesExpenses.online,
          };
          monthlyExpensesBarChartsAcc.all?.push(monthlyExpensesAllBarChart);

          const monthlyExpensesOverviewBarChart: BarChartData = {
            Months: month,
            Repair: monthlyRepairExpenses,
            Sales: monthlySalesExpenses.total,
          };
          monthlyExpensesBarChartsAcc.overview.push(monthlyExpensesOverviewBarChart);

          const monthlyExpensesRepairBarChart: BarChartData = {
            Months: month,
            Repair: monthlyRepairExpenses,
          };
          monthlyExpensesBarChartsAcc.repair.push(monthlyExpensesRepairBarChart);

          const monthlyExpensesSalesBarChart: BarChartData = {
            Months: month,
            "In Store": monthlySalesExpenses.inStore,
            Online: monthlySalesExpenses.online,
          };
          monthlyExpensesBarChartsAcc.sales.push(monthlyExpensesSalesBarChart);

          const monthlyExpensesInStoreBarChart: BarChartData = {
            Months: month,
            "In Store": monthlySalesExpenses.inStore,
          };
          monthlyExpensesBarChartsAcc.inStore.push(monthlyExpensesInStoreBarChart);

          const monthlyExpensesOnlineBarChart: BarChartData = {
            Months: month,
            Online: monthlySalesExpenses.online,
          };
          monthlyExpensesBarChartsAcc.online.push(monthlyExpensesOnlineBarChart);

          // expenses -> line chart

          const monthlyExpensesTotalLineChart = {
            x: month,
            y: monthlyTotalExpenses,
          };
          monthlyExpensesLineChartsAcc.total
            .find((lineChartData: LineChartData) => lineChartData.id === "Total")
            ?.data.push(monthlyExpensesTotalLineChart);

          const monthlyExpensesAllRepairLineChart = {
            x: month,
            y: monthlyRepairExpenses,
          };
          monthlyExpensesLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(monthlyExpensesAllRepairLineChart);

          const monthlyExpensesAllInStoreLineChart = {
            x: month,
            y: monthlySalesExpenses.inStore,
          };
          monthlyExpensesLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(monthlyExpensesAllInStoreLineChart);

          const monthlyExpensesAllOnlineLineChart = {
            x: month,
            y: monthlySalesExpenses.online,
          };
          monthlyExpensesLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(monthlyExpensesAllOnlineLineChart);

          const monthlyExpensesOverviewRepairLineChart = {
            x: month,
            y: monthlyRepairExpenses,
          };
          monthlyExpensesLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(monthlyExpensesOverviewRepairLineChart);

          const monthlyExpensesOverviewSalesLineChart = {
            x: month,
            y: monthlySalesExpenses.total,
          };
          monthlyExpensesLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Sales")
            ?.data.push(monthlyExpensesOverviewSalesLineChart);

          const monthlyExpensesRepairLineChart = {
            x: month,
            y: monthlyRepairExpenses,
          };
          monthlyExpensesLineChartsAcc.repair
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(monthlyExpensesRepairLineChart);

          const monthlyExpensesSalesInStoreLineChart = {
            x: month,
            y: monthlySalesExpenses.inStore,
          };
          monthlyExpensesLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(monthlyExpensesSalesInStoreLineChart);

          const monthlyExpensesSalesOnlineLineChart = {
            x: month,
            y: monthlySalesExpenses.online,
          };
          monthlyExpensesLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(monthlyExpensesSalesOnlineLineChart);

          const monthlyExpensesInStoreLineChart = {
            x: month,
            y: monthlySalesExpenses.inStore,
          };
          monthlyExpensesLineChartsAcc.inStore
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(monthlyExpensesInStoreLineChart);

          const monthlyExpensesOnlineLineChart = {
            x: month,
            y: monthlySalesExpenses.online,
          };
          monthlyExpensesLineChartsAcc.online
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(monthlyExpensesOnlineLineChart);

          // revenue

          const {
            revenue: {
              total: monthlyTotalRevenue,
              repair: monthlyRepairRevenue,
              sales: monthlySalesRevenue,
            },
          } = monthlyMetric;

          // revenue -> bar chart

          const monthlyRevenueTotalBarChart: BarChartData = {
            Months: month,
            Total: monthlyTotalRevenue,
          };
          monthlyRevenueBarChartsAcc.total.push(monthlyRevenueTotalBarChart);

          const monthlyRevenueAllBarChart: BarChartData = {
            Months: month,
            Repair: monthlyRepairRevenue,
            "In Store": monthlySalesRevenue.inStore,
            Online: monthlySalesRevenue.online,
          };
          monthlyRevenueBarChartsAcc.all?.push(monthlyRevenueAllBarChart);

          const monthlyRevenueOverviewBarChart: BarChartData = {
            Months: month,
            Repair: monthlyRepairRevenue,
            Sales: monthlySalesRevenue.total,
          };
          monthlyRevenueBarChartsAcc.overview.push(monthlyRevenueOverviewBarChart);

          const monthlyRevenueRepairBarChart: BarChartData = {
            Months: month,
            Repair: monthlyRepairRevenue,
          };
          monthlyRevenueBarChartsAcc.repair.push(monthlyRevenueRepairBarChart);

          const monthlyRevenueSalesBarChart: BarChartData = {
            Months: month,
            "In Store": monthlySalesRevenue.inStore,
            Online: monthlySalesRevenue.online,
          };
          monthlyRevenueBarChartsAcc.sales.push(monthlyRevenueSalesBarChart);

          const monthlyRevenueInStoreBarChart: BarChartData = {
            Months: month,
            "In Store": monthlySalesRevenue.inStore,
          };
          monthlyRevenueBarChartsAcc.inStore.push(monthlyRevenueInStoreBarChart);

          const monthlyRevenueOnlineBarChart: BarChartData = {
            Months: month,
            Online: monthlySalesRevenue.online,
          };
          monthlyRevenueBarChartsAcc.online.push(monthlyRevenueOnlineBarChart);

          // revenue -> line chart

          const monthlyRevenueTotalLineChart = {
            x: month,
            y: monthlyTotalRevenue,
          };
          monthlyRevenueLineChartsAcc.total
            .find((lineChartData: LineChartData) => lineChartData.id === "Total")
            ?.data.push(monthlyRevenueTotalLineChart);

          const monthlyRevenueAllRepairLineChart = {
            x: month,
            y: monthlyRepairRevenue,
          };
          monthlyRevenueLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(monthlyRevenueAllRepairLineChart);

          const monthlyRevenueAllInStoreLineChart = {
            x: month,
            y: monthlySalesRevenue.inStore,
          };
          monthlyRevenueLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(monthlyRevenueAllInStoreLineChart);

          const monthlyRevenueAllOnlineLineChart = {
            x: month,
            y: monthlySalesRevenue.online,
          };
          monthlyRevenueLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(monthlyRevenueAllOnlineLineChart);

          const monthlyRevenueOverviewRepairLineChart = {
            x: month,
            y: monthlyRepairRevenue,
          };
          monthlyRevenueLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(monthlyRevenueOverviewRepairLineChart);

          const monthlyRevenueOverviewSalesLineChart = {
            x: month,
            y: monthlySalesRevenue.total,
          };
          monthlyRevenueLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Sales")
            ?.data.push(monthlyRevenueOverviewSalesLineChart);

          const monthlyRevenueRepairLineChart = {
            x: month,
            y: monthlyRepairRevenue,
          };
          monthlyRevenueLineChartsAcc.repair
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(monthlyRevenueRepairLineChart);

          const monthlyRevenueSalesInStoreLineChart = {
            x: month,
            y: monthlySalesRevenue.inStore,
          };
          monthlyRevenueLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(monthlyRevenueSalesInStoreLineChart);

          const monthlyRevenueSalesOnlineLineChart = {
            x: month,
            y: monthlySalesRevenue.online,
          };
          monthlyRevenueLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(monthlyRevenueSalesOnlineLineChart);

          const monthlyRevenueInStoreLineChart = {
            x: month,
            y: monthlySalesRevenue.inStore,
          };
          monthlyRevenueLineChartsAcc.inStore
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(monthlyRevenueInStoreLineChart);

          const monthlyRevenueOnlineLineChart = {
            x: month,
            y: monthlySalesRevenue.online,
          };
          monthlyRevenueLineChartsAcc.online
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(monthlyRevenueOnlineLineChart);

          // transactions

          const {
            transactions: {
              total: monthlyTotalTransactions,
              repair: monthlyRepairTransactions,
              sales: monthlySalesTransactions,
            },
          } = monthlyMetric;

          // transactions -> bar chart

          const monthlyTransactionsTotalBarChart: BarChartData = {
            Months: month,
            Total: monthlyTotalTransactions,
          };
          monthlyTransactionsBarChartsAcc.total.push(monthlyTransactionsTotalBarChart);

          const monthlyTransactionsAllBarChart: BarChartData = {
            Months: month,
            Repair: monthlyRepairTransactions,
            "In Store": monthlySalesTransactions.inStore,
            Online: monthlySalesTransactions.online,
          };
          monthlyTransactionsBarChartsAcc.all?.push(monthlyTransactionsAllBarChart);

          const monthlyTransactionsOverviewBarChart: BarChartData = {
            Months: month,
            Repair: monthlyRepairTransactions,
            Sales: monthlySalesTransactions.total,
          };
          monthlyTransactionsBarChartsAcc.overview.push(
            monthlyTransactionsOverviewBarChart
          );

          const monthlyTransactionsRepairBarChart: BarChartData = {
            Months: month,
            Repair: monthlyRepairTransactions,
          };
          monthlyTransactionsBarChartsAcc.repair.push(monthlyTransactionsRepairBarChart);

          const monthlyTransactionsSalesBarChart: BarChartData = {
            Months: month,
            "In Store": monthlySalesTransactions.inStore,
            Online: monthlySalesTransactions.online,
          };
          monthlyTransactionsBarChartsAcc.sales.push(monthlyTransactionsSalesBarChart);

          const monthlyTransactionsInStoreBarChart: BarChartData = {
            Months: month,
            "In Store": monthlySalesTransactions.inStore,
          };
          monthlyTransactionsBarChartsAcc.inStore.push(
            monthlyTransactionsInStoreBarChart
          );

          const monthlyTransactionsOnlineBarChart: BarChartData = {
            Months: month,
            Online: monthlySalesTransactions.online,
          };
          monthlyTransactionsBarChartsAcc.online.push(monthlyTransactionsOnlineBarChart);

          // transactions -> line chart

          const monthlyTransactionsTotalLineChart = {
            x: month,
            y: monthlyTotalTransactions,
          };
          monthlyTransactionsLineChartsAcc.total
            .find((lineChartData: LineChartData) => lineChartData.id === "Total")
            ?.data.push(monthlyTransactionsTotalLineChart);

          const monthlyTransactionsAllRepairLineChart = {
            x: month,
            y: monthlyRepairTransactions,
          };
          monthlyTransactionsLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(monthlyTransactionsAllRepairLineChart);

          const monthlyTransactionsAllInStoreLineChart = {
            x: month,
            y: monthlySalesTransactions.inStore,
          };
          monthlyTransactionsLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(monthlyTransactionsAllInStoreLineChart);

          const monthlyTransactionsAllOnlineLineChart = {
            x: month,
            y: monthlySalesTransactions.online,
          };
          monthlyTransactionsLineChartsAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(monthlyTransactionsAllOnlineLineChart);

          const monthlyTransactionsOverviewRepairLineChart = {
            x: month,
            y: monthlyRepairTransactions,
          };
          monthlyTransactionsLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(monthlyTransactionsOverviewRepairLineChart);

          const monthlyTransactionsOverviewSalesLineChart = {
            x: month,
            y: monthlySalesTransactions.total,
          };
          monthlyTransactionsLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Sales")
            ?.data.push(monthlyTransactionsOverviewSalesLineChart);

          const monthlyTransactionsRepairLineChart = {
            x: month,
            y: monthlyRepairTransactions,
          };
          monthlyTransactionsLineChartsAcc.repair
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(monthlyTransactionsRepairLineChart);

          const monthlyTransactionsSalesInStoreLineChart = {
            x: month,
            y: monthlySalesTransactions.inStore,
          };
          monthlyTransactionsLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(monthlyTransactionsSalesInStoreLineChart);

          const monthlyTransactionsSalesOnlineLineChart = {
            x: month,
            y: monthlySalesTransactions.online,
          };
          monthlyTransactionsLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(monthlyTransactionsSalesOnlineLineChart);

          const monthlyTransactionsInStoreLineChart = {
            x: month,
            y: monthlySalesTransactions.inStore,
          };
          monthlyTransactionsLineChartsAcc.inStore
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(monthlyTransactionsInStoreLineChart);

          const monthlyTransactionsOnlineLineChart = {
            x: month,
            y: monthlySalesTransactions.online,
          };
          monthlyTransactionsLineChartsAcc.online
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(monthlyTransactionsOnlineLineChart);

          // other metrics

          const {
            averageOrderValue: monthlyAverageOrderValue,
            conversionRate: monthlyConversionRate,
            netProfitMargin: monthlyNetProfitMargin,
          } = monthlyMetric;

          // other metrics -> bar chart

          const monthlyAverageOrderValueBarChartData: BarChartData = {
            Months: month,
            "Average Order Value": monthlyAverageOrderValue,
          };
          monthlyOtherMetricsBarChartsAcc.averageOrderValue?.push(
            monthlyAverageOrderValueBarChartData
          );

          const monthlyConversionRateBarChartData: BarChartData = {
            Months: month,
            "Conversion Rate": toFixedFloat(monthlyConversionRate * 100, 2),
          };
          monthlyOtherMetricsBarChartsAcc.conversionRate?.push(
            monthlyConversionRateBarChartData
          );

          const monthlyNetProfitMarginBarChartData: BarChartData = {
            Months: month,
            "Net Profit Margin": toFixedFloat(monthlyNetProfitMargin * 100, 2),
          };
          monthlyOtherMetricsBarChartsAcc.netProfitMargin?.push(
            monthlyNetProfitMarginBarChartData
          );

          // other metrics -> line chart

          const monthlyAverageOrderValueLineChartData = {
            x: month,
            y: monthlyAverageOrderValue,
          };
          monthlyOtherMetricsLineChartsAcc.averageOrderValue
            ?.find(
              (lineChartData: LineChartData) => lineChartData.id === "Average Order Value"
            )
            ?.data.push(monthlyAverageOrderValueLineChartData);

          const monthlyConversionRateLineChartData = {
            x: month,
            y: toFixedFloat(monthlyConversionRate * 100, 2),
          };
          monthlyOtherMetricsLineChartsAcc.conversionRate
            ?.find(
              (lineChartData: LineChartData) => lineChartData.id === "Conversion Rate"
            )
            ?.data.push(monthlyConversionRateLineChartData);

          const monthlyNetProfitMarginLineChartData = {
            x: month,
            y: toFixedFloat(monthlyNetProfitMargin * 100, 2),
          };
          monthlyOtherMetricsLineChartsAcc.netProfitMargin
            ?.find(
              (lineChartData: LineChartData) => lineChartData.id === "Net Profit Margin"
            )
            ?.data.push(monthlyNetProfitMarginLineChartData);

          return monthlyMetricsChartsAcc;
        },
        [
          structuredClone(barChartsTemplate),
          structuredClone(lineChartsTemplate),

          structuredClone(barChartsTemplate),
          structuredClone(lineChartsTemplate),

          structuredClone(barChartsTemplate),
          structuredClone(lineChartsTemplate),

          structuredClone(barChartsTemplate),
          structuredClone(lineChartsTemplate),

          structuredClone(otherMetricsBarChartsTemplate),
          structuredClone(otherMetricsLineChartsTemplate),
        ]
      );

      // monthly -> profit -> pie chart
      const monthlyProfitRepairPieChart = {
        id: "Repair",
        label: "Repair",
        value: selectedMonthMetrics.profit.repair,
      };
      const monthlyProfitSalesPieChart = {
        id: "Sales",
        label: "Sales",
        value: selectedMonthMetrics.profit.sales.total,
      };
      const monthlyProfitInStorePieChart = {
        id: "In Store",
        label: "In Store",
        value: selectedMonthMetrics.profit.sales.inStore,
      };
      const monthlyProfitOnlinePieChart = {
        id: "Online",
        label: "Online",
        value: selectedMonthMetrics.profit.sales.online,
      };

      const monthlyProfitPieCharts = {
        overview: [monthlyProfitRepairPieChart, monthlyProfitSalesPieChart],
        all: [
          monthlyProfitRepairPieChart,
          monthlyProfitInStorePieChart,
          monthlyProfitOnlinePieChart,
        ],
        sales: [monthlyProfitInStorePieChart, monthlyProfitOnlinePieChart],
      };

      // monthly -> expenses -> pie chart
      const monthlyExpensesRepairPieChart = {
        id: "Repair",
        label: "Repair",
        value: selectedMonthMetrics.expenses.repair,
      };
      const monthlyExpensesSalesPieChart = {
        id: "Sales",
        label: "Sales",
        value: selectedMonthMetrics.expenses.sales.total,
      };
      const monthlyExpensesInStorePieChart = {
        id: "In Store",
        label: "In Store",
        value: selectedMonthMetrics.expenses.sales.inStore,
      };
      const monthlyExpensesOnlinePieChart = {
        id: "Online",
        label: "Online",
        value: selectedMonthMetrics.expenses.sales.online,
      };
      const monthlyExpensesPieCharts = {
        overview: [monthlyExpensesRepairPieChart, monthlyExpensesSalesPieChart],
        all: [
          monthlyExpensesRepairPieChart,
          monthlyExpensesInStorePieChart,
          monthlyExpensesOnlinePieChart,
        ],
        sales: [monthlyExpensesInStorePieChart, monthlyExpensesOnlinePieChart],
      };

      // monthly -> revenue -> pie chart
      const monthlyRevenueRepairPieChart = {
        id: "Repair",
        label: "Repair",
        value: selectedMonthMetrics.revenue.repair,
      };
      const monthlyRevenueSalesPieChart = {
        id: "Sales",
        label: "Sales",
        value: selectedMonthMetrics.revenue.sales.total,
      };
      const monthlyRevenueInStorePieChart = {
        id: "In Store",
        label: "In Store",
        value: selectedMonthMetrics.revenue.sales.inStore,
      };
      const monthlyRevenueOnlinePieChart = {
        id: "Online",
        label: "Online",
        value: selectedMonthMetrics.revenue.sales.online,
      };

      const monthlyRevenuePieCharts = {
        overview: [monthlyRevenueRepairPieChart, monthlyRevenueSalesPieChart],
        all: [
          monthlyRevenueRepairPieChart,
          monthlyRevenueInStorePieChart,
          monthlyRevenueOnlinePieChart,
        ],
        sales: [monthlyRevenueInStorePieChart, monthlyRevenueOnlinePieChart],
      };

      // monthly -> transactions -> pie chart
      const monthlyTransactionsRepairPieChart = {
        id: "Repair",
        label: "Repair",
        value: selectedMonthMetrics.transactions.repair,
      };
      const monthlyTransactionsSalesPieChart = {
        id: "Sales",
        label: "Sales",
        value: selectedMonthMetrics.transactions.sales.total,
      };
      const monthlyTransactionsInStorePieChart = {
        id: "In Store",
        label: "In Store",
        value: selectedMonthMetrics.transactions.sales.inStore,
      };
      const monthlyTransactionsOnlinePieChart = {
        id: "Online",
        label: "Online",
        value: selectedMonthMetrics.transactions.sales.online,
      };

      const monthlyTransactionsPieCharts = {
        overview: [monthlyTransactionsRepairPieChart, monthlyTransactionsSalesPieChart],
        all: [
          monthlyTransactionsRepairPieChart,
          monthlyTransactionsInStorePieChart,
          monthlyTransactionsOnlinePieChart,
        ],
        sales: [monthlyTransactionsInStorePieChart, monthlyTransactionsOnlinePieChart],
      };

      resolve({
        revenue: {
          bar: monthlyRevenueBarCharts,
          line: monthlyRevenueLineCharts,
          pie: monthlyRevenuePieCharts,
        },
        profit: {
          bar: monthlyProfitBarCharts,
          line: monthlyProfitLineCharts,
          pie: monthlyProfitPieCharts,
        },
        expenses: {
          bar: monthlyExpensesBarCharts,
          line: monthlyExpensesLineCharts,
          pie: monthlyExpensesPieCharts,
        },
        transactions: {
          bar: monthlyTransactionsBarCharts,
          line: monthlyTransactionsLineCharts,
          pie: monthlyTransactionsPieCharts,
        },
        otherMetrics: {
          bar: monthlyOtherMetricsBarCharts,
          line: monthlyOtherMetricsLineCharts,
        },
      });
    }, 0);
  });
}

type CreateYearlyFinancialChartsInput = {
  barChartsTemplate: FinancialMetricsBarCharts;
  lineChartsTemplate: FinancialMetricLineCharts;
  otherMetricsBarChartsTemplate: FinancialOtherMetricsBarCharts;
  otherMetricsLineChartsTemplate: FinancialOtherMetricsLineCharts;
  pieChartsTemplate: FinancialMetricsPieCharts;
  selectedYearMetrics?: YearlyFinancialMetric;
  yearlyMetrics?: YearlyFinancialMetric[];
};
async function createYearlyFinancialCharts({
  yearlyMetrics,
  selectedYearMetrics,
  pieChartsTemplate,
  otherMetricsLineChartsTemplate,
  otherMetricsBarChartsTemplate,
  lineChartsTemplate,
  barChartsTemplate,
}: CreateYearlyFinancialChartsInput): Promise<FinancialMetricsCharts["yearlyCharts"]> {
  if (!yearlyMetrics || !selectedYearMetrics) {
    return new Promise((resolve) => {
      resolve({
        profit: {
          bar: barChartsTemplate,
          line: lineChartsTemplate,
          pie: pieChartsTemplate,
        },
        expenses: {
          bar: barChartsTemplate,
          line: lineChartsTemplate,
          pie: pieChartsTemplate,
        },
        revenue: {
          bar: barChartsTemplate,
          line: lineChartsTemplate,
          pie: pieChartsTemplate,
        },
        transactions: {
          bar: barChartsTemplate,
          line: lineChartsTemplate,
          pie: pieChartsTemplate,
        },
        otherMetrics: {
          bar: otherMetricsBarChartsTemplate,
          line: otherMetricsLineChartsTemplate,
        },
      });
    });
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const [
        yearlyProfitBarChartsObj,
        yearlyProfitLineChartsObj,

        yearlyExpensesBarChartsObj,
        yearlyExpensesLineChartsObj,

        yearlyRevenueBarChartsObj,
        yearlyRevenueLineChartsObj,

        yearlyTransactionsBarChartsObj,
        yearlyTransactionsLineChartsObj,

        yearlyOtherMetricsBarChartsObj,
        yearlyOtherMetricsLineChartsObj,
      ] = yearlyMetrics.reduce(
        (yearlyMetricsChartsObjAcc, yearlyMetric) => {
          const [
            yearlyProfitBarChartsObjAcc,
            yearlyProfitLineChartsObjAcc,

            yearlyExpensesBarChartsObjAcc,
            yearlyExpensesLineChartsObjAcc,

            yearlyRevenueBarChartsObjAcc,
            yearlyRevenueLineChartsObjAcc,

            yearlyTransactionsBarChartsObjAcc,
            yearlyTransactionsLineChartsObjAcc,

            yearlyOtherMetricsBarChartsObjAcc,
            yearlyOtherMetricsLineChartsObjAcc,
          ] = yearlyMetricsChartsObjAcc;

          // profit

          const {
            year,
            profit: {
              total: yearlyTotalProfit,
              repair: yearlyRepairProfit,
              sales: yearlySalesProfit,
            },
          } = yearlyMetric;

          // prevents current year from being added to charts
          const currentYear = new Date().getFullYear();
          if (year === currentYear.toString()) {
            return yearlyMetricsChartsObjAcc;
          }

          // profit -> bar chart data

          const yearlyProfitTotalBarChart: BarChartData = {
            Years: year,
            Total: yearlyTotalProfit,
          };
          yearlyProfitBarChartsObjAcc.total.push(yearlyProfitTotalBarChart);

          const yearlyProfitAllBarChart: BarChartData = {
            Years: year,
            Repair: yearlyRepairProfit,
            "In Store": yearlySalesProfit.inStore,
            Online: yearlySalesProfit.online,
          };
          yearlyProfitBarChartsObjAcc.all.push(yearlyProfitAllBarChart);

          const yearlyProfitOverviewBarChart: BarChartData = {
            Years: year,
            Repair: yearlyRepairProfit,
            Sales: yearlySalesProfit.total,
          };
          yearlyProfitBarChartsObjAcc.overview.push(yearlyProfitOverviewBarChart);

          const yearlyProfitRepairBarChart: BarChartData = {
            Years: year,
            Repair: yearlyRepairProfit,
          };
          yearlyProfitBarChartsObjAcc.repair.push(yearlyProfitRepairBarChart);

          const yearlyProfitSalesBarChart: BarChartData = {
            Years: year,
            "In Store": yearlySalesProfit.inStore,
            Online: yearlySalesProfit.online,
          };
          yearlyProfitBarChartsObjAcc.sales.push(yearlyProfitSalesBarChart);

          const yearlyProfitInStoreBarChart: BarChartData = {
            Years: year,
            "In Store": yearlySalesProfit.inStore,
          };
          yearlyProfitBarChartsObjAcc.inStore.push(yearlyProfitInStoreBarChart);

          const yearlyProfitOnlineBarChart: BarChartData = {
            Years: year,
            Online: yearlySalesProfit.online,
          };
          yearlyProfitBarChartsObjAcc.online.push(yearlyProfitOnlineBarChart);

          // profit -> line chart data

          const yearlyProfitTotalLineChart = {
            x: year,
            y: yearlyTotalProfit,
          };
          yearlyProfitLineChartsObjAcc.total
            .find((lineChartData: LineChartData) => lineChartData.id === "Total")
            ?.data.push(yearlyProfitTotalLineChart);

          const yearlyProfitAllRepairLineChart = {
            x: year,
            y: yearlyRepairProfit,
          };
          yearlyProfitLineChartsObjAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(yearlyProfitAllRepairLineChart);

          const yearlyProfitAllInStoreLineChart = {
            x: year,
            y: yearlySalesProfit.inStore,
          };
          yearlyProfitLineChartsObjAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(yearlyProfitAllInStoreLineChart);

          const yearlyProfitAllOnlineLineChart = {
            x: year,
            y: yearlySalesProfit.online,
          };
          yearlyProfitLineChartsObjAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(yearlyProfitAllOnlineLineChart);

          const yearlyProfitOverviewRepairLineChart = {
            x: year,
            y: yearlyRepairProfit,
          };
          yearlyProfitLineChartsObjAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(yearlyProfitOverviewRepairLineChart);

          const yearlyProfitOverviewSalesLineChart = {
            x: year,
            y: yearlySalesProfit.total,
          };
          yearlyProfitLineChartsObjAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Sales")
            ?.data.push(yearlyProfitOverviewSalesLineChart);

          const yearlyProfitRepairLineChart = {
            x: year,
            y: yearlyRepairProfit,
          };
          yearlyProfitLineChartsObjAcc.repair
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(yearlyProfitRepairLineChart);

          const yearlyProfitSalesInStoreLineChart = {
            x: year,
            y: yearlySalesProfit.inStore,
          };
          yearlyProfitLineChartsObjAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(yearlyProfitSalesInStoreLineChart);

          const yearlyProfitSalesOnlineLineChart = {
            x: year,
            y: yearlySalesProfit.online,
          };
          yearlyProfitLineChartsObjAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(yearlyProfitSalesOnlineLineChart);

          const yearlyProfitInStoreLineChart = {
            x: year,
            y: yearlySalesProfit.inStore,
          };
          yearlyProfitLineChartsObjAcc.inStore
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(yearlyProfitInStoreLineChart);

          const yearlyProfitOnlineLineChart = {
            x: year,
            y: yearlySalesProfit.online,
          };
          yearlyProfitLineChartsObjAcc.online
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(yearlyProfitOnlineLineChart);

          // expenses

          const {
            expenses: {
              total: yearlyTotalExpenses,
              repair: yearlyRepairExpenses,
              sales: yearlySalesExpenses,
            },
          } = yearlyMetric;

          // expenses -> bar chart data

          const yearlyExpensesTotalBarChart: BarChartData = {
            Years: year,
            Total: yearlyTotalExpenses,
          };
          yearlyExpensesBarChartsObjAcc.total.push(yearlyExpensesTotalBarChart);

          const yearlyExpensesAllBarChart: BarChartData = {
            Years: year,
            Repair: yearlyRepairExpenses,
            "In Store": yearlySalesExpenses.inStore,
            Online: yearlySalesExpenses.online,
          };
          yearlyExpensesBarChartsObjAcc.all?.push(yearlyExpensesAllBarChart);

          const yearlyExpensesOverviewBarChart: BarChartData = {
            Years: year,
            Repair: yearlyRepairExpenses,
            Sales: yearlySalesExpenses.total,
          };
          yearlyExpensesBarChartsObjAcc.overview.push(yearlyExpensesOverviewBarChart);

          const yearlyExpensesRepairBarChart: BarChartData = {
            Years: year,
            Repair: yearlyRepairExpenses,
          };
          yearlyExpensesBarChartsObjAcc.repair.push(yearlyExpensesRepairBarChart);

          const yearlyExpensesSalesBarChart: BarChartData = {
            Years: year,
            "In Store": yearlySalesExpenses.inStore,
            Online: yearlySalesExpenses.online,
          };
          yearlyExpensesBarChartsObjAcc.sales.push(yearlyExpensesSalesBarChart);

          const yearlyExpensesInStoreBarChart: BarChartData = {
            Years: year,
            "In Store": yearlySalesExpenses.inStore,
          };
          yearlyExpensesBarChartsObjAcc.inStore.push(yearlyExpensesInStoreBarChart);

          const yearlyExpensesOnlineBarChart: BarChartData = {
            Years: year,
            Online: yearlySalesExpenses.online,
          };
          yearlyExpensesBarChartsObjAcc.online.push(yearlyExpensesOnlineBarChart);

          // expenses -> line chart data

          const yearlyExpensesTotalLineChart = {
            x: year,
            y: yearlyTotalExpenses,
          };
          yearlyExpensesLineChartsObjAcc.total
            .find((lineChartData: LineChartData) => lineChartData.id === "Total")
            ?.data.push(yearlyExpensesTotalLineChart);

          const yearlyExpensesAllRepairLineChart = {
            x: year,
            y: yearlyRepairExpenses,
          };
          yearlyExpensesLineChartsObjAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(yearlyExpensesAllRepairLineChart);

          const yearlyExpensesAllInStoreLineChart = {
            x: year,
            y: yearlySalesExpenses.inStore,
          };
          yearlyExpensesLineChartsObjAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(yearlyExpensesAllInStoreLineChart);

          const yearlyExpensesAllOnlineLineChart = {
            x: year,
            y: yearlySalesExpenses.online,
          };
          yearlyExpensesLineChartsObjAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(yearlyExpensesAllOnlineLineChart);

          const yearlyExpensesOverviewRepairLineChart = {
            x: year,
            y: yearlyRepairExpenses,
          };
          yearlyExpensesLineChartsObjAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(yearlyExpensesOverviewRepairLineChart);

          const yearlyExpensesOverviewSalesLineChart = {
            x: year,
            y: yearlySalesExpenses.total,
          };
          yearlyExpensesLineChartsObjAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Sales")
            ?.data.push(yearlyExpensesOverviewSalesLineChart);

          const yearlyExpensesRepairLineChart = {
            x: year,
            y: yearlyRepairExpenses,
          };
          yearlyExpensesLineChartsObjAcc.repair
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(yearlyExpensesRepairLineChart);

          const yearlyExpensesSalesInStoreLineChart = {
            x: year,
            y: yearlySalesExpenses.inStore,
          };
          yearlyExpensesLineChartsObjAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(yearlyExpensesSalesInStoreLineChart);

          const yearlyExpensesSalesOnlineLineChart = {
            x: year,
            y: yearlySalesExpenses.online,
          };
          yearlyExpensesLineChartsObjAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(yearlyExpensesSalesOnlineLineChart);

          const yearlyExpensesInStoreLineChart = {
            x: year,
            y: yearlySalesExpenses.inStore,
          };
          yearlyExpensesLineChartsObjAcc.inStore
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(yearlyExpensesInStoreLineChart);

          const yearlyExpensesOnlineLineChart = {
            x: year,
            y: yearlySalesExpenses.online,
          };
          yearlyExpensesLineChartsObjAcc.online
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(yearlyExpensesOnlineLineChart);

          // revenue

          const {
            revenue: {
              total: yearlyTotalRevenue,
              repair: yearlyRepairRevenue,
              sales: yearlySalesRevenue,
            },
          } = yearlyMetric;

          // revenue -> bar chart data

          const yearlyRevenueTotalBarChart: BarChartData = {
            Years: year,
            Total: yearlyTotalRevenue,
          };
          yearlyRevenueBarChartsObjAcc.total.push(yearlyRevenueTotalBarChart);

          const yearlyRevenueAllBarChart: BarChartData = {
            Years: year,
            Repair: yearlyRepairRevenue,
            "In Store": yearlySalesRevenue.inStore,
            Online: yearlySalesRevenue.online,
          };
          yearlyRevenueBarChartsObjAcc.all?.push(yearlyRevenueAllBarChart);

          const yearlyRevenueOverviewBarChart: BarChartData = {
            Years: year,
            Repair: yearlyRepairRevenue,
            Sales: yearlySalesRevenue.total,
          };
          yearlyRevenueBarChartsObjAcc.overview.push(yearlyRevenueOverviewBarChart);

          const yearlyRevenueRepairBarChart: BarChartData = {
            Years: year,
            Repair: yearlyRepairRevenue,
          };
          yearlyRevenueBarChartsObjAcc.repair.push(yearlyRevenueRepairBarChart);

          const yearlyRevenueSalesBarChart: BarChartData = {
            Years: year,
            "In Store": yearlySalesRevenue.inStore,
            Online: yearlySalesRevenue.online,
          };
          yearlyRevenueBarChartsObjAcc.sales.push(yearlyRevenueSalesBarChart);

          const yearlyRevenueInStoreBarChart: BarChartData = {
            Years: year,
            "In Store": yearlySalesRevenue.inStore,
          };
          yearlyRevenueBarChartsObjAcc.inStore.push(yearlyRevenueInStoreBarChart);

          const yearlyRevenueOnlineBarChart: BarChartData = {
            Years: year,
            Online: yearlySalesRevenue.online,
          };
          yearlyRevenueBarChartsObjAcc.online.push(yearlyRevenueOnlineBarChart);

          // revenue -> line chart data

          const yearlyRevenueTotalLineChart = {
            x: year,
            y: yearlyTotalRevenue,
          };
          yearlyRevenueLineChartsObjAcc.total
            .find((lineChartData: LineChartData) => lineChartData.id === "Total")
            ?.data.push(yearlyRevenueTotalLineChart);

          const yearlyRevenueAllRepairLineChart = {
            x: year,
            y: yearlyRepairRevenue,
          };
          yearlyRevenueLineChartsObjAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(yearlyRevenueAllRepairLineChart);

          const yearlyRevenueAllInStoreLineChart = {
            x: year,
            y: yearlySalesRevenue.inStore,
          };
          yearlyRevenueLineChartsObjAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(yearlyRevenueAllInStoreLineChart);

          const yearlyRevenueAllOnlineLineChart = {
            x: year,
            y: yearlySalesRevenue.online,
          };
          yearlyRevenueLineChartsObjAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(yearlyRevenueAllOnlineLineChart);

          const yearlyRevenueOverviewRepairLineChart = {
            x: year,
            y: yearlyRepairRevenue,
          };
          yearlyRevenueLineChartsObjAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(yearlyRevenueOverviewRepairLineChart);

          const yearlyRevenueOverviewSalesLineChart = {
            x: year,
            y: yearlySalesRevenue.total,
          };
          yearlyRevenueLineChartsObjAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Sales")
            ?.data.push(yearlyRevenueOverviewSalesLineChart);

          const yearlyRevenueRepairLineChart = {
            x: year,
            y: yearlyRepairRevenue,
          };
          yearlyRevenueLineChartsObjAcc.repair
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(yearlyRevenueRepairLineChart);

          const yearlyRevenueSalesInStoreLineChart = {
            x: year,
            y: yearlySalesRevenue.inStore,
          };
          yearlyRevenueLineChartsObjAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(yearlyRevenueSalesInStoreLineChart);

          const yearlyRevenueSalesOnlineLineChart = {
            x: year,
            y: yearlySalesRevenue.online,
          };
          yearlyRevenueLineChartsObjAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(yearlyRevenueSalesOnlineLineChart);

          const yearlyRevenueInStoreLineChart = {
            x: year,
            y: yearlySalesRevenue.inStore,
          };
          yearlyRevenueLineChartsObjAcc.inStore
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(yearlyRevenueInStoreLineChart);

          const yearlyRevenueOnlineLineChart = {
            x: year,
            y: yearlySalesRevenue.online,
          };
          yearlyRevenueLineChartsObjAcc.online
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(yearlyRevenueOnlineLineChart);

          // transactions

          const {
            transactions: {
              total: yearlyTotalTransactions,
              repair: yearlyRepairTransactions,
              sales: yearlySalesTransactions,
            },
          } = yearlyMetric;

          // transactions -> bar chart data

          const yearlyTransactionsTotalBarChart: BarChartData = {
            Years: year,
            Total: yearlyTotalTransactions,
          };
          yearlyTransactionsBarChartsObjAcc.total.push(yearlyTransactionsTotalBarChart);

          const yearlyTransactionsAllBarChart: BarChartData = {
            Years: year,
            Repair: yearlyRepairTransactions,
            "In Store": yearlySalesTransactions.inStore,
            Online: yearlySalesTransactions.online,
          };
          yearlyTransactionsBarChartsObjAcc.all?.push(yearlyTransactionsAllBarChart);

          const yearlyTransactionsOverviewBarChart: BarChartData = {
            Years: year,
            Repair: yearlyRepairTransactions,
            Sales: yearlySalesTransactions.total,
          };
          yearlyTransactionsBarChartsObjAcc.overview.push(
            yearlyTransactionsOverviewBarChart
          );

          const yearlyTransactionsRepairBarChart: BarChartData = {
            Years: year,
            Repair: yearlyRepairTransactions,
          };
          yearlyTransactionsBarChartsObjAcc.repair.push(yearlyTransactionsRepairBarChart);

          const yearlyTransactionsSalesBarChart: BarChartData = {
            Years: year,
            "In Store": yearlySalesTransactions.inStore,
            Online: yearlySalesTransactions.online,
          };
          yearlyTransactionsBarChartsObjAcc.sales.push(yearlyTransactionsSalesBarChart);

          const yearlyTransactionsInStoreBarChart: BarChartData = {
            Years: year,
            "In Store": yearlySalesTransactions.inStore,
          };
          yearlyTransactionsBarChartsObjAcc.inStore.push(
            yearlyTransactionsInStoreBarChart
          );

          const yearlyTransactionsOnlineBarChart: BarChartData = {
            Years: year,
            Online: yearlySalesTransactions.online,
          };
          yearlyTransactionsBarChartsObjAcc.online.push(yearlyTransactionsOnlineBarChart);

          // transactions -> line chart data

          const yearlyTransactionsTotalLineChart = {
            x: year,
            y: yearlyTotalTransactions,
          };
          yearlyTransactionsLineChartsObjAcc.total
            .find((lineChartData: LineChartData) => lineChartData.id === "Total")
            ?.data.push(yearlyTransactionsTotalLineChart);

          const yearlyTransactionsAllRepairLineChart = {
            x: year,
            y: yearlyRepairTransactions,
          };
          yearlyTransactionsLineChartsObjAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(yearlyTransactionsAllRepairLineChart);

          const yearlyTransactionsAllInStoreLineChart = {
            x: year,
            y: yearlySalesTransactions.inStore,
          };
          yearlyTransactionsLineChartsObjAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(yearlyTransactionsAllInStoreLineChart);

          const yearlyTransactionsAllOnlineLineChart = {
            x: year,
            y: yearlySalesTransactions.online,
          };
          yearlyTransactionsLineChartsObjAcc.all
            ?.find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(yearlyTransactionsAllOnlineLineChart);

          const yearlyTransactionsOverviewRepairLineChart = {
            x: year,
            y: yearlyRepairTransactions,
          };
          yearlyTransactionsLineChartsObjAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(yearlyTransactionsOverviewRepairLineChart);

          const yearlyTransactionsOverviewSalesLineChart = {
            x: year,
            y: yearlySalesTransactions.total,
          };
          yearlyTransactionsLineChartsObjAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Sales")
            ?.data.push(yearlyTransactionsOverviewSalesLineChart);

          const yearlyTransactionsRepairLineChart = {
            x: year,
            y: yearlyRepairTransactions,
          };
          yearlyTransactionsLineChartsObjAcc.repair
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(yearlyTransactionsRepairLineChart);

          const yearlyTransactionsSalesInStoreLineChart = {
            x: year,
            y: yearlySalesTransactions.inStore,
          };
          yearlyTransactionsLineChartsObjAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(yearlyTransactionsSalesInStoreLineChart);

          const yearlyTransactionsSalesOnlineLineChart = {
            x: year,
            y: yearlySalesTransactions.online,
          };
          yearlyTransactionsLineChartsObjAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(yearlyTransactionsSalesOnlineLineChart);

          const yearlyTransactionsInStoreLineChart = {
            x: year,
            y: yearlySalesTransactions.inStore,
          };
          yearlyTransactionsLineChartsObjAcc.inStore
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(yearlyTransactionsInStoreLineChart);

          const yearlyTransactionsOnlineLineChart = {
            x: year,
            y: yearlySalesTransactions.online,
          };
          yearlyTransactionsLineChartsObjAcc.online
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(yearlyTransactionsOnlineLineChart);

          // other metrics

          const {
            averageOrderValue: yearlyAverageOrderValue,
            conversionRate: yearlyConversionRate,
            netProfitMargin: yearlyNetProfitMargin,
          } = yearlyMetric;

          // other metrics -> bar chart data

          const yearlyAverageOrderValueBarChartData: BarChartData = {
            Years: year,
            "Average Order Value": yearlyAverageOrderValue,
          };
          yearlyOtherMetricsBarChartsObjAcc.averageOrderValue?.push(
            yearlyAverageOrderValueBarChartData
          );

          const yearlyConversionRateBarChartData: BarChartData = {
            Years: year,
            "Conversion Rate": toFixedFloat(yearlyConversionRate * 100, 2),
          };
          yearlyOtherMetricsBarChartsObjAcc.conversionRate?.push(
            yearlyConversionRateBarChartData
          );

          const yearlyNetProfitMarginBarChartData: BarChartData = {
            Years: year,
            "Net Profit Margin": toFixedFloat(yearlyNetProfitMargin * 100, 2),
          };
          yearlyOtherMetricsBarChartsObjAcc.netProfitMargin?.push(
            yearlyNetProfitMarginBarChartData
          );

          // other metrics -> line chart data

          const yearlyAverageOrderValueLineChartData = {
            x: year,
            y: yearlyAverageOrderValue,
          };
          yearlyOtherMetricsLineChartsObjAcc.averageOrderValue
            ?.find(
              (lineChartData: LineChartData) => lineChartData.id === "Average Order Value"
            )
            ?.data.push(yearlyAverageOrderValueLineChartData);

          const yearlyConversionRateLineChartData = {
            x: year,
            y: toFixedFloat(yearlyConversionRate * 100, 2),
          };
          yearlyOtherMetricsLineChartsObjAcc.conversionRate
            ?.find(
              (lineChartData: LineChartData) => lineChartData.id === "Conversion Rate"
            )
            ?.data.push(yearlyConversionRateLineChartData);

          const yearlyNetProfitMarginLineChartData = {
            x: year,
            y: toFixedFloat(yearlyNetProfitMargin * 100, 2),
          };
          yearlyOtherMetricsLineChartsObjAcc.netProfitMargin
            ?.find(
              (lineChartData: LineChartData) => lineChartData.id === "Net Profit Margin"
            )
            ?.data.push(yearlyNetProfitMarginLineChartData);

          return yearlyMetricsChartsObjAcc;
        },
        [
          structuredClone(barChartsTemplate),
          structuredClone(lineChartsTemplate),

          structuredClone(barChartsTemplate),
          structuredClone(lineChartsTemplate),

          structuredClone(barChartsTemplate),
          structuredClone(lineChartsTemplate),

          structuredClone(barChartsTemplate),
          structuredClone(lineChartsTemplate),

          structuredClone(otherMetricsBarChartsTemplate),
          structuredClone(otherMetricsLineChartsTemplate),
        ]
      );

      // yearly -> templates -> profit -> pie chart
      const yearlyProfitRepairPieChart: PieChartData = {
        id: "Repair",
        label: "Repair",
        value: selectedYearMetrics.profit.repair,
      };
      const yearlyProfitSalesPieChart: PieChartData = {
        id: "Sales",
        label: "Sales",
        value: selectedYearMetrics.profit.sales.total,
      };
      const yearlyProfitSalesInStorePieChart: PieChartData = {
        id: "In Store",
        label: "In Store",
        value: selectedYearMetrics.profit.sales.inStore,
      };
      const yearlyProfitSalesOnlinePieChart: PieChartData = {
        id: "Online",
        label: "Online",
        value: selectedYearMetrics.profit.sales.online,
      };

      const yearlyProfitPie: FinancialMetricsPieCharts = {
        overview: [yearlyProfitRepairPieChart, yearlyProfitSalesPieChart],
        all: [
          yearlyProfitRepairPieChart,
          yearlyProfitSalesInStorePieChart,
          yearlyProfitSalesOnlinePieChart,
        ],
        sales: [yearlyProfitSalesInStorePieChart, yearlyProfitSalesOnlinePieChart],
      };

      // yearly -> templates -> expenses -> pie chart
      const yearlyExpensesRepairPieChart: PieChartData = {
        id: "Repair",
        label: "Repair",
        value: selectedYearMetrics.expenses.repair,
      };
      const yearlyExpensesSalesPieChart: PieChartData = {
        id: "Sales",
        label: "Sales",
        value: selectedYearMetrics.expenses.sales.total,
      };
      const yearlyExpensesSalesInStorePieChart: PieChartData = {
        id: "In Store",
        label: "In Store",
        value: selectedYearMetrics.expenses.sales.inStore,
      };
      const yearlyExpensesSalesOnlinePieChart: PieChartData = {
        id: "Online",
        label: "Online",
        value: selectedYearMetrics.expenses.sales.online,
      };

      const yearlyExpensesPie: FinancialMetricsPieCharts = {
        overview: [yearlyExpensesRepairPieChart, yearlyExpensesSalesPieChart],
        all: [
          yearlyExpensesRepairPieChart,
          yearlyExpensesSalesInStorePieChart,
          yearlyExpensesSalesOnlinePieChart,
        ],
        sales: [yearlyExpensesSalesInStorePieChart, yearlyExpensesSalesOnlinePieChart],
      };

      // yearly -> templates -> revenue -> pie chart
      const yearlyRevenueRepairPieChart: PieChartData = {
        id: "Repair",
        label: "Repair",
        value: selectedYearMetrics.revenue.repair,
      };
      const yearlyRevenueSalesPieChart: PieChartData = {
        id: "Sales",
        label: "Sales",
        value: selectedYearMetrics.revenue.sales.total,
      };
      const yearlyRevenueSalesInStorePieChart: PieChartData = {
        id: "In Store",
        label: "In Store",
        value: selectedYearMetrics.revenue.sales.inStore,
      };
      const yearlyRevenueSalesOnlinePieChart: PieChartData = {
        id: "Online",
        label: "Online",
        value: selectedYearMetrics.revenue.sales.online,
      };

      const yearlyRevenuePie: FinancialMetricsPieCharts = {
        overview: [yearlyRevenueRepairPieChart, yearlyRevenueSalesPieChart],
        all: [
          yearlyRevenueRepairPieChart,
          yearlyRevenueSalesInStorePieChart,
          yearlyRevenueSalesOnlinePieChart,
        ],
        sales: [yearlyRevenueSalesInStorePieChart, yearlyRevenueSalesOnlinePieChart],
      };

      // yearly -> templates -> transactions -> pie chart
      const yearlyTransactionsRepairPieChart: PieChartData = {
        id: "Repair",
        label: "Repair",
        value: selectedYearMetrics.transactions.repair,
      };
      const yearlyTransactionsSalesPieChart: PieChartData = {
        id: "Sales",
        label: "Sales",
        value: selectedYearMetrics.transactions.sales.total,
      };
      const yearlyTransactionsSalesInStorePieChart: PieChartData = {
        id: "In Store",
        label: "In Store",
        value: selectedYearMetrics.transactions.sales.inStore,
      };
      const yearlyTransactionsSalesOnlinePieChart: PieChartData = {
        id: "Online",
        label: "Online",
        value: selectedYearMetrics.transactions.sales.online,
      };

      const yearlyTransactionsPie: FinancialMetricsPieCharts = {
        overview: [yearlyTransactionsRepairPieChart, yearlyTransactionsSalesPieChart],
        all: [
          yearlyTransactionsRepairPieChart,
          yearlyTransactionsSalesInStorePieChart,
          yearlyTransactionsSalesOnlinePieChart,
        ],
        sales: [
          yearlyTransactionsSalesInStorePieChart,
          yearlyTransactionsSalesOnlinePieChart,
        ],
      };

      resolve({
        revenue: {
          bar: yearlyRevenueBarChartsObj,
          line: yearlyRevenueLineChartsObj,
          pie: yearlyRevenuePie,
        },
        expenses: {
          bar: yearlyExpensesBarChartsObj,
          line: yearlyExpensesLineChartsObj,
          pie: yearlyExpensesPie,
        },
        profit: {
          bar: yearlyProfitBarChartsObj,
          line: yearlyProfitLineChartsObj,
          pie: yearlyProfitPie,
        },
        transactions: {
          bar: yearlyTransactionsBarChartsObj,
          line: yearlyTransactionsLineChartsObj,
          pie: yearlyTransactionsPie,
        },
        otherMetrics: {
          bar: yearlyOtherMetricsBarChartsObj,
          line: yearlyOtherMetricsLineChartsObj,
        },
      });
    }, 0);
  });
}

function returnCalendarViewFinancialCharts(
  calendarView: DashboardCalendarView,
  financialMetricsCharts: FinancialMetricsCharts
) {
  return calendarView === "Daily"
    ? financialMetricsCharts.dailyCharts
    : calendarView === "Monthly"
    ? financialMetricsCharts.monthlyCharts
    : financialMetricsCharts.yearlyCharts;
}

export {
  createFinancialMetricsCharts,
  createYearlyFinancialCharts,
  returnCalendarViewFinancialCharts,
  returnSelectedDateFinancialMetrics,
};
export type {
  FinancialMetricsBarCharts,
  FinancialMetricsBarLineChartsKey,
  FinancialMetricsCharts,
  FinancialMetricsOtherMetricsChartsKey,
  FinancialMetricsPieCharts,
  FinancialMetricsPieChartsKey,
  ReturnFinancialMetricsChartsInput,
  SelectedDateFinancialMetrics,
};
