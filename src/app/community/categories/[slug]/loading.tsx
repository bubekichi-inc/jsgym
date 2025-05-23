export default function Loading() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
          <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6" />
        
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}