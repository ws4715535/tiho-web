import React from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  onConfirm: () => void;
  loading?: boolean;
  variant?: 'default' | 'destructive';
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  loading = false,
  variant = 'default'
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => !loading && onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col space-y-4">
          <div className="flex items-start space-x-3">
             {variant === 'destructive' && (
               <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full shrink-0">
                 <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
               </div>
             )}
             <div className="flex-1">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-none mb-2 mt-1">
                 {title}
               </h3>
               {description && (
                 <div className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                   {description}
                 </div>
               )}
             </div>
          </div>

          <div className="flex justify-end space-x-3 mt-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button
              variant={variant === 'destructive' ? 'default' : 'default'} // Reuse default style but maybe add red if destructive? Button component doesn't have destructive variant, assume default or secondary.
              className={cn(variant === 'destructive' ? 'bg-red-600 hover:bg-red-700 text-white' : '')}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? '处理中...' : '确认'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
