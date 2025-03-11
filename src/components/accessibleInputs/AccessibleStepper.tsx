import {
  Group,
  type MantineSize,
  Space,
  Stack,
  Stepper,
  Text,
  Title,
} from "@mantine/core";
import { type ReactNode, useState } from "react";
import { TbCheck, TbX } from "react-icons/tb";

import { COLORS_SWATCHES } from "../../constants/data";
import { useGlobalState } from "../../hooks";
import type { SetPageInErrorPayload, StepperPage } from "../../types";
import { returnThemeColors } from "../../utils";
import { FormReviewStep } from "../formReview/FormReview";
import { useStyles } from "../styles";
import { createAccessibleButtons } from "./utils";

type AccessibleStepperAttributes<InvalidValueAction extends string = string> = {
  allowNextStepsSelect?: boolean;
  componentState: Record<string, unknown>;
  displayReviewPage?: boolean;
  displaySubmitPage?: boolean;
  invalidValueAction: InvalidValueAction;
  onPreviousClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onNextClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  pageElements: React.JSX.Element[];
  parentDispatch: React.Dispatch<{
    action: InvalidValueAction;
    payload: SetPageInErrorPayload;
  }>;
  stepsInError?: Set<number>;
  size?: MantineSize;
  stepperPages: StepperPage[];
  submitButton?: JSX.Element;
  title?: ReactNode;
};

type AccessibleStepperProps<InvalidValueAction extends string = string> = {
  attributes: AccessibleStepperAttributes<InvalidValueAction>;
};

function AccessibleStepper<InvalidValueAction extends string = string>({
  attributes,
}: AccessibleStepperProps<InvalidValueAction>) {
  const {
    allowNextStepsSelect,
    componentState,
    displayReviewPage = true,
    displaySubmitPage = true,
    invalidValueAction,
    onNextClick,
    onPreviousClick,
    pageElements,
    parentDispatch,
    stepsInError = new Set<number>(),
    size = "md",
    stepperPages,
    submitButton = null,
    title,
  } = attributes;

  const {
    globalState: { themeObject },
  } = useGlobalState();

  const { classes } = useStyles({});

  const [activeStep, setActiveStep] = useState(0);

  const maxStep = stepperPages.length;

  const [backButton, nextButton] = createAccessibleButtons([
    {
      disabledScreenreaderText: "You are on the first step",
      enabledScreenreaderText: `Go back to ${
        stepperPages[activeStep - 1]?.description ?? "the beginning"
      }`,
      disabled: activeStep === 0,
      kind: "previous",
      name: "Back",
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        setActiveStep(activeStep <= maxStep ? activeStep - 1 : activeStep);
        verifyEmptyInputs({
          componentState,
          invalidValueAction,
          parentDispatch,
          stepperPages,
        });
        onPreviousClick?.(event);
      },
    },
    {
      enabledScreenreaderText: `Go to ${
        stepperPages[activeStep + 1]?.description ?? "the end"
      }`,
      disabledScreenreaderText: "You are on the last step",
      disabled: displaySubmitPage
        ? activeStep === maxStep
        : activeStep === maxStep - 1,
      kind: "next",
      name: "Next",
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        setActiveStep(activeStep < maxStep + 1 ? activeStep + 1 : activeStep);
        verifyEmptyInputs({
          componentState,
          invalidValueAction,
          parentDispatch,
          stepperPages,
        });
        onNextClick?.(event);
      },
    },
  ]);

  const screenreaderText = `You are at ${
    activeStep === 0
      ? "the first step"
      : activeStep < maxStep + 1
      ? "the last step"
      : `step: ${activeStep + 1}`
  }`;

  const {
    generalColors: {
      grayColorShade,
      redColorShade,
      textColor,
      greenColorShade,
    },
  } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const formReviewPage = displayReviewPage
    ? (
      <FormReviewStep
        componentState={componentState}
        stepperPages={stepperPages}
      />
    )
    : (
      void 0
    );

  const pages = formReviewPage
    ? [...pageElements, formReviewPage]
    : pageElements;

  const stepperSteps = pages.map(function pageMapper(elements, pageIndex) {
    const page = stepperPages[pageIndex];

    const descriptionColor = page?.preventErrorStateDisplay
      ? textColor
      : stepsInError.has(pageIndex)
      ? redColorShade
      : textColor;

    const description = (
      <Text color={descriptionColor}>
        {page?.kind === "review"
          ? page?.description ?? "Review your changes"
          : page?.description}
      </Text>
    );

    const completedIcon = page?.preventErrorStateDisplay
      ? <Text color="white">{`${pageIndex + 1}`}</Text>
      : stepsInError.has(pageIndex)
      ? <TbX size={26} />
      : <TbCheck size={26} />;

    const stepColor = page?.preventErrorStateDisplay
      ? grayColorShade
      : stepsInError.has(pageIndex)
      ? redColorShade
      : greenColorShade;

    return (
      <Stepper.Step
        aria-label={screenreaderText}
        color={stepColor}
        completedIcon={completedIcon}
        description={description}
        key={`step-${pageIndex.toString()}`}
      >
        {elements ?? null}
      </Stepper.Step>
    );
  });

  const stepper = (
    <Stepper
      active={activeStep}
      allowNextStepsSelect={allowNextStepsSelect}
      breakpoint={"sm"}
      size={size}
    >
      {stepperSteps}

      <Space h="sm" />
      {displaySubmitPage
        ? (
          <Stepper.Completed>
            <Text>Stepper completed</Text>
            {submitButton}
          </Stepper.Completed>
        )
        : null}
    </Stepper>
  );

  return (
    <div className={classes.container}>
      <Stack>
        {title ? <Title order={4}>{title}</Title> : null}
        {stepper}
        <Group w="100%" position="apart">
          {backButton}
          {nextButton}
        </Group>
      </Stack>
    </div>
  );
}

function verifyEmptyInputs<InvalidValueAction extends string = string>({
  invalidValueAction,
  parentDispatch,
  stepperPages,
  componentState,
}: {
  componentState: Record<string, unknown>;
  invalidValueAction: InvalidValueAction;
  parentDispatch: React.Dispatch<{
    action: InvalidValueAction;
    payload: SetPageInErrorPayload;
  }>;
  stepperPages: StepperPage[];
}) {
  stepperPages.forEach((page, pageIndex) => {
    const { children, kind } = page;

    if (kind && kind === "review") {
      return;
    }

    children.forEach((child) => {
      const { name: childName, isRequired } = child;

      Object.entries(componentState).forEach(([stateKey, stateValue]) => {
        if (childName !== stateKey) {
          return;
        }

        // input is empty and is required
        if (stateValue === "" && isRequired === undefined) {
          //
          parentDispatch({
            action: invalidValueAction,
            payload: { kind: "add", page: pageIndex },
          });
        }
      });
    });
  });
}

export { AccessibleStepper };
