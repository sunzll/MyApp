package cn.jd.test;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class MyBatisTest {
    public static void main(String[] args) {
        String resource = "mybatis.cfg.xml";
        Reader reader = null;
        try {
            reader = Resources.getResourceAsReader(resource);
        } catch (IOException e) {
            e.printStackTrace();
        }
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(reader);
//        SqlSession sqlSession = sqlSessionFactory.openSession();
//        List<Dept> list = sqlSession.selectList("dept.getAllDepts");
//        for (Dept u : list) {
//            System.out.println(u);
//        }
        int delete = sqlSessionFactory.openSession().selectOne("dept.getNextId");
        System.out.println(delete);

    }

    private void asd() {
        List list = new ArrayList();
        List list2 = new LinkedList();
    }
}
