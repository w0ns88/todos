import {
    getCollection,
    toObjectId
 } from '../mongodb'

const TODOS_COLLECTION = 'todos'

async function add(name){
    const todo = {
        name,
        createdAt: Date.now(),
        isDone: false,
        doneAt: undefined,
    }
    await (await getCollection(TODOS_COLLECTION))
        .insertOne(todo)
    return todo
}

async function get(_id){
    return await (await getCollection(TODOS_COLLECTION))
        .find({_id: toObjectId(_id)})
        .limit(1)
        .next()
}

async function getAll(){
    return await (await getCollection(TODOS_COLLECTION))
        .find()
        .toArray()
}

async function remove(_id){
  await (await getCollection(TODOS_COLLECTION))
        .deleteOne({_id: toObjectId(_id)})
  return _id
}

async function toggleDone(_id){
    const todo = await get(_id)
      await (await getCollection(TODOS_COLLECTION))
        .updateOne({_id: toObjectId(_id)}, {
            isDone: !todo.isDone
        })
    todo.isDone = !todo.isDone
  return todo
}

async function removeMore(ids){
    await (await getCollection(TODOS_COLLECTION))
        .remove({
            _id: {$in: ids.map(id => toObjectId(id))}
        })
    return await getAll()
}

export {
    add,
    getAll,
    remove,
    toggleDone,
    removeMore
}