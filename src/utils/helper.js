export const slugify = (str) => {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple - with a single -
    .replace(/^-+/, "") // Trim - from the start of the text
    .replace(/-+$/, ""); // Trim - from the end of the text
};

export function convertPrice({ amount, baseCurrency, desiredCurrency }) {
  const rates = {
    EUR: parseFloat(process.env.NEXT_PUBLIC_EUR_TO_XAF),
    USD: parseFloat(process.env.NEXT_PUBLIC_USD_TO_XAF),
    XAF: parseFloat(process.env.NEXT_PUBLIC_XAF_TO_XAF),
  };

  const newPrice = (rates[baseCurrency] * amount) / rates[desiredCurrency];
  return parseFloat(newPrice.toFixed(2));
}

export const log = (...args) => {
  if (process.env.NODE_ENV !== "production") console.log(...args);
};

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function ordinalSuffixOf(i) {
  const j = i % 10;
  const k = i % 100;
  let suffix = "th";
  if (j === 1 && k !== 11) {
    suffix = "st";
  }
  if (j === 2 && k !== 12) {
    suffix = "nd";
  }
  if (j === 3 && k !== 13) {
    suffix = "rd";
  }
  return i + "<sup>" + suffix + "</sup>";
}
