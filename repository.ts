import { Collection, Db, MongoClient } from "mongodb";

type MaybePromise<T> = T | Promise<T>;

interface Repository {
  increment(): MaybePromise<void>;
  getCount(): MaybePromise<number>;
}

interface CounterDocument {
  _id: string;
  count: number;
}

class MongoRepository implements Repository {
  private collection: Collection<CounterDocument>;
  private counterId: string;
  private localCount = 0;
  private pendingDelta = 0;
  private flushTimer: ReturnType<typeof setTimeout> | undefined;
  private initPromise: Promise<void> | null = null;

  constructor(collection: Collection<CounterDocument>, counterId: string) {
    this.collection = collection;
    this.counterId = counterId;
  }

  private ensureInitialized() {
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      const result = await this.collection.findOne({ _id: this.counterId });
      this.localCount = result?.count ?? 0;
    })();

    return this.initPromise;
  }

  private flush() {
    if (this.pendingDelta === 0) return;

    const delta = this.pendingDelta;
    this.pendingDelta = 0;
    this.flushTimer = undefined;

    this.collection
      .updateOne(
        { _id: this.counterId },
        { $inc: { count: delta } },
        { upsert: true },
      )
      .catch((error) => {
        console.error("Failed to flush counter to MongoDB", error);
      });
  }

  public async increment(): Promise<void> {
    await this.ensureInitialized();
    this.localCount++;
    this.pendingDelta++;

    if (this.flushTimer) clearTimeout(this.flushTimer);
    this.flushTimer = setTimeout(() => this.flush(), 1000);
  }

  public async getCount(): Promise<number> {
    await this.ensureInitialized();
    return this.localCount;
  }
}

const mongoUrl = Deno.env.get("MONGODB_URL") || "mongodb://localhost:27017";
const dbName = Deno.env.get("MONGODB_DB") || "awoo";

const client = new MongoClient(mongoUrl);
await client.connect();
const db: Db = client.db(dbName);
const collection = db.collection<CounterDocument>("counters");

export const repository: Repository = new MongoRepository(
  collection,
  "awoo-counter",
);
