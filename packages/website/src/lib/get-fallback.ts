export const getFallback = (name: string) =>
  name
    .split(" ")
    .splice(0, 2)
    .map((l) => l[0])
    .join("")
    .toUpperCase();
