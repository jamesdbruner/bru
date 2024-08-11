import { Description, Field, Switch as HeadlessSwitch } from '@headlessui/react'

interface SwitchProps {
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
  id: string
}

export default function Switch({ description, checked, onChange, id }: SwitchProps) {
  return (
    <Field className="flex items-center justify-between gap-3 mr-2">
      <span className="flex flex-grow flex-col">
        <Description as="span" className="text-sm text-gray-400 pr-2">
          {description}
        </Description>
      </span>
      <HeadlessSwitch
        id={id}
        checked={checked}
        onChange={onChange}
        className={`${checked ? 'bg-green-500' : 'bg-gray-500'} group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
      >
        <span
          aria-hidden="true"
          className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </HeadlessSwitch>
    </Field>
  )
}
