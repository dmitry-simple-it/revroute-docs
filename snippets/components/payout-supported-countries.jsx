import { useState, useEffect } from "react";

export const PayoutSupportedCountries = () => {
  const [countries, setCountries] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const showCount = 21;

  useEffect(() => {
    fetch(`https://app.dub.co/api/supported-countries`)
      .then((r) => r.json())
      .then((data) => setCountries(data))
      .catch(() => {});
  }, []);

  if (!countries.length) return <div style={{ height: "200px" }} />;

  const displayed = expanded ? countries : countries.slice(0, showCount);
  const isCollapsed = countries.length > showCount && !expanded;

  return (
    <div className="not-prose relative">
      <div
        style={
          isCollapsed
            ? {
                maskImage:
                  "linear-gradient(to bottom, black calc(100% - 80px), transparent)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black calc(100% - 80px), transparent)",
                maxHeight: "420px",
                overflow: "hidden",
              }
            : { paddingBottom: expanded ? "48px" : "0" }
        }
        className="grid grid-cols-2 gap-5 py-4 sm:grid-cols-3"
      >
        {displayed.map(({ code, name }) => (
          <div key={code} className="flex items-center gap-3">
            <img
              src={`https://hatscripts.github.io/circle-flags/flags/${code.toLowerCase()}.svg`}
              alt={code}
              width={32}
              height={32}
              className="size-5 shrink-0 rounded-full border border-neutral-200 shadow-sm dark:border-neutral-700"
              draggable={false}
            />
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {name}
            </span>
          </div>
        ))}
      </div>
      {countries.length > showCount && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="absolute left-1/2 -translate-x-1/2 transform rounded-full border border-neutral-200 bg-white px-4 py-1 text-sm text-neutral-500 shadow-sm hover:text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
          style={{ bottom: isCollapsed ? "24px" : "-8px" }}
        >
          {expanded ? "Show less" : `Show ${countries.length - showCount} more`}
        </button>
      )}
    </div>
  );
};
