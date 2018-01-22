Ext.application({
    name: 'MyApp',

    launch: function () {
        MyApp.initDept();
    }
});

MyApp.initDept = function () {
    var store = new Ext.data.JsonStore({
        storeId: 'deptStore',
        autoLoad: true,
        pageSize:5,
        proxy: {
            type: 'ajax',
            url: 'main/getDeptByCond.do',
            reader: {
                type: 'json',
                totalProperty:'total',
                rootProperty:'depts'
            }
        },
        fields: [{name: 'id', mapping: 'id'},
            {name: 'name', mapping: 'name'},
            {name: 'address', mapping: 'sex'},
            {name: 'empNum', mapping: 'empList.length'}],
        listeners: {
            load: function () {
                console.dir(this.data);
            }
        }
    });

    Ext.create('Ext.grid.Panel', {
        title: 'Simpsons',
        id: 'deptGrid',
        store: Ext.data.StoreManager.lookup('deptStore'),
        columns: [
            {header: '编号', dataIndex: 'id'},
            {
                header: '名称', dataIndex: 'name',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                header: '地址', dataIndex: 'address', flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {header: '员工数', dataIndex: 'empNum'}
        ],
        selModel: {
            selType: 'checkboxmodel'
        },
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 1
        },
        height: 500,
        width: 700,
        renderTo: Ext.getBody(),
        tbar: [{
            text: '新增',
            handler: function () {
                Ext.Ajax.request({
                    url: 'main/getNextDeptId.do',
                    success: function (response, opts) {
                        var store = Ext.data.StoreManager.lookup("deptStore");
                        var nr = {
                            id: response.responseText,
                            name: '',
                            address: '',
                            empList: []
                        }
                        store.insert(response.responseText, nr);
                    },
                    failure: function (response, opts) {
                        console.log('server-side failure with status code ' + response.status);
                    }
                });
            }
        }, '-', {
            text: '删除',
            handler: function () {
                var selection = Ext.getCmp("deptGrid").getSelection();
                var params = "";
                var names = "";
                for (var i = 0; i < selection.length; i++) {
                    params += "," + selection[i].data.id;
                    names += "<br>" + selection[i].data.name;
                }
                Ext.Msg.confirm('系统提示', '确定要删除以下部门？' + names, function (btn) {
                    if (btn == 'yes') {

                        Ext.Ajax.request({
                            url: 'main/deleteDeptById.do',
                            params:{ids:params.substring(1)},
                            success: function(response, opts) {
                                Ext.Msg.alert("Tip",response.responseText);
                                if(response.responseText.indexOf("成功")!=-1){
                                    store.remove(selection);
                                    store.commitChanges();
                                }

                            },
                            failure: function(response, opts) {
                                console.log('server-side failure with status code ' + response.status);
                            }
                        });
                    }
                });
            }
        }, '-', {
            text: '保存',
            handler: function () {
                var store = Ext.data.StoreManager.lookup("deptStore");
                var ms = store.getModifiedRecords();
                for (var i = 0; i < ms.length; i++) {
                    ms[i].data.empList=[];
                    console.dir(ms[i].data);
                    Ext.Ajax.request({
                        url: 'main/saveOrUpdateDept.do',
                        params:ms[i].data,
                        success: function(response, opts) {
                            Ext.Msg.alert(response.responseText);
                            store.commitChanges();
                        },
                        failure: function(response, opts) {
                            Ext.Msg.alert(response.responseText);
                            store.rejectChanges();
                            console.log('server-side failure with status code ' + response.status);
                        }
                    });
                }
            }
        }],
        dockedItems: [{
            xtype: 'pagingtoolbar',
            store: Ext.data.StoreManager.lookup('deptStore'),
            dock: 'bottom',
            displayInfo: true
        }]
    });

}
