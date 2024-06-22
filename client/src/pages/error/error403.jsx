import React from "react";

export default function Error403() {
  return (
    <section className="flex items-center h-screen p-16 w-full dark:bg-gray-900 dark:text-gray-100">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-600">
            <span className="sr-only">Error</span>403
          </h2>
          <p className="text-2xl font-semibold md:text-3xl">
            Unauthorized Access
          </p>
          <p className="text-2xl font-semibold md:text-3xl">
            Your hotel has been unverified due to some suspicious acts.
          </p>
          <p className="mt-4 mb-8 dark:text-gray-400">
            But dont worry, you can find plenty of other things on our homepage.
          </p>
          <a
            rel="noopener noreferrer"
            href="#"
            className="px-8 py-3 font-semibold rounded dark:bg-violet-400 dark:text-gray-900"
          >
            Back to homepage
          </a>
        </div>
      </div>
    </section>
  );
}
