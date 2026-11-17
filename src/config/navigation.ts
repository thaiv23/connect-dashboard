import {
  Archive, BadgeCheck, CalendarClock, Copy, Database, Download, Gauge, Globe, Hash, History,
  Languages, LayoutDashboard, Layers, ListChecks, MapPin, Megaphone, MessagesSquare, Radar, Search,
  Settings, Share2, ShieldCheck, Sparkles, Star, Tags, TriangleAlert, Upload, Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  /** Only items with an href are functional. Everything else renders as "coming soon". */
  href?: string;
}

export interface NavGroup {
  label: string;
  /** Module number shown before the label. */
  number?: number;
  items: NavItem[];
}

export const NAVIGATION: NavGroup[] = [
  { label: "OVERVIEW", items: [{ label: "Dashboard Overview", icon: LayoutDashboard, href: "/admin/dashboard" }] },
  {
    label: "STORE DISCOVERY",
    number: 1,
    items: [
      { label: "Store Search", icon: Search },
      { label: "Google Maps Sources", icon: MapPin },
      { label: "Trustpilot Sources", icon: Star },
      { label: "Store Database", icon: Database },
      { label: "Store Qualification", icon: BadgeCheck },
    ],
  },
  {
    label: "BUYER INTENT DISCOVERY",
    number: 2,
    items: [
      { label: "Social Media Search", icon: Share2 },
      { label: "Reddit Monitoring", icon: Radar },
      { label: "Facebook Groups", icon: Users },
      { label: "Local Forums", icon: MessagesSquare },
      { label: "Buyer Intent Database", icon: Archive },
      { label: "Intent Qualification", icon: ListChecks },
    ],
  },
  {
    label: "DATA INTELLIGENCE",
    number: 3,
    items: [
      { label: "AI Classification", icon: Sparkles },
      { label: "Duplicate Detection", icon: Copy },
      { label: "Lead Scoring", icon: Gauge },
      { label: "Country Analytics", icon: Globe },
      { label: "Keyword Intelligence", icon: Hash },
    ],
  },
  {
    label: "AUTOMATION CENTER",
    number: 4,
    items: [
      { label: "Search Campaigns", icon: Megaphone },
      { label: "Collection Jobs", icon: Layers },
      { label: "Schedules", icon: CalendarClock },
      { label: "Workflow History", icon: History },
      { label: "Error Logs", icon: TriangleAlert },
    ],
  },
  {
    label: "DATA MANAGEMENT",
    number: 5,
    items: [
      { label: "All Leads", icon: Users },
      { label: "Export Center", icon: Download },
      { label: "Import Data", icon: Upload },
      { label: "Data Quality", icon: ShieldCheck },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { label: "Countries & Languages", icon: Languages },
      { label: "Search Keywords", icon: Tags },
      { label: "Settings", icon: Settings },
    ],
  },
];
