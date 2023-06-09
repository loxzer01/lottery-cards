import { useState } from 'react';
import Cards from './components/Cards.main';
import "./Main.css";
import Time from './components/Time.main';
const Main = () => {
    const [selects, setSelects] = useState([]);
    return (
        <main className='main_cards'>
            <Cards selects={selects} setSelects={setSelects}/>
            <Time selects={selects} />
        </main>
    );
}

export default Main;