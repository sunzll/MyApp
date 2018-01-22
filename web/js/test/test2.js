Ext.application({
    name: 'MyApp',

    launch: function () {
        MyApp.initMain();
    }
});
//先用xtype定义导航栏面板类型，发送ajax请求数据成功后，添加到该面板的items(add方法)
MyApp.initMain = function () {
    //解决一次双击会触发两次单击事件，和一次双击事件问题
    var task = new Ext.util.DelayedTask();
    var dealClick = function (type, param) {
        console.log(type + param.text);
        if (type == 'click') {
            MyApp.addTabpanel(param);
        }
    };

    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [{
            region: 'north',
            html: '<h1 class="x-panel-header">Page Title</h1>',
            border: false,
            margin: '0 0 5 0'
        }, {
            region: 'west',
            collapsible: true,
            title: 'Navigation',
            width: 250,
            id: 'nav',
            layout: 'fit',
            defaults: {
                xtype: "treepanel",
                rootVisible: false,
                lines: true,
                autoScroll: true,
                listeners: {
                    itemclick: function (v, r, item) {
                        task.delay(500, dealClick, this, ['click', r.data]);
                    },
                    itemdblclick: function (v, r, item) {
                        task.cancel();
                        task.delay(500, dealClick, this, ['double', r.data]);
                    }
                }
            }
        }, {
            region: 'south',
            collapsible: false,
            html: '&copy 2017/11/16',
            split: false,
            height: 50,
            minHeight: 50
        }, {
            region: 'center',
            id: 'tabPanel',
            xtype: 'tabpanel',
            activeTab: 0,
            items: {
                title: 'Default Tab',
                html: 'The first tab\'s content. Others may be added dynamically'
            }
        }]
    });
    Ext.Ajax.request({
        url: 'main/getTreeMenu.do',
        success: function (response, opts) {
            var obj = Ext.decode(response.responseText);
            console.dir(obj);
            Ext.getCmp("nav").add(obj);
        },
        failure: function (response, opts) {
            console.log('server-side failure with status code ' + response.status);
            Ext.Msg.alert("Error", "加载菜单失败!");
        }
    });
};

//主面板添加一个子面板
MyApp.addTabpanel = function (param) {
    var tab = Ext.getCmp("tabPanel");
    var id = param.id;
    var text = param.text;
    if (!Ext.getCmp(id)) {
        if (id == 'empInfo') {
            MyApp.initEmp();
            tab.add({
                    xtype: 'grid',
                    title: "员工信息",
                    closable: true,
                    id: id,
                    store: Ext.data.StoreManager.lookup('myStore'),
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
                                    var grid = Ext.getCmp(id);
                                    var selection = grid.getSelection();
                                    if (selection.length > 1) {
                                        Ext.Msg.alert("Error", "只能编辑一条记录");
                                    } else if (selection.length == 0) {
                                        Ext.Msg.alert("Error", "请先选择一条记录");
                                    } else {
                                        //获取数据，初始化表单值
                                        var data = selection[0].data;
                                        console.log(data);
                                        /*//通过部门名称，查询对应的id
                                        Ext.Ajax.request({
                                            url: 'ajax_demo/sample.json',
                                            params: {
                                                name: data.dept
                                            },
                                            success: function (response, opts) {
                                                Ext.getCmp('dept').setValue(response.responseText);
                                            },
                                            failure: function (response, opts) {
                                                console.log('server-side failure with status code ' + response.status);
                                            }
                                        });*/
                                        Ext.getCmp("empForm").getForm().setValues(data);
                                        if(data.sex!=""){
                                            Ext.getCmp(data.sex).setValue(true);
                                        }
                                        Ext.getCmp("win").setTitle("编辑数据");
                                        Ext.getCmp("win").show();
                                    }
                                }
                            }, "-", {
                                xtype: 'button',
                                text: '删除',
                                handler: function () {
                                    var grid = Ext.getCmp(id);
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
                                                    Ext.data.StoreManager.lookup('myStore').reload();
                                                },
                                                failure: function (response, opts) {
                                                    console.log('server-side failure with status code ' + response.status);
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        ]
                    }, {
                        xtype: 'pagingtoolbar',
                        store: Ext.data.StoreManager.lookup('myStore'),
                        dock: 'bottom',
                        displayInfo: true,
                    }]
                }
            );
        } else if (id == 'deptInfo') {

        } else {
            tab.add({
                xtype: 'panel',
                title: text,
                closable: true,
                id: id,
                html: "<a href='http://www.baidu.com/s?wd=" + text + "' target='_blank'>点击查询" + text + "的信息</a>"
            });
        }
    }
    tab.setActiveTab(id);
}
//初始化操作emp表需要的store、form
MyApp.initEmp = function () {
    var itemsPerPage = 5;
    var store = new Ext.data.JsonStore({
        storeId: 'myStore',
        pageSize: itemsPerPage,
        autoLoad: true,
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
                                Ext.data.StoreManager.lookup('myStore').reload();
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
}