package entity;

import java.util.Date;

public class Emp {
    private int id;
    private  String name;
    private Date hireDate;
    private String sex;
    private float salay;

    private Dept dept;

    public Emp() {
    }

    public Emp(int id, String name, Date hireDate, String sex, float salay) {

        this.id = id;
        this.name = name;
        this.hireDate = hireDate;
        this.sex = sex;
        this.salay = salay;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getHireDate() {
        return hireDate;
    }

    public void setHireDate(Date hireDate) {
        this.hireDate = hireDate;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public float getSalay() {
        return salay;
    }

    public void setSalay(float salay) {
        this.salay = salay;
    }

    public Dept getDept() {
        return dept;
    }

    public void setDept(Dept dept) {
        this.dept = dept;
    }

    @Override
    public String toString() {
        return "Emp{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", hireDate=" + hireDate +
                ", sex='" + sex + '\'' +
                ", salay=" + salay +
                ", dept=" + dept +
                '}';
    }
}
