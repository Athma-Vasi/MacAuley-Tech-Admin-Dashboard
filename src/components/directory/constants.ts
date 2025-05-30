import { Orientation } from "react-d3-tree";
import { CheckboxRadioSelectData, Department } from "../../types";
import { DepartmentsWithDefaultKey } from "./types";

const DEPARTMENTS_DATA: CheckboxRadioSelectData<Department> = [
  { value: "Executive Management", label: "Executive Management" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "Store Administration", label: "Store Administration" },
  { value: "Office Administration", label: "Office Administration" },
  { value: "Accounting", label: "Accounting" },
  { value: "Sales", label: "Sales" },
  { value: "Marketing", label: "Marketing" },
  { value: "Information Technology", label: "Information Technology" },
  { value: "Repair Technicians", label: "Repair Technicians" },
  { value: "Field Service Technicians", label: "Field Service Technicians" },
  { value: "Logistics and Inventory", label: "Logistics and Inventory" },
  { value: "Customer Service", label: "Customer Service" },
  { value: "Maintenance", label: "Maintenance" },
];

const ALL_DEPARTMENTS_DATA: CheckboxRadioSelectData<DepartmentsWithDefaultKey> =
  [
    { label: "All Departments", value: "All Departments" },
    ...DEPARTMENTS_DATA,
  ];

const ORIENTATIONS_DATA: CheckboxRadioSelectData<Orientation> = [
  { label: "Horizontal", value: "horizontal" },
  { label: "Vertical", value: "vertical" },
];

export { ALL_DEPARTMENTS_DATA, DEPARTMENTS_DATA, ORIENTATIONS_DATA };
