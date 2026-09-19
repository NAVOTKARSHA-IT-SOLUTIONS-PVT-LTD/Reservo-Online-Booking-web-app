import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar, Users, MapPin, CheckCircle, Clock, ChevronRight,
  XCircle, Star, Send, Home, QrCode
} from "lucide-react";
import { bookingService } from "../services/booking.service";
import { reviewService } from "../services/review.service";
import { BookingCardSkeleton } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import ErrorScreen from "../components/ErrorScreen";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

const statusMeta = (status) => {
  switch (String(status || "").toUpperCase()) {
    case "CONFIRMED":
      return { label: "Confirmed", className: "bg-emerald-500/10 text-emerald-600", Icon: CheckCircle };
    case "IN_HOUSE":
      return { label: "In-House", className: "bg-purple-500/10 text-purple-600", Icon: Home };
    case "COMPLETED":
      return { label: "Completed", className: "bg-blue-500/10 text-blue-600", Icon: CheckCircle };
    case "CANCELLED":
      return { label: "Cancelled", className: "bg-red-500/10 text-red-600", Icon: XCircle };
    case "PENDING":
      return { label: "Pending", className: "bg-amber-500/10 text-amber-700", Icon: Clock };
    default:
      return { label: status || "Booking", className: "bg-slate-500/10 text-slate-600", Icon: Clock };
  }
};

