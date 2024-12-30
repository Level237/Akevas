export function StepSkeleton() {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-3/4 bg-gray-700 rounded-md" />
        <div className="space-y-4">
          <div className="h-12 bg-gray-700 rounded-md" />
          <div className="h-12 bg-gray-700 rounded-md" />
          <div className="h-12 bg-gray-700 rounded-md" />
        </div>
        <div className="h-10 w-1/3 bg-gray-700 rounded-full" />
      </div>
    )
  }
  
  