import { makeStyles, createStyles } from "@material-ui/styles";

const useStyles = makeStyles(() =>
  createStyles({
    Main: {
      minWidth: "100vw",
      minHeight: "100vh",
      position: "relative",
      overflowX: "hidden",
      overflowY: "auto",
    },
  })
);

export default useStyles;
