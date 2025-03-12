import { Card, Group, Text } from "@mantine/core";
import type { ReactNode } from "react";
import { MdCalendarMonth, MdDateRange } from "react-icons/md";
import { RiCalendarLine } from "react-icons/ri";

import { addCommaSeparator, toFixedFloat } from "../../utils";

type DashboardCardInfo = {
  date?: string;
  heading?: string;
  icon: ReactNode;
  percentage?: string;
  deltaTextColor?: string;
  value: string | number;
  width: number;
};
function returnDashboardCardElement({
  date,
  heading,
  icon,
  percentage,
  deltaTextColor,
  value,
  width,
}: DashboardCardInfo): React.JSX.Element {
  const cardWidth = Math.round(width / 2);

  const cardHeading = (
    <Group w="100%" position="apart">
      <Text size="md">{heading}</Text>
      {icon}
    </Group>
  );

  const cardBody = (
    <Group w="100%" position="apart">
      <Text size="xl" weight={600}>
        {value}
      </Text>
    </Group>
  );

  const displayPercentage = (
    <Text size="sm" italic color={deltaTextColor}>
      {percentage}
    </Text>
  );

  const cardFooter = (
    <Group w="100%" position="apart">
      {displayPercentage}
      <Text size="sm">{date}</Text>
    </Group>
  );

  const createdChartCard = (
    <Card shadow="sm" radius="md" withBorder w={cardWidth}>
      {cardHeading}
      {cardBody}
      {cardFooter}
    </Card>
  );

  return createdChartCard;
}

type CreateDashboardMetricsCardsInput = {
  currentMonth: string;
  currentYear: string;
  greenColorShade: string;
  heading: string;
  isDisplayValueAsCurrency?: boolean;
  isDisplayValueAsPercentage?: boolean;
  isFlipColor?: boolean;
  kind: "day" | "month" | "year";
  prevDay: string;
  prevMonth: string;
  prevValue: number;
  prevYear: string;
  redColorShade: string;
  selectedValue: number;
  width: number;
};

function createDashboardMetricsCards({
  currentMonth,
  currentYear,
  greenColorShade,
  heading,
  isDisplayValueAsCurrency = false,
  isDisplayValueAsPercentage = false,
  isFlipColor = false,
  kind,
  prevDay,
  prevMonth,
  prevValue,
  prevYear,
  redColorShade,
  selectedValue,
  width,
}: CreateDashboardMetricsCardsInput): DashboardCardInfo {
  const icon = kind === "day"
    ? <MdDateRange size={20} />
    : kind === "month"
    ? <MdCalendarMonth size={20} />
    : <RiCalendarLine size={20} />;

  const deltaPercentage = toFixedFloat(
    ((selectedValue - prevValue) / prevValue) * 100,
    2,
  );
  const deltaFormatted = Number.isFinite(deltaPercentage)
    ? `${deltaPercentage > 0 ? "+" : ""} ${toFixedFloat(deltaPercentage, 2)} %`
    : "N/A";

  const deltaTextColor = deltaPercentage > 0
    ? isFlipColor ? redColorShade : greenColorShade
    : deltaPercentage < 0
    ? isFlipColor ? greenColorShade : redColorShade
    : "inherit";

  const dateEndMonthSet = new Set(["31", "30", "29", "28"]);

  const date = kind === "day"
    ? `Since ${prevDay} ${
      // display the previous month if the previous day is the last day of the month
      dateEndMonthSet.has(prevDay) ? prevMonth : currentMonth} ${
      // display the previous year if the previous day is 31st December of the previous year
      currentMonth === "January" ? prevYear : currentYear}`
    : kind === "month"
    ? `Since ${prevMonth} ${
      currentMonth === "January" ? prevYear : currentYear
    }`
    : `Since ${prevYear}`;

  const valueStr = addCommaSeparator(
    toFixedFloat(
      selectedValue < 1 ? selectedValue * 100 : selectedValue,
      selectedValue < 1 ? 4 : 2,
    ),
  );

  const displayValue = isDisplayValueAsPercentage
    ? `${valueStr} %`
    : `${isDisplayValueAsCurrency ? "CAD" : ""} ${
      selectedValue.toString().includes(".")
        ? valueStr
        : addCommaSeparator(selectedValue.toString())
    }`;

  return {
    date,
    heading,
    icon,
    percentage: deltaFormatted,
    value: displayValue,
    width,
    deltaTextColor,
  };
}

export { createDashboardMetricsCards, returnDashboardCardElement };
export type { CreateDashboardMetricsCardsInput, DashboardCardInfo };

