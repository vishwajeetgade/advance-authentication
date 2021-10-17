import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/routing/PrivateRoute";
import PrivateScreen from "./components/screens/PrivateScreen";
import LoginScreen from "./components/screens/LoginScreen";
import RegisterScreen from "./components/screens/RegisterScreen";
import ForgetPasswordScreen from "./components/screens/ForgetPasswordScreen";
import ResetPasswordScreen from "./components/screens/ResetPasswordScreen";

const App = () => {
  return (
    <Router>
      <Switch>
        <PrivateRoute exact path ="/" component={PrivateScreen}/>
        <Route exact path="/login" component={LoginScreen} />
        <Route exact path="/register" component={RegisterScreen} />
        <Route exact path="/forgetpassword" component={ForgetPasswordScreen} />
        <Route exact path="/passwordreset/:resetToken" component={ResetPasswordScreen} />
      </Switch>
    </Router>
  );
}

export default App;
