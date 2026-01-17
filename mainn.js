// Ham cha chon form can validator
//truyen vao form
function Validator(formSelector) {
    //tạo biến formrules để lưu các rules trong input vào form
    var formRules = {};

    //Quy ước tạo hàm kiểm tra rule
    // 1.nếu có lỗi thì return message lỗi
    // 2. Nếu không có lỗi thì return Undefined
    var validatorRules = {
        required: function(value) {
            return value ? undefined : 'Vui lòng nhập trường này';
        },

        email: function(value) {
            var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập email';
        },

        min: function(min) {
            return function(value) {
                return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
        }

    }
    //Lấy ra thẻ cha trong form
    var formParent = document.querySelector(formSelector);
    //Kiểm tra xem có form cha thì mới chạy tiếp
    if(formParent) {
        console.log('Form cha hiện có trong dom,bắt đầu thực hiện...');
        var inputs = formParent.querySelectorAll('[name][rules]');
        // lặp qua mảng inputs và đưa các giá trị thành key:value vào mảng formRules
        for(var input of inputs) {
            var rules = input.getAttribute('rules').split('|');
            for(var rule of rules) {
                if(rule.includes(':')) {
                    var ruleInfo = rule.split(':');
                    //Gán rule = min(vì ruleInfo[0] = min)
                    rule = ruleInfo[0];
                    //ruleInfo[1] sẽ bằng 6 kí tự
                }

                console.log(rule)
            }
              
        }
        //formRules[input.name] = rules;
        console.log('cuoi cung',formRules);
    }
    else{
        console.log("Tên form truyền vào không chính xác")
    }
}đ