// Line icons from the Figma "Icons" frame.
// Usage: <Icon name="arrow-right" className="size-5" />
// They use currentColor, so set the colour with text-* classes.

const paths = {
  "arrow-right": "M5 12H19M13 18L19 12L13 6",
  "arrow-up-right": "M7 17L17 7M17 16V7H8",
  "arrow-up": "M12 19V5M18 11L12 5L6 11",
  "arrow-left": "M19 12H5M11 18L5 12L11 6",
  menu: "M4 9H20M4 15H20",
  close: "M6 6L18 18M18 6L6 18",
  check: "M5 12.5L9.5 17L19 7",
  "chevron-down": "M6 9L12 15L18 9",
  "chevron-left": "M15 6L9 12L15 18",
  "chevron-right": "M9 6L15 12L9 18",
  mail: "M5 5H19C20.1 5 21 5.9 21 7V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V7C3 5.9 3.9 5 5 5ZM3 7L12 13L21 7",
  quote:
    "M10 7H6C4.9 7 4 7.9 4 9V13H9V18H4M20 7H16C14.9 7 14 7.9 14 9V13H19V18H14",
  linkedin:
    "M7 3H17C19.2 3 21 4.8 21 7V17C21 19.2 19.2 21 17 21H7C4.8 21 3 19.2 3 17V7C3 4.8 4.8 3 7 3ZM8 10.5V17M8 7.5V7.51M12 17V13.5M12 13.5V10.5M12 13.5C12 12.1 13.1 11 14.5 11C15.9 11 17 12.1 17 13.5V17",
  instagram:
    "M8.5 3.5H15.5C18.26 3.5 20.5 5.74 20.5 8.5V15.5C20.5 18.26 18.26 20.5 15.5 20.5H8.5C5.74 20.5 3.5 18.26 3.5 15.5V8.5C3.5 5.74 5.74 3.5 8.5 3.5ZM16 12C16 14.21 14.21 16 12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12ZM17 7V7.01",
  x: "M4 4L20 20M20 4L4 20",
  upwork:
    "M5 7V12C5 13.93 6.57 15.5 8.5 15.5C10.43 15.5 12 13.93 12 12V7M12 11C13 14.5 14.6 17 17 17C18.93 17 20.5 15.43 20.5 13.5C20.5 11.57 18.93 10 17 10C15.16 10 13.8 11.17 12.81 13.29C12.5 13.94 12.24 14.68 12 15.5L10.5 21",
};

export default function Icon({ name, className = "size-5", strokeWidth = 1.75 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
