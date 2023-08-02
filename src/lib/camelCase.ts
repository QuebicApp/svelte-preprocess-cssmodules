const camelCase = (str: string): string => {
  const strings = str.split('-');
  return strings.reduce(
    (acc: string, val: string) => `${acc}${val[0].toUpperCase()}${val.slice(1)}`
  );
};

export default camelCase;
