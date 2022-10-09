// Required libraries 
const nodemailer = require('nodemailer');
const fs = require('file-system');

// Change path to your data file if you want 
const DATABASE_PATH = `${__dirname}/test.txt`;

// Your email and smtp data
const SENDER_EMAIL = '';
const SMTP_SECURE_PASSWORD = '';

// This function is necessary to parse data from your txt data file
// you can configure it in way you need to
// Actual configruation is:
// Each line is an another user
// In each line, a single word is a separate piece of data such as first name, last name, email address, etc.
const parseTxt = txt => {
  const data = [];
  txt.split('\n').forEach(user => {
    const [firstName, lastName, email] = user.split(' ');
    data.push({
      id: data.length + 1,
      firstName,
      lastName,
      email
    });
  });
  return data;
};

async function main() {
  // Reading file
  const data = fs.readFileSync(DATABASE_PATH, 'utf8');
  // Parsing data
  const DATABASE = parseTxt(data);
  // Creating transporter object
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    auth: {
      user: SENDER_EMAIL,
      pass: SMTP_SECURE_PASSWORD,
    },
  });
  for (let i = 0; i < DATABASE.length; i++) {
    // Parsed data from txt file
    const { email } = DATABASE[i];
    let info = await transporter.sendMail({
      from: '"Sender" <SenderEmail>', // Important to paste sender email in <> in order to not get in spam 
      to: email, // email form txt file 
      subject: "Test",
      text: "Test"
    });
    console.log(`Message sent: ${info.messageId}. Destination: ${email}`);
  }
}

main().catch(console.error);