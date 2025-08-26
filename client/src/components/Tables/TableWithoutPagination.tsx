import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { getDataFromAPI, getYear } from "@src/services/getAllServices";
import { UserContext } from "@pages/_app";

const TableWithoutPagination = ({
  header,
  IsApiCall,
  setIsApiCall = () => {},
}: any) => {
  const yearList = getYear();
  const [year, setYear] = useState(moment().year());
  const [tableData, setTableData] = useState([]) as any;
  // Define an asynchronous function
  const fetchDatas = async () => {
    try {
      const response = await getDataFromAPI(
        "get",
        `api/yearly-report?year=${year}`
      );
      if (response.status) {
        setTableData(response.data);
        setIsApiCall(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDatas();
  }, [IsApiCall, year]);

  return (
    <div
      className={`rounded-sm border border-stroke bg-white
         flex justify-center items-center shadow-default dark:border-strokedark dark:bg-boxdark`}
    >
      <>
        <div
          className={`max-w-full overflow-x-auto min-h-[600px] overflow-auto`}
        >
          <div className="text-sm font-semibold text-black dark:text-white w-full flex justify-betweeen items-center my-4">
            <h4 className="text-lg sm:text-xl font-medium text-black dark:text-white w-1/2 ml-8">
              Yearly Report
            </h4>
            <div className="flex justify-end w-full mr-8">
              <select
                className="relative appearance-none rounded border border-stroke bg-transparent px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer w-fit "
                onChange={(e) => setYear(Number(e?.target?.value))}
              >
                {yearList.map((yr) => (
                  <option value={yr} selected={moment().year() === yr} key={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {tableData?.length ? (
            <table className="w-full py-4 ">
              <thead>
                <tr className="bg-primary bg-opacity-20 dark:bg-meta-3">
                  {header.map((h: any, i: any) => (
                    <th
                      className={`w-[160px] py-3 text-left font-medium text-black dark:text-white ${
                        i == 0 && "pl-9"
                      } `}
                      key={i}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((item: any, key: string) => (
                  <tr
                    key={key}
                    className="hover:bg-gray-2 h-auto  dark:hover:bg-bodydark2 dark:hover:bg-opacity-25 cursor-pointer"
                  >
                    {[
                      "month",
                      "openBalance",
                      "income",
                      "savings",
                      "emergencyFund",
                      "expense",
                      "loanGiven",
                      "closingBalance",
                    ].map((data, i) => (
                      <td className={`border-b w-fit border-[#eee] h-8 py-[11px] dark:border-strokedark ${i>0 ? 'pl-1': 'pl-9'}`}>
                        <h5 className={`font-medium  ${data === 'income' ? `text-[#27C190]` : data === 'savings' || data === 'emergencyFund'? `text-[#22B3FF]`: data === 'expense' || data=== 'loanGiven'? `text-[#e13d69]` : `text-black dark:text-white`}`}>
                          {item[data]}
                        </h5>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center flex-col items-center gap-2 h-[58vh] text-primary font-bold text-xl">
              <p className="text-6xl">😢</p>
              <p>No Data Present</p>
            </div>
          )}
        </div>
      </>
    </div>
  );
};

export default TableWithoutPagination;
