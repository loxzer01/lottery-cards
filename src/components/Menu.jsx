import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <div
      className="container-fluid investment py-5 px-2"
      style={{
        minHeight: '650px',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <div
        className="d-flex items-center justify-items-center"
        style={{
          gap: '2rem',
        }}
      >
        <h2
          className="text-center font-bold"
          style={{
            fontSize: '2rem',
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#fa0',
          }}
        >
          Dapp Option
        </h2>
      </div>
      <div
        className="d-flex items-center justify-items-center md:p-2"
        style={{
          gap: '2rem',
          // minWidth: "350px",
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ gap: '2rem', maxWidht: '420px' }}>
          <Link
            to="/invest"
            className="text-center bg-black p-4"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
              borderRadius: '1.5rem',
              textDecoration: 'none',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <img
              src="/img/cryptocurrency.png"
              alt="invest"
              border="0"
              style={{
                width: '80%',
                height: 'auto',
              }}
            />
            <h2
              className="text-white font-bold text-xl "
              style={{
                fontWeight: 'bold',
              }}
            >
              Invest
            </h2>
          </Link>
        </div>
        <div style={{ gap: '2rem', maxWidht: '420px' }}>
          <Link
            to="/game"
            className="text-center bg-black p-4"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
              borderRadius: '1.5rem',
              textDecoration: 'none',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <img
              src="/img/juego.png"
              alt="game"
              border="0"
              style={{
                width: '80%',
                height: 'auto',
              }}
            />
            <h2
              className="text-xl font-bold text-white"
              style={{
                fontWeight: 'bold',
              }}
            >
              Game
            </h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Menu;
