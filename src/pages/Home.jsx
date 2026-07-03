import { Link } from 'react-router-dom';

export function Home() {
  return (
    <>
      <section className="hero">
        <h1>The Chess Tavern</h1>
        <p>
          Study openings, master endgames, and improve with structured practice.
        </p>
        <div className="home-links">
          <Link to="/openings">Openings</Link>
          <Link to="/endgames">Endgames</Link>
          <Link to="/coaching">Coaching</Link>
        </div>
      </section>
    </>
  );
}
