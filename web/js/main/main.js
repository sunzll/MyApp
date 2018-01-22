Ext.application({
    name: 'MyApp',

    launch: function () {
        MyApp.initLogin();
    }
});
//初始化登录窗口
MyApp.initLogin = function () {

    var form = Ext.create('Ext.form.Panel', {
        bodyPadding: 5,
        width: 350,
        url: 'user/login.do',
        layout: 'anchor',
        defaults: {
            anchor: '100%'
        },
        defaultType: 'textfield',
        items: [{
            fieldLabel: 'User Name',
            name: 'userName',
            allowBlank: false
        }, {
            fieldLabel: 'Password',
            name: 'password',
            inputType: 'password',
            allowBlank: false
        }],
        buttons: [{
            text: 'Reset',
            handler: function () {
                this.up('form').getForm().reset();
            }
        }, {
            text: 'Submit',
            formBind: true,
            disabled: true,
            handler: function () {
                var form = this.up('form').getForm();
                if (form.isValid()) {
                    form.submit({
                        //登录成功
                        success: function (form, action) {
                            Ext.Msg.alert('Success', action.result.msg);
                            MyApp.destoryLogin();
                            MyApp.initMain();
                        },
                        failure: function (form, action) {
                            Ext.Msg.alert('Failed', action.result.msg);
                        }
                    });
                }
            }
        }]
    });
    Ext.create('Ext.window.Window', {
        title: 'Login',
        id: 'win',
        height: 200,
        width: 400,
        layout: 'fit',
        draggable: false,  //不可拖动
        closable: false,     //不可关闭
        modal: true,
        resizable: false,	//窗口大小不可调
        items: [form]
    }).show();
};

MyApp.destoryLogin = function () {
    Ext.getCmp("win").close();
};

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
            html: '<h1 class="x-panel-header">ExtJs6</h1>',
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
                title: 'Welcome',
                html: 'Hello Ext'
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
                                    Ext.getCmp("empWin").show();
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
                                        Ext.getCmp("empForm").getForm().setValues(data);
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
                                        if (data.sex != "") {
                                            Ext.getCmp(data.sex).setValue(true);
                                        }
                                        Ext.getCmp("empWin").setTitle("编辑数据");
                                        Ext.getCmp("empWin").show();
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
                                    listeners: {
                                        load: function () {
                                            this.add({id: 0, name: '所有部门'});
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
                        store: Ext.data.StoreManager.lookup('empStore'),
                        dock: 'bottom',
                        displayInfo: true,
                    }]
                }
            );
        } else if (id == 'deptInfo') {
            MyApp.initDept();
            tab.add({
                xtype: 'grid',
                title: "部门信息",
                id: id,
                closable: true,
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
                        var selection = Ext.getCmp(id).getSelection();
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
                                    params: {ids: params.substring(1)},
                                    success: function (response, opts) {
                                        Ext.Msg.alert("Tip", response.responseText);
                                        if (response.responseText.indexOf("成功") != -1) {
                                            Ext.data.StoreManager.lookup("deptStore").remove(selection);
                                            Ext.data.StoreManager.lookup("deptStore").commitChanges();
                                        }

                                    },
                                    failure: function (response, opts) {
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
                            if (!ms[i].data.empNum) {     //新添加的部门人数为0
                                ms[i].data.empNum = 0;
                            }
                            // ms[i].data.empList = [];
                            console.dir(ms[i].data);
                            Ext.Ajax.request({
                                url: 'main/saveOrUpdateDept.do',
                                params: {
                                    address: ms[i].data.address,
                                    name: ms[i].data.name,
                                    id: ms[i].data.id
                                },
                                success: function (response, opts) {
                                    Ext.Msg.alert("Tip", response.responseText);
                                    store.commitChanges();
                                },
                                failure: function (response, opts) {
                                    Ext.Msg.alert("Error", response.responseText);
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
        } else if (id == 'combo') {
            MyApp.initCombo();
            tab.add({
                id: id,
                title: '三级联动',
                closable: true,
                /*******三级联动菜单******/
                xtype: 'fieldcontainer',
                margin: '10 5 3 5',
                fieldLabel: '地区',
                layout: 'hbox',
                items: [{
                    xtype: 'combo',
                    emptyText: '--请选择--',
                    store: Ext.data.StoreManager.lookup('provinceStore'),
                    displayField: 'province',
                    valueField: 'provinceId',
                    listeners: {
                        change: function () {
                            //设置cityStore的请求参数
                            Ext.data.StoreManager.lookup('cityStore').getProxy().setConfig('extraParams', {provinceId: this.lastValue});
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
                            Ext.data.StoreManager.lookup('areaStore').getProxy().setConfig('extraParams', {cityId: this.lastValue});
                        },
                        beforequery: function (qe) {
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
                        beforequery: function (qe) {
                            delete qe.combo.lastQuery;
                        }
                    }
                }]
            })
        } else {
            var tabUri = "http://map.baidu.com/?newmap=1&s=s%26wd%3D" + text + "%26c%3D128&from=alamap&tpl=mapcity";
            tab.add({
                xtype: 'panel',
                title: text,
                closable: true,
                id: id,
                html: "<iframe src=" + tabUri + " height='100%' width='100%'></iframe>"
            });
        }
    }
    tab.setActiveTab(id);
}
//初始化操作emp表需要的store、form
MyApp.initEmp = function () {
    var empPerPage = 5;
    var store = new Ext.data.JsonStore({
        storeId: 'empStore',
        pageSize: empPerPage,
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
    //定义表单窗口
    Ext.create('Ext.window.Window', {
        title: '新增数据',
        id: 'empWin',
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
                    id: 'empFormDeptStore',
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
                                Ext.getCmp("empWin").hide();
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
            },
            show: function () {
                Ext.data.StoreManager.lookup('empFormDeptStore').reload();
            }
        }
    });
}
//初始化操作dept表需要的store
MyApp.initDept = function () {
    var pageSize = 5;
    var store = new Ext.data.JsonStore({
        storeId: 'deptStore',
        autoLoad: true,
        pageSize: pageSize,
        proxy: {
            type: 'ajax',
            url: 'main/getDeptByCond.do',
            reader: {
                type: 'json',
                totalProperty: 'total',
                rootProperty: 'depts'
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

}
//初始化三级联动下拉菜单的store
MyApp.initCombo = function () {
    var provinceStore = Ext.create('Ext.data.Store', {
        id: 'provinceStore',
        fields: [{name: 'provinceId'}, {name: 'province'}],
        proxy: {
            type: 'ajax',
            url: 'main/getProvince.do'
        }
    });
    var cityStore = Ext.create('Ext.data.Store', {
        id: 'cityStore',
        fields: [{name: 'cityId'}, {name: 'city'}],
        proxy: {
            type: 'ajax',
            url: 'main/getCity.do',
            extraParams: {provinceId: 0}
        }
    });
    var areaStore = Ext.create('Ext.data.Store', {
        id: 'areaStore',
        fields: [{name: 'areaId'}, {name: 'area'}],
        proxy: {
            type: 'ajax',
            url: 'main/getArea.do',
            extraParams: {cityId: 0}
        }
    });
}