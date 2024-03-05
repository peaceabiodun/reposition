export const truncateString = (str: string, numWords: number) => {
  if (!str) return str;
  const words = str.split(' ');
  if (words?.length <= numWords) {
    return str;
  }
  if (numWords > words?.length) {
    return words?.slice(0, words?.length).join(' ') + '...';
  }
  if (numWords <= words.length) {
    return words?.slice(0, numWords).join(' ') + '...';
  }
};
