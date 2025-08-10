using System.Net;
using System.Net.Mail;

namespace SkillUstad.Service
{
    public class EmailService
    {
        private readonly SmtpClient _smtpClient;
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            this._config = config;
            _smtpClient = new SmtpClient(config["Email:SmtpHost"], int.Parse(config["Email:SmtpPort"]))
            {
                Credentials = new NetworkCredential(config["Email:Username"], config["Email:Password"]),
                EnableSsl = true
            };
        }

        public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = true)
        {
            var mailMessage = new MailMessage(_config["Email:From"], to, subject, body)
            {
                IsBodyHtml = isHtml
            };
            await _smtpClient.SendMailAsync(mailMessage);
        }

        public async Task SendPasswordResetEmail(string to, string resetLink)
        {
            var subject = "SkillUstad - Password Reset Request";
            var body = $@"
                <p>Hello,</p>
                <p>You requested a password reset for your SkillUstad account.</p>
                <p>Click the link below to reset your password:</p>
                <p><a href='{resetLink}'>{resetLink}</a></p>
                <p>If you did not request this, you can safely ignore this email.</p>
                <p>— The SkillUstad Team</p>
            ";

            await SendEmailAsync(to, subject, body);
        }

        public async Task SendEmailConformationEmail(string to, int otp)
        {
            var subject = "SkillUstad - Email Confformation Request";
            var body = $@"
                <p>Hello,</p>
                <p>Thank you for registering at Skill Ustad Platform</p>
                <p>We will need to verify your email</p>
                <p>Your OTP is {otp}</p>
                <p>The OTP will expire in 15-minutes</p>
                <p>If you did not request this, you can safely ignore this email.</p>
                <p>— The SkillUstad Team</p>
            ";

            await SendEmailAsync(to, subject, body);
        }
    }

}