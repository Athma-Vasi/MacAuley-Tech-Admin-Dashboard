import { toFixedFloat } from "../../../utils";
import { BarChartData } from "../../charts/responsiveBarChart/types";
import { LineChartData } from "../../charts/responsiveLineChart/types";
import { PieChartData } from "../../charts/responsivePieChart/types";
import {
  BusinessMetric,
  BusinessMetricStoreLocation,
  CustomerDailyMetric,
  CustomerMonthlyMetric,
  CustomerYearlyMetric,
  DashboardCalendarView,
  Month,
  Year,
} from "../types";

type SelectedDateCustomerMetrics = {
  dayCustomerMetrics: {
    selectedDayMetrics?: CustomerDailyMetric;
    prevDayMetrics?: CustomerDailyMetric;
  };
  monthCustomerMetrics: {
    selectedMonthMetrics?: CustomerMonthlyMetric;
    prevMonthMetrics?: CustomerMonthlyMetric;
  };
  yearCustomerMetrics: {
    selectedYearMetrics?: CustomerYearlyMetric;
    prevYearMetrics?: CustomerYearlyMetric;
  };
};

function returnSelectedDateCustomerMetrics({
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
}): SelectedDateCustomerMetrics {
  const currentStoreMetrics = businessMetrics.find(
    (businessMetric) => businessMetric.storeLocation === storeLocation
  );

  const selectedYearMetrics = currentStoreMetrics?.customerMetrics.yearlyMetrics.find(
    (yearlyMetric) => yearlyMetric.year === year
  );
  const prevYearMetrics = currentStoreMetrics?.customerMetrics.yearlyMetrics.find(
    (yearlyMetric) => yearlyMetric.year === (parseInt(year) - 1).toString()
  );

  const selectedMonthMetrics = selectedYearMetrics?.monthlyMetrics.find(
    (monthlyMetric) => monthlyMetric.month === month
  );
  const prevPrevYearMetrics = currentStoreMetrics?.customerMetrics.yearlyMetrics.find(
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
      ? prevMonthMetrics?.dailyMetrics.reduce<CustomerDailyMetric | undefined>(
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
    dayCustomerMetrics: { selectedDayMetrics, prevDayMetrics },
    monthCustomerMetrics: { selectedMonthMetrics, prevMonthMetrics },
    yearCustomerMetrics: { selectedYearMetrics, prevYearMetrics },
  };
}

// new & returning

type CustomerMetricsNewReturningChartsKey =
  | "total" // y-axis variables: total
  | "all" // y-axis variables: sales, in-store, repair
  | "overview" // y-axis variables: sales, repair
  | "sales" // y-axis variables: online, in-store
  | "online" // y-axis variables: online
  | "inStore" // y-axis variables: in-store
  | "repair"; // y-axis variables: repair

type CustomerNewReturningBarCharts = Record<
  CustomerMetricsNewReturningChartsKey,
  BarChartData[]
>; // y-axis variables: total, online, in-store, repair, all

type CustomerNewReturningLineCharts = Record<
  CustomerMetricsNewReturningChartsKey,
  LineChartData[]
>; // y-axis variables: total, online, in-store, repair, all

type CustomerMetricsNewReturningPieChartsKey =
  | "overview" // y-axis variables: sales, repair
  | "all" // y-axis variables: sales, in-store, repair
  | "sales"; // y-axis variables: online, in-store

type CustomerNewReturningPieCharts = Record<
  CustomerMetricsNewReturningPieChartsKey,
  PieChartData[]
>; // y-axis variables: sales, repair, online, in-store, all

// churn & retention

type CustomerMetricsChurnRetentionChartsKey =
  | "overview" // y-axis variables: churn rate, retention rate
  | "churnRate" // y-axis variables: churn rate
  | "retentionRate"; // y-axis variables: retention rate

type CustomerChurnRetentionBarCharts = Record<
  CustomerMetricsChurnRetentionChartsKey,
  BarChartData[]
>; // y-axis variables: churn rate, retention rate

type CustomerChurnRetentionLineCharts = Record<
  CustomerMetricsChurnRetentionChartsKey,
  LineChartData[]
>; // y-axis variables: churn rate, retention rate

type ReturnCustomerMetricsChartsInput = {
  businessMetrics: BusinessMetric[];
  months: Month[];
  selectedDateCustomerMetrics: SelectedDateCustomerMetrics;
  storeLocation: BusinessMetricStoreLocation;
};

type CustomerMetricsCharts = {
  dailyCharts: {
    new: {
      bar: CustomerNewReturningBarCharts;
      line: CustomerNewReturningLineCharts;
      pie: CustomerNewReturningPieCharts;
    };
    returning: {
      bar: CustomerNewReturningBarCharts;
      line: CustomerNewReturningLineCharts;
      pie: CustomerNewReturningPieCharts;
    };
    churnRetention: {
      bar: CustomerChurnRetentionBarCharts;
      line: CustomerChurnRetentionLineCharts;
      pie: PieChartData[];
    };
  };
  monthlyCharts: {
    new: {
      bar: CustomerNewReturningBarCharts;
      line: CustomerNewReturningLineCharts;
      pie: CustomerNewReturningPieCharts;
    };
    returning: {
      bar: CustomerNewReturningBarCharts;
      line: CustomerNewReturningLineCharts;
      pie: CustomerNewReturningPieCharts;
    };
    churnRetention: {
      bar: CustomerChurnRetentionBarCharts;
      line: CustomerChurnRetentionLineCharts;
      pie: PieChartData[];
    };
  };
  yearlyCharts: {
    new: {
      bar: CustomerNewReturningBarCharts;
      line: CustomerNewReturningLineCharts;
      pie: CustomerNewReturningPieCharts;
    };
    returning: {
      bar: CustomerNewReturningBarCharts;
      line: CustomerNewReturningLineCharts;
      pie: CustomerNewReturningPieCharts;
    };
    churnRetention: {
      bar: CustomerChurnRetentionBarCharts;
      line: CustomerChurnRetentionLineCharts;
      pie: PieChartData[];
    };
  };
};

/**
   * dailyMetrics: {
      day: string;
      customers: {
        total: number;
        new: {
          total: number;
          sales: {
            total: number;
            online: number;
            inStore: number;
          };
          repair: number;
        };
        returning: {
          total: number;
          sales: {
            total: number;
            online: number;
            inStore: number;
          };
          repair: number;
        };
      };
    }[];  
   */

async function createCustomerMetricsCharts({
  businessMetrics,
  months,
  selectedDateCustomerMetrics,
  storeLocation,
}: ReturnCustomerMetricsChartsInput): Promise<CustomerMetricsCharts> {
  const {
    yearCustomerMetrics: { selectedYearMetrics },
  } = selectedDateCustomerMetrics;
  const selectedYear = selectedYearMetrics?.year ?? "2023";

  const {
    monthCustomerMetrics: { selectedMonthMetrics },
  } = selectedDateCustomerMetrics;

  const {
    dayCustomerMetrics: { selectedDayMetrics },
  } = selectedDateCustomerMetrics;

  const NEW_RETURNING_BAR_CHART_TEMPLATE: CustomerNewReturningBarCharts = {
    total: [],
    all: [],
    overview: [],
    sales: [],
    online: [],
    inStore: [],
    repair: [],
  };

  const NEW_RETURNING_LINE_CHART_TEMPLATE: CustomerNewReturningLineCharts = {
    total: [{ id: "Total", data: [] }],
    all: [
      { id: "Online", data: [] },
      { id: "In Store", data: [] },
      { id: "Repair", data: [] },
    ],
    overview: [
      { id: "Repair", data: [] },
      { id: "Sales", data: [] },
    ],
    sales: [
      { id: "Online", data: [] },
      { id: "In Store", data: [] },
    ],
    online: [{ id: "Online", data: [] }],
    inStore: [{ id: "In Store", data: [] }],
    repair: [{ id: "Repair", data: [] }],
  };

  const CHURN_RETENTION_BAR_CHART_TEMPLATE: CustomerChurnRetentionBarCharts = {
    overview: [],
    churnRate: [],
    retentionRate: [],
  };

  const CHURN_RETENTION_LINE_CHART_TEMPLATE: CustomerChurnRetentionLineCharts = {
    overview: [
      { id: "Churn Rate", data: [] },
      { id: "Retention Rate", data: [] },
    ],
    churnRate: [{ id: "Churn Rate", data: [] }],
    retentionRate: [{ id: "Retention Rate", data: [] }],
  };

  const currentStoreMetrics = businessMetrics.find(
    (businessMetric) => businessMetric.storeLocation === storeLocation
  );

  const [dailyCustomerCharts, monthlyCustomerCharts, yearlyCustomerCharts] =
    await Promise.all([
      createDailyCustomerCharts({
        dailyMetrics: selectedMonthMetrics?.dailyMetrics,
        newBarChartsTemplate: NEW_RETURNING_BAR_CHART_TEMPLATE,
        newLineChartsTemplate: NEW_RETURNING_LINE_CHART_TEMPLATE,
        returningBarChartsTemplate: NEW_RETURNING_BAR_CHART_TEMPLATE,
        returningLineChartsTemplate: NEW_RETURNING_LINE_CHART_TEMPLATE,
        churnRetentionBarChartsTemplate: CHURN_RETENTION_BAR_CHART_TEMPLATE,
        churnRetentionLineChartsTemplate: CHURN_RETENTION_LINE_CHART_TEMPLATE,
        selectedDayMetrics,
      }),
      createMonthlyCustomerCharts({
        monthlyMetrics: selectedYearMetrics?.monthlyMetrics,
        newBarChartsTemplate: NEW_RETURNING_BAR_CHART_TEMPLATE,
        newLineChartsTemplate: NEW_RETURNING_LINE_CHART_TEMPLATE,
        returningBarChartsTemplate: NEW_RETURNING_BAR_CHART_TEMPLATE,
        returningLineChartsTemplate: NEW_RETURNING_LINE_CHART_TEMPLATE,
        churnRetentionBarChartsTemplate: CHURN_RETENTION_BAR_CHART_TEMPLATE,
        churnRetentionLineChartsTemplate: CHURN_RETENTION_LINE_CHART_TEMPLATE,
        months,
        selectedYear,
        selectedMonthMetrics,
      }),
      createYearlyCustomerCharts({
        yearlyMetrics: currentStoreMetrics?.customerMetrics.yearlyMetrics,
        newBarChartsTemplate: NEW_RETURNING_BAR_CHART_TEMPLATE,
        newLineChartsTemplate: NEW_RETURNING_LINE_CHART_TEMPLATE,
        returningBarChartsTemplate: NEW_RETURNING_BAR_CHART_TEMPLATE,
        returningLineChartsTemplate: NEW_RETURNING_LINE_CHART_TEMPLATE,
        churnRetentionBarChartsTemplate: CHURN_RETENTION_BAR_CHART_TEMPLATE,
        churnRetentionLineChartsTemplate: CHURN_RETENTION_LINE_CHART_TEMPLATE,
        selectedYearMetrics,
      }),
    ]);

  return {
    dailyCharts: dailyCustomerCharts,
    monthlyCharts: monthlyCustomerCharts,
    yearlyCharts: yearlyCustomerCharts,
  };
}

type CreateDailyCustomerChartsInput = {
  churnRetentionBarChartsTemplate: CustomerChurnRetentionBarCharts;
  churnRetentionLineChartsTemplate: CustomerChurnRetentionLineCharts;
  dailyMetrics?: CustomerDailyMetric[];
  newBarChartsTemplate: CustomerNewReturningBarCharts;
  newLineChartsTemplate: CustomerNewReturningLineCharts;
  returningBarChartsTemplate: CustomerNewReturningBarCharts;
  returningLineChartsTemplate: CustomerNewReturningLineCharts;
  selectedDayMetrics?: CustomerDailyMetric;
};

async function createDailyCustomerCharts({
  churnRetentionBarChartsTemplate,
  churnRetentionLineChartsTemplate,
  dailyMetrics,
  newBarChartsTemplate,
  newLineChartsTemplate,
  returningBarChartsTemplate,
  returningLineChartsTemplate,
  selectedDayMetrics,
}: CreateDailyCustomerChartsInput): Promise<CustomerMetricsCharts["dailyCharts"]> {
  if (!dailyMetrics || !selectedDayMetrics) {
    return new Promise((resolve) => {
      resolve({
        new: {
          bar: newBarChartsTemplate,
          line: newLineChartsTemplate,
          pie: { overview: [], all: [], sales: [] },
        },
        returning: {
          bar: returningBarChartsTemplate,
          line: returningLineChartsTemplate,
          pie: { overview: [], all: [], sales: [] },
        },
        churnRetention: {
          bar: { overview: [], churnRate: [], retentionRate: [] },
          line: { overview: [], churnRate: [], retentionRate: [] },
          pie: [],
        },
      });
    });
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const [
        dailyNewBarCharts,
        dailyNewLineCharts,

        dailyReturningBarCharts,
        dailyReturningLineCharts,

        dailyChurnRetentionBarCharts,
        dailyChurnRetentionLineCharts,
      ] = dailyMetrics.reduce(
        (dailyCustomerChartsAcc, dailyMetric) => {
          const [
            dailyNewBarChartsAcc,
            dailyNewLineChartsAcc,

            dailyReturningBarChartsAcc,
            dailyReturningLineChartsAcc,

            dailyChurnRetentionBarChartsAcc,
            dailyChurnRetentionLineChartsAcc,
          ] = dailyCustomerChartsAcc;

          const { day, customers } = dailyMetric;

          // new section y-axis variables: total, all, overview, sales, online, in-store, repair

          // new -> bar chart obj

          const dailyNewTotalBarChart = {
            Days: day,
            Total: customers.new.total,
          };
          dailyNewBarChartsAcc.total.push(dailyNewTotalBarChart);

          const dailyNewAllBarChart = {
            Days: day,
            "In Store": customers.new.sales.inStore,
            Online: customers.new.sales.online,
            Repair: customers.new.repair,
          };
          dailyNewBarChartsAcc.all.push(dailyNewAllBarChart);

          const dailyNewOverviewBarChart = {
            Days: day,
            Sales: customers.new.sales.total,
            Repair: customers.new.repair,
          };
          dailyNewBarChartsAcc.overview.push(dailyNewOverviewBarChart);

          const dailyNewSalesBarChart = {
            Days: day,
            "In Store": customers.new.sales.inStore,
            Online: customers.new.sales.online,
          };
          dailyNewBarChartsAcc.sales.push(dailyNewSalesBarChart);

          const dailyNewOnlineBarChart = {
            Days: day,
            Online: customers.new.sales.online,
          };
          dailyNewBarChartsAcc.online.push(dailyNewOnlineBarChart);

          const dailyNewInStoreBarChart = {
            Days: day,
            "In Store": customers.new.sales.inStore,
          };
          dailyNewBarChartsAcc.inStore.push(dailyNewInStoreBarChart);

          const dailyNewRepairBarChart = {
            Days: day,
            Repair: customers.new.repair,
          };
          dailyNewBarChartsAcc.repair.push(dailyNewRepairBarChart);

          // new -> line chart obj

          const dailyNewTotalLineChart = {
            x: day,
            y: customers.new.total,
          };
          dailyNewLineChartsAcc.total
            .find((lineChartData: LineChartData) => lineChartData.id === "Total")
            ?.data.push(dailyNewTotalLineChart);

          const dailyNewAllInStoreLineChart = {
            x: day,
            y: customers.new.sales.inStore,
          };
          dailyNewLineChartsAcc.all
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(dailyNewAllInStoreLineChart);

          const dailyNewAllOnlineLineChart = {
            x: day,
            y: customers.new.sales.online,
          };
          dailyNewLineChartsAcc.all
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(dailyNewAllOnlineLineChart);

          const dailyNewAllRepairLineChart = {
            x: day,
            y: customers.new.repair,
          };
          dailyNewLineChartsAcc.all
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(dailyNewAllRepairLineChart);

          const dailyNewOverviewSalesLineChart = {
            x: day,
            y: customers.new.sales.total,
          };
          dailyNewLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Sales")
            ?.data.push(dailyNewOverviewSalesLineChart);

          const dailyNewOverviewRepairLineChart = {
            x: day,
            y: customers.new.repair,
          };
          dailyNewLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(dailyNewOverviewRepairLineChart);

          const dailyNewSalesOnlineLineChart = {
            x: day,
            y: customers.new.sales.online,
          };
          dailyNewLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(dailyNewSalesOnlineLineChart);

          const dailyNewSalesInStoreLineChart = {
            x: day,
            y: customers.new.sales.inStore,
          };
          dailyNewLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(dailyNewSalesInStoreLineChart);

          const dailyNewOnlineLineChart = {
            x: day,
            y: customers.new.sales.online,
          };
          dailyNewLineChartsAcc.online
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(dailyNewOnlineLineChart);

          const dailyNewInStoreLineChart = {
            x: day,
            y: customers.new.sales.inStore,
          };
          dailyNewLineChartsAcc.inStore
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(dailyNewInStoreLineChart);

          const dailyNewRepairLineChart = {
            x: day,
            y: customers.new.repair,
          };
          dailyNewLineChartsAcc.repair
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(dailyNewRepairLineChart);

          // returning section y-axis variables: total, all, overview, sales, online, in-store, repair

          // returning -> bar chart obj

          const dailyReturningTotalBarChart = {
            Days: day,
            Total: customers.returning.total,
          };
          dailyReturningBarChartsAcc.total.push(dailyReturningTotalBarChart);

          const dailyReturningAllBarChart = {
            Days: day,
            "In Store": customers.returning.sales.inStore,
            Online: customers.returning.sales.online,
            Repair: customers.returning.repair,
          };
          dailyReturningBarChartsAcc.all.push(dailyReturningAllBarChart);

          const dailyReturningOverviewBarChart = {
            Days: day,
            Sales: customers.returning.sales.total,
            Repair: customers.returning.repair,
          };
          dailyReturningBarChartsAcc.overview.push(dailyReturningOverviewBarChart);

          const dailyReturningSalesBarChart = {
            Days: day,
            "In Store": customers.returning.sales.inStore,
            Online: customers.returning.sales.online,
          };
          dailyReturningBarChartsAcc.sales.push(dailyReturningSalesBarChart);

          const dailyReturningOnlineBarChart = {
            Days: day,
            Online: customers.returning.sales.online,
          };
          dailyReturningBarChartsAcc.online.push(dailyReturningOnlineBarChart);

          const dailyReturningInStoreBarChart = {
            Days: day,
            "In Store": customers.returning.sales.inStore,
          };
          dailyReturningBarChartsAcc.inStore.push(dailyReturningInStoreBarChart);

          const dailyReturningRepairBarChart = {
            Days: day,
            Repair: customers.returning.repair,
          };
          dailyReturningBarChartsAcc.repair.push(dailyReturningRepairBarChart);

          // returning -> line chart obj

          const dailyReturningTotalLineChart = {
            x: day,
            y: customers.returning.total,
          };
          dailyReturningLineChartsAcc.total
            .find((lineChartData: LineChartData) => lineChartData.id === "Total")
            ?.data.push(dailyReturningTotalLineChart);

          const dailyReturningAllInStoreLineChart = {
            x: day,
            y: customers.returning.sales.inStore,
          };
          dailyReturningLineChartsAcc.all
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(dailyReturningAllInStoreLineChart);

          const dailyReturningAllOnlineLineChart = {
            x: day,
            y: customers.returning.sales.online,
          };
          dailyReturningLineChartsAcc.all
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(dailyReturningAllOnlineLineChart);

          const dailyReturningAllRepairLineChart = {
            x: day,
            y: customers.returning.repair,
          };
          dailyReturningLineChartsAcc.all
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(dailyReturningAllRepairLineChart);

          const dailyReturningOverviewSalesLineChart = {
            x: day,
            y: customers.returning.sales.total,
          };
          dailyReturningLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Sales")
            ?.data.push(dailyReturningOverviewSalesLineChart);

          const dailyReturningOverviewRepairLineChart = {
            x: day,
            y: customers.returning.repair,
          };
          dailyReturningLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(dailyReturningOverviewRepairLineChart);

          const dailyReturningSalesOnlineLineChart = {
            x: day,
            y: customers.returning.sales.online,
          };
          dailyReturningLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(dailyReturningSalesOnlineLineChart);

          const dailyReturningSalesInStoreLineChart = {
            x: day,
            y: customers.returning.sales.inStore,
          };
          dailyReturningLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(dailyReturningSalesInStoreLineChart);

          const dailyReturningOnlineLineChart = {
            x: day,
            y: customers.returning.sales.online,
          };
          dailyReturningLineChartsAcc.online
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(dailyReturningOnlineLineChart);

          const dailyReturningInStoreLineChart = {
            x: day,
            y: customers.returning.sales.inStore,
          };
          dailyReturningLineChartsAcc.inStore
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(dailyReturningInStoreLineChart);

          const dailyReturningRepairLineChart = {
            x: day,
            y: customers.returning.repair,
          };
          dailyReturningLineChartsAcc.repair
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(dailyReturningRepairLineChart);

          // churn & retention rate section y-axis variables: overview, churn rate, retention rate

          // churn & retention rate -> bar chart obj

          const overviewChurnRetentionRateBarChart = {
            Days: day,
            "Churn Rate": toFixedFloat(customers.churnRate * 100, 2),
            "Retention Rate": toFixedFloat(customers.retentionRate * 100, 2),
          };
          dailyChurnRetentionBarChartsAcc.overview.push(
            overviewChurnRetentionRateBarChart
          );

          const overviewChurnRateBarChart = {
            Days: day,
            "Churn Rate": toFixedFloat(customers.churnRate * 100, 2),
          };
          dailyChurnRetentionBarChartsAcc.churnRate.push(overviewChurnRateBarChart);

          const monthlyRetentionRateBarChart = {
            Days: day,
            "Retention Rate": toFixedFloat(customers.retentionRate * 100, 2),
          };
          dailyChurnRetentionBarChartsAcc.retentionRate.push(
            monthlyRetentionRateBarChart
          );

          // churn & retention rate -> line chart obj

          const overviewChurnRetentionRateLineChart = {
            x: day,
            y: toFixedFloat(customers.churnRate * 100, 2),
          };
          dailyChurnRetentionLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Churn Rate")
            ?.data.push(overviewChurnRetentionRateLineChart);

          const overviewRetentionRateLineChart = {
            x: day,
            y: toFixedFloat(customers.retentionRate * 100, 2),
          };
          dailyChurnRetentionLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Retention Rate")
            ?.data.push(overviewRetentionRateLineChart);

          const monthlyChurnRateLineChart = {
            x: day,
            y: toFixedFloat(customers.churnRate * 100, 2),
          };
          dailyChurnRetentionLineChartsAcc.churnRate
            .find((lineChartData: LineChartData) => lineChartData.id === "Churn Rate")
            ?.data.push(monthlyChurnRateLineChart);

          const monthlyRetentionRateLineChart = {
            x: day,
            y: toFixedFloat(customers.retentionRate * 100, 2),
          };
          dailyChurnRetentionLineChartsAcc.retentionRate
            .find((lineChartData: LineChartData) => lineChartData.id === "Retention Rate")
            ?.data.push(monthlyRetentionRateLineChart);

          return dailyCustomerChartsAcc;
        },
        [
          structuredClone(newBarChartsTemplate),
          structuredClone(newLineChartsTemplate),

          structuredClone(returningBarChartsTemplate),
          structuredClone(returningLineChartsTemplate),

          structuredClone(churnRetentionBarChartsTemplate),
          structuredClone(churnRetentionLineChartsTemplate),
        ]
      );

      const newSalesPieChartData: PieChartData = {
        id: "Sales",
        label: "Sales",
        value: selectedDayMetrics.customers.new.sales.total,
      };
      const newRepairPieChartData: PieChartData = {
        id: "Repair",
        label: "Repair",
        value: selectedDayMetrics.customers.new.repair,
      };
      const newSalesOnlinePieChartData: PieChartData = {
        id: "Online",
        label: "Online",
        value: selectedDayMetrics.customers.new.sales.online,
      };
      const newSalesInStorePieChartData: PieChartData = {
        id: "In Store",
        label: "In Store",
        value: selectedDayMetrics.customers.new.sales.inStore,
      };

      const dailyNewPieChartData: CustomerNewReturningPieCharts = {
        overview: [newSalesPieChartData, newRepairPieChartData],
        all: [
          newSalesOnlinePieChartData,
          newSalesInStorePieChartData,
          newRepairPieChartData,
        ],
        sales: [newSalesOnlinePieChartData, newSalesInStorePieChartData],
      };

      const returningSalesPieChartData: PieChartData = {
        id: "Sales",
        label: "Sales",
        value: selectedDayMetrics.customers.returning.sales.total,
      };
      const returningRepairPieChartData: PieChartData = {
        id: "Repair",
        label: "Repair",
        value: selectedDayMetrics.customers.returning.repair,
      };
      const returningSalesOnlinePieChartData: PieChartData = {
        id: "Online",
        label: "Online",
        value: selectedDayMetrics.customers.returning.sales.online,
      };
      const returningSalesInStorePieChartData: PieChartData = {
        id: "In Store",
        label: "In Store",
        value: selectedDayMetrics.customers.returning.sales.inStore,
      };

      const dailyReturningPieChartData: CustomerNewReturningPieCharts = {
        overview: [returningSalesPieChartData, returningRepairPieChartData],
        all: [
          returningSalesOnlinePieChartData,
          returningSalesInStorePieChartData,
          returningRepairPieChartData,
        ],
        sales: [returningSalesOnlinePieChartData, returningSalesInStorePieChartData],
      };

      const dailyChurnRetentionPieChartData: PieChartData[] = [
        {
          id: "Churn Rate",
          label: "Churn Rate",
          value: toFixedFloat(selectedDayMetrics.customers.churnRate * 100, 2),
        },
        {
          id: "Retention Rate",
          label: "Retention Rate",
          value: toFixedFloat(selectedDayMetrics.customers.retentionRate * 100, 2),
        },
      ];

      resolve({
        new: {
          bar: dailyNewBarCharts,
          line: dailyNewLineCharts,
          pie: dailyNewPieChartData,
        },
        returning: {
          bar: dailyReturningBarCharts,
          line: dailyReturningLineCharts,
          pie: dailyReturningPieChartData,
        },
        churnRetention: {
          bar: dailyChurnRetentionBarCharts,
          line: dailyChurnRetentionLineCharts,
          pie: dailyChurnRetentionPieChartData,
        },
      });
    }, 0);
  });
}

