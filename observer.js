class Observer {

    static run(room) {
        this.room = room;
        this.observer = room.observer;

        if (!this.observer) {
            return;
        }

        this.update();
    }

    static update() {
        const request = this.observer.memory.request;

        if (request) {
            const result = this.observer.observeRoom(request.room);

            if (result === OK) {
                request.ticks--;

                if (request.ticks <= 0) {
                    delete this.observer.memory.request;
                }

                return;
            } else if (result === ERR_NOT_IN_RANGE) {
                delete this.observer.memory.request;
            }
        }

        // if (Game.time % 50 !== 0) {
        //     return;
        // }
        //
        // const rooms = this.ROOMS[this.room.name];
        //
        // if (!rooms) {
        //     return;
        // }
        //
        // let index = this.room.memory.observerNextRoomIndex || 0;
        // let room = rooms[index];
        //
        // if (!room && index > 0 && index >= rooms.length) {
        //     index = 0;
        //     room = rooms[index];
        // }
        //
        // if (room) {
        //     if (this.room.tryToRequestObserve(room, 1)) {
        //         this.room.memory.observerNextRoomIndex = index + 1;
        //     }
        // }
    }

}

Observer.ROOMS = {
    E68S8: ['E70S0', 'E70S1', 'E70S2', 'E70S3', 'E70S4', 'E70S5', 'E70S6', 'E70S7', 'E70S8', 'E70S9'],
    E68S9: ['E65S10', 'E66S10', 'E67S10', 'E68S10', 'E69S10', 'E70S10', 'E71S10', 'E72S10', 'E73S10', 'E74S10', 'E75S10'],
    E64S13: ['E60S10', 'E61S10', 'E62S10', 'E63S10', 'E64S10', 'E60S11', 'E60S12', 'E60S13', 'E60S14', 'E60S15'],
    E67S14: ['E70S12', 'E70S13', 'E70S14'],
    E74S21: ['E70S20', 'E71S20', 'E72S20', 'E73S20', 'E74S20', 'E75S20', 'E76S20', 'E77S20', 'E78S20', 'E79S20', 'E80S20'],
};

module.exports = Observer;
