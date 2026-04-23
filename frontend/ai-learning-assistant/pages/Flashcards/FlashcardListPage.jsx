import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import flashcardService from '../../services/flashcardService';

const FlashcardListPage = () => {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSets = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getAllFlashcardSets();
      setSets(response.data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load flashcard sets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSets();
  }, []);

  const handleDelete = async (id) => {
    try {
      await flashcardService.deleteFlashcardSet(id);
      toast.success('Flashcard set deleted');
      await fetchSets();
    } catch (error) {
      toast.error(error.message || 'Failed to delete set');
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h1 className="mb-3 text-2xl font-semibold">Flashcards</h1>
      {loading ? (
        <p className="text-sm text-slate-500">Loading flashcard sets...</p>
      ) : sets.length === 0 ? (
        <p className="text-sm text-slate-500">No flashcard sets found yet.</p>
      ) : (
        <div className="space-y-3">
          {sets.map((set) => (
            <div key={set._id} className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{set.documentId?.title || 'Untitled document'}</p>
                <p className="text-xs text-slate-500">Cards: {set.cards?.length || 0}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/documents/${set.documentId?._id}/flashcards`} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100">
                  Open
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(set._id)}
                  className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashcardListPage;
