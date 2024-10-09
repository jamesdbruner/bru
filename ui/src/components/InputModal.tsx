import type { ModuleInput } from '@/types.ts';
import React, { useState, useEffect } from 'react';
import { ArrowTurnRightUpIcon } from '@heroicons/react/24/outline';
import { useHotkeys } from 'react-hotkeys-hook';

import Select from './Select.tsx';
import Switch from './Switch.tsx';

interface InputModalProps {
  inputs: ModuleInput[];
  onSubmit: (formValues: Record<string, string | number | boolean>) => void;
}

const InputModal: React.FC<InputModalProps> = ({ inputs, onSubmit }: InputModalProps) => {
  const [formValues, setFormValues] = useState<Record<string, string | number | boolean>>({});

  useHotkeys('shift+enter', () => handleSubmit());

  useEffect(() => {
    if (inputs?.length) {
      const initialFormValues = inputs.reduce((acc: Record<string, string | number | boolean>, input: ModuleInput) => {
        acc[input.name] = input.defaultValue !== undefined ? input.defaultValue : '';
        return acc;
      }, {});
      setFormValues(initialFormValues);
    }
  }, [inputs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleToggle = (name: string, value: boolean) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    onSubmit(formValues);
  };

  return (
    <div>
      {inputs?.map((input) => (
        <div key={input.name} className="mt-4">
          <label className="block text-sm font-medium text-white">{input.prompt}</label>
          {input.type === 'textarea' && (
            <textarea
              name={input.name}
              value={formValues[input.name] as string}
              onChange={handleChange}
              className='px-4 mt-3 block w-full resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white shadow-none !ring-transparent'
              rows={3}
            />
          )}
          {input.type === 'text' && (
            <input
              type="text"
              name={input.name}
              value={formValues[input.name] as string}
              onChange={handleChange}
              className="px-4 mt-3 block w-full resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white shadow-none !ring-transparent"
              autoComplete="off"
            />
          )}
          {input.type === 'number' && (
            <input
              type="number"
              name={input.name}
              value={formValues[input.name] as number}
              onChange={handleChange}
              className="px-4 mt-3 block w-full resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white shadow-none !ring-transparent"
              autoComplete="off"
            />
          )}
          {input.type === 'toggle' && (
            <Switch
              id={input.name}
              description={input?.description || ''}
              checked={formValues[input.name] as boolean}
              onChange={(value: boolean) => handleToggle(input.name, value)}
            />
          )}
          {input.type === 'select' && input.options && (
            <Select
              name={input.name}
              options={input.options.map((option) => ({ value: option, label: option }))}
              multiple={input?.multiple || false}
              value={formValues[input.name]}
              onChange={(value) => handleChange(input.name, value)}
            />
          )}
        </div>
      ))}
      <div className="mt-7 flex gap-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="relative group inline-flex ml-auto justify-center rounded-md bg-slate-700 border-slate-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 outline-none"
        >
          <span className="inline">Enter</span>
          <ArrowTurnRightUpIcon className="w-[16px] ml-[5px] mt-[1px]" size={16} />
          <span className="bg-black p-2 rounded-lg text-xs pointer-events-none absolute z-20 -top-9 right-9 w-max opacity-0 transition-opacity group-focus:opacity-100 group-hover:opacity-100">
            shift + ↵
          </span>
        </button>
      </div>
    </div>
  );
};

export default InputModal;
