package entity;

public class Area {
    private int id;
    private String areaId;
    private String area;
    private City city;




    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "Area{" +
                "id=" + id +
                ", areaId='" + areaId + '\'' +
                ", area='" + area + '\'' +
                ", city=" + city +
                '}';
    }

    public Area() {
    }

    public Area(int id, String areaId, String area) {
        this.id = id;
        this.areaId = areaId;
        this.area = area;
    }

    public String getAreaId() {
        return areaId;
    }

    public void setAreaId(String areaId) {
        this.areaId = areaId;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public City getCity() {
        return city;
    }

    public void setCity(City city) {
        this.city = city;
    }
}
