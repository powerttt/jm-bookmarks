// const allModules = import.meta.globEager('./*.ts');
// const modules = {} as any;
// Object.keys(allModules).forEach((path) => {
//     const fileName = path.split('/')[1];
//     modules[fileName] = allModules[path][fileName] || allModules[path].default || allModules[path];
// });
// console.log("allModules",allModules)

import { useBookmarksStore } from './bookmarks.store';

export { useBookmarksStore };
