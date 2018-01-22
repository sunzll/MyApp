package cn.jd.dao.impl;

import cn.jd.dao.TreeMenuDao;
import cn.jd.entity.City;
import cn.jd.entity.Province;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.List;

@Repository("treeMenuDao")
public class TreeMenuDaoImpl implements TreeMenuDao {

    @Resource
    private SqlSessionFactory sqlSessionFactory;

    @Override
    public List<Province> getAllProAndCityAndArea() {
        return sqlSessionFactory.openSession().selectList("province.getAllProAndCityAndArea");
    }

    @Override
    public List<Province> getAllProvince() {
        return sqlSessionFactory.openSession().selectList("province.getAllProvince");
    }

    @Override
    public List<City> getCityByProvinceId(int provinceId) {
        return sqlSessionFactory.openSession().selectList("city.getCityByProvinceId",provinceId);
    }

    @Override
    public List<City> getAreaByCityId(int cityId) {
        return sqlSessionFactory.openSession().selectList("area.getAreaByCityId",cityId);
    }

    public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
        this.sqlSessionFactory = sqlSessionFactory;
    }
}
