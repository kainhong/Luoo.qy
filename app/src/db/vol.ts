import { insert, find, isExist, findOne, getDB } from "./utils";
import { VolInfo, VolTrackMap } from "../types";
import Nedb = require("nedb");

const volDB: Nedb = getDB("vol");

const volTrackMapDB: Nedb = getDB("vol_track_map");

function saveVolTrackMap(map: VolTrackMap): Promise<VolTrackMap> {
  return insert<VolTrackMap>(volTrackMapDB, map);
}

function saveVolTracksMap(vol: VolInfo): Promise<VolTrackMap[]> {
  const { tracks } = vol;
  const maps: VolTrackMap[] = tracks.map(
    track => ({ id: track.id, vol: track.vol, volId: vol.id } as VolTrackMap)
  );
  return Promise.all(maps.map((map: VolTrackMap) => saveVolTrackMap(map)));
}

async function saveVol(vol: VolInfo): Promise<VolInfo> {
  if (await isExist(volDB, { id: vol.id })) {
    throw new Error(`Vol ${vol.vol} ${vol.title} exists`);
  }

  console.log(`Save vol: vol-${vol.vol}, title-${vol.title}`);
  await saveVolTracksMap(vol);
  return insert<VolInfo>(volDB, vol);
}

function saveVols(vols: VolInfo[]): Promise<VolInfo[]> {
  return Promise.all(vols.map(vol => saveVol(vol)));
}

function getVols(): Promise<VolInfo[]> {
  return find<VolInfo>(volDB, {}, { vol: -1 });
}

async function getLatestVol(): Promise<VolInfo> {
  const vols = await find<VolInfo>(volDB, {}, { vol: -1 }, 1);
  return vols[0];
}

async function getVolByTrackId(trackId: number): Promise<Maybe<VolInfo>> {
  const map = await findOne<VolTrackMap>(volTrackMapDB, { id: trackId });
  if (!map) {
    return null;
  }
  return findOne<VolInfo>(volDB, { id: map.volId });
}

async function getVolById(id: number): Promise<Maybe<VolInfo>> {
  return findOne<VolInfo>(volDB, { id });
}

export {
  saveVol,
  saveVols,
  getVols,
  getLatestVol,
  getVolByTrackId,
  getVolById
};
