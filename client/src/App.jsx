import { lazy } from "react";
import LoadingBarWrapper from "./routes/mainRouter/loadingBarWrapper";
import Router from "./routes/mainRouter/main.Router";

function App() {
  //!Lazy loader is used in every pages of the routes so that when ever user visits the required page the page will only be opened
  //!This will load faster than other because if lazy is not used lets say all the files has 10mb which will load at the same time
  //!But with lazy loading only the required will be loaded so that the loading time will be short and performace will be best

  return (
    <>
      {/* <LoadingBarWrapper> */}
      <Router />
      {/* </LoadingBarWrapper> */}
    </>
  );
}

export default App;
