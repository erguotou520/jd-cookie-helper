export default function Alert(props: { text: string; class?: string }) {
  return (
    <div
      class={`border rounded flex bg-pink-50 border-pink-100 text-sm w-full py-3 px-4 text-pink-500 gap-4 items-start ${props.class}`}
      role="alert"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.5"
        aria-labelledby="title-04 desc-04"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <pre>{props.text}</pre>
    </div>
  )
}