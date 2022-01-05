import { BookMarksItem, BookMarksItemCategory, Optional } from '../types'
import fs from 'fs'
const { app } = require('@electron/remote')

/**
 * 返回父级列表和 index
 * @param node 操作节点
 * @param nodes 查找范围列表
 * @returns [父级列表, index]
 */
export const findParentAndIndex = (node: BookMarksItem, nodes: BookMarksItem[]): any[] => {
    if (!nodes) return [null, null]
    for (let i = 0; i < nodes.length; ++i) {
        const siblingNode = nodes[i]
        if (siblingNode.uuid === node.parentUuid) return [nodes, i]
        const [siblings, index] = findParentAndIndex(node, siblingNode.children)
        if (siblings) return [siblings, index]
    }
    return [null, null]
}
/**
 * 返回兄弟list和 index
 * @param node 操作节点
 * @param nodes 查找范围列表
 * @returns [兄弟列表，index]
 */
export const findSiblingsAndIndex = (node: BookMarksItem, nodes: BookMarksItem[]): any[] => {
    if (!nodes) return [null, null]
    for (let i = 0; i < nodes.length; ++i) {
        const siblingNode = nodes[i]
        if (siblingNode.uuid === node.uuid) return [nodes, i]
        const [siblings, index] = findSiblingsAndIndex(node, siblingNode.children)
        if (siblings) return [siblings, index]
    }
    return [null, null]
}

/**
 * 是否是文件夹
 * @param bookmarks 书签
 * @returns boolean 
 */
export const isDir = (bookmarks: BookMarksItem) => {
    return bookmarks.category === BookMarksItemCategory.DIR
}
/**
 * 导出书签为html格式
 * @param path 导出路径
 * @param data 写入的数据
 * @param callback 回调
 */
export const exportBookmarksHtml = (filename: string, writeData: string, callback: (err: any) => void) => {
    if (!filename || filename == "") {
        console.log("导出名称为空")
        callback("导出名称为空")
        return
    }
    // downloads 用户下载目录的路径
    let exportPath = `${app.getPath('downloads')}/${filename}`
    console.log("exportPath", exportPath)
    // flag: 'w' 写入文件，不存在则创建，存在则清空
    fs.writeFile(exportPath, writeData, { flag: 'w' }, (err) => {
        if (err) {
            console.log("文件写入失败")
            callback("文件写入失败")
            throw err;
        } else {
            callback('')
        }
    })

}
export const readBookmarks = (path: string, callback: (err: any, result: any) => void) => {

    if (!path || path == "") {
        console.log("路径为空")
        callback("路径为空", null)
        return
    }

    fs.open(path, 'r', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log("文件不存在")
                callback("文件不存在", null)
            }
            return
        }

        fs.readFile(path, 'utf8', (err, data) => {
            if (err) throw err;

            let chromeBookMarks: Optional<BookMarksItem>
            // 内容转成dom对象
            let doms = parseToDOM(data);
            doms.forEach((dom) => {
                if (dom.tagName == 'DL') {
                    chromeBookMarks = textHandle(dom, null);
                }
            })
            let arr = tree2Array(chromeBookMarks)
            console.log(arr)
            callback(null, arr)
        });

    })

}

// uuid
export const uuid = (): string => {
    const S4 = () => {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
};

export const array2Tree = (array: Optional<Array<BookMarksItem>>) => {
    let result: BookMarksItem[] = []
    let map: any = {}
    if (!Array.isArray(array) || array.length === 0) {
        return []
    }
    array.forEach(item => {
        item.showEditBtn = false
        map[item.uuid] = item
    })
    array.forEach(item => {
        let parent = map[item.parentUuid]
        if (parent) {
            (parent.children || (parent.children = [])).push(item)
        } else {
            result.push(item)
        }
    })
    return result

}
/**
 *  树转成数组
 */
export const tree2Array = (node: Optional<BookMarksItem>) => {
    let queue = [node]
    let data = [] // 返回的数据
    while (queue.length !== 0) {
        let item = queue.shift()
        if (item) {
            let {children,...otherItem} = item
            data.push(otherItem)
            if (item.children && item.children.length > 0) {
                let children = item.children
                for (let index = 0; index < children.length; index++) {
                    queue.push(children[index]) //将子节点加入到队列尾部
                }
            }
        }
    }
    return data

}

/**
     *
     * @param dl
     * @param temp
     * @returns Optional<BookMarksItem>
     */
function textHandle(dl: any, temp: any) {


    // 先获取DL 下面的DT
    let dts = getDts(dl);

    if (dts.length > 0) {
        // 判断DT下面是否有DL标签
        for (var i in dts) {
            let dt = dts[i], hdl = getTag(dt, "DL");
            if (hdl != null) {
                let h = getTag(dt, "H3");
                let returns = textHandle(hdl, { name: h.textContent, children: [], uuid: uuid() })
                returns.category = BookMarksItemCategory.DIR
                if (temp == null) {
                    temp = returns;
                } else {
                    returns.parentUuid = temp.uuid
                    temp.children.push(returns);
                }
            } else {
                var a = getTag(dt, "A");
                temp.children.push({
                    category: BookMarksItemCategory.BOOK_MARKS,
                    uuid: uuid(),
                    url: a.href,
                    children: [],
                    parentUuid: temp.uuid,
                    name: a.textContent,
                    desc: "",
                })
            }
        }
    }
    return temp;
}


/**
 * 获取dt下面的标签
 *
 * @param dl
 * @return
 */
function getTag(dt: any, tagname: any) {
    let dtcs = dt.children, obj = null;
    if (dtcs.length < 1) {
        return obj
    }
    for (let dtc of dtcs) {
        if ((dtc.tagName.toUpperCase()) == tagname) {
            obj = dtc;
            break;
        }
    }
    return obj;
}


/**
 * 获取DL下面的DT标签
 * @param dl
 * @returns {[]}
 */
function getDts(dl: any) {
    let dlcs = dl.children, arr: any = [];
    if (dlcs.length < 1) {
        return arr;
    }
    for (let dlc of dlcs) {
        if ((dlc.tagName.toUpperCase()) == 'DT') {
            arr.push(dlc)
        }
    }
    return arr;
}

/**
 * 把String转为DOM对象
 * @param str
 * @returns {NodeListOf<ChildNode>}
 */
function parseToDOM(str: string) {
    let div = document.createElement("div");
    if (typeof str == "string") {
        div.innerHTML = str;
    }
    return div.childNodes;
}
