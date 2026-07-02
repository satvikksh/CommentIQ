import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentAnalysis from "@/components/dashboard/RecentAnalysis";
import AnalysisChart from "@/components/dashboard/AnalysisChart";
import SentimentChart from "@/components/dashboard/SentimentChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import AIInsights from "@/components/dashboard/AIInsights";
import TopCategories from "@/components/dashboard/TopCategories";
import RecentComments from "@/components/dashboard/RecentComments";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <TopNavbar />

        <main className="space-y-8 p-8">

          <WelcomeBanner />

          <DashboardHeader />

          <StatsCards />

          <QuickActions />

          {/* Charts */}
          <div className="grid gap-8 xl:grid-cols-2">
            <AnalysisChart />
            <SentimentChart />
          </div>

          {/* AI Section */}
          <div className="grid gap-8 xl:grid-cols-2">
            <AIInsights />
            <TopCategories />
          </div>

          {/* Category Chart */}
          <CategoryChart />

          {/* Comments */}
          <RecentComments />

          {/* Analysis + Activity */}
          <div className="grid gap-8 xl:grid-cols-2">
            <RecentAnalysis />
            <ActivityFeed />
          </div>

        </main>
      </div>
    </div>
  );
}