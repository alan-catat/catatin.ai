import { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "catatin.ai | DASHBOARD",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
