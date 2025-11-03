import './Home.css';
import HeaderPopularGames from '../../components/HeaderPopularGames/HeaderPopularGames';
import UitgelichtGames from '../../components/UitgelichtGames/UitgelichtGames.jsx';


function Home() {
    return (
        <main className="home-container">
            <HeaderPopularGames />
            <UitgelichtGames />
        </main>
    );
}

export default Home;