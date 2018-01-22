Ext.application({
    name: 'MyApp',

    launch: function () {
        MyApp.initEmp();
    }
});

MyApp.initEmp = function () {
    var itemsPerPage = 5;
    var store = new Ext.data.JsonStore({
        storeId: 'empStore',
        pageSize: itemsPerPage,
        proxy: {
            type: 'ajax',
            url: 'main/getEmps.do',
            reader: {
                type: 'json',
                rootProperty: 'emps',
                totalProperty: 'total'
            }
        },
        fields: [{name: 'id', mapping: 'id'},
            {name: 'name', mapping: 'name'},
            {name: 'sex', mapping: 'sex'},
            {name: 'salay', type: 'float', mapping: 'salay'},
            {name: 'hireDate', type: 'date', mapping: 'hireDate'},
            {name: 'dept', mapping: 'dept.name'}],

        listeners: {
            load: function () {
                console.log(this.getCount());
            }
        }
    });
    store.load();
    var currentFormValues = {};
    //定义表单窗口
    Ext.create('Ext.window.Window', {
        title: '新增数据',
        id: 'win',
        height: 400,
        width: 600,
        closeAction: 'hide',
        layout: 'fit',
        items: [{
            xtype: 'form',
            bodyPadding: 5,
            width: 350,
            id: 'empForm',
            layout: 'anchor',
            defaults: {
                anchor: '90%'
            },
            items: [{
                name: 'id',
                xtype: 'hidden',
                value: 0
            }, {
                fieldLabel: '姓名',
                name: 'name',
                allowBlank: false,
                xtype: 'textfield'
            }, {
                fieldLabel: '性别',
                name: 'sex',
                allowBlank: false,
                xtype: 'radiogroup',
                columns: 2,
                items: [
                    {boxLabel: "男", name: "sex", inputValue: "男", id: '男'},
                    {boxLabel: "女", name: "sex", inputValue: "女", id: '女'}
                ]
            }, {
                fieldLabel: '月薪',
                name: 'salay',
                allowBlank: false,
                xtype: 'numberfield',
                minValue: 0
            }, {
                fieldLabel: '入职日期',
                name: 'hireDate',
                allowBlank: false,
                xtype: 'datefield',
                maxValue: new Date()

            }, {
                fieldLabel: '部门',
                id: 'dept',
                name: 'dept.id',
                editable: false,
                allowBlank: false,
                xtype: 'combobox',
                store: new Ext.data.JsonStore({
                    autoLoad: true,
                    proxy: {
                        type: 'ajax',
                        url: 'main/getAllDepts.do',
                        reader: {
                            type: 'json'
                        }
                    },
                    fields: [
                        {name: 'value', mapping: 'id'},
                        {name: 'text', mapping: 'name'}]
                }),
                queryMode: 'local',
                displayField: 'text',
                valueField: 'value'
            }],
            buttons: [{
                text: '清空',
                handler: function () {
                    this.up('form').getForm().reset();
                }
            }, {
                text: '提交',
                formBind: true,
                disabled: true,
                handler: function () {
                    var form = this.up('form').getForm();
                    if (form.isValid()) {
                        var val = form.findField("id").getValue();
                        var url = '/main/addEmp.do';
                        if (val != 0) {
                            url = '/main/updateEmpById.do';
                        }
                        form.submit({
                            url: url,
                            success: function (form, action) {
                                Ext.Msg.alert('Success', action.result.msg);
                                Ext.data.StoreManager.lookup('empStore').reload();
                                Ext.getCmp("win").hide();
                            },
                            failure: function (form, action) {
                                Ext.Msg.alert('Failed', action.result.msg);
                            }
                        });
                    }
                }
            }]
        }],
        listeners: {
            hide: function () {
                Ext.getCmp("empForm").getForm().reset();
            }
        }
    });
//创建表格
    Ext.create('Ext.grid.Panel', {
        title: "title",
        id: 'empGrid',
        itemId: 'empInfo',
        renderTo: Ext.getBody(),
        store: Ext.data.StoreManager.lookup('empStore'),
        columns: [
            {text: '编号', dataIndex: 'id'},
            {text: '姓名', dataIndex: 'name'},
            {text: '性别', dataIndex: 'sex'},
            {
                text: '月薪', dataIndex: 'salay', type: 'float',
                renderer: function (value) {
                    return Ext.util.Format.round(value, 2);
                }
            },
            {
                text: '入职日期', dataIndex: 'hireDate',
                renderer: Ext.util.Format.dateRenderer('Y-m-d')
            },
            {text: '部门', dataIndex: 'dept'}
        ],
        height: 500,
        width: 700,
        selModel: {
            selType: 'checkboxmodel'
        },
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
            items: [
                {
                    xtype: 'button',
                    text: '新增',
                    handler: function () {
                        Ext.getCmp("win").show();
                    }
                }, "-", {
                    xtype: 'button',
                    text: '编辑',
                    handler: function () {
                        var grid = Ext.getCmp("empGrid");
                        var selection = grid.getSelection();
                        if (selection.length > 1) {
                            Ext.Msg.alert("Error", "只能编辑一条记录");
                        } else if (selection.length == 0) {
                            Ext.Msg.alert("Error", "请先选择一条记录");
                        } else {
                            //获取数据，初始化表单值
                            var data = selection[0].data;
                            console.log(data);
                            //通过部门名称，查询对应的id
                            Ext.Ajax.request({
                                url: 'main/getDeptIdByName.do',
                                params: {
                                    name: data.dept
                                },
                                success: function (response, opts) {
                                    Ext.getCmp('dept').setValue(response.responseText);
                                },
                                failure: function (response, opts) {
                                    console.log('server-side failure with status code ' + response.status);
                                }
                            });
                            Ext.getCmp("empForm").getForm().setValues(data);
                            Ext.getCmp(data.sex).setValue(true);
                            Ext.getCmp("win").setTitle("编辑数据");
                            Ext.getCmp("win").show();
                        }
                    }
                }, "-", {
                    xtype: 'button',
                    text: '删除',
                    handler: function () {
                        var grid = Ext.getCmp("empGrid");
                        var selection = grid.getSelection();
                        var params = "";
                        var names = "";
                        for (var i = 0; i < selection.length; i++) {
                            params += "," + selection[i].data.id;
                            names += "<br>" + selection[i].data.name;
                        }
                        Ext.Msg.confirm("Tip", "确认删除以下用户？" + names, function (opt) {
                            if (opt == 'yes') {
                                //发送删除ajax请求
                                Ext.Ajax.request({
                                    url: 'main/deleteEmpById.do',
                                    params: 'ids=' + params.substring(1),
                                    success: function (response, opts) {
                                        Ext.Msg.alert("Tip", response.responseText);
                                        Ext.data.StoreManager.lookup('empStore').reload();
                                    },
                                    failure: function (response, opts) {
                                        console.log('server-side failure with status code ' + response.status);
                                    }
                                });
                            }
                        });
                    }
                }, "->", {
                    xtype: "textfield",
                    id: 'condName',
                    emptyText: "请输入姓名"
                }, {
                    xtype: "combo",
                    id: 'condDept',
                    store: Ext.create('Ext.data.Store', {
                        fields: [{name: 'id'}, {name: 'name'}],
                        proxy: {
                            type: 'ajax',
                            url: 'main/getAllDepts.do'
                        },
                        listeners:{
                            load:function(){
                                this.add({id:0,name:'所有部门'});
                            }
                        }
                    }),
                    emptyText: '--请选择部门--',
                    displayField: 'name',
                    valueField: 'id',
                    listeners: {
                        //设置每次都重新加载数据
                        beforequery: function (qe) {
                            delete qe.combo.lastQuery;
                        }
                    }
                }, {
                    xtype: "button",
                    text: "查询",
                    scope: this,
                    handler: function () {
                        var empName = Ext.getCmp("condName").getValue();
                        var deptId = Ext.getCmp("condDept").lastValue;
                        if (deptId == null || "" == deptId) {
                            deptId = 0;
                        }
                        var empStore = Ext.data.StoreManager.lookup('empStore');
                        empStore.getProxy().setConfig('extraParams', {
                            empName: empName,
                            deptId: deptId
                        });
                        empStore.reload();
                    }
                }
            ]
        }, {
            xtype: 'pagingtoolbar',
            store: store,
            dock: 'bottom',
            displayInfo: true,
        }]
    });
}