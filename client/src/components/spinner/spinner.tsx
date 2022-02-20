import "./spinner.css";

const Spinner = (props: { label?: string; overlay?: boolean }) => {
  const { overlay, label } = props;
  let wrapClass = "spinner-wrap";
  if (overlay) {
    wrapClass += " absolute-center";
  }

  return (
    <div className={wrapClass}>
      <svg className="spinner" viewBox="0 0 50 50">
        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="3" />
      </svg>
      {label && <div className="spinner-text">{label}</div>}
    </div>
  );
};

export default Spinner;
