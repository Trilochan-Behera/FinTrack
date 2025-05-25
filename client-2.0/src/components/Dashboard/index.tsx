"use client";
import React, { useState } from "react";
import ChartBar from "../Charts/ChartBar";
import DashboardLayout from "@pages/DashboardLayout";
import TableWithIcon from "../Tables/TableWithIcon";
import Forms from "../Forms";
import { header } from "@src/util/Data";
import DynamicTable from "../Table";
import { SortableTable } from "../DataTable";
import ApexChart from "../BarChart2025";
import ChartDonut from "../Charts/ChartDonut";
import dynamic from "next/dynamic";
import TableLayout from "@pages/TableLayout";
const PieChart = dynamic(() => import("../BarChart2025"), { ssr: false });

const Dashboard: React.FC = () => {
  const [IsApiCall, setIsApiCall] = useState(false);
  return (
    <DashboardLayout>
      <div className="col-span-12 rounded-sm shadow-default">
        <SortableTable />
      </div>
      <TableLayout>
        <ChartBar
          title={"Total Report"}
          barColor={["#27C190", "#e13d69", "#22B3FF"]}
        />
      </TableLayout>
      <TableLayout>
        <h1>Hello</h1>
        <div className="md:flex  justify-between ">
          <PieChart />
          <PieChart />
          <PieChart />
        </div>
      </TableLayout>
    </DashboardLayout>
  );
};

export default Dashboard;
