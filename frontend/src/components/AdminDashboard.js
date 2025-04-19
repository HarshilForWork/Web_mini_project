import React, { useState } from "react";
import Sidebar from "./Sidebar";
import AddStudent from "./AddStudent";
import AddTeacher from "./AddTeacher";
import CreateClass from "./CreateClass";
import AddSubject from "./AddSubject";

function AdminDashboard() {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  const renderComponent = () => {
    switch (activeComponent) {
      case "addStudent":
        return <AddStudent />;
      case "addTeacher":
        return <AddTeacher />;
      case "createClass":
        return <CreateClass />;
      case "addSubject":
        return <AddSubject />;
      default:
        return (
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage students, teachers, classes, and subjects.</p>
            <p>Select an option from the sidebar to get started.</p>
          </div>
        );
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar role="admin" setActiveComponent={setActiveComponent} />

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: "270px", paddingTop: "20px" }}>
        {renderComponent()}
      </div>
    </div>
  );
}

export default AdminDashboard;
