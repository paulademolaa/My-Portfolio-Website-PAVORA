import { Link } from "react-router-dom";
import Icon from "./Icons.jsx";

// One button for the whole site.
//   variant: "primary" (blue), "secondary" (outlined), "light" (white), "link"
//   to:      internal page, e.g. "/contact"
//   href:    external link, e.g. your Upwork URL (opens in a new tab)
//   icon:    "arrow-right" (default), "arrow-up-right" or null for none
const styles = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-[0_8px_30px_-8px_rgba(37,99,235,0.6)]",
  secondary: "border border-ink-700 bg-ink-900 text-white hover:bg-ink-800 hover:border-slate-500/60",
  light: "bg-white text-ink-950 hover:bg-blue-100",
  link: "px-0.5! py-1.5! text-white hover:text-blue-500",
};

export default function Button({
  children,
  variant = "primary",
  to,
  href,
  icon = "arrow-right",
  className = "",
  ...props
}) {
  const classes = `group/btn inline-flex cursor-pointer items-center justify-center gap-2 rounded-full py-3 pr-[18px] pl-5 text-[15px] leading-[1.5] font-medium transition-all duration-300 ease-(--ease-premium) active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <Icon
          name={icon}
          className={`size-5 transition-transform duration-300 ease-(--ease-premium) ${
            icon === "arrow-up-right"
              ? "group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
              : "group-hover/btn:translate-x-1"
          }`}
        />
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes} {...props}>
        {content}
      </a>
    );
  }
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}
