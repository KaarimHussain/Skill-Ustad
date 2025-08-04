namespace SkillUstad.Service
{
    public class EmailService
    {
        public async Task SendOtpEmailAsync(string toEmail, string otp)
        {
            var message = new MimeKit.MimeMessage();
            message.From.Add(new MimeKit.MailboxAddress("SkillUstad", "skillustad2025@gmail.com"));
            message.To.Add(new MimeKit.MailboxAddress("User", toEmail));
            message.Subject = "Your OTP for Password Reset";
            message.Body = new MimeKit.TextPart("plain")
            {
                Text = $"Your OTP for password reset is: {otp}\nThis OTP will expire in 10 minutes."
            };

            using var client = new MailKit.Net.Smtp.SmtpClient();
            await client.ConnectAsync("smtp.example.com", 587, false);
            await client.AuthenticateAsync("skillustad2025@gmail.com", "tgvt mxlq eabf qgiq");
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}