import path from 'path';
import { DB_PATH_CONFIG } from '../constants';
import Datastore from 'nedb-promises';
import { Bookmarks } from '../types';
import nodejieba from 'nodejieba';
import stringSimilarity from 'string-similarity';

const dbpath = path.join(
  DB_PATH_CONFIG.LOCAL.BASE_PATH,
  DB_PATH_CONFIG.TABLE_NAME.BOOKMARKS
);

const db = Datastore.create(dbpath);

const getList = (query: any): Bookmarks[] | Bookmarks | any => {
  return db.find(query);
};
const insert = (doc: Bookmarks) => {
  return db.insert(doc);
};
const update = (uuid: string, doc: Bookmarks | Bookmarks[]) => {
  return db.update({ uuid }, doc);
};
const remove = (uuid: string | string[]): Promise<number> => {
  let query = {};
  if (uuid instanceof Array) {
    query = { uuid: { $in: uuid } };
  } else {
    query = { uuid };
  }
  return db.remove(query, { multi: true });
};
const search = async (searchKey: string) => {
  // 分词
  let searchTokens: string[] = nodejieba.cutHMM(searchKey);
  console.log('searchKey ', searchKey, searchTokens); // 英文分词会被切分成字母。。
  // 所搜索项必须全包括分词的结果才会被搜索出来，可以无序
  let regString = searchTokens.map((ele) => `(?=.*?${ele})`).join('');
  let reg = new RegExp(regString);
  let searchResult: Bookmarks[] = await db.find({
    $or: [
      {
        url: { $regex: reg },
      },
      {
        name: { $regex: reg },
      },
      {
        tags: { $regex: reg },
      },
      {
        desc: { $regex: reg },
      },
    ],
  });
  return jiebaSort(searchResult, searchKey);
};
const jiebaSort = (searchResult: Bookmarks[], searchKey: string) => {
  searchResult = searchResult.map((ele: Bookmarks) => {
    let { url, name, tags, desc } = ele;
    let urlRate = compareTwoStrings(url, searchKey);
    let nameRate = compareTwoStrings(name, searchKey);
    let keyWordsRate = tags ? compareTwoStrings(tags.toString(), searchKey) : 0;
    let descRate = compareTwoStrings(desc, searchKey);
    // url:name:tags:desc 为 10:10:5:3
    ele.searchRate =
      10 * urlRate + 10 * nameRate + 5 * keyWordsRate + 3 * descRate;
    return ele;
  });

  return searchResult.sort((a, b) => b.searchRate - a.searchRate);
};

/**
 * 比较两个字符串，返回相似度，处理单个字符长度为1的情况
 * @param {String} first 第一个字符串
 * @param {String} second
 */
const compareTwoStrings = function (first: string, second: string) {
  if (first == second) {
    return 1;
  }
  if (first.length === 1 || second.length === 1) {
    let max = Math.max(first.length, second.length);
    let min = Math.min(first.length, second.length);
    return min / max;
  } else {
    return stringSimilarity.compareTwoStrings(first, second);
  }
};
export default {
  getList,
  insert,
  update,
  remove,
  search,
};
