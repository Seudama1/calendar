import './App.css';
import Calendar from './Calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";

function App() {
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    id: 1,
  });
  const [allEvents, setAllEvents] = useState(
    JSON.parse(localStorage.getItem("events")) || []
  );
  const handleAddEvent = () => {
    setAllEvents((prev) => {
      let ev = { ...newEvent };

      let dt = new Date(ev.end);
      dt.setDate(dt.getDate() + 1);
      ev.end = dt;
      console.log("ev", ev);
      console.log("prev", newEvent);
      return [...prev, ev];
    });
    setNewEvent({
      title: "",
      start: "",
      end: "",
      id: 1,
    });
  };
  
  localStorage.setItem("events", JSON.stringify(allEvents));
 
  return (
    <div className="App">
      <div className="title">C O O L E N D A R</div>
      <Calendar />
      <div className="form-contain">
          <input
            type="text"
            placeholder="Add title"
            style={{ width: "20%", marginRight: "10px " }}
            value={newEvent?.title}
            onChange={(e) => {
              setNewEvent((p) => {
                return {
                  ...p,
                  id: new Date().getMilliseconds(),
                  title: e.target.value,
                };
              });
            }}
          />
          <DatePicker
            placeholderText="Start date"
            selected={newEvent?.start}
            onChange={(start) => {
              setNewEvent((p) => {
                return { ...p, start };
              });
            }}
            style={{ marginLeft: "200px" }}
            allowSameDay={true}
          />
          <DatePicker
            placeholderText="End date"
            selected={newEvent?.end}
            onChange={(end) => {
              let dt = new Date(end);
              dt.setDate(dt.getDate() + 1);
              setNewEvent((p) => {
                return { ...p, end };
              });
            }}
            allowSameDay={true}
          />
          <button onClick={handleAddEvent} disabled={newEvent?.title === ""}>
            Add Event
          </button>
        </div>
    </div>
  );
}

export default App;
