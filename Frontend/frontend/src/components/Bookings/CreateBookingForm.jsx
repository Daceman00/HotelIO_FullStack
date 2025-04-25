import { useMemo, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useFormStore from "../../stores/FormStore";
import {
  eachDayOfInterval,
  format,
  parseISO,
  isAfter,
  setHours,
  subDays,
} from "date-fns"; // Add isAfter and setHours
import { useGetRoom } from "../Rooms/useGetRoom";
import { useCreateBooking } from "./useCreateBooking";
import { useGetAllBookingsByRoom } from "./useGetAllBookingsByRoom";
import BookingInfoModal from "./BookingInfoModal";
import { useGetBooking } from "./useGetBooking";
import useDataStore from "../../stores/DataStore";

function CreateBookingForm() {
  const { room } = useGetRoom();
  const { bookings } = useGetAllBookingsByRoom();
  const { bookingData } = useDataStore();
  const { bookingModal } = useDataStore();
  const setBookingModal = useDataStore((state) => state.setBookingModal);
  const closeBookingModal = useDataStore((state) => state.closeBookingModal);
  const { bookingFormData } = useFormStore();
  const updateBookingForm = useFormStore((state) => state.updateBookingForm);
  const resetBookingForm = useFormStore((state) => state.resetBookingForm);
  const { createBooking, isPending, isError } = useCreateBooking();
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);

  useEffect(() => {
    const handleReset = () => resetBookingForm();
    window.addEventListener("resize", handleReset);
    return () => {
      window.removeEventListener("resize", handleReset);
    };
  }, [resetBookingForm]);

  useEffect(() => {
    resetBookingForm();
  }, []);

  const handleDateChange = (field, date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    updateBookingForm(field, formattedDate);
  };

  const parseDate = (dateString) => {
    return dateString ? parseISO(dateString) : null;
  };

  const handleGuestChange = (e) => {
    const value = e.target.value;
    updateBookingForm("numOfGuests", value);
  };

  const onCreateBooking = (e) => {
    e.preventDefault();
    createBooking(
      {
        roomId: room?.data.room.id,
        bookingData: bookingFormData,
      },
      {
        onSettled: () => resetBookingForm(),
      },
      {}
    );
  };

  const now = new Date();
  const noonToday = setHours(new Date(), 12);

  // Correctly calculate booked dates (excludes checkout day)
  const bookedDates = useMemo(
    () =>
      bookings?.data.bookings?.flatMap((booking) =>
        eachDayOfInterval({
          start: parseISO(booking.checkIn),
          end: subDays(parseISO(booking.checkOut), 1), // Subtract 1 day from checkout
        })
      ) || [],
    [bookings?.data.bookings]
  );

  const isDateBooked = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const todayStr = format(now, "yyyy-MM-dd");
    const dateMinusOneDay = subDays(date, -1);

    // Disable all past dates and today if it's past noon
    if (
      isAfter(now, dateMinusOneDay) ||
      (dateStr === todayStr && isAfter(now, noonToday))
    ) {
      return true;
    }

    // Check against existing booked dates (checkIn to checkOut - 1 day)
    return bookedDates.some(
      (bookedDate) => format(bookedDate, "yyyy-MM-dd") === dateStr
    );
  };

  useEffect(() => {
    return () => {
      useDataStore.getState().setBookingData(null);
      useDataStore.getState().setBookingModal(false);
    };
  }, []);

  const isFormValid = useMemo(() => {
    const checkIn = parseDate(bookingFormData.checkIn);
    const checkOut = parseDate(bookingFormData.checkOut);

    return (
      bookingFormData.checkIn &&
      bookingFormData.checkOut &&
      bookingFormData.numOfGuests > 0 &&
      (!checkIn || !checkOut || checkIn < checkOut)
    );
  }, [bookingFormData]);

  const getValidationMessage = () => {
    if (
      !bookingFormData.checkIn ||
      !bookingFormData.checkOut ||
      !bookingFormData.numOfGuests
    ) {
      return "All fields are required";
    }

    const checkIn = parseDate(bookingFormData.checkIn);
    const checkOut = parseDate(bookingFormData.checkOut);

    if (checkIn && checkOut && checkIn >= checkOut) {
      return "Check-in date must be before check-out date";
    }

    return "";
  };

  return (
    <>
      <BookingInfoModal
        bookingData={bookingData}
        isOpen={bookingModal}
        onClose={closeBookingModal}
        isPending={isPending}
        isError={isError}
      />

      <div className="sticky top-8 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Book Your Stay
        </h3>
        <form onSubmit={onCreateBooking} className="space-y-6">
          {/* Check-In Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Check-in date
            </label>
            <div className="relative">
              <DatePicker
                placeholderText="Select check-in date"
                className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#dfa974] focus:border-transparent transition-all"
                selected={parseDate(bookingFormData.checkIn)}
                onChange={(date) => handleDateChange("checkIn", date)}
                filterDate={(date) => !isDateBooked(date)}
                calendarClassName="rounded-lg shadow-lg"
                popperClassName="shadow-lg"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute right-3 top-3.5 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Check-Out Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Check-out date
            </label>
            <div className="relative">
              <DatePicker
                placeholderText="Select check-out date"
                className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#dfa974] focus:border-transparent transition-all"
                selected={parseDate(bookingFormData.checkOut)}
                onChange={(date) => handleDateChange("checkOut", date)}
                filterDate={(date) => !isDateBooked(date)}
                calendarClassName="rounded-lg shadow-lg"
                popperClassName="shadow-lg"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute right-3 top-3.5 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Guests Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Guests</label>
            <div className="relative">
              <div
                className="w-full px-4 py-3 border border-gray-200 rounded-lg cursor-pointer hover:border-[#dfa974] transition-colors flex items-center justify-between"
                onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                role="button"
              >
                <span>{bookingFormData.numOfGuests}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 transform transition-transform ${
                    isGuestDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {isGuestDropdownOpen && (
                <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  {Array.from(
                    { length: room?.data.room.maxGuests || 1 },
                    (_, i) => {
                      const value = i + 1;
                      return (
                        <li
                          key={value}
                          className={`px-4 py-3 cursor-pointer transition-colors ${
                            bookingFormData.numOfGuests === value
                              ? "bg-[#dfa974] text-white"
                              : "hover:bg-[#dfa974]/50"
                          }`}
                          onClick={() => {
                            handleGuestChange({
                              target: { value: value.toString() },
                            });
                            setIsGuestDropdownOpen(false);
                          }}
                        >
                          {value} {value === 1 ? "Guest" : "Guests"}
                        </li>
                      );
                    }
                  )}
                </ul>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-3.5 font-semibold rounded-lg transition-colors duration-200 shadow-sm
              ${
                isFormValid
                  ? "bg-[#dfa974] text-white hover:bg-[#c79162]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Book Now
          </button>

          {!isFormValid && (
            <p className="text-sm text-gray-500 text-center mt-2">
              {getValidationMessage()}
            </p>
          )}
        </form>
      </div>
    </>
  );
}

export default CreateBookingForm;
