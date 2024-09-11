module.exports = {
    // The default GET request.
    'POST /mock/allView': (req, res) => {
        let i = 5;
        let { date } = req.body
        let legend = {
            '信用评级': '#095dd1',
            '入库': '#dd6d22',
            '授信': '#7ab509',
            '授信变更': '#fff002',
            '合同签订': '#42adfb',
            '合同变更': '#fd3f1a',
            '发放': '#25e64a',
            '支付': '#bd5bfe',
            '回收': '#6992c8',
            '核销': '#cca502'
        };
        let years = []
        let legends = [];
        let preYear = new Date().getFullYear() - 1;

        for (let leg in legend) {
            legends.push(leg);
        }

        if (date && date.length === 2) {
            let startY = new Date(date[0]).getFullYear();
            let endY = new Date(date[1]).getFullYear();

            if (endY === startY) {
                if (endY > preYear) {
                    years = [];
                } else {
                    years = [endY];
                }
            } else if (startY > preYear) {
                years = [];
            } else if (endY < preYear) {
                i = endY - startY + 1;
                while (i !== 0) {
                    i--;
                    years.push(endY - i);
                }
            } else if (endY >= preYear) {
                i = preYear - startY + 1;
                while (i !== 0) {
                    i--;
                    years.push(preYear - i);
                }
            }

        } else {
            while (i !== 0) {
                i--;
                years.push(preYear - i);
            }
        }

        let getData = () => {
            let quarterData = {}
            let monthData = {}
            let dayData = {}

            let yearIndexs = [];
            let yearMonthIndex = [];
            if (years.length < 1) {
                return {
                    quarterData,
                    monthData,
                    dayData
                };
            }

            let i = 3;
            while (i !== 0) {
                i--;
                let year = years[parseInt(Math.random() * years.length)];
                let months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
                let days = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
                    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
                    '21', '22', '23', '24', '25', '26', '27', '28'
                ];
                let yaerMonth = year + '-' + months[Math.floor(Math.random() * 12)];
                let quarterIndexs = [];
                let monthIndexs = [];
                let dayIndexs = [];
                quarterData[year] = {};
                monthData[year] = {};
                dayData[yaerMonth] = {};
                let j = 4;
                while (j !== 0) {
                    j--;
                    let q = 'Q' + Math.ceil(Math.random() * 4);
                    let m = months[Math.floor(Math.random() * 12)];
                    let d = days[Math.floor(Math.random() * 28)];

                    quarterData[year][q] = [];
                    monthData[year][m] = []
                    dayData[yaerMonth][d] = []

                    let k = 3;
                    while (k !== 0) {
                        k--;
                        quarterData[year][q].push(legends[parseInt(Math.random() * legends.length)]);
                        monthData[year][m].push(legends[parseInt(Math.random() * legends.length)]);
                        dayData[yaerMonth][d].push(legends[parseInt(Math.random() * legends.length)]);
                    }
                    quarterData[year][q] = Array.from(new Set(quarterData[year][q]));
                    monthData[year][m] = Array.from(new Set(monthData[year][m]));
                    dayData[yaerMonth][d] = Array.from(new Set(dayData[yaerMonth][d]));
                }

                for (let q in quarterData[year]) {
                    quarterIndexs.push(q);
                }
                let mTmp = {};
                quarterIndexs.sort();
                quarterIndexs.forEach(item => {
                    mTmp[item] = quarterData[year][item];
                });
                quarterData[year] = mTmp;

                for (let m in monthData[year]) {
                    monthIndexs.push(m);
                }
                let monthTmp = {};
                monthIndexs.sort();
                monthIndexs.forEach(item => {
                    monthTmp[item] = monthData[year][item];
                });
                monthData[year] = monthTmp;

                for (let d in dayData[yaerMonth]) {
                    dayIndexs.push(d);
                }
                let dTmp = {};
                dayIndexs.sort();
                dayIndexs.forEach(item => {
                    dTmp[item] = dayData[yaerMonth][item];
                });
                dayData[yaerMonth] = dTmp;
            }

            for (let year in quarterData) {
                yearIndexs.push(year);
            }
            let qTmp = {};
            let mTmp = {};
            yearIndexs.sort();
            yearIndexs.forEach(item => {
                qTmp[item] = quarterData[item];
                mTmp[item] = monthData[item];
            });
            quarterData = qTmp;
            monthData = mTmp;

            for (let yearMonth in dayData) {
                yearMonthIndex.push(yearMonth);
            }
            let dTmp = {};
            yearMonthIndex.sort();
            yearMonthIndex.forEach(item => {
                dTmp[item] = dayData[item];
            });
            dayData = dTmp;

            return {
                quarterData,
                monthData,
                dayData
            }
        }

        let data = {
            "code": 200,
            "msg": "成功",
            "data": {
                years: years,
                legend: legend,
                data: [{
                    key: "1",
                    title: "XXXXXX集团",
                    expand: true,
                    ...getData(),
                    children: [{
                            key: "1-1",
                            title: "XXXX有限公司",
                            expand: true,
                            children: [{
                                key: "1-1-1",
                                title: "合同ht-2131231414",
                                isLeaf: true,
                                ...getData(),
                            }, {
                                key: "1-1-2",
                                title: "合同ht-2131231414",
                                isLeaf: true,
                                ...getData(),
                            }]
                        },
                        {
                            key: "1-2",
                            title: "xxxx有限公司子公司",
                            expand: true,
                            ...getData(),
                            children: [{
                                key: "1-2-1",
                                title: "合同ht-2131231414",
                                isLeaf: true,
                                ...getData(),
                            }, {
                                key: "1-2-2",
                                title: "合同ht-2131231414",
                                isLeaf: true,
                                ...getData(),
                            }]
                        },
                        {
                            key: "1-3",
                            title: "XXXX有限公司",
                            expand: true,
                            children: [{
                                key: "1-3-1",
                                title: "合同ht-2131231414",
                                isLeaf: true,
                                ...getData(),
                            }, {
                                key: "1-3-2",
                                title: "合同ht-2131231414",
                                isLeaf: true,
                                ...getData(),
                            }]
                        },
                        {
                            key: "1-4",
                            title: "xxxx有限公司子公司",
                            expand: true,
                            ...getData(),
                            children: [{
                                key: "1-4-1",
                                title: "合同ht-2131231414",
                                isLeaf: true,
                                ...getData(),
                            }, {
                                key: "1-4-2",
                                title: "合同ht-2131231414",
                                isLeaf: true,
                                ...getData(),
                            }]
                        }
                    ]
                }]
            }
        };
        res.send(data);
    },

    '/mock/flowChart': {
        "code": 200,
        "msg": "成功",
        "data": {
            name: "某某中国有限公司建设贷款项目",
            type: "root",
            id: "0",
            expand: true,
            data: {
                projectNO: "P12345678901",
                contracts: [{
                        name: "合同编号",
                        type: "contract",
                        id: "1-0",
                        data: {
                            contractNO: "126392871618900271",
                            overdue: {
                                date: "2014-04-06",
                                currency: "人民币",
                                principal: "1000万元",
                                interest: "2万元"
                            }
                        }
                    },
                    {
                        name: "合同编号",
                        type: "contract",
                        id: "1-1",
                        data: {
                            contractNO: "126392871618900272",
                            overdue: {
                                date: "2015-10-06",
                                currency: "人民币",
                                principal: "1000万元",
                                interest: "2万元"
                            }
                        }
                    },
                    {
                        name: "合同编号",
                        type: "contract",
                        id: "1-2",
                        data: {
                            contractNO: "126392871618900273"
                        }
                    }
                ]
            },
            children: [{
                name: "资金发放",
                type: "give",
                id: "2-0",
                expand: true,
                data: {
                    giveType: "累计发放",
                    numbers: [
                        "美元182738万，共16笔",
                        "人民币100000万，共2笔"
                    ]
                },
                children: [{
                    name: "借款人",
                    type: "borrower",
                    id: "3-0",
                    expand: true,
                    data: {
                        giveType: "累计支付",
                        borrower: "某某中国建设高速公路有限责任公司",
                        numbers: [
                            "美元82738万，共16笔",
                            "人民币100000万，共2笔"
                        ]
                    },
                    children: [{
                        name: "2020年",
                        type: "year",
                        id: "4-0",
                        expand: true,
                        children: [{
                            name: "一季度",
                            type: "quarter",
                            id: "5-0",
                            expand: false,
                            children: [{
                                name: "受托支付",
                                type: "giveType",
                                id: "6-0",
                                expand: false,
                                children: [{
                                    name: "有关联关系",
                                    type: "relationship",
                                    id: "7-0",
                                    expand: false,
                                    children: [{
                                        name: "中国西部科技股份有限公司",
                                        type: "company",
                                        id: "8-0",
                                        isLeaf: true,
                                        data: {
                                            flow: "inner"
                                        }
                                    }]
                                }, {
                                    name: "无关联关系",
                                    type: "relationship",
                                    id: "7-1",
                                    expand: false,
                                    children: [{
                                        name: "中国西部建设集团有限公司内蒙古准星高…",
                                        type: "company",
                                        id: "8-1",
                                        expand: false,
                                        data: {
                                            flow: "inner"
                                        },
                                        children: [{
                                            name: "某某信息技术有限公司（北京）有限公司",
                                            type: "company",
                                            id: "9-0",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }, {
                                            name: "某某公司信息技术公司",
                                            type: "company",
                                            id: "9-1",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }]
                                    }, {
                                        name: "某某公司信息技术公司",
                                        type: "company",
                                        id: "8-2",
                                        isLeaf: true,
                                        data: {
                                            flow: "outer"
                                        }
                                    }]
                                }]
                            }, {
                                name: "自主支付",
                                type: "giveType",
                                id: "6-1",
                                expand: false,
                                children: [{
                                    name: "有关联关系",
                                    type: "relationship",
                                    id: "7-0",
                                    expand: false,
                                    children: [{
                                        name: "中国西部科技股份有限公司",
                                        type: "company",
                                        id: "8-0",
                                        isLeaf: true,
                                        data: {
                                            flow: "inner"
                                        }
                                    }]
                                }, {
                                    name: "无关联关系",
                                    type: "relationship",
                                    id: "7-1",
                                    expand: false,
                                    children: [{
                                        name: "中国西部建设集团有限公司内蒙古准星高…",
                                        type: "company",
                                        id: "8-1",
                                        expand: false,
                                        data: {
                                            flow: "inner"
                                        },
                                        children: [{
                                            name: "某某信息技术有限公司（北京）有限公司",
                                            type: "company",
                                            id: "9-0",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }, {
                                            name: "某某公司信息技术公司",
                                            type: "company",
                                            id: "9-1",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }]
                                    }, {
                                        name: "某某公司信息技术公司",
                                        type: "company",
                                        id: "8-2",
                                        isLeaf: true,
                                        data: {
                                            flow: "outer"
                                        }
                                    }]
                                }]
                            }]
                        }, {
                            name: "二季度",
                            type: "quarter",
                            id: "5-1",
                            expand: false,
                            children: [{
                                name: "受托支付",
                                type: "giveType",
                                id: "6-0",
                                expand: false,
                                children: [{
                                    name: "有关联关系",
                                    type: "relationship",
                                    id: "7-0",
                                    expand: false,
                                    children: [{
                                        name: "中国西部科技股份有限公司",
                                        type: "company",
                                        id: "8-0",
                                        isLeaf: true,
                                        data: {
                                            flow: "inner"
                                        }
                                    }]
                                }, {
                                    name: "无关联关系",
                                    type: "relationship",
                                    id: "7-1",
                                    expand: false,
                                    children: [{
                                        name: "中国西部建设集团有限公司内蒙古准星高…",
                                        type: "company",
                                        id: "8-1",
                                        expand: false,
                                        data: {
                                            flow: "inner"
                                        },
                                        children: [{
                                            name: "某某信息技术有限公司（北京）有限公司",
                                            type: "company",
                                            id: "9-0",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }, {
                                            name: "某某公司信息技术公司",
                                            type: "company",
                                            id: "9-1",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }]
                                    }, {
                                        name: "某某公司信息技术公司",
                                        type: "company",
                                        id: "8-2",
                                        isLeaf: true,
                                        data: {
                                            flow: "outer"
                                        }
                                    }]
                                }]
                            }, {
                                name: "自主支付",
                                type: "giveType",
                                id: "6-1",
                                expand: false,
                                children: [{
                                    name: "有关联关系",
                                    type: "relationship",
                                    id: "7-0",
                                    expand: false,
                                    children: [{
                                        name: "中国西部科技股份有限公司",
                                        type: "company",
                                        id: "8-0",
                                        isLeaf: true,
                                        data: {
                                            flow: "inner"
                                        }
                                    }]
                                }, {
                                    name: "无关联关系",
                                    type: "relationship",
                                    id: "7-1",
                                    expand: false,
                                    children: [{
                                        name: "中国西部建设集团有限公司内蒙古准星高…",
                                        type: "company",
                                        id: "8-1",
                                        expand: false,
                                        data: {
                                            flow: "inner"
                                        },
                                        children: [{
                                            name: "某某信息技术有限公司（北京）有限公司",
                                            type: "company",
                                            id: "9-0",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }, {
                                            name: "某某公司信息技术公司",
                                            type: "company",
                                            id: "9-1",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }]
                                    }, {
                                        name: "某某公司信息技术公司",
                                        type: "company",
                                        id: "8-2",
                                        isLeaf: true,
                                        data: {
                                            flow: "outer"
                                        }
                                    }]
                                }]
                            }]
                        }, {
                            name: "三季度",
                            type: "quarter",
                            id: "5-2",
                            expand: false,
                            children: [{
                                name: "受托支付",
                                type: "giveType",
                                id: "6-0",
                                expand: false,
                                children: [{
                                    name: "有关联关系",
                                    type: "relationship",
                                    id: "7-0",
                                    expand: false,
                                    children: [{
                                        name: "中国西部科技股份有限公司",
                                        type: "company",
                                        id: "8-0",
                                        isLeaf: true,
                                        data: {
                                            flow: "inner"
                                        }
                                    }]
                                }, {
                                    name: "无关联关系",
                                    type: "relationship",
                                    id: "7-1",
                                    expand: false,
                                    children: [{
                                        name: "中国西部建设集团有限公司内蒙古准星高…",
                                        type: "company",
                                        id: "8-1",
                                        expand: false,
                                        data: {
                                            flow: "inner"
                                        },
                                        children: [{
                                            name: "某某信息技术有限公司（北京）有限公司",
                                            type: "company",
                                            id: "9-0",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }, {
                                            name: "某某公司信息技术公司",
                                            type: "company",
                                            id: "9-1",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }]
                                    }, {
                                        name: "某某公司信息技术公司",
                                        type: "company",
                                        id: "8-2",
                                        isLeaf: true,
                                        data: {
                                            flow: "outer"
                                        }
                                    }]
                                }]
                            }, {
                                name: "自主支付",
                                type: "giveType",
                                id: "6-1",
                                expand: false,
                                children: [{
                                    name: "有关联关系",
                                    type: "relationship",
                                    id: "7-0",
                                    expand: false,
                                    children: [{
                                        name: "中国西部科技股份有限公司",
                                        type: "company",
                                        id: "8-0",
                                        isLeaf: true,
                                        data: {
                                            flow: "inner"
                                        }
                                    }]
                                }, {
                                    name: "无关联关系",
                                    type: "relationship",
                                    id: "7-1",
                                    expand: false,
                                    children: [{
                                        name: "中国西部建设集团有限公司内蒙古准星高…",
                                        type: "company",
                                        id: "8-1",
                                        expand: false,
                                        data: {
                                            flow: "inner"
                                        },
                                        children: [{
                                            name: "某某信息技术有限公司（北京）有限公司",
                                            type: "company",
                                            id: "9-0",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }, {
                                            name: "某某公司信息技术公司",
                                            type: "company",
                                            id: "9-1",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }]
                                    }, {
                                        name: "某某公司信息技术公司",
                                        type: "company",
                                        id: "8-2",
                                        isLeaf: true,
                                        data: {
                                            flow: "outer"
                                        }
                                    }]
                                }]
                            }]
                        }, {
                            name: "四季度",
                            type: "quarter",
                            id: "5-3",
                            expand: false,
                            children: [{
                                name: "受托支付",
                                type: "giveType",
                                id: "6-0",
                                expand: false,
                                children: [{
                                    name: "有关联关系",
                                    type: "relationship",
                                    id: "7-0",
                                    expand: false,
                                    children: [{
                                        name: "中国西部科技股份有限公司",
                                        type: "company",
                                        id: "8-0",
                                        isLeaf: true,
                                        data: {
                                            flow: "inner"
                                        }
                                    }]
                                }, {
                                    name: "无关联关系",
                                    type: "relationship",
                                    id: "7-1",
                                    expand: false,
                                    children: [{
                                        name: "中国西部建设集团有限公司内蒙古准星高…",
                                        type: "company",
                                        id: "8-1",
                                        expand: false,
                                        data: {
                                            flow: "inner"
                                        },
                                        children: [{
                                            name: "某某信息技术有限公司（北京）有限公司",
                                            type: "company",
                                            id: "9-0",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }, {
                                            name: "某某公司信息技术公司",
                                            type: "company",
                                            id: "9-1",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }]
                                    }, {
                                        name: "某某公司信息技术公司",
                                        type: "company",
                                        id: "8-2",
                                        isLeaf: true,
                                        data: {
                                            flow: "outer"
                                        }
                                    }]
                                }]
                            }, {
                                name: "自主支付",
                                type: "giveType",
                                id: "6-1",
                                expand: false,
                                children: [{
                                    name: "有关联关系",
                                    type: "relationship",
                                    id: "7-0",
                                    expand: false,
                                    children: [{
                                        name: "中国西部科技股份有限公司",
                                        type: "company",
                                        id: "8-0",
                                        isLeaf: true,
                                        data: {
                                            flow: "inner"
                                        }
                                    }]
                                }, {
                                    name: "无关联关系",
                                    type: "relationship",
                                    id: "7-1",
                                    expand: false,
                                    children: [{
                                        name: "中国西部建设集团有限公司内蒙古准星高…",
                                        type: "company",
                                        id: "8-1",
                                        expand: false,
                                        data: {
                                            flow: "inner"
                                        },
                                        children: [{
                                            name: "某某信息技术有限公司（北京）有限公司",
                                            type: "company",
                                            id: "9-0",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }, {
                                            name: "某某公司信息技术公司",
                                            type: "company",
                                            id: "9-1",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }]
                                    }, {
                                        name: "某某公司信息技术公司",
                                        type: "company",
                                        id: "8-2",
                                        isLeaf: true,
                                        data: {
                                            flow: "outer"
                                        }
                                    }]
                                }]
                            }]
                        }]
                    }, {
                        name: "2019年",
                        type: "year",
                        id: "4-1",
                        expand: true,
                        children: [{
                            name: "一季度",
                            type: "quarter",
                            id: "5-0",
                            expand: false,
                            children: [{
                                name: "受托支付",
                                type: "giveType",
                                id: "6-0",
                                expand: false,
                                children: [{
                                    name: "有关联关系",
                                    type: "relationship",
                                    id: "7-0",
                                    expand: false,
                                    children: [{
                                        name: "中国西部科技股份有限公司",
                                        type: "company",
                                        id: "8-0",
                                        isLeaf: true,
                                        data: {
                                            flow: "inner"
                                        }
                                    }]
                                }, {
                                    name: "无关联关系",
                                    type: "relationship",
                                    id: "7-1",
                                    expand: false,
                                    children: [{
                                        name: "中国西部建设集团有限公司内蒙古准星高…",
                                        type: "company",
                                        id: "8-1",
                                        expand: false,
                                        data: {
                                            flow: "inner"
                                        },
                                        children: [{
                                            name: "某某信息技术有限公司（北京）有限公司",
                                            type: "company",
                                            id: "9-0",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }, {
                                            name: "某某公司信息技术公司",
                                            type: "company",
                                            id: "9-1",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }]
                                    }, {
                                        name: "某某公司信息技术公司",
                                        type: "company",
                                        id: "8-2",
                                        isLeaf: true,
                                        data: {
                                            flow: "outer"
                                        }
                                    }]
                                }]
                            }, {
                                name: "自主支付",
                                type: "giveType",
                                id: "6-1",
                                expand: false,
                                children: [{
                                    name: "有关联关系",
                                    type: "relationship",
                                    id: "7-0",
                                    expand: false,
                                    children: [{
                                        name: "中国西部科技股份有限公司",
                                        type: "company",
                                        id: "8-0",
                                        isLeaf: true,
                                        data: {
                                            flow: "inner"
                                        }
                                    }]
                                }, {
                                    name: "无关联关系",
                                    type: "relationship",
                                    id: "7-1",
                                    expand: false,
                                    children: [{
                                        name: "中国西部建设集团有限公司内蒙古准星高…",
                                        type: "company",
                                        id: "8-1",
                                        expand: false,
                                        data: {
                                            flow: "inner"
                                        },
                                        children: [{
                                            name: "某某信息技术有限公司（北京）有限公司",
                                            type: "company",
                                            id: "9-0",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }, {
                                            name: "某某公司信息技术公司",
                                            type: "company",
                                            id: "9-1",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }]
                                    }, {
                                        name: "某某公司信息技术公司",
                                        type: "company",
                                        id: "8-2",
                                        isLeaf: true,
                                        data: {
                                            flow: "outer"
                                        }
                                    }]
                                }]
                            }]
                        }, {
                            name: "二季度",
                            type: "quarter",
                            id: "5-1",
                            expand: false,
                            children: [{
                                name: "受托支付",
                                type: "giveType",
                                id: "6-0",
                                expand: false,
                                children: [{
                                    name: "有关联关系",
                                    type: "relationship",
                                    id: "7-0",
                                    expand: false,
                                    children: [{
                                        name: "中国西部科技股份有限公司",
                                        type: "company",
                                        id: "8-0",
                                        isLeaf: true,
                                        data: {
                                            flow: "inner"
                                        }
                                    }]
                                }, {
                                    name: "无关联关系",
                                    type: "relationship",
                                    id: "7-1",
                                    expand: false,
                                    children: [{
                                        name: "中国西部建设集团有限公司内蒙古准星高…",
                                        type: "company",
                                        id: "8-1",
                                        expand: false,
                                        data: {
                                            flow: "inner"
                                        },
                                        children: [{
                                            name: "某某信息技术有限公司（北京）有限公司",
                                            type: "company",
                                            id: "9-0",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }, {
                                            name: "某某公司信息技术公司",
                                            type: "company",
                                            id: "9-1",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }]
                                    }, {
                                        name: "某某公司信息技术公司",
                                        type: "company",
                                        id: "8-2",
                                        isLeaf: true,
                                        data: {
                                            flow: "outer"
                                        }
                                    }]
                                }]
                            }, {
                                name: "自主支付",
                                type: "giveType",
                                id: "6-1",
                                expand: false,
                                children: [{
                                    name: "有关联关系",
                                    type: "relationship",
                                    id: "7-0",
                                    expand: false,
                                    children: [{
                                        name: "中国西部科技股份有限公司",
                                        type: "company",
                                        id: "8-0",
                                        isLeaf: true,
                                        data: {
                                            flow: "inner"
                                        }
                                    }]
                                }, {
                                    name: "无关联关系",
                                    type: "relationship",
                                    id: "7-1",
                                    expand: false,
                                    children: [{
                                        name: "中国西部建设集团有限公司内蒙古准星高…",
                                        type: "company",
                                        id: "8-1",
                                        expand: false,
                                        data: {
                                            flow: "inner"
                                        },
                                        children: [{
                                            name: "某某信息技术有限公司（北京）有限公司",
                                            type: "company",
                                            id: "9-0",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }, {
                                            name: "某某公司信息技术公司",
                                            type: "company",
                                            id: "9-1",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }]
                                    }, {
                                        name: "某某公司信息技术公司",
                                        type: "company",
                                        id: "8-2",
                                        isLeaf: true,
                                        data: {
                                            flow: "outer"
                                        }
                                    }]
                                }]
                            }]
                        }, {
                            name: "三季度",
                            type: "quarter",
                            id: "5-2",
                            expand: false,
                            children: [{
                                name: "受托支付",
                                type: "giveType",
                                id: "6-0",
                                expand: false,
                                children: [{
                                    name: "有关联关系",
                                    type: "relationship",
                                    id: "7-0",
                                    expand: false,
                                    children: [{
                                        name: "中国西部科技股份有限公司",
                                        type: "company",
                                        id: "8-0",
                                        isLeaf: true,
                                        data: {
                                            flow: "inner"
                                        }
                                    }]
                                }, {
                                    name: "无关联关系",
                                    type: "relationship",
                                    id: "7-1",
                                    expand: false,
                                    children: [{
                                        name: "中国西部建设集团有限公司内蒙古准星高…",
                                        type: "company",
                                        id: "8-1",
                                        expand: false,
                                        data: {
                                            flow: "inner"
                                        },
                                        children: [{
                                            name: "某某信息技术有限公司（北京）有限公司",
                                            type: "company",
                                            id: "9-0",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }, {
                                            name: "某某公司信息技术公司",
                                            type: "company",
                                            id: "9-1",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }]
                                    }, {
                                        name: "某某公司信息技术公司",
                                        type: "company",
                                        id: "8-2",
                                        isLeaf: true,
                                        data: {
                                            flow: "outer"
                                        }
                                    }]
                                }]
                            }, {
                                name: "自主支付",
                                type: "giveType",
                                id: "6-1",
                                expand: false,
                                children: [{
                                    name: "有关联关系",
                                    type: "relationship",
                                    id: "7-0",
                                    expand: false,
                                    children: [{
                                        name: "中国西部科技股份有限公司",
                                        type: "company",
                                        id: "8-0",
                                        isLeaf: true,
                                        data: {
                                            flow: "inner"
                                        }
                                    }]
                                }, {
                                    name: "无关联关系",
                                    type: "relationship",
                                    id: "7-1",
                                    expand: false,
                                    children: [{
                                        name: "中国西部建设集团有限公司内蒙古准星高…",
                                        type: "company",
                                        id: "8-1",
                                        expand: false,
                                        data: {
                                            flow: "inner"
                                        },
                                        children: [{
                                            name: "某某信息技术有限公司（北京）有限公司",
                                            type: "company",
                                            id: "9-0",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }, {
                                            name: "某某公司信息技术公司",
                                            type: "company",
                                            id: "9-1",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }]
                                    }, {
                                        name: "某某公司信息技术公司",
                                        type: "company",
                                        id: "8-2",
                                        isLeaf: true,
                                        data: {
                                            flow: "outer"
                                        }
                                    }]
                                }]
                            }]
                        }, {
                            name: "四季度",
                            type: "quarter",
                            id: "5-3",
                            expand: false,
                            children: [{
                                name: "受托支付",
                                type: "giveType",
                                id: "6-0",
                                expand: false,
                                children: [{
                                    name: "有关联关系",
                                    type: "relationship",
                                    id: "7-0",
                                    expand: false,
                                    children: [{
                                        name: "中国西部科技股份有限公司",
                                        type: "company",
                                        id: "8-0",
                                        isLeaf: true,
                                        data: {
                                            flow: "inner"
                                        }
                                    }]
                                }, {
                                    name: "无关联关系",
                                    type: "relationship",
                                    id: "7-1",
                                    expand: false,
                                    children: [{
                                        name: "中国西部建设集团有限公司内蒙古准星高…",
                                        type: "company",
                                        id: "8-1",
                                        expand: false,
                                        data: {
                                            flow: "inner"
                                        },
                                        children: [{
                                            name: "某某信息技术有限公司（北京）有限公司",
                                            type: "company",
                                            id: "9-0",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }, {
                                            name: "某某公司信息技术公司",
                                            type: "company",
                                            id: "9-1",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }]
                                    }, {
                                        name: "某某公司信息技术公司",
                                        type: "company",
                                        id: "8-2",
                                        isLeaf: true,
                                        data: {
                                            flow: "outer"
                                        }
                                    }]
                                }]
                            }, {
                                name: "自主支付",
                                type: "giveType",
                                id: "6-1",
                                expand: false,
                                children: [{
                                    name: "有关联关系",
                                    type: "relationship",
                                    id: "7-0",
                                    expand: false,
                                    children: [{
                                        name: "中国西部科技股份有限公司",
                                        type: "company",
                                        id: "8-0",
                                        isLeaf: true,
                                        data: {
                                            flow: "inner"
                                        }
                                    }]
                                }, {
                                    name: "无关联关系",
                                    type: "relationship",
                                    id: "7-1",
                                    expand: false,
                                    children: [{
                                        name: "中国西部建设集团有限公司内蒙古准星高…",
                                        type: "company",
                                        id: "8-1",
                                        expand: false,
                                        data: {
                                            flow: "inner"
                                        },
                                        children: [{
                                            name: "某某信息技术有限公司（北京）有限公司",
                                            type: "company",
                                            id: "9-0",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }, {
                                            name: "某某公司信息技术公司",
                                            type: "company",
                                            id: "9-1",
                                            isLeaf: true,
                                            data: {
                                                flow: "inner"
                                            }
                                        }]
                                    }, {
                                        name: "某某公司信息技术公司",
                                        type: "company",
                                        id: "8-2",
                                        isLeaf: true,
                                        data: {
                                            flow: "outer"
                                        }
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }, ]
        }
    },
}