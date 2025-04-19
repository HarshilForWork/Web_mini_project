import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MarkAttendance from "./MarkAttendance"; // Import MarkAttendance component
import DownloadAttendance from "./DownloadAttendance"; // Import DownloadAttendance component
import ViewTickets from "./ViewTickets"; // Import ViewTickets component

function TeacherDashboard() {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  const renderComponent = () => {
    switch (activeComponent) {
      case "markAttendance":
        return <MarkAttendance />;
      case "downloadAttendance":
        return <DownloadAttendance />;
      case "viewTickets":
        return <ViewTickets />; // Render ViewTickets component
      default:
        return (
          <div style={{ padding: "20px" }}>
            <h1>Teacher Dashboard</h1>
            <p>Manage attendance, download attendance records, and respond to student tickets.</p>
            <p>Select an option from the sidebar to get started.</p>
          </div>
        );
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar role="teacher" setActiveComponent={setActiveComponent} />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          marginLeft: "250px", // Adjust to match your sidebar width
          paddingTop: "20px",
          padding: "20px",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        {renderComponent()}
      </div>
    </div>
  );
}

export default TeacherDashboard;
