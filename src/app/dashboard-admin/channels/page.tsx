import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import ChannelClient from "./ChannelClient";

export const metadata: Metadata = {
  title: "catatin.ai | DASHBOARD",
};

export default async function Channels() {


  return (
    <div>
      <PageBreadcrumb pageTitle="Channels" role="admin"  />
        <ChannelClient/>
    </div>
  );
}
