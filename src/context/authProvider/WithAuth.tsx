import { JSX, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";

export function withAuth<TProps extends JSX.IntrinsicAttributes>(
    Component: React.ComponentType<TProps>,
    redirectTo = "/login",
) {
    const AuthenticatedComponent: React.FC<TProps> = (props) => {
        const navigate = useNavigate();
        const { authState: { accessToken } } = useAuth();

        useEffect(() => {
            if (!accessToken) {
                navigate(redirectTo);
            }
        }, [accessToken, navigate, redirectTo]);

        return <Component {...props} />;
    };

    return AuthenticatedComponent;
}

export default withAuth;
