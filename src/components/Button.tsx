import { type JSX } from 'solid-js'

const Button = ({ children, ...props }: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button {...props} class={`rounded font-medium bg-emerald-500 h-8 text-xs text-white tracking-wide px-4 transition gap-2 duration-300 inline-flex items-center justify-center whitespace-nowrap hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-emerald-300 disabled:border-emerald-300 disabled:shadow-none ${props.class}`}>
      {children}
    </button>
  )
}

export default Button
