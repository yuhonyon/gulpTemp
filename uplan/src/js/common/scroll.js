//滚动条
(function() {
    function scroll() {
        $('.scroll').niceScroll({
            cursorcolor: "rgba(0,0,0,.3)",
            cursorwidth: "5px",
            cursorborder: "0",
            cursorborderradius: "5px",
            background: "rgba(0,0,0,.1)",
        });

        $("body").niceScroll({
            cursorcolor: "rgba(0,0,0,.3)",
            cursorwidth: "5px",
            cursorborder: "0",
            cursorborderradius: "5px",
            background: "rgba(0,0,0,.1)",
        });

        $(".scroll-wrapper").each(function() {
            var content = $(this).children('.scroll-body');
            $(this).niceScroll(content, {
                cursorcolor: "rgba(0,0,0,.3)",
                cursorwidth: "5px",
                cursorborder: "0",
                cursorborderradius: "5px",
                background: "rgba(0,0,0,.1)"
            });
        });
    }
    $(document).on("mouseenter touchstart", ".scroll,.scroll-light,.scroll-wrapper,.scroll-light-wrapper", function() {
        if ($(this).getNiceScroll == undefined || $(this).getNiceScroll().length == 0) {
            scroll();
        }
    });
    $(function() {
        scroll();
    });
})();






