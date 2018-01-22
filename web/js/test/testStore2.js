Ext.application({
    name:"Al",
    launch:function(){
       Al.init();
    }
});

Al.init=function(){
    var store=Ext.create('Ext.data.Store', {
        fields: [{name: 'id'}, {name: 'name'}],
        proxy: {
            type: 'ajax',
            url: 'main/getAllDepts.do'
        },
        listeners:{
            load:function(){
                this.add({id:0,name:'所有部门'});
                this.each(function(record){
                    console.dir(record);
                });
            }
        }
    });
    store.load();

    store.getPageSize();
}