type CreateMonthlyCustomerChartsInput = {
  churnRetentionBarChartsTemplate: CustomerChurnRetentionBarCharts;
  churnRetentionLineChartsTemplate: CustomerChurnRetentionLineCharts;
  monthlyMetrics?: CustomerMonthlyMetric[];
  months: Month[];
  newBarChartsTemplate: CustomerNewReturningBarCharts;
  newLineChartsTemplate: CustomerNewReturningLineCharts;
  returningBarChartsTemplate: CustomerNewReturningBarCharts;
  returningLineChartsTemplate: CustomerNewReturningLineCharts;
  selectedMonthMetrics?: CustomerMonthlyMetric;
  selectedYear: Year;
};

async function createMonthlyCustomerCharts({
  churnRetentionBarChartsTemplate,
  churnRetentionLineChartsTemplate,
  monthlyMetrics,
  newBarChartsTemplate,
  newLineChartsTemplate,
  returningBarChartsTemplate,
  returningLineChartsTemplate,
  selectedMonthMetrics,
  selectedYear,
}: CreateMonthlyCustomerChartsInput): Promise<CustomerMetricsCharts["monthlyCharts"]> {
  if (!monthlyMetrics || !selectedMonthMetrics) {
    return new Promise((resolve) => {
      resolve({
        new: {
          bar: newBarChartsTemplate,
          line: newLineChartsTemplate,
          pie: { overview: [], all: [], sales: [] },
        },
        returning: {
          bar: returningBarChartsTemplate,
          line: returningLineChartsTemplate,
          pie: { overview: [], all: [], sales: [] },
        },
        churnRetention: {
          bar: churnRetentionBarChartsTemplate,
          line: churnRetentionLineChartsTemplate,
          pie: [],
        },
      });
    });
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const [
        monthlyNewBarCharts,
        monthlyNewLineCharts,

        monthlyReturningBarCharts,
        monthlyReturningLineCharts,

        monthlyChurnRetentionRateBarCharts,
        monthlyChurnRetentionRateLineCharts,
      ] = monthlyMetrics.reduce(
        (monthlyCustomerChartsAcc, monthlyMetric) => {
          const [
            monthlyNewBarChartsAcc,
            monthlyNewLineChartsAcc,

            monthlyReturningBarChartsAcc,
            monthlyReturningLineChartsAcc,

            monthlyChurnRetentionRateBarChartsAcc,
            monthlyChurnRetentionRateLineChartsAcc,
          ] = monthlyCustomerChartsAcc;

          const { month, customers } = monthlyMetric;

          // prevents current month of current year from being added to charts
          const currentYear = new Date().getFullYear().toString();
          const isCurrentYear = selectedYear === currentYear;
          const currentMonth = new Date().toLocaleString("default", { month: "long" });
          const isCurrentMonth = month === currentMonth;

          if (isCurrentYear && isCurrentMonth) {
            return monthlyCustomerChartsAcc;
          }

          // new section y-axis variables: total, all, overview, sales, online, in-store, repair

          // new -> bar chart obj

          const monthlyNewTotalBarChart = {
            Months: month,
            Total: customers.new.total,
          };
          monthlyNewBarChartsAcc.total.push(monthlyNewTotalBarChart);

          const monthlyNewAllBarChart = {
            Months: month,
            "In Store": customers.new.sales.inStore,
            Online: customers.new.sales.online,
            Repair: customers.new.repair,
          };
          monthlyNewBarChartsAcc.all.push(monthlyNewAllBarChart);

          const monthlyNewOverviewBarChart = {
            Months: month,
            Sales: customers.new.sales.total,
            Repair: customers.new.repair,
          };
          monthlyNewBarChartsAcc.overview.push(monthlyNewOverviewBarChart);

          const monthlyNewSalesBarChart = {
            Months: month,
            "In Store": customers.new.sales.inStore,
            Online: customers.new.sales.online,
          };
          monthlyNewBarChartsAcc.sales.push(monthlyNewSalesBarChart);

          const monthlyNewOnlineBarChart = {
            Months: month,
            Online: customers.new.sales.online,
          };
          monthlyNewBarChartsAcc.online.push(monthlyNewOnlineBarChart);

          const monthlyNewInStoreBarChart = {
            Months: month,
            "In Store": customers.new.sales.inStore,
          };
          monthlyNewBarChartsAcc.inStore.push(monthlyNewInStoreBarChart);

          const monthlyNewRepairBarChart = {
            Months: month,
            Repair: customers.new.repair,
          };
          monthlyNewBarChartsAcc.repair.push(monthlyNewRepairBarChart);

          // new -> line chart obj

          const monthlyNewTotalLineChart = {
            x: month,
            y: customers.new.total,
          };
          monthlyNewLineChartsAcc.total
            .find((lineChartData: LineChartData) => lineChartData.id === "Total")
            ?.data.push(monthlyNewTotalLineChart);

          const monthlyNewAllInStoreLineChart = {
            x: month,
            y: customers.new.sales.inStore,
          };
          monthlyNewLineChartsAcc.all
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(monthlyNewAllInStoreLineChart);

          const monthlyNewAllOnlineLineChart = {
            x: month,
            y: customers.new.sales.online,
          };
          monthlyNewLineChartsAcc.all
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(monthlyNewAllOnlineLineChart);

          const monthlyNewAllRepairLineChart = {
            x: month,
            y: customers.new.repair,
          };
          monthlyNewLineChartsAcc.all
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(monthlyNewAllRepairLineChart);

          const monthlyNewOverviewSalesLineChart = {
            x: month,
            y: customers.new.sales.total,
          };
          monthlyNewLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Sales")
            ?.data.push(monthlyNewOverviewSalesLineChart);

          const monthlyNewOverviewRepairLineChart = {
            x: month,
            y: customers.new.repair,
          };
          monthlyNewLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(monthlyNewOverviewRepairLineChart);

          const monthlyNewSalesOnlineLineChart = {
            x: month,
            y: customers.new.sales.online,
          };
          monthlyNewLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(monthlyNewSalesOnlineLineChart);

          const monthlyNewSalesInStoreLineChart = {
            x: month,
            y: customers.new.sales.inStore,
          };
          monthlyNewLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(monthlyNewSalesInStoreLineChart);

          const monthlyNewOnlineLineChart = {
            x: month,
            y: customers.new.sales.online,
          };
          monthlyNewLineChartsAcc.online
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(monthlyNewOnlineLineChart);

          const monthlyNewInStoreLineChart = {
            x: month,
            y: customers.new.sales.inStore,
          };
          monthlyNewLineChartsAcc.inStore
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(monthlyNewInStoreLineChart);

          const monthlyNewRepairLineChart = {
            x: month,
            y: customers.new.repair,
          };
          monthlyNewLineChartsAcc.repair
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(monthlyNewRepairLineChart);

          // returning section y-axis variables: total, all, overview, sales, online, in-store, repair

          // returning -> bar chart obj

          const monthlyReturningTotalBarChart = {
            Months: month,
            Total: customers.returning.total,
          };
          monthlyReturningBarChartsAcc.total.push(monthlyReturningTotalBarChart);

          const monthlyReturningAllBarChart = {
            Months: month,
            "In Store": customers.returning.sales.inStore,
            Online: customers.returning.sales.online,
            Repair: customers.returning.repair,
          };
          monthlyReturningBarChartsAcc.all.push(monthlyReturningAllBarChart);

          const monthlyReturningOverviewBarChart = {
            Months: month,
            Sales: customers.returning.sales.total,
            Repair: customers.returning.repair,
          };
          monthlyReturningBarChartsAcc.overview.push(monthlyReturningOverviewBarChart);

          const monthlyReturningSalesBarChart = {
            Months: month,
            "In Store": customers.returning.sales.inStore,
            Online: customers.returning.sales.online,
          };
          monthlyReturningBarChartsAcc.sales.push(monthlyReturningSalesBarChart);

          const monthlyReturningOnlineBarChart = {
            Months: month,
            Online: customers.returning.sales.online,
          };
          monthlyReturningBarChartsAcc.online.push(monthlyReturningOnlineBarChart);

          const monthlyReturningInStoreBarChart = {
            Months: month,
            "In Store": customers.returning.sales.inStore,
          };
          monthlyReturningBarChartsAcc.inStore.push(monthlyReturningInStoreBarChart);

          const monthlyReturningRepairBarChart = {
            Months: month,
            Repair: customers.returning.repair,
          };
          monthlyReturningBarChartsAcc.repair.push(monthlyReturningRepairBarChart);

          // returning -> line chart obj

          const monthlyReturningTotalLineChart = {
            x: month,
            y: customers.returning.total,
          };
          monthlyReturningLineChartsAcc.total
            .find((lineChartData: LineChartData) => lineChartData.id === "Total")
            ?.data.push(monthlyReturningTotalLineChart);

          const monthlyReturningAllInStoreLineChart = {
            x: month,
            y: customers.returning.sales.inStore,
          };
          monthlyReturningLineChartsAcc.all
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(monthlyReturningAllInStoreLineChart);

          const monthlyReturningAllOnlineLineChart = {
            x: month,
            y: customers.returning.sales.online,
          };
          monthlyReturningLineChartsAcc.all
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(monthlyReturningAllOnlineLineChart);

          const monthlyReturningAllRepairLineChart = {
            x: month,
            y: customers.returning.repair,
          };
          monthlyReturningLineChartsAcc.all
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(monthlyReturningAllRepairLineChart);

          const monthlyReturningOverviewSalesLineChart = {
            x: month,
            y: customers.returning.sales.total,
          };
          monthlyReturningLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Sales")
            ?.data.push(monthlyReturningOverviewSalesLineChart);

          const monthlyReturningOverviewRepairLineChart = {
            x: month,
            y: customers.returning.repair,
          };
          monthlyReturningLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(monthlyReturningOverviewRepairLineChart);

          const monthlyReturningSalesOnlineLineChart = {
            x: month,
            y: customers.returning.sales.online,
          };
          monthlyReturningLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(monthlyReturningSalesOnlineLineChart);

          const monthlyReturningSalesInStoreLineChart = {
            x: month,
            y: customers.returning.sales.inStore,
          };
          monthlyReturningLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(monthlyReturningSalesInStoreLineChart);

          const monthlyReturningOnlineLineChart = {
            x: month,
            y: customers.returning.sales.online,
          };
          monthlyReturningLineChartsAcc.online
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(monthlyReturningOnlineLineChart);

          const monthlyReturningInStoreLineChart = {
            x: month,
            y: customers.returning.sales.inStore,
          };
          monthlyReturningLineChartsAcc.inStore
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(monthlyReturningInStoreLineChart);

          const monthlyReturningRepairLineChart = {
            x: month,
            y: customers.returning.repair,
          };
          monthlyReturningLineChartsAcc.repair
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(monthlyReturningRepairLineChart);

          // churn & retention rate section y-axis variables: overview, churn rate, retention rate

          // churn & retention rate -> bar chart obj

          const overviewChurnRetentionRateBarChart = {
            Months: month,
            "Churn Rate": toFixedFloat(customers.churnRate * 100, 2),
            "Retention Rate": toFixedFloat(customers.retentionRate * 100, 2),
          };
          monthlyChurnRetentionRateBarChartsAcc.overview.push(
            overviewChurnRetentionRateBarChart
          );

          const overviewChurnRateBarChart = {
            Months: month,
            "Churn Rate": toFixedFloat(customers.churnRate * 100, 2),
          };
          monthlyChurnRetentionRateBarChartsAcc.churnRate.push(overviewChurnRateBarChart);

          const monthlyRetentionRateBarChart = {
            Months: month,
            "Retention Rate": toFixedFloat(customers.retentionRate * 100, 2),
          };
          monthlyChurnRetentionRateBarChartsAcc.retentionRate.push(
            monthlyRetentionRateBarChart
          );

          // churn & retention rate -> line chart obj

          const overviewChurnRetentionRateLineChart = {
            x: month,
            y: toFixedFloat(customers.churnRate * 100, 2),
          };
          monthlyChurnRetentionRateLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Churn Rate")
            ?.data.push(overviewChurnRetentionRateLineChart);

          const overviewRetentionRateLineChart = {
            x: month,
            y: toFixedFloat(customers.retentionRate * 100, 2),
          };
          monthlyChurnRetentionRateLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Retention Rate")
            ?.data.push(overviewRetentionRateLineChart);

          const monthlyChurnRateLineChart = {
            x: month,
            y: toFixedFloat(customers.churnRate * 100, 2),
          };
          monthlyChurnRetentionRateLineChartsAcc.churnRate
            .find((lineChartData: LineChartData) => lineChartData.id === "Churn Rate")
            ?.data.push(monthlyChurnRateLineChart);

          const monthlyRetentionRateLineChart = {
            x: month,
            y: toFixedFloat(customers.retentionRate * 100, 2),
          };
          monthlyChurnRetentionRateLineChartsAcc.retentionRate
            .find((lineChartData: LineChartData) => lineChartData.id === "Retention Rate")
            ?.data.push(monthlyRetentionRateLineChart);

          return monthlyCustomerChartsAcc;
        },
        [
          structuredClone(newBarChartsTemplate),
          structuredClone(newLineChartsTemplate),

          structuredClone(returningBarChartsTemplate),
          structuredClone(returningLineChartsTemplate),

          structuredClone(churnRetentionBarChartsTemplate),
          structuredClone(churnRetentionLineChartsTemplate),
        ]
      );

      // monthly -> new -> pie chart obj
      const monthlyNewSalesPieChartData: PieChartData = {
        id: "Sales",
        label: "Sales",
        value: selectedMonthMetrics.customers.new.sales.total,
      };
      const monthlyNewRepairPieChartData: PieChartData = {
        id: "Repair",
        label: "Repair",
        value: selectedMonthMetrics.customers.new.repair,
      };
      const monthlyNewSalesOnlinePieChartData: PieChartData = {
        id: "Online",
        label: "Online",
        value: selectedMonthMetrics.customers.new.sales.online,
      };
      const monthlyNewSalesInStorePieChartData: PieChartData = {
        id: "In Store",
        label: "In Store",
        value: selectedMonthMetrics.customers.new.sales.inStore,
      };

      const monthlyNewPieChartData: CustomerNewReturningPieCharts = {
        overview: [monthlyNewSalesPieChartData, monthlyNewRepairPieChartData],
        all: [
          monthlyNewSalesOnlinePieChartData,
          monthlyNewSalesInStorePieChartData,
          monthlyNewRepairPieChartData,
        ],
        sales: [monthlyNewSalesOnlinePieChartData, monthlyNewSalesInStorePieChartData],
      };

      // monthly -> returning

      // monthly -> returning -> pie chart obj
      const monthlyReturningSalesPieChartData: PieChartData = {
        id: "Sales",
        label: "Sales",
        value: selectedMonthMetrics.customers.returning.sales.total,
      };
      const monthlyReturningRepairPieChartData: PieChartData = {
        id: "Repair",
        label: "Repair",
        value: selectedMonthMetrics.customers.returning.repair,
      };
      const monthlyReturningSalesOnlinePieChartData: PieChartData = {
        id: "Online",
        label: "Online",
        value: selectedMonthMetrics.customers.returning.sales.online,
      };
      const monthlyReturningSalesInStorePieChartData: PieChartData = {
        id: "In Store",
        label: "In Store",
        value: selectedMonthMetrics.customers.returning.sales.inStore,
      };

      const monthlyReturningPieChartData: CustomerNewReturningPieCharts = {
        overview: [monthlyReturningSalesPieChartData, monthlyReturningRepairPieChartData],
        all: [
          monthlyReturningSalesOnlinePieChartData,
          monthlyReturningSalesInStorePieChartData,
          monthlyReturningRepairPieChartData,
        ],
        sales: [
          monthlyReturningSalesOnlinePieChartData,
          monthlyReturningSalesInStorePieChartData,
        ],
      };

      // monthly -> churn & retention rate -> pie chart obj
      const monthlyChurnRetentionRatePieChartData: PieChartData[] = [
        {
          id: "Churn Rate",
          label: "Churn Rate",
          value: toFixedFloat(selectedMonthMetrics.customers.churnRate * 100, 2),
        },
        {
          id: "Retention Rate",
          label: "Retention Rate",
          value: toFixedFloat(selectedMonthMetrics.customers.retentionRate * 100, 2),
        },
      ];

      resolve({
        new: {
          bar: monthlyNewBarCharts,
          line: monthlyNewLineCharts,
          pie: monthlyNewPieChartData,
        },
        returning: {
          bar: monthlyReturningBarCharts,
          line: monthlyReturningLineCharts,
          pie: monthlyReturningPieChartData,
        },
        churnRetention: {
          bar: monthlyChurnRetentionRateBarCharts,
          line: monthlyChurnRetentionRateLineCharts,
          pie: monthlyChurnRetentionRatePieChartData,
        },
      });
    }, 0);
  });
}

