import './App.css';
import Calendar from './Calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState,useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { db } from "./firebase-config"
import { collection, getDocs, addDoc} from "firebase/firestore"

function App() {
  const [newEvent, setNewEvent] = useState({});//Represents the details of the new event to be added.
  const [allEvents, setAllEvents] = useState([]);//Contains an array of all events.
  const [events, setEvents] = useState([]); // State to store events fetched from Firestore

  const handleAddEvent = async () => {// This function adds the new event to both Firestore and the local state 
    const event = {
      title: newEvent.title,
      start: newEvent.start,
      end: newEvent.end,
    };
    try {
      const docRef = await addDoc(collection(db, "events"), event);
      console.log("Event added with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding event: ", error);
    }
    
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
    });
  };

  const fetchEventsFromFirestore = async () => {
    const eventsCollectionRef = collection(db, 'events');
    const querySnapshot = await getDocs(eventsCollectionRef);
    const eventData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEvents(eventData);
  };

  useEffect(() => {
    // Fetch events from Firestore when the component mounts
    fetchEventsFromFirestore();
  }, []);

  useEffect(() => {//local storage attempt
    localStorage.setItem("events", JSON.stringify(allEvents));
  }, [allEvents]);

  
  return (
    <div className="App">
      <div className="title">C O O L E N D A R</div>
      <Calendar events={events} />
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
