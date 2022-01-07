interface quote {
  text: string;
  author: string;
}

interface quotes extends Array<quote> {}

export { quote, quotes };
