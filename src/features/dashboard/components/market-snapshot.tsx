import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/format";
import { CountryTag, DashboardCard } from "./dashboard-card";
import { COUNTRY_CODES } from "../constants";
import type { CountryLeadStats } from "../types";

export function MarketSnapshot({ countries }: { countries: CountryLeadStats[] }) {
  const totals = countries.reduce(
    (acc, c) => ({
      store: acc.store + c.storeLeads,
      intent: acc.intent + c.buyerIntentLeads,
      qualified: acc.qualified + c.qualifiedLeads,
    }),
    { store: 0, intent: 0, qualified: 0 },
  );

  return (
    <DashboardCard
      title="Market Snapshot"
      description="Target countries compared, ranked by total leads"
      className="h-full"
      contentClassName="px-0 pb-2 pt-3"
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-5">Country</TableHead>
            <TableHead className="px-2 text-right">Store</TableHead>
            <TableHead className="px-2 text-right">Intent</TableHead>
            <TableHead className="pl-2 pr-5 text-right">Qualified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {countries.map((c) => (
            <TableRow key={c.country}>
              <TableCell className="py-2.5 pl-5">
                <span className="flex items-center gap-2">
                  <CountryTag code={COUNTRY_CODES[c.country]} />
                  <span className="font-medium">{c.country}</span>
                </span>
              </TableCell>
              <TableCell className="px-2 py-2.5 text-right tabular-nums">{formatNumber(c.storeLeads)}</TableCell>
              <TableCell className="px-2 py-2.5 text-right tabular-nums">{formatNumber(c.buyerIntentLeads)}</TableCell>
              <TableCell className="py-2.5 pl-2 pr-5 text-right font-medium tabular-nums">{formatNumber(c.qualifiedLeads)}</TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-muted/50 font-semibold hover:bg-muted/50">
            <TableCell className="py-2.5 pl-5">All markets</TableCell>
            <TableCell className="px-2 py-2.5 text-right tabular-nums">{formatNumber(totals.store)}</TableCell>
            <TableCell className="px-2 py-2.5 text-right tabular-nums">{formatNumber(totals.intent)}</TableCell>
            <TableCell className="py-2.5 pl-2 pr-5 text-right tabular-nums">{formatNumber(totals.qualified)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </DashboardCard>
  );
}
