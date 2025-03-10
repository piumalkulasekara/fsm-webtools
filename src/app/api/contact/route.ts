import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a transporter with your SMTP details (e.g., Gmail)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT), // typically 587 for TLS or 465 for SSL
      secure: Boolean(process.env.IS_PORT_SECURE), // set to true if using port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define the subject and HTML email template.
    const subject = "🚨 Attention Needed: New Contact Form Submission!";
    const htmlBody = `
      <html>
        <head>
          <style>
            /* Basic inline styles for email */
            body { font-family: Arial, sans-serif; color: #333; }
            h1 { color: #0070f3; }
            .container { padding: 20px; }
            .header { margin-bottom: 20px; }
            .footer { margin-top: 20px; font-size: 0.9em; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Submission</h1>
              <p>You have received a new message from the contact form on your website.</p>
            </div>
            <div class="content">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            </div>
            <div class="footer">
              <p>This email was generated automatically by your contact form.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: email,
      to: process.env.CONTACT_EMAIL, // Your destination email
      subject: subject,
      // In case the HTML email fails, send a fallback plain-text message.
      text: `New Contact Submission
Name: ${name}
Email: ${email}
Message: ${message}`,
      html: htmlBody,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
