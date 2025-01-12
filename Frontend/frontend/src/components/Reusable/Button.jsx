function Button({ children, isAccent }) {
  return (
    <button
      className={`${
        isAccent
          ? "bg-blue-500 text-white"
          : "bg-white text-blue-500 border border-blue-500"
      } font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300`}
    >
      {children}
    </button>
  );
}

export default Button;
