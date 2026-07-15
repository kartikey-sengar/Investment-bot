export function formatCurrency(amount, currency = 'INR') {
  if (amount === null || amount === undefined) return '—';
  
  const localeMap = {
    INR: 'en-IN',
    USD: 'en-US',
    GBP: 'en-GB',
    EUR: 'de-DE',
    CAD: 'en-CA',
    AUD: 'en-AU',
  };

  const locale = localeMap[currency] || 'en-IN';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompact(amount, currency = 'INR') {
  if (amount === null || amount === undefined) return '—';

  const abs = Math.abs(amount);
  if (currency === 'INR') {
    if (abs >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (abs >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (abs >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  }

  if (abs >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return `$${amount}`;
}

export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined) return '—';
  return `${Number(value).toFixed(decimals)}%`;
}

export function formatNumber(value) {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('en-IN').format(value);
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatMonths(months) {
  if (!months) return '—';
  if (months < 12) return `${months} month${months > 1 ? 's' : ''}`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  let str = `${years} year${years > 1 ? 's' : ''}`;
  if (rem > 0) str += ` ${rem} mo`;
  return str;
}
