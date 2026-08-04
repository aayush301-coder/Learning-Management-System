import Spinner from "../ui/Spinner";

function Loader({ text }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <Spinner />
      {text && <p className="text-sm text-ink-soft">{text}</p>}
    </div>
  );
}

export default Loader;
