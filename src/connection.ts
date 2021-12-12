import { createClient } from 'redis';

/** The redis client type, derived from the return type of createClient */
export type RedisClient = ReturnType<typeof createClient>;
