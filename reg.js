
const signupform = document.querySelector('.signupform');

signupform.onsubmit = async function (e) {
    e.preventDefault();
    const result = await FieldValidator.validate2(
        UsernameInstance,
        EmailInstance,
        passwordInstance,
        password2Instance
    );
    if(!result)
    {
        return ;
    }
    data = {
        loginId: UsernameInstance.input.value,
        loginPwd: passwordInstance.input.value,
        nickname:EmailInstance.input.value
    }
    const apiresult =await API.reg(data);
    // 如果注册成功,跳转到登录页面
    if(apiresult.code==0){
        signup.classList.toggle('nodisplay');
        signin.classList.toggle('nodisplay');
    }

    // const formData = new FormData(signinform);
    // console.log([...formData.entries()]);
}

