const capitalizeWords = (text) => {
  return text
    .toLowerCase()
    .split(' ')
    .filter(word => word)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const capitalizeName = (name) => {
  const exceptions = ['da', 'de', 'do', 'dos', 'das', 'e'];

  return name
    .toLowerCase()
    .split(' ')
    .filter(word => word)
    .map(word => {
      if (exceptions.includes(word)) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ')
}

module.exports = {
  capitalizeWords,
  capitalizeName
}