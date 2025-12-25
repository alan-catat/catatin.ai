import { Metadata } from "next";
import ConvertClient from "./converclient";

export const metadata: Metadata = {
  title: "convertin by catatin.ai",
};

export default function Page() {
  return <ConvertClient />;
}
