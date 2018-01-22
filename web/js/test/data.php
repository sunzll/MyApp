{
        root:{
            text:'导航',
            expanded: true,
            children:[
                {
                id:'1',
                text:'XX公司',
                children:[
                    {id: '010201', text: '员工信息', leaf: true},
                    {id: '010202', text: '部门信息', leaf: true}
                    ]
                },
                {
                    id:'0',
                    text:'省市区菜单',
                    children:[{
                                  id: '01',
                                  text: '山西省',
                                  children: [
                                      {id: '0101', text: '大同市', leaf: true},
                                      {
                                          id: '0102', text: '太原市', expanded: true, children: [
                                          {id: '010201', text: '迎泽区', leaf: true},
                                          {id: '010202', text: '小店区', leaf: true}
                                      ]
                                      },
                                      {id: '0103', text: '运城市', leaf: true}
                                  ]
                              }]
                }

            ]
        }
    }