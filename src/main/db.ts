
import Datastore from 'nedb-promises';

let _b = Datastore.create('/Users/powertn/.jm/bookmarks.txt');

_b.find({}).then((res) => {
    console.log('res', res);
});