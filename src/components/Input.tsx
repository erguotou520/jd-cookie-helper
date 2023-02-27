import { createSignal, JSX } from 'solid-js'
import './input.css'

export type InputProps = {
  value?: string
  label: string
  onChange?: (v: string) => void
} & Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'onChange'>

const randomId = () => `input-${Math.random().toString(36).substring(2)}`

export function Input({ value, label, onChange, ...rest }: InputProps) {
  const [_id] = createSignal(randomId())
  const id = _id()
  return (
    <div class="relative">
      <input
        id={id}
        value={value}
        type="text"
        class="bg-transparent border-b-1 border-gray-400 h-8 text-sm w-full text-gray-700 block appearance-none focus:outline-none focus:border-emerald-500 focus:text-emerald-500 invalid:border-pink-500 invalid:text-pink-500"
        {...rest}
        placeholder=' '
        onInput={(e) => {
          onChange?.(e.currentTarget.value ?? '')
        }}
      />
      <label for={id} class="bg-white text-sm top-1.5 text-gray-400 -z-1 origin-0 duration-300 absolute">
        {label}
      </label>
    </div>
  )
}
