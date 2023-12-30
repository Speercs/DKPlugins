
const MarketResource = require('market.resource');

// constants

const ENERGY_PRICE_LIMIT = 2.5;
const PRICE_LIMIT = 7.5;
const MIN_CREDITS_LIMIT = 1000000;

//

global.Market = class {

    static initialize() {
        /**
         * @private
         * @type {Object[]}
         */
        this._prices = [];

        // const start = Game.cpu.getUsed();
        // const orders = Game.market.getAllOrders();
        // console.log(`orders: ${Game.cpu.getUsed()-start}`);

        // const reduce = Game.cpu.getUsed();
        /**
         * @type {Object<string, MarketResource>}
         */
        this._resources = {};
        // this._orders = orders.reduce((acc, order) => {
        //     if (order.remainingAmount === 0) {
        //         return acc;
        //     }
        //
        //     if (acc[order.resourceType] === undefined) {
        //         acc[order.resourceType] = new MarketResource(order.resourceType);
        //     }
        //
        //     acc[order.resourceType].push(order);
        //
        //     return acc;
        // }, {});
        // console.log(`reduce: ${Game.cpu.getUsed()-start}`);

        // this._orders = {};
        //
        // RESOURCES_ALL.map((resourceType) => {
        //     this._orders[resourceType] = new MarketResource(resourceType);
        //
        //     Game.market.getAllOrders({ resourceType: resourceType }).forEach((order) => {
        //         if (order.remainingAmount > 0) {
        //             this._orders[resourceType].push(order);
        //         }
        //     });
        // });
        // console.log(`reduce: ${Game.cpu.getUsed()-reduce}`);

        // console.log(`total: ${Game.cpu.getUsed()-start}`);
    }

    /**
     * @static
     * @readonly
     * @returns {MarketTrade}
     */
    static get trade() {
        return ModuleManager.get('market.trade');
    }

    /**
     * @static
     *
     * @param {string} id
     * @param {number} price
     * @param {Object} [options={}]
     *
     * @param {boolean} [options.log=true]
     * @param {string} [options.initiator]
     *
     * @see Market.changePrice
     *
     * @returns {number}
     */
    static addPrice(id, price, options = {}) {
        _.defaults(options, { log: true });

        const order = Game.market.orders[id] || Game.market.getOrderById(id);

        if (order) {
            const newPrice = order.price + price;

            if (newPrice && order.price !== newPrice) {
                return this.changePrice(id, newPrice, { log: options.log, initiator: options.initiator });
            }

            return ERR_INVALID_ARGS;
        }

        return ERR_NOT_FOUND;
    }

    /**
     * @static
     *
     * @param {Object} options
     *
     * @param {string} options.room
     * @param {string} [options.resourceType=RESOURCE_ENERGY]
     * @param {boolean} [options.log=true]
     * @param {number} [options.amount]
     * @param {number} [options.maxPrice]
     *
     * @see Market.deal
     *
     * @returns {number}
     */
    static buy(options = {}) {
        _.defaults(options, {
            resourceType: RESOURCE_ENERGY,
            log: true
        });

        const resourceType = global.getResourceType(options.resourceType);
        const orders = Game.market.getAllOrders((order) => {
            if (order.type !== ORDER_SELL || order.resourceType !== resourceType) {
                return false;
            }

            if (options.amount > 0 && options.amount > order.amount) {
                return false;
            }

            if (options.maxPrice > 0 && options.maxPrice < order.price) {
                return false;
            }

            return true;
        });

        if (orders.length > 0) {
            orders.sort((a, b) => a.price - b.price);

            const order = orders[0];

            if (options.amount > 0) {
                const amount = Math.min(order.amount, options.amount);

                return this.deal(order.id, options.room, amount, { log: options.log });
            } else {
                return this.deal(order.id, options.room, order.amount, { log: options.log });
            }
        }

        return ERR_NOT_FOUND;
    }

    /**
     * @static
     *
     * @param {string} id
     * @param {Object} [options={}]
     *
     * @param {boolean} [options.log=true]
     * @param {string} [options.initiator]
     *
     * @returns {number}
     */
    static cancel(id, options = {}) {
        _.defaults(options, { log: true });

        const result = Game.market.cancelOrder(id);

        if (result === OK) {
            const order = Game.market.orders[id];

            if (order.remainingAmount > 0 && options.log) {
                let message;

                if (!INTERSHARD_RESOURCES.includes(order.resourceType)) {
                    if (order.type === ORDER_BUY) {
                        message = `Покупка ${order.remainingAmount} ${resourceImg(order.resourceType)} в комнату ${linkRoom(order.roomName)} отменена`;
                    } else {
                        message = `Продажа ${order.remainingAmount} ${resourceImg(order.resourceType)} из комнаты ${linkRoom(order.roomName)} отменена`;
                    }
                } else {
                    if (order.type === ORDER_BUY) {
                        message = `Покупка ${order.remainingAmount} ${resourceImg(order.resourceType)} отменена`;
                    } else {
                        message = `Продажа ${order.remainingAmount} ${resourceImg(order.resourceType)} отменена`;
                    }
                }

                if (options.initiator) {
                    message += `. Initiator: ${options.initiator}`;
                }

                console.log(message);
            }
        }

        return result;
    }

    /**
     * @static
     *
     * @param {Object} options
     *
     * @param {number} options.amount
     * @param {string} [options.type=ORDER_BUY]
     * @param {string} [options.resourceType=RESOURCE_ENERGY]
     * @param {number} [options.price=0]
     * @param {number} [options.maxPrice]
     * @param {boolean} [options.log=true]
     * @param {string} [options.roomName]
     * @param {string} [options.initiator]
     *
     * @returns {number}
     */
    static createOrder(options = {}) {
        _.defaults(options, {
            type: ORDER_BUY,
            resourceType: RESOURCE_ENERGY,
            price: 0,
            log: true
        });

        const market = Game.market;
        const resourceType = global.getResourceType(options.resourceType);
        const roomName = options.roomName && options.roomName.toUpperCase();
        let price = options.price;
        let amount = options.amount;

        if (!price) {
            const currentPrice = this.getCurrentPrice({ type: options.type, resourceType });

            if (options.type === ORDER_BUY) {
                price = currentPrice + 0.001;
            } else {
                price = Math.max(0.001, currentPrice - 0.001);
            }

            if (price > options.maxPrice) {
                price = options.maxPrice;
            }

            if (resourceType === RESOURCE_ENERGY && price > ENERGY_PRICE_LIMIT) {
                price = ENERGY_PRICE_LIMIT;
            } else if (price > PRICE_LIMIT) {
                price = PRICE_LIMIT;
            }
        }

        if (!amount && options.type === ORDER_SELL && roomName) {
            const terminal = Game.rooms[roomName].terminal;

            amount = terminal.store[resourceType];
        }

        const result = market.createOrder(options.type, resourceType, price, amount, roomName);

        if (result === OK && options.log) {
            const credits = (amount * price).toFixed(3);
            const tax = (credits * MARKET_FEE).toFixed(3);
            let message;

            if (!INTERSHARD_RESOURCES.includes(resourceType)) {
                if (options.type === ORDER_BUY) {
                    message = `Created purchase order for ${amount} ${resourceImg(resourceType)} by price ${price} to ${linkRoom(roomName)}. Will be spent credits: ${credits}. Tax: ${tax}`;
                } else {
                    message = `Created an order to sell ${amount} ${resourceImg(resourceType)} by price ${price} from ${linkRoom(roomName)}. Will be earned credits: ${credits}. Tax: ${tax}`;
                }
            } else {
                if (options.type === ORDER_BUY) {
                    message = `Created purchase order for ${amount} ${resourceImg(resourceType)} by price ${price}. Will be spent credits: ${credits}. Tax: ${tax}`;
                } else {
                    message = `Created an order to sell ${amount} ${resourceImg(resourceType)} by price ${price}. Will be earned credits: ${credits}. Tax: ${tax}`;
                }
            }

            if (options.initiator) {
                message += `. Initiator: ${options.initiator}`;
            }

            console.log(message);
        }

        return result;
    }

    /**
     * @static
     *
     * @param {Object} options
     *
     * @param {number} options.amount
     * @param {string} [options.type=ORDER_BUY]
     * @param {string} [options.resourceType=RESOURCE_ENERGY]
     * @param {number} [options.price=0]
     * @param {number} [options.maxPrice]
     * @param {boolean} [options.log=true]
     * @param {string} [options.initiator]
     *
     * @see Market.createOrder
     */
    static createOrders(options = {}) {
        Shard.myRooms.forEach((room) => {
            this.createOrder({ ...options, roomName: room.name });
        });
    }

    /**
     * @static
     *
     * @param {string} id
     * @param {Object} options
     *
     * @param {string} options.roomName
     * @param {number} [options.amount]
     * @param {number} [options.price=0]
     * @param {boolean} [options.log=true]
     * @param {string} [options.initiator]
     *
     * @returns {Number}
     */
    static clone(id, options = {}) {
        const order = Game.market.orders[id] || Game.market.getOrderById(id);

        if (!order) {
            return ERR_NOT_FOUND;
        }

        return this.createOrder({ ...order, ...options });
    }

    /**
     * @static
     *
     * @param {string} id
     * @param {number} price
     * @param {Object} [options={}]
     *
     * @param {boolean} [options.log=true]
     * @param {string} [options.initiator]
     *
     * @returns {number}
     */
    static changePrice(id, price, options = {}) {
        _.defaults(options, { log: true });

        const market = Game.market;
        const result = market.changeOrderPrice(id, price);

        if (result === OK && options.log) {
            const order = market.orders[id] || market.getOrderById(id);

            if (order) {
                let message;

                if (order.type === ORDER_BUY) {
                    const subPrice = price - order.price;

                    if (!INTERSHARD_RESOURCES.includes(order.resourceType)) {
                        message = `Changed the purchase price for ${order.remainingAmount} ${resourceImg(order.resourceType)} to ${linkRoom(order.roomName)}: ${price.toFixed(3)} (${order.price})`;
                    } else {
                        message = `Changed the purchase price for ${order.remainingAmount} ${resourceImg(order.resourceType)}: ${price.toFixed(3)} (${order.price})`;
                    }

                    if (subPrice > 0) {
                        const credits = (order.amount * subPrice).toFixed(3);
                        const totalCredits = (order.amount * price).toFixed(3);
                        const tax = (credits * MARKET_FEE).toFixed(3);

                        message += `. Will be spent credits: ${credits} (total: ${totalCredits}). Tax: ${tax}`;
                    }
                } else {
                    if (!INTERSHARD_RESOURCES.includes(order.resourceType)) {
                        message = `Changed the sale price for ${order.remainingAmount} ${resourceImg(order.resourceType)} from ${linkRoom(order.roomName)}: ${price.toFixed(3)} (${order.price})`;
                    } else {
                        message = `Changed the sale price for ${order.remainingAmount} ${resourceImg(order.resourceType)}: ${price.toFixed(3)} (${order.price})`;
                    }
                }

                if (options.initiator) {
                    message += `. Initiator: ${options.initiator}`;
                }

                console.log(message);
            }
        }

        return result;
    }

    /**
     * @static
     *
     * @param {number} amount
     * @param {string} from
     * @param {string} to
     * @param {Object} [options={}]
     *
     * @returns {number}
     */
    static cost(amount, from, to, options = {}) {
        from = from.toUpperCase();
        to = to.toUpperCase();

        const room = Game.rooms[from];
        let cost = Game.market.calcTransactionCost(amount, from, to);

        if (room && room.terminal) {
            const effect = room.terminal.getEffect(PWR_OPERATE_TERMINAL);

            if (effect) {
                cost = Math.ceil(cost * POWER_INFO[PWR_OPERATE_TERMINAL].effect[effect.level - 1]);
            }
        }

        if (options.log) {
            console.log(`Transaction cost ${amount} from room ${linkRoom(from)} to room ${linkRoom(to)}: ${cost}`);
        }

        return cost;
    }

    /**
     * @static
     *
     * @param {string} id
     * @param {string} roomName
     * @param {number} amount
     * @param {Object} [options={}]
     *
     * @param {boolean} [options.log=true]
     * @param {string} [options.initiator]
     *
     * @returns {number}
     */
    static deal(id, roomName, amount, options = {}) {
        _.defaults(options, { log: true });

        if (!id) {
            return ERR_NOT_FOUND;
        }

        if (!roomName) {
            return ERR_INVALID_ARGS;
        }

        const room = Game.rooms[roomName.toUpperCase()];
        const terminal = room.terminal;

        if (!terminal) {
            return ERR_INVALID_TARGET;
        }

        if (terminal.cooldown > 0 || terminal.isSending()) {
            return ERR_TIRED;
        }

        const order = Game.market.orders[id] || Game.market.getOrderById(id);

        if (!order) {
            return ERR_NOT_FOUND;
        }

        if (!amount || amount < 1) {
            const multiplier = amount || 1;

            if (order.type === ORDER_BUY) {
                amount = Math.min(terminal.store[order.resourceType], order.amount);
            } else {
                amount = order.amount;
            }

            amount *= multiplier;
        }

        const result = Game.market.deal(id, amount, room.name);

        if (result === OK) {
            terminal.setSending(true);

            order.amount -= amount;
            order.remainingAmount -= amount;

            if (options.log) {
                const credits = order.price * amount.toFixed(3);
                let message;

                if (!INTERSHARD_RESOURCES.includes(order.resourceType)) {
                    const cost = this.cost(amount, room.name, order.roomName);

                    if (order.type === ORDER_BUY) {
                        message = `Sold ${amount} ${resourceImg(order.resourceType)} by price ${order.price} from ${linkRoom(room)} to ${linkRoom(order.roomName)}. Earned credits: ${credits}. Cost: ${cost}`;
                    } else {
                        message = `Purchased ${amount} ${resourceImg(order.resourceType)} by price ${order.price} from ${linkRoom(order.roomName)} to ${linkRoom(room)}. Spent credits: ${credits}. Cost: ${cost}`;
                    }
                } else {
                    if (order.type === ORDER_BUY) {
                        message = `Sold ${amount} ${resourceImg(order.resourceType)} by price ${order.price}. Earned credits: ${credits}`;
                    } else {
                        message = `Purchased ${amount} ${resourceImg(order.resourceType)} by price ${order.price}. Spent credits: ${credits}`;
                    }
                }

                message += `. Order ID: ${order.id}. Remaining: ${order.remainingAmount}`;

                if (options.initiator) {
                    message += `. Initiator: ${options.initiator}`;
                }

                console.log(message);
            }
        }

        return result;
    }

    /**
     * @static
     *
     * @param {Order} order
     * @param {string} roomName
     * @param {number} amount
     * @param {Object} [options={}]
     *
     * @param {boolean} [options.log=true]
     * @param {string} [options.initiator]
     *
     * @returns {number}
     */
    static dealOrder(order, roomName, amount, options = {}) {
        _.defaults(options, { log: true });

        if (!order) {
            return ERR_NOT_FOUND;
        }

        if (!roomName) {
            return ERR_INVALID_ARGS;
        }

        const room = Game.rooms[roomName.toUpperCase()];
        const terminal = room.terminal;

        if (!terminal || !terminal.my) {
            return ERR_INVALID_TARGET;
        }

        if (terminal.cooldown > 0 || terminal.isSending()) {
            return ERR_TIRED;
        }

        if (!amount || amount < 1) {
            const multiplier = amount || 1;

            if (order.type === ORDER_BUY) {
                amount = Math.min(terminal.store[order.resourceType], order.amount);
            } else {
                amount = order.amount;
            }

            amount *= multiplier;
        }

        const result = Game.market.deal(order.id, amount, room.name);

        if (result === OK) {
            terminal.setSending(true);

            order.amount -= amount;
            order.remainingAmount -= amount;

            if (options.log) {
                const credits = (order.price * amount).toFixed(3);
                let message;

                if (!INTERSHARD_RESOURCES.includes(order.resourceType)) {
                    const cost = this.cost(amount, room.name, order.roomName);

                    if (order.type === ORDER_BUY) {
                        message = `Sold ${amount} ${resourceImg(order.resourceType)} by price ${order.price} from ${linkRoom(room)} to ${linkRoom(order.roomName)}. Earned credits: ${credits}. Cost: ${cost}`;
                    } else {
                        message = `Purchased ${amount} ${resourceImg(order.resourceType)} by price ${order.price} from ${linkRoom(order.roomName)} to ${linkRoom(room)}. Spent credits: ${credits}. Cost: ${cost}`;
                    }
                } else {
                    if (order.type === ORDER_BUY) {
                        message = `Sold ${amount} ${resourceImg(order.resourceType)} by price ${order.price}. Earned credits: ${credits}`;
                    } else {
                        message = `Purchased ${amount} ${resourceImg(order.resourceType)} by price ${order.price}. Spent credits: ${credits}`;
                    }
                }

                message += `. Order ID: ${order.id}. Remaining: ${order.remainingAmount}`;

                if (options.initiator) {
                    message += `. Initiator: ${options.initiator}`;
                }

                console.log(message);
            }
        }

        return result;
    }

    /**
     * @private
     * @static
     *
     * @param {Order} order
     * @param {string} roomName
     * @param {number} amount
     * @param {Object} [options={}]
     *
     * @param {string} [options.initiator]
     *
     * @returns {number}
     */
    static _dealOrder(order, roomName, amount, options = {}) {
        const result = Game.market.deal(order.id, amount, roomName);

        if (result === OK) {
            if (Game.rooms[roomName]) {
                Game.rooms[roomName].terminal.setSending(true);
            }

            order.amount -= amount;
            order.remainingAmount -= amount;

            const credits = (order.price * amount).toFixed(3);
            let message;

            if (!INTERSHARD_RESOURCES.includes(order.resourceType)) {
                const cost = this.cost(amount, roomName, order.roomName);

                if (order.type === ORDER_BUY) {
                    message = `Sold ${amount} ${resourceImg(order.resourceType)} by price ${order.price} from ${linkRoom(roomName)} to ${linkRoom(order.roomName)}. Earned credits: ${credits}. Cost: ${cost}`;
                } else {
                    message = `Purchased ${amount} ${resourceImg(order.resourceType)} by price ${order.price} from ${linkRoom(order.roomName)} to ${linkRoom(roomName)}. Spent credits: ${credits}. Cost: ${cost}`;
                }
            } else {
                if (order.type === ORDER_BUY) {
                    message = `Sold ${amount} ${resourceImg(order.resourceType)} by price ${order.price}. Earned credits: ${credits}`;
                } else {
                    message = `Purchased ${amount} ${resourceImg(order.resourceType)} by price ${order.price}. Spent credits: ${credits}`;
                }
            }

            message += `. Order ID: ${order.id}. Remaining: ${order.remainingAmount}`;

            if (options.initiator) {
                message += `. Initiator: ${options.initiator}`;
            }

            console.log(message);
        }

        return result;
    }

    /**
     * @static
     *
     * @param {string} id
     * @param {number} amount
     * @param {Object} [options={}]
     *
     * @param {boolean} [options.updatePrice=true]
     * @param {number} [options.maxPrice]
     * @param {boolean} [options.ignoreLimit=false]
     * @param {boolean} [options.log=true]
     * @param {string} [options.initiator]
     *
     * @see Market.updatePrice
     *
     * @returns {number}
     */
    static extend(id, amount, options = {}) {
        _.defaults(options, {
            updatePrice: true,
            ignoreLimit: false,
            log: true
        });

        if (options.updatePrice) {
            this.updatePrice(id, {
                maxPrice: options.maxPrice,
                ignoreLimit: options.ignoreLimit,
                log: options.log,
                initiator: options.initiator,
            });
        }

        const result = Game.market.extendOrder(id, amount);

        if (result === OK && options.log) {
            const order = Game.market.orders[id] || Game.market.getOrderById(id);

            if (order) {
                const totalAmount = amount + order.remainingAmount;
                const credits = (amount * order.price).toFixed(3);
                const totalCredits = (amount * order.price + order.remainingAmount * order.price).toFixed(3);
                const tax = (credits * MARKET_FEE).toFixed(3);
                let message = 'Order extended! Will be';

                if (!INTERSHARD_RESOURCES.includes(order.resourceType)) {
                    if (order.type === ORDER_BUY) {
                        message += ` purchased ${amount} (total: ${totalAmount}) ${resourceImg(order.resourceType)} by price ${order.price} to ${linkRoom(order.roomName)}. Will be spent: ${credits} credits (total: ${totalCredits}). Tax: ${tax}`;
                    } else {
                        message += ` sold ${amount} (total: ${totalAmount}) ${resourceImg(order.resourceType)} by price ${order.price} from ${linkRoom(order.roomName)}. Will be earned: ${credits} credits (total: ${totalCredits}). Tax: ${tax}`;
                    }
                } else {
                    if (order.type === ORDER_BUY) {
                        message += ` purchased ${amount} (total: ${totalAmount}) ${resourceImg(order.resourceType)} by price ${order.price}. Will be spent: ${credits} credits (total: ${totalCredits}). Tax: ${tax}`;
                    } else {
                        message += ` sold ${amount} (total: ${totalAmount}) ${resourceImg(order.resourceType)} by price ${order.price}. Will be earned: ${credits} credits (total: ${totalCredits}). Tax: ${tax}`;
                    }
                }

                if (options.initiator) {
                    message += `. Initiator: ${options.initiator}`;
                }

                console.log(message);
            }
        }

        return result;
    }

    /**
     * @static
     *
     * @param {Object} [options={}]
     *
     * @param {string} [options.type=ORDER_BUY]
     * @param {string} [options.resourceType=RESOURCE_ENERGY]
     * @param {string} [options.roomName]
     * @param {boolean} [options.empty]
     * @param {boolean} [options.notEmpty]
     *
     * @returns {Order | null}
     */
    static findMyOrder(options = {}) {
        _.defaults(options, {
            type: ORDER_BUY,
            resourceType: RESOURCE_ENERGY
        });

        return _.find(Game.market.orders, (order) => {
            if (order.type !== options.type) {
                return false;
            }

            if (order.resourceType !== options.resourceType) {
                return false;
            }

            if (options.roomName !== undefined && order.roomName !== options.roomName) {
                return false;
            }

            if (options.empty && order.remainingAmount > 0) {
                return false;
            }

            if (options.notEmpty && order.remainingAmount === 0) {
                return false;
            }

            return true;
        }) || null;
    }

    static _getBuyOrders() {
        const path = `trade[${ORDER_BUY}]`;
        const resources = _.get(Memory, path);

        return _.reduce(resources, (acc, data, resourceType) => {
            const orders = this.getResource(resourceType).getOrders(ORDER_BUY).filter((order) => {
                if (order.price < data.price) {
                    return false;
                }

                if (order.amount < data.amount) {
                    return false;
                }

                return true;
            });

            if (orders.length === 0) {
                return acc;
            }

            return acc.concat(orders);
        }, []);
    }

    static _getSellOrders() {
        const path = `trade[${ORDER_SELL}]`;
        const resources = _.get(Memory, path);

        return _.reduce(resources, (acc, data, resourceType) => {
            const orders = this.getResource(resourceType).getOrders(ORDER_SELL).filter((order) => {
                if (order.price > data.price) {
                    return false;
                }

                if (order.amount < data.amount) {
                    return false;
                }

                return true;
            });

            if (orders.length === 0) {
                return acc;
            }

            return acc.concat(orders);
        }, []);
    }

    /**
     * @static
     *
     * @param {Object} [options={}]
     *
     * @param {string} [options.type=ORDER_SELL]
     * @param {string} [options.resourceType=RESOURCE_ENERGY]
     *
     * @returns {number}
     */
    static getCurrentPrice(options = {}) {
        return this.getResource(global.getResourceType(options.resourceType || RESOURCE_ENERGY))
                    .getPrice(options.type || ORDER_SELL);
    }

    /**
     * @static
     * @param {Order | string} order
     * @returns {{ seconds: number, hours: number, minutes: number, days: number } | null}
     */
    static getElapsedTime(order) {
        if (typeof order === 'string') {
            order = Game.market.orders[order] || Game.market.getOrderById(order);
        }

        if (!order) {
            return null;
        }

        const now = Date.now();
        const elapsedTime = MARKET_ORDER_LIFE_TIME - (now - order.createdTimestamp);
        const seconds = elapsedTime / 1000;
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const days = hours / 24;

        return {
            seconds: Math.floor(seconds % 60),
            minutes: Math.floor(minutes % 60),
            hours: Math.floor(hours % 24),
            days: Math.floor(days)
        };
    }

    /**
     * @static
     *
     * @param {Object} [options={}]
     *
     * @param {string} [options.type=ORDER_BUY]
     * @param {string} [options.resourceType=RESOURCE_ENERGY]
     * @param {string} [options.roomName]
     * @param {boolean} [options.empty]
     * @param {boolean} [options.notEmpty]
     *
     * @returns {Order[]}
     */
    static getMyOrders(options = {}) {
        _.defaults(options, {
            type: ORDER_BUY,
            resourceType: RESOURCE_ENERGY
        });

        return _.filter(Game.market.orders, (order) => {
            if (order.type !== options.type) {
                return false;
            }

            if (order.resourceType !== options.resourceType) {
                return false;
            }

            if (options.roomName !== undefined && order.roomName !== options.roomName) {
                return false;
            }

            if (options.empty && order.remainingAmount > 0) {
                return false;
            }

            if (options.notEmpty && order.remainingAmount === 0) {
                return false;
            }

            return true;
        });
    }

    /**
     * @static
     *
     * @param {Object} [options={}]
     *
     * @param {string} [options.resourceType=RESOURCE_ENERGY]
     * @param {string} [options.type=ORDER_BUY]
     *
     * @returns {Order[]}
     */
    static getOrders(options = {}) {
        return this.getResource(options.resourceType || RESOURCE_ENERGY)
                    .getOrders(options.type || ORDER_BUY);
    }

    /**
     * @static
     * @param {string} resourceType
     * @returns {MarketResource}
     */
    static getResource(resourceType) {
        resourceType = global.getResourceType(resourceType);

        if (this._resources[resourceType] === undefined) {
            this._resources[resourceType] = new MarketResource(resourceType, Game.market.getAllOrders({ resourceType }));
        }

        return this._resources[resourceType];
    }

    static _processFactoryMineralOrders() {
        const amount = 150000;
        const rooms = {
            'shard0': 'E68S9',
            'shard1': 'E39S9',
            'shard2': 'E42S11',
        };

        const roomName = rooms[Game.shard.name];

        if (!roomName) {
            return;
        }

        const prices = {
            'shard0': {
                [RESOURCE_METAL]: 77,
                [RESOURCE_BIOMASS]: 89,
                [RESOURCE_SILICON]: 160,
                [RESOURCE_MIST]: 80,
            },
            'shard1': {
                [RESOURCE_METAL]: 141,
                [RESOURCE_BIOMASS]: 127,
                [RESOURCE_SILICON]: 133,
                [RESOURCE_MIST]: 78,
            },
            'shard2': {
                [RESOURCE_METAL]: 177,
                [RESOURCE_SILICON]: 181,
            }
        }

        for (const resourceType of Resource.FACTORY_MINERALS) {
            const price = prices[Game.shard.name][resourceType];

            if (!price) {
                continue;
            }

            const order = _.find(Game.market.orders, order =>
                order.type === ORDER_BUY && order.resourceType === resourceType);

            if (order) {
                const info = this.getElapsedTime(order);

                if (info) {
                    if (info.days >= 3 && order.remainingAmount <= 25000) {
                        const days = 30; // 30 days for market order
                        const perDay = amount / days;
                        const extendAmount = Math.min((days - info.days) * perDay, amount - order.remainingAmount);

                        this.extend(order.id, extendAmount, { initiator: 'Market' });
                    } else if (info.days <= 2 && order.remainingAmount <= 5000) {
                        this.cancel(order.id, { initiator: 'Market' });
                    }
                }
            } else {
                this.createOrder({
                    type: ORDER_BUY,
                    initiator: 'Market',
                    resourceType,
                    roomName,
                    amount,
                    price,
                });
            }
        }
    }

    static _processPixelOrder() {
        const order = _.find(Game.market.orders, order =>
            order.type === ORDER_BUY && order.resourceType === 'pixel');
        const amount = 30000;

        if (order) {
            const info = this.getElapsedTime(order);

            if (info) {
                if (info.days >= 3 && order.remainingAmount <= 5000) {
                    const days = 30; // 30 days for market order
                    const perDay = amount / days;
                    const extendAmount = Math.min((days - info.days) * perDay, amount - order.remainingAmount);

                    this.extend(order.id, extendAmount, { initiator: 'Market' });
                } else if (info.days < 3 && order.remainingAmount === 0) {
                    this.cancel(order.id);
                }
            }
        } else {
            this.createOrder({
                type: ORDER_BUY,
                resourceType: 'pixel',
                initiator: 'Market',
                price: 25000,
                amount,
            });
        }
    }

    static processOrders() {
        this._processFactoryMineralOrders();
        // запускаем только на одном шарде
        Game.market.credits >= 10000000000 && Shard.shard1 && this._processPixelOrder();
    }

    static processTrading() {

        // ПРОДАВАТЬ

        let rooms = Shard.myRooms.filter((room) => {
            if (room.energyPercents < 25) {
                return false;
            }

            const terminal = room.terminal;

            if (!terminal || !terminal.my || terminal.cooldown > 0 || terminal.isSending() || terminal.store[RESOURCE_ENERGY] < 8000) {
                return false;
            }

            return true;
        });

        // if (rooms.length > 0) {
        //     const path = `trade[${ORDER_BUY}]`;
        //     const resources = _.get(Memory, path);
        //     const buyOrders = _.reduce(resources, (acc, data, resourceType) => {
        //         const orders = this.getResource(resourceType).getOrders(ORDER_BUY).filter((order) => {
        //             if (order.price < data.price) {
        //                 return false;
        //             }
        //
        //             if (order.amount < data.amount) {
        //                 return false;
        //             }
        //
        //             return true;
        //         });
        //
        //         if (orders.length === 0) {
        //             return acc;
        //         }
        //
        //         return acc.concat(orders);
        //     }, []);
        //
        //     if (buyOrders.length > 0) {
        //         let total = 0;
        //
        //         for (let i = 0; i < rooms.length; i++) {
        //             const room = rooms[i];
        //             const terminal = room.terminal;
        //             const resources = {};
        //
        //             const start2 = Game.cpu.getUsed();
        //
        //             // const orders =
        //             buyOrders
        //                 // .filter(order => terminal.store[order.resourceType] > 0)
        //                 .sort((a, b) => {
        //                     let terminalA = resources[a.resourceType];
        //
        //                     if (terminalA === undefined) {
        //                         terminalA = terminal.getResourceAmount(a.resourceType);
        //
        //                         resources[a.resourceType] = terminalA;
        //                     }
        //
        //                     let terminalB = resources[b.resourceType];
        //
        //                     if (terminalB === undefined) {
        //                         terminalB = terminal.getResourceAmount(b.resourceType);
        //
        //                         resources[b.resourceType] = terminalB;
        //                     }
        //
        //                     const amountA = Math.min(
        //                         a.amount,
        //                         terminalA,
        //                         // terminal.getResourceAmount(a.resourceType),
        //                         (a.resourceType === RESOURCE_ENERGY ? 15000 : 25000));
        //                     const amountB = Math.min(
        //                         b.amount,
        //                         terminalB,
        //                         // terminal.getResourceAmount(b.resourceType),
        //                         (b.resourceType === RESOURCE_ENERGY ? 15000 : 25000));
        //
        //                     const costA = this.cost(amountA, room.name, a.roomName);
        //                     const priceA = amountA * a.price / (amountA + costA);
        //
        //                     const costB = this.cost(amountB, room.name, b.roomName);
        //                     const priceB = amountB * b.price / (amountB + costB);
        //
        //                     if (amountA === 0 && amountB === 0) {
        //                         return a.remainingAmount - b.remainingAmount;
        //                         // console.log(a.remainingAmount, b.remainingAmount, a.remainingAmount - b.remainingAmount);
        //
        //                         return 0;
        //                     }
        //
        //                     return priceB - priceA;
        //
        //                     // const difference = priceB - priceA;
        //                     //
        //                     // if (difference === 0) {
        //                     // return a.remainingAmount - b.remainingAmount;
        //                     //     console.log(a.resourceType, b.resourceType, a.roomName, b.roomName, a.price, b.price, costA, costB, priceA, priceB);
        //                     // }
        //                     //
        //                     // return difference;
        //                 });
        //
        //             // if (i > 0) {
        //             //     console.log(`sort ${buyOrders.length}: ${Game.cpu.getUsed()-start2}`);
        //             // }
        //
        //             const order = buyOrders.find((order) => {
        //                 if (room.name === order.roomName || terminal.store[order.resourceType] === 0) {
        //                     return false;
        //                 }
        //
        //                 if (order.resourceType === RESOURCE_ENERGY) {
        //                     if (room.store[RESOURCE_ENERGY] < 125000) {
        //                         return false;
        //                     }
        //                 } else {
        //                     if (room.store[RESOURCE_ENERGY] < 45000) {
        //                         return false;
        //                     }
        //                 }
        //
        //                 const amount = Math.min(
        //                     order.amount,
        //                     resources[order.resourceType] || terminal.getResourceAmount(order.resourceType),
        //                     // terminal.getResourceAmount(order.resourceType),
        //                     (order.resourceType === RESOURCE_ENERGY ? 15000 : 25000));
        //
        //                 const minAmount = (amount < 8 ? amount : 100);
        //
        //                 if (amount >= minAmount && this._dealOrder(order, room.name, amount) === OK) {
        //                     if (amount * order.price >= 150000 && !Game.rooms[order.roomName]) {
        //                         // Game.notify(`Из комнаты ${room} продано ${amount} ресурса ${order.resourceType} по цене ${order.price}. Заработано кредитов: ${amount * order.price}`);
        //                     }
        //
        //                     return true;
        //                 }
        //
        //                 return false;
        //             });
        //
        //             // let _order = { ratio: 0 };
        //             //
        //             // for (let j = 0; j < buyOrders.length; j++) {
        //             //     const order = buyOrders[j];
        //             //
        //             //     if (room.name === order.roomName || terminal.store[order.resourceType] === 0) {
        //             //         continue;
        //             //     }
        //             //
        //             //     if (order.resourceType === RESOURCE_ENERGY) {
        //             //         if (room.store[RESOURCE_ENERGY] < 125000) {
        //             //             continue;
        //             //         }
        //             //     } else {
        //             //         if (room.store[RESOURCE_ENERGY] < 45000) {
        //             //             continue;
        //             //         }
        //             //     }
        //             //
        //             //     const amount = Math.min(
        //             //         order.amount,
        //             //         terminal.getResourceAmount(order.resourceType),
        //             //         (order.resourceType === RESOURCE_ENERGY ? 15000 : 25000));
        //             //
        //             //     if (amount < 100) {
        //             //         continue;
        //             //     }
        //             //
        //             //     const ratio = amount * order.price / (amount + this.cost(amount, room.name, order.roomName));
        //             //
        //             //     if (ratio > _order.ratio) {
        //             //         _order = {
        //             //             order,
        //             //             amount,
        //             //             ratio
        //             //         };
        //             //     }
        //             // }
        //             //
        //             // let order;
        //             //
        //             // if (_order.order && this._dealOrder(_order.order, room.name, _order.amount) === OK) {
        //             //     order = _order.order;
        //             //
        //             //     if (_order.amount * order.price >= 35000 && !Game.rooms[order.roomName]) {
        //             //         Game.notify(`Из комнаты ${room.name} продано ${_order.amount} ресурса ${order.resourceType} по цене ${order.price}. Заработано кредитов: ${_order.amount * order.price}`);
        //             //     }
        //             // }
        //
        //             const diff = Game.cpu.getUsed() - start2;
        //
        //             total += diff;
        //
        //             if (order) {
        //                 _.pull(rooms, room);
        //
        //                 i--;
        //
        //                 if (order.amount <= 0) {
        //                     _.pull(buyOrders, order);
        //                 }
        //             }
        //         }
        //
        //         // console.log(`total: ${total}`);
        //     }
        // }

        // ПОКУПАТЬ

        if (Game.market.credits < MIN_CREDITS_LIMIT) {
            return;
        }

        if (rooms.length > 0) {
            rooms = rooms.filter((room) => !room.terminal.isSending() && room.terminalFreeCapacity > 0);
        }

        if (rooms.length > 0) {
            const path = `trade[${ORDER_SELL}]`;
            const resources = _.get(Memory, path);
            const sellOrders = _.reduce(resources, (acc, data, resourceType) => {
                const orders = this.getResource(resourceType).getOrders(ORDER_SELL).filter((order) => {
                    if (order.price > data.price) {
                        return false;
                    }

                    if (order.amount < data.amount) {
                        return false;
                    }

                    return true;
                });

                if (orders.length === 0) {
                    return acc;
                }

                return acc.concat(orders);
            }, []);

            // const sellOrders = Game.market.getAllOrders(
            //     order => order.type === ORDER_SELL && !Game.rooms[order.roomName] &&
            //         (
            //             shard3 &&
            //             (
            //                 order.resourceType === 'H' && order.price <= 0.050 ||
            //                 order.resourceType === 'O' && order.price <= 0.050 ||
            //                 // order.resourceType === 'XGH2O' && order.price <= 1.000 ||
            //                 order.resourceType === 'K' && order.price <= 0.040 ||
            //                 order.resourceType === 'L' && order.price <= 0.070 ||
            //                 // order.resourceType === 'X' && order.price <= 0.075 ||
            //                 order.resourceType === 'Z' && order.price <= 0.035 ||
            //                 order.resourceType === 'U' && order.price <= 0.040 ||
            //                 // order.resourceType === 'power' && order.price <= 0.320 ||
            //                 order.resourceType === 'ops' && order.price <= 0.150 ||
            //                 order.resourceType === 'token' && order.price <= 500000
            //             )
            //             ||
            //             shard2 &&
            //             (
            //                 order.resourceType === RESOURCE_METAL && order.price <= 0.600 ||
            //                 order.resourceType === RESOURCE_BIOMASS && order.price <= 0.600 ||
            //                 order.resourceType === RESOURCE_SILICON && order.price <= 0.600 ||
            //                 order.resourceType === RESOURCE_MIST && order.price <= 0.600 ||
            //                 order.resourceType === 'H' && order.price <= 0.050 ||
            //                 order.resourceType === 'O' && order.price <= 0.025 ||
            //                 order.resourceType === 'U' && order.price <= 0.040 ||
            //                 order.resourceType === 'K' && order.price <= 0.020 ||
            //                 order.resourceType === 'X' && order.price <= 0.170 ||
            //                 order.resourceType === 'Z' && order.price <= 0.020 ||
            //                 order.resourceType === 'L' && order.price <= 0.100 ||
            //                 // order.resourceType === 'power' && order.price <= 0.350 ||
            //                 order.resourceType === 'ops' && order.price <= 0.150 ||
            //                 order.resourceType === 'G' && order.price <= 0.250 ||
            //                 order.resourceType === 'token' && order.price <= 500000) ||
            //             shard1 &&
            //             (
            //                 order.resourceType === RESOURCE_METAL && order.price <= 0.610 ||
            //                 order.resourceType === RESOURCE_BIOMASS && order.price <= 0.610 ||
            //                 order.resourceType === RESOURCE_SILICON && order.price <= 0.610 ||
            //                 order.resourceType === RESOURCE_MIST && order.price <= 0.610 ||
            //                 order.resourceType === 'H' && order.price <= 0.050 ||
            //                 order.resourceType === 'O' && order.price <= 0.040 ||
            //                 order.resourceType === 'L' && order.price <= 0.095 ||
            //                 order.resourceType === 'K' && order.price <= 0.030 ||
            //                 order.resourceType === 'U' && order.price <= 0.035 ||
            //                 order.resourceType === 'Z' && order.price <= 0.025 ||
            //                 order.resourceType === 'X' && order.price <= 0.140 ||
            //                 order.resourceType === 'G' && order.price <= 0.250 ||
            //                 order.resourceType === 'ops' && order.price <= 0.150 ||
            //                 order.resourceType === 'power' && order.price <= 0.280 ||
            //                 order.resourceType === 'token' && order.price <= 500000
            //             )
            //             ||
            //             shard0 &&
            //             (
            //                 order.resourceType === RESOURCE_METAL && order.price <= 0.600 ||
            //                 order.resourceType === RESOURCE_BIOMASS && order.price <= 0.600 ||
            //                 order.resourceType === RESOURCE_SILICON && order.price <= 0.600 ||
            //                 order.resourceType === RESOURCE_MIST && order.price <= 0.600 ||
            //                 order.resourceType === 'H' && order.price <= 0.100 ||
            //                 order.resourceType === 'O' && order.price <= 0.065 ||
            //                 order.resourceType === 'U' && order.price <= 0.060 ||
            //                 order.resourceType === 'L' && order.price <= 0.095 ||
            //                 order.resourceType === 'Z' && order.price <= 0.060 ||
            //                 order.resourceType === 'K' && order.price <= 0.050 ||
            //                 order.resourceType === 'X' && order.price <= 0.140 ||
            //                 order.resourceType === 'ops' && order.price <= 0.150 ||
            //                 order.resourceType === 'power' && order.price <= 0.305 ||
            //                 order.resourceType === 'token' && order.price <= 500000
            //             )
            //         ));

            if (sellOrders.length > 0) {
                sellOrders.sort((a, b) => a.price - b.price);

                _.forEach(sellOrders, (order) => {
                    for (let i = 0; i < rooms.length; i++) {
                        const room = rooms[i];

                        if (!room) {
                            continue;
                        }

                        const store = room.store;

                        if (order.resourceType.length === 1 && store[order.resourceType] >= 7500 ||
                            order.resourceType === RESOURCE_OPS && store[order.resourceType] >= 1000000 ||
                            order.resourceType === RESOURCE_POWER && store[RESOURCE_POWER] >= 75000 ||
                            order.resourceType !== RESOURCE_POWER &&
                            order.resourceType.length === 5 && store[order.resourceType] >= 15000) {
                            continue;
                        }

                        const amount = Math.min(order.amount, 15000);

                        if (this._dealOrder(order, room.name, amount, { log: amount * order.price >= 100 }) === OK) {
                            if (amount * order.price >= 100000 && !Game.rooms[order.roomName]) {
                                // Game.notify(`Из комнаты ${order.roomName} в комнату ${room.name} куплено ${amount} ресурса ${order.resourceType} по цене ${order.price}. Потрачено кредитов: ${amount * order.price}`);
                            }

                            order.amount -= amount;
                            order.remainingAmount -= amount;

                            i--;
                            _.pull(rooms, room);

                            if (order.amount <= 0) {
                                break;
                            }
                        }
                    }
                });
            }
        }
    }

    static processTrading2() {
        const rooms = Shard.myRooms.filter((room) => {
            if (!room.terminal || !room.terminal.my || room.terminal.cooldown > 0 || room.terminal.isSending()) {
                return false;
            }

            return true;
        });

        if (rooms.length === 0) {
            return;
        }

        const availableRooms = rooms.map(r => r.name);
        // const sellOrders = (Game.market.credits > MIN_CREDITS_LIMIT ? this._getSellOrders() : []);
        const buyOrders = this._getBuyOrders();
        // const allOrders = buyOrders.concat(sellOrders);
        const orders = {};

        for (const order of buyOrders) {
            for (const room of rooms) {
                if (order.roomName === room.name) {
                    continue;
                }

                if (order.resourceType === RESOURCE_ENERGY) {
                    if (room.store[RESOURCE_ENERGY] < 125000) {
                        continue;
                    }
                } else {
                    if (room.store[RESOURCE_ENERGY] < 45000) {
                        continue;
                    }
                }

                let amount = Math.min(
                    order.amount,
                    // (order.resourceType === RESOURCE_ENERGY ? 15000 : 25000),
                    room.terminal.getResourceAmount(order.resourceType));

                if (order.resourceType === RESOURCE_ENERGY) {
                    amount = Math.min(
                        amount,
                        room.terminal.getEnergyForTransfer(order.roomName));
                }

                if (amount > 0) {
                    if (orders[order.id] === undefined) {
                        orders[order.id] = [];
                    }

                    orders[order.id].push({ amount, room, order });
                }
            }
        }

        buyOrders.sort((a, b) => b.price - a.price).forEach((order) => {
            const list = (orders[order.id] || [])
                .filter(data => availableRooms.includes(data.room.name))
                .sort((a, b) =>
                    this.cost(1000, a.room.name, a.order.roomName) - this.cost(1000, b.room.name, b.order.roomName));

            if (list.length === 0) {
                return;
            }

            for (const data of list) {
                if (order.amount <= 0) {
                    return;
                }

                const amount = Math.min(order.amount, data.amount);
                const minAmount = 1;

                if (amount >= minAmount && this._dealOrder(order, data.room.name, amount) === OK) {
                    _.pull(availableRooms, data.room.name);
                }
            }
        });
    }

    /**
     * @static
     *
     * @param {Object} options
     *
     * @param {string} [options.resourceType=RESOURCE_ENERGY]
     * @param {boolean} [options.log=true]
     * @param {string} [options.roomName]
     * @param {number} [options.minPrice]
     * @param {number} [options.amount]
     * @param {string} [options.initiator]
     *
     * @see Market.deal
     *
     * @returns {number}
     */
    static sell(options = {}) {
        if (typeof options === 'string') {
            options = { resourceType: options };
        }

        _.defaults(options, {
            resourceType: RESOURCE_ENERGY,
            log: true
        });

        const resourceType = global.getResourceType(options.resourceType);
        const orders = this.getOrders({ resourceType: options.resourceType, type: ORDER_BUY }).filter((order) => {
            if (options.minPrice > 0 && options.minPrice > order.price) {
                return false;
            }

            if (options.amount > 0 && options.amount > order.amount) {
                return false;
            }

            return true;
        });

        if (orders.length > 0) {
            orders.sort((a, b) => b.price - a.price);

            const room = options.roomName && Game.rooms[options.roomName.toUpperCase()];
            const order = orders[0];

            if (room) {
                const terminal = room.terminal;

                if (terminal) {
                    const resourceAmount = terminal.getResourceAmount(resourceType);

                    if (resourceAmount > 0) {
                        let amount = Math.min(resourceAmount, order.amount);

                        if (amount > options.amount) {
                            amount = options.amount;
                        }

                        return this._dealOrder(order, room.name, amount);
                    } else {
                        return ERR_NOT_ENOUGH_RESOURCES;
                    }
                } else {
                    return ERR_NOT_FOUND;
                }
            } else {
                let index = 0;
                let some = false;

                _.forEach(Shard.myRooms, (room) => {
                    const terminal = room.terminal;

                    if (terminal) {
                        const resourceAmount = terminal.getResourceAmount(resourceType);

                        if (resourceAmount > 0) {
                            const order = orders[index];
                            let amount = Math.min(resourceAmount, order.amount);

                            if (amount > options.amount) {
                                amount = options.amount;
                            }

                            if (this._dealOrder(order, room.name, amount) === OK) {
                                some = true;

                                if (order.amount === 0 || order.remainingAmount === 0) {
                                    index++;
                                }

                                if (orders.length === index) {
                                    return false;
                                }
                            }
                        }
                    }
                });

                if (some) {
                    return OK;
                }
            }
        }

        return ERR_NOT_FOUND;
    }

    /**
     * @static
     *
     * @param {string} id
     * @param {Object} [options={}]
     *
     * @param {number} [options.maxPrice]
     * @param {boolean} [options.ignoreLimit=false]
     * @param {boolean} [options.log=true]
     * @param {string} [options.initiator]
     *
     * @see Market.getCurrentPrice
     * @see Market.changePrice
     *
     * @returns {number}
     */
    static updatePrice(id, options = {}) {
        _.defaults(options, {
            ignoreLimit: false,
            log: true
        });

        const order = Game.market.orders[id] || Game.market.getOrderById(id);

        if (order) {
            let newPrice;

            if (order.type === ORDER_BUY) {
                newPrice = this.getCurrentPrice({ type: order.type, resourceType: order.resourceType }) + 0.001;

                if (order.resourceType === RESOURCE_ENERGY && !options.ignoreLimit) {
                    newPrice = Math.min(newPrice, ENERGY_PRICE_LIMIT);
                }
            } else {
                newPrice = Math.max(0.001, this.getCurrentPrice({ type: order.type, resourceType: order.resourceType }) - 0.001);
            }

            if (newPrice > options.maxPrice) {
                newPrice = options.maxPrice;
            }

            if (newPrice > 0 && order.price !== newPrice && (newPrice < 1 || options.ignoreLimit)) {
                newPrice = Math.min(newPrice, PRICE_LIMIT);

                return this.changePrice(id, newPrice, { log: options.log, initiator: options.initiator });
            }

            return OK;
        }

        return ERR_NOT_FOUND;
    }

};

//

module.exports = Market;
