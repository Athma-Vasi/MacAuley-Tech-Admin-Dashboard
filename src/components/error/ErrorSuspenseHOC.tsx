import { Loader } from "@mantine/core";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";

function ErrorSuspenseHOC<P extends Record<string | symbol | number, unknown>>(
  Component: React.ComponentType<P>,
) {
  return function ErrorSuspenseHOC(props: P) {
    return (
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={(details) => {
          console.group("onReset triggered");
          console.log({ details });
          console.groupEnd();
        }}
        onError={(error, info) => {
          console.group("onError triggered");
          console.log({ error });
          console.log({ info });
          console.groupEnd();
        }}
      >
        <Suspense fallback={<Loader />}>
          <Component {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}

export default ErrorSuspenseHOC;
