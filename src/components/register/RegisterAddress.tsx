import { Stack } from "@mantine/core";

import { COUNTRIES_DATA, PROVINCES, STATES_US } from "../../constants";
import type {
  Country,
  PhoneNumber,
  PostalCode,
  Province,
  StatesUS,
  StepperPage,
} from "../../types";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { AccessibleTextInput } from "../accessibleInputs/text/AccessibleTextInput";
import type { RegisterAction } from "./actions";

type RegisterAddressProps = {
  contactNumber: PhoneNumber;
  addressLine: string;
  city: string;
  province: Province;
  state: StatesUS;
  postalCode: PostalCode;
  country: Country;
  parentAction: RegisterAction;
  parentDispatch: any;
  stepperPages: StepperPage[];
};

function RegisterAddress({
  addressLine,
  city,
  contactNumber,
  country,
  parentAction,
  parentDispatch,
  postalCode,
  province,
  state,
  stepperPages,
}: RegisterAddressProps) {
  const addressLineTextInput = (
    <AccessibleTextInput
      attributes={{
        stepperPages,
        invalidValueAction: parentAction.setPageInError,
        name: "addressLine",
        page: 2,
        parentDispatch,
        validValueAction: parentAction.setAddressLine,
        value: addressLine,
      }}
    />
  );

  const cityTextInput = (
    <AccessibleTextInput
      attributes={{
        stepperPages,
        invalidValueAction: parentAction.setPageInError,
        name: "city",
        page: 2,
        parentDispatch,
        validValueAction: parentAction.setCity,
        value: city,
      }}
    />
  );

  const contactNumberTextInput = (
    <AccessibleTextInput
      attributes={{
        stepperPages,
        invalidValueAction: parentAction.setPageInError,
        name: "contactNumber",
        page: 2,
        parentDispatch,
        validValueAction: parentAction.setContactNumber,
        value: contactNumber,
      }}
    />
  );

  const countrySelectInput = (
    <AccessibleSelectInput<RegisterAction["setCountry"], Country>
      attributes={{
        data: COUNTRIES_DATA,
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
        stepperPages,
        invalidValueAction: parentAction.setPageInError,
        name: "postalCode",
        page: 2,
        parentDispatch,
        validValueAction: parentAction.setPostalCode,
        value: postalCode,
      }}
    />
  );

  return (
    <Stack>
      {countrySelectInput}
      {contactNumberTextInput}
      {addressLineTextInput}
      {cityTextInput}
      {provinceOrStateSelectInput}
      {postalCodeTextInput}
    </Stack>
  );
}

export { RegisterAddress };
