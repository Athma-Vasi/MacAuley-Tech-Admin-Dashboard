import { StoreLocation } from "../../../types";
import { MONTHS } from "../constants";
import { BusinessMetric, BusinessMetricStoreLocation } from "../types";

function returnDailyOverviewCustomerMetrics(
    businessMetrics: BusinessMetric[],
    storeLocationView: BusinessMetricStoreLocation,
    selectedYYYYMMDD: string,
) {
    const defaultValue = {
        newOverview: {
            lifetimeValue: 0,
            totalCustomers: 0,
            dailyNewCustomers: 0,
        },
        returningOverview: {
            lifetimeValue: 0,
            totalCustomers: 0,
            dailyReturningCustomers: 0,
        },
        churnOverview: {
            dailyChurnRate: 0,
            dailyRetentionRate: 0,
        },
    };

    const [year, month, day] = selectedYYYYMMDD.split("-") as [
        string,
        string,
        string,
    ];
    const customerMetrics = businessMetrics.find(
        (bmetric) => bmetric.storeLocation === storeLocationView,
    )?.customerMetrics;
    if (!customerMetrics) {
        return defaultValue;
    }

    defaultValue.newOverview.lifetimeValue = customerMetrics.lifetimeValue;
    defaultValue.newOverview.totalCustomers = customerMetrics.totalCustomers;
    defaultValue.returningOverview.lifetimeValue =
        customerMetrics.lifetimeValue;
    defaultValue.returningOverview.totalCustomers =
        customerMetrics.totalCustomers;

    const yearlyMetrics = customerMetrics.yearlyMetrics.find((customerMetric) =>
        customerMetric.year === year
    );
    if (!yearlyMetrics) {
        return defaultValue;
    }

    const monthlyMetrics = yearlyMetrics.monthlyMetrics.find((monthlyMetric) =>
        monthlyMetric.month === (MONTHS[Number(month) - 1].toString())
    );
    if (!monthlyMetrics) {
        return defaultValue;
    }

    const dailyMetrics = monthlyMetrics.dailyMetrics.find((dailyMetric) =>
        dailyMetric.day === day
    );
    if (!dailyMetrics) {
        return defaultValue;
    }

    defaultValue.newOverview.dailyNewCustomers =
        dailyMetrics.customers.new.total;
    defaultValue.returningOverview.dailyReturningCustomers =
        dailyMetrics.customers.returning.total;
    defaultValue.churnOverview.dailyChurnRate =
        dailyMetrics.customers.churnRate;
    defaultValue.churnOverview.dailyRetentionRate =
        dailyMetrics.customers.retentionRate;

    return defaultValue;
}

export { returnDailyOverviewCustomerMetrics };
