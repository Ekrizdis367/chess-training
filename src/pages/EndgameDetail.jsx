import { useParams } from 'react-router-dom';
import { endgameCategories } from '../data/endgames';
import { useEndgame } from '../context/EndgameContext';

export function EndgameDetail() {
  const { slug } = useParams();
  const { hasActiveEndgame } = useEndgame();
  const category = endgameCategories.find((c) => c.slug === slug);
  const name = category?.name ?? slug?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      <h1 className="page-heading section-page-heading">{name}</h1>
      {(hasActiveEndgame && category?.description) || !hasActiveEndgame ? (
        <p className="page-sub">
          {hasActiveEndgame && category?.description ? category.description : 'Select an endgame from the list to train.'}
        </p>
      ) : null}
    </>
  );
}
