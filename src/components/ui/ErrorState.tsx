import { AlertCircle, RefreshCcw } from "lucide-react";

const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="bg-white rounded-xl p-8 shadow-md text-center">
    <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
    <h3 className="text-lg font-semibold text-gray-800 mb-2">
      Something went wrong
    </h3>
    <p className="text-gray-600 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
    >
      <RefreshCcw size={16} />
      Try Again
    </button>
  </div>
);

export default ErrorState;
