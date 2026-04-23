import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import quizService from '../../services/quizService';

const QuizTakePage = () => {
  const { quizzId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const response = await quizService.getQuizById(quizzId);
        setQuiz(response.data);
      } catch (error) {
        toast.error(error.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizzId]);

  const handlePick = (questionIndex, option) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    const payload = quiz.questions.map((_, questionIndex) => ({
      questionIndex,
      selectedAnswer: answers[questionIndex] || '',
    }));

    setSubmitting(true);
    try {
      await quizService.submitQuiz(quizzId, payload);
      toast.success('Quiz submitted');
      navigate(`/quizzes/${quizzId}/results`);
    } catch (error) {
      toast.error(error.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="rounded-xl border border-slate-200 bg-white p-4">Loading quiz...</div>;
  if (!quiz) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">Quiz not found.</div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{quiz.title}</h1>
        <p className="text-sm text-slate-500">{quiz.totalQuestions} questions</p>
      </div>
      <div className="space-y-3">
        {quiz.questions.map((question, questionIndex) => (
          <section key={questionIndex} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-2 font-medium">
              {questionIndex + 1}. {question.question}
            </p>
            <div className="space-y-2">
              {question.options.map((option) => (
                <label key={option} className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 hover:bg-slate-50">
                  <input
                    type="radio"
                    name={`question-${questionIndex}`}
                    checked={answers[questionIndex] === option}
                    onChange={() => handlePick(questionIndex, option)}
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-70"
      >
        {submitting ? 'Submitting...' : 'Submit quiz'}
      </button>
    </div>
  );
};

export default QuizTakePage;
