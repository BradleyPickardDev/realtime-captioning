const loremIpsumTexts: string[] = [
  "Lorem ipsum dolor sit amet",
  "Consectetur adipiscing elit",
  "Vestibulum suscipit nulla ut",
  "Donec at orci nec mauris",
  "Curabitur eget nunc sed",
];

export function generateCaption(): string {
  return loremIpsumTexts[Math.floor(Math.random() * loremIpsumTexts.length)];
}
