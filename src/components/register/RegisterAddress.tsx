import { Stack } from "@mantine/core";

import { COUNTRIES_DATA, PROVINCES, STATES_US } from "../../constants/data";
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

/**
 * // used to validate address line on every change
  useEffect(() => {
    const isValidAddress = ADDRESS_LINE_REGEX.test(addressLine);

({
      type: parentAction.setIsValidAddressLine,
      payload: isValidAddress,
    });
  }, [addressLine, parentAction.setIsValidAddressLine]);

  // used to validate city on every change
  useEffect(() => {
    const isValidPlace = CITY_REGEX.test(city);

({
      type: parentAction.setIsValidCity,
      payload: isValidPlace,
    });
  }, [city, parentAction.setIsValidCity]);

  // // resets address if country is changed
  // useEffect(() => {
  // ({
  //     type: parentAction.setAddressLine,
  //     payload: '',
  //   });
  // ({
  //     type: parentAction.setCity,
  //     payload: '',
  //   });
  // ({
  //     type: parentAction.setPostalCode,
  //     payload: '',
  //   });
  // }, [
  //   country,
  //   parentAction.setAddressLine,
  //   parentAction.setCity,
  //   parentAction.setPostalCode,
  // ,
  // ]);

  // used to validate contact number on every change
  useEffect(() => {
    const isValidContact = PHONE_NUMBER_REGEX.test(contactNumber);

    const contactLength = contactNumber.length;
    if (isContactNumberFocused) {
      switch (contactLength) {
        case 4: {
      ({
            type: parentAction.setContactNumber,
            payload: `${contactNumber}(`,
          });
          break;
        }
        case 8: {
      ({
            type: parentAction.setContactNumber,
            payload: `${contactNumber}) `,
          });
          break;
        }
        case 13: {
      ({
            type: parentAction.setContactNumber,
            payload: `${contactNumber}-`,
          });
          break;
        }

        default:
          break;
      }
    }

({
      type: parentAction.setIsValidContactNumber,
      payload: isValidContact,
    });
  }, [
    contactNumber,
    isContactNumberFocused,
    parentAction.setContactNumber,
    parentAction.setIsValidContactNumber,
,
  ]);

  // used to validate postal code on every change
  useEffect(() => {
    const isValidPostal =
      country === "Canada"
        ? POSTAL_CODE_REGEX_CANADA.test(postalCode)
        : POSTAL_CODE_REGEX_US.test(postalCode);

    if (country === "Canada") {
      const postalCodeLength = postalCode.length;
      if (postalCodeLength === 3) {
    ({
          type: parentAction.setPostalCode,
          payload: `${postalCode} `,
        });
      } else if (postalCodeLength === 7) {
    ({
          type: parentAction.setPostalCode,
          payload: postalCode.trim(),
        });
      }
    } else {
      const postalCodeLength = postalCode.length;
      if (postalCodeLength === 6) {
    ({
          type: parentAction.setPostalCode,
          payload: `${postalCode.slice(0, 5)}-${postalCode.slice(5)}`,
        });
      }
    }

({
      type: parentAction.setIsValidPostalCode,
      payload: isValidPostal,
    });
  }, [
    postalCode,
    country,
,
    parentAction.setIsValidPostalCode,
    parentAction.setPostalCode,
  ]);

  // update the corresponding pagesInError state if any of the inputs are in error
  useEffect(() => {
    const isStepInError =
      !isValidAddressLine || !isValidCity || !isValidPostalCode || !isValidContactNumber;

({
      type: parentAction.setPageInError,
      payload: {
        kind: isStepInError ? "add" : "delete",
        step: 2,
      },
    });
  }, [
    isValidAddressLine,
    isValidCity,
    isValidPostalCode,
    isValidContactNumber,
,
    parentAction.setPageInError,
  ]);

  // following are the accessible text elements for screen readers to read out based on the state of the input
  const [addressLineInputErrorText, addressLineInputValidText] =
    AccessibleErrorValidTextElements({
      inputElementKind: "address line",
      inputText: addressLine,
      isValidInputText: isValidAddressLine,
      isInputTextFocused: isAddressLineFocused,
      regexValidationText: returnAddressValidationText({
        content: addressLine,
        contentKind: "address line",
        minLength: 2,
        maxLength: 75,
      }),
    });

  const [cityInputErrorText, cityInputValidText] = AccessibleErrorValidTextElements({
    inputElementKind: "city",
    inputText: city,
    isValidInputText: isValidCity,
    isInputTextFocused: isCityFocused,
    regexValidationText: returnCityValidationText({
      content: city,
      contentKind: "city",
      minLength: 2,
      maxLength: 75,
    }),
  });

  const [postalCodeInputErrorText, postalCodeInputValidText] =
    AccessibleErrorValidTextElements({
      inputElementKind: "postal code",
      inputText: postalCode,
      isValidInputText: isValidPostalCode,
      isInputTextFocused: isPostalCodeFocused,
      regexValidationText: returnPostalCodeValidationText({
        postalCode,
        country,
      }),
    });

  const [contactNumberInputErrorText, contactNumberInputValidText] =
    AccessibleErrorValidTextElements({
      inputElementKind: "contact number",
      inputText: contactNumber,
      isValidInputText: isValidContactNumber,
      isInputTextFocused: isContactNumberFocused,
      regexValidationText: returnPhoneNumberValidationText({
        content: contactNumber,
        contentKind: "contact number",
      }),
    });

  const contactNumberPhoneInputCreatorInfo: AccessiblePhoneNumberTextInputCreatorInfo = {
    description: {
      error: contactNumberInputErrorText,
      valid: contactNumberInputValidText,
    },
    inputText: contactNumber,
    isValidInputText: isValidContactNumber,
    label: "Contact number",
    onBlur: () => {
  ({
        type: parentAction.setIsContactNumberFocused,
        payload: false,
      });
    },
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
  ({
        type: parentAction.setContactNumber,
        payload: event.currentTarget.value,
      });
    },
    onFocus: () => {
  ({
        type: parentAction.setIsContactNumberFocused,
        payload: true,
      });
    },
    placeholder: "Enter your contact number",
    required: true,
    rightSection: true,
    rightSectionOnClick: () => {
  ({
        type: parentAction.setContactNumber,
        payload: "+(1)",
      });
    },
    withAsterisk: true,
    semanticName: "contact number",
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace") {
        if (contactNumber.length === 14 || contactNumber.length === 9) {
      ({
            type: parentAction.setContactNumber,
            payload: contactNumber.slice(0, -1),
          });
        }
      }
    },
  };

  const countrySelectInputCreatorInfo: AccessibleSelectInputCreatorInfo = {
    description: "Select your country",
    label: "Country",
    onChange: (event: ChangeEvent<HTMLSelectElement>) => {
  ({
        type: parentAction.setCountry,
        payload: event.currentTarget.value as Country,
      });
    },
    data: COUNTRIES_DATA,
    value: country,
    required: true,
    withAsterisk: true,
  };

  const addressLineTextInputCreatorInfo: AccessibleTextInputCreatorInfo = {
    description: {
      error: addressLineInputErrorText,
      valid: addressLineInputValidText,
    },
    inputText: addressLine,
    isValidInputText: isValidAddressLine,
    label: "Address line",
    onBlur: () => {
  ({
        type: parentAction.setIsAddressLineFocused,
        payload: false,
      });
    },
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
  ({
        type: parentAction.setAddressLine,
        payload: event.currentTarget.value,
      });
    },
    onFocus: () => {
  ({
        type: parentAction.setIsAddressLineFocused,
        payload: true,
      });
    },
    placeholder: "Enter your address",
    required: true,
    withAsterisk: true,
    semanticName: "address line",
  };

  const cityTextInputCreatorInfo: AccessibleTextInputCreatorInfo = {
    description: {
      error: cityInputErrorText,
      valid: cityInputValidText,
    },
    inputText: city,
    isValidInputText: isValidCity,
    label: "City",
    onBlur: () => {
  ({
        type: parentAction.setIsCityFocused,
        payload: false,
      });
    },
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
  ({
        type: parentAction.setCity,
        payload: event.currentTarget.value,
      });
    },
    onFocus: () => {
  ({
        type: parentAction.setIsCityFocused,
        payload: true,
      });
    },
    placeholder: "Enter your city",
    required: true,
    withAsterisk: true,
    semanticName: "city",

    minLength: 2,
    maxLength: 75,
  };

  const provinceOrStateSelectInputCreatorInfo: AccessibleSelectInputCreatorInfo = {
    data: country === "Canada" ? PROVINCES : STATES_US,
    description: country === "Canada" ? "Select your province" : "Select your state",
    label: country === "Canada" ? "Province" : "State",
    value: country === "Canada" ? province : state,
    onChange: (event: ChangeEvent<HTMLSelectElement>) => {
      country === "Canada"
        ({
            type: parentAction.setProvince,
            payload: event.currentTarget.value as Province,
          })
        ({
            type: parentAction.setState,
            payload: event.currentTarget.value as StatesUS,
          });
    },
  };

  const zipOrPostalCodeTextInputCreatorInfo: AccessibleTextInputCreatorInfo = {
    description: {
      error: postalCodeInputErrorText,
      valid: postalCodeInputValidText,
    },
    inputText: postalCode,
    isValidInputText: isValidPostalCode,
    label: country === "Canada" ? "Postal code" : "Zip code",
    maxLength: country === "Canada" ? 7 : 10,
    minLength: country === "Canada" ? 6 : 5,
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
  ({
        type: parentAction.setPostalCode,
        payload:
          country === "Canada"
            ? event.currentTarget.value.toUpperCase()
            : event.currentTarget.value,
      });
    },
    onBlur: () => {
  ({
        type: parentAction.setIsPostalCodeFocused,
        payload: false,
      });
    },
    onFocus: () => {
  ({
        type: parentAction.setIsPostalCodeFocused,
        payload: true,
      });
    },
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      switch (country) {
        case "Canada": {
          if (event.key === "Backspace" && postalCode.length === 4) {
        ({
              type: parentAction.setPostalCode,
              payload: postalCode.slice(0, 3),
            });
          }
          break;
        }
        case "United States": {
          if (event.key === "Backspace" && postalCode.length === 7) {
        ({
              type: parentAction.setPostalCode,
              payload: postalCode.slice(0, 6),
            });
          }
          break;
        }
        default:
          break;
      }
    },
    placeholder:
      country === "Canada" ? "Enter Canadian postal code" : "Enter US postal code",
    required: true,
    semanticName: "postal code",
  };

  // following are the created accessible input elements
  const [
    createdAddressLineTextInput,
    createdCityTextInput,
    createdZipOrPostalCodeTextInput,
  ] = returnAccessibleTextInputElements([
    addressLineTextInputCreatorInfo,
    cityTextInputCreatorInfo,
    zipOrPostalCodeTextInputCreatorInfo,
  ]);

  const [createdContactNumberTextInput] = returnAccessiblePhoneNumberTextInputElements([
    contactNumberPhoneInputCreatorInfo,
  ]);

  const [createdCountrySelectInput, createdProvinceOrStateSelectInput] =
    returnAccessibleSelectInputElements([
      countrySelectInputCreatorInfo,
      provinceOrStateSelectInputCreatorInfo,
    ]);

  const displayRegisterAddress = (
    <FormLayoutWrapper>
      {createdContactNumberTextInput}
      {createdCountrySelectInput}
      {createdAddressLineTextInput}
      {createdCityTextInput}
      {createdProvinceOrStateSelectInput}
      {createdZipOrPostalCodeTextInput}
    </FormLayoutWrapper>
  );

  return <>{displayRegisterAddress}</>;

 */
