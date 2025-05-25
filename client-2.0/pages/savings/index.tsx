import DashboardLayout from "@pages/DashboardLayout";
import ChartDonut from "@src/components/Charts/ChartDonut";
import ChartMonthly from "@src/components/Charts/ChartMonthly";
import { SortableTable } from "@src/components/DataTable";
import Forms from "@src/components/Forms";
import TableWithIcon from "@src/components/Tables/TableWithIcon";
import { header } from "@src/util/Data";
import { useState } from "react";

export default function Savings() {
    const [IsApiCall, setIsApiCall] = useState(false);
    return (
        <DashboardLayout>
      <ChartMonthly
        title={"Monthly Expense"}
        category="expense"
        barColor={["#e13d69"]}
        IsApiCall={IsApiCall}
      />
      <ChartDonut
        title={"Category Wise"}
        category="expense"
        IsApiCall={IsApiCall}
      />
      <div className="col-span-12 rounded-sm shadow-default">
        <SortableTable type="savings" />
      </div>
    </DashboardLayout>
    )
}