export default function Bookings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      // History endpoint is the source of truth and includes every status:
      // completed, cancelled, pending, confirmed and in-house.
      const data = await bookingService.getBookingHistory();
      setBookings(data);
    } catch (err) {
      setError(err.message || "Failed to retrieve your bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const upcomingBookings = useMemo(
    () => bookings.filter(b => ["CONFIRMED", "IN_HOUSE"].includes(String(b.status || "").toUpperCase())),
    [bookings]
  );

  const historyBookings = useMemo(
    () => bookings.filter(b => !["CONFIRMED", "IN_HOUSE"].includes(String(b.status || "").toUpperCase())),
    [bookings]
  );

  const displayedBookings = activeTab === "upcoming" ? upcomingBookings : historyBookings;

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const result = await bookingService.cancelBooking(id);
      alert(result?.message || "Booking cancelled successfully.");
      await fetchBookings();
    } catch (err) {
      alert(err.message || "Could not cancel booking.");
    }
  };

  const openReview = (booking) => {
    setReviewBooking(booking);
    setReviewRating(5);
    setReviewComment("");
  };

  const submitReview = async () => {
    if (!reviewBooking?.resortId) return;
    if (!reviewComment.trim()) {
      alert("Please write a short review.");
      return;
    }

    setReviewSubmitting(true);
    try {
      await reviewService.addReview(reviewBooking.resortId, {
        bookingId: reviewBooking.id,
        rating: reviewRating,
        content: reviewComment.trim()
      });
      setReviewBooking(null);
      await fetchBookings();
      alert("Thank you! Your resort review has been submitted.");
    } catch (err) {
      alert(err.message || "Could not submit your review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-light pt-28 pb-20 px-6 font-sans">
        <div className="max-w-[900px] mx-auto space-y-6">
          <div className="border-b border-border-color pb-4">
            <h1 className="text-3xl font-serif font-extrabold text-text-dark">Booking History</h1>
            <p className="text-sm text-text-gray mt-1">Retrieving your reservations...</p>
          </div>
          <div className="space-y-6">
            <BookingCardSkeleton />
            <BookingCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-light pt-28 pb-20 px-6 flex items-center justify-center">
        <ErrorScreen type="network" message={error} onRetry={fetchBookings} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light pt-28 pb-20 px-6 font-sans transition-colors duration-300">
      <div className="max-w-[900px] mx-auto space-y-6 animate-fade-in">
        <div className="border-b border-border-color pb-4">
          <h1 className="text-3xl font-serif font-extrabold text-text-dark">Booking History</h1>
          <p className="text-sm text-text-gray mt-1">
            View your upcoming stays and complete history, including cancelled and completed bookings.
          </p>
        </div>

        <div className="flex border-b border-border-color gap-7">
          {[
            ["upcoming", `Upcoming Trips (${upcomingBookings.length})`],
            ["history", `Booking History (${historyBookings.length})`]
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`pb-3 text-sm font-bold bg-transparent border-none cursor-pointer relative transition-colors ${
                activeTab === id ? "text-primary" : "text-text-gray hover:text-text-dark"
              }`}
            >
              {label}
              {activeTab === id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          {displayedBookings.map((booking) => {
            const meta = statusMeta(booking.status);
            const StatusIcon = meta.Icon;
            const isUpcoming = ["CONFIRMED", "IN_HOUSE"].includes(String(booking.status || "").toUpperCase());
            const isCompleted = String(booking.status || "").toUpperCase() === "COMPLETED";
            const roomNumbers = booking.roomNumbers?.length
              ? booking.roomNumbers.join(", ")
              : (booking.roomNumber || "—");
            const roomTypes = booking.roomTypes?.length
              ? booking.roomTypes.join(", ")
              : (booking.roomTitle || "—");

            return (
              <div
                key={booking.id}
                className="bg-bg-white border border-border-color rounded-3xl p-5 shadow-sm overflow-hidden"
              >
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="w-full md:w-[180px] h-[125px] rounded-2xl overflow-hidden shrink-0 bg-bg-light">
                    {booking.resortImage ? (
                      <img
                        src={booking.resortImage}
                        alt={booking.resortName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-gray">
                        <Home size={28} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <span className="text-[9px] font-bold text-text-gray tracking-wider block">
                          RESERVATION CODE: {booking.code || booking.id}
                        </span>
                        <h3 className="text-[18px] font-serif font-extrabold text-text-dark mt-1">
                          {booking.resortName}
                        </h3>
                      </div>

                      <span className={`shrink-0 text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 ${meta.className}`}>
                        <StatusIcon className="w-3 h-3" />
                        {meta.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-[11px] font-semibold text-text-dark">
                      <div>
                        <span className="text-[9px] text-text-gray block">Stay Dates</span>
                        <span>{formatDate(booking.checkin)} → {formatDate(booking.checkout)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-text-gray block">Room Type</span>
                        <span className="truncate block">{roomTypes}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-text-gray block">Room Number</span>
                        <span>{roomNumbers}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-text-gray block">Guests</span>
                        <span>{booking.guests || 0}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-[11px]">
                      <div className="flex items-center gap-2 text-text-gray">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{booking.location || "India"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-text-dark font-bold sm:justify-end">
                        <span className="text-text-gray font-semibold">Amount:</span>
                        <span className="text-primary">₹{Number(booking.total || 0).toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-border-color">
                      {isUpcoming && String(booking.status || "").toUpperCase() === "CONFIRMED" && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="py-1.5 px-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-[10px] font-bold rounded-lg cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      )}

                      {isCompleted && !booking.reviewed && (
                        <button
                          onClick={() => openReview(booking)}
                          className="py-1.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                          Rate & Review Resort
                        </button>
                      )}

                      {isCompleted && booking.reviewed && (
                        <span className="py-1.5 px-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-lg flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Review Submitted
                        </span>
                      )}

                      <div className="flex-1" />

                      <button
                        onClick={() => {
                          if (booking.resortId) navigate(`/resort/${encodeURIComponent(booking.resortId)}`);
                          else alert("This booking does not contain a valid resort ID.");
                        }}
                        className="py-1.5 px-3 bg-bg-light border border-border-color text-text-dark text-[10px] font-bold rounded-lg hover:border-primary hover:text-primary cursor-pointer flex items-center gap-1"
                      >
                        View Resort <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {displayedBookings.length === 0 && (
            <EmptyState
              title={activeTab === "upcoming" ? "No upcoming trips" : "No booking history"}
              description={
                activeTab === "upcoming"
                  ? "Your confirmed stays will appear here."
                  : "Completed, cancelled and other past bookings will appear here."
              }
              ctaText="Plan a Vacation"
              onCtaClick={() => navigate("/ai-planner")}
              icon={QrCode}
            />
          )}
        </div>
      </div>

      {reviewBooking && (
        <div className="fixed inset-0 z-[10000] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-bg-white rounded-3xl border border-border-color shadow-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-extrabold text-text-dark">Rate your stay</h2>
                <p className="text-xs text-text-gray mt-1">{reviewBooking.resortName}</p>
              </div>
              <button
                onClick={() => setReviewBooking(null)}
                className="w-9 h-9 rounded-full border border-border-color bg-bg-light text-text-dark cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="mt-6">
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-gray mb-2">
                Your Rating
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(value => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setReviewRating(value)}
                    className={`w-10 h-10 rounded-xl border cursor-pointer flex items-center justify-center ${
                      value <= reviewRating
                        ? "border-amber-400 bg-amber-50 text-amber-500"
                        : "border-border-color bg-bg-light text-text-gray"
                    }`}
                  >
                    <Star size={18} className={value <= reviewRating ? "fill-current" : ""} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-gray">
                Your Review
              </label>
              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                rows={5}
                placeholder="Tell us about your stay..."
                className="mt-2 w-full border border-border-color rounded-2xl px-4 py-3 text-sm text-text-dark bg-bg-light outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setReviewBooking(null)}
                className="px-4 py-2.5 rounded-xl border border-border-color bg-bg-white text-text-dark font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={reviewSubmitting}
                onClick={submitReview}
                className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs cursor-pointer border-none disabled:opacity-50 flex items-center gap-2"
              >
                <Send size={13} />
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
