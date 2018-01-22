package cn.jd.entity;

import java.util.List;

public class Province {
    private int id;
    private String provinceId;
    private String province;

    private List<City> cities;

    public Province() {
    }

    public Province(int id, String provinceId, String province) {
        this.id = id;
        this.provinceId = provinceId;
        this.province = province;
    }

    @Override
    public String toString() {
        return "Province{" +
                "id=" + id +
                ", provinceId='" + provinceId + '\'' +
                ", province='" + province + '\'' +
                ", cities=" + cities +
                '}';
    }

    public List<City> getCities() {
        return cities;
    }

    public void setCities(List<City> cities) {
        this.cities = cities;
    }

    public String getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(String provinceId) {
        this.provinceId = provinceId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }


    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }
}
