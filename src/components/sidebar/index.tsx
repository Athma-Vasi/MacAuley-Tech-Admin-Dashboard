import { Flex } from "@mantine/core";
import {
  TbAffiliate,
  TbHome2,
  TbReportMoney,
  TbTools,
  TbUser,
} from "react-icons/tb";
import { AccessibleNavLink } from "../accessibleInputs/AccessibleNavLink";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const homeNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Home",
        icon: <TbHome2 />,
        name: "Home",
        onClick: () => navigate("/"),
      }}
    />
  );

  const productsNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Products",
        icon: <TbAffiliate />,
        name: "Products",
        onClick: () => navigate("/products"),
      }}
    />
  );

  const financialsNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Financials",
        icon: <TbReportMoney />,
        name: "Financials",
        onClick: () => navigate("/financials"),
      }}
    />
  );

  const customersNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Customers",
        icon: <TbUser />,
        name: "Customers",
        onClick: () => navigate("/customers"),
      }}
    />
  );

  const repairsNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Repairs",
        icon: <TbTools />,
        name: "Repairs",
        onClick: () => navigate("/repairs"),
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
