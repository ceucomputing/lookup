export default class {

    constructor(tickFunction) {
        this.timer = null;
        this.timeLeft = 0;
        this.tickFunction = tickFunction;
    }

    isRunning() {
        return this.timer !== null;
    }

    clear() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    start(duration) {
        this.clear();
        if (duration > 0) {
            this.timeLeft = duration;
            this.timer = setInterval(this.tick.bind(this), 1000);
            this.tickFunction(this.timeLeft);
        }
    }

    tick() {
        if (!this.isRunning()) return;
        this.timeLeft -= 1;
        if (this.timeLeft <= 0) {
            this.clear();
        }
        this.tickFunction(this.timeLeft);
    }

}
