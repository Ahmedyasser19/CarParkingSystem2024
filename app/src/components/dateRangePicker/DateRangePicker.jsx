"use client";
import { useEffect, useState } from "react";

import "./dateRangePicker.css";
import CalandarButton from "../CalendarButtons/CalandarButton";

const DateRangePicker = () => {
  const [nav, setNav] = useState(0); // used for left and right buttons between months
  const [calendarObj, setCalendarObj] = useState(null);
  const [userSelectedDate, setUserSelectedDate] = useState({});
  const [trackDateInput, setTrackDateInput] = useState(true);
  const [resetDates, setResetDates] = useState(false);

  useEffect(() => {
    initCalendar();
  }, [nav]);

  function initCalendar() {
    const dtInMS = Date.now();
    const dt = new Date(dtInMS);
    let day = dt.getDate();
    const month = dt.getMonth() + nav;
    const year = dt.getFullYear();
    const options = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };

    if (nav !== 0) {
      day = 1;
    }

    const formatted = new Intl.DateTimeFormat("en-US", options).format(
      new Date(year, month, day)
    );
    console.log(formatted);

    const monthInTxt = formatted.split(" ")[0];
    const yearFrommonthInTxt = formatted.split(" ")[2];

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    setCalendarObj({
      day: day,
      monthTxt: monthInTxt,
      yearTxt: yearFrommonthInTxt,
      daysInMonth: daysInMonth,
      daysToSkip: firstDayOfMonth - 1,
      monthObj: formatted,
    });
  }

  function setDatesOnUserSelect(date) {
    // Create a new object to store the updated dates
    let obj = {};

    // Check if trackDateInput is true and the selected date is less than the start date
    if (trackDateInput && date < userSelectedDate.startDate) {
      // Reset the userSelectedDate object and set trackDateInput to true
      setUserSelectedDate({});
      setTrackDateInput(true);
    } else {
      // Update the userSelectedDate object based on trackDateInput
      if (trackDateInput) {
        console.log("filling first object");
        obj = { ...userSelectedDate, startDate: date, endDate: undefined };
        setTrackDateInput(false);
      } else {
        console.log("filling second object");
        obj = { ...userSelectedDate, endDate: date };
        if (date < userSelectedDate.startDate) {
          // If end date is smaller than start date, reset both dates
          setUserSelectedDate({});
          setTrackDateInput(true);
          return;
        }
        setTrackDateInput(true);
      }
      setUserSelectedDate(obj);
    }
  }

  // console.log(calendarObj);

  return (
    <div className="date-wrapper">
      <div>
        <p className="date-head">SELECT DATE RANGE</p>

        {calendarObj == null ? (
          ""
        ) : (
          <div className="date-range-buttons">
            <button className="hover"> {userSelectedDate.startDate}</button>
            <p>-</p>
            <button className="hover">{userSelectedDate.endDate} </button>
          </div>
        )}
      </div>

      <div className="date-body">
        <div className="date-body-head">
          {calendarObj == null ? (
            ""
          ) : (
            <div>
              <span className="date-body-date-month hover">
                {calendarObj.monthTxt}
              </span>
              <span className="date-body-date-year hover">
                {" "}
                {calendarObj.yearTxt}
              </span>
            </div>
          )}

          <div className="date-body-navigation-buttons">
            <button className="hover" onClick={() => setNav(nav - 1)}>
              {"<"}
            </button>
            <button
              onClick={() => {
                setNav(0);
              }}
              className="hover"
            >
              Today
            </button>
            <button className="hover" onClick={() => setNav(nav + 1)}>
              {">"}
            </button>
          </div>
        </div>
        <div className="date-body-body">
          <div className="tableClass2">
            <table>
              <thead>
                <tr>
                  <td>Mon</td>
                  <td>Tue</td>
                  <td>Wed</td>
                  <td>Thr</td>
                  <td>Fri</td>
                  <td>Sat</td>
                  <td>Sun</td>
                </tr>
              </thead>
              {calendarObj == null ? (
                ""
              ) : (
                <tbody>
                  {
                    <CalandarButton
                      daysToSkip={calendarObj.daysToSkip}
                      daysInMonth={calendarObj.daysInMonth}
                      today={calendarObj.day}
                      monthObj={calendarObj.monthObj}
                      nav={nav}
                      setDate={(date) => setDatesOnUserSelect(date)}
                    />
                  }
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
