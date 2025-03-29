import { Stack } from "@mantine/core";
import {
  TbAffiliate,
  TbFileDatabase,
  TbReportMoney,
  TbTools,
  TbUser,
} from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { AccessibleNavLink } from "../accessibleInputs/AccessibleNavLink";

function Sidebar() {
  const navigate = useNavigate();

  // const homeNavlink = (
  //   <AccessibleNavLink
  //     attributes={{
  //       description: "Home",
  //       icon: <TbHome2 />,
  //       name: "Home",
  //       onClick: () => navigate("/"),
  //     }}
  //   />
  // );

  const productsNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Products",
        icon: <TbAffiliate />,
        name: "Products",
        onClick: () => navigate("/dashboard/products"),
      }}
    />
  );

  const financialsNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Financials",
        icon: <TbReportMoney />,
        name: "Financials",
        onClick: () => navigate("/dashboard/financials"),
      }}
    />
  );

  const customersNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Customers",
        icon: <TbUser />,
        name: "Customers",
        onClick: () => navigate("/dashboard/customers"),
      }}
    />
  );

  const repairsNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Repairs",
        icon: <TbTools />,
        name: "Repairs",
        onClick: () => navigate("/dashboard/repairs"),
      }}
    />
  );

  const directoryNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Directory",
        icon: <TbFileDatabase />,
        name: "Directory",
        onClick: () => navigate("/directory"),
      }}
    />
  );

  return (
    <Stack>
      {financialsNavlink}
      {productsNavlink}
      {customersNavlink}
      {repairsNavlink}
      {directoryNavlink}
    </Stack>
  );
}

export default Sidebar;
