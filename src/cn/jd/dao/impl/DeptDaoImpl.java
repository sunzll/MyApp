package cn.jd.dao.impl;

import cn.jd.dao.DeptDao;
import entity.Dept;
import entity.Emp;
import cn.jd.util.Cond;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.List;

@Repository("deptDao")
public class DeptDaoImpl implements DeptDao {

    @Resource
    SqlSessionFactory sqlSessionFactory ;

    @Override
    public List<Dept> getAllDepts() {
        return sqlSessionFactory.openSession().selectList("dept.getAllDepts");
    }

    @Override
    public List<Dept> getAllDeptAndEmp() {
        return sqlSessionFactory.openSession().selectList("dept.getAllDeptAndEmp");
    }

    @Override
    public int getNextDeptId() {
        return sqlSessionFactory.openSession().selectOne("dept.getNextId");
    }

    @Override
    public int addDept(Dept dept) {
        return sqlSessionFactory.openSession().insert("dept.addDept",dept);
    }

    @Override
    public int updateDeptById(Dept dept) {
        return sqlSessionFactory.openSession().update("dept.updateById",dept);
    }

    @Override
    public int deleteDeptById(int id) {
        return sqlSessionFactory.openSession().delete("dept.deleteById",id);
    }

    @Override
    public List<Emp> getDeptByCond(Cond cond) {
        return sqlSessionFactory.openSession().selectList("dept.getByCond",cond);
    }

    @Override
    public int getDeptCount() {
        return sqlSessionFactory.openSession().selectOne("dept.getCount");
    }

    @Override
    public int getIdByName(String name) {
        Object o = sqlSessionFactory.openSession().selectOne("dept.getIdByName", name);
        return (int)o;
    }


}
