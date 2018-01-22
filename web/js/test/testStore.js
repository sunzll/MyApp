Ext.application({
    name:"Al",
    launch:function(){
       Al.init();
    }
});

Al.init=function(){
    Ext.define('User', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'firstName', type: 'string'},
            {name: 'lastName',  type: 'string'},
            {name: 'age',       type: 'int'},
            {name: 'eyeColor',  type: 'string'}
        ]
    });
    var myStore = Ext.create('Ext.data.Store', {
        model: 'User',
        proxy: {
            type: 'ajax',
            url: 'aa',
            extraParams:{id : 23},
            reader: {
                type: 'json',
                rootProperty: 'users'
            }
        },
        autoLoad: false
    });
    //
myStore.getProxy().setConfig('extraParams',{na:'nanana'});
myStore.getProxy().setConfig('url','js/test/com.js');
    myStore.load();
}