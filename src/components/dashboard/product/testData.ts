import { AllStoreLocations } from "../types";
import { ProductMetricCategory } from "./types";

const PRODUCT_METRICS_TEST_INPUT: Array<
    {
        productMetricCategory: ProductMetricCategory;
        storeLocation: AllStoreLocations;
    }
> = [
    {
        productMetricCategory: "Accessory",
        storeLocation: "All Locations",
    },
    {
        productMetricCategory: "Accessory",
        storeLocation: "Edmonton",
    },
    {
        productMetricCategory: "Accessory",
        storeLocation: "Calgary",
    },
    {
        productMetricCategory: "Accessory",
        storeLocation: "Vancouver",
    },

    {
        productMetricCategory: "All Products",
        storeLocation: "All Locations",
    },
    {
        productMetricCategory: "All Products",
        storeLocation: "Edmonton",
    },
    {
        productMetricCategory: "All Products",
        storeLocation: "Calgary",
    },
    {
        productMetricCategory: "All Products",
        storeLocation: "Vancouver",
    },

    {
        productMetricCategory: "Central Processing Unit (CPU)",
        storeLocation: "All Locations",
    },
    {
        productMetricCategory: "Central Processing Unit (CPU)",
        storeLocation: "Edmonton",
    },
    {
        productMetricCategory: "Central Processing Unit (CPU)",
        storeLocation: "Calgary",
    },
    {
        productMetricCategory: "Central Processing Unit (CPU)",
        storeLocation: "Vancouver",
    },

    {
        productMetricCategory: "Computer Case",
        storeLocation: "All Locations",
    },
    {
        productMetricCategory: "Computer Case",
        storeLocation: "Edmonton",
    },
    {
        productMetricCategory: "Computer Case",
        storeLocation: "Calgary",
    },
    {
        productMetricCategory: "Computer Case",
        storeLocation: "Vancouver",
    },

    {
        productMetricCategory: "Desktop Computer",
        storeLocation: "All Locations",
    },
    {
        productMetricCategory: "Desktop Computer",
        storeLocation: "Edmonton",
    },
    {
        productMetricCategory: "Desktop Computer",
        storeLocation: "Calgary",
    },
    {
        productMetricCategory: "Desktop Computer",
        storeLocation: "Vancouver",
    },

    {
        productMetricCategory: "Display",
        storeLocation: "All Locations",
    },
    {
        productMetricCategory: "Display",
        storeLocation: "Edmonton",
    },
    {
        productMetricCategory: "Display",
        storeLocation: "Calgary",
    },
    {
        productMetricCategory: "Display",
        storeLocation: "Vancouver",
    },

    {
        productMetricCategory: "Graphics Processing Unit (GPU)",
        storeLocation: "All Locations",
    },
    {
        productMetricCategory: "Graphics Processing Unit (GPU)",
        storeLocation: "Edmonton",
    },
    {
        productMetricCategory: "Graphics Processing Unit (GPU)",
        storeLocation: "Calgary",
    },
    {
        productMetricCategory: "Graphics Processing Unit (GPU)",
        storeLocation: "Vancouver",
    },

    {
        productMetricCategory: "Headphone",
        storeLocation: "All Locations",
    },
    {
        productMetricCategory: "Headphone",
        storeLocation: "Edmonton",
    },
    {
        productMetricCategory: "Headphone",
        storeLocation: "Calgary",
    },
    {
        productMetricCategory: "Headphone",
        storeLocation: "Vancouver",
    },

    {
        productMetricCategory: "Keyboard",
        storeLocation: "All Locations",
    },
    {
        productMetricCategory: "Keyboard",
        storeLocation: "Edmonton",
    },
    {
        productMetricCategory: "Keyboard",
        storeLocation: "Calgary",
    },
    {
        productMetricCategory: "Keyboard",
        storeLocation: "Vancouver",
    },

    {
        productMetricCategory: "Memory (RAM)",
        storeLocation: "All Locations",
    },
    {
        productMetricCategory: "Memory (RAM)",
        storeLocation: "Edmonton",
    },
    {
        productMetricCategory: "Memory (RAM)",
        storeLocation: "Calgary",
    },
    {
        productMetricCategory: "Memory (RAM)",
        storeLocation: "Vancouver",
    },

    {
        productMetricCategory: "Microphone",
        storeLocation: "All Locations",
    },
    {
        productMetricCategory: "Microphone",
        storeLocation: "Edmonton",
    },
    {
        productMetricCategory: "Microphone",
        storeLocation: "Calgary",
    },
    {
        productMetricCategory: "Microphone",
        storeLocation: "Vancouver",
    },

    {
        productMetricCategory: "Motherboard",
        storeLocation: "All Locations",
    },
    {
        productMetricCategory: "Motherboard",
        storeLocation: "Edmonton",
    },
    {
        productMetricCategory: "Motherboard",
        storeLocation: "Calgary",
    },
    {
        productMetricCategory: "Motherboard",
        storeLocation: "Vancouver",
    },

    {
        productMetricCategory: "Mouse",
        storeLocation: "All Locations",
    },
    {
        productMetricCategory: "Mouse",
        storeLocation: "Edmonton",
    },
    {
        productMetricCategory: "Mouse",
        storeLocation: "Calgary",
    },
    {
        productMetricCategory: "Mouse",
        storeLocation: "Vancouver",
    },

    {
        productMetricCategory: "Power Supply Unit (PSU)",
        storeLocation: "All Locations",
    },
    {
        productMetricCategory: "Power Supply Unit (PSU)",
        storeLocation: "Edmonton",
    },
    {
        productMetricCategory: "Power Supply Unit (PSU)",
        storeLocation: "Calgary",
    },
    {
        productMetricCategory: "Power Supply Unit (PSU)",
        storeLocation: "Vancouver",
    },

    {
        productMetricCategory: "Power Supply Unit (PSU)",
        storeLocation: "All Locations",
    },
    {
        productMetricCategory: "Power Supply Unit (PSU)",
        storeLocation: "Edmonton",
    },
    {
        productMetricCategory: "Power Supply Unit (PSU)",
        storeLocation: "Calgary",
    },
    {
        productMetricCategory: "Power Supply Unit (PSU)",
        storeLocation: "Vancouver",
    },

    {
        productMetricCategory: "Speaker",
        storeLocation: "All Locations",
    },
    {
        productMetricCategory: "Speaker",
        storeLocation: "Edmonton",
    },
    {
        productMetricCategory: "Speaker",
        storeLocation: "Calgary",
    },
    {
        productMetricCategory: "Speaker",
        storeLocation: "Vancouver",
    },

    {
        productMetricCategory: "Storage",
        storeLocation: "All Locations",
    },
    {
        productMetricCategory: "Storage",
        storeLocation: "Edmonton",
    },
    {
        productMetricCategory: "Storage",
        storeLocation: "Calgary",
    },
    {
        productMetricCategory: "Storage",
        storeLocation: "Vancouver",
    },

    {
        productMetricCategory: "Webcam",
        storeLocation: "All Locations",
    },
    {
        productMetricCategory: "Webcam",
        storeLocation: "Edmonton",
    },
    {
        productMetricCategory: "Webcam",
        storeLocation: "Calgary",
    },
    {
        productMetricCategory: "Webcam",
        storeLocation: "Vancouver",
    },
];

export { PRODUCT_METRICS_TEST_INPUT };
