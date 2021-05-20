import { makeStyles, createStyles } from "@material-ui/styles";
import { Theme } from "../../store/themeContext/themes";
import { Props } from "./navbar";

const useStyles = makeStyles(() =>
  createStyles({
    Navbar: {
      borderBottom: "1px solid lightgrey",
      width: "100%",
      height: "10rem",
      position: "absolute",
      display: "flex",
      justifyContent: "space-between",
      left: 0,
      top: 0,
    },
    walletConnectButton: {
      padding: "1rem 2rem",
      color: "black",
      backgroundColor: "lightgrey",
      margin: "auto 5rem auto auto",
      borderRadius: "2rem",
    },
    logo: {
      height: "50%",
      margin: "auto auto auto 5rem",
    },
  })
);

export default useStyles;
