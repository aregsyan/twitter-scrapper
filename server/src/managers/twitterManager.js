const axios = require('axios');
const queryString = require('querystring');
const config = require('../../config');


class TwitterManager {
    constructor() {
        const cfg = config.twitter;
        Object.assign(this, cfg);
        this.headers = this._buildAuthHeaders();
        this.default_params = {
            include_entities: 0,
            count: 100
        };
    }

    _buildAuthHeaders() {
        if(this.bearer_token) {
            return {
                headers: {
                    'Authorization': `Bearer ${this.bearer_token}`
                }
            };
        }
    }

    async get(data) {
        const params = queryString.stringify(Object.assign(data, this.default_params));
        const url = `${this.url}?${params}`;
        const res = await axios.get(url, this.headers);
        return res.data;
    }
}

module.exports = TwitterManager;