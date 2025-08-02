import { getUserProfile } from "@/store/authSlice";
import { useAppSelector } from "@/store/redux-hooks";
import { Calendar, BookOpen, Clock } from "lucide-react";

const EmptyState = () => {
  const { firstname } = useAppSelector(getUserProfile);

  return (
    <div className="bg-white rounded-2xl p-10 shadow-lg border border-orange-200 text-center min-h-[400px] flex flex-col justify-center">
      {/* Icon section */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-orange-100 rounded-full w-20 h-20 mx-auto opacity-30 animate-pulse"></div>
        <Calendar
          className="mx-auto text-orange-500 mb-3 relative z-10"
          size={56}
        />
        <div className="flex justify-center space-x-4 mt-4">
          <BookOpen className="text-orange-400" size={24} />
          <Clock className="text-orange-400" size={24} />
        </div>
      </div>

      {/* Main heading */}
      <h3 className="text-2xl font-bold text-gray-800 mb-3">
        All Clear Today! 📅
      </h3>

      {/* Main content */}
      <div className="mb-6 max-w-lg mx-auto">
        <p className="text-gray-700 text-lg mb-4 leading-relaxed">
          Hey {firstname}! 👋 You don't have any lectures scheduled for today.
        </p>

        <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
          <div className="text-orange-800 font-semibold mb-3">
            🎯 Make the most of your free time:
          </div>
          <div className="grid gap-3 text-sm text-orange-700">
            <div className="flex items-center gap-2">
              <span className="text-orange-500">📚</span>
              <span>Review previous lecture notes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-500">☕</span>
              <span>Take a well-deserved break</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-500">📖</span>
              <span>Prepare for upcoming sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full border border-orange-200">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-orange-700">
            Schedule up to date
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
