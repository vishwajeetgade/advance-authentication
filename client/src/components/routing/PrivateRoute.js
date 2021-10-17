import { Route, Redirect } from "react-router"

const PrivateRoute = ({component: Component, ...rest}) => {
    return (
        <Route 
            {...rest}
            render={(props) => 
                localStorage.getItem("authToken") ? (
                    <Component {...props}/>
                ): (
                    <Redirect to="/login" />
                )
            }
        />
    )
}

export default PrivateRoute
