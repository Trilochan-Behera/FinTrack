import React, { useState, useEffect, useRef } from "react";
// import { debounce } from "lodash";
import Input from "./Input";

interface TableProps {
  columns: { key: string; label: string; width?: string }[]; // Table column definitions
  data: any[]; // Table data
  onLoadMore: (direction: "down" | "up") => void; // Callback to load more data when scrolling
  isLoading: boolean; // Loading state
}

const DynamicTable: React.FC<TableProps> = ({ columns, data, onLoadMore, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [filteredData, setFilteredData] = useState(data); // Data filtered by the search term
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set()); // Set of selected rows
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the scrollable container

  // Filter data based on the search term
  useEffect(() => {
    setFilteredData(
      data?.filter((row) =>
        columns.some((column) =>
          row[column.key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }, [searchTerm, data, columns]);

  // Toggle selection for individual rows
  const handleSelectRow = (id: number) => {
    setSelectedRows((prev) => {
      const newSelectedRows = new Set(prev);
      if (newSelectedRows.has(id)) newSelectedRows.delete(id);
      else newSelectedRows.add(id);
      return newSelectedRows;
    });
  };

  // Select or deselect all rows
  const handleSelectAll = () => {
    if (selectedRows.size === filteredData?.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData?.map((_, index) => index)));
    }
  };

  // Debounced search handler
  // const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(e.target.value);
  // }, 300);

  // Infinite scrolling handler
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    if (scrollTop === 0) {
      onLoadMore("up"); // Load older data when scrolling up
    } else if (scrollTop + clientHeight >= scrollHeight - 10) {
      onLoadMore("down"); // Load newer data when scrolling down
    }
  };

  return (
    <div className="relative">
      {/* Search input */}
      <div className="p-2 w-80">
      <Input
        type="search"
        onChange={()=>console.log('search')}
        placeholder="Search..."
        style="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring focus:ring-blue-300"
      />
      </div>

      {/* Table wrapper */}
      <div className="w-full border border-gray-300 rounded-md">
        {/* Table with sticky header */}
        <table className="table-auto w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="p-4 border border-gray-200 w-[50px]">
                <input
                  type="checkbox"
                  checked={selectedRows.size === filteredData?.length}
                  onChange={handleSelectAll}
                />
              </th>
              {columns?.map((column) => (
                <th
                  key={column.key}
                  className="p-4 border border-gray-200 text-left"
                  style={{ minWidth: column.width || "auto" }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
        </table>

        {/* Scrollable data container */}
        <div
          ref={containerRef}
          className="overflow-auto h-[400px]"
          onScroll={handleScroll}
        >
          <table className="table-auto w-full border-collapse">
            <tbody>
              {filteredData?.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  <td className="p-4 border border-gray-200">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(rowIndex)}
                      onChange={() => handleSelectRow(rowIndex)}
                    />
                  </td>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="p-4 border border-gray-200"
                      style={{ minWidth: column.width || "auto" }}
                    >
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Loading spinner */}
          {isLoading && (
            <div className="p-4 text-center">
              <div className="loader inline-block w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
              <p className="mt-2 text-gray-500">Loading...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicTable;
