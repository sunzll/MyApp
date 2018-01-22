package cn.jd.controller;

import cn.jd.service.MainService;
import cn.jd.entity.City;
import cn.jd.entity.Dept;
import cn.jd.entity.Emp;
import cn.jd.entity.Province;
import cn.jd.util.Cond;
import cn.jd.util.JsonDateValueProcessor;
import net.sf.json.JSONArray;
import net.sf.json.JsonConfig;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Controller
@RequestMapping("main")
public class MainController {
    @Resource
    private MainService mainService;

    //获取属性菜单json
    @RequestMapping(value = "/getTreeMenu.do", produces = "application/json; charset=utf-8")
    @ResponseBody
    public String getTreeMenu() throws Exception {
        System.out.println("请求菜单数据");
        String json = mainService.getTreeMenuJson();
        return json;
    }

    //按条件请求员工数据
    @RequestMapping(value = "/getEmps.do", produces = "application/json; charset=utf-8")
    @ResponseBody
    public String getEmps(Cond cond) throws Exception {
        System.out.println("请求员工数据");
        int total = mainService.getEmpCount(cond);
        if(total<=cond.getLimit()*(cond.getPage()-1)){
            cond.setStart(0);
        }
        List<Emp> emps = mainService.getEmpByCond(cond);
        JsonConfig jc = new JsonConfig();
        jc.registerJsonValueProcessor(Date.class, new JsonDateValueProcessor());
        String s = JSONArray.fromObject(emps, jc).toString();
        String result = "{total:" + total + ",emps:" + s + "}";
        return result;
    }

    //请求所有的部门，新增员工时需选择部门
    @RequestMapping(value = "/getAllDepts.do", produces = "application/json; charset=utf-8")
    @ResponseBody
    public List<Dept> getAllDepts() throws Exception {
        List<Dept> allDepts = mainService.getAllDepts();
        return allDepts;
    }

    //新增员工数据
    @RequestMapping(value = "/addEmp.do", produces = "application/json; charset=utf-8")
    @ResponseBody
    public String addEmp(Emp emp) throws Exception {
        String result = "";
        int i = mainService.addEmp(emp);
        if (i > 0) {
            result = "{success:true,msg:'新增成功'}";
        } else {
            result = "{success:false,msg:'新增失败'}";
        }
        return result;
    }

    //通过id更新员工信息
    @RequestMapping(value = "/updateEmpById.do", produces = "application/json; charset=utf-8")
    @ResponseBody
    public String updateEmpById(Emp emp) throws Exception {
        System.out.println(emp);
        String result = "";
        int i = mainService.updateEmpById(emp);
        if (i > 0) {
            result = "{success:true,msg:'更新成功'}";
        } else {
            result = "{success:false,msg:'更新失败'}";
        }
        return result;
    }

    //根据id删除员工信息，多个id用","分开
    @RequestMapping(value = "/deleteEmpById.do", produces = "application/json; charset=utf-8")
    @ResponseBody
    public String deleteEmpById(String ids) throws Exception {
        String[] strings = ids.split(",");
        int id;
        int flag = 0;
        for (int i = 0; i < strings.length; i++) {
            id = Integer.parseInt(strings[i]);
            if (mainService.deleteEmpById(id) > 0) {
                flag++;
            }
        }
        String result = "";
        if (flag == strings.length) {
            result = "删除成功";
        } else {
            result = "删除失败";
        }
        return result;
    }

    //通过部门名称获取id
    @RequestMapping(value = "/getDeptIdByName.do", produces = "application/json; charset=utf-8")
    @ResponseBody
    public int getDeptIdByName(String name) {
        return mainService.getDeptIdByName(name);
    }

    //获取所有部门信息
    @RequestMapping(value = "/getAllDeptAndEmp.do", produces = "application/json; charset=utf-8")
    @ResponseBody
    public List<Dept> getAllDeptAndEmp() {
        return mainService.getAllDeptAndEmp();
    }

    //获取所有部门信息，显示在表格

    @RequestMapping(value = "/getDeptByCond.do", produces = "application/json; charset=utf-8")
    @ResponseBody
    public String getDeptByCond(Cond cond) {
        System.out.println("请求员工数据");
        List<Emp> depts = mainService.getDeptByCond(cond);
        int total = mainService.getDeptCount();
        JsonConfig jc = new JsonConfig();
        jc.registerJsonValueProcessor(Date.class, new JsonDateValueProcessor());
        String s = JSONArray.fromObject(depts, jc).toString();
        String result = "{total:" + total + ",depts:" + s + "}";
        return result;
    }

    //获取下一个自增的id值，新增记录时需设置id
    @RequestMapping(value = "/getNextDeptId.do", produces = "application/json; charset=utf-8")
    @ResponseBody
    public int getNextDeptId() {
        return mainService.getNextDeptId();
    }

    //更新提交的部门信息数据
    @RequestMapping(value = "/saveOrUpdateDept.do", produces = "application/json; charset=utf-8")
    @ResponseBody
    public String saveOrUpdateDept(Dept dept) {
        int i = mainService.saveOrUpdateDept(dept);
        String result = "";
        if (i > 0) {
            result = "更新成功";
        } else {
            result = "更新失败";
        }
        return result;
    }

    //通过id删除部门数据
    @RequestMapping(value = "/deleteDeptById.do", produces = "application/json; charset=utf-8")
    @ResponseBody
    public String deleteDeptById(String ids) {
        String[] strings = ids.split(",");
        int id;
        int flag = 0;
        for (int i = 0; i < strings.length; i++) {
            id = Integer.parseInt(strings[i]);
            if (mainService.deleteDeptById(id) > 0) {
                flag++;
            }
        }
        String result = "";
        if (flag == strings.length) {
            result = "删除成功";
        } else {
            result = "删除失败";
        }
        return result;
    }

    /*******三级联动下拉菜单*******/
    @RequestMapping(value = "/getProvince.do", produces = "application/json; charset=utf-8")
    @ResponseBody
    public List<Province> getProvince() {
        return mainService.getAllProvince();
    }

    @RequestMapping(value = "/getCity.do", produces = "application/json; charset=utf-8")
    @ResponseBody
    public List<City> getCity(int provinceId) {
        return mainService.getCityByProvinceId(provinceId);
    }

    @RequestMapping(value = "/getArea.do", produces = "application/json; charset=utf-8")
    @ResponseBody
    public List<City> getArea(int cityId) {
        return mainService.getAreaByCityId(cityId);
    }

}
