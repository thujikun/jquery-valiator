(function() {
    describe('test for validation with HTML data attribute settings', function() {
        var $form;
        before(function() {
            document.body.innerHTML = __html__['spec/fixtures/validator.html'];
            $form = $('[data-role=validation]');
            $form.validator();
        });
        after(function() {
            document.body.innerHTML = '';
            $form = null;
        });

        it('required check for not inputted field', function(done) {
            var $input = $form.find('input[name=required]');

            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('required check for inputted field', function(done) {
            var $input = $form.find('input[name=required2]');

            $input.val('bar');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('required(checkbox) check for not checked checkbox', function(done) {
            var validator,
                result,
                $input = $form.find('input[name=required-check]');

            validator = $form.data('validator');

            validator._chkRequiredCheck({}, $input, true).then(function(result) {
                expect(result.error).to.be(true);
                done();
            });
        });

        it('required(checkbox) check for checked checkbox', function(done) {
            var validator,
                result,
                $input = $form.find('input[name=required-check2]');

            validator = $form.data('validator');

            $input.prop('checked', true);
            validator._chkRequiredCheck({}, $input, true).then(function(result) {
                expect(result.error).to.be(false);
                done();
            });
        });

        it('multi required(checkbox) check for not checked checkbox', function(done) {
            var validator,
                result,
                $input = $form.find('input[name=required-check3]');

            validator = $form.data('validator');

            $input.eq(0).prop('checked', true);
            validator._chkRequiredCheck({}, $input, 2).then(function(result) {
                expect(result.error).to.be(true);
                done();
            });
        });

        it('multi required(checkbox) check for checked checkbox', function(done) {
            var validator,
                result,
                $input = $form.find('input[name=required-check4]');

            validator = $form.data('validator');

            $input.eq(0).prop('checked', true);
            $input.eq(1).prop('checked', true);
            validator._chkRequiredCheck({}, $input, 2).then(function(result) {
                expect(result.error).to.be(false);
                done();
            });
        });

        it('length check for inputted over length field', function(done) {
            var $input = $form.find('input[name=length]');

            $input.val('foobar');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('length check for inputted under length field', function(done) {
            var $input = $form.find('input[name=length2]');

            $input.val('foo');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('maxlength check for inputted over maxlength field', function(done) {
            var $input = $form.find('input[name=maxlength]');

            $input.val('foobar');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('maxlength check for inputted under maxlength field', function(done) {
            var $input = $form.find('input[name=maxlength2]');

            $input.val('foo');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('minlength check for inputted under minlength field', function(done) {
            var $input = $form.find('input[name=minlength]');

            $input.val('fo');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('minlength check for inputted over minlength field', function(done) {
            var $input = $form.find('input[name=minlength2]');

            $input.val('foo');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('maxnum check for inputted over maxnum field', function(done) {
            var $input = $form.find('input[name=maxnum]');

            $input.val('101');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('maxnum check for inputted under maxnum field', function(done) {
            var $input = $form.find('input[name=maxnum2]');

            $input.val('100');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('minnum check for inputted under minnum field', function(done) {
            var $input = $form.find('input[name=minnum]');

            $input.val('99');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('minnum check for inputted over minnum field', function(done) {
            var $input = $form.find('input[name=minnum2]');

            $input.val('100');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('number format check for inputted not number field', function(done) {
            var $input = $form.find('input[name=number]');

            $input.val('01234567890a');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('number format check for inputted only number field', function(done) {
            var $input = $form.find('input[name=number2]');

            $input.val('01234567890');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('half-char format check for inputted not half-char field', function(done) {
            var $input = $form.find('input[name=half-char]');

            $input.val('ＡＢＣ');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('half-char format check for inputted only half-char field', function(done) {
            var $input = $form.find('input[name=half-char2]');

            $input.val('ABC');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('half format check for inputted not half field', function(done) {
            var $input = $form.find('input[name=half]');

            $input.val('１２３');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('half format check for inputted only half field', function(done) {
            var $input = $form.find('input[name=half2]');

            $input.val('123');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('tel format check for inputted not tel field', function(done) {
            var $input = $form.find('input[name=tel]');

            $input.val('080-6770-4345');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('tel format check for inputted only tel field', function(done) {
            var $input = $form.find('input[name=tel2]');

            $input.val('08067704345');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('tel-i18n format check for inputted not tel-i18n field', function(done) {
            var $input = $form.find('input[name=tel-i18n]');

            $input.val('81+8067704345');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('tel-i18n format check for inputted only tel-i18n field', function(done) {
            var $input = $form.find('input[name=tel-i18n2]');

            $input.val('+818067704345');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('url format check for inputted not url field', function(done) {
            var $input = $form.find('input[name=url]');

            $input.val('//sample.com/path/to/index.html');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('url format check for inputted only url field', function(done) {
            var $input = $form.find('input[name=url2]');

            $input.val('http://sample.com/path/to/index.html');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('email format check for inputted not email field', function(done) {
            var $input = $form.find('input[name=email]');

            $input.val('sample@mail');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('email format check for inputted only email field', function(done) {
            var $input = $form.find('input[name=email2]');

            $input.val('sample@mail.com');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('full-kana format check for inputted not full-kana field', function(done) {
            var $input = $form.find('input[name=full-kana]');

            $input.val('あいうえお');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('full-kana format check for inputted only full-kana field', function(done) {
            var $input = $form.find('input[name=full-kana2]');

            $input.val('アイウエオ');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('full-char format check for inputted not full-char field', function(done) {
            var $input = $form.find('input[name=full-char]');

            $input.val('あのイーハトーヴォのすきとおった風123');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('full-char format check for inputted only full-char field', function(done) {
            var $input = $form.find('input[name=full-char2]');

            $input.val('あのイーハトーヴォのすきとおった風');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('date format check for inputted not date format field', function(done) {
            var $input = $form.find('input[name=date]');

            $input.val('20140820');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('date format check for inputted only date format field', function(done) {
            var $input = $form.find('input[name=date2]');

            $input.val('2014/08/20');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('dateYM format check for inputted not dateYM format field', function(done) {
            var $input = $form.find('input[name=dateYM]');

            $input.val('201408');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('dateYM format check for inputted only dateYM format field', function(done) {
            var $input = $form.find('input[name=dateYM2]');

            $input.val('2014/08');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('credit format check for inputted not credit format field', function(done) {
            var $input = $form.find('input[name=credit]');

            $input.val('4111111111111112');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('credit format check for inputted credit format field', function(done) {
            var $input = $form.find('input[name=credit2]');

            $input.val('4111111111111111');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('regexp format check for inputted not regexp field', function(done) {
            var $input = $form.find('input[name=regexp]');

            $input.val('b');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('regexp format check for inputted only regexp field', function(done) {
            var $input = $form.find('input[name=regexp2]');

            $input.val('a');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('mail relation check for inputted different address fields on mailbody element', function(done) {
            var $body = $form.find('input[name=relation-mail-body]');

            $body.val('ryosuke.tsuji@mail.rakuten.com');
            $body.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $body.blur();
        });

        it('mail relation check for inputted same address fields on mailbody element', function(done) {
            var $body = $form.find('input[name=relation-mail-body2]'),
                $confirm = $form.find('input[name=relation-mail-confirmation2]');

            $body.val('ryosuke.tsuji@mail.rakuten.com');
            $confirm.val('ryosuke.tsuji@mail.rakuten.com');
            $body.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $body.blur();
        });

        it('mail relation check for inputted different address fields on confirm element', function(done) {
            var $confirm = $form.find('input[name=relation-mail-confirmation3]');

            $confirm.val('ryosuke.tsuji@mail.rakuten.com');
            $confirm.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $confirm.blur();
        });

        it('mail relation check for inputted same address fields on confirm element', function(done) {
            var $body = $form.find('input[name=relation-mail-body4]'),
                $confirm = $form.find('input[name=relation-mail-confirmation4]');

            $body.val('ryosuke.tsuji@mail.rakuten.com');
            $confirm.val('ryosuke.tsuji@mail.rakuten.com');
            $confirm.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $confirm.blur();
        });

        it('date around check for inputted latter date in before than after', function(done) {
            var $before = $form.find('input[name=date-around-before]'),
                $after = $form.find('input[name=date-around-after]');

            $before.val('2014/04/08');
            $after.val('2014/04/07');
            $before.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $before.blur();
        });

        it('date around check for inputted latter date in before than after', function(done) {
            var $before = $form.find('input[name=date-around-before2]'),
                $after = $form.find('input[name=date-around-after2]');

            $before.val('2014/04/07');
            $after.val('2014/04/08');
            $before.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $before.blur();
        });

        it('date around check for inputted latter date in before than after', function(done) {
            var $before = $form.find('input[name=date-around-before]'),
                $after = $form.find('input[name=date-around-after]');

            $before.val('2014/04/08');
            $after.val('2014/04/07');
            $after.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $before.blur();
        });

        it('date around check for inputted latter date in before than after', function(done) {
            var $before = $form.find('input[name=date-around-before2]'),
                $after = $form.find('input[name=date-around-after2]');

            $before.val('2014/04/07');
            $after.val('2014/04/08');
            $after.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $before.blur();
        });

        it('date around check for inputted latter date in before than after', function(done) {
            var $before = $form.find('input[name=date-around-before]'),
                $after = $form.find('input[name=date-around-after]');

            $before.val('2014/04/08');
            $after.val('2014/04/07');
            $before.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $after.blur();
        });

        it('date around check for inputted latter date in before than after', function(done) {
            var $before = $form.find('input[name=date-around-before2]'),
                $after = $form.find('input[name=date-around-after2]');

            $before.val('2014/04/07');
            $after.val('2014/04/08');
            $before.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $after.blur();
        });

        it('date around check for inputted latter date in before than after', function(done) {
            var $before = $form.find('input[name=date-around-before]'),
                $after = $form.find('input[name=date-around-after]');

            $before.val('2014/04/08');
            $after.val('2014/04/07');
            $after.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $after.blur();
        });

        it('date around check for inputted latter date in before than after', function(done) {
            var $before = $form.find('input[name=date-around-before2]'),
                $after = $form.find('input[name=date-around-after2]');

            $before.val('2014/04/07');
            $after.val('2014/04/08');
            $after.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $after.blur();
        });

    });

    describe('test for validation with json settings', function() {
        var $form,
            validatorOptions = __fixtures__['spec/fixtures/validator'];

        before(function() {
            document.body.innerHTML = __html__['spec/fixtures/validator-json.html'];
            $form = $('[data-role=validation]');
            $form.validator({}, validatorOptions);
        });
        after(function() {
            document.body.innerHTML = '';
            $form = null;
        });

        it('required check for not inputted field', function(done) {
            var $input = $form.find('input[name=required]');

            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('required check for inputted field', function(done) {
            var $input = $form.find('input[name=required2]');

            $input.val('bar');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('required(checkbox) check for not checked checkbox', function(done) {
            var validator,
                result,
                $input = $form.find('input[name=required-check]');

            validator = $form.data('validator');

            validator._chkRequiredCheck({}, $input, true).then(function(result) {
                expect(result.error).to.be(true);
                done();
            });
        });

        it('required(checkbox) check for checked checkbox', function(done) {
            var validator,
                result,
                $input = $form.find('input[name=required-check2]');

            validator = $form.data('validator');

            $input.eq(0).prop('checked', true);
            validator._chkRequiredCheck({}, $input, true).then(function(result) {
                expect(result.error).to.be(false);
                done();
            });
        });

        it('multi required(checkbox) check for not checked checkbox', function(done) {
            var validator,
                result,
                $input = $form.find('input[name=required-check3]');

            validator = $form.data('validator');

            $input.eq(0).prop('checked', true);
            validator._chkRequiredCheck({}, $input, 2).then(function(result) {
                expect(result.error).to.be(true);
                done();
            });
        });

        it('multi required(checkbox) check for checked checkbox', function(done) {
            var validator,
                result,
                $input = $form.find('input[name=required-check4]');

            validator = $form.data('validator');

            $input.eq(0).prop('checked', true);
            $input.eq(1).prop('checked', true);
            validator._chkRequiredCheck({}, $input, 2).then(function(result) {
                expect(result.error).to.be(false);
                done();
            });
        });

        it('length check for inputted over length field', function(done) {
            var $input = $form.find('input[name=length]');

            $input.val('foobar');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('length check for inputted under length field', function(done) {
            var $input = $form.find('input[name=length2]');

            $input.val('foo');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('maxlength check for inputted over maxlength field', function(done) {
            var $input = $form.find('input[name=maxlength]');

            $input.val('foobar');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('maxlength check for inputted under maxlength field', function(done) {
            var $input = $form.find('input[name=maxlength2]');

            $input.val('foo');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('minlength check for inputted under minlength field', function(done) {
            var $input = $form.find('input[name=minlength]');

            $input.val('fo');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('minlength check for inputted over minlength field', function(done) {
            var $input = $form.find('input[name=minlength2]');

            $input.val('foo');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('maxnum check for inputted over maxnum field', function(done) {
            var $input = $form.find('input[name=maxnum]');

            $input.val('101');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('maxnum check for inputted under maxnum field', function(done) {
            var $input = $form.find('input[name=maxnum2]');

            $input.val('100');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('minnum check for inputted under minnum field', function(done) {
            var $input = $form.find('input[name=minnum]');

            $input.val('99');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('minnum check for inputted over minnum field', function(done) {
            var $input = $form.find('input[name=minnum2]');

            $input.val('100');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('number format check for inputted not number field', function(done) {
            var $input = $form.find('input[name=number]');

            $input.val('01234567890a');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('number format check for inputted only number field', function(done) {
            var $input = $form.find('input[name=number2]');

            $input.val('01234567890');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('half-char format check for inputted not half-char field', function(done) {
            var $input = $form.find('input[name=half-char]');

            $input.val('ＡＢＣ');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('half-char format check for inputted only half-char field', function(done) {
            var $input = $form.find('input[name=half-char2]');

            $input.val('ABC');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('half format check for inputted not half field', function(done) {
            var $input = $form.find('input[name=half]');

            $input.val('１２３');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('half format check for inputted only half field', function(done) {
            var $input = $form.find('input[name=half2]');

            $input.val('123');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('tel format check for inputted not tel field', function(done) {
            var $input = $form.find('input[name=tel]');

            $input.val('080-6770-4345');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('tel format check for inputted only tel field', function(done) {
            var $input = $form.find('input[name=tel2]');

            $input.val('08067704345');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('tel-i18n format check for inputted not tel-i18n field', function(done) {
            var $input = $form.find('input[name=tel-i18n]');

            $input.val('81+08067704345');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('tel-i18n format check for inputted only tel-i18n field', function(done) {
            var $input = $form.find('input[name=tel-i18n2]');

            $input.val('+8108067704345');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('url format check for inputted not url field', function(done) {
            var $input = $form.find('input[name=url]');

            $input.val('//sample.com/path/to/index.html');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('url format check for inputted only url field', function(done) {
            var $input = $form.find('input[name=url2]');

            $input.val('http://sample.com/path/to/index.html');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('email format check for inputted not email field', function(done) {
            var $input = $form.find('input[name=email]');

            $input.val('sample@mail');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('email format check for inputted only email field', function(done) {
            var $input = $form.find('input[name=email2]');

            $input.val('sample@mail.com');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('full-kana format check for inputted not full-kana field', function(done) {
            var $input = $form.find('input[name=full-kana]');

            $input.val('あいうえお');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('full-kana format check for inputted only full-kana field', function(done) {
            var $input = $form.find('input[name=full-kana2]');

            $input.val('アイウエオ');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('full-char format check for inputted not full-char field', function(done) {
            var $input = $form.find('input[name=full-char]');

            $input.val('あのイーハトーヴォのすきとおった風123');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('full-char format check for inputted only full-char field', function(done) {
            var $input = $form.find('input[name=full-char2]');

            $input.val('あのイーハトーヴォのすきとおった風');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('date format check for inputted not date format field', function(done) {
            var $input = $form.find('input[name=date]');

            $input.val('20140820');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('date format check for inputted only date format field', function(done) {
            var $input = $form.find('input[name=date2]');

            $input.val('2014/08/21');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('dateYM format check for inputted not dateYM format field', function(done) {
            var $input = $form.find('input[name=dateYM]');

            $input.val('201408');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('dateYM format check for inputted only dateYM format field', function(done) {
            var $input = $form.find('input[name=dateYM2]');

            $input.val('2014/08');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('credit format check for inputted not credit format field', function(done) {
            var $input = $form.find('input[name=credit]');

            $input.val('4111111111111112');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('credit format check for inputted credit format field', function(done) {
            var $input = $form.find('input[name=credit2]');

            $input.val('4111111111111111');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('regexp format check for inputted not regexp field', function(done) {
            var $input = $form.find('input[name=regexp]');

            $input.val('b');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $input.blur();
        });

        it('regexp format check for inputted only regexp field', function(done) {
            var $input = $form.find('input[name=regexp2]');

            $input.val('a');
            $input.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $input.blur();
        });

        it('mail relation check for inputted different address fields on mailbody element', function(done) {
            var $body = $form.find('input[name=relation-mail-body]');

            $body.val('ryosuke.tsuji@mail.rakuten.com');
            $body.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $body.blur();
        });

        it('mail relation check for inputted same address fields on mailbody element', function(done) {
            var $body = $form.find('input[name=relation-mail-body2]'),
                $confirm = $form.find('input[name=relation-mail-confirmation2]');

            $body.val('ryosuke.tsuji@mail.rakuten.com');
            $confirm.val('ryosuke.tsuji@mail.rakuten.com');
            $body.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $body.blur();
        });

        it('mail relation check for inputted different address fields on confirm element', function(done) {
            var $confirm = $form.find('input[name=relation-mail-confirmation3]');

            $confirm.val('ryosuke.tsuji@mail.rakuten.com');
            $confirm.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $confirm.blur();
        });

        it('mail relation check for inputted same address fields on confirm element', function(done) {
            var $body = $form.find('input[name=relation-mail-body4]'),
                $confirm = $form.find('input[name=relation-mail-confirmation4]');

            $body.val('ryosuke.tsuji@mail.rakuten.com');
            $confirm.val('ryosuke.tsuji@mail.rakuten.com');
            $confirm.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $confirm.blur();
        });

        it('date around check for inputted latter date in before than after', function(done) {
            var $before = $form.find('input[name=date-around-before]'),
                $after = $form.find('input[name=date-around-after]');

            $before.val('2014/04/08');
            $after.val('2014/04/07');
            $before.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $before.blur();
        });

        it('date around check for inputted latter date in before than after', function(done) {
            var $before = $form.find('input[name=date-around-before2]'),
                $after = $form.find('input[name=date-around-after2]');

            $before.val('2014/04/07');
            $after.val('2014/04/08');
            $before.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $before.blur();
        });

        it('date around check for inputted latter date in before than after', function(done) {
            var $before = $form.find('input[name=date-around-before]'),
                $after = $form.find('input[name=date-around-after]');

            $before.val('2014/04/08');
            $after.val('2014/04/07');
            $after.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $before.blur();
        });

        it('date around check for inputted latter date in before than after', function(done) {
            var $before = $form.find('input[name=date-around-before2]'),
                $after = $form.find('input[name=date-around-after2]');

            $before.val('2014/04/07');
            $after.val('2014/04/08');
            $after.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $before.blur();
        });

        it('date around check for inputted latter date in before than after', function(done) {
            var $before = $form.find('input[name=date-around-before]'),
                $after = $form.find('input[name=date-around-after]');

            $before.val('2014/04/08');
            $after.val('2014/04/07');
            $before.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $after.blur();
        });

        it('date around check for inputted latter date in before than after', function(done) {
            var $before = $form.find('input[name=date-around-before2]'),
                $after = $form.find('input[name=date-around-after2]');

            $before.val('2014/04/07');
            $after.val('2014/04/08');
            $before.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $after.blur();
        });

        it('date around check for inputted latter date in before than after', function(done) {
            var $before = $form.find('input[name=date-around-before]'),
                $after = $form.find('input[name=date-around-after]');

            $before.val('2014/04/08');
            $after.val('2014/04/07');
            $after.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $after.blur();
        });

        it('date around check for inputted latter date in before than after', function(done) {
            var $before = $form.find('input[name=date-around-before2]'),
                $after = $form.find('input[name=date-around-after2]');

            $before.val('2014/04/07');
            $after.val('2014/04/08');
            $after.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $after.blur();
        });

        it('credit card number check for invalid number on multi field', function(done) {
            var $credit1 = $form.find('input[name=credit-relation1-1]'),
                $credit2 = $form.find('input[name=credit-relation1-2]'),
                $credit3 = $form.find('input[name=credit-relation1-3]'),
                $credit4 = $form.find('input[name=credit-relation1-4]');

            $credit1.val('4111');
            $credit2.val('1111');
            $credit3.val('1111');
            $credit4.val('1112');
            $credit1.on('validate', function(e, result) {
                expect(result.error).to.be(true);
                done();
            });
            $credit1.blur();
        });

        it('credit card number check for valid number on multi field', function(done) {
            var $credit1 = $form.find('input[name=credit-relation2-1]'),
                $credit2 = $form.find('input[name=credit-relation2-2]'),
                $credit3 = $form.find('input[name=credit-relation2-3]'),
                $credit4 = $form.find('input[name=credit-relation2-4]');

            $credit1.val('4111');
            $credit2.val('1111');
            $credit3.val('1111');
            $credit4.val('1111');
            $credit1.on('validate', function(e, result) {
                expect(result.error).to.be(false);
                done();
            });
            $credit1.blur();
        });
    });

}.call(window));
