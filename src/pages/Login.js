import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Logo from '../assets/githubLogoWhite.png'
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { getGithubMeRoute, loginRoute } from './../utils/APIRoutes';

const Login = () => {
    const navigate = useNavigate();
    const toastOptions = { position: "bottom-right", autoClose: 8000, pauseOnHover: true, draggable: true, theme: "dark" }

    useEffect(() => {
        async function getGithubUser() {
            const user = await axios.get(getGithubMeRoute, { withCredentials: true })
                .then((res) => res.data);
            if (user.status === true) return navigate("/")
        }
        getGithubUser()
    }, []);

    return (
        <>
            <FormContainer>
                <form>
                    <div className='brand'>
                        <img src={Logo} alt="" />
                        <h1>Contrib<span>Chat</span></h1>
                    </div>
                    <p>
                        ContribChat , lets you chat with contributors to the Github repository.
                    </p>
                    <a className='login-btn' href='https://github.com/login/oauth/authorize?client_id=044906178ec144196592'>Login with Github</a>
                    <span>Don't have an Github account ? <a href="https://github.com/signup" target="_blank">register</a></span>
                </form>
            </FormContainer>
            <ToastContainer />
        </>
    )
}

const FormContainer = styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction:column;
justify-content:center;
align-items:center;
gap:1rem;
background-color:#010409;
.brand {
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:1rem;
    justify-content:center;
    img {
        height: 4rem;
    }
    h1 {
        color:white;
        text-transform:uppercase;
        font-size:2rem;
        span {
            font-weight:500;
            color:#b2b100;
        }
    }
}
form {
    display:flex;
    flex-direction:column;
    gap:2rem;
    background-color: #0d1117;
    border-radius:2rem;
    padding:3rem 2rem;
p {
    color:white;
    font-size:1.2rem;
    word-spacing:.1rem;
}
.login-btn {
    background-color:#b2b100;
    color:white;
    padding:1.5rem 2rem;
    border:none;
    font-weight:bold;
    cursor: pointer;
    border-radius:.4rem;
    text-transform:uppercase;
    transition: 0.5s ease-in-out;
    text-align:center;
    text-decoration:none;
    &:hover {
        background-color:#010409;
    }
}
span {
    color:white;
    text-transform:uppercase;
    a{
        color:#b2b100;
        text-decoration:none;
        font-weight:bold
    }
}
}
`;

export default Login;