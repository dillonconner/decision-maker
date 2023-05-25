import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

const LoginForm = () => {

    const navigate = useNavigate();
    const auth = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [form, setForm] = useState({username: '', displayname: '', email: '', password: ''});

    useEffect(() => {
        const savedUser = localStorage.getItem('username');
        if(savedUser){
            setForm({username: savedUser, displayname: '', email: '', password: ''});
            document.getElementsByClassName('remember-box')[0].checked = true;
        }
    }, [])
    useEffect(() => {
        console.log('auth updates');
        if(auth.user && !auth.error){
            navigate('/', {replace:true});
        }
    }, [auth.user, auth.error])

    const handleLoginSignUpChange = (e) => {
        isSignUp ? setIsSignUp(false) : setIsSignUp(true);
        setForm({username: '', displayname: '', email: '', password: ''});
    }
    const onFormChange = (e) => setForm({...form, [e.target.name]: e.target.value});
    const handleForgotPass = (e) => {
        e.preventDefault();
        alert('Dang thats tough... Good luck remembering it');
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('sumbits');
        if(document.getElementsByClassName('remember-box')[0].checked){
            localStorage.setItem('username', form.username);
        }else {
            localStorage.removeItem('username');
        }

        if(isSignUp) {
            auth.signup(form);
        }else {
            auth.login(form.username, form.password);
        }
    }

    return (
        <div className="login popup">
            <h2 className="popup-header">{isSignUp ? 'Sign Up' : 'Log In'}</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    autoFocus
                    type='text'
                    name='username'
                    value={form.username}
                    onChange={onFormChange}
                    placeholder="Username"
                    required />
                { isSignUp &&
                    <input
                    type='text'
                    name='displayname'
                    value={form.displayname}
                    onChange={onFormChange}
                    placeholder="Display Name"
                    required />}
                { isSignUp &&
                    <input
                    type='email'
                    name='email'
                    value={form.email}
                    onChange={onFormChange}
                    placeholder="Email"
                    required />}
                <input 
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={onFormChange}
                    placeholder="Password"
                    required />
                <br/>
                <input className='remember-box' type='checkbox' name='rememberme' />
                <label className='remember-label' htmlFor='rememberme'>Remember Me</label>
                {!isSignUp && <p className='forgot-password' onClick={handleForgotPass}>Forgot Password?</p>}
                <p className='error'>{auth.error}</p>
                <button type="submit" className='login-submit'>{isSignUp ? 'Sign Up' : 'Log In'}</button>
                <p onClick={handleLoginSignUpChange}>{isSignUp ? 'or Log In' : 'or Sign Up'}</p>
            </form>
        </div>
    )
}
export default LoginForm