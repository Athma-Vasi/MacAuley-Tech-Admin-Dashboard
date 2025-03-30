const REGISTER_ROLE_ROUTE_PATHS = {
  admin: "/user",
  manager: "/user",
  employee: "/user",
};

const REGISTER_URL = "http://localhost:5000/api/v1/user";

const REGISTER_MAX_STEPPER_POSITION = 5;

export {
  REGISTER_MAX_STEPPER_POSITION,
  REGISTER_ROLE_ROUTE_PATHS,
  REGISTER_URL,
};
