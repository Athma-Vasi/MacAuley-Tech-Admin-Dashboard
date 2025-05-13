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
  function helper(
    result: Array<D3TreeInput>,
    currNode: D3TreeInput | undefined,
    isFound: boolean,
  ): Array<D3TreeInput> {
    if (!currNode || isFound) {
      return result;
    }

    const node = d3Tree.find((node) => node.attributes.orgId === orgId);
    if (!node) {
      return result;
    }

    const children = node.children;
    if (!children || children.length === 0) {
      return result;
    }

    return node.attributes.orgId === orgId
      ? helper(children, node, true)
      : helper(result, currNode, isFound);
  }

  return helper([], d3Tree[0], false);
}

export { buildD3Tree, returnD3TreeChildren };
export type { D3TreeInput };
