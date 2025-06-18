import { Lighthouse } from "./scan/Lighthouse.js";
import * as fs from "node:fs";
import * as console from "node:console";
import { Collection, MongoClient } from "mongodb";
import * as process from "node:process";

const queueContent = await fs.promises.readFile("domainQueue.csv", "utf-8");
const domains = queueContent.split("\r\n");

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const MONGODB_URI = process.env.MONGODB_URI!;

type ResultDoc = { domain: string; score: number | null };

const mongoClient = new MongoClient(MONGODB_URI);
await mongoClient.connect();
const db = mongoClient.db("a11y-checker-marketing-scan");
const results: Collection<ResultDoc> = db.collection("results");

const alreadyScannedDomains = (
  await results.find({}, { projection: { domain: 1 } }).toArray()
).map((result) => result.domain);

const writeQueue: ResultDoc[] = [];
const BATCH_SIZE = 20;

const flushQueue = async () => {
  if (writeQueue.length === 0) return;

  const batch = writeQueue.splice(0, writeQueue.length);

  try {
    await results.insertMany(batch, { ordered: false });
    console.log(`💾 Saved ${batch.length} results`);
  } catch (err) {
    console.error("InsertMany failed:", err);
  }
};

const addToWriteQueue = async (doc: ResultDoc) => {
  writeQueue.push(doc);
  if (writeQueue.length >= BATCH_SIZE) {
    await flushQueue();
  }
};

console.log(`▶️ todo: ${domains.length}`);
const interval = setInterval(() => {
  void flushQueue();
  console.log(`▶️ todo: ${domains.length}`);
}, 10 * 1000);

const runScanProcess = async (i: number) => {
  for (
    let domain = domains.pop();
    domain !== undefined;
    domain = domains.pop()
  ) {
    console.log(`${i}: Scanning ${domain}`);
    if (alreadyScannedDomains.includes(domain)) {
      console.log(`${i}: -> Skipping ${domain}`);
      continue;
    }
    try {
      const score = await Lighthouse.calculateA11yScore(`https://${domain}`);
      await addToWriteQueue({ domain, score: score ?? null });
      console.log(`${i}: Score for ${domain}: ${score}`);
    } catch (e) {
      await addToWriteQueue({ domain, score: null });
      console.error(
        `${i}: -> 💥 Error for ${domain}: ${e instanceof Error ? e.message : e}`,
      );
    }
  }
  console.log(`${i}: ready`);
};

await Promise.all([runScanProcess(1), runScanProcess(2), runScanProcess(3)]);

interval.unref();
