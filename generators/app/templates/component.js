// <%= compNamePretty %> component JS goes here
(function($, window, document) {
  "use strict";

  window['<%= componentsGroup %>'] = window['<%= componentsGroup %>'] || {};
  /**
   * <%= compNamePretty %> Class.
   */
  var <%= compName %> = function() {};
  /**
   * Function called when the component is available on screen
   */
  <%= compName %>.prototype.initialize = function() {
    // Component functionality goes here.
  }
  // Create new instance of <%= compNamePretty %> Class.
  window['<%= componentsGroup %>']['<%= compName %>'] = new <%= compName %>();

  $(function() {
    // The DOM is ready!
    // Initialize the functionality
    window['<%= componentsGroup %>']['<%= compName %>'].initialize();
  });
})(window.jQuery, window, document);
