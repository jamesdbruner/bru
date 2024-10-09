import React, { useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  multiple?: boolean;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

const Select: React.FC<SelectProps> = ({ options, multiple = true, value, onChange }) => {
  const [selected, setSelected] = useState(value);

  const handleChange = (value: string | string[]) => {
    setSelected(value);
    onChange(value);
  };

  return (
    <Listbox value={selected} onChange={handleChange} multiple={multiple}>
      {({ open }) => (
        <div className="pt-3 mb-6 relative">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white/5 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-sm">
            <span className="block truncate text-white">
              {multiple
                ? (selected as string[])?.length > 0
                  ? (selected as string[]).map((val) => options.find((o) => o.value === val)?.label).join(', ')
                  : 'Select options'
                : options.find((o) => o.value === selected)?.label || 'Select an option'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-white" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            show={open}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-black py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-slate-300">
              {options.map((option) => {
                const isSelected = multiple
                  ? (selected as string[])?.includes(option.value)
                  : selected === option.value;
                return (
                  <Listbox.Option
                    key={option.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-black text-white' : 'text-gray-300'
                      }`
                    }
                    value={option.value}
                  >
                    {({ active }) => (
                      <>
                        <span className={`block truncate text-white ${isSelected ? 'font-medium' : 'font-normal'}`}>
                          {option.label}
                        </span>
                        {isSelected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'font-medium' : 'font-normal'
                              }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};

export default Select;
