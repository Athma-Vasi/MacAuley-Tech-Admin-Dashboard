import { Grid } from "@mantine/core";

function GoldenGrid({
  children,
  columns = 50,
  isReversed = false,
  leftSpan = 19,
  rightSpan = 31,
  style,
}: {
  /** must be a tuple: [left side, right side] */
  children: [React.ReactNode, React.ReactNode];
  columns?: number;
  isReversed?: boolean;
  leftSpan?: number;
  rightSpan?: number;
  style?: React.CSSProperties;
}) {
  return (
    <Grid columns={columns} style={style}>
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
