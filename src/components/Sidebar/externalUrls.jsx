import { ReactComponent as ForumIcon } from "../../assets/icons/forum.svg";
import { ReactComponent as GovIcon } from "../../assets/icons/governance.svg";
import { ReactComponent as DocsIcon } from "../../assets/icons/docs.svg";
import { ReactComponent as FeedbackIcon } from "../../assets/icons/feedback.svg";
import { SvgIcon } from "@material-ui/core";
import { Trans } from "@lingui/macro";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";

const externalUrls = [
  {
    title: <Trans>Governance</Trans>,
    url: "https://snapshot.org/#/exodiadao.eth",
    icon: <SvgIcon color="primary" component={GovIcon} />,
  },
  {
    title: <Trans>Docs</Trans>,
    url: "https://docs.exodia.finance",
    icon: <SvgIcon color="primary" component={DocsIcon} />,
  },
  {
    title: <Trans>Buy on Beethoven-X</Trans>,
    url: "https://beets.fi/#/trade/0x3b57f3feaaf1e8254ec680275ee6e7727c7413c7",
    icon: (
      <span>
        <ShoppingCartIcon />
      </span>
    ),
  },
  {
    title: <Trans>Chart on Dextools</Trans>,
    url: "https://www.dextools.io/app/fantom/pair-explorer/0xc0c1dff0fe24108586e11ec9e20a7cbb405cb769",
    icon: (
      <span>
        <TrendingUpIcon />
      </span>
    ),
  },
];

export default externalUrls;
