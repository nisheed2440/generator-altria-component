// <%= compNamePretty %> component JS goes here
import $ from 'jquery';
/** <%= compNamePretty %> Class. */
class <%= compNameClass %> {
    /**
     * Footer constructor
     */
    constructor() {
        this.initialize();
    }
    /**
     * Initialization function
     */
    initialize() {
        console.log($);
    }
}

export default new <%= compNameClass %>();
