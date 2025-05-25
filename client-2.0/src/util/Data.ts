import CalenderSvg from "@src/components/Svg/CalenderSvg";
import DashboardSvg from "@src/components/Svg/DashboardSvg";
import ExpenseSideSvg from "@src/components/Svg/ExpenseSideSvg";
import IncomeSideSvg from "@src/components/Svg/IncomeSideSvg";
import LifetimeSvg from "@src/components/Svg/LifetimeSvg";
import MonthlySvg from "@src/components/Svg/MonthlySvg";
import ProfileSvg from "@src/components/Svg/ProfileSvg";
import SavingSideSvg from "@src/components/Svg/SavingSideSvg";
import SettingSvg from "@src/components/Svg/SettingSvg";
import YearlySvg from "@src/components/Svg/YearlySvg";

export const header = ["Date", "Price", "Type", "Category", "Action"];
export const selectType = ["income", "savings", "expense"];


export const TopSidebarOptions = [
  {
    name: "Dashboard",
    link: "/",
    icon: DashboardSvg,
  },
  {
    name: "Expense",
    link: "/expense",
    icon: ExpenseSideSvg,
  },
  {
    name: "Savings",
    link: "/savings",
    icon: SavingSideSvg,
  },
  {
    name: "Income",
    link: "/income",
    icon: IncomeSideSvg,
  },
];

export const SubSidebarOptions = [
  {
    name: "SplitFy",
    link: "/split",
    icon: MonthlySvg,
  },
  {
    name: "Investments",
    link: "/investment",
    icon: MonthlySvg,
  },
  {
    name: "Loan Management",
    link: "/loan",
    icon: YearlySvg,
  },
  {
    name: "EMI/Subscriptions",
    link: "/emi",
    icon: LifetimeSvg,
  }
];

export const setSidebarOptions = [
 
  {
    name: "Profile",
    link: "/profile",
    icon: ProfileSvg,
  },
  {
    name: "Settings",
    link: "/settings",
    icon: SettingSvg,
  },
  {
    name: "Acivity",
    link: "/actvity",
    icon: ProfileSvg,
  },
  {
    name: "Docs",
    link: "/profile",
    icon: ProfileSvg,
  },
  // {
  //   name: "Calendar",
  //   link: "/calendar",
  //   icon: CalenderSvg,
  // },
  {
    name: "SignOut",
    link: "/calendar",
    icon: ProfileSvg,
  },
];