import type { ModuleInput } from '@/types.ts';

import { useState, useEffect } from 'react';
import { ChevronRightIcon, ArrowUturnLeftIcon } from '@heroicons/react/20/solid';
import { getModules } from '../api/modules.ts';
import Modal from './Modal.tsx';
import InputModal from './InputModal.tsx';
import CopyButton from './CopyButton.tsx'
import { formatResponse } from '../utils/formatResponse.tsx';

interface Module {
  name: string;
  options: {
    ui: boolean;
    inputs?: ModuleInput[];
  };
  perms: Record<string, boolean>;
}

const statuses = {
  offline: 'text-gray-500 bg-gray-100/10',
  online: 'text-green-400 bg-green-400',
};

export default function ModuleList({ notify }: { notify: (name: string) => void }) {
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string | number | boolean>>({});
  const [showInputs, setShowInputs] = useState(true);

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

  const onReset = () => {
    setResponse('');
    setShowInputs(true);
  };

  const handleModuleClick = (module: Module) => {
    setCurrentModule(module);
    if (module.options.inputs?.length) {
      const initialFormValues = module.options.inputs.reduce((acc: Record<string, string | number | boolean>, input: ModuleInput) => {
        acc[input.name] = input.defaultValue !== undefined ? input.defaultValue : '';
        return acc;
      }, {});
      setFormValues(initialFormValues);

    } else {
      executeModule(module.name, {});
    }
    setShowModal(true);
  };

  const executeModule = async (moduleName: string, inputs: Record<string, any>) => {
    try {
      setLoading(true);
      setShowInputs(false);
      notify(`Running ${moduleName}`);

      const response = await fetch('http://localhost:8000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moduleName, input: inputs }),
      });

      if (!response.ok) {
        throw new Error(`Error running module: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          result += chunk;

          // Append the new chunk to the response state
          setResponse((prev: string) => prev + chunk);
        }
      } else {
        throw new Error('No reader found for the response body');
      }

      // Ensure the final result is set properly
      setResponse(result);

    } catch (error) {
      console.error('Error running module:', error);
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (inputs: Record<string, ModuleInput>) => {
    await executeModule(currentModule?.name || '', inputs);
  };

  return (
    <div>
      <ul role="list" className="divide-y divide-white/5 border-b border-white/5">
        {modules.map((module: Module) => (
          <li key={module.name} className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
            <button
              onClick={() => handleModuleClick(module)}
              className="w-full relative flex items-center cursor-pointer d-inline-block"
              disabled={!module.options.ui}
            >
              <div className="min-w-0 flex-auto">
                <div className="flex items-center gap-x-3">
                  <div className='flex-none rounded-full p-1'>
                    <span className="relative flex h-2 w-2">
                      {module.options.ui && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statuses.online} opacity-75`}></span>}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${module.options.ui ? statuses.online : statuses.offline}`}></span>
                    </span>
                  </div>
                  <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                    <span className="flex gap-x-2">
                      <span className="truncate">bru</span>
                      <span className="text-gray-400">/</span>
                      <span className="whitespace-nowrap">{module.name}</span>
                      <span className="absolute inset-0" />
                    </span>
                  </h2>
                </div>
                <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                  {Object.keys(module.perms).map((permission) => (
                    <span key={permission} className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-gray-800">
                      {module.options.ui && (<svg viewBox="0 0 6 6" aria-hidden="true" className="h-1.5 w-1.5 fill-indigo-400">
                        <circle r={3} cx={3} cy={3} />
                      </svg>)}
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
              <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" />
            </button>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {currentModule && (
        <Modal
          isOpen={showModal}
          onReset={onReset}
          onClose={() => { setShowModal(false); setResponse(''); setShowInputs(true); }}
          title={`bru / ${currentModule.name}`}
          loading={loading}
        >
          {showInputs ? (
            <InputModal
              inputs={currentModule.options.inputs}
              onSubmit={handleSubmit}
            />
          ) : (
            <>
              <pre className="mt-3 block w-full bg-transparent py-1.5 px-3 text-sm/6 text-white text-wrap whitespace-pre-wrap">
                {formatResponse(response)}
              </pre>
              {currentModule.options.inputs?.length > 0 && (
                <div className="flex justify-between pt-5">
                  <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex w-full justify-center rounded-md bg-slate-700 border-slate-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 sm:ml-3 sm:w-auto"
                  >
                    <ArrowUturnLeftIcon className="w-[16px] mr-[10px] mt-[1px]" size={16} />
                    <span className="inline">Reset</span>
                  </button>
                  <CopyButton notify={notify} textToCopy={response} />
                </div>
              )}
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
