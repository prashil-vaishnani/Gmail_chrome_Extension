"use strict";

// loader-code: wait until gmailjs has finished loading, before triggering actual extensiode-code.
const loaderId = setInterval(() => {
  if (!window.gmail) {
    return;
  }

  clearInterval(loaderId);
  startExtension(window.gmail);
}, 100);

// actual extension-code
function startExtension(gmail) {
  console.log("Extension loading...", gmail.get.user_email());

  gmail.observe.on("load", () => {
    const userEmail = gmail.get.user_email();
    console.log("Hello, " + userEmail + ". This is your extension talking!");

    // gmail.observe.on("view_email", (domEmail) => {
    //   console.log("Looking at email:", domEmail);
    //   const emailData = gmail.new.get.email_data(domEmail);
    //   console.log("Email data:", emailData);
    // });

    gmail.observe.on("compose", (compose) => {
      console.log("New compose window is opened!", compose);
    });
    gmail.observe.on("recipient_change", function (match, recipients) {
      console.log("recipients changed", match, recipients.to);
      gmail.observe.before("send_message", function (_, __, data) {
        const reg = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/;
        console.log(
          "message sent",

          "email_data",
          data.content_html
        );
        console.log(
          data.content_html.match(reg)[2] + "?email=" + recipients.to
        );
      });
    });
  });
}
