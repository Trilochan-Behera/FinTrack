import Extend from "../Svg/Extend";

export default function Pagination({ pagination, setPagination, tableData, numberOfPages }: any) {
    return (
        <>
            {
                pagination?.start <= 0 ?
                    <div className="rotate-90 text-current cursor-not-allowed"><Extend /></div>
                    :
                    <div className="rotate-90 text-white cursor-pointer" onClick={() => setPagination({ ...pagination, start: pagination.start - numberOfPages, end: pagination.end - numberOfPages })}><Extend /></div>
            }
            {
                ((pagination?.end >= tableData?.length) || (pagination?.start / numberOfPages) + 1 >= Math.ceil(tableData?.length / numberOfPages)) ?
                    <div className="-rotate-90 text-current cursor-not-allowed"><Extend /></div>
                    :
                    <div className="-rotate-90 text-white cursor-pointer" onClick={() => setPagination({ ...pagination, start: pagination?.start + numberOfPages, end: pagination?.end + numberOfPages })}><Extend /></div>
            }
            
            <div className="flex  gap-2 items-center justify-center text-white">
                <p>Showing </p> 
                {
                    tableData?.length ?
                        <input
                            type="text"
                            value={((pagination?.start / numberOfPages) + 1) || 1}
                            className="w-6 h-6 text-center text-primary font-bold"
                            onChange={(e) => setPagination({ ...pagination, start: (Number(e?.target?.value) * numberOfPages) - numberOfPages, end: (Number(e?.target?.value)) * numberOfPages })}
                        />
                        :
                        0
                }
                <p> of {Math.ceil(tableData?.length / numberOfPages)} Pages </p>
            </div>
        </>
    )
}