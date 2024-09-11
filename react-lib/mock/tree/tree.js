module.exports = {
    // =====================
    // The default GET request.
    // https://github.com/jaywcjlove/mocker-api/pull/63
    '/api/getTree': {
        "code": 200,
        "msg": "成功",
        "data":{
            "name": "flare",
            "type": "prod",
            "tmp": "3200tpm",
            "error": "14err",
            "avgTime": "1234ms",
            "children": [
                {
                    "name": "data",
                    "type": "prod",
                    "tmp": "3200tpm",
                    "error": "14err",
                    "avgTime": "1234ms",
                    "children": [
                        {
                            "name": "DataField",
                            "type": "prod",
                            "tmp": "3240tpm",
                            "error": "19err",
                            "avgTime": "1334ms"
                        },
                        {
                            "name": "DataSchema",
                            "type": "stage",
                            "tmp": "3280tpm",
                            "error": "12err",
                            "avgTime": "1934ms"
                        },
                        {
                            "name": "DataSet",
                            "type": "stage",
                            "tmp": "3200tpm",
                            "error": "14err",
                            "avgTime": "1234ms"
                        }
                    ]
                },
                {
                    "name": "methods",
                    "type": "prod",
                    "tmp": "3200tpm",
                    "error": "14err",
                    "avgTime": "1234ms",
                    "children": [
                        {
                            "name": "add",
                            "type": "stage",
                            "tmp": "3200tpm",
                            "error": "94err",
                            "avgTime": "1214ms"
                        },
                        {
                            "name": "count",
                            "type": "prod",
                            "tmp": "3210tpm",
                            "error": "13err",
                            "avgTime": "1239ms"
                        },
                        {
                            "name": "mul",
                            "type": "prod",
                            "tmp": "3200tpm",
                            "error": "14err",
                            "avgTime": "1234ms"
                        },
                        {
                            "name": "sum",
                            "type": "stage",
                            "tmp": "3200tpm",
                            "error": "14err",
                            "avgTime": "1234ms"
                        }
                    ]
                }
            ]
        }
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