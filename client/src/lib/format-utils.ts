// Currency formatting utilities
export const formatPeso = (value: number): string => {
  return `₱${value.toLocaleString('en-PH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
};

export const formatPesoWithDecimals = (value: number): string => {
  return `₱${value.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

// Number formatting utilities
export const formatNumber = (value: number): string => {
  return value.toLocaleString('en-PH');
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatCompactNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

// Date formatting utilities
export const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTime = (time: string): string => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-PH', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Get day of week
export const getDayOfWeek = (date: string): string => {
  return new Date(date).toLocaleDateString('en-PH', { weekday: 'short' });
};