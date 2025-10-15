import {useState} from 'react';
import './Favorieten.css';
import FavorietenGebruiker from '../../components/FavorietenGebruiker/FavorietenGebruiker';
import ShortDescription from '../../components/ShortDescription/ShortDescription';

function Favorieten() {
    return (
        <div className="favorieten-container">
            <h1>Favorieten</h1>
            <section className="short-desc">
                <ShortDescription maxLength={55}
                    text="Op je favorietenlijst vind je alle games die je zelf hebt opgeslagen binnen GameFinder.
                      Dit is jouw persoonlijke overzicht, zodat je snel en eenvoudig terug kunt keren naar de titels
                      die je interessant vindt of later wilt spelen. Of het nu gaat om nieuwe releases, populaire klassiekers
                      of verborgen parels, je hebt ze altijd binnen handbereik. Gebruik je lijst om keuzes te maken,
                      inspiratie op te doen en geen game meer te vergeten. Bovendien helpt je favorietenlijst je om
                      overzicht te bewaren wanneer je twijfelt tussen verschillende genres of platforms.
                      Je kunt er ook ideeën uit halen voor cadeaus of samen spelen met vrienden."
                />
            </section>
                <FavorietenGebruiker/>
        </div>
    );
}

export default Favorieten;
