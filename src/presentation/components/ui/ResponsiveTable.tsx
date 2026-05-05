import { ReactNode } from 'react';
import { useMobileDetect } from '@/presentation/hooks';
import { cn } from '@/shared/utils';

/**
 * Table Responsive Component
 * 
 * Mobile: Cards apiladas (no table)
 * Tablet/Desktop: Table tradicional con scroll horizontal
 */

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
  mobileLabel?: string; // Label para vista mobile card
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function ResponsiveTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No hay datos disponibles',
  className
}: ResponsiveTableProps<T>) {
  const { isMobile } = useMobileDetect();

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  // MOBILE: Cards apiladas
  if (isMobile) {
    return (
      <div className={cn('space-y-4', className)}>
        {data.map((row) => (
          <div
            key={keyExtractor(row)}
            onClick={() => onRowClick?.(row)}
            className={cn(
              'bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700 shadow-sm',
              onRowClick && 'cursor-pointer active:scale-98 transition-transform'
            )}
          >
            <div className="space-y-3">
              {columns.map((column, idx) => {
                const value = typeof column.accessor === 'function'
                  ? column.accessor(row)
                  : row[column.accessor];

                return (
                  <div key={idx} className="flex justify-between items-start gap-4">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[100px]">
                      {column.mobileLabel || column.header}:
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white text-right flex-1">
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // TABLET/DESKTOP: Table con scroll horizontal
  return (
    <div className={cn('overflow-x-auto -mx-4 md:mx-0', className)}>
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
            <thead className="bg-gray-50 dark:bg-dark-800">
              <tr>
                {columns.map((column, idx) => (
                  <th
                    key={idx}
                    scope="col"
                    className={cn(
                      'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                      column.className
                    )}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-900 divide-y divide-gray-200 dark:divide-dark-700">
              {data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    onRowClick && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors'
                  )}
                >
                  {columns.map((column, idx) => {
                    const value = typeof column.accessor === 'function'
                      ? column.accessor(row)
                      : row[column.accessor];

                    return (
                      <td
                        key={idx}
                        className={cn(
                          'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white',
                          column.className
                        )}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
