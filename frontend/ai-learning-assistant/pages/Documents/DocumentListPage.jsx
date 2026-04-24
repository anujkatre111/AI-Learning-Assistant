import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import documentService from '../../services/documentService';
import { Download, FileText, UploadCloud } from 'lucide-react';

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const templateCsv = 'title,description\nBiology Chapter 1,Cell basics\nPhysics Notes,Motion and force';

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await documentService.getDocuments();
      setDocuments(data || []);
    } catch (error) {
      toast.error(error.message || 'Unable to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      toast.error('Please choose a PDF file');
      return;
    }

    const finalTitle = title.trim() || file.name.replace(/\.[^/.]+$/, '');
    const formData = new FormData();
    formData.append('title', finalTitle);
    formData.append('file', file);

    setSubmitting(true);
    try {
      await documentService.uploadDocument(formData);
      toast.success('Document uploaded successfully');
      setTitle('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await fetchDocuments();
    } catch (error) {
      toast.error(error.message || 'Failed to upload');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await documentService.deleteDocument(id);
      toast.success('Document deleted');
      await fetchDocuments();
    } catch (error) {
      toast.error(error.message || 'Failed to delete');
    }
  };

  const handleTemplateDownload = () => {
    const blob = new Blob([templateCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const visibleDocuments = [...documents]
    .filter((doc) => {
      const matchesQuery = doc.title?.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'all' ? true : doc.status === statusFilter;
      return matchesQuery && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
        <p className="text-sm text-slate-500">Upload source material and start learning in one click.</p>
      </div>

      <form onSubmit={handleUpload} className="max-w-xl rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-800">Add Document</h2>
        <div className="mt-4 space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document title (optional)"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
          <label className="group block cursor-pointer rounded-2xl border border-dashed border-emerald-200 bg-white px-4 py-8 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50/40">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-transform duration-200 group-hover:scale-105">
              {file ? <FileText className="h-5 w-5" /> : <UploadCloud className="h-5 w-5" />}
            </div>
            <p className="text-base font-medium text-slate-800">Import PDF File</p>
            <p className="mt-1 text-sm text-slate-500">
              {file ? file.name : 'Drop file or click here to choose file.'}
            </p>
          </label>
          <button
            type="button"
            onClick={handleTemplateDownload}
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition-all duration-200 hover:translate-x-0.5 hover:text-emerald-700"
          >
            <Download className="h-4 w-4" />
            Download CSV Template
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 disabled:opacity-70"
          >
            {submitting ? 'Uploading...' : 'Upload document'}
          </button>
        </div>
      </form>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
        <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Your documents</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title"
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            >
              <option value="all">All statuses</option>
              <option value="uploaded">Uploaded</option>
              <option value="processed">Processed</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            >
              <option value="newest">Newest first</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>
        {loading ? (
          <p className="text-sm text-slate-500">Loading documents...</p>
        ) : documents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <p className="text-sm font-medium text-slate-700">No documents yet.</p>
            <p className="mt-1 text-xs text-slate-500">Upload your first PDF above to start learning.</p>
          </div>
        ) : visibleDocuments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <p className="text-sm font-medium text-slate-700">No matches found.</p>
            <p className="mt-1 text-xs text-slate-500">Try changing search text or filters.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleDocuments.map((doc) => (
              <div
                key={doc._id}
                className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold tracking-tight">{doc.title}</p>
                  <p className="text-xs text-slate-500">
                    Status: {doc.status} | Flashcards: {doc.flashcardCount || 0} | Quizzes: {doc.quizCount || 0}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/documents/${doc._id}`)}
                    className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-all duration-200 hover:bg-emerald-100"
                  >
                    Learn
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(doc._id)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DocumentListPage;
