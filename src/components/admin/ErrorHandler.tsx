const ErrorHandler = ({
  title,
  retry,
  error,
}: {
  title: string;
  retry: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}) => {
  return (
    <div className="w-full border border-red-300 rounded-3xl p-8 mt-6 bg-red-50">
      <div className="text-center">
        <div className="text-red-600 text-lg font-medium mb-2">
          Error Loading {title}
        </div>
        <p className="text-red-500 text-sm">
          {error?.message || "Failed to load user data. Please try again."}
        </p>
        <button
          onClick={() => retry()}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorHandler;
