import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types/game';
import { soundManager } from '../audio/soundManager';
import { CheckCircle2, XCircle, Clock, Zap, BookOpen, ChevronRight } from 'lucide-react';

interface QuizModalProps {
  question: QuizQuestion;
  nextRoundNumber: number;
  onAnswerComplete: (answeredCorrectly: boolean) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  question,
  nextRoundNumber,
  onAnswerComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // 10s countdown timer
  useEffect(() => {
    if (isAnswered) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAnswered]);

  const handleTimeout = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setIsCorrect(false);
    soundManager.playQuizWrong();
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);
    const correct = idx === question.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      soundManager.playQuizCorrect();
    } else {
      soundManager.playQuizWrong();
    }
  };

  const handleContinue = () => {
    onAnswerComplete(isCorrect);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] rounded-xl overflow-hidden text-slate-100 font-sans">
        {/* Header */}
        <div className="bg-slate-950 border-b border-slate-800 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="text-cyan-400" size={20} />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                NETHERIUM LOGIC CHECKPOINT
              </h3>
              <p className="text-xs text-slate-400">
                Sebelum Ronde {nextRoundNumber} dimulai • Jawab untuk bonus!
              </p>
            </div>
          </div>

          {/* 10s Timer */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-sm font-bold ${
              timeLeft <= 3 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-cyan-500/20 text-cyan-300'
            }`}
          >
            <Clock size={16} />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="h-1.5 bg-slate-800 w-full overflow-hidden">
          <div
            className="h-full bg-cyan-400 transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / 10) * 100}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Category Badge */}
          <div className="inline-block px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-purple-500/20 border border-purple-500/40 text-purple-300">
            Kategori: {question.category}
          </div>

          {/* Question Text */}
          <h4 className="text-base sm:text-lg font-semibold text-slate-100 leading-snug">
            {question.question}
          </h4>

          {/* Code Snippet Box (if any) */}
          {question.codeSnippet && (
            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto shadow-inner whitespace-pre">
              {question.codeSnippet}
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {question.options.map((opt, idx) => {
              let btnStyle = 'bg-slate-800/80 border-slate-700 hover:border-cyan-400 text-slate-200';
              if (isAnswered) {
                if (idx === question.correctIndex) {
                  btnStyle = 'bg-emerald-600/30 border-emerald-400 text-emerald-200 font-bold';
                } else if (idx === selectedIdx) {
                  btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-200';
                } else {
                  btnStyle = 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-3 rounded-lg border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>
                    <span className="font-mono font-bold text-slate-400 mr-2">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                  </span>
                  {isAnswered && idx === question.correctIndex && (
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 ml-1" />
                  )}
                  {isAnswered && idx === selectedIdx && idx !== question.correctIndex && (
                    <XCircle size={18} className="text-rose-400 shrink-0 ml-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Result & Educational Explanation */}
          {isAnswered && (
            <div
              className={`p-3.5 rounded-lg border text-xs sm:text-sm space-y-1.5 animate-fade-in ${
                isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {isCorrect ? (
                  <>
                    <Zap className="text-amber-400" size={16} />
                    <span>BENAR! Kamu mendapatkan +20 Stamina & +1 Debug Token (Ultimate Move)!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-rose-400" size={16} />
                    <span>WAKTU HABIS / KURANG TEPAT! (Tidak ada pengurangan, tetap semangat!)</span>
                  </>
                )}
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                <span className="font-semibold text-white">Penjelasan: </span>
                {question.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer with Continue Button */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex justify-end">
          <button
            id="btn-quiz-continue"
            disabled={!isAnswered}
            onClick={handleContinue}
            className={`px-5 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              isAnswered
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Mulai Ronde {nextRoundNumber}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
