import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as GitHub } from "../../assets/icons/github.svg";
import { ReactComponent as Medium } from "../../assets/icons/medium.svg";
import { ReactComponent as Twitter } from "../../assets/icons/twitter.svg";
import { ReactComponent as Discord } from "../../assets/icons/discord.svg";
import { ReactComponent as Telegram } from "../../assets/icons/telegram.svg";

export default function Social() {
  return (
    <div className="social-row">
      <Link href="https://github.com/TohuDao" target="_blank" rel="nofollow noopener noreferrer">
        <SvgIcon color="primary" component={GitHub} />
      </Link>

      <Link href="https://medium.com/" target="_blank" rel="nofollow noopener noreferrer">
        <SvgIcon color="primary" component={Medium} />
      </Link>

      <Link href="https://twitter.com/FantomsOpera" target="_blank" rel="nofollow noopener noreferrer">
        <SvgIcon color="primary" component={Twitter} />
      </Link>

      <Link href="https://discord.gg/Na6vnxg2ep" target="_blank" rel="nofollow noopener noreferrer">
        <SvgIcon color="primary" component={Discord} />
      </Link>

      <Link href="https://t.co/" target="_blank" rel="nofollow noopener noreferrer">
        <SvgIcon color="primary" component={Telegram} />
      </Link>
    </div>
  );
}
