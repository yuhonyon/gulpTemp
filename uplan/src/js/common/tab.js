﻿
//tab切换
(function($) {
    'use strict';
    var Utab = function(element) {
        this.$element = $(element);
        if (!this.$element.hasClass('tab-nav')) this.$element = this.$element.closest('.tab-nav');

        var that = this;

        this.$element.on('click', '[data-tab]', function(e) {
            e.preventDefault();
            that.show(e.target);

        });

        this.$element.on('click', '.tab-nav-btn-next', function() {
            that.scroll("prev");

        });
        this.$element.on('click', '.tab-nav-btn-prev', function() {
            that.scroll("next");
        });

        this.$element.on('click', '[data-dismiss="tab"]', function(e) {
            e.preventDefault();
            that.close($(this).parent('[data-tab]'));
            return false;
        });
    };

    Utab.prototype.show = function(selector) {
        var $selected = (typeof selector == "object") ? $(selector) : this.$element.find(selector);
        this.$element.find('[data-tab]').removeClass("active");
        $selected.addClass("active");
        $($selected.attr("data-tab")).siblings(".tab-body").removeClass("active");
        $($selected.attr("data-tab")).addClass("active");
        if (this.$element.hasClass('tab-multi')) {
            this.scroll('click');
        }
        var e = $.Event('utab.show', { tabNva: $selected[0], tabBody: $($selected.attr("data-tab"))[0] });
        this.$element.trigger(e);
    };
    Utab.prototype.close = function(selector) {
        var $selected = (typeof selector == "object") ? $(selector) : this.$element.find(selector);

        if ($selected.hasClass("active")) {
            var $active = $selected.prev("[data-tab]");
            if (!$active[0]) {
                $active = $selected.next("[data-tab]");
            }
            $active.addClass("active");
            $($active.attr("data-tab")).siblings(".tab-body").removeClass("active");
            $($active.attr("data-tab")).addClass("active");
        }
        $($selected.attr("data-tab")).removeClass("active");
        $selected.remove();
        var e = $.Event('utab.close', { tabNva: $selected[0], tabBody: $($selected.attr("data-tab"))[0] });
        this.$element.trigger(e);

    };
    Utab.prototype.add = function(html) {
        if (this.$element.find("[data-tab]:last")[0]) {
            this.$element.find("[data-tab]:last").after(html);
        } else {
            this.$element.find(".tab-nav-body").prepend(html);
        }


        this.show(this.$element.find("[data-tab]:last"));

    };

    Utab.prototype.scroll = function(dir) {
        var contentWidth = 0;
        var $parent = this.$element;
        var $li = $parent.find("[data-tab]");
        var btnWidth = $parent.find('.tab-nav-btn-prev').outerWidth();

        var start = 0,
            end;
        for (var i = 0; i < $li.length; i++) {
            if ($li.eq(i).position().left - btnWidth <= 10) {
                start = i;
            } else if ($li.eq(i).position().left + $li.eq(i).outerWidth() > $parent.innerWidth() - 10) {
                end = i;
                break;
            } else {

                if (i == $li.length - 1) {
                    end = undefined;
                }
            }
        }


        if (dir == "prev") {
            if (end !== undefined) {
                $parent.find('ul').css('margin-left', $li.eq(end).position().left * -1 + btnWidth + parseFloat($parent.find('ul').css('margin-left')));
            }
        } else if (dir == "next") {
            contentWidth = 0;
            for (var j = start; j >= 0; j--) {

                if (contentWidth + $li.eq(j).outerWidth() > $parent.innerWidth()) {

                    $parent.find('ul').css('margin-left', parseFloat($parent.find('ul').css('margin-left')) - $li.eq(j + 1).position().left + btnWidth);
                    break;
                }
                if (j === 0) {

                    $parent.find('ul').css('margin-left', 0);
                    break;
                }
                contentWidth += $li.eq(j).outerWidth();

            }

        } else {
            if ($li.eq(end).hasClass('active')) {
                $parent.find('ul').css('margin-left', $li.eq(end).position().left * -1 + btnWidth + parseFloat($parent.find('ul').css('margin-left')) + $li.eq(end - 1).outerWidth());
            } else if ($li.eq(end - 1).hasClass('active')) {
                $parent.find('ul').css('margin-left', $li.eq(end - 1).position().left * -1 + btnWidth + parseFloat($parent.find('ul').css('margin-left')) + $li.eq(end - 2).outerWidth());
            } else if ($li.eq(start).hasClass('active') && start > 0) {
                $parent.find('ul').css('margin-left', parseFloat($parent.find('ul').css('margin-left')) + $li.eq(start - 1).outerWidth());
            } else if (end && $parent.find("[data-tab].active").index() > end || $parent.find("[data-tab].active").index() < start) {
                $parent.find('ul').css('margin-left', parseFloat($parent.find('ul').css('margin-left')) - $parent.find("[data-tab].active").position().left + $li.eq(start + 1).position().left);
            }
        }

    };


    Utab.prototype.multi = function() {
        this.$element.addClass("tab-multi");
        if (!this.$element.find(".tab-nav-btn-prev")[0]) {
            this.$element.find("ul").append('<li class="tab-nav-btn-prev">\
                    <i class="icon-u-backward"></i>\
                </li>\
                <li class="tab-nav-btn-next">\
                    <i class="icon-u-forward"></i>\
                </li>');
        }
    };







    function Plugin(option, param) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('uplan-utab');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('uplan-utab', (data = new Utab(this, options)));

            if (option == 'show') data.show(param);
            else if (option == 'prev') data.scroll('prev');
            else if (option == 'next') data.scroll('next');
            else if (option == 'add') data.add(param);
            else if (option == 'close') data.close(param);
            else if (option == 'scroll') data.multi();

        });
    }



    $.fn.utab = Plugin;


    //状态初始
    $(function() {
        $(".tab-nav").utab();
        $(".tab-nav-multi").utab("scroll");
    });

})(jQuery);


