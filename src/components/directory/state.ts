import { DirectoryState } from "./types";

const initialDirectoryState: DirectoryState = {
  clickedInput: "",
  isLoading: false,
  department: "Executive Management",
  directoryFetchWorker: null,
  orientation: "vertical",
  storeLocation: "Edmonton",
};

export { initialDirectoryState };
