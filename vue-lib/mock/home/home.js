module.exports = {
  // The default GET request.
  '/mock/menu': {
    "code": 200,
    "msg": "成功",
    "data": [{
      name: "home",
      path: "/home/index",
      title: "首页"
    }, {
      name: "maps",
      path: "/maps",
      title: "图集",
      children: [{
        name: "allView",
        path: "/maps/allView",
        title: "全景图"
      },
      {
        name: "flowChart",
        path: "/maps/flowChart",
        title: "流向图"
      },
      {
        name: "flowMap",
        path: "/maps/flowMap",
        title: "流程图"
      }
      ]
    }, {
      name: "recorder",
      path: "/recorder",
      title: "录音",
      children: [{
        name: "recorder",
        path: "/recorder/index",
        title: "录音并上传"
      },
      ]
    }]
  },
}