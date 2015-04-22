validator
=======================

Introduction
-----------------
This plugin enables to validate input element easily.

Usage
-----------------
1. HTML parameter pattern

````
<form name="input-form" method="post" action="/" formnovalidate="formnovalidate" data-role="validation">
    <input type="text" name="email" title="email" data-validation='{"unit":{"required": true, "format":"email"}, "relation": [{"type": email, "key": "email", "role": "body"}]}'>
    <input type="text" name="email2" title="email2" data-validation='{"unit":{"required": true, "format":"email"}, "relation": [{"type": email, "key": "email", "role": "confirmation"}]}'>
</form>
````

2. javascript option pattern

````
<form name="input-form" method="post" action="/" formnovalidate="formnovalidate" data-role="validation">
    <input type="text" name="email" title="email">
    <input type="text" name="email2" title="email2">
</form>
````

````
var $form = $('[data-role=validation]');
$form.validator({}, [
    {
        "name": "email",
        "unit": {
            "required": true,
            "format": "email"
        },
        "relation": [
            {
                "type": "email",
                "key": "email",
                "role": "body"
            }
        ]
    },
    {
        "name": "email2",
        "unit": {
            "required": true,
            "format": "email"
        },
        "relation": [
            {
                "type": "email",
                "key": "email",
                "role": "confirmation"
            }
        ]
    }
);
````

Links
-----------------

Requirements
-----------------
jQuery-.1.7.2+

Compatibility
-----------------
* Internet Explorer 10+
* Firefox
* Chrome
* Safari
* Mobile Safari
* Android browser
* Android Chrome

※ We support only latest version of Firefox/Chrome/Safari
