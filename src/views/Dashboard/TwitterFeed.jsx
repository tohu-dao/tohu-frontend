import { useTheme, SvgIcon, Typography, useMediaQuery } from "@material-ui/core";
import { ReactComponent as Twitter } from "../../assets/icons/twitter.svg";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { Skeleton } from "@material-ui/lab";
import { t, Trans } from "@lingui/macro";

const TwitterFeed = () => {
  const theme = useTheme();
  const onTwitterLoad = tweetWidgetEl => {
    var body = tweetWidgetEl.contentWindow.document.querySelector("body");
    tweetWidgetEl.contentWindow.document.querySelectorAll("p").forEach(e => (e.style.lineHeight = "22px"));
    tweetWidgetEl.contentWindow.document.querySelectorAll("p").forEach(e => (e.style.fontSize = "1rem"));
    tweetWidgetEl.contentWindow.document.querySelectorAll("abbr").forEach(e => (e.style.textDecoration = "none"));
    body.style.color = theme.palette.text.primary;
    body.style.fontSize = "1rem";
    body.style.lineHeight = "22px";
  };

  return (
    <>
      <Typography
        variant="h6"
        color="textPrimary"
        style={{ marginBottom: "6px", display: "flex", alignItems: "center" }}
      >
        <SvgIcon color="textPrimary" component={Twitter} style={{ marginRight: "10px" }} />
        Latest Tweets
      </Typography>

      <TwitterTimelineEmbed
        sourceType="timeline"
        screenName="exodiafinance"
        placeholder={<Skeleton />}
        options={{ id: "twitter-widget" }}
        id="twitter-widget"
        theme="dark"
        onLoad={onTwitterLoad}
        noBorders
        noFooter
        noHeader
        autoHeight
        transparent
        noScrollbar
      />
    </>
  );
};

export default TwitterFeed;
