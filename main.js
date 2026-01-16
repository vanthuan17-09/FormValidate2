function Validator(formSelector, options) {
    //gan gia tri mac dinh cho tham so khi dinh nghia
    if(!options) {
        options = {};
    }
    function getParent(element, selector) {
        while(element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var formRules = {};

    /*
    * Quy uoc tao rules
    * - Neu co loi thi Return lai error message
    * - Neu khong co loi thi Return Undefined
    */
    var validatorRules = {
        required: function(value) {
            return value ? undefined : 'Vui lòng nhập trường này';
        },

        email: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập email';
        },

        min: function(min) {
           return function(value) {
                return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
            }
        },
    }

    //Lấy ra form element trong DOM theo `formSelector`
    var formElement = document.querySelector(formSelector);
    // Chỉ xử lí khi có element trong DOM
    if(formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]');
        for(var input of inputs){
            var rules = input.getAttribute('rules').split('|');
            for(var rule of rules){
                var ruleInfo;
                var isRuleHasValue = rule.includes(':');
                if(isRuleHasValue) {
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                    validatorRules[rule](ruleInfo[1])
                }
                var ruleFunc =  validatorRules[rule];
                if(isRuleHasValue) {
                    ruleFunc = ruleFunc();
                }
                if(Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                }
                else{
                    formRules[input.name] = [ruleFunc];
                }
            }
            //lang nghe cac su kien(blur,change...)
            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }
        //Ham thuc hien validate
        function handleValidate(event) {
            var rules = formRules[event.target.name];
            var errorMessage ;
            rules.some(function(rule) {
                errorMessage =  rule(event.target.value);
                return errorMessage;
            });

            //Neu co loi thi hien thi message loi ra UI
            if(errorMessage) {
                var formGroup = getParent(event.target, '.form-group');
                if(formGroup) {
                    formGroup.classList.add('invalid');
                    var formMessage = formGroup.querySelector('.form-message');
                    if(formMessage) {
                        formMessage.innerText = errorMessage;
                    }
                }
            }
            return !errorMessage;
        }

        //Ham thuc hien clear message loi
        function handleClearError(event) {
            var formGroup = getParent(event.target, '.form-group');
            if(formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid');

                var formMessage = formGroup.querySelector('.form-message');
                    if(formMessage) {
                        formMessage.innerText = '';
                    }
            }
        }
        
    }
// console.log(formRules)
//xu li hanh vi submit form
formElement.onsubmit = function(event) {
    event.preventDefault();

    var inputs = formElement.querySelectorAll('[name][rules]');
    var isValid = true;
        for(var input of inputs){
           if(!handleValidate({target: input})) {
                isValid = false;
           }
    }

    //KHi khong co loi thi submit form
    if(isValid) {
       if(typeof options.onsubmit === 'function') {
        var EnableInput = formElement.querySelectorAll('[name]:not([disable])');
                    var formValue = Array.from(EnableInput).reduce(function (values, input) {
                        
                        switch(input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' +input.name + '"]:checked').value;
                                break;
                            case 'checkbox':
                                if(!input.matches(':checked')){
                                    values[input.name] = '';
                                    return values;
                                }
                                if(!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return values;
              }, {});
              //goi lai ham onsubmit va tra ve gia tri cua form
            options.onsubmit(formValue);
       }
       else{
        formElement.submit();
       }
    }
}

}