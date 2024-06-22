import React from "react";

export default function Modals() {
  return (
    <div className="m-10 flex max-w-lg flex-col items-center rounded-md border px-8 py-10 text-gray-800 shadow-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 rounded-xl bg-red-50 p-2 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
      <p className="mt-4 text-center text-xl font-bold">Deleting User</p>
      <p className="mt-2 text-center text-lg">
        Are you sure you want to delete the user{" "}
        <span className="truncate font-medium">James Keyser</span>?
      </p>
      <div className="mt-8 flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
        <button className="whitespace-nowrap rounded-md bg-red-500 px-4 py-3 font-medium text-white">
          Yes, delete the user
        </button>
        <button className="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium">
          Cancel, keep the user
        </button>
      </div>
    </div>
  );
}
