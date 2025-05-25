import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const PieChart = () => {
  const series = [44, 55, 13, 43, 22];

  const options: ApexOptions = {
    chart: {
      width: 380,
      type: "pie",
    },
    labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      
      // formatter: function (seriesName, opts) {
      //   const value = opts.w.globals.series[opts.seriesIndex];
      //   return `${seriesName}: ${value}`;
      // },

    },
    dataLabels: {
      enabled: true,
      // formatter: function (val, opts) {
      //   const name = opts.w.globals.labels[opts.seriesIndex];
      //   const value = opts.w.globals.series[opts.seriesIndex];
      //   return `${name}: ${value}`;
      // },
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return `${val}`;
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div> {/* dark background */}
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series.find((ser) => ser > 0) ? series : [100]}
          type="pie"
        />
      </div>
      <div className="text-center text-danger">Expense</div>
    </div>
  );
};

export default PieChart;
