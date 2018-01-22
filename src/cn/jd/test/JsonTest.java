package cn.jd.test;

import entity.Area;
import entity.City;
import entity.Province;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class JsonTest {
    public static void main(String[] args) {
        Province province1 = new Province(1, "01", "山西省");
        Province province2 = new Province(2, "02", "河北省");

        City city1 = new City(1, "0101", "太原市");

        City city2 = new City(2, "0102", "大同市");

        Area area1 = new Area(1, "010101", "小店区");
        Area area2 = new Area(2, "010102", "迎泽区");

        List<Area> areas = new ArrayList<>();
        areas.add(area1);
        areas.add(area2);

        city1.setAreas(areas);
        List<City> cities = new ArrayList<>();
        cities.add(city1);
        cities.add(city2);
        province1.setCities(cities);

        List<Province> pros = new ArrayList<>();
        pros.add(province1);
        pros.add(province2);

        StringBuffer sb = new StringBuffer();
        sb = getJson2(pros, sb);
        System.out.println(sb.toString());
    }

    /**
     * 转成json字符串的方法
     */
    private static StringBuffer getJson(List list, StringBuffer sb) {
        String className = "";
        sb.append("[");
        for (int i = 0; i < list.size(); i++) {
            sb.append("{");
            Class<?> aClass = list.get(i).getClass();
            className = aClass.getName().substring(aClass.getName().lastIndexOf(".") + 1);
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
            sb.append("}");
            if (i != list.size() - 1) {
                sb.append(",");
            }
        }
        sb.append("]");
        return sb;
    }

    /**
     * 测试方法
     */
    private static StringBuffer getJson2(List list, StringBuffer sb) {
        String className = "";
        sb.append("[");
        for (int i = 0; i < list.size(); i++) {
            sb.append("{");
            System.out.println("test--------------");
            Class<?> aClass = list.get(i).getClass();
            className = aClass.getName().substring(aClass.getName().lastIndexOf(".") + 1);
            try {
                Object invoke = null;
                Method getId = aClass.getMethod("get" + className + "Id");
                invoke = getId.invoke(list.get(i));
                sb.append("id:'" + invoke + "',");
                System.out.println("test--------------");
                Method getName = aClass.getMethod("get" + className);
                invoke = getName.invoke(list.get(i));
                sb.append("text:'" + invoke + "'");

            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }
            sb.append("}");
            if (i != list.size()) {
                sb.append(",");
            }
        }
        sb.append("]");
        return sb;
    }
}
