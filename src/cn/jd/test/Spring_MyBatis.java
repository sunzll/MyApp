package cn.jd.test;

import net.sf.json.JSONArray;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Spring_MyBatis {
    public static void main(String[] args) {
        ClassPathXmlApplicationContext classPathXmlApplicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
        SqlSessionFactory sqlSessionFactory = (SqlSessionFactory) classPathXmlApplicationContext.getBean("sqlSessionFactory");
        SqlSession sqlSession = sqlSessionFactory.openSession();

        Object o = sqlSession.selectList("province.getAllProAndCityAndArea", 2);
        JSONArray jsonArray = JSONArray.fromObject(o);
        System.out.println(jsonArray.toString());

    }
}
