"use client";
import React, { useState } from "react";
import ChartBar from "../Charts/ChartBar";
import DashboardLayout from "@pages/DashboardLayout";
import TableWithIcon from "../Tables/TableWithIcon";
import Forms from "../Forms";
import { header } from "@src/util/Data";
import TableWithoutPagination from "../Tables/TableWithoutPagination";

const Dashboard: React.FC = () => {
  const [IsApiCall, setIsApiCall] = useState(false);
  const yearlyReportHeader = ['Month', 'Opening Bal.', 'Income', 'Savings', 'Emer. Fund', 'Expense', 'Loan Given','Current Bal.']
  return (
    <DashboardLayout IsApiCall={IsApiCall}>
      <ChartBar title={"Total Report"} barColor={["#27C190", '#e13d69', "#22B3FF"]} />
      <div className="col-span-12 rounded-sm shadow-default">
          <Forms  type="all" setIsApiCall={setIsApiCall} />
      </div>
      <div className="col-span-12 rounded-sm shadow-default">
        <TableWithIcon header={header} type="all" IsApiCall={IsApiCall} setIsApiCall={setIsApiCall}/>
      </div>
      
      <div className="col-span-12 rounded-sm shadow-default">
        <TableWithoutPagination header={yearlyReportHeader}  IsApiCall={IsApiCall} setIsApiCall={setIsApiCall}/>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
