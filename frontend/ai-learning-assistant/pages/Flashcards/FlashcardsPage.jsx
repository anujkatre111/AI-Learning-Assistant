import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Heart } from 'lucide-react';
import flashcardService from '../../services/flashcardService';

const FlashCardsPage = () => {
  const { id } = useParams();
  const [set, setSet] = useState(null);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [heartAnimating, setHeartAnimating] = useState(false);

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
      setHeartAnimating(true);
      setTimeout(() => setHeartAnimating(false), 280);
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

  if (loading) return <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">Loading flashcards...</div>;

  if (!set || cards.length === 0) {
    return <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-slate-600">No flashcards generated for this document yet.</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Flashcard Study</h1>
        <p className="text-sm text-slate-500">
          {set.documentId?.title || 'Document'} - {progress}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-6">
        <div style={{ perspective: '1200px' }}>
          <div
            className="relative h-[340px] w-full cursor-pointer transition-transform duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: showAnswer ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
            onClick={() => setShowAnswer((prev) => !prev)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowAnswer((prev) => !prev);
              }
            }}
          >
            <div
              className="absolute inset-0 flex h-full w-full flex-col rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">Question</p>
              <div className="mt-5 flex h-full items-center justify-center">
                <p className="max-w-3xl text-center text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                  {currentCard.question}
                </p>
              </div>
              <p className="text-center text-xs text-slate-400">Click card to reveal answer</p>
            </div>

            <div
              className="absolute inset-0 flex h-full w-full flex-col rounded-2xl border border-emerald-300 bg-emerald-50 p-6 shadow-sm"
              style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Answer</p>
              <div className="mt-5 flex h-full items-center justify-center">
                <p className="max-w-3xl text-center text-xl leading-relaxed text-slate-800 sm:text-2xl">
                  {currentCard.answer}
                </p>
              </div>
              <p className="text-center text-xs text-slate-500">Click card to see question again</p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={prevCard} className="rounded-md border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100">
          Previous
        </button>
        <button
          type="button"
          onClick={() => setShowAnswer((prev) => !prev)}
          className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white transition hover:bg-slate-800"
        >
          {showAnswer ? 'Show Question' : 'Reveal Answer'}
        </button>
        <button type="button" onClick={nextCard} className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white transition hover:bg-emerald-700">
          Next
        </button>
        <button
          type="button"
          onClick={toggleStar}
          className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-all duration-200 hover:-translate-y-0.5 ${
            currentCard.isStarred
              ? 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100'
              : 'border-slate-300 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Heart
            className={`h-4 w-4 transition-all duration-200 ${
              currentCard.isStarred ? 'fill-rose-500 text-rose-500' : 'text-slate-500'
            } ${heartAnimating ? 'scale-125 animate-pulse' : 'scale-100'}`}
          />
          {currentCard.isStarred ? 'Unfavorite' : 'Favorite'}
        </button>
      </div>
    </div>
  );
};

export default FlashCardsPage;
