// LoadingBarWrapper.jsx
import React, { useEffect, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';

const LoadingBarWrapper = ({ children }) => {
  const loadingBarRef = useRef(null);

  useEffect(() => {
    const startLoadingBar = () => {
      loadingBarRef.current?.continuousStart();
    };

    const completeLoadingBar = () => {
      loadingBarRef.current?.complete();
    };

    // Start the loading bar when the component mounts
    startLoadingBar();

    // Cleanup: Stop the loading bar when the component unmounts
    return () => {
      completeLoadingBar();
    };
  }, []); // Ensure that this effect runs only once on component mount

  return (
    <>
      <LoadingBar ref={loadingBarRef} color="#ff0000" />
      {children}
    </>
  );
};

export default LoadingBarWrapper;
