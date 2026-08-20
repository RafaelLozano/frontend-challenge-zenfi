const MERCHANT_DICTIONARY: readonly { readonly token: string; readonly name: string }[] = [
  { token: 'UBER EATS', name: 'Uber Eats' },
  { token: 'UBER TRIP', name: 'Uber' },
  { token: 'MERCADO LIBRE', name: 'Mercado Libre' },
  { token: 'SAMS CLUB', name: "Sam's Club" },
  { token: '7 ELEVEN', name: '7-Eleven' },
  { token: 'HBO MAX', name: 'HBO Max' },
  { token: 'APPLE.COM', name: 'Apple' },
  { token: 'NETFLIX', name: 'Netflix' },
  { token: 'SPOTIFY', name: 'Spotify' },
  { token: 'AMAZON', name: 'Amazon México' },
  { token: 'STARBUCKS', name: 'Starbucks' },
  { token: 'CINEPOLIS', name: 'Cinépolis' },
  { token: 'TOTALPLAY', name: 'Totalplay' },
  { token: 'LIVERPOOL', name: 'Liverpool' },
  { token: 'CHEDRAUI', name: 'Chedraui' },
  { token: 'DOMINOS', name: "Domino's" },
  { token: 'SORIANA', name: 'Soriana' },
  { token: 'WALMART', name: 'Walmart' },
  { token: 'STEAM', name: 'Steam' },
  { token: 'TELCEL', name: 'Telcel' },
  { token: 'COSTCO', name: 'Costco' },
  { token: 'RAPPI', name: 'Rappi' },
  { token: 'PEMEX', name: 'Pemex' },
  { token: 'DIDI', name: 'DiDi' },
  { token: 'OXXO', name: 'Oxxo' },
  { token: 'AWS', name: 'AWS' },
  { token: 'CFE', name: 'CFE' },
];

const removePaymentPrefixes = (value: string): string =>
  value
    .replace(/^MERCADO PAGO\*/i, '')
    .replace(/^PAYPAL \*/i, '')
    .replace(/^SP \*/i, '');

const removeAlphanumericCodes = (value: string): string =>
  value.replace(/\b[A-Z]?\d{3,}[A-Z0-9]*\b/g, ' ');

const removeBranchSuffixes = (value: string): string =>
  value.replace(/\bSUC(URSAL)?\s+\w+/gi, '');

const removeRouteSegments = (value: string): string => {
  const carreteraIndex = value.search(/\bCARRETERA\b/i);

  if (carreteraIndex !== -1) {
    return value.slice(0, carreteraIndex);
  }

  const kmIndex = value.search(/\sKM\s/i);

  if (kmIndex !== -1) {
    return value.slice(0, kmIndex);
  }

  return value;
};

const removeTrailingSymbols = (value: string): string =>
  value.replace(/[\p{Emoji}\p{Symbol}]+$/u, '').trim();

const collapseWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim();

const toSpanishTitleCase = (value: string): string => {
  const words = value.toLowerCase().split(/\s+/).filter(Boolean);

  return words
    .map((word) => {
      const originalWord = value.split(/\s+/).find(
        (candidate) => candidate.toLowerCase() === word,
      );

      if (originalWord && /[ÁÉÍÓÚÑáéíóúñ]/.test(originalWord)) {
        return originalWord.charAt(0).toUpperCase() + originalWord.slice(1).toLowerCase();
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

const cleanGenericMerchant = (description: string): string => {
  let cleaned = description.toUpperCase();
  cleaned = removePaymentPrefixes(cleaned);
  cleaned = removeAlphanumericCodes(cleaned);
  cleaned = removeBranchSuffixes(cleaned);
  cleaned = removeRouteSegments(cleaned);
  cleaned = removeTrailingSymbols(cleaned);
  cleaned = collapseWhitespace(cleaned);

  if (cleaned.length === 0) {
    return description.trim();
  }

  return toSpanishTitleCase(cleaned);
};

const findDictionaryMerchant = (description: string): string | null => {
  const upper = description.toUpperCase();

  for (const entry of MERCHANT_DICTIONARY) {
    if (upper.includes(entry.token)) {
      return entry.name;
    }
  }

  return null;
};

export const deriveMerchant = (description: string): string => {
  const dictionaryMatch = findDictionaryMerchant(description);

  if (dictionaryMatch) {
    return dictionaryMatch;
  }

  return cleanGenericMerchant(description);
};
