const twilioClient = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const sendVerificationCode = async phoneNo => {
    await twilioClient.verify
    .services(process.env.TWILIO_SERVICE_SID).verifications
    .create({to: phoneNo, channel: 'sms'});
};

const checkVerificationCode = async (phoneNo, code) => {
    const { status } = await twilioClient.verify
                       .services(process.env.TWILIO_SERVICE_SID).verificationChecks
                       .create({to: phoneNo, code});
    return status;
};

module.exports = {
    sendVerificationCode,
    checkVerificationCode
};