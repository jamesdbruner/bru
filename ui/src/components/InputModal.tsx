import type { ModuleInput } from '@/types.ts';
import React, { useState, useEffect } from 'react';
import { ArrowTurnRightUpIcon } from '@heroicons/react/24/outline';
import Switch from './Switch.tsx';

interface InputModalProps {
  inputs: ModuleInput[];
  onSubmit: (formValues: Record<string, string | number | boolean>) => void;
}

const InputModal: React.FC<InputModalProps> = ({ inputs, onSubmit }: InputModalProps) => {
  const [formValues, setFormValues] = useState<Record<string, string | number | boolean>>({});

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
        </div>
      ))}
      <div className="mt-7 flex gap-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex ml-auto justify-center rounded-md bg-slate-700 border-slate-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          <span className="inline">Enter</span>
          <ArrowTurnRightUpIcon className="w-[16px] ml-[5px] mt-[1px]" size={16} />
        </button>
      </div>
    </div>
  );
};

export default InputModal;
