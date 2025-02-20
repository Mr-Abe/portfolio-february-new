import React from 'react';

export const Table = ({ children }: { children: React.ReactNode }) => (
  <table className="w-full border-collapse">
    {children}
  </table>
);

export const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-50 dark:bg-gray-800">
    {children}
  </thead>
);

export const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
    {children}
  </tbody>
);

export const TableRow = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <tr className={`${className} hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200`}>
    {children}
  </tr>
);

export const TableHead = ({ children, className = '', onClick }: { 
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <th
    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}
    onClick={onClick}
  >
    {children}
  </th>
);

export const TableCell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 ${className}`}>
    {children}
  </td>
);

interface TablePaginationProps {
  component: string;
  count: number;
  page: number;
  onPageChange: (event: unknown, newPage: number) => void;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
}

export const TablePagination = ({
  count,
  page,
  onPageChange,
  rowsPerPage,
}: TablePaginationProps) => {
  const totalPages = Math.ceil(count / rowsPerPage);

  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-gray-700">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={(e) => onPageChange(e, page - 1)}
          disabled={page === 0}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={(e) => onPageChange(e, page + 1)}
          disabled={page >= totalPages - 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing{' '}
            <span className="font-medium">{page * rowsPerPage + 1}</span>
            {' to '}
            <span className="font-medium">
              {Math.min((page + 1) * rowsPerPage, count)}
            </span>
            {' of '}
            <span className="font-medium">{count}</span>
            {' results'}
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={(e) => onPageChange(e, page - 1)}
              disabled={page === 0}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={(e) => onPageChange(e, index)}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                  page === index
                    ? 'z-10 bg-blue-600 dark:bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={(e) => onPageChange(e, page + 1)}
              disabled={page >= totalPages - 1}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};