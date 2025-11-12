import { FormData } from '../types';

interface WebhookResult {
  success: boolean;
  message: string;
}

export async function sendFormDataToWebhook(data: FormData, url: string): Promise<WebhookResult> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();
        return {
            success: false,
            message: `Webhook failed: ${response.status} ${response.statusText}. ${errorText}`,
        };
    }

    return { success: true, message: 'Data sent successfully' };
  } catch (error) {
    console.error('Webhook error:', error);
    if (error instanceof TypeError) {
      return {
        success: false,
        message: 'A network error occurred. This could be a CORS issue or an invalid URL.',
      };
    }
    return {
      success: false,
      message: 'An unknown error occurred while sending data.',
    };
  }
}
