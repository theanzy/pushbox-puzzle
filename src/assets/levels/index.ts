const levelObj = import.meta.glob('./*.json', {
  eager: true,
  import: 'default',
});
export const LEVELS = Object.entries(levelObj).reduce((res, [_, e], i) => {
  res[i] = e;
  return res;
}, {} as Record<number, any>);
export const DUDE_INDEX = 53;
export const WALL_INDEX = 100;

export const BOX_INDEXES = {
  grey: 37,
  blue: 35,
} as const;

export const TARGET_INDEXES = {
  grey: 78,
  blue: 52,
} as const;
