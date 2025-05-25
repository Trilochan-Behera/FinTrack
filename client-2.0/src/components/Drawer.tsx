import React from "react";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
 
export function DrawerWithForm() {
  const [open, setOpen] = React.useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
 
  return (
    <React.Fragment>
      <Button onClick={openDrawer} variant="outlined" size="sm">Add / Upload</Button>
     <Drawer open={open} onClose={closeDrawer} placement="right" size={400}  >
        <div className="flex items-center justify-between px-4 pb-2">
          <Typography variant="h5" color="blue-gray">
            Add / Upload Financial Data
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <Button className="flex items-center gap-3 text-primary" size="sm">
              <ArrowUpTrayIcon strokeWidth={2} className="h-4 w-4" />{" "}
              Upload Bank Statement
            </Button>
            <div>Or</div>
        <form className="flex flex-col gap-6 p-4">
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Your Email
          </Typography>
          <Input type="email" label="Email" crossOrigin={undefined} />
          <Input label="Subject" crossOrigin={undefined} />
          <Textarea rows={6} label="Message" />
          <Button>Send Message</Button>
        </form>
      </Drawer>
    </React.Fragment>
  );
}