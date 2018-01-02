// <%= compNamePretty %> component JS goes here
(function() {
  "use strict";

  window['<%= componentsGroup %>'] = window['<%= componentsGroup %>'] || {};
  /**
   * <%= compNamePretty %> Class.
   */
  function <%= compName %>() {
    /**
     * Function called when the component is available on screen
     */
    function initialize () {
      // Component functionality goes here.

    }
  };

  window['<%= componentsGroup %>']['<%= compName %>'] = new <%= compName %>();
  window['<%= componentsGroup %>']['<%= compName %>'].initialize();
})();
