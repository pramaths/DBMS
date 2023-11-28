// import fxdxlogo from "../../img/fxdx-logo.svg";
// import sun from "../../img/sun.svg";
// import moon from "../../img/moon.svg";
import { SiTwitter, SiDiscord, SiGithub } from "react-icons/si";
import { FaMedium, FaTelegramPlane } from "react-icons/fa";
import "./footer.css";
import { AiOutlineMail } from "react-icons/ai";

 const Footer=()=> {
  return (
    <>
      <div className="footer">
        <div className="footer-left">
          <div className="logo">
            <img src="" alt="Winkwise" />
          </div>

          <div className="socials-container">
            <a
              className="socials"
              target="_blank"
              rel="noreferrer"
              href="https://twitter.com/fxdxdex"
            >
              <SiTwitter color="white" size={24} />
            </a>
            <a
              className="socials"
              target="_blank"
              rel="noreferrer"
              href="https://t.me/fxdxdex"
            >
              <FaTelegramPlane color="white" size={24} />
            </a>
            <a
              className="socials"
              target="_blank"
              rel="noreferrer"
              href="https://discord.gg/AdmFvVjfjh"
            >
              <SiDiscord color="white" size={24} />
            </a>
          </div>

          <div className="socials-container">
            <a
              className="socials"
              target="_blank"
              rel="noreferrer"
              href="mailto:team@fxdx.exchange"
            >
              <AiOutlineMail color="white" size={24} />
            </a>
            <a
              className="socials"
              target="_blank"
              rel="noreferrer"
              href="https://github.com/fxdxdex"
            >
              <SiGithub color="white" size={24} />
            </a>
            <a
              className="socials"
              target="_blank"
              rel="noreferrer"
              href="https://fxdxdex.medium.com/"
            >
              <FaMedium color="white" size={24} />
            </a>
          </div>

          {/* <div className="theme-setting">
            <div>Theme</div>
            <div className="light-dark">
              <span className="active symbol">
                <img src={moon} alt="dark mode" />
              </span>
              <span className="symbol">
                <img src={sun} alt="dark mode" />
              </span>
            </div>
          </div> */}
          
          <div className="all-rights">© All rights reserved by WinkWise</div>
        </div>

        <div className="footer-right">
          <div className="menu">
            <div className="title">Menu</div>

            <a
              target="_blank"
              rel="noreferrer"
              href="https://discord.com/channels/891555109492899891/891555110130442275"
            >
              Help Center
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://fxdxdex.medium.com/"
            >
              Blog
            </a>
          </div>
        </div>

        <div className="footer-right align-right">
          <div className="terms">
            <div className="title">Terms</div>

            <a
              target="_blank"
              rel="noreferrer"
              href="https://fxdxdocs.gitbook.io/fxdx-knowledge-base/legal/terms-of-use"
            >
              Terms Of Use
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://fxdxdocs.gitbook.io/fxdx-knowledge-base/legal/privacy-policy"
            >
              Privacy Policy
            </a>
          </div>
        </div>
        <div className="footer-right">
          <div className="products">
            <div className="title">Products</div>

            <a
              target="_blank"
              rel="noreferrer"
              href="https://app.fxdx.exchange/"
            >
              Mainnet
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://testnet.fxdx.exchange/"
            >
              Testnet
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://app.fxdx.exchange/buy"
            >
              Add Liquidity
            </a>
          </div>
        </div>
        <div className="footer-right align-right">
          <div className="docs">
            <div className="title">Docs</div>

            <a
              target="_blank"
              rel="noreferrer"
              href="https://app.fxdx.exchange/overview"
            >
              Analytics
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://app.fxdx.exchange/earn"
            >
              Earn Dashboard
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://fxdxdocs.gitbook.io/fxdx-knowledge-base/overview/our-features"
            >
              Whitepaper
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/fxdxdex"
            >
              Github
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://fxdxdocs.gitbook.io/fxdx-knowledge-base/overview/fee-structure"
            >
              Fees
            </a>
          </div>
        </div>
      </div>
      <div className="disclaimer">
      </div>
    </>
  );
}

export default Footer