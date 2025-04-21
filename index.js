(async function () {
    // 检查登录信息，是否登录
    const resp = await API.profile();
    const user = resp.data;
    // 如果登录不成功
    if (!user) {
        alert("登录异常，请重新登陆");
        location.href = './a.html';
        return;
    }

    // 如果登录成功
    const Doms = {
        aside: {
            nickname: $('#nickname'),
            loginId: $('#loginId')
        },
        close: $(".logout"),
        container: $('.chat-messages'),
        txtMsg:$("#user-input"),
        sendButton:$("#send-button")
    }
    setUserInfo();

    // 设置用户信息
    function setUserInfo() {
        // 必须是innerText，防止注入攻击
        Doms.aside.nickname.innerText = user.nickname;
        Doms.aside.loginId.innerText = user.loginId;
    }

    // 点击按钮X，退出账号
    Doms.close.onclick = function () {
        API.logout();
        location.href = "./a.html";
    }

    // 加载历史记录
    await loadHistory();
    async function loadHistory(){
        const result = await API.getHisory();
        // 然后将聊天记录添加到界面
        for (var i = 0; i < result.data.length; i++) {
            // 同步操作（例如直接操作DOM）不需要await,否则降低性能。
            addChat(result.data[i]);
        }
        scroButtom();
    }

    Doms.sendButton.onclick=function(){
        sendChat();
    }

    // 用户发送信息给服务器
    async function sendChat()
    {
        // 1.获得发送框的信息
        const txt=Doms.txtMsg.value.trim();
        if(!txt)
        {
            return;
        }
        // 2.将发送信息添加到界面
        addChat({
            from:user.loginId,
            to:null,
            createdAt:Date.now(),
            content:txt
        })
        // 2.2 清除输入框
        Doms.txtMsg.value="";
        scroButtom();

        // 3.信息发送给API.sendChat
        const result=await API.sendChat(txt);
        // 4.然后将回复添加到界面
        addChat({
            from:null,
            to:user.loginId,
            createdAt:result.data.createdAt,
            content:result.data.content
        })
        scroButtom();
    }

    // 将聊天记录添加到界面
    async function addChat(chatInfo) {
        // 1.创建消息小容器div
        div = $$$('div');

        // 1.1.判断是谁发出的(如果from有值就是用户发出的),添加class
        if (chatInfo.from) {
            div.className = "message user";
        } else {
            div.className = "message bot";
        }

        // 2.创建头像img
        const img = $$$('img');
        img.className = "message-avatar";
        img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot.png";

        // 3.创建消息div
        const content = $$$('div');
        content.className = "message-content";
        content.innerText = chatInfo.content;

        // 4.创建时间div
        const time = $$$('div');
        time.className = "message-date";
        time.innerText = formData(chatInfo.createdAt);

        // 层次添加
        div.appendChild(img);
        div.appendChild(content);
        div.appendChild(time);

        Doms.container.appendChild(div)
    }
    function formData(createtime) {
        // 确保 createtime 是数字（即使是字符串形式的数字）
        const timestamp = Number(createtime);

        if (isNaN(timestamp)) {
            throw new Error("Invalid timestamp: must be a number");
        }

        const date = new Date(timestamp);

        if (isNaN(date.getTime())) {
            throw new Error("Invalid date: timestamp out of range");
        }

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`
    }


    // 滚动到底部函数
    function scroButtom(){
        Doms.container.scrollTop=Doms.container.scrollHeight;
    }


})();