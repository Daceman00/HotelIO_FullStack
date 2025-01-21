import React from "react";
import Loading from "../Reusable/Loading"; // Adjust the import path as necessary
import { modes } from "../hooks/useServiceConfig"; // Adjust the import path as necessary

function Login() {
  // ...existing code...

  return (
    <div>
      <Loading mode={modes.all} />
      {/* ...existing code... */}
    </div>
  );
}

export default Login;
