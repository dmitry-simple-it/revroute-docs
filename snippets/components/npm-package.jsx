export const NPMPackage = ({
  name = "@dub/analytics",
  description = "Client-side SDK for tracking conversion analytics with Dub.",
  downloads = "42K+",
}) => {
  return (
    <div className="not-prose my-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 p-6 transition-all hover:border-gray-500 dark:hover:border-gray-600 hover:ring-4 hover:ring-gray-200 dark:hover:ring-gray-700">
      <a
        href={`https://www.npmjs.com/package/${name}`}
        target="_blank"
        rel="noreferrer noopener"
        className="block"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xl text-gray-900 dark:text-gray-100">&gt; npm i {name}</p>
            <p className="block mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>
          <img src="/images/npm-package/npm-logo.svg" alt="npm" className="h-8 w-8 sm:h-10 sm:w-10" />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <img src="/images/npm-package/download.svg" alt="" className="h-4 w-4 dark:invert dark:opacity-80" aria-hidden />
          <p className="font-semibold text-gray-600 dark:text-gray-300">{downloads} downloads</p>
        </div>
      </a>
    </div>
  );
};
