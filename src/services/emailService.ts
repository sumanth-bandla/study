import emailjs from '@emailjs/browser';

/**
 * Service to dispatch real 6-digit OTP verification emails.
 * Supports:
 * 1. Formspree / Webhook free zero-config mailer relay
 * 2. EmailJS live client delivery
 * 3. Fallback browser notification with instant auto-fill
 */

export interface EmailDispatchConfig {
  serviceId?: string;
  templateId?: string;
  publicKey?: string;
  endpointUrl?: string;
}

export const getEmailConfig = (): EmailDispatchConfig => {
  return {
    serviceId: (import.meta as any).env?.VITE_EMAILJS_SERVICE_ID || localStorage.getItem('STUDYHUB_EMAILJS_SERVICE_ID') || '',
    templateId: (import.meta as any).env?.VITE_EMAILJS_TEMPLATE_ID || localStorage.getItem('STUDYHUB_EMAILJS_TEMPLATE_ID') || '',
    publicKey: (import.meta as any).env?.VITE_EMAILJS_PUBLIC_KEY || localStorage.getItem('STUDYHUB_EMAILJS_PUBLIC_KEY') || '',
    endpointUrl: (import.meta as any).env?.VITE_MAIL_ENDPOINT_URL || localStorage.getItem('STUDYHUB_MAIL_ENDPOINT') || ''
  };
};

export const saveEmailConfig = (config: EmailDispatchConfig) => {
  if (config.serviceId) localStorage.setItem('STUDYHUB_EMAILJS_SERVICE_ID', config.serviceId.trim());
  if (config.templateId) localStorage.setItem('STUDYHUB_EMAILJS_TEMPLATE_ID', config.templateId.trim());
  if (config.publicKey) localStorage.setItem('STUDYHUB_EMAILJS_PUBLIC_KEY', config.publicKey.trim());
  if (config.endpointUrl) localStorage.setItem('STUDYHUB_MAIL_ENDPOINT', config.endpointUrl.trim());
};

export const sendOtpEmail = async (
  recipientEmail: string,
  recipientName: string,
  otpCode: string
): Promise<{ sentRealMail: boolean; message: string }> => {
  const config = getEmailConfig();

  // 1. Try Custom Webhook / Serverless API Relay if configured
  if (config.endpointUrl) {
    try {
      const res = await fetch(config.endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipientEmail,
          name: recipientName || 'Student',
          subject: `Your STUDYHUB AI Verification Code is ${otpCode}`,
          otp: otpCode,
          time: new Date().toLocaleTimeString()
        })
      });
      if (res.ok) {
        return {
          sentRealMail: true,
          message: `Verification PIN has been delivered to ${recipientEmail}. Check your inbox or spam folder!`
        };
      }
    } catch (e) {
      console.warn('Custom mail endpoint delivery note:', e);
    }
  }

  // 2. Try EmailJS client-side delivery if configured
  if (config.serviceId && config.templateId && config.publicKey) {
    try {
      await emailjs.send(
        config.serviceId,
        config.templateId,
        {
          to_email: recipientEmail,
          to_name: recipientName || 'Student',
          otp_code: otpCode,
          app_name: 'STUDYHUB AI',
          time_sent: new Date().toLocaleTimeString()
        },
        config.publicKey
      );
      return {
        sentRealMail: true,
        message: `Real verification PIN delivered to ${recipientEmail}. Please check your inbox or spam folder.`
      };
    } catch (err: any) {
      console.warn('EmailJS transmission note:', err);
    }
  }

  // 3. Built-in instant fallback: Show security banner with copyable PIN
  return {
    sentRealMail: false,
    message: `Verification PIN for ${recipientEmail}: ${otpCode}`
  };
};
