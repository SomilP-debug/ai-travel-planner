import dotenv from 'dotenv';
dotenv.config();

export const sendInviteEmail = async (to, tripId, inviterName) => {
  const inviteLink = `${process.env.CLIENT_URL}/trip/${tripId}/join`;
  
  // The exact email address you verified inside your Brevo account
  const SENDER_EMAIL = "somil.pitliya@gmail.com"; 

  const payload = {
    sender: { 
        name: "AI Travel Planner", 
        email: SENDER_EMAIL 
    },
    to: [{ email: to }],
    subject: `${inviterName} invited you to collaborate on a trip!`,
    htmlContent: `
        <h2>You've been invited!</h2>
        <p>${inviterName} has invited you to help plan an upcoming trip.</p>
        <p><a href="${inviteLink}" style="background:#4CAF50; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Join Trip Dashboard</a></p>
    `
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API rejected the request:', errorData);
      throw new Error('Failed to send email via Brevo API');
    }

    const data = await response.json();
    console.log(`Invite email sent successfully to ${to}. Message ID:`, data.messageId);
    
  } catch (error) {
    console.error('Error in sendInviteEmail:', error);
    throw error;
  }
};