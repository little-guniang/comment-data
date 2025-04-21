/**
 * 字段验证器:对某一个表单项进行验证。单独检查用户输入的某一项数据是否符合预设规则或要求
 * FieldValidator 类的职责是管理一个表单项的验证，包括：
        获取DOM元素（输入框和错误提示区域）。
        绑定必要的事件监听（如 blur）。
        提供验证方法。
 */
class FieldValidator
{
    constructor(txtId,validatorFunc){
        this.input=$('#'+txtId);
        this.validatorFunc=validatorFunc;
        this.p=this.input.nextElementSibling;
        this.input.onblur=()=>{this.validate();};//this指向实例
        
    }
    /**
     * 执行验证操作.
     * 如果有错误则显示错误消息（返回false），无错误则清空消息(返回true)
     */
    async validate(){
       const err=await this.validatorFunc(this.input.value);
       if(err){
        this.p.innerText=err;
        return false;
       }
       else{
        this.p.innerText='';
        return true;
       }
    }

    /**
     * 参数是本身类的实例用static
     * 对传入的所有验证器实例进行统一的验证(使用validate)，所有实例验证都通过返回true，否则false。
     */
    static async validate2(...validators){//剩余参数语法：将函数接收到的所有参数收集到一个数组中
        
        const proms=validators.map(Y=>Y.validate());
        const results=await Promise.all(proms);
        return results.every(r=>r);
    }
}
// 创建用户名输入框的验证器实例
var UsernameInstance=new FieldValidator('UsernameId',async function(val){
    if(!val){
        return '请填写用户名';
    }
    const k=await API.exits(val);//await一定要写
    if(k.data){
        return '该用户已存在，请填写其他用户名';
    }
});

var EmailInstance=new FieldValidator('EmailId',function(val){
    if(!val){
        return '请填写邮箱';
    }
    else if(!val.endsWith('.com') || !val.includes('@')){
        return '邮箱格式错误';
    }
});
var passwordInstance=new FieldValidator('passwordId',function(val){
    if(!val){
        return '请填写密码';
    }
});
var password2Instance=new FieldValidator('password2Id',function(val){
    if(!val){
        return '请填写密码';
    }
    if ($('#passwordId').value!=val){
        return '密码不一致';
    }
});

var SigninUserInstance=new FieldValidator('SigninUsernameId',function(val){
    if(!val){
        return '请填写用户名';
    }
});

var SigninpwdInstance=new FieldValidator('SigninpasswordId',function(val){
    if(!val){
        return '请填写密码';
    }
});

