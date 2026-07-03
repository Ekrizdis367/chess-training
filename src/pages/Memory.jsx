import { Link } from 'react-router-dom';

export function Memory() {
  return (
    <div className="memory-cards">
      <Link to="/memory/coordinates" className="memory-card">
        <h2 className="memory-card-title">Find the square</h2>
      </Link>
      <Link to="/memory/color" className="memory-card">
        <h2 className="memory-card-title">Square color</h2>
      </Link>
      <Link to="/memory/openings" className="memory-card">
        <h2 className="memory-card-title">Name the opening</h2>
      </Link>
    </div>
  );
}
