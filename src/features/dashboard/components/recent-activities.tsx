import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatTimestamp } from "@/lib/format";
import { CountryTag, DashboardCard } from "./dashboard-card";
import { COUNTRY_CODES } from "../constants";
import type { ActivityRecord, ActivityStatus } from "../types";

const STATUS_VARIANT: Record<ActivityStatus, NonNullable<BadgeProps["variant"]>> = {
  Completed: "success",
  "In progress": "info",
  Scheduled: "neutral",
  "Needs review": "warning",
  Failed: "danger",
};

export function RecentActivities({ activities }: { activities: ActivityRecord[] }) {
  return (
    <DashboardCard
      title="Recent Activities"
      description="Illustrative records. No jobs are executing."
      action={<Badge variant="warning">Simulated activity</Badge>}
      contentClassName="px-0 pb-1 pt-3"
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-5">Activity</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pr-5">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="min-w-64 pl-5">
                <p className="font-medium">{row.activity}</p>
                <p className="text-xs text-muted-foreground">{row.id}</p>
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">{row.category}</TableCell>
              <TableCell className="whitespace-nowrap">
                <span className="flex items-center gap-2">
                  <CountryTag code={COUNTRY_CODES[row.country]} />
                  {row.country}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap">{row.source}</TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[row.status]}>
                  <span className="size-1.5 rounded-full bg-current" aria-hidden />
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap pr-5 text-muted-foreground tabular-nums">
                {formatTimestamp(row.timestamp)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardCard>
  );
}
