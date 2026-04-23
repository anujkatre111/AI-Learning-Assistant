import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import flashcardService from '../../services/flashcardService';

const FlashCardsPage = () => {
  const { id } = useParams();
  const [set, setSet] = useState(null);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const response = await flashcardService.getFlashcardsForDocument(id);
        setSet(response.data?.[0] || null);
      } catch (error) {
        toast.error(error.message || 'Failed to load flashcards');
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, [id]);

  const cards = set?.cards || [];
  const currentCard = cards[index];
  const progress = useMemo(() => (cards.length ? `${index + 1}/${cards.length}` : '0/0'), [cards.length, index]);

  const reviewCard = async () => {
    if (!currentCard?._id) return;
    try {
      await flashcardService.reviewFlashcard(currentCard._id, index);
    } catch (error) {
      toast.error(error.message || 'Could not update review');
    }
  };

  const toggleStar = async () => {
    if (!currentCard?._id) return;
    try {
      await flashcardService.toggleStar(currentCard._id);
      const updated = { ...set };
      updated.cards[index].isStarred = !updated.cards[index].isStarred;
      setSet(updated);
    } catch (error) {
      toast.error(error.message || 'Could not update star');
    }
  };

  const nextCard = async () => {
    await reviewCard();
    setShowAnswer(false);
    setIndex((prev) => Math.min(prev + 1, cards.length - 1));
  };

  const prevCard = () => {
    setShowAnswer(false);
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  if (loading) return <div className="rounded-xl border border-slate-200 bg-white p-4">Loading flashcards...</div>;

  if (!set || cards.length === 0) {
    return <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-600">No flashcards generated for this document yet.</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Flashcard study</h1>
        <p className="text-sm text-slate-500">
          {set.documentId?.title || 'Document'} - {progress}
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="mb-2 text-xs uppercase text-slate-500">Question</p>
        <p className="text-lg font-medium">{currentCard.question}</p>

        {showAnswer && (
          <>
            <p className="mb-2 mt-5 text-xs uppercase text-slate-500">Answer</p>
            <p className="text-sm text-slate-700">{currentCard.answer}</p>
          </>
        )}
      </section>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={prevCard} className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100">
          Previous
        </button>
        <button
          type="button"
          onClick={() => setShowAnswer((prev) => !prev)}
          className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white"
        >
          {showAnswer ? 'Hide answer' : 'Show answer'}
        </button>
        <button type="button" onClick={nextCard} className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white">
          Next
        </button>
        <button
          type="button"
          onClick={toggleStar}
          className={`rounded-md border px-3 py-2 text-sm ${currentCard.isStarred ? 'border-yellow-400 bg-yellow-50 text-yellow-700' : 'border-slate-300 hover:bg-slate-100'}`}
        >
          {currentCard.isStarred ? 'Unstar' : 'Star'}
        </button>
      </div>
    </div>
  );
};

export default FlashCardsPage;
