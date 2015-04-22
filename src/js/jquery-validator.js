/**
 * @fileoverview validator.js
 * @author thujikun
 * @version 1.0.0
 */

/**
 * The jQuery plugin namespace.
 * @external "jQuery.fn"
 */

;(function($) {
    'use strict';

    function defineProp(obj, prop, val) {
        if ('defineProperty' in Object) {
            try {
                Object.defineProperty(obj, prop, {
                    enumerable: false,
                    writable: false,
                    configurable: false,
                    value: val
                });
            } catch (defPropException) {
                obj[prop] = val;
            }
        } else {
            obj[prop] = val;
        }
    }

    function getTargetEl($form, option) {
        if (option.selector) {
            return $form.find(option.selector);
        } else {
            return $form.find('[name=' + option.name + ']');
        }
    }

    /**
     * @class Validator
     * @classdesc form validation plugin
     * @param {Object} config  configration of validation
     * @param {String} options option parameters
     */
    var Validator = function(config, options) {
        this._constructor(config, options);
    };

    (function() {
        defineProp(Validator.prototype, '_defaults', {
            /**
             * @property {Object} checks default check types
             * @memberof Validator._defaults
             */
            checks: {
                'required': {
                    listener: '_chkRequired',
                    eventtype: ['blur', 'input']
                },
                'required-check': {
                    listener: '_chkRequiredCheck',
                    eventtype: []
                },
                'length': {
                    listener: '_chkLength',
                    eventtype: ['blur']
                },
                'maxlength': {
                    listener: '_chkMaxlength',
                    eventtype: ['blur', 'input']
                },
                'minlength': {
                    listener: '_chkMinlength',
                    eventtype: ['blur']
                },
                'maxnum': {
                    listener: '_chkMaxnum',
                    eventtype: ['blur', 'input']
                },
                'minnum': {
                    listener: '_chkMinnum',
                    eventtype: ['blur', 'input']
                },
                'format': {
                    listener: '_chkFormat',
                    eventtype: {
                        'default': ['blur', 'input'],
                        email: ['blur'],
                        date: ['blur']
                    }
                },
                'regexp': {
                    listener: '_chkRegexp',
                    eventtype: ['blur', 'input']
                },
                'copy': {
                    listener: '_chkCopy',
                    eventtype: ['input']
                },
                'same': {
                    'body': {
                        listener: '_chkSame',
                        eventtype: ['focus', 'blur']
                    },
                    'confirmation': {
                        listener: '_chkSame',
                        eventtype: ['focus', 'input', 'blur']
                    }
                },
                'date-around': {
                    'before': {
                        listener: '_chkDateAround',
                        eventtype: ['blur']
                    },
                    'after': {
                        listener: '_chkDateAround',
                        eventtype: ['blur']
                    }
                },
                'credit': {
                    'default': {
                        listener: '_chkCredit',
                        eventtype: ['blur']
                    }
                }
            },
            /**
             * @property {Object}
             * @description format check settings
             * @memberof Validator._defaults
             */
            format: {
                'number': {
                    'regexp': 'number'
                },
                'half-char': {
                    'regexp': 'half-char'
                },
                'half': {
                    'regexp': 'half'
                },
                'half-kana': {
                    'regexp': 'half-kana'
                },
                'url': {
                    'regexp': 'url'
                },
                'tel': {
                    'regexp': 'tel'
                },
                'tel-i18n': {
                    'regexp': 'tel-i18n'
                },
                'email': {
                    'regexp': 'email'
                },
                'full-kana': {
                    'regexp': 'full-kana'
                },
                'full-char': {
                    'regexp': 'full-char'
                },
                'date': {
                    'regexp': 'date',
                    'special': 'valid-date'
                },
                'dateYM': {
                    'regexp': 'dateYM',
                    'special': 'valid-date'
                },
                'credit': {
                    'regexp': 'credit',
                    'special': 'rune'
                }
            },
            /**
             * @property {Object}
             * @description regular expressions by each format
             * @memberof Validator._defaults
             */
            regexp: {
                'number':    /^[0-9]*$/,
                'half-char': /^[0-9A-Za-z]*$/,
                'half':      /^[\x20-\x7e]*$/,
                'half-kana': /^[ｦ-ﾝ]*$/,
                'tel':       /^[0-9]*$/,
                'tel-i18n':  /^[\+]?[0-9]*$/,
                'url':       /^(http|https):\/\/[^\.]+\.[^\.]/,
                'email':     /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
                'full-kana': /^[ァ-ヶ]*$/,
                'full-char': /^[^\x20-\x7eｱ-ﾝﾞﾟｧ-ｫｬ-ｮｰ]*$/,
                'date':      /^[0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2}$/,
                'dateYM':    /^[0-9]{4}\/[0-9]{1,2}$/,
                'credit':    /^[0-9\-]*$/
            },
            /**
             * @property {Object}
             * @description Messages
             * @memberof Validator._defaults
             */
            MESSAGES: {
                'REQUIRED':         '{0}を入力してください。',
                'REQUIRED-CHECK':   '{0}を{1}つ以上選択してください。',
                'MAXLENGTH':        '{0}は{1}文字以下で入力してください。',
                'LENGTH':           '{0}は{1}文字で入力してください。',
                'MINLENGTH':        '{0}は{1}文字以上で入力してください。',
                'MAXNUM':           '{0}は{1}以内の数値を入力してください。',
                'MINNUM':           '{0}は{1}以上の数値を入力してください。',
                'REGEXP':           '不正な文字が含まれています。',
                'COPY':             '異なった{0}が入力されています。',
                'FORMAT-NUMBER':    '{0}は半角数字を入力してください。',
                'FORMAT-HALF-CHAR': '{0}は半角英数字で入力してください。',
                'FORMAT-HALF':      '{0}は半角で入力してください。',
                'FORMAT-HALF-KANA': '{0}は半角カナで入力してください。',
                'FORMAT-TEL':       '{0}は有効な電話番号を入力してください。',
                'FORMAT-TEL-I18N':  '{0}は有効な電話番号を入力してください。',
                'FORMAT-URL':       '{0}は有効なURLを入力してください。',
                'FORMAT-EMAIL':     '{0}は有効なメールアドレスを入力してください。',
                'FORMAT-FULL-KANA': '{0}は全角カナで入力してください。',
                'FORMAT-FULL-CHAR': '{0}は全角で入力してください。',
                'FORMAT-DATE':      '{0}には正しい日付書式で入力してください。',
                'FORMAT-DATEYM':    '{0}には正しい日付書式で入力してください。',
                'FORMAT-RUNE':      '不正なクレジットカード番号が入力されています。',
                'SAME':             '異なった{0}が入力されています。',
                'DATE-AROUND':      '{0}には{1}より前の日付を入力してください。',
                'CREDIT':           '不正なクレジットカード番号が入力されています。'
            }
        });

        /**
         * @property {Object} CONST
         * @desc constant parameter
         * @inner
         * @memberof Validator
         */
        defineProp(Validator.prototype, 'CONST', {
            'DEFAULT_ROLE': 'default',
            'NAME_SPACE': 'validator',
            'NAME_SPACE_UNIT': 'unit',
            'NAME_SPACE_RELATION': 'relation',
            'CHECKTYPE_UNIT': 'unit',
            'CHECKTYPE_RELATION': 'relation'
        });

        /**
         * @method _constructor
         * @desc initilize validator
         * @param {Object} config  configuration for validator
         * @param {Object} options validator options for each field
         * @inner
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_constructor', function(config, options) {
            var that = this;

            this.config = $.extend(true, {}, this._defaults, config);
            this.options = options || [];
            this.relationElements = {};

            if (config.checks) {
                $.each(config.checks, function(key, value) {
                    that.config.checks[key].eventtype = value.eventtype;
                });
            }

            this.enable();
        });

        /**
         * @method enable
         * @desc enable validator
         * @inner
         * @memberof Validator
         */
        defineProp(Validator.prototype, 'enable', function() {
            var that = this;

            that.options.forEach(function(option) {
                that._register(option);
            });
            that._registerRelation();

            return that;
        });

        /**
         * @method disable
         * @desc disable validator
         * @inner
         * @memberof Validator
         */
        defineProp(Validator.prototype, 'disable', function() {
            var CONST = this.CONST,
                NAME_SPACE = '.' + CONST.NAME_SPACE + '.' + CONST.NAME_SPACE_UNIT,
                $form = this.config.$form,
                options = this.options;

            options.forEach(function(option) {
                var $el = getTargetEl($form, option);

                $el.off(NAME_SPACE);
            });

            return this;
        });

        /**
         * @method add
         * @desc add validation option
         * @param {Object} option validator option
         * @inner
         * @memberof Validator
         */
        defineProp(Validator.prototype, 'add', function(option) {
            this.options.push(option);
            this._register(option);
            this._registerRelation();

            return this;
        });

        /**
         * @method formValidate
         * @desc validate form all elements
         * @param {Boolean} silent fire validate event or not
         * @inner
         * @memberof Validator
         */
        defineProp(Validator.prototype, 'formValidate', function(silent) {
            var dfd = $.Deferred(),
                unitDfds = [],
                relationDfds = [],
                that = this,
                checks = that.config.checks,
                $form = that.config.$form,
                options = that.options,
                relationElements = that.relationElements,
                formResults = [];

            options.forEach(function(option) {
                var $el = getTargetEl($form, option),
                    results = [],
                    unitDfd = $.Deferred();

                if (!$el.size()) {
                    return;
                }

                if (option.unit) {
                    $.each(option.unit, function(key, value) {
                        results.push(that[checks[key].listener]({type: 'formvalidate'}, $el, value));
                    });
                }

                unitDfds.push(unitDfd.promise());

                $.when.apply($, results).then(function() {
                    var args = Array.prototype.slice.call(arguments);

                    formResults.push(that._validateEnd({type: 'formvalidate'}, $el, args, silent));
                    unitDfd.resolve();
                });
            });

            $.each(relationElements, function(type, relations) {
                var checkSettings = checks[type];

                $.each(relations, function(key, relation) {
                    $.each(relation, function(role, elements) {
                        var checkSetting = checkSettings[role];

                        elements.forEach(function($el) {
                            var results = [],
                                relationDfd = $.Deferred();

                            results.push(that[checkSetting.listener]({type: 'formvalidate'}, $el, relation));
                            relationDfds.push(relationDfd.promise());

                            $.when.apply($, results).then(function() {
                                var args = Array.prototype.slice.call(arguments);

                                formResults.push(that._validateEnd({type: 'formvalidate'}, $el, args, silent));
                                relationDfd.resolve();
                            });
                        });
                    });
                });
            });


            $.when.apply($, unitDfds.concat(relationDfds)).then(function() {
                $.when.apply($, formResults).then(function() {
                    var args = Array.prototype.slice.call(arguments);
                    dfd.resolveWith($form, [that._formValidateEnd(args)]);
                });
            });

            return dfd.promise();

        });

        /**
         * @method _formValidateEnd
         * @desc callback for form validate
         * @param {results} result of validation for all input field in form
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_formValidateEnd', function(results) {
            var errorInfo = {
                    error: false,
                    data: []
                };

            results.forEach(function(result) {
                if(result.error) {
                    errorInfo.error = true;
                    errorInfo.data = results;
                    return false;
                }
            });

            return errorInfo;
        });

        /**
         * @method _register
         * @desc register event listener
         * @param {Object} option validator option
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_register', function(option) {
            var that = this,
                CONST = that.CONST,
                NAME_SPACE = '.' + CONST.NAME_SPACE + '.' + CONST.NAME_SPACE_UNIT,
                $form = that.config.$form,
                $el = getTargetEl($form, option),
                listenerSettings = that._createListenerSettings(option);

            if (!$el.size()) {
                return;
            }

            $.each(listenerSettings, function(type, funcs) {
                // IEでinput eventがfocusとblur時にも発火する為、focusとblurイベントと同時発火の場合は無視する処理を追加。
                var focusFlag = false,
                    blurFlag = false;

                $el.on(type + NAME_SPACE, function(e) {
                    var option = $el.data('validation');

                    if (focusFlag) {
                        return;
                    }

                    requestAnimationFrame(function() {
                        if (blurFlag) {
                            blurFlag = false;
                            return;
                        }
                        funcs.forEach(function(fn) {
                            fn.args = option.unit[fn.key];
                        });
                        requestAnimationFrame(function() {
                            that._validate(e, $el, funcs);
                        });
                    });
                });

                if (type === 'input') {
                    $el.on('focus' + NAME_SPACE, function(e) {
                        focusFlag = true;
                        requestAnimationFrame(function() {
                            focusFlag = false;
                        });
                    });
                    $el.on('blur' + NAME_SPACE, function(e) {
                        blurFlag = true;
                        requestAnimationFrame(function() {
                            blurFlag = false;
                        });
                    });
                }
            });

            that._createRelationSettings($el, option.relation);
        });

        /**
         * @method _registerRelation
         * @desc register relation elements event listener
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_registerRelation', function() {
            var that = this,
                CONST = that.CONST,
                NAME_SPACE = '.' + CONST.NAME_SPACE + '.' + CONST.NAME_SPACE_RELATION,
                checks = that.config.checks,
                relationElements = that.relationElements;

            $.each(relationElements, function(type, relations) {
                var checkSettings = checks[type];

                $.each(relations, function(key, relation) {
                    $.each(relation, function(role, elements) {
                        var checkSetting = checkSettings[role];
                        elements.forEach(function($el) {
                            var listenerSettings = {};

                            $el.off(NAME_SPACE);

                            checkSetting.eventtype.forEach(function(eventtype) {
                                listenerSettings[eventtype] = listenerSettings[eventtype] || [];
                                listenerSettings[eventtype].push({
                                    args: relation,
                                    listener: checkSetting.listener
                                });
                            });

                            $.each(listenerSettings, function(type, funcs) {
                                $el.on(type + NAME_SPACE, function(e) {
                                    requestAnimationFrame(function() {
                                        that._validate(e, $el, funcs);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });

        /**
         * @method _createListenerSettings
         * @desc create event listener settings
         * @param {Object} option validator option
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_createListenerSettings', function(option) {
            var checks = this.config.checks,
                listenerSettings = {},
                eventtype;

            if (option.unit) {
                $.each(option.unit, function(key) {
                    if (key === 'format') {
                        eventtype = checks[key].eventtype[option.unit[key]] || checks[key].eventtype['default'];
                    } else {
                        eventtype = checks[key].eventtype;
                    }
                    eventtype.forEach(function(type) {
                        listenerSettings[type] = listenerSettings[type] || [];
                        listenerSettings[type].push({
                            key: key,
                            listener: checks[key].listener
                        });
                    });
                });
            }

            return listenerSettings;
        });

        /**
         * @method _createRelationSettings
         * @desc create relation elements settings
         * @param {Object} $el       jQuery object of input element
         * @param {Object} relations relation options
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_createRelationSettings', function($el, relations) {
            var CONST = this.CONST,
                relationElements = this.relationElements || {};

            if (relations) {
                if (!$.isArray(relations)) {
                    relations = [relations];
                }
                relations.forEach(function(relation) {
                    var role = relation.role || CONST.DEFAULT_ROLE;
                    relationElements[relation.type] = relationElements[relation.type] || {};
                    relationElements[relation.type][relation.key] = relationElements[relation.type][relation.key] || {};
                    relationElements[relation.type][relation.key][role] = relationElements[relation.type][relation.key][role] || [];
                    relationElements[relation.type][relation.key][role].push($el);
                });
            }

            return relationElements;
        });

        /**
         * @method _validate
         * @desc validate element
         * @param {Event}  e     event object
         * @param {Object} $el   jquery object of input field
         * @param {Array}  funcs event type and event listeners
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_validate', function(e, $el, funcs) {
            var that = this,
                results = [];

            funcs.forEach(function(fn) {
                results.push(that[fn.listener](e, $el, fn.args));
            });

            $.when.apply($, results).then(function() {
              var args = Array.prototype.slice.call(arguments);
              that._validateEnd(e, $el, args);
            });
        });

        /**
         * @method _validateEnd
         * @desc callback for validate
         * @param {Event}   e       event object
         * @param {Object}  $el     jquery object of input field
         * @param {Object}  results result of validation for input field
         * @param {Boolean} silent  fire validate event or not
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_validateEnd', function(e, $el, results, silent) {
            var that = this,
                title = $el.prop('title') || $el.data('title') || '',
                errorInfo = {
                    error: false,
                    errorMessage: '',
                    targetType: 'body',
                    eventtype: e.type,
                    target: $el
                },
                relations,
                relationErrorInfo = {
                    checkType: that.CONST.CHECKTYPE_RELATION,
                    error: false,
                    errorMessage: '',
                    eventtype: e.type,
                    targetType: 'relation'
                };

            results.forEach(function(result) {
                var messageId;

                if (!errorInfo.error) {
                    if (result.error) {
                        errorInfo = $.extend(true, {}, errorInfo, result);

                        if (!result.errorMessage) {
                            messageId = result.type.toUpperCase();
                            if (result.type === 'format') {
                                messageId = messageId + '-' + result.format.toUpperCase();
                            }
                            errorInfo.errorMessage = that._getMessage(messageId, title, result.condition);
                        }

                        if (result.checkType === that.CONST.CHECKTYPE_RELATION) {
                            relationErrorInfo = $.extend(true, {}, errorInfo, result);

                            if (!result.errorMessage) {
                                relationErrorInfo.errorMessage = that._getMessage(messageId, title);
                            }
                        }
                    } else {
                        errorInfo.type = result.type;
                        errorInfo.checkType = result.checkType;
                        errorInfo.noTrigger = result.noTrigger;
                    }
                }

                if (result.checkType === that.CONST.CHECKTYPE_RELATION) {
                    relations = relationErrorInfo.relations = errorInfo.relations = result.relations;
                }
            });

            if (!errorInfo.noTrigger && !silent) {
                $el.trigger('validate', errorInfo).data('validator-result-' + errorInfo.checkType, errorInfo);

                if (relations) {
                    $.each(relations, function(key, relation) {
                        relation.forEach(function($target) {
                            if ($el !== $target) {
                                $target.trigger('validate', relationErrorInfo).data('validator-result-' + that.CONST.CHECKTYPE_RELATION, errorInfo);
                            }
                        });
                    });
                }
            }

            return errorInfo;
        });

        /**
         * @method _getMessage
         * @desc get error message
         * @param {String} id message id
         * @param {Any}    replace texts
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_getMessage', function(id) {
            var args = Array.prototype.slice.call(arguments),
                errorMessage = this.config.MESSAGES[id] || '';

            args.shift();

            args.forEach(function(replace, i) {
                errorMessage = errorMessage.replace('{' + i + '}', replace, 'g');
            });

            return errorMessage;
        });

        /**
         * @method _chkRequired
         * @desc check required field is filled in or not
         * @param {Event}   e         event object
         * @param {Object}  $el       jquery object of input field
         * @param {Boolean} condition required or not
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_chkRequired', function(e, $el, condition) {
            var dfd = $.Deferred(),
                value = $el.val(),
                result = {
                    checkType: this.CONST.CHECKTYPE_UNIT,
                    error: false,
                    type: 'required',
                    target: $el,
                    condition: true
                };

            if (condition && !value) {
                result.error = true;
            }
            dfd.resolve(result);

            return dfd.promise();
        });

        /**
         * @method _chkRequiredCheck
         * @desc check required field(checkbox) is filled in or not
         * @param {Event}  e         event object
         * @param {Object} $el       jquery object of input field
         * @param {Number} condition count of required check
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_chkRequiredCheck', function(e, $el, condition) {
            var dfd = $.Deferred(),
                count = 0,
                result = {
                    checkType: this.CONST.CHECKTYPE_UNIT,
                    error: false,
                    type: 'required-check',
                    target: $el,
                    condition: condition
                };

            if (condition === true) {
                condition = 1;
            } else if(condition === false) {
                condition = 0;
            }
            result.condition = condition;

            $el.each(function() {
                if ($(this).prop('checked')) {
                    count++;
                }
            });

            if (count < condition) {
                result.error = true;
            }
            dfd.resolve(result);

            return dfd.promise();
        });

        /**
         * @method _chklength
         * @desc check value length equals length or not
         * @param {Event}  e      event object
         * @param {Object} $el    jquery object of input field
         * @param {Number} length length for input field
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_chkLength', function(e, $el, length) {
            var dfd = $.Deferred(),
                value = $el.val(),
                result = {
                    checkType: this.CONST.CHECKTYPE_UNIT,
                    error: false,
                    type: 'length',
                    target: $el,
                    condition: length
                };

            if (length !== value.length) {
                result.error = true;
            }
            dfd.resolve(result);

            return dfd.promise();
        });

        /**
         * @method _chkMaxlength
         * @desc check value length is longer than maxlength or not
         * @param {Event}  e         event object
         * @param {Object} $el       jquery object of input field
         * @param {Number} maxlength maxlength for input field
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_chkMaxlength', function(e, $el, maxlength) {
            var dfd = $.Deferred(),
                value = $el.val(),
                result = {
                    checkType: this.CONST.CHECKTYPE_UNIT,
                    error: false,
                    type: 'maxlength',
                    target: $el,
                    condition: maxlength
                };

            if (maxlength < value.length) {
                result.error = true;
            }
            dfd.resolve(result);

            return dfd.promise();
        });

        /**
         * @method _chkMinlength
         * @desc check value length is shorter than minlength or not
         * @param {Event}  e         event object
         * @param {Object} $el       jquery object of input field
         * @param {Number} minlength minlength for input field
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_chkMinlength', function(e, $el, minlength) {
            var dfd = $.Deferred(),
                value = $el.val(),
                result = {
                    checkType: this.CONST.CHECKTYPE_UNIT,
                    error: false,
                    type: 'minlength',
                    target: $el,
                    condition: minlength
                };

            if (value.length < minlength) {
                result.error = true;
            }
            dfd.resolve(result);

            return dfd.promise();
        });

        /**
         * @method _chkMaxnum
         * @desc check value is larger than maxnum or not
         * @param {Event}  e      event object
         * @param {Object} $el    jquery object of input field
         * @param {Number} maxnum max number for input field
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_chkMaxnum', function(e, $el, maxnum) {
            var dfd = $.Deferred(),
                value = $el.val(),
                result = {
                    checkType: this.CONST.CHECKTYPE_UNIT,
                    error: false,
                    type: 'maxnum',
                    target: $el,
                    condition: maxnum
                };

            if (maxnum < parseInt(value, 10)) {
                result.error = true;
            }
            dfd.resolve(result);

            return dfd.promise();
        });

        /**
         * @method _chkMinnum
         * @desc check value is smaller than min num or not
         * @param {Event}  e      event object
         * @param {Object} $el    jquery object of input field
         * @param {Number} minnum min number for input field
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_chkMinnum', function(e, $el, minnum) {
            var dfd = $.Deferred(),
                value = $el.val(),
                result = {
                    checkType: this.CONST.CHECKTYPE_UNIT,
                    error: false,
                    type: 'minnum',
                    target: $el,
                    condition: minnum
                };

            if (parseInt(value, 10) < minnum) {
                result.error = true;
            }
            dfd.resolve(result);

            return dfd.promise();
        });

        /**
         * @method _chkFormat
         * @desc check value is match with format or not
         * @param {Event}  e          event object
         * @param {Object} $el        jquery object of input field
         * @param {String} formatType format validation type
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_chkFormat', function(e, $el, formatType) {
            var that = this,
                dfd = $.Deferred(),
                format = this.config.format[formatType],
                chkResults = [],
                result = {
                    checkType: that.CONST.CHECKTYPE_UNIT,
                    error: false,
                    type: 'format',
                    format: formatType,
                    target: $el,
                    condition: formatType
                };

            $.each(format, function(key, value) {
                switch (key) {
                    case 'regexp':
                        chkResults.push(that._chkRegexp(e, $el, that.config.regexp[value]));
                        break;

                    case 'special':
                        chkResults.push(that._chkSpecial(e, $el, value));
                        break;
                }
            });

            $.when.apply($, chkResults).then(function() {
                var args = Array.prototype.slice.call(arguments);

                args.forEach(function(chkResult) {
                    if (chkResult.error) {
                        result.error = true;
                        if (chkResult.format) {
                            result.format = chkResult.format;
                        }
                    }
                });
                dfd.resolve(result);
            });

            return dfd.promise();
        });

        /**
         * @method _chkSpecial
         * @desc special check handler
         * @param {Event}  e    event object
         * @param {Object} $el  jquery object of input field
         * @param {String} type special check type
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_chkSpecial', function(e, $el, type) {
            var that = this,
                value = $el.val(),
                dfd = $.Deferred(),
                result;

            switch (type) {
                case 'rune':
                    result = {
                        checkType: this.CONST.CHECKTYPE_UNIT,
                        error: this._chkRune(e, $el, value),
                        type: 'format',
                        format: 'rune',
                        target: $el
                    };
                    dfd.resolve(result);
                    break;

                case 'valid-date':
                    this._chkValidDate(e, $el, value).done(function(error) {
                        result = {
                            checkType: that.CONST.CHECKTYPE_UNIT,
                            error: error,
                            type: 'format',
                            format: 'valid-date',
                            target: $el
                        };
                        dfd.resolve(result);
                    });
                    break;
            }

            return dfd.promise();
        });

        /**
         * @method _chkRune
         * @desc check credit number fit to rune algorithm or not
         * @param {Event}  e      event object
         * @param {Object} $el    jquery object of input field
         * @param {String} credit credit card number
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_chkRune', function(e, $el, credit) {
            var check = 0,
                digit = 0,
                even = false,
                n,
                error = false;

            credit = credit.replace('-', '');

            if (/[^0-9-\s]+/.test(credit)) {
                error = true;
            } else {
                credit = credit.replace(/\D/g, '');
                if (credit.length !== 16) {
                    if (e.type === 'blur') {
                        error = true;
                    }
                    return error;
                }
                for (n = credit.length - 1; 0 <= n; n--) {
                    digit = parseInt(credit.charAt(n), 10);

                    if (even) {
                        if ((digit *= 2) > 9) {
                            digit -= 9;
                        }
                    }

                    check += digit;
                    even = !even;
                }

                error = check % 10 !== 0;
            }

            return error;
        });

        /**
         * @method _chkValidDate
         * @desc check date is valid or not
         * @param {Event}  e    event object
         * @param {Object} $el  jquery object of input field
         * @param {Object} $el  jquery object of input field
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_chkValidDate', function(e, $el, dateString) {
            var dfd = $.Deferred(),
                error = false;

            if (/^[0-9]{4}\/[0-9]{2}$/.test(dateString) || /^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/.test(dateString)) {
                var arrDate = dateString.split('/'),
                    y = parseInt(arrDate[0], 10),
                    m = parseInt(arrDate[1], 10),
                    d = arrDate[2] ? parseInt(arrDate[2], 10): 1,
                    date = new Date(y, m, 1),
                    lastDate = new Date(date.getTime() - 1000 * 60 * 60 * 24),
                    lastDay = lastDate.getDate();

                if (12 < m || lastDay < d) {
                    error = true;
                }
            }
            dfd.resolve(error);

            return dfd.promise();
        });

        /**
         * @method _chkRegexp
         * @desc check value is match with regexp or not
         * @param {Event}  e   event object
         * @param {Object} $el jquery object of input field
         * @param {Number} reg Regular expression string
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_chkRegexp', function(e, $el, reg) {
            var dfd = $.Deferred(),
                value = $el.val(),
                result = {
                    checkType: this.CONST.CHECKTYPE_UNIT,
                    error: false,
                    type: 'regexp',
                    target: $el,
                    condition: reg
                };

            if (value && !value.match(reg)) {
                result.error = true;
            }
            dfd.resolve(result);

            return dfd.promise();
        });

        /**
         * @method _chkCopy
         * @desc check value is forward match with target
         * @param {Event}  e      event object
         * @param {Object} $el    jquery object of input field
         * @param {String} target selector of target element
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_chkCopy', function(e, $el, target) {
            var dfd = $.Deferred(),
                value = $el.val(),
                $target = $(target),
                targetValue = $target.val(),
                targetTitle = $target.data('title') || $target.prop('title') || '',
                forwardCharacters = targetValue.substr(0, value.length),
                result = {
                    checkType: this.CONST.CHECKTYPE_UNIT,
                    error: false,
                    type: 'copy',
                    target: $el,
                    condition: $target
                };

            if (value !== forwardCharacters) {
                result.error = true;
                result.errorMessage = this._getMessage('COPY', targetTitle);
            }
            dfd.resolve(result);

            return dfd.promise();
        });

        /**
         * @method _chkSame
         * @desc check email address is same or not
         * @param {Event}  e   event object
         * @param {Object} $el jquery object of input field
         * @param {Object} relations email check target elements
         * @param {Object} relations.body[0]         email body jQuery element
         * @param {Object} relations.confirmation[0] email confirmation jQuery element
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_chkSame', function(e, $el, relations) {
            var that = this,
                dfd = $.Deferred(),
                $body = relations.body[0],
                $comfirm = relations.confirmation[0],
                bodyTitle = $body.data('title') || $body.prop('title') || '',
                result = {
                    checkType: this.CONST.CHECKTYPE_RELATION,
                    error: false,
                    type: 'same',
                    target: $el,
                    relations: relations
                },
                unitChkResult = $body.data('validator-result-' + this.CONST.CHECKTYPE_UNIT) || {};

            if (unitChkResult.error) {
                result.noTrigger = true;
                dfd.resolve(result);
            } else {
                if (e.type === 'input') {
                    this._chkCopy(e, $el, $body.get(0)).done(function(copyResult) {
                        result.error = copyResult.error;
                        result.errorMessage = that._getMessage('SAME', bodyTitle);
                        dfd.resolve(result);
                    });

                } else if (e.type === 'blur') {
                    if ($body.val() !== $comfirm.val()) {
                        result.error = true;
                        result.errorMessage = this._getMessage('SAME', bodyTitle);
                    }
                    dfd.resolve(result);
                } else {
                    dfd.resolve(result);
                }
            }


            return dfd.promise();
        });

        /**
         * @method _chkDateAround
         * @desc check email address is same or not
         * @param {Event}  e   event object
         * @param {Object} $el jquery object of input field
         * @param {Object} relations date around check target elements
         * @param {Object} relations.before[0] before date element
         * @param {Object} relations.after[0]  after date element
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_chkDateAround', function(e, $el, relations) {
            var dfd = $.Deferred(),
                $before = relations.before[0],
                $after = relations.after[0],
                beforeTitle = $before.data('title') || $before.prop('title') || '',
                afterTitle = $after.data('title') || $after.prop('title') || '',
                result = {
                    checkType: this.CONST.CHECKTYPE_RELATION,
                    error: false,
                    type: 'date-around',
                    target: $el,
                    relations: relations
                },
                beforeDate = this._string2Date($before.val()),
                afterDate = this._string2Date($after.val());

                if (afterDate.getTime() < beforeDate.getTime()) {
                    result.error = true;
                    result.errorMessage = this._getMessage('DATE-AROUND', beforeTitle, afterTitle);
                }

            dfd.resolve(result);

            return dfd.promise();
        });

        /**
         * @method _string2Date
         * @desc convert string date to Date date
         * @param {String} stringDate string date
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_string2Date', function(stringDate) {

            var number = stringDate.split('/'),
                year = parseInt(number[0], 10),
                month = parseInt((number[1] || 1), 10) - 1,
                date = parseInt((number[2] || 1), 10);

            return new Date (year, month, date);
        });

        /**
         * @method _chkCredit
         * @desc check credit number is correct or not
         * @param {Event}  e   event object
         * @param {Object} $el jquery object of input field
         * @param {Object} relations credit number check target elements
         * @param {Object} relations.first[0] first input element
         * @param {Object} relations.after[0] except first input element
         * @private
         * @memberof Validator
         */
        defineProp(Validator.prototype, '_chkCredit', function(e, $el, relations) {
            var dfd = $.Deferred(),
                creditElements = relations[this.CONST.DEFAULT_ROLE],
                invalidFlag = false,
                numbers = [],
                result = {
                    checkType: this.CONST.CHECKTYPE_RELATION,
                    error: false,
                    type: 'credit',
                    target: $el,
                    relations: relations
                };

            creditElements.forEach(function($credit) {
                var number = $credit.val();

                if (!number || number.length !== 4) {
                    invalidFlag = true;
                }
                numbers.push($credit.val());
            });

            if (!invalidFlag) {
                result.error = this._chkRune(e, $el, numbers.join(''));
            }

            dfd.resolve(result);

            return dfd.promise();
        });
    }());

    /**
     * @method external:"jQuery.fn".validator
     * @desc jquery plugin for form validation
     * @param {String}  method   method name you want to execute (only after initialization)
     * @param {Any}     anything Whatever you want (only after initialization)
     * @param {Object}  config   validation config (only before initialization)
     * @param {Array}   options  validation setting array (only before initialization)
     * @param {String}  options.name      name of form element (required) (only before initialization)
     * @param {Boolean} options.required  true or false (not required) (only before initialization)
     * @param {Number}  options.maxlength maxlength of element field (not required) (only before initialization)
     * @param {Number}  options.minlength minlength of element field (not required) (only before initialization)
     * @param {Number}  options.maxnum    max number of element field (not required) (only before initialization)
     * @param {Number}  options.mixnum    min number of element field (not required) (only before initialization)
     * @param {String}  options.format    format of element field (not required) (only before initialization)
     * @param {String}  options.relation  relation check config (not required) (only before initialization)
     * @param {String}  options.relation.type relation check type (not required) (only before initialization)
     * @param {String}  options.relation.key  relation check key (not required) (only before initialization)
     */
    $.fn.validator = function() {
        var args = Array.prototype.slice.call(arguments);

        if (typeof args[0] === 'string') {
            var $form = $(this),
                validator = $form.data('validator'),
                method,
                result;

            if (validator) {
                method = args.shift();
                result = validator[method].apply(validator, args);
            }
            return result;
        } else {
            return $(this).each(function() {
                var $form = $(this),
                    $input = $form.find('input, select, textarea'),
                    validator = $form.data('validator'),
                    config,
                    options;

                // after initialze
                if (!validator) {
                    config = args[0] || {};
                    options = args[1] || [];

                    $input.each(function() {
                        var $this = $(this),
                            validateOption = $this.data('validation');

                        if (validateOption) {
                            validateOption.name = $this.prop('name');
                            options.push(validateOption);
                        }
                    });

                    options.forEach(function(option) {
                        var $option = getTargetEl($form, option);

                        $option.data('validation', option);
                    });

                    config.$form = $form;
                    validator = new Validator(config, options);
                    $form.data('validator', validator);

                    return $form;
                }
            });
        }
    };

}.call(window, jQuery));
