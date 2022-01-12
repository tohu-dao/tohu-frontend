import OlympusLogo from "../../assets/Olympus Logo.svg";
import "./notfound.scss";
import { Trans } from "@lingui/macro";

export default function NotFound() {
  return (
    <div id="not-found">
      <div className="not-found-header">
        <a href="https://exodia.fi" target="_blank" rel="nofollow noopener noreferrer">
          <img className="branding-header-icon" src={OlympusLogo} alt="OlympusDAO" />
        </a>

        <h4>
          <Trans>Page not found</Trans>
        </h4>
      </div>
    </div>
  );
}
