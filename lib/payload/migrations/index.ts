import * as migration_20260907_184240_initial from './20260907_184240_initial';

export const migrations = [
  {
    up: migration_20260907_184240_initial.up,
    down: migration_20260907_184240_initial.down,
    name: '20260907_184240_initial',
  },
];
