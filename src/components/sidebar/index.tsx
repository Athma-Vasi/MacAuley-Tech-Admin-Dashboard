import { Flex } from "@mantine/core";
import {
    TbAffiliate,
    TbHome2,
    TbReportMoney,
    TbTools,
    TbUser,
} from "react-icons/tb";
import { AccessibleNavLink } from "../accessibleInputs/AccessibleNavLink";

function Sidebar() {
    const homeNavlink = (
        <AccessibleNavLink
            attributes={{
                description: "Home",
                icon: <TbHome2 />,
                name: "Home",
                onClick: () => console.log("Home clicked"),
            }}
        />
    );

    const productsNavlink = (
        <AccessibleNavLink
            attributes={{
                description: "Products",
                icon: <TbAffiliate />,
                name: "Products",
                onClick: () => console.log("Products clicked"),
            }}
        />
    );

    const financialsNavlink = (
        <AccessibleNavLink
            attributes={{
                description: "Financials",
                icon: <TbReportMoney />,
                name: "Financials",
                onClick: () => console.log("Financials clicked"),
            }}
        />
    );

    const customersNavlink = (
        <AccessibleNavLink
            attributes={{
                description: "Customers",
                icon: <TbUser />,
                name: "Customers",
                onClick: () => console.log("Customers clicked"),
            }}
        />
    );

    const repairsNavlink = (
        <AccessibleNavLink
            attributes={{
                description: "Repairs",
                icon: <TbTools />,
                name: "Repairs",
                onClick: () => console.log("Repairs clicked"),
            }}
        />
    );

    return (
        <Flex
            direction="column"
            gap={10}
            p={20}
            w="100%"
            h="100vh"
        >
            {homeNavlink}
            {productsNavlink}
            {financialsNavlink}
            {customersNavlink}
            {repairsNavlink}
        </Flex>
    );
}

export default Sidebar;
