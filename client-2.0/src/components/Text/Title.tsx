import React from "react";

const Title = ({ text, className="text-lg" }: { text: string; className?: string }) => {
  return <div className={className}>{text}</div>;
};

export default Title;
