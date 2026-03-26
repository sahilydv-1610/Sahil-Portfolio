import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');

const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const ensureDirectory = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
};

export const read = async (collection) => {
  await ensureDirectory();
  const filePath = getFilePath(collection);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    if (!data || data.trim() === '') return [];
    try {
      return JSON.parse(data);
    } catch (parseErr) {
      console.error(`❌ JSON Parse Error in collection "${collection}":`, parseErr.message);
      return [];
    }
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
};

export const write = async (collection, data) => {
  await ensureDirectory();
  const filePath = getFilePath(collection);
  await fs.writeFile(filePath, JSON.stringify(data), 'utf-8');
};

export const find = async (collection, query = {}) => {
  const data = await read(collection);
  return data.filter(item => {
    for (const key in query) {
      if (item[key] !== query[key]) return false;
    }
    return true;
  });
};

export const findOne = async (collection, query = {}) => {
  const data = await read(collection);
  return data.find(item => {
    for (const key in query) {
      if (item[key] !== query[key]) return false;
    }
    return true;
  });
};

export const create = async (collection, itemData) => {
  const data = await read(collection);
  const newItem = {
    ...itemData,
    _id: itemData._id || Math.random().toString(36).substring(2, 15),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  data.push(newItem);
  await write(collection, data);
  return newItem;
};

export const findByIdAndUpdate = async (collection, id, updateData) => {
  const data = await read(collection);
  const index = data.findIndex(item => item._id === id);
  if (index === -1) return null;

  data[index] = {
    ...data[index],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };
  await write(collection, data);
  return data[index];
};

export const findOneAndUpdate = async (collection, query, updateData, options = {}) => {
  const data = await read(collection);
  let index = data.findIndex(item => {
    for (const key in query) {
      if (item[key] !== query[key]) return false;
    }
    return true;
  });

  if (index === -1) {
    if (options.upsert) {
      const newItem = {
        ...query,
        ...updateData,
        _id: Math.random().toString(36).substring(2, 15),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      data.push(newItem);
      await write(collection, data);
      return newItem;
    }
    return null;
  }

  data[index] = {
    ...data[index],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };
  await write(collection, data);
  return data[index];
};

export const findByIdAndDelete = async (collection, id) => {
  const data = await read(collection);
  const index = data.findIndex(item => item._id === id);
  if (index === -1) return null;

  const deletedItem = data.splice(index, 1)[0];
  await write(collection, data);
  return deletedItem;
};

export const deleteMany = async (collection, query) => {
  if (!query || Object.keys(query).length === 0) {
    throw new Error('deleteMany requires a non-empty query. Use clearCollection() to clear all data explicitly.');
  }

  const data = await read(collection);
  const filteredData = data.filter(item => {
    let match = true;
    for (const key in query) {
      if (item[key] !== query[key]) {
        match = false;
        break;
      }
    }
    return !match;
  });

  await write(collection, filteredData);
  return { deletedCount: data.length - filteredData.length };
};

export const clearCollection = async (collection, confirm = false) => {
  if (!confirm) throw new Error('Confirmation required to clear collection');
  await write(collection, []);
  return { message: `Collection ${collection} cleared` };
};
