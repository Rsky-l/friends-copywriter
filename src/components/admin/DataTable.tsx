"use client";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
  columns, data, onEdit, onDelete,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((col) => (
              <th key={col.key} className="text-left py-3 px-4 text-slate-500 font-medium">
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="py-3 px-4 text-right text-slate-500 font-medium">操作</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-4 text-slate-700">
                  {col.render ? col.render(item) : String(item[col.key] ?? "")}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="py-3 px-4 text-right">
                  {onEdit && (
                    <button onClick={() => onEdit(item)} className="text-brand-500 hover:text-brand-600 mr-2">
                      编辑
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(item)} className="text-red-500 hover:text-red-600">
                      删除
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
