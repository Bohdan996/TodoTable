import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

import "./Tooltip.scss";

type TooltipPosition = "top" | "bottom" | "left" | "right";

type TooltipProps = {
  content: string;
  children: React.ReactNode;
  dontShow?: boolean;
  position?: TooltipPosition;
};

export default function Tooltip({ 
  content, 
  children, 
  dontShow,
  position = "top",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [adjustedPosition, setAdjustedPosition] = useState<TooltipPosition>(position);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !tooltipRef.current || !wrapperRef.current) return;

    const calculatePosition = () => {
      const tooltip = tooltipRef.current;
      const wrapper = wrapperRef.current;
      if (!tooltip || !wrapper) return;

      const wrapperRect = wrapper.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const margin = 8;
      const gap = 8;

      let newPosition = position;
      let top = 0;
      let left = 0;

      const fitsTop = wrapperRect.top - tooltipRect.height - gap >= margin;
      const fitsBottom = wrapperRect.bottom + tooltipRect.height + gap <= viewportHeight - margin;
      const fitsLeft = wrapperRect.left - tooltipRect.width - gap >= margin;
      const fitsRight = wrapperRect.right + tooltipRect.width + gap <= viewportWidth - margin;

      if (position === "top" && !fitsTop && fitsBottom) {
        newPosition = "bottom";
      } else if (position === "bottom" && !fitsBottom && fitsTop) {
        newPosition = "top";
      } else if (position === "left" && !fitsLeft && fitsRight) {
        newPosition = "right";
      } else if (position === "right" && !fitsRight && fitsLeft) {
        newPosition = "left";
      } else if ((position === "top" || position === "bottom") && !fitsTop && !fitsBottom) {
        newPosition = fitsRight ? "right" : fitsLeft ? "left" : position;
      } else if ((position === "left" || position === "right") && !fitsLeft && !fitsRight) {
        newPosition = fitsBottom ? "bottom" : fitsTop ? "top" : position;
      }

      switch (newPosition) {
        case "top":
          top = wrapperRect.top - tooltipRect.height - gap;
          left = wrapperRect.left + (wrapperRect.width / 2) - (tooltipRect.width / 2);
          break;
        case "bottom":
          top = wrapperRect.bottom + gap;
          left = wrapperRect.left + (wrapperRect.width / 2) - (tooltipRect.width / 2);
          break;
        case "left":
          top = wrapperRect.top + (wrapperRect.height / 2) - (tooltipRect.height / 2);
          left = wrapperRect.left - tooltipRect.width - gap;
          break;
        case "right":
          top = wrapperRect.top + (wrapperRect.height / 2) - (tooltipRect.height / 2);
          left = wrapperRect.right + gap;
          break;
      }

      if (newPosition === "top" || newPosition === "bottom") {
        if (left < margin) {
          left = margin;
        } else if (left + tooltipRect.width > viewportWidth - margin) {
          left = viewportWidth - tooltipRect.width - margin;
        }
      }

      if (newPosition === "left" || newPosition === "right") {
        if (top < margin) {
          top = margin;
        } else if (top + tooltipRect.height > viewportHeight - margin) {
          top = viewportHeight - tooltipRect.height - margin;
        }
      }

      setAdjustedPosition(newPosition);
      setCoords({ top, left });
    };

    calculatePosition();

    window.addEventListener('scroll', calculatePosition, true);
    window.addEventListener('resize', calculatePosition);

    return () => {
      window.removeEventListener('scroll', calculatePosition, true);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [visible, position]);

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className={clsx(
        "Tooltip__content", 
        `Tooltip__content--${adjustedPosition}`,
        {
          "Tooltip__content--hidden": !visible,
          "Tooltip__content--disable": dontShow,
        }
      )}
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
      }}
      role="tooltip"
    >
      {content}
      <span className={clsx(
          "Tooltip__arrow",
          `Tooltip__arrow--${adjustedPosition}`
        )} 
      />
    </div>
  );

  return (
    <>
      <div
        ref={wrapperRef}
        className="Tooltip"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        {children}
      </div>
      {createPortal(tooltipContent, document.body)}
    </>
  );
}