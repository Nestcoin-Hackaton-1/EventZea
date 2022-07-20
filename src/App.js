import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import "./App.css";
import "./bem/home.css";
import "./bem/header.css";
import "./bem/footer.css";
import "./bem/event.css";
import "./bem/discover.css";
import "./bem/profile.css";
import EventPage from "./pages/EventPage";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import Resell from "./pages/Resell";
import { store } from "./store";
import { Provider } from "react-redux";
import { EventProvider } from "./context/EventContext";
import AttendanceCheck from "./pages/AttendanceCheck";

function App() {
  return (
    <Provider store={store}>
      <EventProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/event" element={<EventPage />} />
            <Route exact path="/discover" element={<Discover />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/resell" element={<Resell />} />
            <Route exact path="/check" element={<AttendanceCheck />} />
          </Routes>
          <NotificationContainer />
        </BrowserRouter>
        <NotificationContainer />
      </EventProvider>
    </Provider>
  );
}

export default App;
