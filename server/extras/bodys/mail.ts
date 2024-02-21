export const mailBody = (magicLink: string, userId: string) => `
<table role="presentation" style="width: 100%; font-family: 'Arial', sans-serif;">
  <tr>
    <td align="center">
      <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <tr>
          <td align="center">
            <div style="padding: 20px;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td align="center">
                    <div>
                      <p style="font-size: 3em; margin: 0;"></p>
                      <center><h1 style="color: #007bff; margin: 0;margin:20px;">👀</h1></center>
                      <center>
<h1 style="color: #007bff; margin: 0; text-align:center;">Password Reset</h1>
</center>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <div style="padding: 20px;">
                      <p style="font-weight: bold; color:black;">Someone has requested a password change</p>
                      <p style="color: #555; font-size: 0.7em; font-weight: 300; font-style: italic; margin:25px">To reset your password, visit the following address:</p>
                      <a href="/redirect?url=codereviewme&iid=${magicLink}&uid=${userId}" style="background: #ffc800; color: black; border: none; padding: 10px; border-radius: 4px;cursor: pointer; transition: all .5s; ">Click here to reset your password</a>
                      <p style="font-size: .8em; color: #555; margin:25px">If it was a mistake, you can ignore this message.</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                   <center>
 <div style="max-width: 500px;">
                      <p style="font-weight: bold;color:black;">This message was sent by the <a href="http://codereviewme.com/" style="color: #ffc800; font-weight: 300; text-decoration: underline;" target="_blank">CodeReviewMe</a> servers through the Brevo host.</p>
                    </div>
</center>
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
