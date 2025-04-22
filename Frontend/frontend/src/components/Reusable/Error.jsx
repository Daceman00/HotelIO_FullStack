function Error({ message }) {
  return (
    <div className="flex items-center justify-center min-h-[100px] bg-red-100 p-4 rounded-md">
      <span className="text-red-700 font-semibold">{message}</span>
    </div>
  );
}

export default Error;
