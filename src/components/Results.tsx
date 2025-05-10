interface ResultsProps {
  wpm: number;
  accuracy: number;
  onRestart: () => void;
}

export default function Results({ wpm, accuracy, onRestart }: ResultsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
          Your Results
        </h2>
        
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 rounded-xl border border-blue-100 dark:border-blue-800">
            <div className="text-5xl font-bold text-blue-600 dark:text-blue-300 mb-2">
              {wpm}
            </div>
            <div className="text-sm font-medium text-blue-600/70 dark:text-blue-400 uppercase tracking-wide">
              Words per minute
            </div>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40 rounded-xl border border-green-100 dark:border-green-800">
            <div className="text-5xl font-bold text-green-600 dark:text-green-300 mb-2">
              {accuracy}%
            </div>
            <div className="text-sm font-medium text-green-600/70 dark:text-green-400 uppercase tracking-wide">
              Accuracy
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onRestart}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Try Another Text
          </button>
        </div>
      </div>
    </div>
  );
} 