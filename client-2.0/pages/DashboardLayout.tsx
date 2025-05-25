import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import Breadcrumb from "@src/components/Breadcrumbs/Breadcrumb";
import CardDataStats from "@src/components/CardDataStats";
import ClosingBalSvg from "@src/components/Svg/ClosingBalSvg";
import IncomeSvg from "@src/components/Svg/IncomeSvg";
import TotalExpenseSvg from "@src/components/Svg/TotalExpenseSvg";
import TotalSavingSvg from "@src/components/Svg/TotalSavingSvg";
import { usePathname } from "next/navigation";
import { UserContext } from "./_app";
import useApiCall from "@src/hooks/useApiCall";

const DashboardLayout = React.memo(({ children }: { children: React.ReactNode }) => {
    const { refetchAPIName, setRefetchAPIName } = useContext(UserContext) as any;
    const year = moment().year();
    const pathname = usePathname();
    const [data, setData] = useState({
        income: 0,
        expense: 0,
        savings: 0,
        balance: 0
    });

    const cardProps = [
        {
            title: "Total Income",
            total: data.income,
            icon: ClosingBalSvg,
            status:true,
            rate:4
        },
        {
            title: "Total Expense",
            total: data.expense,
            icon: IncomeSvg,
            status:false,
            rate:4
        },
        {
            title: "Total Savings",
            total: data.savings,
            icon: TotalExpenseSvg,
            status:true,
            rate:4
        },
    ];

    const { loading, error, data: response, makeApiCall } = useApiCall();

    useEffect(() => {
        if (response?.data?.length) {
            const newData = response.data.reduce((acc: any, res: any) => {
                if (res.type === "expense") {
                    acc.expense += res.totalPrice;
                } else if (res.type === "income") {
                    acc.income += res.totalPrice;
                } else if (res.type === "savings") {
                    acc.savings += res.totalPrice;
                }
                return acc;
            }, { income: 0, expense: 0, savings: 0 });

            setData(newData);
        } else {
            setData({
                income: 0,
                expense: 0,
                savings: 0,
                balance: 0
            });
        }
    }, [response]);

    const fetchData = async () => {
        console.log("call")
        try {
            await makeApiCall('GET', `/api/chart-overview?year=${year}`);
            setRefetchAPIName([])
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    useEffect(() => {
        console.log("year", year);
        fetchData();
    }, [year]); // added makeApiCall to dependency array


    useEffect(() => {
      if(refetchAPIName.includes('dashboard-card')) fetchData();
    }, [refetchAPIName])
    

    return (
        <>
            <Breadcrumb pageName={pathname.split("/")[1]} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-5">
                {
                    cardProps.map((card, i) => (
                        <CardDataStats cardData={card} key={i}>
                            <card.icon />
                        </CardDataStats>
                    ))
                }
            </div>
            <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:gap-7.5">
                {children}
            </div>
        </>
    );
});

export default DashboardLayout;
