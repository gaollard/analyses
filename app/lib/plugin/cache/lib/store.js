
let store = {
    "签名串": "token"
};

let actions = {
    add(sign, value) {
        if (!sign || !value) return;
        this.store[sign] = value;
    },
    delete(sign) {
        if (sign) return delete this.store[sign];
        return this.store = {};
    },
    query(sign) {
        if (sign) return this.store[sign];
        return this.store;
    }
};

module.exports = {
    add: actions.add,
    query: actions.query,
    delete: actions.delete,
    store: store
};