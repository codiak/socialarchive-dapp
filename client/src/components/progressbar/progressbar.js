const ProgressBar = ({ bgcolor, completed }) => {
  const containerStyles = {
    height: 20,
    // width: "100%",
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    width: 210,
  };

  const fillerStyles = {
    height: "100%",
    transition: "width 1s ease-in-out",
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: "inherit",
    textAlign: "right",
  };

  const labelStyles = {
    padding: 5,
    color: "white",
    fontWeight: "bold",
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${completed}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
