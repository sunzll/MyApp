package cn.jd.dao.impl;

import cn.jd.dao.EmpDao;
import cn.jd.entity.Emp;
import cn.jd.util.Cond;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.List;

@Repository("empDao")
public class EmpDaoImpl implements EmpDao{

    @Resource
    SqlSessionFactory sqlSessionFactory ;

    @Override
    public List<Emp> getAllEmps() {
        return sqlSessionFactory.openSession().selectList("emp.getAllEmps");
    }



    @Override
    public int addEmp(Emp emp) {
        return sqlSessionFactory.openSession().insert("emp.addOneEmp", emp);

    }

    @Override
    public List<Emp> getEmpByCond(Cond cond) {
        return sqlSessionFactory.openSession().selectList("emp.getByCond",cond);
    }

    @Override
    public int deletEmpById(int id) {
        return sqlSessionFactory.openSession().delete("emp.deleteById",id);
    }

    @Override
    public int updateEmpById(Emp emp) {
        return sqlSessionFactory.openSession().update("emp.updateById",emp);
    }

    @Override
    public int getEmpCount(Cond cond) {

        return sqlSessionFactory.openSession().selectOne("emp.getCount",cond);
    }
}
