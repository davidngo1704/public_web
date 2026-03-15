import React, { useEffect } from 'react';
import { Route, withRouter, useLocation } from 'react-router-dom';
import App from "./App";
import Login from "./pages/demo/Login";
import Error from "./pages/demo/Error";
import NotFound from "./pages/demo/NotFound";
import Access from "./pages/demo/Access";
import Landing from './pages/demo/Landing';
import { TreeDemo } from './pages/demo/TreeDemoV2';

const AppWrapper = (props: any) => {
	let location = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [location]);

	switch (props.location.pathname) {
		case "/login":
			return <Route path="/login" component={Login} />
		case "/error":
			return <Route path="/error" component={Error} />
		case "/notfound":
			return <Route path="/notfound" component={NotFound} />
		case "/access":
			return <Route path="/access" component={Access} />
		case "/landing":
			return <Route path="/landing" component={Landing} />
		case "/file":
			return <Route path="/file" component={TreeDemo} />
		default:
			return <App />;
	}

}

export default withRouter(AppWrapper);
