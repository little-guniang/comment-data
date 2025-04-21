var API = (function () {
    const URL = 'https://study.duyiedu.com'
    const TOKEN_KEY = 'token'

    function get(path)
    {
        const token=localStorage.getItem(TOKEN_KEY);

        const headers={};
        if(token){
            headers.authorization=`Bearer ${token}`;
        }

        return fetch(URL + path, {
            headers
        });
    }

    function post(path,objBody){
        const headers={
            'Content-Type': 'application/json',
        }

        const token=localStorage.getItem(TOKEN_KEY);
        if(token){
            headers.authorization=`Bearer ${token}`;
        }

        return fetch(URL + path, {
            method:'POST',
            headers,
            body:JSON.stringify(objBody)
        });
    }

    // 注册
    async function reg(userIndo) {
        return await post('/api/user/reg',userIndo)
        .then(result => result.json());
    }

    // 登录
    async function login(loginInfo) {
        const response = await post('/api/user/login',loginInfo)
        const result = await response.json();
        if (result.code == 0) {
            // 获取令牌
            const token = response.headers.get('authorization');
            localStorage.setItem('token', token);
        }

        return result;

    }


    // 验证  API.exits("求求")
    async function exits(loginId) {
        const response=await get('/api/user/exists?loginId='+loginId);
        return await response.json();
    }


    // 输出当前登入的用户信息
    async function profile() {
        const response= await get('/api/user/profile');
        return await response.json();
     }


    // 发送聊天消息
    async function sendChat(content) { 
        const response=await post('/api/chat',{content});
        return await response.json();
    }

    // 获取聊天记录
    async function getHisory() {
        const response=await get('/api/chat/history');
        return await response.json();
        
     }
     function logout() {
        localStorage.removeItem(TOKEN_KEY);
     }

     return {
        reg,
        login,
        exits,
        profile,
        sendChat,
        getHisory,
        logout
     }

})();

// 我有点迷糊，什么时候获取令牌，什么时候设置令牌?
/**
 * 关键区别总结：
操作	时机	目的
获取令牌	登录成功或令牌刷新时	从服务器拿到合法令牌。
设置令牌	发送需要认证的请求时	让客户端在请求中携带令牌以通过验证。
常见流程：
用户登录 → 客户端获取令牌（从服务器）。

保存令牌 → 存到本地（如 localStorage）。

访问受保护接口 → 设置令牌到请求头。

令牌过期 → 重新获取令牌（通过刷新令牌或重新登录）。
 */