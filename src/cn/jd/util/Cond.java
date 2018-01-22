package cn.jd.util;

/**
 * 条件类，用于分页、员工信息模糊查询的条件
 */

public class Cond {
    private int start;
    private int limit;
    private int page;
    private String empName;
    private int deptId;

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getStart() {
        return start;
    }

    public String getEmpName() {
        return empName;
    }

    public void setEmpName(String empName) {
        this.empName = empName;
    }

    public int getDeptId() {
        return deptId;
    }

    public void setDeptId(int deptId) {
        this.deptId = deptId;
    }

    public void setStart(int start) {
        this.start = start;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public Cond() {

    }

    public Cond(int start, int limit) {

        this.start = start;
        this.limit = limit;
    }
}
