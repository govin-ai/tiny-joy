export function createFavorites(getStorage,validIds){
 const key='fun-house:favorites:v1';let ids=new Set(),session=false,message='';const valid=new Set(validIds);
 try{const raw=getStorage().getItem(key);if(raw!==null){const data=JSON.parse(raw);if(data.schemaVersion>1){session=true;message='收藏数据来自更新版本，原数据已保留。当前收藏仅在本次打开期间保留。';}else if(data.schemaVersion!==1||!Array.isArray(data.ids)||data.ids.some(x=>typeof x!=='string'))throw Error('Invalid data');else ids=new Set(data.ids.filter(x=>valid.has(x)));}}
 catch{session=true;message='无法读取收藏或数据已损坏。已恢复为空列表；当前收藏仅在本次打开期间保留。';}
 return {get ids(){return new Set(ids)},get message(){return message},get session(){return session},toggle(id){if(!valid.has(id))return '';if(ids.has(id))ids.delete(id);else ids.add(id);if(!session)try{getStorage().setItem(key,JSON.stringify({schemaVersion:1,ids:[...ids]}));}catch{session=true;message='当前收藏仅在本次打开期间保留。';}return session?message:'已保存到此浏览器';}};
}
