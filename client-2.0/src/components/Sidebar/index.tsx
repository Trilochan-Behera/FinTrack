import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import CrossSvg from "../Svg/CrossSvg";
import CalenderSvg from "../Svg/CalenderSvg";
import DashboardSvg from "../Svg/DashboardSvg";
import ExpenseSideSvg from "../Svg/ExpenseSideSvg";
import IncomeSideSvg from "../Svg/IncomeSideSvg";
import IncomeSvg from "../Svg/IncomeSvg";
import ProfileSvg from "../Svg/ProfileSvg";
import SavingSideSvg from "../Svg/SavingSideSvg";
import SettingSvg from "../Svg/SettingSvg";
import ArrowDownSvg from "../Svg/ArrowDownSvg";
import LifetimeSvg from "../Svg/LifetimeSvg";
import { usePathname } from "next/navigation";
import MonthlySvg from "../Svg/MonthlySvg";
import YearlySvg from "../Svg/YearlySvg";
import SignOut from "../Svg/signOut";
import Button from "../Button";
import { useRouter } from "next/router";
import {
  setSidebarOptions,
  SubSidebarOptions,
  TopSidebarOptions,
} from "@src/util/Data";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);
  const router = useRouter();

  let storedSidebarExpanded = "true";
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // State to track which submenu is open
  // const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("login-user");
    router.push("login");
  };

  // const toggleSubmenu = (name: string) => {
  //   setOpenSubmenu(openSubmenu === name ? null : name);
  // };

  // Handle click outside to close the sidebar
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // Handle escape key to close the sidebar
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  // Store sidebar expanded state
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  // Close sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const sidebarTabOptions = [
    TopSidebarOptions,
    SubSidebarOptions,
    setSidebarOptions,
  ];

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-60 flex-col overflow-y-hidden duration-300 ease-linear bg-white  dark:bg-boxdark lg:static  border-stroke lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between w-full gap-4 h-[75px] fixed bg-primary z-9999 px-4 lg:px-6">
        <div className=" flex items-center justify-center pl-4">
          <Link href="/">
            <IncomeSvg />
          </Link>
          <p className="text-lg font-bold text-white">FinTrack</p>
        </div>
        {sidebarOpen && (
          <div
            className="text-2xl font-bold flex items-center cursor-pointer border border-primary p-2 bg-white "
            onClick={() => setSidebarOpen(false)}
          >
            <CrossSvg />
          </div>
        )}
      </div>
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear pt-[75px]">
        <div className="mb-4 flex flex-col gap-1 justify-start py-4 ">
          {sidebarTabOptions.map((Items, index) => (
            <>
              {Items.map(({ icon: Icon, link, name }, i) => (
                <Link
                  href={link}
                  className={`flex h-10 items-center px-6 text-sm font-medium capitalize ${
                    pathname === link &&
                    "border-l-8 border-l-primary bg-primary bg-opacity-10 text-primary font-bold px-[16px] dark:border-l-primary dark:bg-black dark:text-whiter"
                  } ${name == "dashboard" ? "gap-1" : "gap-2.5"}`}
                  onClick={() => setSidebarOpen(false)}
                  key={i}
                >
                  <Icon height={16} width={16} />
                  <span className="mb-0.5">{name}</span>
                </Link>
              ))}
              <hr className="text-black/30 font-bold" />
            </>
          ))}

        
        </div>
        {/* <Button
            label={"Sign Out"}
            type={"submit"}
            className="flex items-center gap-0.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary"  
            handleClick={handleLogout}
            icon={<SignOut/>}
          /> */}
      </div>
    </aside>
  );
};

export default Sidebar;
