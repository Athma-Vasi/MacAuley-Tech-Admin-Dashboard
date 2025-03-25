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
  children,
  columns = 50,
  isReversed = false,
  leftSpan = 19,
  rightSpan = 31,
  style,
  ...props
}: GoldenGridProps) {
  return (
    <Grid
      columns={columns}
      style={style}
      {...props}
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
