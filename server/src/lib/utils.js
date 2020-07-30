const checkDataExistence = async (db, coll, q) => {
    const d = await db.collection(coll).find(q).toArray();
    return d.length && true;
}

module.exports = {
    checkDataExistence,
}