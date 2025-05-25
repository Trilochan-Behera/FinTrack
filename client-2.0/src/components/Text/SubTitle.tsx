import React from "react";

const SubTitle = ({ text, className="text-sm" }: { text: string; className?: string }) => {
  return <div className={className}>{text}</div>;
};

export default SubTitle;
