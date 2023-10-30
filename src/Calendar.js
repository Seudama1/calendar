import React, { useState } from 'react';
import './Calendar.css';
import { db } from "./firebase-config"
import { collection, getDocs, addDoc} from "firebase/firestore"

const Calendar = ({events}) => {
  // State variables for the current date and view type (day, week, or month)
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');
  // Logic to handle previous button click for different views (day, week, month)
  const handlePrev = () => {
    if (view === 'day') {
      setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1));
    } else if (view === 'week') {
      setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7));
    } else {
      setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    }
  };
  // Logic to handle next button click for different views (day, week, month)
  const handleNext = () => {
    if (view === 'day') {
      setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1));
    } else if (view === 'week') {
      setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7));
    } else {
      setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    }
  };
  //render days based on the current view type (day, week, month)
  // Returns an array of React elements representing the calendar days
  const renderDays = () => {
    const days = [];

    if (view === 'day') {
      // Render a single day
      days.push(
        <tr key="day-row">
          <td>{date.toDateString()}</td>
        </tr>
      );
    } else if (view === 'week') {
      // Render a week starting from the current date
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Move to the beginning of the week
      const monthName = weekStart.toLocaleString('en-US', { month: 'long' });

      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + i);
        days.push(
          <td key={`week-day-${i}`}>
            <div className="day-container">
              <div className="day-number">{day.getDate()}</div>
              <div className="month-name">{monthName}</div>
            </div>
          </td>
        );
      }
    } else {
      // Render the entire month
      const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
      const totalDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      let dayCount = 1;
      for (let i = 0; i < 6; i++) {
        const cells = [];
        for (let j = 0; j < 7; j++) {
          if (i === 0 && j < firstDayOfMonth) {
            // Empty cell before the first day of the month
            cells.push(<td key={`empty-${j}`}></td>);
          } else if (dayCount <= totalDays) {
            // Day cells
            cells.push(<td key={`day-${dayCount}`}>{dayCount}</td>);
            dayCount++;
          }
        }
        days.push(<tr key={`row-${i}`}>{cells}</tr>);
      }
    }

    return days;
  };

  const renderEvents = () => {
    return events.map((event) => {
      const eventStart = new Date(event.start.toDate());
      const eventEnd = new Date(event.end.toDate());
  
      const isEventVisible =
        (view === 'day' && eventStart.toDateString() === date.toDateString()) ||
        (view === 'week' &&
          eventStart >= new Date(date.getFullYear(), date.getMonth(), date.getDate()) &&
          eventEnd <= new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7)) ||
        (view === 'month' &&
          eventStart >= new Date(date.getFullYear(), date.getMonth(), 1) &&
          eventEnd <= new Date(date.getFullYear(), date.getMonth() + 1, 0));
  
      if (isEventVisible) {
        return (
          <div key={event.id} className="event">
            {event.title}
          </div>
        );
      }
      return null;
    });
  };
  return (
    <div className="calendar">
        {/* View buttons to switch between day, week, and month */}
        <div className="view-buttons">
        <button onClick={() => setView('day')}>Day</button>
        <button onClick={() => setView('week')}>Week</button>
        <button onClick={() => setView('month')}>Month</button>
      </div>
      {/* Header section with navigation buttons and current month/year display */}
      <div className="header">
        <button onClick={handlePrev}>&lt;</button>
        <h1>{date.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h1>
        <button onClick={handleNext}>&gt;</button>
      </div>
      {/* Table to display the calendar days */}
      <table className="calendar-table">
        {/* Table headers for days of the week (visible in week and month views) */}
        {view !== 'day' && (
          <thead>
            <tr>
              <th>Sun</th>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th>Sat</th>
            </tr>
          </thead>
        )}
        {/* Table body containing rendered days */}
        <tbody>{renderDays()}</tbody>
      </table>
      <div>
        {renderEvents()}
      </div>
    </div>
  );
};

export default Calendar;