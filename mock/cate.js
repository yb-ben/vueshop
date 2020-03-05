export default [


    {

        url: '/vue-admin-template/cate/list',
        type: 'get',
        response: config => {
            return {
                code: 0,
                data:  [
                    {
                      id: 1,
                      name: "Level one 1",
                      sort:10000,
                      children: [
                        {
                          id: 4,
                          name: "Level two 1-1",
                          sort:10000,
                          children: [
                            {
                              id: 9,
                              sort:10000,
                              name: "Level three 1-1-1"
                            },
                            {
                              id: 10,
                              sort:10000,
                              name: "Level three 1-1-2"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: 2,
                      name: "Level one 2",
                      sort:10000,
                      children: [
                        {
                          id: 5,
                          sort:10000,
                          name: "Level two 2-1"
                        },
                        {
                          id: 6,
                          sort:10000,
                          name: "Level two 2-2"
                        }
                      ]
                    },
                    {
                      id: 3,
                      name: "Level one 3",
                      sort:10000,
                      children: [
                        {
                          id: 7,
                          sort:10000,
                          name: "Level two 3-1"
                        },
                        {
                          id: 8,
                          sort:10000,
                          name: "Level two 3-2"
                        }
                      ]
                    }
                  ]
            }
        }
    },

    {
      url:'/vue-admin-template/cate/add',
      type:'post',
      response: config=>{
        return {
          code : 0,
          data:[],
          msg: ''
        }
      }
    }
]