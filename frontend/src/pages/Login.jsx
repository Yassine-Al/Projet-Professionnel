import Formlogin from "../components/Formlogin";

export default function Login() {
    return (
        <div>
            <h1>Login Page</h1>
            <p> Dans cette page on va afficher un formulaire de login 
                <br />
                Avec deux champs : email et password
                <br />
                Un button pour se connecter
                <br />
                Un button pour s'inscrire
                <br />
                Enfin un footer
            </p>
                <br /><br /><br />
            <Formlogin/>
        </div>
    )
}