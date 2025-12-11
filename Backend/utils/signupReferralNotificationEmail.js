const getReferralNotificationEmail = (referredUser) => {
    const subject = '🎉 You Have a New Referral!';

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                .bonus { background-color: #e8f5e9; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
        </head>
       <body>
    <div class="container">
        <div class="header">
            <h1>🎊 New Referral Alert!</h1>
        </div>
        <div class="content">
            <p>Great news! A guest has signed up using your referral code.</p>
            
            <div class="bonus">
                <h3>📊 Referral Details:</h3>
                <p><strong>Referred Guest:</strong> ${referredUser.email}</p>
                <p><strong>Referral Bonus:</strong> You will be awarded <strong>250 points</strong> once the guest completes their <strong>first stay</strong>.</p>
                <p><strong>Total Referrals:</strong> +1 added to your referral count</p>
            </div>
            
            <p>Keep sharing your referral code to earn even more rewards!</p>
            <p>Thank you for helping grow our HotelIO community. 🏨</p>
        </div>
        <div class="footer">
            <p>This is an automated message from HotelIO. Please do not reply to this email.</p>
        </div>
    </div>
</body>

        </html>
    `;

    const text = `Congratulations! You've successfully referred ${referredUser.email} to HotelIO.\n\nReferral Bonus: 250 points will be added to your account\nTotal Referrals: +1 to your referral count\n\nKeep sharing your referral code to earn more rewards!\n\nThank you for helping grow our HotelIO community.`;

    return { subject, html, text };
};

module.exports = {
    getReferralNotificationEmail
};