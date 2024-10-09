import type { ModuleInput } from '@/types.ts';

import { useState, useEffect } from 'react';
import { ChevronRightIcon, ArrowUturnLeftIcon } from '@heroicons/react/20/solid';
import { formatResponse } from '../utils/formatResponse.tsx';
import { useHotkeys } from 'react-hotkeys-hook';

import Modal from './Modal.tsx';
import InputModal from './InputModal.tsx';
import CopyButton from './CopyButton.tsx'

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

export default function ModuleList({ notify, modules }: { notify: (name: string) => void }) {
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string | number | boolean>>({});
  const [showInputs, setShowInputs] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

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

  const executeModule = async (moduleName: string, inputs: Record<string, unknown>) => {
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

  useHotkeys('alt+x', () => {
    setShowModal(false);
    setResponse('');
    setShowInputs(true);
  });

  useEffect(() => {
    setTimeout(() => {

      setIsLoaded(true);
    }, 500);
  }, []);

  return (
    <main className="z-1 relative">
      <div className="lg:w-10/12 xl:w-8/12 mx-auto pt-0">
        <div>
          <ul role="list" className={`divide-y bg-transparent divide-white/10 border-b border-x group border-white/5 fadeIn 1s ease-in forwards`}>
            {modules?.map((module: Module, i: number) => (
              <li key={module.name} className={`overflow-hidden bg-transparent px-4 py-5 shadow sm:p-6 relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8 ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity ease-in animate-appear delay-[${i + 1}00ms]`}>
                <button
                  onClick={() => handleModuleClick(module)}
                  className="w-full relative flex items-center cursor-pointer d-inline-block border-transparent outline-none rounded p-2 focus:ring-1 ring-slate-600"
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
              title={currentModule.name}
              loading={loading}
            >
              {showInputs ? (
                <InputModal
                  inputs={currentModule.options.inputs}
                  onSubmit={handleSubmit}
                />
              ) : (
                <>
                  <pre className="mt-3 block w-full bg-transparent py-1.5 text-sm/6 text-white text-wrap whitespace-pre-wrap">
                    {formatResponse(response)}
                  </pre>
                  {currentModule.options.inputs?.length > 0 && (
                    <div className="flex justify-between pt-5">
                      <button
                        type="button"
                        onClick={onReset}
                        className="relative group inline-flex w-full justify-center rounded-md bg-slate-700 border-slate-800 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 ml-3 w-auto outline-none"
                      >
                        <ArrowUturnLeftIcon className="w-[16px] mr-[10px] mt-[1px]" size={16} />
                        <span className="inline">Reset</span>
                        <span className="bg-black p-2 rounded-lg text-xs pointer-events-none absolute z-20 -top-9 right-9 w-max opacity-0 transition-opacity group-focus:opacity-100 group-hover:opacity-100">
                          ⌥ + x
                        </span>
                      </button>
                      <CopyButton notify={notify} textToCopy={response} />
                    </div>
                  )}
                </>
              )}
            </Modal>
          )}
        </div>
      </div>
    </main>
  );
}