type CreateYearlyCustomerChartsInput = {
  churnRetentionBarChartsTemplate: CustomerChurnRetentionBarCharts;
  churnRetentionLineChartsTemplate: CustomerChurnRetentionLineCharts;
  newBarChartsTemplate: CustomerNewReturningBarCharts;
  newLineChartsTemplate: CustomerNewReturningLineCharts;
  returningBarChartsTemplate: CustomerNewReturningBarCharts;
  returningLineChartsTemplate: CustomerNewReturningLineCharts;
  selectedYearMetrics?: CustomerYearlyMetric;
  yearlyMetrics?: CustomerYearlyMetric[];
};

async function createYearlyCustomerCharts({
  churnRetentionBarChartsTemplate,
  churnRetentionLineChartsTemplate,
  newBarChartsTemplate,
  newLineChartsTemplate,
  returningBarChartsTemplate,
  returningLineChartsTemplate,
  selectedYearMetrics,
  yearlyMetrics,
}: CreateYearlyCustomerChartsInput): Promise<CustomerMetricsCharts["yearlyCharts"]> {
  if (!yearlyMetrics || !selectedYearMetrics) {
    return new Promise((resolve) => {
      resolve({
        new: {
          bar: newBarChartsTemplate,
          line: newLineChartsTemplate,
          pie: { overview: [], all: [], sales: [] },
        },
        returning: {
          bar: returningBarChartsTemplate,
          line: returningLineChartsTemplate,
          pie: { overview: [], all: [], sales: [] },
        },
        churnRetention: {
          bar: churnRetentionBarChartsTemplate,
          line: churnRetentionLineChartsTemplate,
          pie: [],
        },
      });
    });
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const [
        yearlyNewBarCharts,
        yearlyNewLineCharts,

        yearlyReturningBarCharts,
        yearlyReturningLineCharts,

        yearlyChurnRetentionRateBarCharts,
        yearlyChurnRetentionRateLineCharts,
      ] = yearlyMetrics.reduce(
        (yearlyCustomerChartsAcc, yearlyMetric) => {
          const [
            yearlyNewBarChartsAcc,
            yearlyNewLineChartsAcc,

            yearlyReturningBarChartsAcc,
            yearlyReturningLineChartsAcc,

            yearlyChurnRetentionRateBarChartsAcc,
            yearlyChurnRetentionRateLineChartsAcc,
          ] = yearlyCustomerChartsAcc;

          const { year, customers } = yearlyMetric;

          // prevents current year from being added to charts
          const currentYear = new Date().getFullYear();
          if (year === currentYear.toString()) {
            return yearlyCustomerChartsAcc;
          }

          // new section y-axis variables: total, all, overview, sales, online, in-store, repair

          // new -> bar chart obj

          const yearlyNewTotalBarChart = {
            Years: year,
            Total: customers.new.total,
          };
          yearlyNewBarChartsAcc.total.push(yearlyNewTotalBarChart);

          const yearlyNewAllBarChart = {
            Years: year,
            "In Store": customers.new.sales.inStore,
            Online: customers.new.sales.online,
            Repair: customers.new.repair,
          };
          yearlyNewBarChartsAcc.all.push(yearlyNewAllBarChart);

          const yearlyNewOverviewBarChart = {
            Years: year,
            Sales: customers.new.sales.total,
            Repair: customers.new.repair,
          };
          yearlyNewBarChartsAcc.overview.push(yearlyNewOverviewBarChart);

          const yearlyNewSalesBarChart = {
            Years: year,
            "In Store": customers.new.sales.inStore,
            Online: customers.new.sales.online,
          };
          yearlyNewBarChartsAcc.sales.push(yearlyNewSalesBarChart);

          const yearlyNewOnlineBarChart = {
            Years: year,
            Online: customers.new.sales.online,
          };
          yearlyNewBarChartsAcc.online.push(yearlyNewOnlineBarChart);

          const yearlyNewInStoreBarChart = {
            Years: year,
            "In Store": customers.new.sales.inStore,
          };
          yearlyNewBarChartsAcc.inStore.push(yearlyNewInStoreBarChart);

          const yearlyNewRepairBarChart = {
            Years: year,
            Repair: customers.new.repair,
          };
          yearlyNewBarChartsAcc.repair.push(yearlyNewRepairBarChart);

          // new -> line chart obj

          const yearlyNewTotalLineChart = {
            x: year,
            y: customers.new.total,
          };
          yearlyNewLineChartsAcc.total
            .find((lineChartData: LineChartData) => lineChartData.id === "Total")
            ?.data.push(yearlyNewTotalLineChart);

          const yearlyNewAllInStoreLineChart = {
            x: year,
            y: customers.new.sales.inStore,
          };
          yearlyNewLineChartsAcc.all
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(yearlyNewAllInStoreLineChart);

          const yearlyNewAllOnlineLineChart = {
            x: year,
            y: customers.new.sales.online,
          };
          yearlyNewLineChartsAcc.all
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(yearlyNewAllOnlineLineChart);

          const yearlyNewAllRepairLineChart = {
            x: year,
            y: customers.new.repair,
          };
          yearlyNewLineChartsAcc.all
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(yearlyNewAllRepairLineChart);

          const yearlyNewOverviewSalesLineChart = {
            x: year,
            y: customers.new.sales.total,
          };
          yearlyNewLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Sales")
            ?.data.push(yearlyNewOverviewSalesLineChart);

          const yearlyNewOverviewRepairLineChart = {
            x: year,
            y: customers.new.repair,
          };
          yearlyNewLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(yearlyNewOverviewRepairLineChart);

          const yearlyNewSalesOnlineLineChart = {
            x: year,
            y: customers.new.sales.online,
          };
          yearlyNewLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(yearlyNewSalesOnlineLineChart);

          const yearlyNewSalesInStoreLineChart = {
            x: year,
            y: customers.new.sales.inStore,
          };
          yearlyNewLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(yearlyNewSalesInStoreLineChart);

          const yearlyNewOnlineLineChart = {
            x: year,
            y: customers.new.sales.online,
          };
          yearlyNewLineChartsAcc.online
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(yearlyNewOnlineLineChart);

          const yearlyNewInStoreLineChart = {
            x: year,
            y: customers.new.sales.inStore,
          };
          yearlyNewLineChartsAcc.inStore
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(yearlyNewInStoreLineChart);

          const yearlyNewRepairLineChart = {
            x: year,
            y: customers.new.repair,
          };
          yearlyNewLineChartsAcc.repair
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(yearlyNewRepairLineChart);

          // returning section y-axis variables: total, all, overview, sales, online, in-store, repair

          // returning -> bar chart obj

          const yearlyReturningTotalBarChart = {
            Years: year,
            Total: customers.returning.total,
          };
          yearlyReturningBarChartsAcc.total.push(yearlyReturningTotalBarChart);

          const yearlyReturningAllBarChart = {
            Years: year,
            "In Store": customers.returning.sales.inStore,
            Online: customers.returning.sales.online,
            Repair: customers.returning.repair,
          };
          yearlyReturningBarChartsAcc.all.push(yearlyReturningAllBarChart);

          const yearlyReturningOverviewBarChart = {
            Years: year,
            Sales: customers.returning.sales.total,
            Repair: customers.returning.repair,
          };
          yearlyReturningBarChartsAcc.overview.push(yearlyReturningOverviewBarChart);

          const yearlyReturningSalesBarChart = {
            Years: year,
            "In Store": customers.returning.sales.inStore,
            Online: customers.returning.sales.online,
          };
          yearlyReturningBarChartsAcc.sales.push(yearlyReturningSalesBarChart);

          const yearlyReturningOnlineBarChart = {
            Years: year,
            Online: customers.returning.sales.online,
          };
          yearlyReturningBarChartsAcc.online.push(yearlyReturningOnlineBarChart);

          const yearlyReturningInStoreBarChart = {
            Years: year,
            "In Store": customers.returning.sales.inStore,
          };
          yearlyReturningBarChartsAcc.inStore.push(yearlyReturningInStoreBarChart);

          const yearlyReturningRepairBarChart = {
            Years: year,
            Repair: customers.returning.repair,
          };
          yearlyReturningBarChartsAcc.repair.push(yearlyReturningRepairBarChart);

          // returning -> line chart obj

          const yearlyReturningTotalLineChart = {
            x: year,
            y: customers.returning.total,
          };
          yearlyReturningLineChartsAcc.total
            .find((lineChartData: LineChartData) => lineChartData.id === "Total")
            ?.data.push(yearlyReturningTotalLineChart);

          const yearlyReturningAllInStoreLineChart = {
            x: year,
            y: customers.returning.sales.inStore,
          };
          yearlyReturningLineChartsAcc.all
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(yearlyReturningAllInStoreLineChart);

          const yearlyReturningAllOnlineLineChart = {
            x: year,
            y: customers.returning.sales.online,
          };
          yearlyReturningLineChartsAcc.all
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(yearlyReturningAllOnlineLineChart);

          const yearlyReturningAllRepairLineChart = {
            x: year,
            y: customers.returning.repair,
          };
          yearlyReturningLineChartsAcc.all
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(yearlyReturningAllRepairLineChart);

          const yearlyReturningOverviewSalesLineChart = {
            x: year,
            y: customers.returning.sales.total,
          };
          yearlyReturningLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Sales")
            ?.data.push(yearlyReturningOverviewSalesLineChart);

          const yearlyReturningOverviewRepairLineChart = {
            x: year,
            y: customers.returning.repair,
          };
          yearlyReturningLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(yearlyReturningOverviewRepairLineChart);

          const yearlyReturningSalesOnlineLineChart = {
            x: year,
            y: customers.returning.sales.online,
          };
          yearlyReturningLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(yearlyReturningSalesOnlineLineChart);

          const yearlyReturningSalesInStoreLineChart = {
            x: year,
            y: customers.returning.sales.inStore,
          };
          yearlyReturningLineChartsAcc.sales
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(yearlyReturningSalesInStoreLineChart);

          const yearlyReturningOnlineLineChart = {
            x: year,
            y: customers.returning.sales.online,
          };
          yearlyReturningLineChartsAcc.online
            .find((lineChartData: LineChartData) => lineChartData.id === "Online")
            ?.data.push(yearlyReturningOnlineLineChart);

          const yearlyReturningInStoreLineChart = {
            x: year,
            y: customers.returning.sales.inStore,
          };
          yearlyReturningLineChartsAcc.inStore
            .find((lineChartData: LineChartData) => lineChartData.id === "In Store")
            ?.data.push(yearlyReturningInStoreLineChart);

          const yearlyReturningRepairLineChart = {
            x: year,
            y: customers.returning.repair,
          };
          yearlyReturningLineChartsAcc.repair
            .find((lineChartData: LineChartData) => lineChartData.id === "Repair")
            ?.data.push(yearlyReturningRepairLineChart);

          // churn & retention rate section y-axis variables: overview, churn rate, retention rate

          // churn & retention rate -> bar chart obj

          const yearlyOverviewChurnRetentionRateBarChart = {
            Years: year,
            "Churn Rate": toFixedFloat(customers.churnRate * 100, 2),
            "Retention Rate": toFixedFloat(customers.retentionRate * 100, 2),
          };
          yearlyChurnRetentionRateBarChartsAcc.overview.push(
            yearlyOverviewChurnRetentionRateBarChart
          );

          const yearlyChurnRateBarChart = {
            Years: year,
            "Churn Rate": toFixedFloat(customers.churnRate * 100, 2),
          };
          yearlyChurnRetentionRateBarChartsAcc.churnRate.push(yearlyChurnRateBarChart);

          const yearlyRetentionRateBarChart = {
            Years: year,
            "Retention Rate": toFixedFloat(customers.retentionRate * 100, 2),
          };
          yearlyChurnRetentionRateBarChartsAcc.retentionRate.push(
            yearlyRetentionRateBarChart
          );

          // churn & retention rate -> line chart obj

          const yearlyOverviewChurnRetentionRateLineChart = {
            x: year,
            y: toFixedFloat(customers.churnRate * 100, 2),
          };
          yearlyChurnRetentionRateLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Churn Rate")
            ?.data.push(yearlyOverviewChurnRetentionRateLineChart);

          const yearlyOverviewRetentionRateLineChart = {
            x: year,
            y: toFixedFloat(customers.retentionRate * 100, 2),
          };
          yearlyChurnRetentionRateLineChartsAcc.overview
            .find((lineChartData: LineChartData) => lineChartData.id === "Retention Rate")
            ?.data.push(yearlyOverviewRetentionRateLineChart);

          const yearlyChurnRateLineChart = {
            x: year,
            y: toFixedFloat(customers.churnRate * 100, 2),
          };
          yearlyChurnRetentionRateLineChartsAcc.churnRate
            .find((lineChartData: LineChartData) => lineChartData.id === "Churn Rate")
            ?.data.push(yearlyChurnRateLineChart);

          const yearlyRetentionRateLineChart = {
            x: year,
            y: toFixedFloat(customers.retentionRate * 100, 2),
          };
          yearlyChurnRetentionRateLineChartsAcc.retentionRate
            .find((lineChartData: LineChartData) => lineChartData.id === "Retention Rate")
            ?.data.push(yearlyRetentionRateLineChart);

          return yearlyCustomerChartsAcc;
        },
        [
          structuredClone(newBarChartsTemplate),
          structuredClone(newLineChartsTemplate),

          structuredClone(returningBarChartsTemplate),
          structuredClone(returningLineChartsTemplate),

          structuredClone(churnRetentionBarChartsTemplate),
          structuredClone(churnRetentionLineChartsTemplate),
        ]
      );

      // yearly -> new -> pie chart obj
      const yearlyNewSalesPieChartData: PieChartData = {
        id: "Sales",
        label: "Sales",
        value: selectedYearMetrics.customers.new.sales.total,
      };
      const yearlyNewRepairPieChartData: PieChartData = {
        id: "Repair",
        label: "Repair",
        value: selectedYearMetrics.customers.new.repair,
      };
      const yearlyNewSalesOnlinePieChartData: PieChartData = {
        id: "Online",
        label: "Online",
        value: selectedYearMetrics.customers.new.sales.online,
      };
      const yearlyNewSalesInStorePieChartData: PieChartData = {
        id: "In Store",
        label: "In Store",
        value: selectedYearMetrics.customers.new.sales.inStore,
      };

      const yearlyNewPieChartData: CustomerNewReturningPieCharts = {
        overview: [yearlyNewSalesPieChartData, yearlyNewRepairPieChartData],
        all: [
          yearlyNewSalesOnlinePieChartData,
          yearlyNewSalesInStorePieChartData,
          yearlyNewRepairPieChartData,
        ],
        sales: [yearlyNewSalesOnlinePieChartData, yearlyNewSalesInStorePieChartData],
      };

      // yearly -> returning -> pie chart obj
      const yearlyReturningSalesPieChartData: PieChartData = {
        id: "Sales",
        label: "Sales",
        value: selectedYearMetrics.customers.returning.sales.total,
      };
      const yearlyReturningRepairPieChartData: PieChartData = {
        id: "Repair",
        label: "Repair",
        value: selectedYearMetrics.customers.returning.repair,
      };
      const yearlyReturningSalesOnlinePieChartData: PieChartData = {
        id: "Online",
        label: "Online",
        value: selectedYearMetrics.customers.returning.sales.online,
      };
      const yearlyReturningSalesInStorePieChartData: PieChartData = {
        id: "In Store",
        label: "In Store",
        value: selectedYearMetrics.customers.returning.sales.inStore,
      };

      const yearlyReturningPieChartData: CustomerNewReturningPieCharts = {
        overview: [yearlyReturningSalesPieChartData, yearlyReturningRepairPieChartData],
        all: [
          yearlyReturningSalesOnlinePieChartData,
          yearlyReturningSalesInStorePieChartData,
          yearlyReturningRepairPieChartData,
        ],
        sales: [
          yearlyReturningSalesOnlinePieChartData,
          yearlyReturningSalesInStorePieChartData,
        ],
      };

      // yearly -> churn & retention rate -> pie chart obj
      const yearlyChurnRetentionRatePieChartData: PieChartData[] = [
        {
          id: "Churn Rate",
          label: "Churn Rate",
          value: toFixedFloat(selectedYearMetrics.customers.churnRate * 100, 2),
        },
        {
          id: "Retention Rate",
          label: "Retention Rate",

          value: toFixedFloat(selectedYearMetrics.customers.retentionRate * 100, 2),
        },
      ];

      resolve({
        new: {
          bar: yearlyNewBarCharts,
          line: yearlyNewLineCharts,
          pie: yearlyNewPieChartData,
        },
        returning: {
          bar: yearlyReturningBarCharts,
          line: yearlyReturningLineCharts,
          pie: yearlyReturningPieChartData,
        },
        churnRetention: {
          bar: yearlyChurnRetentionRateBarCharts,
          line: yearlyChurnRetentionRateLineCharts,
          pie: yearlyChurnRetentionRatePieChartData,
        },
      });
    }, 0);
  });
}

function returnCalendarViewCustomerCharts(
  calendarView: DashboardCalendarView,
  customerMetricsCharts: CustomerMetricsCharts
) {
  return calendarView === "Daily"
    ? customerMetricsCharts.dailyCharts
    : calendarView === "Monthly"
    ? customerMetricsCharts.monthlyCharts
    : customerMetricsCharts.yearlyCharts;
}

export {
  createCustomerMetricsCharts,
  returnCalendarViewCustomerCharts,
  returnSelectedDateCustomerMetrics,
};
export type {
  CustomerMetricsCharts,
  CustomerMetricsChurnRetentionChartsKey,
  CustomerMetricsNewReturningChartsKey,
  CustomerMetricsNewReturningPieChartsKey,
  SelectedDateCustomerMetrics,
};
