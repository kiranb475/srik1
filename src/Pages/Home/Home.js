import { Container } from "@mui/material";
import './Home.css'
import WelcomeScreen from "./WelcomeScreen";
import Dashboard from "./Dashboard/Dashboard";

function Home() {

    return (
        <div className="container">

            {/* 
                not logged in: welcome screen
                logged in: user dashboard
            */}

            {!sessionStorage.getItem("UserId") ? (<WelcomeScreen />) : (<Dashboard />)}
        </div>
    );
}

export default Home;
