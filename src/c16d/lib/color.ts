const hex = (x: number) => x.toString(16).padStart(2, "0");

export const rgbToHexColor = ([r, g, b]: [number, number, number]) =>
  `#${hex(r)}${hex(g)}${hex(b)}`;

const MAX_COLOR_VALUE = 16777215; // Maximum value for a 24-bit color

export const randomHexcode = () =>
  `#${Math.floor(Math.random() * MAX_COLOR_VALUE)
    .toString(16)
    .padStart(6, "0")}`;
