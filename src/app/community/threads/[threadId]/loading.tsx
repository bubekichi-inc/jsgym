export default function Loading() {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="h-32 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
        
        <div className="mt-8 h-32 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}