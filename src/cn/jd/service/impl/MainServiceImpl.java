package cn.jd.service.impl;

import cn.jd.dao.DeptDao;
import cn.jd.dao.EmpDao;
import cn.jd.dao.TreeMenuDao;
import cn.jd.service.MainService;
import entity.City;
import entity.Dept;
import entity.Emp;
import entity.Province;
import cn.jd.util.Cond;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.List;

@Service("mainService")
public class MainServiceImpl implements MainService {
    @Resource
    TreeMenuDao treeMenuDao;

    @Resource
    EmpDao empDao;

    @Resource
    DeptDao deptDao;

    @Override
    public String getTreeMenuJson() {
        String json = getJson(treeMenuDao.getAllProAndCityAndArea(), new StringBuffer()).toString();
        String result = "{root:{text:'导航',expanded: true,children:[\n" +
                "                {id:'1',text:'XX公司',children:[\n" +
                "                    {id: 'empInfo', text: '员工信息', leaf: true},\n" +
                "                    {id: 'deptInfo', text: '部门信息', leaf: true}\n" +
                "                    ]},\n" +
                "                {id:'0',text:'省市区菜单',children:" + json + "},\n" +
                "                {id:'combo',text:'三级联动菜单', leaf: true}\n" +
                "                \n" +
                "            ]\n" +
                "        }\n" +
                "    }";
        return result;
    }

    @Override
    public List<Emp> getAllEmps() {
        return empDao.getAllEmps();
    }

    @Override
    public List<Dept> getAllDepts() {
        return deptDao.getAllDepts();
    }

    @Override
    public int addEmp(Emp emp) {
        return empDao.addEmp(emp);
    }

    @Override
    public List<Emp> getEmpByCond(Cond cond) {
        return empDao.getEmpByCond(cond);
    }

    @Override
    public int getEmpCount(Cond cond) {
        return empDao.getEmpCount(cond);
    }

    @Override
    public int deleteEmpById(int id) {
        return empDao.deletEmpById(id);
    }

    @Override
    public int updateEmpById(Emp emp) {
        return empDao.updateEmpById(emp);
    }

    @Override
    public int getDeptIdByName(String name) {
        return deptDao.getIdByName(name);
    }

    @Override
    public List<Dept> getAllDeptAndEmp() {
        return deptDao.getAllDeptAndEmp();
    }

    @Override
    public int getNextDeptId() {
        return deptDao.getNextDeptId();
    }

    @Override
    public int saveOrUpdateDept(Dept dept) {
        List<Dept> allDepts = deptDao.getAllDepts();
        int flag = -1;
        for (int i = 0; i < allDepts.size(); i++) {
            int id = allDepts.get(i).getId();
            if (id > flag) {
                flag = id;
            }
        }
        if (dept.getId() > flag) {
            return deptDao.addDept(dept);
        } else {
            return deptDao.updateDeptById(dept);
        }
    }

    @Override
    public int deleteDeptById(int id) {
        return deptDao.deleteDeptById(id);
    }

    @Override
    public List<Emp> getDeptByCond(Cond cond) {
        return deptDao.getDeptByCond(cond);
    }

    @Override
    public int getDeptCount() {
        return deptDao.getDeptCount();
    }

    @Override
    public List<Province> getAllProvince() {
        return treeMenuDao.getAllProvince();
    }

    @Override
    public List<City> getCityByProvinceId(int provinceId) {
        return treeMenuDao.getCityByProvinceId(provinceId);
    }

    @Override
    public List<City> getAreaByCityId(int cityId) {
        return treeMenuDao.getAreaByCityId(cityId);
    }

    private static StringBuffer getJson(List list, StringBuffer sb) {
        String className = "";
        sb.append("[");
        for (int i = 0; i < list.size(); i++) {
            sb.append("{");
            Class<?> aClass = list.get(i).getClass();
            className = aClass.getName().substring(aClass.getName().lastIndexOf(".") + 1);
            boolean flag = true;
            try {
                Object invoke = null;
                Method getId = aClass.getMethod("get" + className + "Id");
                invoke = getId.invoke(list.get(i));
                sb.append("id:'" + invoke + "',");

                Method getText = aClass.getMethod("get" + className);
                invoke = getText.invoke(list.get(i));
                sb.append("text:'" + invoke + "'");

                Method[] methods = aClass.getMethods();
                for (int j = 0; j < methods.length; j++) {
                    Type type = methods[j].getGenericReturnType();
                    if (type.toString().indexOf("List") != -1) {
                        List invoke1 = (List) methods[j].invoke(list.get(i));
                        if (invoke1 != null && invoke1.size() > 0) {
                            flag = false;
                            sb.append(",children:");
                            sb.append(getJson(invoke1, new StringBuffer()).toString());
                        }
                    }
                }
            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }
            if (flag) {
                sb.append(",leaf:true");
            }
            sb.append("}");
            if (i != list.size() - 1) {
                sb.append(",");
            }
        }
        sb.append("]");
        return sb;
    }


}
