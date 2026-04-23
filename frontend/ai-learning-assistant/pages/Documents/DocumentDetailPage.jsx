import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
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

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4">
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

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-medium">AI actions</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleGenerateSummary}
            disabled={busyAction !== ''}
            className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-70"
          >
            {busyAction === 'summary' ? 'Generating...' : 'Generate summary'}
          </button>
          <button
            type="button"
            onClick={handleGenerateFlashcards}
            disabled={busyAction !== ''}
            className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white disabled:opacity-70"
          >
            {busyAction === 'flashcards' ? 'Generating...' : 'Generate flashcards'}
          </button>
          <button
            type="button"
            onClick={handleGenerateQuiz}
            disabled={busyAction !== ''}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm text-white disabled:opacity-70"
          >
            {busyAction === 'quiz' ? 'Generating...' : 'Generate quiz'}
          </button>
          <Link to={`/documents/${id}/flashcards`} className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100">
            View flashcards
          </Link>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-medium">Document summary</h2>
        <p className="whitespace-pre-wrap text-sm text-slate-700">{summary || 'Generate a summary to view it here.'}</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-medium">Ask AI about this document</h2>
        <div className="space-y-2">
          <textarea
            rows={3}
            value={chatQuestion}
            onChange={(e) => setChatQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={handleAskAI}
            disabled={busyAction !== ''}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100 disabled:opacity-70"
          >
            {busyAction === 'chat' ? 'Thinking...' : 'Ask'}
          </button>
          {chatAnswer && <p className="whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-sm">{chatAnswer}</p>}
        </div>
      </section>
    </div>
  );
};

export default DocumentDetailPage;
