"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCaption = generateCaption;
const loremIpsumTexts = [
    "Lorem ipsum dolor sit amet",
    "Consectetur adipiscing elit",
    "Vestibulum suscipit nulla ut",
    "Donec at orci nec mauris",
    "Curabitur eget nunc sed",
];
function generateCaption() {
    return loremIpsumTexts[Math.floor(Math.random() * loremIpsumTexts.length)];
}
