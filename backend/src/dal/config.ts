import { UpdateResult } from "mongodb";
import * as db from "../init/db";
import _ from "lodash";

const configLegacyProperties = [
  "swapEscAndTab",
  "quickTab",
  "chartStyle",
  "chartAverage10",
  "chartAverage100",
  "alwaysShowCPM",
  "resultFilters",
  "chartAccuracy",
  "liveSpeed",
  "extraTestColor",
  "savedLayout",
  "showTimerBar",
  "showDiscordDot",
  "maxConfidence",
  "capsLockBackspace",
  "showAvg",
  "enableAds",
];

export async function saveConfig(
  uid: string,
  config: object
): Promise<UpdateResult> {
  const configChanges = _.mapKeys(config, (_value, key) => `config.${key}`);

  const unset = _.fromPairs(
    _.map(configLegacyProperties, (key) => [`config.${key}`, ""])
  );

  return await db
    .collection<any>("configs")
    .updateOne(
      { uid },
      { $set: configChanges, $unset: unset },
      { upsert: true }
    );
}

export async function getConfig(uid: string): Promise<any> {
  const config = await db.collection<any>("configs").findOne({ uid });
  return config;
}

export async function deleteConfig(uid: string): Promise<any> {
  return await db.collection<any>("configs").deleteOne({ uid });
}
