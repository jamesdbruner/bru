import React, { useState, useEffect } from 'react';
import toast, { Toaster, Toast } from 'react-hot-toast';
import { useHotkeys } from 'react-hotkeys-hook';

import { getModules } from '../api/modules.ts';
import Header from '../components/Header.tsx';
import ModuleList from '../components/ModuleList.tsx';

const notify = (msg: string) => toast.custom((t: Toast) => (
  <div
    className={`${t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full backdrop-blur-2xl shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-white ring-opacity-5 z-50`}
  >
    <div className="flex-1 w-0 p-4">
      <div className="flex items-start">
        <div className="ml-3 flex-1">
          <p className="text-sm font-bold text-white">
            <span className="text-white font-bold">[bru]:</span>
          </p>
          <p className="mt-1 text-sm font-medium text-white">
            {msg}
          </p>
        </div>
      </div>
    </div>
  </div>
))

export default function App() {
  const [modules, setModules] = useState<Module[]>([])
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('');

  // Function to filter modules based on the search query
  const filteredModules = modules.filter((module) =>
    module.name.toLowerCase().includes(query.toLowerCase())
  );

  useHotkeys('meta+b', () => setOpen(!open));

  useEffect(() => {
    const fetchModules = async () => {
      const result = await getModules();

      // Sort the modules so that active modules are at the top
      const sortedModules = result.sort((a: Module, b: Module) => {
        // If both modules are active or both are inactive, sort alphabetically
        if (a.options.ui === b.options.ui) {
          return a.name.localeCompare(b.name);
        }
        // Otherwise, prioritize active modules
        return a.options.ui ? -1 : 1;
      });

      setModules(sortedModules);
    };

    fetchModules();
  }, []);

  return (
    <div className="relative left-0 top-0 h-full w-full">
      <div className="antialiased text-slate-400 bg-black">
        <div className="relative h-full w-full bg-black pointer-events-none">
          <div className="absolute h-screen z-0 bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
        <Header setOpen={setOpen} setQuery={setQuery} />
        <Toaster position="bottom-left" reverseOrder={false} />
        <ModuleList notify={notify} modules={filteredModules} />
      </div>
    </div>
  );
}
