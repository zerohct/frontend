import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import AdminLayout from "pages/layouts/AdminLayout";
// import Dashboard from "components/common/StatisticsDashboard";
import AdminEventList from "components/List/EventListAdmin";
// import Registration from "components/Registration/RegistrationTable";
// // import Notifications from "../pages/admin/Notifications";
// // import Attendance from "../pages/admin/Attendance";
// // import Results from "../pages/admin/Results";
// // import Statistics from "../pages/admin/Statistics";
// // import Settings from "../pages/admin/Settings";
// import CreateEventForm from "pages/admin/event/CreateEventForm";
// import EventManagement from "components/event/admin/EventListAdmin";
// import RegistrationUser from "components/Registration/RegistrationUser";
// import UpdateEventForm from "components/event/admin/UpdateEventForm";
// import EventDetailAdmin from "components/event/admin/EventDetailAdmin";
// import EventTypeList from "components/event_type/EventTypeList";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="events" element={<AdminEventList />} />
        {/* 
        <Route index element={<Dashboard />} />
       
        <Route path="registration" element={<Registration />} />
        <Route path="event-types" element={<EventTypeList />} />
        <Route path="create-event" element={<CreateEventForm />} />
        <Route
          path="/admin/event-update/:eventId"
          element={<UpdateEventForm />}
        />
        <Route
          path="/admin/event-detail/:eventId"
          element={<EventDetailAdmin />}
        />
        <Route
          path="/admin/event-registrations/:eventId"
          element={<RegistrationUser />}
        /> */}
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
