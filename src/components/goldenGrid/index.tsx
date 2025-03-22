import { Grid, GridProps } from "@mantine/core";

type GoldenGridProps = GridProps & {
    /** must be a tuple: [left side, right side] */
    children: [React.ReactNode, React.ReactNode];
    columns?: number;
    isReversed?: boolean;
    leftSpan?: number;
    rightSpan?: number;
    style?: React.CSSProperties;
};

function GoldenGrid({
    align,
    children,
    columns = 50,
    grow,
    gutter,
    gutterLg,
    gutterMd,
    gutterSm,
    gutterXl,
    gutterXs,
    isReversed = false,
    justify,
    leftSpan = 19,
    rightSpan = 31,
    style,
}: GoldenGridProps) {
    return (
        <Grid
            align={align}
            columns={columns}
            grow={grow}
            gutter={gutter}
            gutterLg={gutterLg}
            gutterMd={gutterMd}
            gutterSm={gutterSm}
            gutterXl={gutterXl}
            gutterXs={gutterXs}
            justify={justify}
            style={style}
        >
            <Grid.Col span={isReversed ? rightSpan : leftSpan}>
                {children[0]}
            </Grid.Col>
            <Grid.Col span={isReversed ? leftSpan : rightSpan}>
                {children[1]}
            </Grid.Col>
        </Grid>
    );
}

export { GoldenGrid };
