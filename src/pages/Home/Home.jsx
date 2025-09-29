import './Home.css';
import HeaderPopularGames from '../../components/HeaderPopularGames/HeaderPopularGames';
import UitgelichtGames from '../../components/UitgelichtGames/UitgelichtGames.jsx';


function Home() {
    return (
        <div className="home-container">
            <HeaderPopularGames />
            <UitgelichtGames />
        </div>
    );
}

export default Home;