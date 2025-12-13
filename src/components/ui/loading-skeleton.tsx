interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'text';
  count?: number;
}

export const LoadingSkeleton = ({ variant = 'card', count = 1 }: LoadingSkeletonProps) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (variant === 'card') {
    return (
      <>
        {skeletons.map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
              <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
              <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
            </div>
            <div className="h-10 bg-slate-200 rounded-lg w-32"></div>
          </div>
        ))}
      </>
    );
  }

  if (variant === 'list') {
    return (
      <>
        {skeletons.map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 mb-3 animate-pulse">
            <div className="h-5 bg-slate-200 rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
        ))}
      </>
    );
  }

  // text variant
  return (
    <>
      {skeletons.map((i) => (
        <div key={i} className="animate-pulse mb-2">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
        </div>
      ))}
    </>
  );
};
