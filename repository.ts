type MaybePromise<T> = T | Promise<T>;

interface Repository {
  increment(): MaybePromise<void>;
  getCount(): MaybePromise<number>;
}

class KVRepository implements Repository {
  private kv: Deno.Kv;
  private key: Deno.KvKey;

  constructor(kv: Deno.Kv, key: Deno.KvKey) {
    this.kv = kv;
    this.key = key;
  }

  public async increment() {
    const result = await this.kv.atomic().sum(this.key, 1n).commit();
    if (!result.ok) {
      console.error("Failed to increment counter in KV store");
    }
  }

  public async getCount(): Promise<number> {
    const result = await this.kv.get<number>(this.key);
    return result.value ?? 0;
  }
}

export const repository: Repository = new KVRepository(
  await Deno.openKv(),
  ["awoo-counter"],
);
