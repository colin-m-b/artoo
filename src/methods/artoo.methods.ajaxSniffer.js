;(function(undefined) {
  'use strict';

  /**
   * artoo ajax sniffer
   * ===================
   *
   * A useful ajax request sniffer.
   */
  var _root = this,
      before = artoo.helpers.before;

  // Persistent state
  var originalXhr = {
    open: XMLHttpRequest.prototype.open,
    send: XMLHttpRequest.prototype.send
  };

  // Main abstraction
  function AjaxSniffer() {
    var self = this;

    // Properties
    this.hooked = false;
    this.listeners = [];

    // Privates
    function hook() {
      if (self.hooked)
        return;

      // Monkey patching the 'open' method
      XMLHttpRequest.prototype.open = before(
        XMLHttpRequest.prototype.open,
        function(method, url, async) {
          var xhr = this;

          // Overloading the xhr object
          xhr._spy = {
            method: method,
            url: url
          };
        }
      );

      // Monkey patching the 'send' method
      XMLHttpRequest.prototype.send = before(
        XMLHttpRequest.prototype.send,
        function(data) {
          var xhr = this;

          // Overloading the xhr object
          xhr._spy.data = data;

          // Triggering listeners
          self.listeners.forEach(function(listener) {
            if (listener.criteria === '*')
              listener.fn.call(xhr);
          });
        }
      );

      self.hooked = true;
    }

    function release() {
      if (!self.hooked)
        return;

      XMLHttpRequest.prototype.send = originalXhr.send;
      XMLHttpRequest.prototype.open = originalXhr.open;

      self.hooked = false;
    }

    // Methods
    this.before = function(criteria, callback) {

      // Polymorphism
      if (typeof criteria === 'function') {
        callback = criteria;
        criteria = null;
      }

      criteria = criteria || {};

      // Hooking xhr
      hook();

      // Binding listener
      this.listeners.push({criteria: '*', fn: callback});
    };

    this.after = function(criteria, callback) {

      // Polymorphism
      if (typeof criteria === 'function') {
        callback = criteria;
        criteria = null;
      }

      criteria = criteria || {};

      // Hooking xhr
      hook();

      // Binding a deviant listener
      this.listeners.push({criteria: '*', fn: function() {
        var xhr = this,
            originalCallback = xhr.onreadystatechange;

        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.prototype.DONE) {

            // TODO: fiddle here to pass additional data
            callback.apply(xhr);
          }

          if (typeof originalCallback === 'function')
            originalCallback.apply(xhr, arguments);
        };
      }});
    };
  }

  // Namespace
  artoo.ajaxSniffer = new AjaxSniffer();
}).call(this);