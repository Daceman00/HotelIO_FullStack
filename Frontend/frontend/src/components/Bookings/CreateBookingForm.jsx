import React from "react";

function CreateBookingForm() {
  return (
    <div className="lg:w-1/3 flex items-start lg:items-center">
      <div className="px-[30px] pl-[40px]">
        <h3 className="text-gray-800 mb-7">Your Reservation</h3>
        <form>
          <div className="relative mb-[15px]">
            <label
              htmlFor="checkIn"
              className="text-sm text-gray-500 block mb-2"
            />
            <input
              type="text"
              id="checkIn"
              placeholder="Check In"
              className="w-full h-12 border border-gray-200 rounded text-base text-gray-800 uppercase font-medium pl-5"
            />
            <i className="fas fa-calendar text-[#dfa974] absolute right-4 bottom-4"></i>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBookingForm;
