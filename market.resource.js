
module.exports = class MarketResource {

    /**
     * @param {string} resourceType
     * @param {Order[]} [orders=[]]
     */
    constructor(resourceType, orders = []) {
        this._resourceType = resourceType;

        /**
         * @private
         * @type {Order[]}
         */
        this._buyOrders = [];

        /**
         * @private
         * @type {Order[]}
         */
        this._sellOrders = [];

        this._buyPrice = 0;
        this._sellPrice = Number.MAX_SAFE_INTEGER;

        for (const order of orders) {
            if (order.amount === 0 || order.remainingAmount === 0 || Game.market.orders[order.id]) {
                continue;
            }

            if (order.type === ORDER_BUY) {
                this._buyOrders.push(order);

                if (order.price > this._buyPrice) {
                    this._buyPrice = order.price;
                }
            } else {
                this._sellOrders.push(order);

                if (order.price < this._sellPrice) {
                    this._sellPrice = order.price;
                }
            }
        }

        if (this._sellOrders.length === 0) {
            this._sellPrice = 0;
        }
    }

    /**
     * @returns {Object}
     */
    getHistory() {
        if (this._history === undefined) {
            this._history = Game.market.getHistory(this._resourceType);
        }

        return this._history;
    }

    /**
     * @param {string} type
     * @returns {Order[]}
     */
    getOrders(type = ORDER_BUY) {
        return (type === ORDER_BUY ? this._buyOrders : this._sellOrders);
    }

    /**
     * @param {string} type
     * @returns {number}
     */
    getPrice(type = ORDER_SELL) {
        return (type === ORDER_SELL ? this._sellPrice : this._buyPrice);
    }

}
