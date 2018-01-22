package cn.jd.dao;

import cn.jd.entity.City;
import cn.jd.entity.Province;

import java.util.List;

public interface TreeMenuDao {

    public List<Province> getAllProAndCityAndArea();


    public  List<Province> getAllProvince();

    List<City> getCityByProvinceId(int provincedId);

    List<City> getAreaByCityId(int cityId);
}
