import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import quizService from '../../services/quizService';

const QuizzResultPage = () => {
  const { quizzId } = useParams();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await quizService.getQuizResults(quizzId);
        setResultData(response.data);
      } catch (error) {
        toast.error(error.message || 'Failed to load quiz results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [quizzId]);

  if (loading) return <div className="rounded-xl border border-slate-200 bg-white p-4">Loading results...</div>;
  if (!resultData) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">No result found.</div>;

  const { quiz, results } = resultData;

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h1 className="text-2xl font-semibold">Quiz Results</h1>
        <p className="text-sm text-slate-500">{quiz.title}</p>
        <p className="mt-2 text-lg font-medium text-emerald-700">Score: {quiz.score}%</p>
      </section>

      {results.map((item) => (
        <section key={item.questionIndex} className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="font-medium">
            {item.questionIndex + 1}. {item.question}
          </p>
          <p className="mt-2 text-sm">
            Your answer: <span className={item.isCorrect ? 'text-emerald-700' : 'text-red-600'}>{item.selectedAnswer || 'Not answered'}</span>
          </p>
          <p className="text-sm text-slate-700">Correct answer: {item.correctAnswer}</p>
          {item.explanation && <p className="mt-2 text-sm text-slate-600">Explanation: {item.explanation}</p>}
        </section>
      ))}
    </div>
  );
};

export default QuizzResultPage;
