import ErrorSuspenseHOC from "../error/ErrorSuspenseHOC";
import UsersQuery from "./UsersQuery";

function UsersQueryWrapper() {
    return ErrorSuspenseHOC(UsersQuery)({});
}

export default UsersQueryWrapper;
