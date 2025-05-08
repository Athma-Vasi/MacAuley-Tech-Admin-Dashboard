import {
  DecodedToken,
  FinancialMetricsDocument,
  HttpServerResponse,
  SafeBoxResult,
  UserDocument,
} from "../../types";

type LoginState = {
  isLoading: boolean;
  isSubmitting: boolean;
  isSuccessful: boolean;
  fetchParseWorker: Worker | null;
  password: string;
  username: string;
};

type LoginMessageEvent = MessageEvent<
  SafeBoxResult<
    {
      parsedServerResponse: HttpServerResponse<
        {
          userDocument: UserDocument;
          financialMetricsDocument: FinancialMetricsDocument;
        }
      >;
      decodedToken: DecodedToken;
    }
  >
>;

export type { LoginMessageEvent, LoginState };
