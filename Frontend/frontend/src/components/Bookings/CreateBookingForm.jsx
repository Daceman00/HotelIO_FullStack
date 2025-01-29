import { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Add this line
import useFormStore from "../../stores/FormStore";
import { eachDayOfInterval, format, parseISO } from "date-fns"; // Add parseISO
import { useGetRoom } from "../Rooms/useGetRoom";
import Loading from "../Reusable/Loading";
import { modes } from "../../hooks/useServiceConfig";
import { useCreateBooking } from "./useCreateBooking";

import { useGetAllBookingsByRoom } from "./useGetAllBookingsByRoom";

function CreateBookingForm() {
  const { room } = useGetRoom();
  const { bookings } = useGetAllBookingsByRoom(); // Fetch bookings for the room
  const { bookingFormData } = useFormStore(); // Ensure correct reference
  const updateBookingForm = useFormStore((state) => state.updateBookingForm);
  const resetBookingForm = useFormStore((state) => state.resetBookingForm);
  const { createBooking } = useCreateBooking();

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
      { onSettled: () => resetBookingForm() }
    );
  };

  console.log(bookings?.data.bookings);

  const bookedDates = useMemo(() => {
    return bookings?.data.bookings
      ? bookings.data.bookings.flatMap((booking) =>
          eachDayOfInterval({
            start: parseISO(booking.checkIn),
            end: parseISO(booking.checkOut),
          })
        )
      : [];
  }, [bookings?.data.bookings]);

  const isDateBooked = (date) => {
    return bookedDates.some(
      (bookedDate) =>
        format(bookedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  return (
    <>
      <Loading mode={modes.all} />
      <div className="lg:w-1/3 flex items-start lg:items-center lg:mb-[10rem] xl:mb-[17rem] md:mb-[7rem]">
        <div className="px-[30px] pl-[40px] mt-0">
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
                icon="fas fa-calendar"
                className=" w-full h-12 border border-gray-200 rounded text-base text-gray-800 uppercase font-medium pl-5"
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
                icon="fas fa-calendar"
                className=" w-full h-12 border border-gray-200 rounded text-base text-gray-800 uppercase font-medium pl-5"
                selected={parseDate(bookingFormData.checkOut)}
                onChange={(date) => handleDateChange("checkOut", date)}
                filterDate={(date) => !isDateBooked(date)}
              ></DatePicker>
            </div>
            <div className="relative mb-[15px]">
              <label
                className="text-sm text-gray-500 block mb-2.5"
                htmlFor="guest"
              >
                Guests:
              </label>
              <select
                className="rounded border border-gray-200 h-12 flex items-center pl-5 w-full custom-select"
                id="guest"
                value={bookingFormData.numOfGuests}
                onChange={handleGuestChange}
              >
                {Array.from(
                  { length: room?.data.room.maxGuests || 1 },
                  (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="relative mb-[15px]">
              <button className="block text-sm uppercase border border-[#dfa379] rounded text-[#dfa379] font-medium bg-transparent w-full h-11 mt-7">
                Booking Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateBookingForm;
