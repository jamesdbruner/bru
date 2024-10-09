import React, { useRef } from "react";
import { useHotkeys } from 'react-hotkeys-hook';

export const Header = ({ setQuery }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useHotkeys('meta+b', () => inputRef.current?.focus());

  useHotkeys('meta+backspace', () => {
    setQuery('');
    inputRef.current?.focus();
  });

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  return <div className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-slate/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent">
    <div className="max-w-8xl mx-auto">
      <div className="py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10 mx-4 lg:mx-0">
        <div className="relative flex items-center">
          <a
            className="mr-3 flex-none w-[2.0625rem] overflow-hidden md:w-auto outline-none ring-0"
            tabIndex="-1"
            href="/"
          >
            <p className="font-bold text-white text-lg">bru</p>
          </a>
          <div className="relative">
            <a tabIndex="-1" href="https://github.com/jamesdbruner/bru/releases/tag/v0.9.6" className="rounded-md flex space-x-2 items-center outline-none focus:ring-1 ring-slate-600" target="_blank" rel="noreferrer">
              <span
                className="text-xs leading-5 font-semibold bg-slate-400/10 py-1 px-3 rounded-md hover:bg-slate-400/20 dark:highlight-white/5"
              >
                v0.9.6
              </span>
            </a>
          </div>
          <div className="relative flex items-center ml-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search "
                className="ml-3 text-xs leading-5 font-semibold border-slate-900 text-slate-300 bg-slate-400/20 rounded py-1 px-3 flex items-center hover:bg-slate-200/20 border-0 outline-none focus:outline-none focus:ring-0 ring-slate-600"
                onChange={handleSearchChange}
                ref={inputRef}
              />
              <strong className="absolute right-2 text-xs top-1/2 transform -translate-y-1/2 font-semibold">⌘ <span className="text-[.4rem] relative top-[-2px]">DEL</span></strong>
            </div>
            <div className="flex items-center border-slate-200 dark:border-slate-800">
              <a
                tabIndex="-1"
                href="https://github.com/jamesdbruner/bru"
                className="ml-6 block text-slate-300 hover:text-slate-100 dark:hover:text-slate-300 outline-none rounded-full focus:ring-2 ring-slate-600" target="_blank" rel="noreferrer"
              >
                <span className="sr-only">github</span>
                <svg
                  viewBox="0 0 16 16"
                  className="w-5 h-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
              </a>
            </div>
          </div>
          <div className="ml-2 -my-1 lg:hidden">
            <div
              hidden
              style={{
                position: "fixed",
                top: "1px",
                left: "1px",
                width: "1px",
                height: "0",
                padding: "0",
                margin: "-1px",
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                whiteSpace: "nowrap",
                borderWidth: "0",
                display: "none",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div >;
}

export default Header