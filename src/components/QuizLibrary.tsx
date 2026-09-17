import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import { ArrowLeft, BookOpen, CheckCircle2, XCircle, Code, Filter } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface QuizLibraryProps {
  onBack: () => void;
}

export const QuizLibrary: React.FC<QuizLibraryProps> = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const categories = ['Semua', 'Variable', 'Loop', 'Function', 'Array', 'Logic', 'Bug Fixing'];

  const filteredQuestions = selectedCategory === 'Semua'
    ? QUIZ_QUESTIONS
    : QUIZ_QUESTIONS.filter((q) => q.category === selectedCategory);

  const handleSelectOption = (questionId: string, optIdx: number, correctIdx: number) => {
    soundManager.playClick();
    setAnswers((prev) => ({ ...prev, [questionId]: optIdx }));
    setShowExplanation((prev) => ({ ...prev, [questionId]: true }));
    if (optIdx === correctIdx) {
      soundManager.playQuizCorrect();
    } else {
      soundManager.playQuizWrong();
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 text-slate-100 flex flex-col p-4 sm:p-6 overflow-y-auto font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 max-w-5xl mx-auto w-full">
        <button
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-colors text-xs sm:text-sm font-mono"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Menu</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black font-mono tracking-wider text-cyan-400 flex items-center justify-center gap-2">
            <BookOpen size={22} />
            <span>BANK SOAL LOGIKA PEMROGRAMAN</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Pelajari konsep & uji pemahaman logika komputasi untuk Netherium
          </p>
        </div>

        <div className="w-16 hidden sm:block" />
      </div>

      {/* Categories Filter */}
      <div className="max-w-5xl mx-auto w-full my-4 flex items-center gap-2 overflow-x-auto pb-2">
        <Filter size={16} className="text-slate-500 shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              soundManager.playClick();
              setSelectedCategory(cat);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono shrink-0 transition-colors ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="max-w-5xl mx-auto w-full space-y-4 pb-12">
        {filteredQuestions.map((q, qIndex) => {
          const userAnswer = answers[q.id];
          const hasAnswered = userAnswer !== undefined;
          const isCorrect = userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-purple-300">
                  {q.category}
                </span>
                <span className="text-xs font-mono text-slate-500">Soal #{qIndex + 1}</span>
              </div>

              <h4 className="text-sm sm:text-base font-semibold text-slate-100">{q.question}</h4>

              {q.codeSnippet && (
                <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto whitespace-pre">
                  {q.codeSnippet}
                </div>
              )}

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt, optIdx) => {
                  let style = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-600';
                  if (hasAnswered) {
                    if (optIdx === q.correctIndex) {
                      style = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-bold';
                    } else if (optIdx === userAnswer) {
                      style = 'bg-rose-950/50 border-rose-500 text-rose-200';
                    } else {
                      style = 'opacity-50 border-slate-800 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(q.id, optIdx, q.correctIndex)}
                      className={`p-2.5 rounded-lg border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
                    >
                      <span>
                        <span className="font-mono text-slate-400 mr-2">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        {opt}
                      </span>
                      {hasAnswered && optIdx === q.correctIndex && (
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0 ml-1" />
                      )}
                      {hasAnswered && optIdx === userAnswer && !isCorrect && (
                        <XCircle size={16} className="text-rose-400 shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {hasAnswered && (
                <div
                  className={`p-3 rounded-lg border text-xs leading-relaxed animate-fade-in ${
                    isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  }`}
                >
                  <p className="font-semibold mb-0.5">
                    {isCorrect ? '✅ Jawaban Benar!' : '❌ Kurang Tepat.'}
                  </p>
                  <p className="text-slate-300">
                    <span className="font-medium text-white">Pembahasan: </span>
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
