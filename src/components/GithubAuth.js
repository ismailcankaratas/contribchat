import React, { useEffect } from 'react'
import styled from 'styled-components';
import loader from '../assets/loader.gif'
import axios from 'axios';
import { getGithubLoginRoute } from '../utils/APIRoutes';
import { useNavigate } from 'react-router-dom';

const GithubAuth = () => {
    const code = window.location.href.split('?')[1].split("code=")[1];
    const navigate = useNavigate();
    useEffect(() => {
        async function getAccountUser() {
            await axios.get(`${getGithubLoginRoute}?code=${code}`, { withCredentials: true }).then((result) => {
                if (result.data.success == true) {
                    navigate("/");
                }
            })
        }
        getAccountUser();
    }, [code]);

    return (
        <Container>
            <div>
                <img src={loader} alt="loader" className='loader' />
                Logging in...
            </div>
        </Container>
    )
}
const Container = styled.div`
width:100vw;
height:100vh;
display:flex;
align-items:center;
justify-content:center;
background-color:#161b22;
div {
    display:flex;
    flex-direction:column;
    align-items:center;
    img {
        width: 100%;
    }
}

`;
export default GithubAuth