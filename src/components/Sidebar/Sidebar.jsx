import { Drawer, makeStyles } from "@material-ui/core";
import NavContent from "./NavContent.jsx";
import "./sidebar.scss";
import navBg from "../../assets/images/exod-sidebar.jpg";

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    "& .MuiPaper-root": {},
  },
}));

function Sidebar() {
  const classes = useStyles();
  return (
    <div className={`sidebar`} id="sidebarContent">
      <Drawer
        variant="permanent"
        anchor="left"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <NavContent />
      </Drawer>
    </div>
  );
}

export default Sidebar;
