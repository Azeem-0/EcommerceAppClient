import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import miniNavBar from "../../assests/mini-navigation.json";
import { RxCross1 } from "react-icons/rx";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import TokenValidity from "../Authentication/TokenValidity";
import { sContext } from "../ContextApi/SearchBarContext";
import Logo from "./Logo";
import './Navigation.css';

const SearchBar = (props) => {
    const { showMiniNavBar } = props;
    const { search, setSearch } = useContext(sContext);
    const navigate = useNavigate();
    const submitForm = (e) => {
        e.preventDefault();
        showMiniNavBar(false);
        navigate("/products");
    }
    const changeInput = (e) => {
        const { value } = e.target;
        setSearch(value);
    }
    return <form id="search-bar" onSubmit={submitForm}>
        <input type="text" name="name" onChange={changeInput} placeholder="Enter Product's Name" value={search}></input>
        <button type="submit">Search</button>
    </form>
}
const MiniNavigation = (props) => {
    const navigate = useNavigate();
    const { showMiniNavBar, miniBar, loggedIn, changeComponent } = props;
    const changePage = (e) => {
        const { name } = e.target;
        navigate(name);
    }
    return <motion.div className="two-navigation">
        {miniBar ? <RxCross1 className="cross" onClick={showMiniNavBar} /> : <Lottie className="lottie" animationData={miniNavBar} loop={false} onClick={showMiniNavBar} />}
        {miniBar && <motion.div
            initial={{ transform: "translateY(-28em)" }}
            animate={{ transform: "translateY(0em)" }}
            exit={{ transform: "translate(-28em)" }}
            transition={{ duration: 0.5 }}
            id="mini-navigation">
            <div>
                <button name="/" onClick={changePage}>Home</button>
                {loggedIn && <button name="/profile" onClick={changePage}>Profile</button>}
                <button name="/products" onClick={changePage}>Products</button>
                {loggedIn && <button name='/addproducts' onClick={changePage}>Become Seller</button>}
                <button name="/faqs" onClick={changePage}>Faqs</button>
                <button name="log" className="log-button" onClick={changeComponent}>{loggedIn ? "Log Out" : "Log In"}</button>
                <SearchBar showMiniNavBar={showMiniNavBar} />
            </div>
        </motion.div>}
    </motion.div>
}


const MaxiNavigation = (props) => {
    const navigate = useNavigate();
    const { loggedIn, changeComponent, showMiniNavBar } = props;
    const { pathname } = useLocation();
    const changePage = (e) => {
        const { name } = e.target;
        navigate(name);
    }
    return <div className="one-navigation">
        <div>
            <button className={pathname === '/' ? 'current' : null} name="/" onClick={changePage}>Home</button>
            {loggedIn && <button className={pathname === '/profile' ? 'current' : null} name="/profile" onClick={changePage}>Profile</button>}
            <button className={pathname === '/products' ? 'current' : null} name="/products" onClick={changePage}>Products</button>
            {loggedIn && <button className={pathname === '/addproducts' ? 'current' : null} name='/addproducts' onClick={changePage}>Become Seller</button>}
            <button className={pathname === '/faqs' ? 'current' : null} name="/faqs" onClick={changePage}>Faqs</button>
        </div>
        <div>
            <SearchBar showMiniNavBar={showMiniNavBar} />
            <button name="log" className="log-button" onClick={changeComponent}>{loggedIn ? "Log Out" : "Log In"}</button>
        </div>
    </div>
}


function Navigation() {
    const navigate = useNavigate();

    const [whichNavigation, setNavigation] = useState(false);

    const [miniBar, setMiniBar] = useState(false);

    const [loggedIn, setLoggedIn] = useState(false);

    const location = useLocation();
    function changeComponent() {
        localStorage.removeItem("token");
        navigate("/auth");
    }

    async function showMiniNavBar() {
        setMiniBar(!miniBar);
    }
    useEffect(() => {
        setMiniBar(false);
        const screenWidth = window.innerWidth;
        if (screenWidth < 1000) {
            setNavigation(false);
        }
        else {
            setNavigation(true);
        }
        TokenValidity().then((res) => {
            if (res) {
                setLoggedIn(true);
            }
            else {
                setLoggedIn(false);
            }
        })
    }, [location.pathname])
    return <div id="navigation">
        <Logo />
        {location.pathname !== '/auth' ? whichNavigation === true ?

            <MaxiNavigation changeComponent={changeComponent} showMiniNavBar={showMiniNavBar} loggedIn={loggedIn} />
            :
            <MiniNavigation miniBar={miniBar} showMiniNavBar={showMiniNavBar} loggedIn={loggedIn} changeComponent={changeComponent} />
            : null}
    </div>
}

export default Navigation;