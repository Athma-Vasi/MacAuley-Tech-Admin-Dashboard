import { MONTHS } from "../constants";
import { BusinessMetric, BusinessMetricStoreLocation } from "../types";

function returnSelectedDateAllProductsMetrics(
    businessMetrics: BusinessMetric[],
    storeLocationView: BusinessMetricStoreLocation,
    selectedYYYYMMDD: string,
) {
    const defaultValue = {
        dailyRevenue: 0,
        dailyUnitsSold: 0,
    };

    const [year, month, day] = selectedYYYYMMDD.split("-") as [
        string,
        string,
        string,
    ];
    const productMetrics = businessMetrics.find(
        (bmetric) => bmetric.storeLocation === storeLocationView,
    )?.productMetrics;

    if (!productMetrics) {
        return defaultValue;
    }

    const allProductsYearlyMetrics = productMetrics.find(
        (productMetric) => productMetric.name === "All Products",
    );

    console.log({ allProductsYearlyMetrics });

    if (!allProductsYearlyMetrics) {
        return defaultValue;
    }

    const allProductsDailyMetrics = allProductsYearlyMetrics.yearlyMetrics.find(
        (yearlyMetric) => yearlyMetric.year === year,
    )?.monthlyMetrics.find((monthlyMetric) =>
        monthlyMetric.month === (MONTHS[Number(month) - 1].toString())
    )
        ?.dailyMetrics.find((dailyMetric) => dailyMetric.day === day);

    if (!allProductsDailyMetrics) {
        return defaultValue;
    }

    return {
        ...defaultValue,
        dailyRevenue: allProductsDailyMetrics.revenue.total,
        dailyUnitsSold: allProductsDailyMetrics.unitsSold.total,
    };
}

export { returnSelectedDateAllProductsMetrics };
