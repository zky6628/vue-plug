module.exports = {
    // =====================
    // The default GET request.
    // https://github.com/jaywcjlove/mocker-api/pull/63
    'POST /upload': {
        "code": 1,
        "msg": "成功",
        "key": '/pic1_1.png'
    },
    
    'GET /api/user/list': [
        {
            id: 1,
            username: 'kenny',
            sex: 6
        }, {
            id: 2,
            username: 'kenny',
            sex: 6
        }
    ],
    
    
    'DELETE /api/user/:id': (req, res) =>
    {
        console.log('---->', req.body)
        console.log('---->', req.params.id)
        res.send({ status: 'ok', message: '删除成功！' });
    }
}