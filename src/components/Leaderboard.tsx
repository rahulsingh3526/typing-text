import React from 'react';

interface Score {
  wpm: number;
  accuracy: number;
  date: string;
}

interface LeaderboardProps {
  scores: Score[];
}

const getMedalColor = (index: number) => {
  switch (index) {
    case 0:
      return 'from-yellow-300 to-yellow-500';
    case 1:
      return 'from-slate-300 to-slate-400';
    case 2:
      return 'from-amber-600 to-amber-700';
    default:
      return 'from-slate-400 to-slate-500';
  }
};

const getMedalEmoji = (index: number) => {
  switch (index) {
    case 0:
      return '🥇';
    case 1:
      return '🥈';
    case 2:
      return '🥉';
    default:
      return '🏅';
  }
};

export default function Leaderboard({ scores }: LeaderboardProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600">
        <h2 className="text-2xl font-bold text-white text-center flex items-center justify-center gap-2">
          <span>🏆</span> Top Speeds <span>🏆</span>
        </h2>
      </div>
      
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {scores.map((score, index) => (
          <div
            key={index}
            className="px-6 py-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br ${getMedalColor(index)} text-2xl transform group-hover:scale-110 transition-transform duration-200`}>
                {getMedalEmoji(index)}
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {score.wpm} WPM
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Accuracy: {score.accuracy}%
                </div>
              </div>
            </div>
            <div className="text-sm text-slate-400 dark:text-slate-500">
              {new Date(score.date).toLocaleDateString()}
            </div>
          </div>
        ))}
        
        {scores.length === 0 && (
          <div className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
            No scores yet. Start typing to set some records! 🚀
          </div>
        )}
      </div>
    </div>
  );
} 