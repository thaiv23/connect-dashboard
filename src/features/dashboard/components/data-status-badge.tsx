import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { DataStatus } from "../types";

export function DataStatusBadge({ status }: { status: DataStatus }) {
  if (status === "live") {
    return (
      <Badge variant="success">
        <span className="size-1.5 rounded-full bg-current" aria-hidden />
        Live data
      </Badge>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="warning" className="h-9 cursor-default gap-2 px-3 text-[13px]">
          <span className="size-1.5 rounded-full bg-current" aria-hidden />
          Demo Data
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="bottom">Simulated figures. No database, API or collection engine is connected.</TooltipContent>
    </Tooltip>
  );
}
