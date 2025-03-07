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
import Loading from "../Reusable/Loading";
import { modes } from "../../hooks/useServiceConfig";
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
  const { createBooking } = useCreateBooking();
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

  return (
    <>
      <Loading mode={modes.all} />
      <div className="lg:w-1/3 flex items-start lg:items-center lg:mb-[10rem] xl:mb-[17rem] md:mb-[7rem]">
        <div className="px-[30px] pl-[40px] mt-0 border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-gray-800 mb-7 font-bold text-2xl mt-0">
            Your Reservation
          </h3>
          <form onSubmit={onCreateBooking}>
            <div className="relative mb-[15px]">
              <label
                htmlFor="checkIn"
                className="text-sm text-gray-500 block mb-2"
              />
              <DatePicker
                showIcon
                placeholderText="Check In"
                toggleCalendarOnIconClick
                className="w-full h-12 border border-gray-200 hover:border-[#dfa379] rounded text-base text-gray-800 uppercase font-medium pl-5"
                selected={parseDate(bookingFormData.checkIn)}
                onChange={(date) => handleDateChange("checkIn", date)}
                filterDate={(date) => !isDateBooked(date)}
              ></DatePicker>
            </div>
            <div className="relative mb-[15px]">
              <label
                htmlFor="checkIn"
                className="text-sm text-gray-500 block mb-2"
              />
              <DatePicker
                showIcon
                placeholderText="Check Out"
                toggleCalendarOnIconClick
                className="w-full h-12 border border-gray-200 hover:border-[#dfa379] rounded text-base text-gray-800 uppercase font-medium pl-5"
                selected={parseDate(bookingFormData.checkOut)}
                onChange={(date) => handleDateChange("checkOut", date)}
                filterDate={(date) => !isDateBooked(date)}
              ></DatePicker>
            </div>

            <div className="relative mb-[15px]">
              <label className="text-sm text-gray-500 block mb-2.5">
                Guests:
              </label>
              <div className="relative">
                {/* Custom dropdown trigger */}
                <div
                  className="rounded border border-gray-200 h-12 flex items-center pl-5 pr-10 w-full cursor-pointer hover:border-[#dfa379] transition-colors"
                  onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                  role="button"
                >
                  {bookingFormData.numOfGuests}
                  <svg
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-transform ${
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

                {/* Custom dropdown options */}
                {isGuestDropdownOpen && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-40 overflow-y-auto">
                    {Array.from(
                      { length: room?.data.room.maxGuests || 1 },
                      (_, i) => {
                        const value = i + 1;
                        return (
                          <li
                            key={value}
                            className={`px-5 py-3 cursor-pointer transition-colors ${
                              bookingFormData.numOfGuests === value
                                ? "bg-[#dfa379] text-white"
                                : "hover:bg-[#dfa379] hover:text-white"
                            }`}
                            onClick={() => {
                              handleGuestChange({
                                target: { value: value.toString() },
                              });
                              setIsGuestDropdownOpen(false);
                            }}
                            role="option"
                            aria-selected={
                              bookingFormData.numOfGuests === value
                            }
                          >
                            {value}
                          </li>
                        );
                      }
                    )}
                  </ul>
                )}
              </div>
            </div>

            <div className="relative mb-[15px]">
              <button className="block text-sm uppercase border border-[#dfa379] rounded text-[#dfa379] font-medium bg-transparent w-full h-11 mt-7">
                Booking Now
              </button>
            </div>
          </form>
        </div>
      </div>
      <BookingInfoModal
        bookingData={bookingData}
        isOpen={bookingModal}
        onClose={closeBookingModal}
      />
    </>
  );
}

export default CreateBookingForm;
