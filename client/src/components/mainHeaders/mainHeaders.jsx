import React from "react";
import PropTypes from "prop-types";

export default function MainHeaders({ Headers }) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center gap-3 sm:gap-6 lg:gap-8">
        <div className="flex-1 max-w-8 sm:max-w-16 lg:max-w-24 border-t border-violet-950"></div>
        <h1 className="text-violet-950 text-2xl lg:text-3xl xl:text-4xl font-bold text-center whitespace-nowrap">
          {Headers}
        </h1>
        <div className="flex-1 max-w-8 sm:max-w-16 lg:max-w-24 border-t border-violet-950"></div>
      </div>
    </div>
  );
}

MainHeaders.propTypes = {
  Headers: PropTypes.string.isRequired,
};
