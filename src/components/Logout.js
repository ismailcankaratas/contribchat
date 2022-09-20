import React from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BiPowerOff } from 'react-icons/bi';
import { logoutRoute } from '../utils/APIRoutes';
import axios from 'axios';

const Logout = () => {
    const navigate = useNavigate();

    const handleClick = async () => {
        // POST LOGOUT
        await axios.get(logoutRoute, { withCredentials: true }).then((result) => {
            navigate("/login");
        })
    }
    return (
        <Button onClick={handleClick}>
            <BiPowerOff />
        </Button>
    )
}

const Button = styled.div`
display:flex;
justify-content:center;
align-items:center;
padding: .5rem;
border-radius:.5rem;
background-color:#b2b100;
border:none;
cursor: pointer;
color:white;
svg {
    font-size:1.3rem;
}
`;

export default Logout