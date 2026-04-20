import { ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (p: number) => void;
}

export default function Pagination({ currentPage, totalPages, setCurrentPage }: PaginationProps) {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex justify-center items-center gap-2 mt-12 mb-8 font-sans">
      {currentPage > 1 && (
         <button 
           onClick={() => setCurrentPage(currentPage - 1)}
           className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-[#717171] hover:bg-gray-200 transition-colors"
         >
           <ChevronRight className="w-5 h-5 rotate-180" />
         </button>
      )}
      
      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1;
        const isCurrent = page === currentPage;
        if (totalPages > 7) {
           if (page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 1) {
             if (page === 2 || page === totalPages - 1) return <span key={page} className="text-gray-400 px-1">...</span>;
             return null;
           }
        }
        
        return (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-xl transition-colors font-medium",
              isCurrent ? "bg-[#1A1A1A] text-white shadow-md" : "bg-gray-100 text-[#717171] hover:bg-gray-200"
            )}
          >
            {page}
          </button>
        )
      })}
      
      {currentPage < totalPages && (
         <button 
           onClick={() => setCurrentPage(currentPage + 1)}
           className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-[#717171] hover:bg-gray-200 transition-colors"
         >
           <ChevronRight className="w-5 h-5" />
         </button>
      )}
    </div>
  );
}
