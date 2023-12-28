import React, { useState } from 'react'
import { 
    useReactTable, 
    getCoreRowModel, 
    flexRender, 
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
} from '@tanstack/react-table';
import { useQuery} from '@tanstack/react-query'

import axios from 'axios';

function BasicTable() {

    const fetchCountryData = async () => {
        const res = await axios.get('https://restcountries.com/v3.1/all');
        try {
            
            const response = res.data.map(user => {
                return {
                    "name": user?.name?.common || null,
                    "capital": (user?.capital !== null && Array.isArray(user?.capital)) ? user?.capital[0] : '---',
                    "region": user?.region || null,
                    "population": user?.population || '---',
                    "languages": ((typeof user?.languages === 'object' && user?.languages !== null) && Array.isArray(Object.values(user?.languages))) ? Object.values(user?.languages) : '---'
                }}
            );
            console.log('response', response);
            return response;
        } catch (error) {
            console.log('error', error);
        }
    }


    const {data, isLoading} = useQuery({ queryKey: ['contryData'], queryFn: fetchCountryData})


   // Columns: name (common), capital (only first one), region, population, languages (comma separated)
    
    const columns = [
        {
            header: 'Name 🔃',
            accessorKey: "name"
        },
        {
            header: 'Capital',
            accessorKey: "capital"
        },
        {
            header: 'Region',
            accessorKey: "region"
        },
        {
            header: 'Population 🔃',
            accessorKey: "population"
        },
        {
            header: 'Languages',
            accessorKey: "languages"
        },
    ]

    const [sorting, setSorting] = useState([])
    const [filtering, setFiltering] = useState("")

    const table = useReactTable({
        data, 
        columns, 
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting: sorting,
            globalFilter: filtering
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering
    })
  return (
    <div className='w3-container'>
        {isLoading ? <h1>Loading...</h1> :
        <>
            <input
            type='text'
            value={filtering}
            onChange={(e)=> setFiltering(e.target.value)}
            placeholder='Search country name... '
            />
            <table className='w3-table-all'>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header=>(
                            <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                {header.isPlaceholder ? null : (
                                <div>
                                    { flexRender(header.column.columnDef.header, header.getContext())}
                                    {
                                        {asc: '', desc: ''}[header.column.getIsSorted() ?? null]
                                    }
                                </div> 
                                )}
                            </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row=>(
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell=>(
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={()=> table.setPageIndex(0)}>First Page</button>
                <button disabled={!table.getCanPreviousPage()} onClick={()=> table.previousPage()}>Previos Page</button>
                <button disabled={!table.getCanNextPage()} onClick={()=> table.nextPage()}>Next Page</button>
                <button onClick={()=> table.setPageIndex(table.getPageCount() -1)}>Last Page</button>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                    >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </>}
    </div>
  )
}

export default BasicTable