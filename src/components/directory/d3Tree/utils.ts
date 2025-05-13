import { UserDocument } from "../../../types";

type D3TreeInput = {
  attributes: Record<string, string | number>;
  children: Array<D3TreeInput>;
  name: string;
};
type TreeHelpers = {
  nodeMap: Map<number, D3TreeInput>;
  minOrgId: number;
};

function createTreeHelpers(
  employees: Array<Omit<UserDocument, "password">>,
  nodeColor: string,
): TreeHelpers {
  const initialAcc = {
    nodeMap: new Map<number, D3TreeInput>(),
    minOrgId: Number.MAX_SAFE_INTEGER,
  };

  return employees.reduce<TreeHelpers>((helpersAcc, employee) => {
    const { minOrgId, nodeMap } = helpersAcc;
    const {
      city,
      department,
      storeLocation,
      firstName,
      jobPosition,
      lastName,
      orgId,
      country,
      profilePictureUrl = "",
      username,
    } = employee;
    const name = `${firstName} ${lastName}`;

    const attributes = {
      department,
      storeLocation,
      jobPosition,
      city,
      country,
      nodeColor,
      orgId,
      profilePictureUrl,
      username,
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
  employees: Array<Omit<UserDocument, "password">>,
  nodeColor: string,
): Array<D3TreeInput> {
  const { minOrgId, nodeMap } = createTreeHelpers(employees, nodeColor);

  return employees.reduce<Array<D3TreeInput>>((result, employee) => {
    const { orgId, parentOrgId } = employee;
    const node = nodeMap.get(orgId);
    if (!node) {
      return result;
    }

    if (parentOrgId === 0 || orgId === minOrgId) { // root node
      result.push(node);
    } else {
      nodeMap.get(employee.parentOrgId)?.children.push(node);
    }

    return result;
  }, []);
}

function returnD3TreeChildren(d3Tree: Array<D3TreeInput>, orgId: number) {
  function traverseTree(
    node: D3TreeInput,
  ): Array<D3TreeInput> {
    if (node.attributes.orgId === orgId) {
      return node.children;
    }

    node.children.forEach((child) => {
      const foundChildren = traverseTree(child);
      if (foundChildren.length) {
        return foundChildren;
      }
    });

    return [];
  }

  return traverseTree(d3Tree[0]);
}

export { buildD3Tree, returnD3TreeChildren };
export type { D3TreeInput };
