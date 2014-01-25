/**
 * @name ScoreSelector
 * @type: jQuery
 * @description: Little rating indicator-like widget "||||||| 7"
 * @author: Denis Kazimirov
 * @version: 1.0
 * Date: 25.01.14
 */

// source element need to be an input field, which will be hidden and replaced by dynamic ScoreSelector
;
(function($, window, undefined) {

    // Create the defaults once
    var pluginName = 'scoreSelector',
        document = window.document,
        defaults = {
            value: 0,
            max: 10,
            readonly: null,
            containerElement: '<div class="ss-container"></div>',
            showScoreNumber: true
        };

    var cont, opt;

    // The actual plugin constructor
    function ScoreSelector(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    ScoreSelector.prototype.init = function() {
        opt = this.options;
        var el = $(this.element);

        if (!el.is('input')) {
            throw Error('ScoreSelector must be attached to input field');
        }
        el.hide();
        if (el.val()) {
            opt.value = el.val();
            if (opt.readonly !== false) {
                opt.readonly = true;
            }

        }
        cont = $(this.options.containerElement);
        var pointsHtml = '';
        for (var i = 1; i <= opt.max; ++i) {
            pointsHtml += '<span class="ss-point" title="' + i + '" data-num="' + i + '"></span>';
        }
        if (opt.showScoreNumber) {
            pointsHtml += '<span class="ss-number">' + opt.value + '</span>';
        }
        cont.html(pointsHtml);

        if (!opt.readonly) {
            cont.find('.ss-point')
                .bind('click', function() {
                    var $this = $(this);
                    opt.value = $this.data('num');
                    updateScore(el, opt.value);
                    el.val(opt.value);
                    var numberEl = $this.siblings('.ss-number');
                    numberEl.animate({
                        opacity: '-=0.5'
                    }, 100, function() {
                        numberEl.css('opacity', '');
                    });
                })
                .hover(
                function() {
                    var hoverValue = $(this).data('num');
                    updateScore(el, hoverValue);
                },
                function() {
                    updateScore(el, el.val());

                }

            );
        }
        el.after(cont);
        if (opt.value) {
            updateScore(el, opt.value);
        }

    };

    var updateScore = function(el, value) {

        var cont = el.next('.ss-container');
        cont.find('.ss-point').each(function() {
            var $this = $(this);
            var curValue = $this.data('num');
            if (curValue <= value) {
                $this.addClass('selected');
            } else {
                $this.removeClass('selected');
            }
        });
        if (opt.showScoreNumber) {
            var numberEl = cont.find('.ss-number');
            value == '' ? value = '0' : value;
            numberEl.text(value);
            if (value == 0) {
                numberEl.removeClass('selected');
            } else {
                numberEl.addClass('selected');
            }
        }

    };

    // A really lightweight plugin wrapper around the constructor,
    $.fn[pluginName] = function(options) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new ScoreSelector(this, options));
                }
            });

        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Cache the method call
            var returns;
            this.each(function() {
                var instance = $.data(this, 'plugin_' + pluginName);
                if (instance instanceof ScoreSelector && typeof instance[options] === 'function') {
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }
                if (options === 'destroy') {
                    $.data(this, 'plugin_' + pluginName, null);
                }
            });
            return returns !== undefined ? returns : this;
        }
    };

}(jQuery, window));


