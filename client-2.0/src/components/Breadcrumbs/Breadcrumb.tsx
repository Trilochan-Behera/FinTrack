import Link from "next/link";
import TabFilterComponent from "../TabFilterComponent";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { Button } from "@material-tailwind/react";
interface BreadcrumbProps {
  pageName: string;
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-primary dark:text-primarydark capitalize">
          {pageName ? `${pageName}` : "Dashboard"}
        </h2>
        <h4> Centralized Monetary Value</h4>
      </div>
      <div>
        <TabFilterComponent />
      </div>
            <Button onClick={()=>{
              console.log('test')
            }} variant="outlined" size="sm">Add / Upload</Button>
      
      {/* <Button
            label={"Add Finance"}
            type={"submit"}
            className="flex items-center gap-0.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary"  
            /> */}
    </div>
  );
};

export default Breadcrumb;
