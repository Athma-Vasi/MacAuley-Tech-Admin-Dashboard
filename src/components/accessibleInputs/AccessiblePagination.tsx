import {
    Box,
    Container,
    Pagination,
    type PaginationProps,
} from "@mantine/core";
import type { Dispatch } from "react";
import { useGlobalState } from "../../hooks";
import { createAccessiblePaginationTextElement } from "./utils";

type AccessiblePaginationAttributes<SetPageNumber extends string = string> =
    & PaginationProps
    & {
        name: string;
        value: number;
        parentDispatch: Dispatch<{ action: SetPageNumber; payload: number }>;
        setPageNumber: SetPageNumber;
    };

type AccessiblePaginationProps<SetPageNumber extends string = string> = {
    attributes: AccessiblePaginationAttributes<SetPageNumber>;
    key?: string;
};

function AccessiblePagination<SetPageNumber extends string = string>({
    attributes,
    key,
}: AccessiblePaginationProps<SetPageNumber>): React.JSX.Element {
    const { name, parentDispatch, setPageNumber, total, value } = attributes;

    const {
        globalState: { themeObject },
    } = useGlobalState();

    const { screenreaderTextElement } = createAccessiblePaginationTextElement({
        currentPage: value,
        name,
        themeObject,
        totalPages: total,
    });

    return (
        <Container w="100%" key={`${name}-${key ?? ""}`}>
            <Pagination
                {...attributes}
                onChange={(page) =>
                    parentDispatch({ action: setPageNumber, payload: page })}
            />

            <Box
                style={
                    // This is an invisible element that is used to provide screen reader users with additional information
                    // @see https://webaim.org/techniques/css/invisiblecontent/
                    {
                        height: "1px",
                        left: "-9999px",
                        position: "absolute",
                        top: "auto",
                        width: "1px",
                    }
                }
            >
                {screenreaderTextElement}
            </Box>
        </Container>
    );
}

export default AccessiblePagination;
