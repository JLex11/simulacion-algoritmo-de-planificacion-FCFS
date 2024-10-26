import clsx from 'clsx'

export default function SimpleButton({
  onClick,
  children,
  className: extraClasses,
}) {
  return (
    <button
      className={clsx([
        'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
        extraClasses,
      ])}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
