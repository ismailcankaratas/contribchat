import React from 'react'
import styled from 'styled-components';
import Logo from '../assets/banana.png'
import { RiMenu2Line } from 'react-icons/ri';

const Navbar = ({ reposToggle, setReposToggle }) => {
    return (
        <>
            <Container>
                <RiMenu2Line className='menuIcon' onClick={() => setReposToggle(!reposToggle)} />
                <img src={Logo} alt="Logo" />
            </Container >
        </>
    )
}

const Container = styled.div`
display:flex;
align-items:center;
background-color:#161b22;
padding:1rem;
.menuIcon {
    width:25px;
    height:25px;
}
`;

export default Navbar