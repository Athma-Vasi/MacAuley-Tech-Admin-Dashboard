import {
  Box,
  Card,
  Center,
  Flex,
  Group,
  Loader,
  PasswordInput,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { TbCheck } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { COLORS_SWATCHES } from "../../constants";
import { useMountedRef } from "../../hooks";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import { UserDocument } from "../../types";
import { returnThemeColors } from "../../utils";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import CustomerMetricsWorker from "../dashboard/customer/metricsWorker?worker";
import FinancialMetricsWorker from "../dashboard/financial/metricsWorker?worker";
import ProductMetricsWorker from "../dashboard/product/metricsWorker?worker";
import RepairMetricsWorker from "../dashboard/repair/metricsWorker?worker";
import { loginAction } from "./actions";
import { MessageEventLoginFetchWorkerToMain } from "./fetchWorker";
import LoginFetchWorker from "./fetchWorker?worker";
import {
  handleLoginClick,
  handleMessageEventLoginFetchWorkerToMain,
} from "./handlers";
import { loginReducer } from "./reducers";
import { initialLoginState } from "./state";

function Login() {
  const [loginState, loginDispatch] = useReducer(
    loginReducer,
    initialLoginState,
  );
  const {
    customerMetricsWorker,
    errorMessage,
    financialMetricsWorker,
    isLoading,
    isSubmitting,
    isSuccessful,
    loginFetchWorker,
    password,
    productMetricsGenerated,
    productMetricsWorker,
    repairMetricsGenerated,
    repairMetricsWorker,
    username,
  } = loginState;

  const { authDispatch } = useAuth();
  const {
    globalState: { themeObject },
    globalDispatch,
  } = useGlobalState();
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();
  const isComponentMountedRef = useMountedRef();

  const usernameRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  useEffect(() => {
    // (async function wrapper() {
    //   const businessMetrics = await createRandomBusinessMetrics({
    //     daysPerMonth: DAYS_PER_MONTH,
    //     months: MONTHS,
    //     productCategories: PRODUCT_CATEGORIES,
    //     repairCategories: REPAIR_CATEGORIES,
    //     storeLocations: STORE_LOCATIONS.map((location) => location.value),
    //   });

    // })();
  }, []);

  useEffect(() => {
    const newCustomerMetricsWorker = new CustomerMetricsWorker();
    loginDispatch({
      action: loginAction.setCustomerMetricsWorker,
      payload: newCustomerMetricsWorker,
    });
    newCustomerMetricsWorker.onmessage = async (
      event: MessageEvent,
    ) => {
      if (event.data.err || event.data.val.none) {
        console.error("Error in customer metrics worker:", event.data);
        return;
      }

      console.log("Customer metrics worker data:", event.data.val.val);
    };

    const newProductMetricsWorker = new ProductMetricsWorker();
    loginDispatch({
      action: loginAction.setProductMetricsWorker,
      payload: newProductMetricsWorker,
    });
    newProductMetricsWorker.onmessage = async (
      event: MessageEvent,
    ) => {
      if (event.data.err || event.data.val.none) {
        console.error("Error in product metrics worker:", event.data);
        return;
      }

      loginDispatch({
        action: loginAction.setProductMetricsGenerated,
        payload: event.data.val.val,
      });
      console.log("Product metrics worker data:", event.data.val.val);
    };

    const newRepairMetricsWorker = new RepairMetricsWorker();
    loginDispatch({
      action: loginAction.setRepairMetricsWorker,
      payload: newRepairMetricsWorker,
    });
    newRepairMetricsWorker.onmessage = async (
      event: MessageEvent,
    ) => {
      if (event.data.err || event.data.val.none) {
        console.error("Error in repair metrics worker:", event.data);
        return;
      }

      loginDispatch({
        action: loginAction.setRepairMetricsGenerated,
        payload: event.data.val.val,
      });
      console.log("Repair metrics worker data:", event.data.val.val);
    };

    const newFinancialMetricsWorker = new FinancialMetricsWorker();
    loginDispatch({
      action: loginAction.setFinancialMetricsWorker,
      payload: newFinancialMetricsWorker,
    });
    newFinancialMetricsWorker.onmessage = async (
      event: MessageEvent,
    ) => {
      if (event.data.err || event.data.val.none) {
        console.error("Error in financial metrics worker:", event.data);
        return;
      }

      console.log("Financial metrics worker data:", event.data.val.val);
    };

    return () => {
      isComponentMountedRef.current = false;
      newCustomerMetricsWorker.terminate();
      newFinancialMetricsWorker.terminate();
      newProductMetricsWorker.terminate();
      newRepairMetricsWorker.terminate();
    };
  }, []);

  useEffect(() => {
    if (!customerMetricsWorker) {
      return;
    }

    customerMetricsWorker.postMessage(true);
  }, [customerMetricsWorker]);

  useEffect(() => {
    if (!productMetricsWorker) {
      return;
    }

    productMetricsWorker.postMessage(true);
  }, [productMetricsWorker]);

  useEffect(() => {
    if (!repairMetricsWorker) {
      return;
    }

    repairMetricsWorker.postMessage(true);
  }, [repairMetricsWorker]);

  useEffect(() => {
    if (
      !financialMetricsWorker || !productMetricsGenerated ||
      !repairMetricsGenerated
    ) {
      return;
    }

    financialMetricsWorker.postMessage(true);
  }, [financialMetricsWorker, productMetricsGenerated, repairMetricsGenerated]);

  useEffect(() => {
    const newLoginFetchWorker = new LoginFetchWorker();

    loginDispatch({
      action: loginAction.setLoginFetchWorker,
      payload: newLoginFetchWorker,
    });

    newLoginFetchWorker.onmessage = async (
      event: MessageEventLoginFetchWorkerToMain<
        UserDocument
      >,
    ) => {
      await handleMessageEventLoginFetchWorkerToMain({
        event,
        authDispatch,
        globalDispatch,
        isComponentMountedRef,
        loginDispatch,
        navigate,
        showBoundary,
      });
    };

    return () => {
      newLoginFetchWorker.terminate();
      isComponentMountedRef.current = false;
    };
  }, []);

  const usernameTextInput = (
    <TextInput
      className="accessible-input"
      data-testid="username-textInput"
      label="Username"
      placeholder="Enter your username"
      value={username}
      onChange={(event) => {
        loginDispatch({
          action: loginAction.setUsername,
          payload: event.currentTarget.value,
        });
        loginDispatch({
          action: loginAction.setErrorMessage,
          payload: "",
        });
      }}
      ref={usernameRef}
      required
    />
  );

  const passwordTextInput = (
    <PasswordInput
      className="accessible-input"
      data-testid="password-textInput"
      label="Password"
      placeholder="Enter your password"
      value={password}
      onChange={(event) => {
        loginDispatch({
          action: loginAction.setPassword,
          payload: event.currentTarget.value,
        });
        loginDispatch({
          action: loginAction.setErrorMessage,
          payload: "",
        });
      }}
      required
    />
  );

  const { redColorShade, bgGradient, themeColorShade } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const loginButton = (
    <AccessibleButton
      attributes={{
        dataTestId: "login-button",
        kind: "submit",
        leftIcon: isSubmitting
          ? (
            <Loader
              size="xs"
              color={themeObject.colorScheme === "light" ? "white" : ""}
            />
          )
          : isSuccessful
          ? (
            <TbCheck
              color={themeObject.colorScheme === "light" ? "white" : ""}
            />
          )
          : null,
        name: "login",
        onClick: async (
          event:
            | React.MouseEvent<HTMLButtonElement, MouseEvent>
            | React.PointerEvent<HTMLButtonElement>,
        ) => {
          event.preventDefault();

          await handleLoginClick({
            isComponentMountedRef,
            isLoading,
            isSubmitting,
            isSuccessful,
            loginDispatch,
            loginFetchWorker,
            schema: { username, password },
            showBoundary,
          });
        },
      }}
    />
  );

  const displayTitle = (
    <Group w="100%" position="apart">
      <Group align="flex-start">
        {/* {logo} */}
        <Title order={1} style={{ letterSpacing: "0.30rem" }}>
          MACAULEY
        </Title>

        <Title pl="md" order={1} style={{ letterSpacing: "0.30rem" }}>
          TECH
        </Title>
      </Group>

      <Text size="lg" color="dark">Dashboard</Text>
    </Group>
  );

  const displayInputs = (
    <Stack align="center" w="100%">
      {usernameTextInput}
      {passwordTextInput}
    </Stack>
  );

  const displayLoginButton = (
    <Center>
      {loginButton}
    </Center>
  );

  const displayLinkToRegister = (
    <Flex align="center" justify="center" columnGap="sm">
      <Text>Don&apos;t have an account?</Text>
      <Text>
        <Link
          to="/register"
          style={{ color: themeColorShade }}
          data-testid="register-link"
        >
          Create one!
        </Link>
      </Text>
    </Flex>
  );

  const errorMessageElem = errorMessage
    ? (
      <Text
        color={redColorShade}
        data-testid="login-error-message"
        truncate
        w="100%"
        pl="md"
      >
        Invalid credentials
      </Text>
    )
    : null;

  const card = (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      className="login-card"
    >
      <Title order={2}>Sign in</Title>
      <Text size="sm" color="dimmed">
        to continue to MacAuley Tech Dashboard
      </Text>

      {displayInputs}
      {errorMessageElem}

      <Group w="100%" position="center">{displayLoginButton}</Group>
      <Group w="100%" position="center">{displayLinkToRegister}</Group>
    </Card>
  );

  const login = (
    <Box
      bg={bgGradient}
      className="login-container"
    >
      {displayTitle}

      {Array.from(
        { length: 3 },
        (_, idx) => <Space h="xl" key={`space-${idx}`} />,
      )}
      {card}
    </Box>
  );

  return login;
}

export default Login;
