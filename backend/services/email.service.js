import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import dns from 'dns'; 

dns.setDefaultResultOrder('ipv4first');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_KEY,
  },
});

export const sendInviteEmail = async (to, tripId, inviterName) => {
  const inviteLink = `${process.env.CLIENT_URL}/trip/${tripId}/join`;
    
    const mailOptions = {
        from: `"AI Travel Planner" <${process.env.SMTP_USER}>`,
        to,
        subject: `${inviterName} invited you to collaborate on a trip!`,
        html: `
            <h2>You've been invited!</h2>
            <p>${inviterName} has invited you to help plan an upcoming trip.</p>
            <p><a href="${inviteLink}" style="background:#4CAF50; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Join Trip Dashboard</a></p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Invite email sent successfully to ${to}`);
    } catch (error) {
        console.error('Error sending invite email:', error);
        throw error;
    }
};