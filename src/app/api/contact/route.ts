import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, projectType, details, message, formName, subject, ...extraData } = body;

    const finalName = name || body.Name || body.name || 'Anonymous';
    const finalEmail = email || body.Email || body.email || 'No email provided';
    const finalType = projectType || formName || 'General Inquiry';
    const finalDetails = details || message || body.Details || body.details || body.Message || body.message || '';

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      return NextResponse.json({ error: 'Email configuration is missing on the server.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass,
      },
    });

    // Format all received data into HTML rows
    const allFields = {
      'Name': finalName,
      'Email': finalEmail,
      'Form / Subject': finalType,
      'Message': finalDetails,
      ...extraData,
    };

    const htmlRows = Object.entries(allFields)
      .filter(([_, val]) => val !== undefined && val !== null && val !== '')
      .map(([key, val]) => `
        <tr>
          <td style="padding: 12px 10px; font-weight: bold; width: 140px; border-bottom: 1px solid #eee; text-transform: capitalize; background-color: #fafafa; color: #555; font-size: 13px;">${key}:</td>
          <td style="padding: 12px 10px; border-bottom: 1px solid #eee; color: #111; font-size: 14px; white-space: pre-wrap;">${typeof val === 'object' ? JSON.stringify(val, null, 2) : val}</td>
        </tr>
      `).join('');

    const emailSubject = subject || `[Form Submission] ${finalType} - from ${finalName}`;

    const mailOptions = {
      from: `"${finalName}" <${user}>`,
      to: user,
      replyTo: finalEmail.includes('@') ? finalEmail : undefined,
      subject: emailSubject,
      text: Object.entries(allFields)
        .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
        .join('\n'),
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e1e1e1; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); background-color: #ffffff;">
          <h2 style="color: #111; border-bottom: 3px solid #111; padding-bottom: 15px; margin-top: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">New Form Submission</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 25px; font-size: 14px; color: #333; line-height: 1.5;">
            ${htmlRows}
          </table>
          
          <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; font-size: 11px; color: #888; text-align: center; font-family: monospace;">
            Submitted from PaaS Application • ${new Date().toLocaleString()}
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send message.' }, { status: 500 });
  }
}
