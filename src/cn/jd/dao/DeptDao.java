package cn.jd.dao;

import entity.Dept;
import entity.Emp;
import cn.jd.util.Cond;

import java.util.List;

public interface DeptDao {

    public int getIdByName(String name);

    public List<Dept> getAllDepts();


   public List<Dept> getAllDeptAndEmp();

    public int getNextDeptId();

    public int addDept(Dept dept);

    public int updateDeptById(Dept dept);

    public int deleteDeptById(int id);

    public List<Emp> getDeptByCond(Cond cond);

    public int getDeptCount();

}
