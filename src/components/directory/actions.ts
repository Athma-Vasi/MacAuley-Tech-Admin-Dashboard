import { Prettify } from "../../types";
import { DirectoryState } from "./types";

type DirectoryAction = Prettify<
  {
    [K in keyof DirectoryState as `set${Capitalize<string & K>}`]:
      `set${Capitalize<string & K>}`;
  }
>;

const directoryAction: DirectoryAction = {
  setDepartment: "setDepartment",
  setDirectoryFetchWorker: "setDirectoryFetchWorker",
  setOrientation: "setOrientation",
  setStoreLocation: "setStoreLocation",
};

export { directoryAction };
export type { DirectoryAction };
