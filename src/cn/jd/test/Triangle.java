package cn.jd.test;

import org.junit.Test;
public class Triangle {

    private long a;
    private long b;
    private long c;


    public boolean inScope() {
        if (a >= 1 && a <= 100 && b >= 1 && b <= 100 && c >= 1 && c <= 100) {
            return true;
        }
        return false;
    }

    public boolean isTri() {// 判断能否构成三角形
        if (a + b > c && a + c > b && b + c > a){
            return true;
        }
        return false;
    }

    /*用Test注解，只能有一个没有参数的public 构造函数*/
    @Test
    public void isType() {

        Triangle tri = new Triangle();
        boolean scope = tri.inScope();
        boolean d = tri.isTri();

        String iType = null;

    }
}

