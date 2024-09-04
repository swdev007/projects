"use client";
import { useDispatch } from "react-redux";
import Button from "../Button/Button";
import style from "./Footer.module.scss";

const Footer = () => {
  const dispatch = useDispatch();
  const scrollToView = () => {
    const element: any = document.getElementById("about_us_section");
    element.scrollIntoView({ behavior: "smooth" });
  };
  const messageHandler = () => {
    const recipientEmail = "info@gmail.com";

    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      recipientEmail
    )}`;

    window.open(gmailLink, "_blank");
  };
  return (
    <footer className={style.footer}>
      <div className="container">
        <div className={`${style.footer__main} flex-wrap justify-between`}>
          <article id="about_us_section">
            <h4>About Us</h4>
            <p>
              It was created around the collaboration of a few family members
              that shared the same concerns regarding the vehicle purchasing
              process. After years of purchasing vehicles throughout the US
              online, we decided on an idea to give consumers a way to put their
              vehicle request in the hands of multiple dealerships and let them
              do the work and make their best offer. This resulted in the
              creation and process of developing a site to give more
              transparency, savings and time back to the customer. We hope that
              you are excited to use the site just as much as we are! Yes, we
              intend to use the site just like you! Thank you for taking the
              time to check us out and feel free to share and spread the word
              about helping everyday people save money and time when purchasing
              their next vehicle. Feel free to send us an email if you have
              questions or thoughts, we are here to help!
            </p>
            <p>Thank you again!</p>

            <Button
              label="Contact Us"
              onClick={() => {
                messageHandler();
              }}
            />
          </article>
          <aside>
            <h4>Quick Links</h4>
            <ul className="flex-wrap">
              <li>
                <a>Dealer</a>
              </li>
              <li>
                <a
                  onClick={() => {
                    scrollToView();
                  }}
                >
                  About Us
                </a>
              </li>
              <li
                onClick={() => {
                  messageHandler();
                }}
              >
                <a>Contact Us</a>
              </li>
            </ul>

            <h4>Community</h4>
            <ol>
              <li>
                <a>Facebook</a>
              </li>
              <li>
                <a>Instagram</a>
              </li>
              <li>
                <a>Linkedin</a>
              </li>
            </ol>
          </aside>
        </div>
        <div
          className={`${style.footer__copyright} flex-wrap align-center justify-between`}
        >
          <p>©2023-2024 all rights reserved.</p>

          <nav>
            <a>Privacy Policy</a> | <a>Terms and Conditions</a>
          </nav>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
