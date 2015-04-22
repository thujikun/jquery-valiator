(function($) {
    'use strict';

    $(function() {
        $('form').validator();

        $('input, textarea, select').on('validate', function(e, result) {
            var prefix = result.checkType;

            if (result.error) {
                $(this).addClass(prefix + '-invalid');
            } else {
                $(this).removeClass(prefix + '-invalid');
            }
        });

        $('[name=email]').on('validate', function(e, result) {
            var $target = $('[name=email-confirmation]');

            if (result.checkType === 'unit') {
                if (result.error) {
                    $target.prop('disabled', true);
                    $target.removeClass('unit-invalid').removeClass('relation-invalid');

                } else {
                    $target.prop('disabled', false);
                }
            }
        });

        $('[name=email]').on('validate', function(e, result) {
            var $parent = $(this).parent();

            if (result.checkType === 'unit') {
                if (result.error) {
                    $parent.removeClass('email-valid');
                } else {
                    $parent.addClass('email-valid');
                }
            }
        });

        $('[name=email-confirmation]').on('validate', function(e, result) {
            var $parent = $(this).parent();

            if (result.checkType === 'relation') {
                if (result.error || result.eventtype !== 'blur') {
                    $parent.removeClass('email-valid');
                } else if (result.eventtype === 'blur') {
                    $parent.addClass('email-valid');
                }
            }
        });
    });
}.call(this, jQuery));