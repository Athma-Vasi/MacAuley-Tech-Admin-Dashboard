import { Prettify } from "../../types";
import { DirectoryState } from "./types";

type DirectoryAction = Prettify<
  {
    [K in keyof DirectoryState as `set${Capitalize<string & K>}`]:
      `set${Capitalize<string & K>}`;
  }
>;

const directoryAction: DirectoryAction = {
  setClickedInput: "setClickedInput",
  setDepartment: "setDepartment",
  setDirectoryFetchWorker: "setDirectoryFetchWorker",
  setIsLoading: "setIsLoading",
  setOrientation: "setOrientation",
  setStoreLocation: "setStoreLocation",
};

export { directoryAction };
export type { DirectoryAction };
