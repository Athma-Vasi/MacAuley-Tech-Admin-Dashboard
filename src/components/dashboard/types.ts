import type { StoreLocation } from "../../types";
import type { DashboardAction } from "./actions";

type DashboardCalendarView = "Daily" | "Monthly" | "Yearly";
type DashboardMetricsView = "Financials" | "Customers" | "Products" | "Repairs";
type DashboardFinancialMetric =
  | "Expenses"
  | "Profit"
  | "Revenue"
  | "Transactions"
  | "Other Metrics";
type DashboardCustomerMetric =
  | "Overview"
  | "New"
  | "Returning"
  | "Other Metrics";
type DashboardProductMetric = ProductCategory | "All Products";
type DashboardRepairMetric = RepairCategory | "All Repairs";

type DashboardState = {
  businessMetrics: BusinessMetric[];
  calendarView: DashboardCalendarView;
  customerMetric: DashboardCustomerMetric;
  financialMetric: DashboardFinancialMetric;
  metricsView: DashboardMetricsView;
  productMetric: DashboardProductMetric;
  repairMetric: DashboardRepairMetric;
  selectedYYYYMMDD: string;
  storeLocationView: BusinessMetricStoreLocation;
  isLoading: boolean;
  loadingMessage: string;
};

type DashboardDispatch =
  | {
    action: DashboardAction["setBusinessMetrics"];
    payload: BusinessMetric[];
  }
  | {
    action: DashboardAction["setCalendarView"];
    payload: DashboardCalendarView;
  }
  | {
    action: DashboardAction["setCustomerMetric"];
    payload: DashboardCustomerMetric;
  }
  | {
    action: DashboardAction["setFinancialMetric"];
    payload: DashboardFinancialMetric;
  }
  | {
    action: DashboardAction["setMetricsView"];
    payload: DashboardMetricsView;
  }
  | {
    action: DashboardAction["setProductMetric"];
    payload: DashboardProductMetric;
  }
  | {
    action: DashboardAction["setRepairMetric"];
    payload: DashboardRepairMetric;
  }
  | {
    action: DashboardAction["setStoreLocationView"];
    payload: BusinessMetricStoreLocation;
  }
  | {
    action: DashboardAction["setSelectedYYYYMMDD"];
    payload: string;
  }
  | {
    action: DashboardAction["setIsLoading"];
    payload: boolean;
  }
  | {
    action: DashboardAction["setLoadingMessage"];
    payload: string;
  };

type Month =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

type Year =
  | "2013"
  | "2014"
  | "2015"
  | "2016"
  | "2017"
  | "2018"
  | "2019"
  | "2020"
  | "2021"
  | "2022"
  | "2023";

type DaysInMonthsInYears = Map<Year, Map<Month, string[]>>;

type ProductCategory =
  | "Accessory"
  | "Central Processing Unit (CPU)"
  | "Computer Case"
  | "Desktop Computer"
  | "Display"
  | "Graphics Processing Unit (GPU)"
  | "Headphone"
  | "Keyboard"
  | "Memory (RAM)"
  | "Microphone"
  | "Motherboard"
  | "Mouse"
  | "Power Supply Unit (PSU)"
  | "Speaker"
  | "Storage"
  | "Webcam";

type RepairCategory =
  | "Computer Component"
  | "Peripheral"
  | "Electronic Device"
  | "Mobile Device"
  | "Audio/Video"
  | "Accessory";

type LocationYearSpread = Record<
  StoreLocation,
  Record<string, [number, number]>
>;

type FinancialMetricCategory = {
  total: number;
  repair: number;
  sales: {
    total: number;
    inStore: number;
    online: number;
  };
};

type YearlyFinancialMetric = {
  year: Year;
  averageOrderValue: number;
  conversionRate: number;
  netProfitMargin: number;

  expenses: FinancialMetricCategory;
  profit: FinancialMetricCategory;
  revenue: FinancialMetricCategory;
  transactions: FinancialMetricCategory;

  monthlyMetrics: MonthlyFinancialMetric[];
};

type MonthlyFinancialMetric = {
  month: Month;
  averageOrderValue: number;
  conversionRate: number;
  netProfitMargin: number;

  expenses: FinancialMetricCategory;
  profit: FinancialMetricCategory;
  revenue: FinancialMetricCategory;
  transactions: FinancialMetricCategory;

  dailyMetrics: DailyFinancialMetric[];
};

