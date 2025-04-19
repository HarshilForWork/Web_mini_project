import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ViewAttendance from "./ViewAttendance";
import RaiseTickets from "./RaiseTickets";
import StudentDownloadAttendance from "./StudentDownloadAttendance"; // Import the new component

function StudentDashboard() {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  const renderComponent = () => {
    switch (activeComponent) {
      case "viewAttendance":
        return <ViewAttendance />;
      case "raiseTicket":
        return <RaiseTickets />;
      case "downloadAttendance":
        return <StudentDownloadAttendance />;
      default:
        return (
          <div style={{ padding: "20px" }}>
            <h1>Student Dashboard</h1>
            <p>View your attendance, raise tickets, or download your attendance records.</p>
            <p>Select an option from the sidebar to get started.</p>
          </div>
        );
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar role="student" setActiveComponent={setActiveComponent} />
      <div style={{ flex: 1, marginLeft: "250px", padding: "20px" }}>
        {renderComponent()}
      </div>
    </div>
  );
}

export default StudentDashboard;
