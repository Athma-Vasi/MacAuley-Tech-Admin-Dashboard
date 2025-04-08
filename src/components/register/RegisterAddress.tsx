import { Stack } from "@mantine/core";

import React from "react";
import { COUNTRIES, PROVINCES, STATES_US } from "../../constants";
import type { Country, PostalCode, Province, StatesUS } from "../../types";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { AccessibleTextInput } from "../accessibleInputs/text/AccessibleTextInput";
import type { RegisterAction } from "./actions";
import { RegisterDispatch } from "./types";

type RegisterAddressProps = {
  addressLine: string;
  city: string;
  province: Province;
  state: StatesUS;
  postalCode: PostalCode;
  country: Country;
  parentAction: RegisterAction;
  parentDispatch: React.Dispatch<RegisterDispatch>;
};

function RegisterAddress({
  addressLine,
  city,
  country,
  parentAction,
  parentDispatch,
  postalCode,
  province,
  state,
}: RegisterAddressProps) {
  const addressLineTextInput = (
    <AccessibleTextInput
      attributes={{
        invalidValueAction: parentAction.setIsError,
        name: "addressLine",
        parentDispatch,
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
    <AccessibleSelectInput<RegisterAction["setCountry"], Country>
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
      <AccessibleSelectInput<RegisterAction["setProvince"], Province>
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
      <AccessibleSelectInput<RegisterAction["setState"], StatesUS>
        attributes={{
          data: STATES_US,
          name: "state",
          parentDispatch,
          validValueAction: parentAction.setState,
          value: state,
        }}
      />
    );

  const postalCodeTextInput = (
    <AccessibleTextInput
      attributes={{
        invalidValueAction: parentAction.setIsError,
        name: country === "Canada" ? "postalCodeCanada" : "postalCodeUS",
        parentDispatch,
        validValueAction: parentAction.setPostalCode,
        value: postalCode,
      }}
    />
  );

  return (
    <Stack>
      {countrySelectInput}
      {addressLineTextInput}
      {cityTextInput}
      {provinceOrStateSelectInput}
      {postalCodeTextInput}
    </Stack>
  );
}

export { RegisterAddress };
