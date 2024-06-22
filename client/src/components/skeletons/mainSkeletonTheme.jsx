import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function MainSkeletonTheme({ children }) {
  return (
    <div>
      <SkeletonTheme baseColor="#e2e8f0" highlightColor="#cbd5e1">
        {children}
      </SkeletonTheme>
    </div>
  );
}
