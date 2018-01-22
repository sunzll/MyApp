package cn.jd.controller;

import cn.jd.service.UserService;
import cn.jd.entity.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

@Controller("login")
@RequestMapping("/user")
public class Login {
    @Resource
    UserService userService;

    @RequestMapping(value = "/login.do",produces = "application/json;charset=utf-8")
    @ResponseBody
    public String login(User user){
        System.out.println(user);
        boolean b=userService.hasUser(user);
        String result="";
        if(b){
            result="{success:true,msg:\"登录成功!\"}";
        }else{
            result="{success:false,msg:\"账号或密码错误!\"}";
        }
        return result;
    }


}
