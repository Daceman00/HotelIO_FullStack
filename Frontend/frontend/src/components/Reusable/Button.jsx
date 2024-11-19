function Button({ children, isAccent }) {
  return (
    <button
      className={`${
        isAccent ? " hover: text-white_primary" : " hover: text-white_primary"
      } font-bold py-2 px-4 rounded transition-transform transform hover:scale-105 hover:shadow-lg `}
    >
      {children}
    </button>
  );
}

export default Button;
