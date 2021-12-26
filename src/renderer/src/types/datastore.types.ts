
export interface JmDatastore {

    bookmarks: DatastoreApi,
    configs: DatastoreApi


}

interface DatastoreApi {
    /**
     * db.insert([{ a: 5 }, { a: 42 }], function (err, newDocs) {})
     * @param doc 
     * @param callback 
     */
    // insert(doc: any, callback: (err: any, result: any) => void): any,
    // find(query: any, callback: (err: any, result: any) => void): any,
    // findOne(query: any, callback: (err: any, result: any) => void): any,
    // update(query: any, update: any, options: any, callback: (err: any, result: any) => void): any,
    // remove(query: any, options: any, callback: (err: any, result: any) => void): any,
    // // https://www.w3cschool.cn/nedbintro/nedbintro-jtcy27mn.html
    // ensureIndex(options: any, callback: (err: any, result: any) => void): any,
    // count(query: any, callback: (err: any, result: any) => void): any,

}