const EmptyState = ({ title }: { title: string }) => {
  return (
    <div className="w-full border border-gray-300 rounded-3xl p-8 mt-6 bg-white shadow-2xl">
      <div className="text-center">
        <div className="text-gray-600 text-lg font-medium mb-2">
          No {title} Found
        </div>
        <p className="text-gray-500 text-sm">
          There are no <span className="lowercase">{title}</span> to display at
          the moment.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
