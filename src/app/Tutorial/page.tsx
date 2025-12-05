import { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "catatin.ai | Tutorial",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
