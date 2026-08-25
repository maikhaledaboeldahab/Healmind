import { useState, useEffect } from "react";
import WelcomeCard from "../components/Doctor/WelcomCard/WelcomCard";
import StatCard from "../components/Doctor/StatusCard/StatCard";
import TodaysSessions from "../components/Doctor/TodaySessions/TodaySessions";
import UpcomingSessions from "../components/Doctor/UpcomingSessions/UpcomingSessions";
import RecentPatients from "../components/Doctor/RecentPatients/RecentPatients";
import QuickActions from "../components/Doctor/QuickActions/QuickActions";
import { useDoctor } from "../context/DoctorContext";

const DoctorHome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { patients, requests, todaysSessions, upcomingSessions, recentPatients } = useDoctor();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const pendingRequestsCount = requests.filter((r) => r.status === "pending").length;

  const dynamicStats = [
    {
      icon: "fa-users",
      label: "Total Patients",
      value: patients.length,
      badgeText: `Active (${patients.filter((p) => p.status === "Approved").length})`,
      badgeColor: "success",
    },
    {
      icon: "fa-ticket",
      label: "Pending Requests",
      value: pendingRequestsCount,
      badgeText: pendingRequestsCount > 0 ? "Needs Review" : "Up to Date",
      badgeColor: pendingRequestsCount > 0 ? "warning" : "success",
    },
    {
      icon: "fa-calendar-check",
      label: "Upcoming Sessions",
      value: upcomingSessions.length + todaysSessions.length,
      badgeText: "Today",
      badgeColor: "neutral",
    },
  ];

  return (
    <div>
      <WelcomeCard doctorName="Farah" sessionsToday={todaysSessions.length} />

      <div className="row g-3 mb-4">
        {dynamicStats.map((item) => (
          <div className="col-12 col-md-4" key={item.label}>
            <StatCard {...item} isLoading={isLoading} />
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="mb-4">
            <TodaysSessions sessions={todaysSessions} isLoading={isLoading} />
          </div>
          <UpcomingSessions sessions={upcomingSessions} isLoading={isLoading} />
        </div>

        <div className="col-lg-4">
          <div className="mb-4">
            <QuickActions />
          </div>
          <RecentPatients patients={recentPatients} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default DoctorHome;