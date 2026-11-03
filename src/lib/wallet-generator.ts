import { Business, Customer } from '@/types';

/**
 * Generates the Apple Wallet pass.json payload
 * Conforms to Apple PassKit specification for 'storeCard' or 'generic'
 */
export function generateApplePassJson(business: Business, customer: Customer) {
  const config = business.loyaltyConfig;
  const stampsRemaining = Math.max(0, config.totalStamps - customer.currentStamps);

  return {
    formatVersion: 1,
    passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID || 'pass.com.markethers.loyalty',
    teamIdentifier: process.env.APPLE_TEAM_ID || 'MARKETHERS12',
    serialNumber: customer.qrCodeToken,
    organizationName: business.name,
    description: `Tarjeta de lealtad de ${business.name}`,
    logoText: business.name,
    foregroundColor: 'rgb(255, 255, 255)',
    backgroundColor: config.cardBgColor || 'rgb(28, 25, 23)',
    labelColor: 'rgb(214, 211, 209)',
    barcodes: [
      {
        format: 'PKBarcodeFormatQR',
        message: customer.qrCodeToken,
        messageEncoding: 'iso-8859-1',
        altText: customer.qrCodeToken,
      },
    ],
    storeCard: {
      headerFields: [
        {
          key: 'stamps',
          label: 'SELLOS',
          value: `${customer.currentStamps}/${config.totalStamps}`,
          textAlignment: 'PKTextAlignmentRight',
        },
      ],
      primaryFields: [
        {
          key: 'customer',
          label: 'TITULAR',
          value: customer.name,
        },
      ],
      secondaryFields: [
        {
          key: 'reward',
          label: 'PRÓXIMO PREMIO',
          value: config.rewardTitle,
        },
      ],
      auxiliaryFields: [
        {
          key: 'status',
          label: 'ESTADO',
          value:
            customer.currentStamps >= config.totalStamps
              ? '🎉 ¡PREMIO DISPONIBLE!'
              : `Faltan ${stampsRemaining} sello(s)`,
        },
        {
          key: 'points',
          label: 'VISITAS',
          value: `${customer.totalVisits}`,
        },
      ],
      backFields: [
        {
          key: 'terms',
          label: 'TÉRMINOS Y CONDICIONES',
          value: config.terms,
        },
        {
          key: 'address',
          label: 'UBICACIÓN',
          value: `${business.address}, ${business.city}`,
        },
        {
          key: 'phone',
          label: 'CONTACTO',
          value: business.phone,
        },
        {
          key: 'system',
          label: 'PLATAFORMA',
          value: 'Operado por MenuBeacon · Un producto de Markethers',
        },
      ],
    },
  };
}

/**
 * Generates the Google Wallet Generic Pass / Loyalty Pass payload
 * Conforms to Google Wallet REST API specification
 */
export function generateGoogleWalletPass(business: Business, customer: Customer) {
  const config = business.loyaltyConfig;
  const issuerId = process.env.GOOGLE_ISSUER_ID || 'markethers-issuer-demo';
  const classId = `${issuerId}.${business.slug}-loyalty`;
  const objectId = `${issuerId}.${customer.qrCodeToken}`;

  return {
    loyaltyClass: {
      id: classId,
      issuerName: business.name,
      programName: `Club de Fidelidad ${business.name}`,
      reviewStatus: 'UNDER_REVIEW',
      hexBackgroundColor: config.cardBgColor,
      heroImage: {
        sourceUri: {
          uri: business.coverUrl,
        },
      },
    },
    loyaltyObject: {
      id: objectId,
      classId: classId,
      state: 'ACTIVE',
      accountId: customer.phone,
      accountName: customer.name,
      barcode: {
        type: 'QR_CODE',
        value: customer.qrCodeToken,
        alternateText: customer.qrCodeToken,
      },
      loyaltyPoints: {
        label: 'Sellos Acumulados',
        balance: {
          string: `${customer.currentStamps} de ${config.totalStamps}`,
        },
      },
      secondaryLoyaltyPoints: {
        label: 'Próxima Recompensa',
        balance: {
          string: config.rewardTitle,
        },
      },
    },
  };
}
