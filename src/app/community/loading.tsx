export default function Loading() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6" />
        
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6" />
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}