import React from 'react'

function Filter({column}) {
  console.log('column', column);

  const columnFilterValue = column.getFilterValue()
  console.log('columnFiltervalue', columnFilterValue);

  return (
    <input
      type="text"
      value={(columnFilterValue ?? '')}
      onChange={e => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  )
}

export default Filter