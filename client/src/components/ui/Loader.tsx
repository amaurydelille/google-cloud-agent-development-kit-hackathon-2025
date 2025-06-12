interface LoaderProps {
  size?: number;
}

const Loader = ({ size = 4 }: LoaderProps) => {
  return (
    <div className={`w-${size} h-${size} border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
  )
}

export default Loader;