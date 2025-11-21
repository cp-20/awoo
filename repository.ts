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

  constructor(collection: Collection<CounterDocument>, counterId: string) {
    this.collection = collection;
    this.counterId = counterId;
  }

  public async increment(): Promise<void> {
    try {
      await this.collection.updateOne(
        { _id: this.counterId },
        { $inc: { count: 1 } },
        { upsert: true },
      );
    } catch (error) {
      console.error("Failed to increment counter in MongoDB", error);
    }
  }

  public async getCount(): Promise<number> {
    const result = await this.collection.findOne({ _id: this.counterId });
    return result?.count ?? 0;
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
