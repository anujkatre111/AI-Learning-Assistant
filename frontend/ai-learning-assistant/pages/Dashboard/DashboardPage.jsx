import React, { useEffect, useState } from 'react';
import progressService from '../../services/ProgressService';
import { FileText, Layers, Trophy, Target } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4">
    <div className="mb-2 inline-flex rounded-lg bg-slate-100 p-2 text-slate-600">
      <Icon className="h-4 w-4" />
    </div>
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-2xl font-semibold">{value}</p>
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

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-slate-500">Track your learning progress at a glance.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileText} label="Documents" value={overview.totalDocuments || 0} />
        <StatCard icon={Layers} label="Flashcard sets" value={overview.totalFlashcardSets || 0} />
        <StatCard icon={Trophy} label="Completed quizzes" value={overview.completedQuizzes || 0} />
        <StatCard icon={Target} label="Average score" value={`${overview.averageScore || 0}%`} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-medium">Recent documents</h2>
          <div className="space-y-2">
            {recentDocuments.length === 0 ? (
              <p className="text-sm text-slate-500">No activity yet.</p>
            ) : (
              recentDocuments.map((doc) => (
                <div key={doc._id} className="rounded-md border border-slate-100 p-3">
                  <p className="font-medium">{doc.title}</p>
                  <p className="text-xs text-slate-500">Status: {doc.status}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-medium">Recent quizzes</h2>
          <div className="space-y-2">
            {recentQuizzes.length === 0 ? (
              <p className="text-sm text-slate-500">No quizzes yet.</p>
            ) : (
              recentQuizzes.map((quiz) => (
                <div key={quiz._id} className="rounded-md border border-slate-100 p-3">
                  <p className="font-medium">{quiz.title}</p>
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
