import React, { useEffect, useState } from "react";
import {
  Hotel,
  Users,
  Star,
  Globe,
  Heart,
  Code,
  Sparkles,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Hotel className="w-8 h-8" />,
      title: "Premium Hotels",
      description: "Discover luxury accommodations worldwide",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Top Rated",
      description: "Only the finest hotels with excellent reviews",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach",
      description: "Available in destinations across the globe",
    },
  ];

  const stats = [
    { number: "10K+", label: "Hotels Listed" },
    { number: "500K+", label: "Happy Guests" },
    { number: "150+", label: "Countries" },
    { number: "4.9★", label: "Average Rating" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-6 transform hover:scale-110 transition-transform duration-300">
            <Hotel className="w-10 h-10" style={{ color: "#dfa379" }} />
          </div>
          <h1 className="text-6xl font-bold text-gray-800 mb-4 tracking-tight">
            Hotel<span style={{ color: "#dfa379" }}>IO</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your gateway to extraordinary hotel experiences around the world
          </p>
        </div>

        {/* Features Section */}
        <div
          className={`grid md:grid-cols-3 gap-8 mb-16 transform transition-all duration-1000 delay-200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white rounded-3xl p-8 shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                activeFeature === index
                  ? "ring-4 ring-white ring-opacity-50"
                  : ""
              }`}
              style={{
                background:
                  activeFeature === index
                    ? "linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)"
                    : "white",
              }}
            >
              <div
                className="flex items-center justify-center w-16 h-16 rounded-full mb-6 mx-auto transform transition-all duration-300 hover:rotate-12"
                style={{ backgroundColor: "#dfa379" }}
              >
                <div className="text-white">{feature.icon}</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div
          className={`bg-white rounded-3xl p-8 mb-16 shadow-xl transform transition-all duration-1000 delay-400 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div
                  className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300"
                  style={{ color: "#dfa379" }}
                >
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div
          className={`bg-white rounded-3xl p-12 mb-16 shadow-xl transform transition-all duration-1000 delay-600 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                About HotelIO
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                HotelIO revolutionizes the way travelers discover and book
                exceptional accommodations. Our platform connects discerning
                guests with the world's finest hotels, ensuring every journey
                becomes an unforgettable experience.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                From boutique luxury resorts to iconic city hotels, we curate
                only the best properties that meet our rigorous standards for
                quality, service, and guest satisfaction.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" style={{ color: "#dfa379" }} />
                  <span className="text-gray-700">Made with passion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" style={{ color: "#dfa379" }} />
                  <span className="text-gray-700">Worldwide coverage</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div
                className="w-full h-80 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500"
                style={{
                  background:
                    "linear-gradient(135deg, #dfa379 0%, #f59e0b 100%)",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-2xl font-bold mb-2">
                      Premium Experience
                    </h3>
                    <p className="text-amber-100">Luxury at your fingertips</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Creator Section */}
        <div
          className={`bg-white rounded-3xl p-12 shadow-xl transform transition-all duration-1000 delay-800 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="text-center">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: "#dfa379" }}
            >
              <Code className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Meet the Creator
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto text-lg">
              HotelIO was crafted by a passionate developer who believes in the
              power of technology to transform travel experiences. With years of
              experience in web development and a love for hospitality, this
              platform represents the perfect fusion of technical excellence and
              user-centered design.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-amber-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                <Users
                  className="w-8 h-8 mb-3 mx-auto"
                  style={{ color: "#dfa379" }}
                />
                <h3 className="font-bold text-gray-800 mb-2">User-Focused</h3>
                <p className="text-gray-600 text-sm">
                  Designed with travelers in mind
                </p>
              </div>
              <div className="bg-amber-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                <Star
                  className="w-8 h-8 mb-3 mx-auto"
                  style={{ color: "#dfa379" }}
                />
                <h3 className="font-bold text-gray-800 mb-2">Quality First</h3>
                <p className="text-gray-600 text-sm">Committed to excellence</p>
              </div>
              <div className="bg-amber-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                <Globe
                  className="w-8 h-8 mb-3 mx-auto"
                  style={{ color: "#dfa379" }}
                />
                <h3 className="font-bold text-gray-800 mb-2">Global Vision</h3>
                <p className="text-gray-600 text-sm">Connecting the world</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`text-center py-8 transform transition-all duration-1000 delay-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <p className="text-gray-600 text-lg">
            Ready to discover your next perfect stay?
          </p>
          <Link to={"/rooms"}>
            <button className="mt-4 bg-white text-amber-600 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-amber-200">
              Start Exploring
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default About;
