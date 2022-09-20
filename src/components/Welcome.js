import React from 'react'
import styled from 'styled-components';
import Robot from '../assets/robot.gif';
import { RiMenu2Line } from 'react-icons/ri';

const Welcome = ({ currentUser, reposToggle, setReposToggle }) => {
    return (
        <Container>
            {!reposToggle ? (
                <div className='welcome-header'>
                    <div className='menuIcon'>
                        <RiMenu2Line onClick={() => setReposToggle(!reposToggle)} />
                    </div>
                </div>
            ) : ""}
            <div className='welcome-main'>
                <img src={Robot} alt="" />
                <h1>
                    Welcome, <span>{currentUser.login}</span>
                </h1>
                <h3>Please select a chat to Start Messaging.</h3>
            </div>
        </Container>
    )
}

const Container = styled.div`
height:100vh;
.welcome-header {
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:1rem 2rem;
    padding-bottom:.5rem;
    border-bottom:1px solid #30363d;    
    .menuIcon {
            display:flex;
            align-items:center;
            justify-content:center;
            width: 50px;
            height: 50px;
            background-color:#161b22;
            border-radius:50%;
        }
        .menuIcon svg {
            width:25px;
            height: 25px;
        }
}

.welcome-main {
display:flex;
height: 80%;
justify-content:center;
align-items:center;
flex-direction:column;
color:white;
}
@media (max-width: 768px) {
    h1 {
        justify-content:center;
        font-size:1rem;
    }
    h3 {
        justify-content:center;
        font-size:.7rem;
    }
}
img {
    height:20rem;
}
span{
    color: #727303;
}
`;

export default Welcome