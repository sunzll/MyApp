package cn.jd.dao.impl;

import cn.jd.dao.UserDao;
import cn.jd.entity.User;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;

@Repository("userDao")
public class UserDaoImpl implements UserDao{

    @Resource
    SqlSessionFactory sqlSessionFactory ;

    @Override
    public User selectOne(User user) {
        return sqlSessionFactory.openSession().selectOne("selectByNamePwd",user);
    }


}
