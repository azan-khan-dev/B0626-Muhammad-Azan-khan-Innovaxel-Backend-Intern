const parseDate = (dateStr) => {
  if (!dateStr) return null;

  // YYYY-MM-DD ya YYYY-M-D
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-');
    // Zero pad karo
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // DD-MM-YYYY ya D-M-YYYY ya DD/MM/YYYY ya D/M/YYYY
  if (/^\d{1,2}[-\/]\d{1,2}[-\/]\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split(/[-\/]/);
    // Zero pad karo
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return null;
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
};

export { parseDate, formatDate };