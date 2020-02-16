const mail = require('@sendgrid/mail')

class EmailClient {
  constructor(emailConfig) {
    mail.setApiKey(emailConfig.apiKey)
    this.emailConfig = emailConfig
    this.mail = mail
  }

  sendInvitationToGroup(groupName, toEmail, fromUserName) {
    const message = {
      to: toEmail,
      from: 'noreply@hawth.org',
      templateId: this.emailConfig.groupInviteTemplateId,
      dynamic_template_data: {
        fromUserName: fromUserName,
        groupName: groupName,
        Sender_Name: 'Hawthorn',
        Sender_Address: '1576 Sherman St.',
        Sender_City: 'Denver',
        Sender_State: 'CO',
        Sender_Zip: '80203',
      },
    };
    this.mail.send(message);
  }
}

module.exports = {
  EmailClient
}