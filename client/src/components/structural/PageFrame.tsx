import React, { PropsWithChildren, createContext, useCallback } from "react";
import { TopNav } from "./TopNav";
import SideNav from "./SideNav";

// export interface PageFrameState {}
// export interface PageFrameActions {}

// export type PageFrameService = [PageFrameState, PageFrameActions];

// export const PageFrameContext = createContext<PageFrameService | null>(null);

// export const usePageFrame = (): PageFrameService => {
//   const context = React.useContext(PageFrameContext);

//   if (context === null) {
//     throw new Error("usePageFrame must be used within a PageFrameProvider");
//   }

//   return context;
// };

export interface Props extends PropsWithChildren {
  title: string;
  className?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  standardWidth?: boolean;
  padding?: boolean;
  // Prevents overflow.
  singlePageApplication?: boolean;
}

export const PageFrame: React.FC<Props> = ({
  children,
  title,
  className,
  left,
  right,
  standardWidth = true,
  padding = true,
  singlePageApplication = false,
}) => {
  const [isSideNavOpen, setIsSideNavOpen] = React.useState(false);

  const toggleSideNav = useCallback(() => {
    setIsSideNavOpen((prev) => !prev);
  }, []);

  return (
    <div className={`${className ?? ""}`}>
      <div className="flex relative h-screen overflow-hidden">
        <SideNav isOpen={isSideNavOpen} className="overflow-y-auto pt-28" />

        <div
          className={`flex flex-col space-x-4 relative flex-1 ${
            singlePageApplication ? "overflow-hidden" : "overflow-y-auto"
          }`}
        >
          <TopNav
            title={title}
            onClickMenu={toggleSideNav}
            isSideMenuActive={isSideNavOpen}
            left={left}
            right={right}
            className="fixed left-0 right-0 z-40 h-20"
          />
          <div
            className={`${padding ? "px-4" : ""} flex-1 ${
              singlePageApplication ? "h-screen pt-20" : "pt-20"
            }`}
          >
            {standardWidth ? (
              <div
                className={`${standardWidth ? "py-10 max-w-7xl mx-auto" : ""}`}
              >
                {children}
              </div>
            ) : (
              <>{children}</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