type DailyFinancialMetric = {
  day: string;
  averageOrderValue: number;
  conversionRate: number;
  netProfitMargin: number;

  expenses: FinancialMetricCategory;
  profit: FinancialMetricCategory;
  revenue: FinancialMetricCategory;
  transactions: FinancialMetricCategory;
};

type CustomerMetrics = {
  totalCustomers: number;
  lifetimeValue: number;

  yearlyMetrics: CustomerYearlyMetric[];
};

type CustomerYearlyMetric = {
  year: Year;
  customers: {
    total: number;
    new: CustomerMetricCategory;
    returning: CustomerMetricCategory;
    churnRate: number;
    retentionRate: number;
  };
  monthlyMetrics: CustomerMonthlyMetric[];
};

type CustomerMetricCategory = {
  total: number;
  sales: {
    total: number;
    online: number;
    inStore: number;
  };
  repair: number;
};

type CustomerMonthlyMetric = {
  month: Month;
  customers: {
    total: number;
    new: CustomerMetricCategory;
    returning: CustomerMetricCategory;
    churnRate: number;
    retentionRate: number;
  };
  dailyMetrics: CustomerDailyMetric[];
};

type CustomerDailyMetric = {
  day: string;
  customers: {
    total: number;
    new: CustomerMetricCategory;
    returning: CustomerMetricCategory;
    churnRate: number;
    retentionRate: number;
  };
};

type ProductMetric = {
  name: ProductCategory | "All Products";
  yearlyMetrics: ProductYearlyMetric[];
};

type ProductMetricCategory = {
  total: number;
  online: number;
  inStore: number;
};

type ProductYearlyMetric = {
  year: Year;
  revenue: ProductMetricCategory;
  unitsSold: ProductMetricCategory;

  monthlyMetrics: ProductMonthlyMetric[];
};

type ProductMonthlyMetric = {
  month: Month;
  revenue: ProductMetricCategory;
  unitsSold: ProductMetricCategory;

  dailyMetrics: ProductDailyMetric[];
};

type ProductDailyMetric = {
  day: string;
  revenue: ProductMetricCategory;
  unitsSold: ProductMetricCategory;
};

type RepairMetric = {
  name: RepairCategory | "All Repairs";
  yearlyMetrics: RepairYearlyMetric[];
};

type RepairYearlyMetric = {
  year: Year;
  revenue: number;
  unitsRepaired: number;

  monthlyMetrics: RepairMonthlyMetric[];
};

type RepairMonthlyMetric = {
  month: Month;
  revenue: number;
  unitsRepaired: number;

  dailyMetrics: RepairDailyMetric[];
};

type RepairDailyMetric = {
  day: string;
  revenue: number;
  unitsRepaired: number;
};

type BusinessMetricStoreLocation = "All Locations" | StoreLocation;

type BusinessMetric = {
  storeLocation: BusinessMetricStoreLocation;
  customerMetrics: CustomerMetrics;
  financialMetrics: YearlyFinancialMetric[];
  productMetrics: ProductMetric[];
  repairMetrics: RepairMetric[];
};

export type {
  BusinessMetric,
  BusinessMetricStoreLocation,
  CustomerDailyMetric,
  CustomerMetrics,
  CustomerMonthlyMetric,
  CustomerYearlyMetric,
  DailyFinancialMetric,
  DashboardAction,
  DashboardCalendarView,
  DashboardCustomerMetric,
  DashboardDispatch,
  DashboardFinancialMetric,
  DashboardMetricsView,
  DashboardProductMetric,
  DashboardRepairMetric,
  DashboardState,
  DaysInMonthsInYears,
  FinancialMetricCategory,
  LocationYearSpread,
  Month,
  MonthlyFinancialMetric,
  ProductCategory,
  ProductDailyMetric,
  ProductMetric,
  ProductMonthlyMetric,
  ProductYearlyMetric,
  RepairCategory,
  RepairDailyMetric,
  RepairMetric,
  RepairMonthlyMetric,
  RepairYearlyMetric,
  Year,
  YearlyFinancialMetric,
};