/**
 * type ReturnCustomerMetricsCardsInput = {
  greenColorShade: string;
  padding: MantineNumberSize;
  redColorShade: string;
  selectedDateCustomerMetrics: SelectedDateCustomerMetrics;
  width: number;
};

type CustomerMetricsCards = {
  dailyCards: {
    overview: DashboardCardInfo[];
    new: DashboardCardInfo[];
    returning: DashboardCardInfo[];
  };
  monthlyCards: {
    overview: DashboardCardInfo[];
    new: DashboardCardInfo[];
    returning: DashboardCardInfo[];
    churnRate: DashboardCardInfo[];
    retentionRate: DashboardCardInfo[];
  };
  yearlyCards: {
    overview: DashboardCardInfo[];
    new: DashboardCardInfo[];
    returning: DashboardCardInfo[];
    churnRate: DashboardCardInfo[];
    retentionRate: DashboardCardInfo[];
  };
};

function returnCustomerMetricsCards({
  greenColorShade,
  padding,
  redColorShade,
  selectedDateCustomerMetrics,
  width,
}: ReturnCustomerMetricsCardsInput): CustomerMetricsCards {
  // customer metrics data
  const {
    dayCustomerMetrics: { prevDayMetrics, selectedDayMetrics },
    monthCustomerMetrics: { prevMonthMetrics, selectedMonthMetrics },
    yearCustomerMetrics: { prevYearMetrics, selectedYearMetrics },
  } = selectedDateCustomerMetrics;

  const currentYear = selectedYearMetrics?.year ?? "2023";
  const prevYear = prevYearMetrics?.year ?? "2022";
  const currentMonth = selectedMonthMetrics?.month ?? "January";
  const prevMonth = prevMonthMetrics?.month ?? "January";
  const prevDay = prevDayMetrics?.day ?? "01";

  const DASHBOARD_CARD_INFO_INPUT_TEMPLATE: CreateDashboardMetricsCardsInput = {
    currentMonth,
    currentYear,
    greenColorShade,
    heading: "Total",
    kind: "day",
    padding,
    prevDay,
    prevMonth,
    prevValue: 1,
    prevYear,
    redColorShade,
    selectedValue: 1,
    width,
  };

  // day

  // day -> overview

  // day -> overview -> total
  const dayTotalCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total",
    kind: "day",
    prevValue: prevDayMetrics?.customers.total ?? 0,
    selectedValue: selectedDayMetrics?.customers.total ?? 1,
  });

  // day -> overview -> new

  // day -> overview -> new -> total
  const dayTotalNewCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total New",
    kind: "day",
    prevValue: prevDayMetrics?.customers.new.total ?? 0,
    selectedValue: selectedDayMetrics?.customers.new.total ?? 1,
  });

  // day -> overview -> returning

  // day -> overview -> returning -> total
  const dayTotalReturningCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total Returning",
    kind: "day",
    prevValue: prevDayMetrics?.customers.returning.total ?? 0,
    selectedValue: selectedDayMetrics?.customers.returning.total ?? 1,
  });

  // day -> new

  // day -> new -> total
  // already created above

  // day -> new -> repair
  const dayTotalNewRepairCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Repair",
    kind: "day",
    prevValue: prevDayMetrics?.customers.new.repair ?? 0,
    selectedValue: selectedDayMetrics?.customers.new.repair ?? 1,
  });

  // day -> new -> sales

  // day -> new -> sales -> total
  const dayTotalNewSalesCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales",
    kind: "day",
    prevValue: prevDayMetrics?.customers.new.sales.total ?? 0,
    selectedValue: selectedDayMetrics?.customers.new.sales.total ?? 1,
  });

  // day -> new -> sales -> online
  const dayTotalNewSalesOnlineCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Online",
    kind: "day",
    prevValue: prevDayMetrics?.customers.new.sales.online ?? 0,
    selectedValue: selectedDayMetrics?.customers.new.sales.online ?? 1,
  });

  // day -> new -> sales -> in-store
  const dayTotalNewSalesInStoreCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales In-Store",
    kind: "day",
    prevValue: prevDayMetrics?.customers.new.sales.inStore ?? 0,
    selectedValue: selectedDayMetrics?.customers.new.sales.inStore ?? 1,
  });

  // day -> returning

  // day -> returning -> total
  // already created above

  // day -> returning -> repair
  const dayTotalReturningRepairCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Repair",
    kind: "day",
    prevValue: prevDayMetrics?.customers.returning.repair ?? 0,
    selectedValue: selectedDayMetrics?.customers.returning.repair ?? 1,
  });

  // day -> returning -> sales

  // day -> returning -> sales -> total
  const dayTotalReturningSalesCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales",
    kind: "day",
    prevValue: prevDayMetrics?.customers.returning.sales.total ?? 0,
    selectedValue: selectedDayMetrics?.customers.returning.sales.total ?? 1,
  });

  // day -> returning -> sales -> online
  const dayTotalReturningSalesOnlineCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Online",
    kind: "day",
    prevValue: prevDayMetrics?.customers.returning.sales.online ?? 0,
    selectedValue: selectedDayMetrics?.customers.returning.sales.online ?? 1,
  });

  // day -> returning -> sales -> in-store
  const dayTotalReturningSalesInStoreCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales In-Store",
    kind: "day",
    prevValue: prevDayMetrics?.customers.returning.sales.inStore ?? 0,
    selectedValue: selectedDayMetrics?.customers.returning.sales.inStore ?? 1,
  });

  // month

  // month -> overview

  // month -> overview -> total
  const monthTotalCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total",
    kind: "month",
    prevValue: prevMonthMetrics?.customers.total ?? 0,
    selectedValue: selectedMonthMetrics?.customers.total ?? 1,
  });

  // month -> overview -> new

  // month -> overview -> new -> total
  const monthTotalNewCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total New",
    kind: "month",
    prevValue: prevMonthMetrics?.customers.new.total ?? 0,
    selectedValue: selectedMonthMetrics?.customers.new.total ?? 1,
  });

  // month -> overview -> returning

  // month -> overview -> returning -> total
  const monthTotalReturningCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total Returning",
    kind: "month",
    prevValue: prevMonthMetrics?.customers.returning.total ?? 0,
    selectedValue: selectedMonthMetrics?.customers.returning.total ?? 1,
  });

  // month -> new

  // month -> new -> total
  // already created above

  // month -> new -> repair
  const monthTotalNewRepairCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Repair",
    kind: "month",
    prevValue: prevMonthMetrics?.customers.new.repair ?? 0,
    selectedValue: selectedMonthMetrics?.customers.new.repair ?? 1,
  });

  // month -> new -> sales

  // month -> new -> sales -> total
  const monthTotalNewSalesCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales",
    kind: "month",
    prevValue: prevMonthMetrics?.customers.new.sales.total ?? 0,
    selectedValue: selectedMonthMetrics?.customers.new.sales.total ?? 1,
  });

  // month -> new -> sales -> online
  const monthTotalNewSalesOnlineCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Online",
    kind: "month",
    prevValue: prevMonthMetrics?.customers.new.sales.online ?? 0,
    selectedValue: selectedMonthMetrics?.customers.new.sales.online ?? 1,
  });

  // month -> new -> sales -> in-store
  const monthTotalNewSalesInStoreCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales In-Store",
    kind: "month",
    prevValue: prevMonthMetrics?.customers.new.sales.inStore ?? 0,
    selectedValue: selectedMonthMetrics?.customers.new.sales.inStore ?? 1,
  });

  // month -> returning

  // month -> returning -> total
  // already created above

  // month -> returning -> repair
  const monthTotalReturningRepairCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Repair",
    kind: "month",
    prevValue: prevMonthMetrics?.customers.returning.repair ?? 0,
    selectedValue: selectedMonthMetrics?.customers.returning.repair ?? 1,
  });

  // month -> returning -> sales

  // month -> returning -> sales -> total
  const monthTotalReturningSalesCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales",
    kind: "month",
    prevValue: prevMonthMetrics?.customers.returning.sales.total ?? 0,
    selectedValue: selectedMonthMetrics?.customers.returning.sales.total ?? 1,
  });

  // month -> returning -> sales -> online
  const monthTotalReturningSalesOnlineCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Online",
    kind: "month",
    prevValue: prevMonthMetrics?.customers.returning.sales.online ?? 0,
    selectedValue: selectedMonthMetrics?.customers.returning.sales.online ?? 1,
  });

  // month -> returning -> sales -> in-store
  const monthTotalReturningSalesInStoreCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales In-Store",
    kind: "month",
    prevValue: prevMonthMetrics?.customers.returning.sales.inStore ?? 0,
    selectedValue: selectedMonthMetrics?.customers.returning.sales.inStore ?? 1,
  });

  // month -> churn rate
  const monthChurnRateCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Churn Rate",
    isFlipColor: true,
    kind: "month",
    prevValue: prevMonthMetrics?.customers.churnRate ?? 0,
    selectedValue: selectedMonthMetrics?.customers.churnRate ?? 1,
  });

  // month -> retention rate
  const monthRetentionRateCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Retention Rate",
    kind: "month",
    prevValue: prevMonthMetrics?.customers.retentionRate ?? 0,
    selectedValue: selectedMonthMetrics?.customers.retentionRate ?? 1,
  });

  // year

  // year -> overview

  // year -> overview -> total
  const yearTotalCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total",
    kind: "year",
    prevValue: prevYearMetrics?.customers.total ?? 0,
    selectedValue: selectedYearMetrics?.customers.total ?? 1,
  });

  // year -> overview -> new

  // year -> overview -> new -> total
  const yearTotalNewCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total New",
    kind: "year",
    prevValue: prevYearMetrics?.customers.new.total ?? 0,
    selectedValue: selectedYearMetrics?.customers.new.total ?? 1,
  });

  // year -> overview -> returning

  // year -> overview -> returning -> total
  const yearTotalReturningCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total Returning",
    kind: "year",
    prevValue: prevYearMetrics?.customers.returning.total ?? 0,
    selectedValue: selectedYearMetrics?.customers.returning.total ?? 1,
  });

  // year -> new

  // year -> new -> total
  // already created above

  // year -> new -> repair

  // year -> new -> repair -> total
  const yearTotalNewRepairCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Repair",
    kind: "year",
    prevValue: prevYearMetrics?.customers.new.repair ?? 0,
    selectedValue: selectedYearMetrics?.customers.new.repair ?? 1,
  });

  // year -> new -> sales

  // year -> new -> sales -> total
  const yearTotalNewSalesCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales",
    kind: "year",
    prevValue: prevYearMetrics?.customers.new.sales.total ?? 0,
    selectedValue: selectedYearMetrics?.customers.new.sales.total ?? 1,
  });

  // year -> new -> sales -> online
  const yearTotalNewSalesOnlineCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Online",
    kind: "year",
    prevValue: prevYearMetrics?.customers.new.sales.online ?? 0,
    selectedValue: selectedYearMetrics?.customers.new.sales.online ?? 1,
  });

  // year -> new -> sales -> in-store
  const yearTotalNewSalesInStoreCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales In-Store",
    kind: "year",
    prevValue: prevYearMetrics?.customers.new.sales.inStore ?? 0,
    selectedValue: selectedYearMetrics?.customers.new.sales.inStore ?? 1,
  });

  // year -> returning

  // year -> returning -> total
  // already created above

  // year -> returning -> repair
  const yearTotalReturningRepairCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Repair",
    kind: "year",
    prevValue: prevYearMetrics?.customers.returning.repair ?? 0,
    selectedValue: selectedYearMetrics?.customers.returning.repair ?? 1,
  });

  // year -> returning -> sales

  // year -> returning -> sales -> total
  const yearTotalReturningSalesCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales",
    kind: "year",
    prevValue: prevYearMetrics?.customers.returning.sales.total ?? 0,
    selectedValue: selectedYearMetrics?.customers.returning.sales.total ?? 1,
  });

  // year -> returning -> sales -> online
  const yearTotalReturningSalesOnlineCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Online",
    kind: "year",
    prevValue: prevYearMetrics?.customers.returning.sales.online ?? 0,
    selectedValue: selectedYearMetrics?.customers.returning.sales.online ?? 1,
  });

  // year -> returning -> sales -> in-store
  const yearTotalReturningSalesInStoreCustomersCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales In-Store",
    kind: "year",
    prevValue: prevYearMetrics?.customers.returning.sales.inStore ?? 0,
    selectedValue: selectedYearMetrics?.customers.returning.sales.inStore ?? 1,
  });

  // year -> churn rate
  const yearChurnRateCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Churn Rate",
    isFlipColor: true,
    kind: "year",
    prevValue: prevYearMetrics?.customers.churnRate ?? 0,
    selectedValue: selectedYearMetrics?.customers.churnRate ?? 1,
  });

  // year -> retention rate
  const yearRetentionRateCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Retention Rate",
    kind: "year",
    prevValue: prevYearMetrics?.customers.retentionRate ?? 0,
    selectedValue: selectedYearMetrics?.customers.retentionRate ?? 1,
  });

  return {
    dailyCards: {
      overview: [
        dayTotalCustomersCardInfo,
        dayTotalNewCustomersCardInfo,
        dayTotalReturningCustomersCardInfo,
      ],
      new: [
        dayTotalNewCustomersCardInfo,
        dayTotalNewRepairCustomersCardInfo,
        dayTotalNewSalesCustomersCardInfo,
        dayTotalNewSalesOnlineCustomersCardInfo,
        dayTotalNewSalesInStoreCustomersCardInfo,
      ],
      returning: [
        dayTotalReturningCustomersCardInfo,
        dayTotalReturningRepairCustomersCardInfo,
        dayTotalReturningSalesCustomersCardInfo,
        dayTotalReturningSalesOnlineCustomersCardInfo,
        dayTotalReturningSalesInStoreCustomersCardInfo,
      ],
    },
    monthlyCards: {
      overview: [
        monthTotalCustomersCardInfo,
        monthTotalNewCustomersCardInfo,
        monthTotalReturningCustomersCardInfo,
      ],
      new: [
        monthTotalNewCustomersCardInfo,
        monthTotalNewRepairCustomersCardInfo,
        monthTotalNewSalesCustomersCardInfo,
        monthTotalNewSalesOnlineCustomersCardInfo,
        monthTotalNewSalesInStoreCustomersCardInfo,
      ],
      returning: [
        monthTotalReturningCustomersCardInfo,
        monthTotalReturningRepairCustomersCardInfo,
        monthTotalReturningSalesCustomersCardInfo,
        monthTotalReturningSalesOnlineCustomersCardInfo,
        monthTotalReturningSalesInStoreCustomersCardInfo,
      ],
      churnRate: [monthChurnRateCardInfo],
      retentionRate: [monthRetentionRateCardInfo],
    },
    yearlyCards: {
      overview: [
        yearTotalCustomersCardInfo,
        yearTotalNewCustomersCardInfo,
        yearTotalReturningCustomersCardInfo,
      ],
      new: [
        yearTotalNewCustomersCardInfo,
        yearTotalNewRepairCustomersCardInfo,
        yearTotalNewSalesCustomersCardInfo,
        yearTotalNewSalesOnlineCustomersCardInfo,
        yearTotalNewSalesInStoreCustomersCardInfo,
      ],
      returning: [
        yearTotalReturningCustomersCardInfo,
        yearTotalReturningRepairCustomersCardInfo,
        yearTotalReturningSalesCustomersCardInfo,
        yearTotalReturningSalesOnlineCustomersCardInfo,
        yearTotalReturningSalesInStoreCustomersCardInfo,
      ],
      churnRate: [yearChurnRateCardInfo],
      retentionRate: [yearRetentionRateCardInfo],
    },
  };
}

type ReturnFinancialMetricsCardsInput = {
  selectedDateFinancialMetrics: SelectedDateFinancialMetrics;
  greenColorShade: string;
  redColorShade: string;
  padding: MantineNumberSize;
  width: number;
};

type FinancialMetricsCards = {
  dailyCards: {
    profit: DashboardCardInfo[];
    expenses: DashboardCardInfo[];
    transactions: DashboardCardInfo[];
    revenue: DashboardCardInfo[];
    otherMetrics: DashboardCardInfo[];
  };
  monthlyCards: {
    profit: DashboardCardInfo[];
    expenses: DashboardCardInfo[];
    transactions: DashboardCardInfo[];
    revenue: DashboardCardInfo[];
    otherMetrics: DashboardCardInfo[];
  };
  yearlyCards: {
    profit: DashboardCardInfo[];
    expenses: DashboardCardInfo[];
    transactions: DashboardCardInfo[];
    revenue: DashboardCardInfo[];
    otherMetrics: DashboardCardInfo[];
  };
};

function returnFinancialMetricsCards({
  padding,
  selectedDateFinancialMetrics,
  greenColorShade,
  redColorShade,
  width,
}: ReturnFinancialMetricsCardsInput): FinancialMetricsCards {
  // financial metrics data
  const {
    dayFinancialMetrics: { prevDayMetrics, selectedDayMetrics },
    monthFinancialMetrics: { prevMonthMetrics, selectedMonthMetrics },
    yearFinancialMetrics: { prevYearMetrics, selectedYearMetrics },
  } = selectedDateFinancialMetrics;

  const currentYear = selectedYearMetrics?.year ?? "2023";
  const prevYear = prevYearMetrics?.year ?? "2022";
  const currentMonth = selectedMonthMetrics?.month ?? "January";
  const prevMonth = prevMonthMetrics?.month ?? "January";
  const prevDay = prevDayMetrics?.day ?? "01";

  const DASHBOARD_CARD_INFO_INPUT_TEMPLATE: CreateDashboardMetricsCardsInput = {
    currentMonth,
    currentYear,
    greenColorShade,
    heading: "Total",
    kind: "day",
    padding,
    prevDay,
    prevMonth,
    prevValue: 1,
    prevYear,
    redColorShade,
    selectedValue: 1,
    width,
  };

  // day

  // day -> profit

  // day -> profit -> total
  const dayProfitTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total",
    isDisplayValueAsCurrency: true,
    kind: "day",
    prevValue: prevDayMetrics?.profit.total ?? 0,
    selectedValue: selectedDayMetrics?.profit.total ?? 1,
  });

  // day -> profit -> repair
  const dayProfitRepairCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Repair",
    isDisplayValueAsCurrency: true,
    kind: "day",
    prevValue: prevDayMetrics?.profit.repair ?? 0,
    selectedValue: selectedDayMetrics?.profit.repair ?? 1,
  });

  // day -> profit -> sales

  // day -> profit -> sales -> total
  const dayProfitSalesTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Total",
    isDisplayValueAsCurrency: true,
    kind: "day",
    prevValue: prevDayMetrics?.profit.sales.total ?? 0,
    selectedValue: selectedDayMetrics?.profit.sales.total ?? 1,
  });

  // day -> profit -> sales -> online
  const dayProfitSalesOnlineCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Online",
    isDisplayValueAsCurrency: true,
    kind: "day",
    prevValue: prevDayMetrics?.profit.sales.online ?? 0,
    selectedValue: selectedDayMetrics?.profit.sales.online ?? 1,
  });

  // day -> profit -> sales -> in-store
  const dayProfitSalesInStoreCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales In-Store",
    isDisplayValueAsCurrency: true,
    kind: "day",
    prevValue: prevDayMetrics?.profit.sales.inStore ?? 0,
    selectedValue: selectedDayMetrics?.profit.sales.inStore ?? 1,
  });

  // day -> expenses

  // day -> expenses -> total
  const dayExpensesTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total",
    isDisplayValueAsCurrency: true,
    isFlipColor: true,
    kind: "day",
    prevValue: prevDayMetrics?.expenses.total ?? 0,
    selectedValue: selectedDayMetrics?.expenses.total ?? 1,
  });

  // day -> expenses -> repair
  const dayExpensesRepairCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Repair",
    isDisplayValueAsCurrency: true,
    isFlipColor: true,
    kind: "day",
    prevValue: prevDayMetrics?.expenses.repair ?? 0,
    selectedValue: selectedDayMetrics?.expenses.repair ?? 1,
  });

  // day -> expenses -> sales

  // day -> expenses -> sales -> total
  const dayExpensesSalesTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Total",
    isDisplayValueAsCurrency: true,
    isFlipColor: true,
    kind: "day",
    prevValue: prevDayMetrics?.expenses.sales.total ?? 0,
    selectedValue: selectedDayMetrics?.expenses.sales.total ?? 1,
  });

  // day -> expenses -> sales -> online
  const dayExpensesSalesOnlineCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Online",
    isDisplayValueAsCurrency: true,
    isFlipColor: true,
    kind: "day",
    prevValue: prevDayMetrics?.expenses.sales.online ?? 0,
    selectedValue: selectedDayMetrics?.expenses.sales.online ?? 1,
  });

  // day -> expenses -> sales -> in-store
  const dayExpensesSalesInStoreCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales In-Store",
    isDisplayValueAsCurrency: true,
    isFlipColor: true,
    kind: "day",
    prevValue: prevDayMetrics?.expenses.sales.inStore ?? 0,
    selectedValue: selectedDayMetrics?.expenses.sales.inStore ?? 1,
  });

  // day -> transactions

  // day -> transactions -> total
  const dayUnitsSoldTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total",
    kind: "day",
    prevValue: prevDayMetrics?.transactions.total ?? 0,
    selectedValue: selectedDayMetrics?.transactions.total ?? 1,
  });

  // day -> transactions -> repair
  const dayUnitsSoldRepairCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Repair",
    kind: "day",
    prevValue: prevDayMetrics?.transactions.repair ?? 0,
    selectedValue: selectedDayMetrics?.transactions.repair ?? 1,
  });

  // day -> transactions -> sales

  // day -> transactions -> sales -> total
  const dayUnitsSoldSalesTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Total",
    kind: "day",
    prevValue: prevDayMetrics?.transactions.sales.total ?? 0,
    selectedValue: selectedDayMetrics?.transactions.sales.total ?? 1,
  });

  // day -> transactions -> sales -> online
  const dayUnitsSoldSalesOnlineCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Online",
    kind: "day",
    prevValue: prevDayMetrics?.transactions.sales.online ?? 0,
    selectedValue: selectedDayMetrics?.transactions.sales.online ?? 1,
  });

  // day -> transactions -> sales -> in-store
  const dayUnitsSoldSalesInStoreCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales In-Store",
    kind: "day",
    prevValue: prevDayMetrics?.transactions.sales.inStore ?? 0,
    selectedValue: selectedDayMetrics?.transactions.sales.inStore ?? 1,
  });

  // day -> revenue

  // day -> revenue -> total
  const dayRevenueTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total",
    isDisplayValueAsCurrency: true,
    kind: "day",
    prevValue: prevDayMetrics?.revenue.total ?? 0,
    selectedValue: selectedDayMetrics?.revenue.total ?? 1,
  });

  // day -> revenue -> repair
  const dayRevenueRepairCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Repair",
    isDisplayValueAsCurrency: true,
    kind: "day",
    prevValue: prevDayMetrics?.revenue.repair ?? 0,
    selectedValue: selectedDayMetrics?.revenue.repair ?? 1,
  });

  // day -> revenue -> sales

  // day -> revenue -> sales -> total
  const dayRevenueSalesTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Total",
    isDisplayValueAsCurrency: true,
    kind: "day",
    prevValue: prevDayMetrics?.revenue.sales.total ?? 0,
    selectedValue: selectedDayMetrics?.revenue.sales.total ?? 1,
  });

  // day -> revenue -> sales -> online
  const dayRevenueSalesOnlineCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Online",
    isDisplayValueAsCurrency: true,
    kind: "day",
    prevValue: prevDayMetrics?.revenue.sales.online ?? 0,
    selectedValue: selectedDayMetrics?.revenue.sales.online ?? 1,
  });

  // day -> revenue -> sales -> in-store
  const dayRevenueSalesInStoreCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales In-Store",
    isDisplayValueAsCurrency: true,
    kind: "day",
    prevValue: prevDayMetrics?.revenue.sales.inStore ?? 0,
    selectedValue: selectedDayMetrics?.revenue.sales.inStore ?? 1,
  });

  // day -> average order value
  const dayAverageOrderValueCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Average Order Value",
    isDisplayValueAsCurrency: true,
    kind: "day",
    prevValue: prevDayMetrics?.averageOrderValue ?? 0,
    selectedValue: selectedDayMetrics?.averageOrderValue ?? 1,
  });

  // day -> conversion rate
  const dayConversionRateCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Conversion Rate",
    isDisplayValueAsPercentage: true,
    kind: "day",
    prevValue: prevDayMetrics?.conversionRate ?? 0,
    selectedValue: selectedDayMetrics?.conversionRate ?? 1,
  });

  // day -> net profit margin
  const dayNetProfitMarginCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Net Profit Margin",
    isDisplayValueAsPercentage: true,
    kind: "day",
    prevValue: prevDayMetrics?.netProfitMargin ?? 0,
    selectedValue: selectedDayMetrics?.netProfitMargin ?? 1,
  });

  // month

  // month -> profit

  // month -> profit -> total
  const monthProfitTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total",
    isDisplayValueAsCurrency: true,
    kind: "month",
    prevValue: prevMonthMetrics?.profit.total ?? 0,
    selectedValue: selectedMonthMetrics?.profit.total ?? 1,
  });

  // month -> profit -> repair
  const monthProfitRepairCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Repair",
    isDisplayValueAsCurrency: true,
    kind: "month",
    prevValue: prevMonthMetrics?.profit.repair ?? 0,
    selectedValue: selectedMonthMetrics?.profit.repair ?? 1,
  });

  // month -> profit -> sales

  // month -> profit -> sales -> total
  const monthProfitSalesTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Total",
    isDisplayValueAsCurrency: true,
    kind: "month",
    prevValue: prevMonthMetrics?.profit.sales.total ?? 0,
    selectedValue: selectedMonthMetrics?.profit.sales.total ?? 1,
  });

  // month -> profit -> sales -> online
  const monthProfitSalesOnlineCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Online",
    isDisplayValueAsCurrency: true,
    kind: "month",
    prevValue: prevMonthMetrics?.profit.sales.online ?? 0,
    selectedValue: selectedMonthMetrics?.profit.sales.online ?? 1,
  });

  // month -> profit -> sales -> in-store
  const monthProfitSalesInStoreCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales In-Store",
    isDisplayValueAsCurrency: true,
    kind: "month",
    prevValue: prevMonthMetrics?.profit.sales.inStore ?? 0,
    selectedValue: selectedMonthMetrics?.profit.sales.inStore ?? 1,
  });

  // month -> expenses

  // month -> expenses -> total
  const monthExpensesTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total",
    isDisplayValueAsCurrency: true,
    isFlipColor: true,
    kind: "month",
    prevValue: prevMonthMetrics?.expenses.total ?? 0,
    selectedValue: selectedMonthMetrics?.expenses.total ?? 1,
  });

  // month -> expenses -> repair
  const monthExpensesRepairCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Repair",
    isDisplayValueAsCurrency: true,
    isFlipColor: true,
    kind: "month",
    prevValue: prevMonthMetrics?.expenses.repair ?? 0,
    selectedValue: selectedMonthMetrics?.expenses.repair ?? 1,
  });

  // month -> expenses -> sales

  // month -> expenses -> sales -> total
  const monthExpensesSalesTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Total",
    isDisplayValueAsCurrency: true,
    isFlipColor: true,
    kind: "month",
    prevValue: prevMonthMetrics?.expenses.sales.total ?? 0,
    selectedValue: selectedMonthMetrics?.expenses.sales.total ?? 1,
  });

  // month -> expenses -> sales -> online
  const monthExpensesSalesOnlineCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Online",
    isDisplayValueAsCurrency: true,
    isFlipColor: true,
    kind: "month",
    prevValue: prevMonthMetrics?.expenses.sales.online ?? 0,
    selectedValue: selectedMonthMetrics?.expenses.sales.online ?? 1,
  });

  // month -> expenses -> sales -> in-store
  const monthExpensesSalesInStoreCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales In-Store",
    isDisplayValueAsCurrency: true,
    isFlipColor: true,
    kind: "month",
    prevValue: prevMonthMetrics?.expenses.sales.inStore ?? 0,
    selectedValue: selectedMonthMetrics?.expenses.sales.inStore ?? 1,
  });

  // month -> transactions

  // month -> transactions -> total
  const monthUnitsSoldTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total",
    kind: "month",
    prevValue: prevMonthMetrics?.transactions.total ?? 0,
    selectedValue: selectedMonthMetrics?.transactions.total ?? 1,
  });

  // month -> transactions -> repair
  const monthUnitsSoldRepairCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Repair",
    kind: "month",
    prevValue: prevMonthMetrics?.transactions.repair ?? 0,
    selectedValue: selectedMonthMetrics?.transactions.repair ?? 1,
  });

  // month -> transactions -> sales

  // month -> transactions -> sales -> total
  const monthUnitsSoldSalesTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Total",
    kind: "month",
    prevValue: prevMonthMetrics?.transactions.sales.total ?? 0,
    selectedValue: selectedMonthMetrics?.transactions.sales.total ?? 1,
  });

  // month -> transactions -> sales -> online
  const monthUnitsSoldSalesOnlineCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Online",
    kind: "month",
    prevValue: prevMonthMetrics?.transactions.sales.online ?? 0,
    selectedValue: selectedMonthMetrics?.transactions.sales.online ?? 1,
  });

  // month -> transactions -> sales -> in-store
  const monthUnitsSoldSalesInStoreCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales In-Store",
    kind: "month",
    prevValue: prevMonthMetrics?.transactions.sales.inStore ?? 0,
    selectedValue: selectedMonthMetrics?.transactions.sales.inStore ?? 1,
  });

  // month -> revenue

  // month -> revenue -> total
  const monthRevenueTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total",
    isDisplayValueAsCurrency: true,
    kind: "month",
    prevValue: prevMonthMetrics?.revenue.total ?? 0,
    selectedValue: selectedMonthMetrics?.revenue.total ?? 1,
  });

  // month -> revenue -> repair
  const monthRevenueRepairCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Repair",
    isDisplayValueAsCurrency: true,
    kind: "month",
    prevValue: prevMonthMetrics?.revenue.repair ?? 0,
    selectedValue: selectedMonthMetrics?.revenue.repair ?? 1,
  });

  // month -> revenue -> sales

  // month -> revenue -> sales -> total
  const monthRevenueSalesTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Total",
    isDisplayValueAsCurrency: true,
    kind: "month",
    prevValue: prevMonthMetrics?.revenue.sales.total ?? 0,
    selectedValue: selectedMonthMetrics?.revenue.sales.total ?? 1,
  });

  // month -> revenue -> sales -> online
  const monthRevenueSalesOnlineCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Online",
    isDisplayValueAsCurrency: true,
    kind: "month",
    prevValue: prevMonthMetrics?.revenue.sales.online ?? 0,
    selectedValue: selectedMonthMetrics?.revenue.sales.online ?? 1,
  });

  // month -> revenue -> sales -> in-store
  const monthRevenueSalesInStoreCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales In-Store",
    isDisplayValueAsCurrency: true,
    kind: "month",
    prevValue: prevMonthMetrics?.revenue.sales.inStore ?? 0,
    selectedValue: selectedMonthMetrics?.revenue.sales.inStore ?? 1,
  });

  // month -> average order value
  const monthAverageOrderValueCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Average Order Value",
    isDisplayValueAsCurrency: true,
    kind: "month",
    prevValue: prevMonthMetrics?.averageOrderValue ?? 0,
    selectedValue: selectedMonthMetrics?.averageOrderValue ?? 1,
  });

  // month -> conversion rate
  const monthConversionRateCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Conversion Rate",
    isDisplayValueAsPercentage: true,
    kind: "month",
    prevValue: prevMonthMetrics?.conversionRate ?? 0,
    selectedValue: selectedMonthMetrics?.conversionRate ?? 1,
  });

  // month -> net profit margin
  const monthNetProfitMarginCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Net Profit Margin",
    isDisplayValueAsPercentage: true,
    kind: "month",
    prevValue: prevMonthMetrics?.netProfitMargin ?? 0,
    selectedValue: selectedMonthMetrics?.netProfitMargin ?? 1,
  });

  // year

  // year -> profit

  // year -> profit -> total
  const yearProfitTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total",
    isDisplayValueAsCurrency: true,
    kind: "year",
    prevValue: prevYearMetrics?.profit.total ?? 0,
    selectedValue: selectedYearMetrics?.profit.total ?? 1,
  });

  // year -> profit -> repair
  const yearProfitRepairCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Repair",
    isDisplayValueAsCurrency: true,
    kind: "year",
    prevValue: prevYearMetrics?.profit.repair ?? 0,
    selectedValue: selectedYearMetrics?.profit.repair ?? 1,
  });

  // year -> profit -> sales

  // year -> profit -> sales -> total
  const yearProfitSalesTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Total",
    isDisplayValueAsCurrency: true,
    kind: "year",
    prevValue: prevYearMetrics?.profit.sales.total ?? 0,
    selectedValue: selectedYearMetrics?.profit.sales.total ?? 1,
  });

  // year -> profit -> sales -> online
  const yearProfitSalesOnlineCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Online",
    isDisplayValueAsCurrency: true,
    kind: "year",
    prevValue: prevYearMetrics?.profit.sales.online ?? 0,
    selectedValue: selectedYearMetrics?.profit.sales.online ?? 1,
  });

  // year -> profit -> sales -> in-store
  const yearProfitSalesInStoreCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales In-Store",
    isDisplayValueAsCurrency: true,
    kind: "year",
    prevValue: prevYearMetrics?.profit.sales.inStore ?? 0,
    selectedValue: selectedYearMetrics?.profit.sales.inStore ?? 1,
  });

  // year -> expenses

  // year -> expenses -> total
  const yearExpensesTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total",
    isDisplayValueAsCurrency: true,
    isFlipColor: true,
    kind: "year",
    prevValue: prevYearMetrics?.expenses.total ?? 0,
    selectedValue: selectedYearMetrics?.expenses.total ?? 1,
  });

  // year -> expenses -> repair
  const yearExpensesRepairCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Repair",
    isDisplayValueAsCurrency: true,
    isFlipColor: true,
    kind: "year",
    prevValue: prevYearMetrics?.expenses.repair ?? 0,
    selectedValue: selectedYearMetrics?.expenses.repair ?? 1,
  });

  // year -> expenses -> sales

  // year -> expenses -> sales -> total
  const yearExpensesSalesTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Total",
    isDisplayValueAsCurrency: true,
    isFlipColor: true,
    kind: "year",
    prevValue: prevYearMetrics?.expenses.sales.total ?? 0,
    selectedValue: selectedYearMetrics?.expenses.sales.total ?? 1,
  });

  // year -> expenses -> sales -> online
  const yearExpensesSalesOnlineCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Online",
    isDisplayValueAsCurrency: true,
    isFlipColor: true,
    kind: "year",
    prevValue: prevYearMetrics?.expenses.sales.online ?? 0,
    selectedValue: selectedYearMetrics?.expenses.sales.online ?? 1,
  });

  // year -> expenses -> sales -> in-store
  const yearExpensesSalesInStoreCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales In-Store",
    isDisplayValueAsCurrency: true,
    isFlipColor: true,
    kind: "year",
    prevValue: prevYearMetrics?.expenses.sales.inStore ?? 0,
    selectedValue: selectedYearMetrics?.expenses.sales.inStore ?? 1,
  });

  // year -> transactions

  // year -> transactions -> total
  const yearUnitsSoldTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total",
    kind: "year",
    prevValue: prevYearMetrics?.transactions.total ?? 0,
    selectedValue: selectedYearMetrics?.transactions.total ?? 1,
  });

  // year -> transactions -> repair
  const yearUnitsSoldRepairCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Repair",
    kind: "year",
    prevValue: prevYearMetrics?.transactions.repair ?? 0,
    selectedValue: selectedYearMetrics?.transactions.repair ?? 1,
  });

  // year -> transactions -> sales

  // year -> transactions -> sales -> total
  const yearUnitsSoldSalesTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Total",
    kind: "year",
    prevValue: prevYearMetrics?.transactions.sales.total ?? 0,
    selectedValue: selectedYearMetrics?.transactions.sales.total ?? 1,
  });

  // year -> transactions -> sales -> online
  const yearUnitsSoldSalesOnlineCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Online",
    kind: "year",
    prevValue: prevYearMetrics?.transactions.sales.online ?? 0,
    selectedValue: selectedYearMetrics?.transactions.sales.online ?? 1,
  });

  // year -> transactions -> sales -> in-store
  const yearUnitsSoldSalesInStoreCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales In-Store",
    kind: "year",
    prevValue: prevYearMetrics?.transactions.sales.inStore ?? 0,
    selectedValue: selectedYearMetrics?.transactions.sales.inStore ?? 1,
  });

  // year -> revenue

  // year -> revenue -> total
  const yearRevenueTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total",
    isDisplayValueAsCurrency: true,
    kind: "year",
    prevValue: prevYearMetrics?.revenue.total ?? 0,
    selectedValue: selectedYearMetrics?.revenue.total ?? 1,
  });

  // year -> revenue -> repair
  const yearRevenueRepairCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Repair",
    isDisplayValueAsCurrency: true,
    kind: "year",
    prevValue: prevYearMetrics?.revenue.repair ?? 0,
    selectedValue: selectedYearMetrics?.revenue.repair ?? 1,
  });

  // year -> revenue -> sales

  // year -> revenue -> sales -> total
  const yearRevenueSalesTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Total",
    isDisplayValueAsCurrency: true,
    kind: "year",
    prevValue: prevYearMetrics?.revenue.sales.total ?? 0,
    selectedValue: selectedYearMetrics?.revenue.sales.total ?? 1,
  });

  // year -> revenue -> sales -> online
  const yearRevenueSalesOnlineCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales Online",
    isDisplayValueAsCurrency: true,
    kind: "year",
    prevValue: prevYearMetrics?.revenue.sales.online ?? 0,
    selectedValue: selectedYearMetrics?.revenue.sales.online ?? 1,
  });

  // year -> revenue -> sales -> in-store
  const yearRevenueSalesInStoreCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Sales In-Store",
    isDisplayValueAsCurrency: true,
    kind: "year",
    prevValue: prevYearMetrics?.revenue.sales.inStore ?? 0,
    selectedValue: selectedYearMetrics?.revenue.sales.inStore ?? 1,
  });

  // year -> average order value
  const yearAverageOrderValueCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Average Order Value",
    isDisplayValueAsCurrency: true,
    kind: "year",
    prevValue: prevYearMetrics?.averageOrderValue ?? 0,
    selectedValue: selectedYearMetrics?.averageOrderValue ?? 1,
  });

  // year -> conversion rate
  const yearConversionRateCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Conversion Rate",
    isDisplayValueAsPercentage: true,
    kind: "year",
    prevValue: prevYearMetrics?.conversionRate ?? 0,
    selectedValue: selectedYearMetrics?.conversionRate ?? 1,
  });

  // year -> net profit margin
  const yearNetProfitMarginCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Net Profit Margin",
    isDisplayValueAsPercentage: true,
    kind: "year",
    prevValue: prevYearMetrics?.netProfitMargin ?? 0,
    selectedValue: selectedYearMetrics?.netProfitMargin ?? 1,
  });

  return {
    dailyCards: {
      profit: [
        dayProfitTotalCardInfo,
        dayProfitRepairCardInfo,
        dayProfitSalesTotalCardInfo,
        dayProfitSalesOnlineCardInfo,
        dayProfitSalesInStoreCardInfo,
      ],
      revenue: [
        dayRevenueTotalCardInfo,
        dayRevenueRepairCardInfo,
        dayRevenueSalesTotalCardInfo,
        dayRevenueSalesOnlineCardInfo,
        dayRevenueSalesInStoreCardInfo,
      ],
      expenses: [
        dayExpensesTotalCardInfo,
        dayExpensesRepairCardInfo,
        dayExpensesSalesTotalCardInfo,
        dayExpensesSalesOnlineCardInfo,
        dayExpensesSalesInStoreCardInfo,
      ],
      transactions: [
        dayUnitsSoldTotalCardInfo,
        dayUnitsSoldRepairCardInfo,
        dayUnitsSoldSalesTotalCardInfo,
        dayUnitsSoldSalesOnlineCardInfo,
        dayUnitsSoldSalesInStoreCardInfo,
      ],
      otherMetrics: [
        dayAverageOrderValueCardInfo,
        dayConversionRateCardInfo,
        dayNetProfitMarginCardInfo,
      ],
    },
    monthlyCards: {
      profit: [
        monthProfitTotalCardInfo,
        monthProfitRepairCardInfo,
        monthProfitSalesTotalCardInfo,
        monthProfitSalesOnlineCardInfo,
        monthProfitSalesInStoreCardInfo,
      ],
      revenue: [
        monthRevenueTotalCardInfo,
        monthRevenueRepairCardInfo,
        monthRevenueSalesTotalCardInfo,
        monthRevenueSalesOnlineCardInfo,
        monthRevenueSalesInStoreCardInfo,
      ],
      expenses: [
        monthExpensesTotalCardInfo,
        monthExpensesRepairCardInfo,
        monthExpensesSalesTotalCardInfo,
        monthExpensesSalesOnlineCardInfo,
        monthExpensesSalesInStoreCardInfo,
      ],
      transactions: [
        monthUnitsSoldTotalCardInfo,
        monthUnitsSoldRepairCardInfo,
        monthUnitsSoldSalesTotalCardInfo,
        monthUnitsSoldSalesOnlineCardInfo,
        monthUnitsSoldSalesInStoreCardInfo,
      ],
      otherMetrics: [
        monthAverageOrderValueCardInfo,
        monthConversionRateCardInfo,
        monthNetProfitMarginCardInfo,
      ],
    },
    yearlyCards: {
      profit: [
        yearProfitTotalCardInfo,
        yearProfitRepairCardInfo,
        yearProfitSalesTotalCardInfo,
        yearProfitSalesOnlineCardInfo,
        yearProfitSalesInStoreCardInfo,
      ],
      revenue: [
        yearRevenueTotalCardInfo,
        yearRevenueRepairCardInfo,
        yearRevenueSalesTotalCardInfo,
        yearRevenueSalesOnlineCardInfo,
        yearRevenueSalesInStoreCardInfo,
      ],
      expenses: [
        yearExpensesTotalCardInfo,
        yearExpensesRepairCardInfo,
        yearExpensesSalesTotalCardInfo,
        yearExpensesSalesOnlineCardInfo,
        yearExpensesSalesInStoreCardInfo,
      ],
      transactions: [
        yearUnitsSoldTotalCardInfo,
        yearUnitsSoldRepairCardInfo,
        yearUnitsSoldSalesTotalCardInfo,
        yearUnitsSoldSalesOnlineCardInfo,
        yearUnitsSoldSalesInStoreCardInfo,
      ],
      otherMetrics: [
        yearAverageOrderValueCardInfo,
        yearConversionRateCardInfo,
        yearNetProfitMarginCardInfo,
      ],
    },
  };
}

type ReturnProductMetricsCardsInput = {
  greenColorShade: string;
  padding: MantineNumberSize;
  redColorShade: string;
  selectedDateProductMetrics: SelectedDateProductMetrics;
  width: number;
};

type ProductMetricsCards = {
  dailyCards: {
    revenue: DashboardCardInfo[];
    unitsSold: DashboardCardInfo[];
  };
  monthlyCards: {
    revenue: DashboardCardInfo[];
    unitsSold: DashboardCardInfo[];
  };
  yearlyCards: {
    revenue: DashboardCardInfo[];
    unitsSold: DashboardCardInfo[];
  };
};

function returnProductMetricsCards({
  greenColorShade,
  padding,
  redColorShade,
  selectedDateProductMetrics,
  width,
}: ReturnProductMetricsCardsInput): ProductMetricsCards {
  // customer metrics data
  const {
    dayProductMetrics: { prevDayMetrics, selectedDayMetrics },
    monthProductMetrics: { prevMonthMetrics, selectedMonthMetrics },
    yearProductMetrics: { prevYearMetrics, selectedYearMetrics },
  } = selectedDateProductMetrics;

  const currentYear = selectedYearMetrics?.year ?? "2023";
  const prevYear = prevYearMetrics?.year ?? "2022";
  const currentMonth = selectedMonthMetrics?.month ?? "January";
  const prevMonth = prevMonthMetrics?.month ?? "January";
  const prevDay = prevDayMetrics?.day ?? "01";

  const DASHBOARD_CARD_INFO_INPUT_TEMPLATE: CreateDashboardMetricsCardsInput = {
    currentMonth,
    currentYear,
    greenColorShade,
    heading: "Total",
    kind: "day",
    padding,
    prevDay,
    prevMonth,
    prevValue: 1,
    prevYear,
    redColorShade,
    selectedValue: 1,
    width,
  };

  // daily

  // daily -> revenue

  // daily -> revenue -> total
  const dayRevenueTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    isDisplayValueAsCurrency: true,
    prevValue: prevDayMetrics?.revenue.total ?? 0,
    selectedValue: selectedDayMetrics?.revenue.total ?? 1,
  });

  // daily -> revenue -> inStore
  const dayRevenueInStoreCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "In-Store",
    isDisplayValueAsCurrency: true,
    prevValue: prevDayMetrics?.revenue.inStore ?? 0,
    selectedValue: selectedDayMetrics?.revenue.inStore ?? 1,
  });

  // daily -> revenue -> online
  const dayRevenueOnlineCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Online",
    isDisplayValueAsCurrency: true,
    prevValue: prevDayMetrics?.revenue.online ?? 0,
    selectedValue: selectedDayMetrics?.revenue.online ?? 1,
  });

  // daily -> unitsSold

  // daily -> unitsSold -> total
  const dayUnitsSoldTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total",
    prevValue: prevDayMetrics?.unitsSold.total ?? 0,
    selectedValue: selectedDayMetrics?.unitsSold.total ?? 1,
  });

  // daily -> unitsSold -> inStore
  const dayUnitsSoldInStoreCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "In-Store",
    prevValue: prevDayMetrics?.unitsSold.inStore ?? 0,
    selectedValue: selectedDayMetrics?.unitsSold.inStore ?? 1,
  });

  // daily -> unitsSold -> online
  const dayUnitsSoldOnlineCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Online",
    prevValue: prevDayMetrics?.unitsSold.online ?? 0,
    selectedValue: selectedDayMetrics?.unitsSold.online ?? 1,
  });

  // monthly

  // monthly -> revenue

  // monthly -> revenue -> total
  const monthRevenueTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    isDisplayValueAsCurrency: true,
    kind: "month",
    prevValue: prevMonthMetrics?.revenue.total ?? 0,
    selectedValue: selectedMonthMetrics?.revenue.total ?? 1,
  });

  // monthly -> revenue -> inStore
  const monthRevenueInStoreCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    isDisplayValueAsCurrency: true,
    heading: "In-Store",
    kind: "month",
    prevValue: prevMonthMetrics?.revenue.inStore ?? 0,
    selectedValue: selectedMonthMetrics?.revenue.inStore ?? 1,
  });

  // monthly -> revenue -> online
  const monthRevenueOnlineCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    isDisplayValueAsCurrency: true,
    heading: "Online",
    kind: "month",
    prevValue: prevMonthMetrics?.revenue.online ?? 0,
    selectedValue: selectedMonthMetrics?.revenue.online ?? 1,
  });

  // monthly -> unitsSold

  // monthly -> unitsSold -> total
  const monthUnitsSoldTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total",
    kind: "month",
    prevValue: prevMonthMetrics?.unitsSold.total ?? 0,
    selectedValue: selectedMonthMetrics?.unitsSold.total ?? 1,
  });

  // monthly -> unitsSold -> inStore
  const monthUnitsSoldInStoreCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "In-Store",
    kind: "month",
    prevValue: prevMonthMetrics?.unitsSold.inStore ?? 0,
    selectedValue: selectedMonthMetrics?.unitsSold.inStore ?? 1,
  });

  // monthly -> unitsSold -> online
  const monthUnitsSoldOnlineCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Online",
    kind: "month",
    prevValue: prevMonthMetrics?.unitsSold.online ?? 0,
    selectedValue: selectedMonthMetrics?.unitsSold.online ?? 1,
  });

  // yearly

  // yearly -> revenue

  // yearly -> revenue -> total
  const yearRevenueTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    isDisplayValueAsCurrency: true,
    kind: "year",
    prevValue: prevYearMetrics?.revenue.total ?? 0,
    selectedValue: selectedYearMetrics?.revenue.total ?? 1,
  });

  // yearly -> revenue -> inStore
  const yearRevenueInStoreCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "In-Store",
    isDisplayValueAsCurrency: true,
    kind: "year",
    prevValue: prevYearMetrics?.revenue.inStore ?? 0,
    selectedValue: selectedYearMetrics?.revenue.inStore ?? 1,
  });

  // yearly -> revenue -> online
  const yearRevenueOnlineCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Online",
    isDisplayValueAsCurrency: true,
    kind: "year",
    prevValue: prevYearMetrics?.revenue.online ?? 0,
    selectedValue: selectedYearMetrics?.revenue.online ?? 1,
  });

  // yearly -> unitsSold

  // yearly -> unitsSold -> total
  const yearUnitsSoldTotalCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Total",
    kind: "year",
    prevValue: prevYearMetrics?.unitsSold.total ?? 0,
    selectedValue: selectedYearMetrics?.unitsSold.total ?? 1,
  });

  // yearly -> unitsSold -> inStore
  const yearUnitsSoldInStoreCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "In-Store",
    kind: "year",
    prevValue: prevYearMetrics?.unitsSold.inStore ?? 0,
    selectedValue: selectedYearMetrics?.unitsSold.inStore ?? 1,
  });

  // yearly -> unitsSold -> online
  const yearUnitsSoldOnlineCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Online",
    kind: "year",
    prevValue: prevYearMetrics?.unitsSold.online ?? 0,
    selectedValue: selectedYearMetrics?.unitsSold.online ?? 1,
  });

  return {
    dailyCards: {
      revenue: [
        dayRevenueTotalCardInfo,
        dayRevenueInStoreCardInfo,
        dayRevenueOnlineCardInfo,
      ],
      unitsSold: [
        dayUnitsSoldTotalCardInfo,
        dayUnitsSoldInStoreCardInfo,
        dayUnitsSoldOnlineCardInfo,
      ],
    },
    monthlyCards: {
      revenue: [
        monthRevenueTotalCardInfo,
        monthRevenueInStoreCardInfo,
        monthRevenueOnlineCardInfo,
      ],
      unitsSold: [
        monthUnitsSoldTotalCardInfo,
        monthUnitsSoldInStoreCardInfo,
        monthUnitsSoldOnlineCardInfo,
      ],
    },
    yearlyCards: {
      revenue: [
        yearRevenueTotalCardInfo,
        yearRevenueInStoreCardInfo,
        yearRevenueOnlineCardInfo,
      ],
      unitsSold: [
        yearUnitsSoldTotalCardInfo,
        yearUnitsSoldInStoreCardInfo,
        yearUnitsSoldOnlineCardInfo,
      ],
    },
  };
}

type ReturnRepairMetricsCardsInput = {
  greenColorShade: string;
  padding: MantineNumberSize;
  redColorShade: string;
  selectedDateRepairMetrics: SelectedDateRepairMetrics;
  width: number;
};

type RepairMetricsCards = {
  dailyCards: DashboardCardInfo[];
  monthlyCards: DashboardCardInfo[];
  yearlyCards: DashboardCardInfo[];
};

function returnRepairMetricsCards({
  greenColorShade,
  padding,
  redColorShade,
  selectedDateRepairMetrics,
  width,
}: ReturnRepairMetricsCardsInput) {
  // repair metrics data
  const {
    dayRepairMetrics: { prevDayMetrics, selectedDayMetrics },
    monthRepairMetrics: { prevMonthMetrics, selectedMonthMetrics },
    yearRepairMetrics: { prevYearMetrics, selectedYearMetrics },
  } = selectedDateRepairMetrics;

  const currentYear = selectedYearMetrics?.year ?? "2023";
  const prevYear = prevYearMetrics?.year ?? "2022";
  const currentMonth = selectedMonthMetrics?.month ?? "January";
  const prevMonth = prevMonthMetrics?.month ?? "January";
  const prevDay = prevDayMetrics?.day ?? "01";

  const DASHBOARD_CARD_INFO_INPUT_TEMPLATE: CreateDashboardMetricsCardsInput = {
    currentMonth,
    currentYear,
    greenColorShade,
    heading: "Revenue",
    kind: "day",
    padding,
    prevDay,
    prevMonth,
    prevValue: 1,
    prevYear,
    redColorShade,
    selectedValue: 1,
    width,
  };

  // daily

  // daily -> revenue
  const dayRevenueCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    isDisplayValueAsCurrency: true,
    prevValue: prevDayMetrics?.revenue ?? 0,
    selectedValue: selectedDayMetrics?.revenue ?? 1,
  });

  // daily -> units repaired
  const dayUnitsRepairedCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Units Repaired",
    prevValue: prevDayMetrics?.unitsRepaired ?? 0,
    selectedValue: selectedDayMetrics?.unitsRepaired ?? 1,
  });

  // monthly

  // monthly -> revenue
  const monthRevenueCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    kind: "month",
    isDisplayValueAsCurrency: true,
    prevValue: prevMonthMetrics?.revenue ?? 0,
    selectedValue: selectedMonthMetrics?.revenue ?? 1,
  });

  // monthly -> units repaired
  const monthUnitsRepairedCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Units Repaired",
    kind: "month",
    prevValue: prevMonthMetrics?.unitsRepaired ?? 0,
    selectedValue: selectedMonthMetrics?.unitsRepaired ?? 1,
  });

  // yearly

  // yearly -> revenue
  const yearRevenueCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    kind: "year",
    isDisplayValueAsCurrency: true,
    prevValue: prevYearMetrics?.revenue ?? 0,
    selectedValue: selectedYearMetrics?.revenue ?? 1,
  });

  // yearly -> units repaired
  const yearUnitsRepairedCardInfo = createDashboardMetricsCards({
    ...DASHBOARD_CARD_INFO_INPUT_TEMPLATE,
    heading: "Units Repaired",
    kind: "year",
    prevValue: prevYearMetrics?.unitsRepaired ?? 0,
    selectedValue: selectedYearMetrics?.unitsRepaired ?? 1,
  });

  return {
    dailyCards: [dayRevenueCardInfo, dayUnitsRepairedCardInfo],
    monthlyCards: [monthRevenueCardInfo, monthUnitsRepairedCardInfo],
    yearlyCards: [yearRevenueCardInfo, yearUnitsRepairedCardInfo],
  };
}
 */
