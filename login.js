
const signinform = document.querySelector('.signinform');


signinform.onsubmit = async function (e) {
    e.preventDefault();
    const result = await FieldValidator.validate2(
        SigninUserInstance,
        SigninpwdInstance
    );
    if (!result) {
        return;
    }
    // const formData = new FormData(signinform);
    // console.log([...formData.entries()]);
    data = {
        loginId: SigninUserInstance.input.value,
        loginPwd: SigninpwdInstance.input.value
    }
    const j = await API.login(data);
    if(j.code==0){
        alert("登录成功,点击确认，进入首页");
        location.href='./b.html';
    }else{
        alert("登陆失败，账号异常");
    }
}