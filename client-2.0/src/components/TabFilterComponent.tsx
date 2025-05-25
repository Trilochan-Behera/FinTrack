import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
  } from "@material-tailwind/react";


const TabFilterComponent: React.FC = () => {
  const currentYear: string = String(moment().year());
  const LifeTime: string = 'Lifetime';
  const [activeTab, setActiveTab] = useState(currentYear);
  useEffect(()=>{
    const selectedTab = localStorage.getItem('selectedTab') || currentYear;
    setActiveTab(selectedTab)
  },[])



  return (
    <div className="mx-auto ">
      {/* Tabs */}
      <div className="flex text-sm">
        {[currentYear, LifeTime].map((tab) => (
          <button
            key={tab}
            className={`w-[100px] py-0.5 font-medium 
              ${
                activeTab === tab
                  ? ` text-primary border-primary rounded-md border ${activeTab == LifeTime ? 'rounded-l-none':'rounded-r-none' } `
                  : ` text-graydark border-black/30 rounded-md border ${activeTab == LifeTime ? 'rounded-r-none':'rounded-l-none' } `
              }`}
              onClick={()=>{
                setActiveTab(tab)
                localStorage.setItem('selectedTab', tab)
              }}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabFilterComponent;
