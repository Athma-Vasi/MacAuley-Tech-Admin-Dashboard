import { EmployeeDoc } from "../directory/data";

type D3TreeInput = {
  attributes: Record<string, string>;
  children: Array<D3TreeInput>;
  name: string;
};
type TreeHelpers = {
  nodeMap: Map<number, D3TreeInput>;
  minOrgId: number;
};

function createTreeHelpers(
  employees: Array<EmployeeDoc>,
  nodeColor: string
): TreeHelpers {
  const initialAcc = {
    nodeMap: new Map<number, D3TreeInput>(),
    minOrgId: Number.MAX_SAFE_INTEGER,
  };

  return employees.reduce<TreeHelpers>((helpersAcc, employee) => {
    const { minOrgId, nodeMap } = helpersAcc;
    const {
      city,
      firstName,
      jobPosition,
      lastName,
      middleName,
      orgId,
      country,
      profilePictureUrl,
    } = employee;
    const name = `${firstName} ${middleName} ${lastName}`;

    const attributes = {
      jobPosition,
      city,
      country,
      nodeColor,
      profilePictureUrl,
    };

    nodeMap.set(orgId, {
      attributes,
      children: [],
      name,
    });

    helpersAcc.minOrgId = Math.min(minOrgId, employee.orgId);

    return helpersAcc;
  }, initialAcc);
}

function buildD3Tree(
  employees: Array<EmployeeDoc>,
  nodeColor: string
): Array<D3TreeInput> {
  const { minOrgId, nodeMap } = createTreeHelpers(employees, nodeColor);

  return employees.reduce<Array<D3TreeInput>>((result, employee) => {
    const { orgId, parentOrgId } = employee;
    const node = nodeMap.get(orgId);
    if (!node) {
      return result;
    }

    parentOrgId === 0 || orgId === minOrgId // root node
      ? result.push(node)
      : nodeMap.get(employee.parentOrgId)?.children.push(node);

    return result;
  }, []);
}

export { buildD3Tree };
export type { D3TreeInput };
