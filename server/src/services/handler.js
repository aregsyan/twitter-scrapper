const dbManager = require('../managers/db/dbManager');
const services = require('./serviceMap');

// TODO validate data here

const process = async (service, req, res, next) => {
    const d = req.body || {};
    const q = req.query || {};
    const p = req.params || {};
    const data = Object.assign({}, d, q, p);
    try {
        const db = await dbManager.getDB();
        const ret = await services[service](db, data);
        res.status(200).send(ret || {});
    } catch(e) {
        console.log(e)
        res.status(500).send(e.message);
    }
}

module.exports = {
    process
}