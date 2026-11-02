import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      recipients = [],
      subject = '',
      body: emailBody = '',
      senderName = 'Markethers',
      replyTo = 'hola@markethers.app',
      buttonText = '',
      buttonUrl = '',
      apiKey = '',
    } = body;

    const validRecipients = Array.isArray(recipients)
      ? recipients.map((e: string) => e?.trim()).filter((e: string) => e && e.includes('@'))
      : [];

    if (validRecipients.length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron destinatarios con formato de correo válido.' },
        { status: 400 }
      );
    }

    const resendKey = apiKey || process.env.RESEND_API_KEY;

    // Si hay una API Key de Resend (configurada en .env o provista por el comercio)
    if (resendKey) {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
            .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
            .header { background: #0f172a; color: #ffffff; padding: 28px 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
            .content { padding: 32px 28px; line-height: 1.6; font-size: 15px; color: #334155; white-space: pre-wrap; }
            .btn-container { text-align: center; padding: 12px 28px 28px; }
            .btn { display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: #042f2e; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 28px; border-radius: 12px; }
            .footer { background: #f8fafc; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1>${senderName}</h1>
            </div>
            <div class="content">${emailBody.replace(/\n/g, '<br/>')}</div>
            ${
              buttonText && buttonUrl
                ? `<div class="btn-container"><a href="${buttonUrl}" class="btn">${buttonText} →</a></div>`
                : ''
            }
            <div class="footer">
              <p>Enviado mediante <strong>Markethers CRM & Loyalty</strong></p>
              <p>Para dejar de recibir estas novedades, responde a este correo solicitando tu baja.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `${senderName} <onboarding@resend.dev>`,
            to: validRecipients.slice(0, 50),
            subject,
            text: emailBody,
            html: htmlContent,
            reply_to: replyTo,
          }),
        });

        const resendData = await resendRes.json();

        if (!resendRes.ok) {
          return NextResponse.json(
            {
              error: resendData.message || 'Error al conectar con la API de Resend.',
              details: resendData,
            },
            { status: resendRes.status }
          );
        }

        return NextResponse.json({
          success: true,
          mode: 'resend_api',
          deliveredCount: validRecipients.length,
          recipients: validRecipients,
          id: resendData.id,
        });
      } catch (err: any) {
        return NextResponse.json(
          { error: `Error de red con el proveedor de correo: ${err?.message || err}` },
          { status: 500 }
        );
      }
    }

    // Modo sin API Key: Prepara la carga para envío directo por cliente de correo
    return NextResponse.json({
      success: true,
      mode: 'web_client_ready',
      recipientsCount: validRecipients.length,
      recipients: validRecipients,
      message:
        'Servidor listo. Sin API Key de Resend, la campaña se despacha mediante tu cuenta de correo preferida (Gmail Web, Outlook o Apple Mail).',
    });
  } catch (error: any) {
    console.error('Error in /api/send-email:', error);
    return NextResponse.json(
      { error: 'Error interno al procesar el envío de correo.', details: error?.message },
      { status: 500 }
    );
  }
}
