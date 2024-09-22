import LoginForm from "../components/user/LoginForm";

function LoginPage({ setIsLoggedIn }) {
    return (
        <section>
            <LoginForm setIsLoggedIn={setIsLoggedIn}></LoginForm>
        </section>
    )
}
export default LoginPage;