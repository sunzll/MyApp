package cn.jd.service.impl;

import cn.jd.dao.UserDao;
import cn.jd.service.UserService;
import cn.jd.entity.User;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service("userService")
public class UserServiceImpl implements UserService {
    @Resource
    UserDao userDao;

    @Override
    public boolean hasUser(User user) {
        return userDao.selectOne(user)==null?false:true;
    }

}
