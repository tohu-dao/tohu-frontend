import { makeStyles } from "@material-ui/core/styles";
import { Drawer } from "@material-ui/core";
import NavContent from "./NavContent.jsx";
import navBg from "../../assets/images/exod-sidebar.jpg";

const drawerWidth = 280;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    "& .MuiPaper-root:before": {
      backgroundImage: `linear-gradient(0deg, rgba(31,31,31,1) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 100%), url(${navBg})`,
      opacity: 0.8,
    },
    width: drawerWidth,
    borderRight: 0,
  },
}));

function NavDrawer({ mobileOpen, handleDrawerToggle }) {
  const classes = useStyles();

  return (
    <Drawer
      variant="temporary"
      anchor={"left"}
      open={mobileOpen}
      onClose={handleDrawerToggle}
      onClick={handleDrawerToggle}
      classes={{
        paper: classes.drawerPaper,
      }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <NavContent />
    </Drawer>
  );
}

export default NavDrawer;
