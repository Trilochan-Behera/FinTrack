export default function TableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="col-span-12 relative flex flex-col bg-clip-border rounded-xl rounded-b-none bg-white text-gray-700 w-full border border-stroke p-8 h-full shadow-default dark:border-strokedark dark:bg-boxdark">
        {children}
      </div>
      
    </>
  );
}
