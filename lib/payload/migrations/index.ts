import * as migration_20260907_184239_payload_migrations from './20260907_184239_payload_migrations';
import * as migration_20260907_184240_initial from './20260907_184240_initial';
import * as migration_20260910_183306_add_vercel_blob_media from './20260910_183306_add_vercel_blob_media';
import * as migration_20260910_184951_add_media_prefix from './20260910_184951_add_media_prefix';

export const migrations = [
  {
    up: migration_20260907_184239_payload_migrations.up,
    down: migration_20260907_184239_payload_migrations.down,
    name: '20260907_184239_payload_migrations',
  },
  {
    up: migration_20260907_184240_initial.up,
    down: migration_20260907_184240_initial.down,
    name: '20260907_184240_initial',
  },
  {
    up: migration_20260910_183306_add_vercel_blob_media.up,
    down: migration_20260910_183306_add_vercel_blob_media.down,
    name: '20260910_183306_add_vercel_blob_media',
  },
  {
    up: migration_20260910_184951_add_media_prefix.up,
    down: migration_20260910_184951_add_media_prefix.down,
    name: '20260910_184951_add_media_prefix',
  },
];
