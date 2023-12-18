import { getDataFromAPI, getDateArray } from "@src/services/getAllServices";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { useEffect, useState } from "react";
import moment from "moment";

const Calendar = () => {

  const [dateArray, setDateArray] = useState([]) as any;
  const [data, setData] = useState([]) as any;
  const week = [
    {
      fullName: "Sunday",
      shortName: "Sun",
      dayValue: 0,
    },
    {
      fullName: "Monday",
      shortName: "Mon",
      dayValue: 1
    },
    {
      fullName: "Tuesday",
      shortName: "Tue",
      dayValue: 2
    },
    {
      fullName: "Wednesday",
      shortName: "Wed",
      dayValue: 3
    },
    {
      fullName: "Thursday",
      shortName: "Thu",
      dayValue: 4
    },
    {
      fullName: "Friday",
      shortName: "Fri",
      dayValue: 5
    },
    {
      fullName: "Saturday",
      shortName: "Sat",
      dayValue: 6
    }
  ]
  useEffect(() => {
    let dayOfMonth = getDateArray(moment().month() + 1, moment().year());
    // Set the date to the first day of the month
    const currentDate = moment().startOf('month');
    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const firstDayIndex = currentDate.day();

    if (firstDayIndex) {
      const firstZero = Array(firstDayIndex).fill(0);
      dayOfMonth.unshift(...firstZero);
    }
    const reminder = dayOfMonth.length % 7;
    if (reminder) {
      const ZeroArray = Array(7 - reminder).fill(0) as any;
      dayOfMonth.push(...ZeroArray);
    }
    const array = dayOfMonth.map(element => {
      return +element;
    });
    setDateArray(array);
    fetchDatas();
  }, []);


  const fetchDatas = async () => {
    try {
      const response = await getDataFromAPI("get", `api/chart?type=calendar`);
      setData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Calendar" />
      {/* <!-- ====== Calendar Section Start ====== --> */}
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-7 rounded-t-sm bg-primary text-white">
              {
                week.map((w, i) => (
                  <th className={`flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5 ${w.dayValue === 0 ? 'rounded-tl-sm' : w.dayValue === 6 ? 'rounded-tr-sm' : ''}`} key={i}>
                    <span className="hidden lg:block"> {w.fullName} </span>
                    <span className="block lg:hidden"> {w.shortName} </span>
                  </th>
                ))
              }
            </tr>
          </thead>
          <tbody>
            < tr className="grid grid-cols-7" >
              {
                dateArray.map((date: any, i:any) => (
                  <td className={`ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-4 xl:h-28 ${date > 0 && date <= data.length && 'bg-primary bg-opacity-10'}`} key={i}>
                    {date > 0 && date <= data.length ?
                      <span className="font-medium text-black dark:text-white flex gap-4">
                        <p className="bg-[#8e8e8e] h-8 w-8 rounded-full flex items-center justify-center text-white text-xs">{date}</p>
                        <div className="text-sm">
                          {data.map((d: any, i: any) => d?.date === date && (
                            <div key={i}>
                              {d.data?.income && <p> {d.data?.income} (Income) </p>}
                              {d.data?.savings && <p> {d.data?.savings} (Savings) </p>}
                              {d.data?.expense && <p> {d.data?.expense} (Expense) </p>}
                            </div>
                          ))}
                        </div>
                      </span> :
                      <span className="font-medium text-black dark:text-white">
                        <p className={`${date && 'bg-[#8e8e8e] h-8 w-8 rounded-full flex items-center justify-center text-white text-xs'}`}>{date || ""}</p>
                      </span>
                    }
                  </td>
                ))
              }
            </tr>
            {/* <!-- Line 5 --> */}
          </tbody>
        </table>
      </div >
      {/* <!-- ====== Calendar Section End ====== --> */}
    </>
  );
};

export default Calendar;
