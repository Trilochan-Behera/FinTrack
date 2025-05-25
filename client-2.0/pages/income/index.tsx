import DashboardLayout from "@pages/DashboardLayout";
import ChartDonut from "@src/components/Charts/ChartDonut";
import ChartMonthly from "@src/components/Charts/ChartMonthly";
import { SortableTable } from "@src/components/DataTable";
import Forms from "@src/components/Forms";
import TableWithIcon from "@src/components/Tables/TableWithIcon";
import { header } from "@src/util/Data";
import { useState } from "react";

export default function Income() {
    const [IsApiCall, setIsApiCall] = useState(false);
    return (
        <DashboardLayout>
            <ChartMonthly title={"Monthly Incomes"} category="income" barColor={["#22B3FF"]} IsApiCall={IsApiCall} />
            <ChartDonut title={"Category Wise"} category="income" IsApiCall={IsApiCall} />
            <div className="col-span-12 rounded-sm shadow-default">
                    <SortableTable type="income" />
                  </div>
        </DashboardLayout>
    )
}