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
import { RegisterDispatch } from "./schemas";

type RegisterAddressProps = {
  addressLine: string;
  city: string;
  country: Country;
  registerAction: RegisterAction;
  registerDispatch: React.Dispatch<RegisterDispatch>;
  postalCodeCanada: CanadianPostalCode;
  postalCodeUS: PostalCode;
  province: Province;
  state: StatesUS;
};

function RegisterAddress({
  addressLine,
  city,
  country,
  registerAction,
  registerDispatch,
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
        invalidValueAction: registerAction.setIsError,
        name: "addressLine",
        parentDispatch: registerDispatch,
        ref: addressLineInputRef,
        validValueAction: registerAction.setAddressLine,
        value: addressLine,
      }}
    />
  );

  const cityTextInput = (
    <AccessibleTextInput
      attributes={{
        invalidValueAction: registerAction.setIsError,
        name: "city",
        parentDispatch: registerDispatch,
        validValueAction: registerAction.setCity,
        value: city,
      }}
    />
  );

  const countrySelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: COUNTRIES,
        name: "country",
        parentDispatch: registerDispatch,
        validValueAction: registerAction.setCountry,
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
          parentDispatch: registerDispatch,
          validValueAction: registerAction.setProvince,
          value: province,
        }}
      />
    )
    : (
      <AccessibleSelectInput
        attributes={{
          data: STATES_US,
          name: "state",
          parentDispatch: registerDispatch,
          validValueAction: registerAction.setState,
          value: state,
        }}
      />
    );

  const postalCodeTextInput = country === "Canada"
    ? (
      <AccessibleTextInput
        attributes={{
          invalidValueAction: registerAction.setIsError,
          name: "postalCodeCanada",
          parentDispatch: registerDispatch,
          validValueAction: registerAction.setPostalCodeCanada,
          value: postalCodeCanada as CanadianPostalCode,
        }}
      />
    )
    : (
      <AccessibleTextInput
        attributes={{
          invalidValueAction: registerAction.setIsError,
          name: "postalCodeUS",
          parentDispatch: registerDispatch,
          validValueAction: registerAction.setPostalCodeUS,
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
