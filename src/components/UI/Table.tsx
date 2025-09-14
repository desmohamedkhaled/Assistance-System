import { TableColumn } from '@/types';

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}
function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'لا توجد بيانات',
  onRowClick,
  className = ''
}: TableProps<T>) {
  // Loading state
  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-200/50  overflow-hidden animate-fade-in ${className}`}>
        <div className="flex items-center justify-center py-20 text-primary-600">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin ml-4" />
          <span className="text-xl font-semibold">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-200/50  overflow-hidden animate-fade-in ${className}`}>
        <div className="text-center py-20">
          <div className="text-7xl text-gray-300 mb-6 animate-float">
            <i className="fas fa-inbox" />
          </div>
          <p className="text-xl text-gray-500 font-semibold">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-200/50  overflow-hidden animate-fade-in relative ${className}`}>
      {/* Top accent border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600" />
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Header */}
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-5 text-right font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap transition-all duration-200 hover:bg-gray-100 hover:text-primary-600 relative group"
                >
                  {column.label}
                  {/* Hover underline effect */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Body */}
          <tbody>
            {data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className={`
                  transition-all duration-200 relative animate-slide-in-right
                  ${onRowClick ? 'cursor-pointer hover:bg-gray-50 hover:shadow-sm hover:-translate-x-1' : ''}
                  ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                  hover:bg-gray-50
                `}
                onClick={() => onRowClick?.(item)}
                style={{ animationDelay: `${rowIndex * 50}ms` }}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-5 text-right border-b border-gray-200 transition-colors duration-200 hover:text-primary-600"
                  >
                    {column.render
                      ? column.render(item[column.key], item)
                      : item[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;