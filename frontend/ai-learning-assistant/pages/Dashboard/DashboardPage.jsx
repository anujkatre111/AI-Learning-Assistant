import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import progressService from '../../services/ProgressService';
import { FileText, Layers, Trophy, Target, ArrowUpRight, Sparkles } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
    <div className="mb-4 flex items-start justify-between">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <span className="inline-flex rounded-lg bg-white p-2 text-emerald-700">
        <Icon className="h-4 w-4" />
      </span>
    </div>
    <p className="text-4xl font-semibold leading-none tracking-tight text-slate-900">{value}</p>
  </div>
);

const DashboardPage = () => {
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData();
        setDashboardData(data.data);
      } catch (fetchError) {
        setError(fetchError.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  const overview = dashboardData?.overview || {};
  const recentDocuments = dashboardData?.recentActivity?.documents || [];
  const recentQuizzes = dashboardData?.recentActivity?.quizzes || [];
  const averageScore = Number(overview.averageScore || 0);
  const latestDocument = recentDocuments[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500">Track momentum and keep your learning flow consistent.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileText} label="Documents" value={overview.totalDocuments || 0} />
        <StatCard icon={Layers} label="Flashcard sets" value={overview.totalFlashcardSets || 0} />
        <StatCard icon={Trophy} label="Completed quizzes" value={overview.completedQuizzes || 0} />
        <StatCard icon={Target} label="Average score" value={`${averageScore}%`} />
      </div>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-600 p-5 text-white shadow-sm transition-transform duration-300 hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-100">Learning score</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">{averageScore}%</p>
          </div>
          <div className="rounded-full border border-white/30 p-2 transition-transform duration-300 hover:scale-110">
            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 hover:translate-x-0.5" />
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(0, averageScore))}%` }}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Next best action</p>
        {latestDocument ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-900">Continue with `{latestDocument.title}`</p>
              <p className="text-xs text-slate-500">
                Keep momentum: generate a summary, then practice with flashcards.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/documents/${latestDocument._id}`}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                Continue Learning
              </Link>
              <Link
                to="/documents"
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50"
              >
                Open Library
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">Upload your first PDF to unlock summaries, flashcards, and quizzes.</p>
            <Link
              to="/documents"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Upload First Document
            </Link>
          </div>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition-all duration-200 hover:shadow-md">
          <h2 className="mb-3 text-sm font-semibold tracking-tight">Recent documents</h2>
          <div className="space-y-2">
            {recentDocuments.length === 0 ? (
              <p className="text-sm text-slate-500">No activity yet.</p>
            ) : (
              recentDocuments.map((doc) => (
                <div key={doc._id} className="rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-emerald-200 hover:bg-emerald-50/30">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold tracking-tight">{doc.title}</p>
                    <Link to={`/documents/${doc._id}`} className="text-xs font-medium text-emerald-700 hover:underline">
                      Learn
                    </Link>
                  </div>
                  <p className="text-xs text-slate-500">Status: {doc.status}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition-all duration-200 hover:shadow-md">
          <h2 className="mb-3 text-sm font-semibold tracking-tight">Recent quizzes</h2>
          <div className="space-y-2">
            {recentQuizzes.length === 0 ? (
              <p className="text-sm text-slate-500">No quizzes yet.</p>
            ) : (
              recentQuizzes.map((quiz) => (
                <div key={quiz._id} className="rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-emerald-200 hover:bg-emerald-50/30">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold tracking-tight">{quiz.title}</p>
                    <Link to={`/quizzes/${quiz._id}`} className="text-xs font-medium text-emerald-700 hover:underline">
                      Resume
                    </Link>
                  </div>
                  <p className="text-xs text-slate-500">
                    Score: {quiz.score ?? 0}% | Questions: {quiz.totalQuestions}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
