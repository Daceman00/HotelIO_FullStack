import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Add this line
import useFormStore from "../../stores/FormStore";
import { format, parseISO } from "date-fns"; // Add parseISO

function CreateBookingForm() {
  const { bookingFormData } = useFormStore(); // Ensure correct reference
  const updateBookingForm = useFormStore((state) => state.updateBookingForm);

  const handleDateChange = (field, date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    updateBookingForm(field, formattedDate);
  };

  const parseDate = (dateString) => {
    return dateString ? parseISO(dateString) : null;
  };

  console.log(bookingFormData.checkIn);

  return (
    <div className="lg:w-1/3 flex items-start lg:items-center lg:mb-[10rem] xl:mb-[17rem] md:mb-[7rem]">
      <div className="px-[30px] pl-[40px] mt-0">
        <h3 className="text-gray-800 mb-7 font-bold text-2xl mt-0">
          Your Reservation
        </h3>
        <form>
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
            >
              <option
                value={bookingFormData.numOfGuests}
                onChange={(date) => updateBookingForm("numOfGuests", date)}
              ></option>
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
  );
}

export default CreateBookingForm;
