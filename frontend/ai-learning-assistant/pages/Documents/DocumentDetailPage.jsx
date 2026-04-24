import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowUp } from 'lucide-react';
import documentService from '../../services/documentService';
import aiService from '../../services/aiService';

const DocumentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [summary, setSummary] = useState('');
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatAnswer, setChatAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState('');

  const fetchDocument = async () => {
    setLoading(true);
    try {
      const response = await documentService.getDocumentById(id);
      setDocument(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const runAction = async (actionName, fn) => {
    setBusyAction(actionName);
    try {
      await fn();
    } catch (error) {
      toast.error(error.message || 'Action failed');
    } finally {
      setBusyAction('');
    }
  };

  const handleGenerateSummary = () =>
    runAction('summary', async () => {
      const response = await aiService.generateSummary(id);
      setSummary(response.data.summary);
      toast.success('Summary generated');
    });

  const handleGenerateFlashcards = () =>
    runAction('flashcards', async () => {
      await aiService.generateFlashcards(id, { count: 10 });
      toast.success('Flashcards generated');
      navigate(`/documents/${id}/flashcards`);
    });

  const handleGenerateQuiz = () =>
    runAction('quiz', async () => {
      const response = await aiService.generateQuiz(id, { numQuestions: 5 });
      toast.success('Quiz generated');
      navigate(`/quizzes/${response.data._id}`);
    });

  const handleAskAI = () =>
    runAction('chat', async () => {
      if (!chatQuestion.trim()) {
        toast.error('Enter a question first');
        return;
      }
      const response = await aiService.chat(id, chatQuestion.trim());
      setChatAnswer(response.data.answer);
    });

  if (loading) {
    return <div className="rounded-xl border border-slate-200 bg-white p-4">Loading document...</div>;
  }

  if (!document) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">Document not found.</div>;
  }

  const hasSummary = Boolean(summary);
  const hasFlashcards = (document.flashcardCount || 0) > 0;
  const hasQuiz = (document.quizCount || 0) > 0;

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <h1 className="text-2xl font-semibold">{document.title}</h1>
        <p className="text-sm text-slate-500">
          Status: {document.status} | Flashcards: {document.flashcardCount || 0} | Quizzes: {document.quizCount || 0}
        </p>
        {document.filePath && (
          <a href={document.filePath} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-emerald-700 underline">
            Open uploaded PDF
          </a>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <h2 className="mb-1 text-lg font-medium">Learning workflow</h2>
        <p className="mb-3 text-xs text-slate-500">Step 1: Understand. Step 2: Practice. Step 3: Test.</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleGenerateSummary}
            disabled={busyAction !== ''}
            className="rounded-lg border border-blue-700 bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-200 disabled:opacity-70"
          >
            {busyAction === 'summary' ? 'Generating summary...' : 'Generate Summary'}
          </button>
          <button
            type="button"
            onClick={handleGenerateFlashcards}
            disabled={busyAction !== ''}
            className="rounded-lg border border-emerald-700 bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:-translate-y-1 hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-200 disabled:opacity-70"
          >
            {busyAction === 'flashcards' ? 'Generating flashcards...' : 'Generate Flashcards'}
          </button>
          <button
            type="button"
            onClick={handleGenerateQuiz}
            disabled={busyAction !== ''}
            className="rounded-lg border border-violet-700 bg-violet-600 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:-translate-y-1 hover:bg-violet-700 hover:shadow-md hover:shadow-violet-200 disabled:opacity-70"
          >
            {busyAction === 'quiz' ? 'Generating quiz...' : 'Generate Quiz'}
          </button>
          <Link
            to={`/documents/${id}/flashcards`}
            className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 transition-all duration-200 hover:-translate-y-1 hover:bg-amber-100 hover:shadow-md hover:shadow-amber-200"
          >
            Learn Flashcards
          </Link>
        </div>
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next best action</p>
          <p className="mt-1 text-sm text-slate-700">
            {!hasSummary && 'Generate a summary first to build context quickly.'}
            {hasSummary && !hasFlashcards && 'Great. Now generate flashcards for active recall.'}
            {hasSummary && hasFlashcards && !hasQuiz && 'Nice progress. Generate a quiz to test mastery.'}
            {hasSummary && hasFlashcards && hasQuiz && 'Everything is ready. Continue practice from flashcards or quiz.'}
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <h2 className="mb-3 text-lg font-medium">Document summary</h2>
        <p className="whitespace-pre-wrap text-sm text-slate-700">
          {summary || 'No summary yet. Click "Generate Summary" to create a quick overview before practicing.'}
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <h2 className="mb-3 text-lg font-medium">Ask AI about this document</h2>
        <div className="space-y-2">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-200/80 bg-white px-2.5 py-1.5 shadow-sm">
            <textarea
              rows={1}
              value={chatQuestion}
              onChange={(e) => setChatQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (busyAction === '') {
                    handleAskAI();
                  }
                }
              }}
              placeholder="Ask anything"
              className="min-h-[24px] w-full resize-none bg-transparent px-2 py-2 pr-12 text-[14px] leading-tight text-slate-700 outline-none placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={handleAskAI}
              disabled={busyAction !== ''}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-900 p-2 text-white transition hover:scale-105 hover:bg-slate-800 disabled:opacity-70"
              aria-label="Send question"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>

          {chatAnswer && (
            <div className="w-full max-w-xl rounded-2xl border border-emerald-100 bg-white p-3">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-600">Answer</p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{chatAnswer}</p>
            </div>
          )}

          {busyAction === 'chat' && (
            <p className="text-sm text-slate-500">Thinking...</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default DocumentDetailPage;
