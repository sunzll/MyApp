package cn.jd.dao;

import cn.jd.entity.Emp;
import cn.jd.util.Cond;

import java.util.List;

public interface EmpDao {
    public List<Emp> getAllEmps();



    public int addEmp(Emp emp);

    public List<Emp> getEmpByCond(Cond cond);

    public int getEmpCount(Cond cond);

    public int deletEmpById(int id);

    public int updateEmpById(Emp emp);
}
