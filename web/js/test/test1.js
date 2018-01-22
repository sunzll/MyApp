Ext.application({
    name: 'MyApp',

    launch: function () {
        MyApp.initMain();
    }
});
//发送ajax请求数据，请求成功再调createTree函数，创建viewport和treepanel
MyApp.initMain = function () {
    Ext.Ajax.request({
        url: 'main/getTreeMenu.do',

        success: function (response, opts) {
            var obj = Ext.decode(response.responseText);
            console.dir(obj);
            MyApp.createTree(obj);
        },

        failure: function (response, opts) {
            console.log('server-side failure with status code ' + response.status);
        }
    });
};
MyApp.createTree = function (data) {
    var store = Ext.create('Ext.data.TreeStore', data);

    var tree = Ext.create('Ext.tree.Panel', {
        store: store,
        id: 'tree',
        rootVisible: false,
        listeners: {
            itemclick: function (v, r, item) {
                console.log(r.data.text);
                window.open("http://www.baidu.com/s?wd="+r.data.text);
            }
        }
    });
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
            width: 200,
            layout: 'fit',
            items: [tree]
        }, {
            region: 'south',
            collapsible: false,
            html: '&copy 2017/11/16',
            split: false,
            height: 50,
            minHeight: 50
        },  {
            region: 'center',
            xtype: 'tabpanel', // TabPanel itself has no title
            activeTab: 0,      // First tab active by default
            items: {
                title: 'Default Tab',
                html: 'The first tab\'s content. Others may be added dynamically'
            }
        }]
    });
};
