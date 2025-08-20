import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import SuperheroList from './components/Superhero/List';
import SuperheroForm from './components/Superhero/Form';
import SuperheroDetails from './components/Superhero/Details';

import './App.css';

const App = () => {
	return (
		<BrowserRouter>
			<Layout>
				<Routes>
					<Route
						path="/"
						element={
							<Navigate
								to="/heroes"
								replace
							/>
						}
					/>
					<Route
						path="/heroes"
						element={<SuperheroList />}
					/>
					<Route
						path="/heroes/new"
						element={<SuperheroForm />}
					/>
					<Route
						path="/heroes/:id"
						element={<SuperheroDetails />}
					/>
					<Route
						path="/heroes/:id/edit"
						element={<SuperheroForm />}
					/>
				</Routes>
			</Layout>
		</BrowserRouter>
	);
};

export default App;
