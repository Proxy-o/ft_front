import { useState } from "react";

const Hover = (props: any) => {
  const { children, hoverText } = props;
  const [leaveHover, setLeaveHover] = useState(false);

  return (
    <>
      <div
        onMouseEnter={() => {
          setLeaveHover(true);
        }}
        onMouseLeave={() => {
          setLeaveHover(false);
        }}
        className="relative"
      >
        {leaveHover && (
          <div
            className={
              `
            absolute text-white  -bottom-6 bg-background p-1 rounded-md text-xs border-2 left-1/3
            ` + (leaveHover ? "move-down" : "")
            }
          >
            {hoverText}
          </div>
        )}
        {children}
      </div>
      <style jsx>{``}</style>
    </>
  );
};

export default Hover;
