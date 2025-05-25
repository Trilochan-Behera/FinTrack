import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import {
  EyeIcon,
  PencilIcon,
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
  Drawer,
} from "@material-tailwind/react";
import { TableData } from "@src/util/mockdata";
import { DrawerWithForm } from "./Drawer";
import Pagination from "./Pagination";

const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Expense",
    value: "expense",
  },
  {
    label: "Savings",
    value: "savings",
  },
  {
    label: "Income",
    value: "income",
  },
];

const TABLE_HEAD = ["Title", "Date", "Price", "Type", "Category", ""];

export function SortableTable({type="all"}) {
  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Finance Data
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all financial Data
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <DrawerWithForm />
            <Button className="flex items-center gap-3 text-primary" size="sm">
              <ArrowDownTrayIcon strokeWidth={2} className="h-4 w-4 " />{" "}
              Download
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs value="all" className="w-full md:w-1/3">
            <TabsHeader>
              {TABS.map(({ label, value }) => (
                <Tab key={value} value={value} disabled={type !== "all" && value !== type}>
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              crossOrigin={undefined}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="py-2 overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                  >
                    {head}
                    {index !== TABLE_HEAD.length - 1 && (
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                    )}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TableData.map(({ title, date, price, type, category }, index) => {
              const isLast = index === TableData.length - 1;
              const classes = isLast
                ? "px-4 py-2"
                : "px-4 py-2 border-b border-blue-gray-50";

              return (
                <tr>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {title}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      {/* <Avatar src={img} alt={name} size="sm" /> */}
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {date}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {price}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="w-max">
                      <Chip
                        variant="ghost"
                        size="sm"
                        value={type}
                        color={
                          type === "expense"
                            ? "red"
                            : type === "savings"
                            ? "green"
                            : "yellow"
                        }
                      />
                    </div>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {category}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <div className="flex gap-2">
                      <EyeIcon className="h-4 w-4" />
                      <PencilIcon className="h-4 w-4" />
                      <TrashIcon className="h-4 w-4" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-end border-t border-blue-gray-50 p-2 bg-primary">
        <Pagination
          pagination={0}
          setPagination={null}
          tableData={TableData}
          numberOfPages={5}
        />
      </CardFooter>
    </Card>
  );
}
