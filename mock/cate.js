export default [


    {

        url: '/vue-admin-template/cate/list',
        type: 'get',
        response: config => {
            return {
                code: 20000,
                data:  [
                    {
                      id: 1,
                      name: "Level one 1",
                      children: [
                        {
                          id: 4,
                          name: "Level two 1-1",
                          children: [
                            {
                              id: 9,
                              name: "Level three 1-1-1"
                            },
                            {
                              id: 10,
                              name: "Level three 1-1-2"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: 2,
                      name: "Level one 2",
                      children: [
                        {
                          id: 5,
                          name: "Level two 2-1"
                        },
                        {
                          id: 6,
                          name: "Level two 2-2"
                        }
                      ]
                    },
                    {
                      id: 3,
                      name: "Level one 3",
                      children: [
                        {
                          id: 7,
                          name: "Level two 3-1"
                        },
                        {
                          id: 8,
                          name: "Level two 3-2"
                        }
                      ]
                    }
                  ]
            }
        }
    }
]