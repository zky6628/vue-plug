/**
 * 配置所有例子路由
 * @module 页面主路由
 * @author zhanghuan
 * @date 2020/12/22
 */
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import D3Tree from '../pages/tree';

const PageRouter: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route path={"/d3-tree"} component={D3Tree} />
                <Route exact path={"/"} render={() => (
                    <Redirect to={"/d3-tree"} />
                )} />
            </Switch>
        </Router>
    );
}

export default PageRouter;