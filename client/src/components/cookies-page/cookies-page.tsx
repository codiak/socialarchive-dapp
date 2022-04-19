import "./cookies-page.css";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

export const CookiesPage = () => {
  useEffect(() => {}, []);
  return (
    <div className="policy-container">
      <Helmet>
        <title>Privacy - Social Archive</title>
      </Helmet>
      <h3>Privacy & Cookies Policy</h3>
      <h4>Information We Collect</h4>
      <p>
        Aside from the material uploaded to Swarm by the user, we collect website analytics
        including what browser and operating system you are using, where you are visiting from, and
        your page views while on the site.
      </p>
      <h4>Lawful Usage</h4>
      <p>We only process information where we have a lawful basis for doing so which includes:</p>
      <ul>
        <li>
          User consent - This is where you (the "user") has given us permission to process
          information for a given purpose such as uploading social media to Swarm or consent to use
          cookies.
        </li>
        <li>
          Business purposes - This is where we have a legitimate reason to collect informaton about
          who is visiting our website and how they are using so that we can make improvements and
          continue to provide our services.
        </li>
      </ul>
      <h4>Questions</h4>
      <p>
        If you have any questions pertaining to privacy on this site, you can send an e-mail to{" "}
        <a href="mailto:privacy@socialarchive.info">privacy@socialarchive.info</a>
      </p>
      <h4>Policy Changes</h4>
      <p>Any changes to this policy will be posted on this page.</p>
      <h4>Cookies</h4>
      <p>
        Social Archive uses cookies and related technologies to collect information about you. This
        information is collected for the purposes of analytics and website performance. For
        information about how cookies are managed by various browsers see{" "}
        <div className="emphasis">Manage Cookies</div> below.
      </p>
      <p>
        Cookies are small blocks of information stored on your device that are required by websites
        to operate as designed. "First-party" cookies are cookies that are set by the operator of
        this website. "Third-party" cookies are cookies that are set by this site's partners.
      </p>
      <h4>Manage Cookies</h4>
      <p>
        You can control which cookies are allowed on your device, but be aware that if you do
        disable cookies you may impact the functioning of the site as intended. Some cookies are
        essential for enhanced operations.
      </p>
      <p>
        All modern web browsers allow changes to your cookie settings. These settings can be
        typically found by clicking 'Settings' or 'Help'. The links below may also be helpful in
        explaining how to control cookies in your browser.
      </p>
      <ul>
        <li>
          <a href="https://support.microsoft.com/en-us/microsoft-edge/view-cookies-in-microsoft-edge-a7d95376-f2cd-8e4a-25dc-1de753474879">
            Microsoft Edge
          </a>
        </li>
        <li>
          <a href="http://support.mozilla.com/en-US/kb/Cookies">Firefox</a>
        </li>
        <li>
          <a href="https://support.google.com/chrome/answer/95647?hl=en">Chrome</a>
        </li>
        <li>
          <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac">Safari</a>
        </li>
      </ul>
    </div>
  );
};

export default CookiesPage;
