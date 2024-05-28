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
} as const;
