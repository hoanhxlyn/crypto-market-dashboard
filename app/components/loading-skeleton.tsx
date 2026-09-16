import { Grid, Skeleton } from "@mantine/core";

const SKELETON_IDS = Array.from({ length: 20 }, (_, i) => `skeleton-${i}`);

export function LoadingSkeleton() {
  return (
    <Grid>
      {SKELETON_IDS.map((id) => (
        <Grid.Col key={id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
          <Skeleton height={80} radius="md" />
        </Grid.Col>
      ))}
    </Grid>
  );
}
