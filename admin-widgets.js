(function ($) {
    if (!window.Ag) window.Ag = {};

    	console.log(ag_duplicate_widgets);

    Ag.CloneWidgets = {
        // Initialize
        init: function () {
            $('body').on('click', '.widget-control-actions .clone-me', Ag.CloneWidgets.Clone);
            Ag.CloneWidgets.Bind();
        },

        // Add Clone button to widgets control buttons
        Bind: function () {
            $('#widgets-right').off('DOMSubtreeModified', Ag.CloneWidgets.Bind);
            $('.widget-control-actions:not(.meks-cloneable)').each(function () {
                var $widget = $(this);

                var $clone = $('<a>');
                var clone = $clone.get()[0];
                $clone.addClass('clone-me meks-clone-action')
                    .attr('title', ag_duplicate_widgets.title)
                    .attr('href', '#')
                    .html(ag_duplicate_widgets.text);


                $widget.addClass('meks-cloneable');
                $clone.insertAfter($widget.find('.alignleft .widget-control-remove'));

                //Separator |
                clone.insertAdjacentHTML('beforebegin', ' | ');
            });

            $('#widgets-right').on('DOMSubtreeModified', Ag.CloneWidgets.Bind);
        },

        // Cloning the widget with support for text widget with tinyMce (Wp Editor)
        Clone: function (ev) {
            var $original = $(this).parents('.widget');
            var $widget = $original.clone();

            // Find this widget's ID base. Find its number, duplicate.
            var idbase = $widget.find('input[name="id_base"]').val();
            var number = $widget.find('input[name="widget_number"]').val();
            var mnumber = $widget.find('input[name="multi_number"]').val();
            var highest = 0;

            $('input.widget-id[value|="' + idbase + '"]').each(function () {
                var match = this.value.match(/-(\d+)$/);
                if (match && parseInt(match[1]) > highest)
                    highest = parseInt(match[1]);
            });

            var newnum = highest + 1;

            $widget.find('.widget-content').find('input,select,textarea').each(function () {
                if ($(this).attr('name')) {
                    var replace_what = mnumber > 0 ? mnumber : number;
                    $(this).attr('name', $(this).attr('name').replace(replace_what, newnum));
                }
            });

            // assign a unique id to this widget:
            var highest = 0;
            $('.widget').each(function () {
                var match = this.id.match(/^widget-(\d+)/);

                if (match && parseInt(match[1]) > highest)
                    highest = parseInt(match[1]);
            });
            var newid = highest + 1;

            // Figure out the value of add_new from the source widget:
            var add = $('#widget-list .id_base[value="' + idbase + '"]').siblings('.add_new').val();

            $widget[0].id = 'widget-' + newid + '_' + idbase + '-' + newnum;
            $widget.find('input.widget-id').val(idbase + '-' + newnum);
            $widget.find('input.widget_number').val(newnum);
            $widget.hide();
            $original.after($widget);
            $widget.fadeIn();
            // Not exactly sure what multi_number is used for.
            $widget.find('.multi_number').val(newnum);

            // Support for text widget
            if ($widget.find('.text-widget-fields').length > 0) {
                var iframeId = $widget.find('.mce-edit-area > iframe').attr('id');
                var tinyMceId = iframeId.substring(0, iframeId.length - 4);
                var textAreaValue = '';
                if($widget.find('.wp-core-ui.wp-editor-wrap').hasClass('tmce-active')){
                    textAreaValue = tinyMCE.get(tinyMceId).getContent();
                }else{
                    textAreaValue = $widget.find('.widefat.text.wp-editor-area').val();
                }
                var timeStamp = Math.floor(Date.now() / 1000);
                var $tmceActive = $widget.find('.wp-editor-wrap');

                $tmceActive.parent().html('<textarea id="e_' + timeStamp + '_text">' + textAreaValue + '</textarea>');
                wp.editor.initialize('e_' + timeStamp + '_text', {tinymce: true, quicktags: true});
                $('#e_' + timeStamp + '_text').addClass('widefat text wp-editor-area');
            }
            wpWidgets.save($widget, 0, 0, 1);

            ev.stopPropagation();
            ev.preventDefault();
        }
    };

    $(Ag.CloneWidgets.init);

    $("#herald-child-category-posts-order").sortable();
})(jQuery);