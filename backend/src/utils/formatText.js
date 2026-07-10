const formatCpf = (cpf) => {
  if (!cpf) return '';

  const numbers = cpf.replace(/\D/g, '');

  return numbers.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    '$1.$2.$3-$4'
  );
}

const formatPhone = (phone) => {
  if (!phone) return '';

  const numbers = phone.replace(/\D/g, '');

  if (numbers.length === 11) {
    return numbers.replace(
      /(\d{2})(\d{5})(\d{4})/,
      '($1) $2-$3'
    );
  }

  if (numbers.length === 10) {
    return numbers.replace(
      /(\d{2})(\d{4})(\d{4})/,
      '($1) $2-$3'
    );
  }

  return phone;
}

module.exports = {
  formatCpf,
  formatPhone,
}