import { Box, SvgIcon } from "@material-ui/core";

function BondLogo({ bond }) {
  let viewBox = "0 0 32 32";
  let style = { height: "32px", width: "32px" };

  // Need more space if its an LP token
  if (bond.isLP) {
    viewBox = "0 0 64 32";
    style = { height: "32px", width: "64px" };
  }

  if (bond.isMonolith) {
    viewBox = "0 0 96 32";
    style = { height: "32px", width: "96px" };
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" width="96px">
      <SvgIcon component={bond.bondIconSvg} viewBox={viewBox} style={style} />
    </Box>
  );
}

export default BondLogo;
