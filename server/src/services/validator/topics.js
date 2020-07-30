const Joi = require('@hapi/joi');

const addTopic = (d) => {
    const schema = Joi.object({
        name: Joi.string()
            .required()
    });
    return schema.validate(d);
}

module.exports = {
    addTopic
}