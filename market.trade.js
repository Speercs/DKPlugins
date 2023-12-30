
module.exports = class MarketTrade {

    /**
     * @static
     *
     * @param {string} [resourceType=RESOURCE_ENERGY]
     * @param {Object} [options={}]
     *
     * @param {number} [options.price]
     * @param {number} [options.amount]
     *
     * @returns {number}
     */
    static buy(resourceType = RESOURCE_ENERGY, options = {}) {
        resourceType = global.getResourceType(resourceType);

        const path = `trade[${ORDER_SELL}]`;
        let data = _.get(Memory, path);

        if (!data) {
            data = _.set(Memory, path, {})[path];
        }

        const price = (Number.isFinite(options) ? options : options.price);

        if (!price) {
            delete data[resourceType];

            return OK;
        }

        if (!data[resourceType]) {
            data[resourceType] = {};
        }

        data[resourceType].price = price;

        if (options.amount > 0) {
            data[resourceType].amount = options.amount;
        }

        return OK;
    }

    /**
     * @static
     *
     * @param {string} [resourceType=RESOURCE_ENERGY]
     * @param {Object} [options={}]
     *
     * @param {number} [options.price]
     * @param {number} [options.amount]
     *
     * @returns {number}
     */
    static sell(resourceType = RESOURCE_ENERGY, options = {}) {
        resourceType = global.getResourceType(resourceType);

        const path = `trade[${ORDER_BUY}]`;
        let data = _.get(Memory, path);

        if (!data) {
            data = _.set(Memory, path, {})[path];
        }

        const price = (Number.isFinite(options) ? options : options.price);

        if (!price) {
            delete data[resourceType];

            return OK;
        }

        if (!data[resourceType]) {
            data[resourceType] = {};
        }

        data[resourceType].price = price;

        if (options.amount > 0) {
            data[resourceType].amount = options.amount;
        }

        return OK;
    }

    /**
     * @static
     *
     * @param {string} type
     * @param {string} [resourceType=RESOURCE_ENERGY]
     *
     * @returns {number}
     */
    static getPrice(type, resourceType = RESOURCE_ENERGY) {
        resourceType = global.getResourceType(resourceType);

        const path = `trade[${type === ORDER_SELL ? ORDER_BUY : ORDER_SELL}][${resourceType}]`;
        const data = _.get(Memory, path);

        return data && data.price;
    }

    /**
     * @static
     */
    static print(type = ORDER_SELL) {
        let output = '<table width="300px" border="2px" cellspacing="4px" cellpadding="4px"><tr>' +
            '<td align="center">resource</td>' +
            `<td align="center">${type}</td>` +
            '</tr>';

        _.forEach(_.get(Memory, `trade[${type === ORDER_SELL ? ORDER_BUY : ORDER_SELL}]`), (params, resourceType) => {
            output += `<tr><td align="center">${global.resourceImg(resourceType)}</td><td align="center">${params.price} (${params.amount || 1})</td></tr>`;
        });

        output += '</table>';

        return output;
    }

}
