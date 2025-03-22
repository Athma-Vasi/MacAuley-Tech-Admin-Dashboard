import { Stack } from "@mantine/core";
import {
  TbAffiliate,
  TbHome2,
  TbReportMoney,
  TbTools,
  TbUser,
} from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { AccessibleNavLink } from "../accessibleInputs/AccessibleNavLink";

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
    <Stack>
      {homeNavlink}
      {productsNavlink}
      {financialsNavlink}
      {customersNavlink}
      {repairsNavlink}
    </Stack>
  );
}

export default Sidebar;
