package cn.jd.controller;

import cn.jd.service.UserService;
import entity.User;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

/**
 *
 */
public class LoginNoAnno implements Controller {
    UserService userService ;
    @Override
    public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
        String userName = request.getParameter("userName");
        String password = request.getParameter("password");
        System.out.println(userName+"    "+password);
        response.setCharacterEncoding("utf-8");
        boolean b = userService.hasUser(new User(userName, password));
        String result="";
        if(b){
            result="{success:true,msg:\"登录成功!\"}";
        }else{
            result="{success:false,msg:\"账号或密码错误!\"}";
        }
        PrintWriter out = response.getWriter();
        out.write(result);
        return null;
    }

    public void setUserService(UserService userService) {
        this.userService = userService;
    }
}
