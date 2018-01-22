package cn.jd.service;

import entity.City;
import entity.Dept;
import entity.Emp;
import entity.Province;
import cn.jd.util.Cond;

import java.util.List;

public interface MainService {

    public String getTreeMenuJson();

    public List<Emp> getAllEmps();

    public List<Dept> getAllDepts();

    public int addEmp(Emp emp);

    public List<Emp> getEmpByCond(Cond cond);

    public int getEmpCount(Cond cond);

    public int deleteEmpById(int id);

    public int updateEmpById(Emp emp);

    public int getDeptIdByName(String name);

    /*部门信息*/
    public List<Dept> getAllDeptAndEmp();

    public int getNextDeptId();

    public int saveOrUpdateDept(Dept dept);

    public int deleteDeptById(int id);

    public List<Emp> getDeptByCond(Cond cond);

    public int getDeptCount();

    /*******三级联动下拉菜单*******/
    public List<Province> getAllProvince();

    List<City> getCityByProvinceId(int provinceId);

    List<City> getAreaByCityId(int cityId);
}
