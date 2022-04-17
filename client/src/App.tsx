import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Accomplishment from './components/Accomplishment/Accomplishment';
import Habit from './components/Habit/Habit';
import Rewards from './components/Rewards/Rewards';
import SideNav from './components/SideNav/SideNav';

function App() {
	return (
		<BrowserRouter>
			<div className='App'>
				<div className='App-container'>
					<SideNav />
					<Switch>
						<Route strict exact path='/habits' component={Habit} />
						<Route
							strict
							exact
							path='/accomplishments'
							component={Accomplishment}
						/>
						<Route strict exact path="/rewards" component={Rewards}/>
					</Switch>
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
