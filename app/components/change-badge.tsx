import type { BadgeProps } from "@mantine/core";
import { Badge } from "@mantine/core";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

type ChangeBadgeProps = Omit<BadgeProps, "children"> & {
  change: number | null | undefined;
};

export function ChangeBadge({ change, ...props }: ChangeBadgeProps) {
  const positive = (change ?? 0) >= 0;

  return (
    <Badge
      color={positive ? "green" : "red"}
      variant="light"
      leftSection={
        positive ? <IconTrendingUp size={14} /> : <IconTrendingDown size={14} />
      }
      {...props}
    >
      {Math.abs(change ?? 0).toFixed(2)}%
    </Badge>
  );
}
