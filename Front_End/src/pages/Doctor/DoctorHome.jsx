import { useState, useEffect } from "react";
import WelcomeCard from "../../components/Doctor/WelcomCard/WelcomCard";
import StatCard from "../../components/Doctor/StatusCard/StatCard";
import TodaysSessions from "../../components/Doctor/TodaySessions/TodaySessions";
import UpcomingSessions from "../../components/Doctor/UpcomingSessions/UpcomingSessions";
import RecentPatients from "../../components/Doctor/RecentPatients/RecentPatients";
import QuickActions from "../../components/Doctor/QuickActions/QuickActions";

const todaysSessions = [
  { id: 1, time: "09:00 AM", duration: "50 mins", patientName: "Sarah Jenkins", sessionType: "Weekly Therapy • Anxiety Management", status: "Confirmed" },
  { id: 2, time: "10:30 AM", duration: "40 mins", patientName: "Marcus Thorne", sessionType: "Introductory Call • Depression Screening", status: "New Patient" },
  { id: 3, time: "01:45 PM", duration: "45 mins", patientName: "Elena Rodriguez", sessionType: "Follow-up • Grief Counseling", status: "Pending" },
];

const upcomingSessions = [
  { id: 4, time: "09:30 AM", duration: "50 mins", patientName: "Omar Khalil", sessionType: "Weekly Therapy • Stress Management", status: "Confirmed" },
  { id: 5, time: "12:00 PM", duration: "45 mins", patientName: "Layla Hassan", sessionType: "Follow-up • Anxiety Management", status: "Confirmed" },
  { id: 6, time: "02:30 PM", duration: "40 mins", patientName: "Ahmed Al-Rashid", sessionType: "Introductory Call • Bipolar Disorder", status: "New Patient" },
];

const recentPatients = [
  { id: 1, patientName: "David Chen", note: "New message regarding medication", lastVisit: "10 minutes ago" },
  { id: 2, patientName: "Sarah Jenkins", note: "Session notes finalized", lastVisit: "Yesterday, 4:30 PM" },
  { id: 3, patientName: "Omar Khalil", note: "Profile updated", lastVisit: "2 days ago" },
];

const stats = [
  { icon: "fa-users", label: "Total Patients", value: 124, badgeText: "+4 this week", badgeColor: "success" },
  { icon: "fa-ticket", label: "Pending Tickets", value: 8, badgeText: "High Priority", badgeColor: "warning" },
  { icon: "fa-calendar-check", label: "Upcoming Sessions", value: upcomingSessions.length, badgeText: "Today", badgeColor: "neutral" },
];

const DoctorHome = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <WelcomeCard doctorName="Farah" sessionsToday={todaysSessions.length} />

      <div className="row g-3 mb-4">
        {stats.map((item) => (
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