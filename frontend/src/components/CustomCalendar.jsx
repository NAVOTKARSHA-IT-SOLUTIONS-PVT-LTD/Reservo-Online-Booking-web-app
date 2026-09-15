import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CustomCalendar({
  checkInDate,
  checkOutDate,
  activeField: propActiveField,
  onActiveFieldChange,
  onDateChange,
  isDarkMode
}) {
  const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalDateString();

  // Internal active field state to support uncontrolled callers (e.g. Header.jsx)
  const [internalActiveField, setInternalActiveField] = useState(
    propActiveField || (checkInDate && !checkOutDate ? "checkOut" : "checkIn")
  );

  useEffect(() => {
    if (propActiveField) {
      setInternalActiveField(propActiveField);
    }
  }, [propActiveField]);

  const effectiveActiveField = propActiveField || internalActiveField;

  const updateActiveField = (field) => {
    setInternalActiveField(field);
    onActiveFieldChange?.(field);
  };

  const targetDateForMonth =
    effectiveActiveField === "checkOut" && checkInDate
      ? checkInDate
      : checkInDate || checkOutDate;

  const getInitialDate = () => {
    const value = targetDateForMonth || todayStr;
    const parsed = new Date(`${value}T00:00:00`);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const [currentDate, setCurrentDate] = useState(getInitialDate);
  const [hoveredDate, setHoveredDate] = useState(null);

  useEffect(() => {
    if (targetDateForMonth) {
      const parsed = new Date(`${targetDateForMonth}T00:00:00`);
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
  for (let i = 0; i < firstDayIndex; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(
      `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`
    );
  }

  // Month navigation: robust year * 12 + month comparison
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const isPrevDisabled = (year * 12 + month) <= (currentYear * 12 + currentMonth);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (!isPrevDisabled) {
      setCurrentDate(new Date(year, month - 1, 1));
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  /**
   * Date selection behavior:
   * 1st click  -> check-in (auto moves active field to check-out)
   * 2nd click  -> check-out (completes the range)
   * 3rd click  -> start a brand-new range; clicked date becomes check-in
   *
   * If the second click is before/on the current check-in, that clicked date
   * becomes the new check-in instead of creating an invalid range.
   */
  const handleDateClick = (dateStr, e) => {
    e.stopPropagation();
    if (!dateStr || dateStr < todayStr) return;

    // A complete range already exists. Any new click starts a new range.
    if (checkInDate && checkOutDate) {
      onDateChange(dateStr, "", "checkIn");
      updateActiveField("checkOut");
      return;
    }

    // No check-in yet, or we are explicitly selecting check-in.
    if (!checkInDate || effectiveActiveField === "checkIn") {
      onDateChange(dateStr, "", "checkIn");
      updateActiveField("checkOut");
      return;
    }

    // We have a check-in and are selecting check-out.
    if (dateStr <= checkInDate) {
      // Clicking an earlier or same date resets check-in to this date.
      onDateChange(dateStr, "", "checkIn");
      updateActiveField("checkOut");
      return;
    }

    // Valid second click: this is the check-out date.
    onDateChange(checkInDate, dateStr, "done");
    updateActiveField("checkIn");
    setHoveredDate(null);
  };

  const isBetween = (dateStr) => {
    if (!checkInDate || !checkOutDate) return false;
    return dateStr > checkInDate && dateStr < checkOutDate;
  };

  const isInHoverRange = (dateStr) => {
    if (!checkInDate || checkOutDate || !hoveredDate) return false;
    return dateStr > checkInDate && dateStr <= hoveredDate;
  };

  const isSelectedStart = (dateStr) => dateStr === checkInDate;
  const isSelectedEnd = (dateStr) => dateStr === checkOutDate;
  const isToday = (dateStr) => dateStr === todayStr;

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const date = new Date(y, m, d);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  };

  const getNightsCount = () => {
    if (!checkInDate || !checkOutDate) return null;
    const start = new Date(`${checkInDate}T00:00:00`);
    const end = new Date(`${checkOutDate}T00:00:00`);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  const nights = getNightsCount();

  return (
    <div
      className={`p-3 sm:p-3.5 font-sans select-none w-full max-w-[340px] mx-auto text-text-dark`}
      onMouseLeave={() => setHoveredDate(null)}
    >
      {/* Interactive Check-In / Check-Out Header Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            updateActiveField("checkIn");
          }}
          className={`p-2 sm:p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
            effectiveActiveField === "checkIn"
              ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30"
              : "border-border-color hover:border-primary/40 bg-bg-light/60 dark:bg-slate-700/40"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-text-gray flex items-center justify-between">
            <span>Check-In</span>
            {effectiveActiveField === "checkIn" && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            )}
          </div>
          <div className="text-xs font-bold text-text-dark mt-0.5 truncate">
            {checkInDate ? formatDisplayDate(checkInDate) : "Select date"}
          </div>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            updateActiveField("checkOut");
          }}
          className={`p-2 sm:p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
            effectiveActiveField === "checkOut"
              ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30"
              : "border-border-color hover:border-primary/40 bg-bg-light/60 dark:bg-slate-700/40"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-text-gray flex items-center justify-between">
            <span>Check-Out</span>
            {effectiveActiveField === "checkOut" && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            )}
          </div>
          <div className="text-xs font-bold text-text-dark mt-0.5 truncate">
            {checkOutDate ? formatDisplayDate(checkOutDate) : "Select date"}
          </div>
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <button
          type="button"
          onClick={handlePrevMonth}
          disabled={isPrevDisabled}
          aria-label="Previous month"
          className="p-1.5 rounded-xl border border-border-color hover:bg-stone-100 dark:hover:bg-slate-700 disabled:opacity-25 disabled:cursor-not-allowed transition cursor-pointer text-text-dark"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-text-dark">
            {monthNames[month]} {year}
          </span>
          {nights && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {nights} {nights === 1 ? "night" : "nights"}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          aria-label="Next month"
          className="p-1.5 rounded-xl border border-border-color hover:bg-stone-100 dark:hover:bg-slate-700 transition cursor-pointer text-text-dark"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Helper instruction */}
      <div className="text-center mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-gray/80">
          {!checkInDate
            ? "Choose your arrival date"
            : !checkOutDate
              ? "Choose your departure date"
              : `${nights || 1} night stay selected`}
        </span>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-y-1 text-center text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-text-gray mb-1">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((dateStr, index) => {
          if (!dateStr) {
            return <div key={`empty-${index}`} className="w-full h-9" />;
          }

          const dayNum = parseInt(dateStr.split("-")[2], 10);
          const disabled = dateStr < todayStr;
          const isStart = isSelectedStart(dateStr);
          const isEnd = isSelectedEnd(dateStr);
          const middle = isBetween(dateStr);
          const hoverRange = isInHoverRange(dateStr);
          const today = isToday(dateStr);

          // Continuous Ribbon background on cell wrapper
          let wrapperBg = "w-full h-9 flex items-center justify-center relative ";
          if (isStart && checkOutDate) {
            wrapperBg += "bg-primary/15 dark:bg-primary/25 rounded-l-xl";
          } else if (isEnd && checkInDate) {
            wrapperBg += "bg-primary/15 dark:bg-primary/25 rounded-r-xl";
          } else if (middle) {
            wrapperBg += "bg-primary/15 dark:bg-primary/25";
          } else if (hoverRange) {
            wrapperBg += `bg-primary/10 ${dateStr === hoveredDate ? "rounded-r-xl" : ""}`;
          }

          // Individual button styling
          let btnClass =
            "w-8.5 h-8.5 sm:w-9 sm:h-9 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center transition-all cursor-pointer relative ";

          if (disabled) {
            btnClass += "text-text-gray/30 dark:text-slate-600 line-through cursor-not-allowed pointer-events-none";
          } else if (isStart || isEnd) {
            btnClass += "bg-primary text-white font-extrabold shadow-md scale-105 z-10";
          } else if (middle) {
            btnClass += "text-primary dark:text-blue-300 font-bold hover:bg-primary/20 rounded-none w-full";
          } else if (hoverRange) {
            btnClass += "text-primary font-semibold";
          } else {
            btnClass += "text-text-dark hover:bg-stone-100 dark:hover:bg-slate-700/60 hover:text-primary";
          }

          return (
            <div key={dateStr} className={wrapperBg}>
              <button
                type="button"
                onClick={(e) => handleDateClick(dateStr, e)}
                onMouseEnter={() => {
                  if (checkInDate && !checkOutDate && dateStr > checkInDate) {
                    setHoveredDate(dateStr);
                  }
                }}
                disabled={disabled}
                className={btnClass}
              >
                {dayNum}
                {today && !isStart && !isEnd && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer: Legend & Reset action */}
      <div className="mt-3 flex items-center justify-between text-[10px] text-text-gray font-medium border-t pt-2.5 border-border-color">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
            <span className="text-[10px] font-semibold">Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-xs bg-primary/25" />
            <span className="text-[10px] font-semibold">Stay</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full ring-1 ring-primary bg-transparent" />
            <span className="text-[10px] font-semibold">Today</span>
          </div>
        </div>

        {(checkInDate || checkOutDate) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDateChange("", "", "checkIn");
              updateActiveField("checkIn");
            }}
            className="text-[10px] font-bold text-text-gray hover:text-red-500 transition-colors cursor-pointer border-none bg-transparent"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

