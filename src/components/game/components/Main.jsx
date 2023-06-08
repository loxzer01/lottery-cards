import { useState } from 'react';
import Cards from './components/Cards.main';
import "./Main.css";
const Main = () => {
    const [selects, setSelects] = useState([]);
    return (
        <main className='main_cards'>
            <Cards selects={selects} setSelects={setSelects}/>
        </main>
    );
}

export default Main;