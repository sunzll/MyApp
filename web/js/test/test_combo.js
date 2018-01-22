Ext.application({
    name: 'MyApp',

    launch: function () {
        MyApp.initCombo();
    }
});

MyApp.initCombo = function () {
    var provinceStore = Ext.create('Ext.data.Store', {
        id:'provinceStore',
        fields: [{name: 'provinceId'}, {name: 'province'}],
        proxy: {
            type: 'ajax',
            url: 'main/getProvince.do'
        }
    });
    var cityStore = Ext.create('Ext.data.Store', {
        id:'cityStore',
        fields: [{name: 'cityId'}, {name: 'city'}],
        proxy: {
            type: 'ajax',
            url: 'main/getCity.do',
            extraParams:{provinceId : 0}
        }
    });
    var areaStore = Ext.create('Ext.data.Store', {
        id:'areaStore',
        fields: [{name: 'areaId'}, {name: 'area'}],
        proxy: {
            type: 'ajax',
            url: 'main/getArea.do',
            extraParams:{cityId : 0}
        }
    });

    Ext.create('Ext.panel.Panel', {
        id: 'testForm',
        title: 'FieldContainer Example',
        width: 700,
        bodyPadding: 10,
        items: [{
            xtype: 'fieldcontainer',
            fieldLabel: '地区',
            layout: 'hbox',
            items: [{
                id: 'province',
                xtype: 'combo',
                emptyText: '--请选择--',
                store: Ext.data.StoreManager.lookup('provinceStore'),
                displayField: 'province',
                valueField: 'provinceId',
                listeners: {
                    change: function () {
                        //设置cityStore的请求参数
                        cityStore.getProxy().setConfig('extraParams',{provinceId:this.lastValue});
                    }
                }
            }, {
                xtype: 'splitter'
            }, {
                xtype: 'combo',
                store: Ext.data.StoreManager.lookup('cityStore'),
                emptyText: '--请选择--',
                displayField: 'city',
                valueField: 'cityId',
                listeners: {
                    change: function () {
                        //设置cityStore的请求参数
                        areaStore.getProxy().setConfig('extraParams',{cityId:this.lastValue});
                    },
                    beforequery: function(qe){
                        delete qe.combo.lastQuery;
                    }
                }
            }, {
                xtype: 'splitter'
            }, {
                xtype: 'combo',
                store: Ext.data.StoreManager.lookup('areaStore'),
                emptyText: '--请选择--',
                displayField: 'area',
                valueField: 'areaId',
                listeners: {
                    //设置每次都重新加载数据
                    beforequery: function(qe){
                        delete qe.combo.lastQuery;
                    }
                }
            }]
        }],
        renderTo: Ext.getBody()
    });
}








