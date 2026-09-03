import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CustomCalendar({
  checkInDate,
  checkOutDate,
  activeField = "checkIn",
  onActiveFieldChange,
  onDateChange,
  isDarkMode
}) {
  const todayStr = new Date().toISOString().split("T")[0];
  const targetDateForMonth = activeField === "checkOut" && checkOutDate ? checkOutDate : checkInDate;

  const getInitialDate = () => {
    if (targetDateForMonth && targetDateForMonth >= todayStr) {
      const parsed = new Date(targetDateForMonth + "T00:00:00");
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  };

  const [currentDate, setCurrentDate] = useState(getInitialDate);

  useEffect(() => {
    if (targetDateForMonth && targetDateForMonth >= todayStr) {
      const parsed = new Date(targetDateForMonth + "T00:00:00");
      if (!isNaN(parsed.getTime())) {
        setCurrentDate(parsed);
      }
    }
  }, [targetDateForMonth]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    days.push(dateStr);
  }

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (dateStr, e) => {
    e.stopPropagation();
    if (dateStr < todayStr) return;

    if (activeField === "checkIn") {
      const newIn = dateStr;
      let newOut = checkOutDate;
      if (!newOut || newOut <= newIn) {
        const d = new Date(newIn + "T00:00:00");
        d.setDate(d.getDate() + 1);
        newOut = d.toISOString().split("T")[0];
      }
      onDateChange(newIn, newOut, "done");
    } else {
      const newOut = dateStr;
      let newIn = checkInDate;
      if (!newIn || newIn >= newOut) {
        const d = new Date(newOut + "T00:00:00");
        d.setDate(d.getDate() - 1);
        const prevStr = d.toISOString().split("T")[0];
        newIn = prevStr >= todayStr ? prevStr : todayStr;
      }
      onDateChange(newIn, newOut, "done");
    }
  };

  const isBetween = (dateStr) => {
    if (!checkInDate || !checkOutDate) return false;
    return dateStr > checkInDate && dateStr < checkOutDate;
  };

  const isSelectedStart = (dateStr) => dateStr === checkInDate;
  const isSelectedEnd = (dateStr) => dateStr === checkOutDate;
  const isToday = (dateStr) => dateStr === todayStr;

  return (
    <div className={`p-3 font-sans select-none ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          onClick={handlePrevMonth}
          disabled={year <= new Date().getFullYear() && month <= new Date().getMonth()}
          className={`p-1.5 rounded-lg border transition cursor-pointer ${
            isDarkMode
              ? "border-[#334155] hover:bg-[#334155] disabled:opacity-30 disabled:hover:bg-transparent"
              : "border-[#E2E8F0] hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent"
          }`}
        >
          <ChevronLeft size={16} />
        </button>

        <span className="text-xs font-bold uppercase tracking-wider">
          {monthNames[month]} {year}
        </span>

        <button
          onClick={handleNextMonth}
          className={`p-1.5 rounded-lg border transition cursor-pointer ${
            isDarkMode
              ? "border-[#334155] hover:bg-[#334155]"
              : "border-[#E2E8F0] hover:bg-stone-100"
          }`}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((dateStr, index) => {
          if (!dateStr) {
            return <div key={`empty-${index}`} className="w-9 h-9" />;
          }

          const dayNum = parseInt(dateStr.split("-")[2], 10);
          const disabled = dateStr < todayStr;
          const start = isSelectedStart(dateStr);
          const end = isSelectedEnd(dateStr);
          const middle = isBetween(dateStr);

          let btnClass = "w-9 h-9 text-xs font-bold rounded-lg flex items-center justify-center transition cursor-pointer ";

          if (disabled) {
            btnClass += isDarkMode ? "text-gray-600 cursor-not-allowed" : "text-gray-300 cursor-not-allowed";
          } else if (start || end) {
            btnClass += "bg-[#1B5CF8] text-white shadow-md scale-105 z-10";
          } else if (middle) {
            btnClass += isDarkMode ? "bg-[#1B5CF8]/20 text-[#60A5FA]" : "bg-[#1B5CF8]/10 text-[#1B5CF8]";
          } else {
            btnClass += isDarkMode 
              ? "hover:bg-[#334155] text-white" 
              : "hover:bg-[#1B5CF8]/10 text-[#475569]";
          }

          return (
            <button
              key={dateStr}
              type="button"
              onClick={(e) => handleDateClick(dateStr, e)}
              disabled={disabled}
              className={`${btnClass} relative`}
            >
              {dayNum}
              {isToday(dateStr) && !start && !end && (
                <span className={`absolute bottom-1 w-1 h-1 rounded-full ${start || end ? "bg-white" : "bg-[#1B5CF8]"}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend / Info */}
      <div className="mt-3 flex items-center justify-between text-[10px] text-gray-400 font-semibold border-t pt-2.5 border-border-color">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded bg-[#1B5CF8]" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded bg-[#1B5CF8]/20" />
          <span>Stay Range</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border border-[#1B5CF8] flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#1B5CF8]" />
          </div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
