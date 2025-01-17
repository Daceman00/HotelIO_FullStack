function Dashboard() {
  return (
    <section
      className="relative pt-16 pb-24 bg-cover bg-center"
      // style={{ backgroundImage: "url('/path-to-your-image.jpg')" }}
    >
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Sona A Luxury Hotel
            </h1>
            <p className="text-white text-lg mb-6">
              Here are the best hotel booking sites, including recommendations
              for international travel and for finding low-priced hotel rooms.
            </p>
            <a
              href="#"
              className="bg-yellow-500 text-white px-6 py-3 rounded uppercase font-semibold hover:bg-yellow-600"
            >
              Discover Now
            </a>
          </div>
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-bold mb-4">Booking Your Hotel</h3>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="date-in"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Check In:
                </label>
                <input
                  type="text"
                  id="date-in"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-yellow-400"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="date-out"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Check Out:
                </label>
                <input
                  type="text"
                  id="date-out"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-yellow-400"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="guests"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Guests:
                </label>
                <select
                  id="guests"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-yellow-400"
                >
                  <option value="2">2 Adults</option>
                  <option value="3">3 Adults</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="room"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Room:
                </label>
                <select
                  id="room"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-yellow-400"
                >
                  <option value="1">1 Room</option>
                  <option value="2">2 Rooms</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-500 text-white py-2 rounded font-semibold hover:bg-yellow-600"
              >
                Check Availability
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
