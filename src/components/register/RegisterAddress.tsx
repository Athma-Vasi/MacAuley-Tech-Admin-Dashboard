import { Card, Text } from "@mantine/core";

import React, { useEffect, useRef } from "react";
import { COUNTRIES, PROVINCES, STATES_US } from "../../constants";
import type {
  CanadianPostalCode,
  Country,
  PostalCode,
  Province,
  StatesUS,
} from "../../types";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { AccessibleTextInput } from "../accessibleInputs/AccessibleTextInput";
import type { RegisterAction } from "./actions";
import { RegisterDispatch } from "./types";

type RegisterAddressProps = {
  addressLine: string;
  city: string;
  country: Country;
  parentAction: RegisterAction;
  parentDispatch: React.Dispatch<RegisterDispatch>;
  postalCodeCanada: CanadianPostalCode;
  postalCodeUS: PostalCode;
  province: Province;
  state: StatesUS;
};

function RegisterAddress({
  addressLine,
  city,
  country,
  parentAction,
  parentDispatch,
  postalCodeCanada,
  postalCodeUS,
  province,
  state,
}: RegisterAddressProps) {
  const addressLineInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    addressLineInputRef.current?.focus();
  }, []);

  const addressLineTextInput = (
    <AccessibleTextInput
      attributes={{
        invalidValueAction: parentAction.setIsError,
        name: "addressLine",
        parentDispatch,
        ref: addressLineInputRef,
        validValueAction: parentAction.setAddressLine,
        value: addressLine,
      }}
    />
  );

  const cityTextInput = (
    <AccessibleTextInput
      attributes={{
        invalidValueAction: parentAction.setIsError,
        name: "city",
        parentDispatch,
        validValueAction: parentAction.setCity,
        value: city,
      }}
    />
  );

  const countrySelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: COUNTRIES,
        name: "country",
        parentDispatch,
        validValueAction: parentAction.setCountry,
        value: country,
      }}
    />
  );

  const provinceOrStateSelectInput = country === "Canada"
    ? (
      <AccessibleSelectInput
        attributes={{
          data: PROVINCES,
          name: "province",
          parentDispatch,
          validValueAction: parentAction.setProvince,
          value: province,
        }}
      />
    )
    : (
      <AccessibleSelectInput
        attributes={{
          data: STATES_US,
          name: "state",
          parentDispatch,
          validValueAction: parentAction.setState,
          value: state,
        }}
      />
    );

  const postalCodeTextInput = country === "Canada"
    ? (
      <AccessibleTextInput
        attributes={{
          invalidValueAction: parentAction.setIsError,
          name: "postalCodeCanada",
          parentDispatch: parentDispatch as any,
          validValueAction: parentAction.setPostalCodeCanada,
          value: postalCodeCanada as CanadianPostalCode,
        }}
      />
    )
    : (
      <AccessibleTextInput
        attributes={{
          invalidValueAction: parentAction.setIsError,
          name: "postalCodeUS",
          parentDispatch,
          validValueAction: parentAction.setPostalCodeUS,
          value: postalCodeUS as PostalCode,
        }}
      />
    );

  return (
    <Card className="register-form-card">
      <Text size={24}>Address</Text>
      {addressLineTextInput}
      {cityTextInput}
      {countrySelectInput}
      {provinceOrStateSelectInput}
      {postalCodeTextInput}
    </Card>
  );
}

export { RegisterAddress };
