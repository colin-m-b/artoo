;(function(undefined) {
  'use strict';

  /**
   * artoo attributes jQuery plugin
   * ===============================
   *
   * Simplistic jQuery plugin designed to retrieve list of attributes for the
   * given elements.
   */

  function _classes($) {
    $.fn.classes = function() {
      var index = {},
          cls;

      $(this).each(function() {
        cls = $(this).attr('class');
        if (cls)
          cls.trim().split(' ').forEach(function(c) {
            index[c] = true;
          });
      });

      return Object.keys(index);
    };
  }

  function _attributes($) {
    $.fn.attributes = function(classes) {
      classes = classes === undefined ? true : false;

      var $e = $(this).first(),
          attrs = {},
          i,
          l,
          a,
          n,
          v;

      if (!$e[0])
        throw Error('jquery.attributes: trying to access attributes ' +
                    'of no element.');

      for (i = 0, l = $e[0].attributes.length; i < l; i++) {
        a = $e[0].attributes[i];
        n = a.name || a.nodeName;
        v = $e.attr(n);

        if (!classes && n === 'class')
          continue;

        if (v !== undefined && v !== false)
          attrs[n] = v;
      }

      return attrs;
    };
  }

  // Exporting
  artoo.jquery.plugins.push(_classes);
  artoo.jquery.plugins.push(_attributes);
}).call(this);