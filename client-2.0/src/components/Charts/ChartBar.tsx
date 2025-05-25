"use client";
import moment from "moment";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import { getDataFromAPI, GetDeviceType, getMonth, getSampleArray, getYear } from "@src/services/getAllServices";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartBarState {
  series: {
    name: string;
    data: number[];
  }[];
}
interface ChartBarStatsProps {
  title: string,
  barColor: string[]
}

const ChartBar: React.FC<ChartBarStatsProps> = ({
  title,
  barColor
}) => {
  const yearList = getYear();
  const monthList = getMonth();
  const deviceType = GetDeviceType();
  const [year, setYear] = useState(moment().year());
  const [month, setMonth] = useState(moment().month() + 1);
  const [response, setResponse] = useState() as any
  const [barState, setBarState] = useState<ChartBarState>({
    series: [],
  });


  const options: ApexOptions = {
    colors: barColor,
    chart: {
      fontFamily: "sans-serif",
      type: "bar",
      height: 335,
      width: "100%",
      stacked: false,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },

    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
              columnWidth: "25%",
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: "50%",
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: deviceType != "Mobile" ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] : [moment().month(month - 1).format('MMMM')],
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "sans-serif",
      fontWeight: 500,
      fontSize: "14px",

      markers: {
        radius: 99,
      },
    },
    fill: {
      opacity: 1,
    },
  };
  const setValue = (data: any) => {
    if (data) {
      const dynamicData = JSON.parse(JSON.stringify(data))

      const dataArray = [
        { name: "Income", data: getSampleArray(deviceType != "Mobile" ? 12 : 1) },
        { name: "Expense", data: getSampleArray(deviceType != "Mobile" ? 12 : 1) },
        { name: "Savings", data: getSampleArray(deviceType != "Mobile" ? 12 : 1) },
      ];

      const propertyMap = {
        income: 0, expense: 1, savings: 2
      } as any;

      if (deviceType != "Mobile") {
        dynamicData?.forEach((res: any) => {
          Object.keys(propertyMap).forEach((property) => {
            if (property in res.data && res.data[property]) {
              const dataIndex = propertyMap[property];
              dataArray[dataIndex].data[res.month - 1] = res.data[property];
            }
          });
        });
      } else {
        dynamicData?.forEach((res: any) => {
          if (res.month === month) {
            Object.keys(propertyMap).forEach((prop) => {
              const dataIndex = propertyMap[prop];
              dataArray[dataIndex].data = [res.data[prop] || 0]
            })
          }
        });
      }

      setBarState({ series: dataArray })
    }
  }

  const fetchDatas = async () => {
    try {
      const response = await getDataFromAPI("get", `api/chart?type=all&year=${year}`);
      setValue(response?.data);
      setResponse(response?.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDatas();
  }, [year])

  useEffect(() => {
    setValue(response)
  }, [deviceType, month])



  return (
    <div>
      <div className="mb-4 justify-between gap-4 flex items-center">
        <h4 className="text-lg sm:text-xl font-semibold text-black dark:text-white">
          {title}
        </h4>
        {/* <div>
          <div className="flex gap-2">
            <div className="text-sm font-semibold text-black dark:text-white">
              <select className="relative md:hidden w-full appearance-none rounded border border-stroke bg-transparent px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer" onChange={(e) => setMonth(Number(e?.target?.value))}>
                {
                  monthList.map((mth) => (
                    <option value={mth?.id} selected={moment().month() + 1 === mth?.id} key={mth?.id}>{mth?.name}</option>
                  ))
                }
              </select>
            </div>
            <div className="text-sm font-semibold text-black dark:text-white">
              <select className="relative w-full appearance-none rounded border border-stroke bg-transparent px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer" onChange={(e) => setYear(Number(e?.target?.value))}>
                {
                  yearList.map((yr) => (
                    <option value={yr} selected={moment().year() === yr} key={yr}>{yr}</option>
                  ))
                }
              </select>
            </div>
          </div>
        </div> */}
      </div>

      <div>
        <div id="ChartBar" className="-ml-5 -mb-9 overflow-hidden">
          <ApexCharts
            options={options}
            series={barState.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartBar;
