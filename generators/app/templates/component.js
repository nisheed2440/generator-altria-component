// <%= compNamePretty %> component JS goes here
(function($, window, document) {
  "use strict";

  window['<%= componentsGroup %>'] = window['<%= componentsGroup %>'] || {};
  /**
   * <%= compNamePretty %> Class.
   */
  class <%= compNameClass %>{
    /**
     * Class constructor
     */
    constructor() {
      // Any initialization of variables
    }
     /**
     * Function called when the component is available on screen
     */
    initialize(){
       // Component functionality goes here.
    }
  }

  // Create new instance of <%= compNamePretty %> Class.
  window['<%= componentsGroup %>']['<%= compNameClass %>'] = new <%= compNameClass %>();

  $(function() {
    // The DOM is ready!
    // Initialize the functionality
    window['<%= componentsGroup %>']['<%= compNameClass %>'].initialize();
  });
})(window.jQuery, window, document);
