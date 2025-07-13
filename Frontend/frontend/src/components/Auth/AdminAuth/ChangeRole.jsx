import React, { useEffect, useRef, useState } from "react";
import { useChangeRole } from "./useChangeRole";
import { ChevronDownIcon } from "lucide-react";

function ChangeRole({ currentRole, onRoleChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const roles = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleSelect = (roleValue) => {
    onRoleChange(roleValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`inline-flex items-center justify-between w-full px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
          disabled
            ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer"
        }`}
      >
        <span>{currentRole.toUpperCase()}</span>
        <ChevronDownIcon
          className={`w-3 h-3 ml-1 transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg">
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => handleRoleSelect(role.value)}
              className={`w-full px-3 py-2 text-left text-xs font-medium transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 first:rounded-t-md last:rounded-b-md ${
                currentRole === role.value
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {role.label.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChangeRole;
