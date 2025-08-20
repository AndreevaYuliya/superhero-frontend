import { Link, useNavigate, useParams } from 'react-router';

import { useDetailsQuery, useRemoveMutation } from '../../../api/superheroesApi';

import styles from './index.module.css';

const SuperheroDetails = () => {
	const { id = '' } = useParams();
	const navigation = useNavigate();

	const heroId = Number(id);

	const { data } = useDetailsQuery(heroId);
	const [remove] = useRemoveMutation();

	if (isNaN(heroId)) {
		return <div>Invalid hero ID</div>;
	}

	if (!data) {
		return <div className={styles.loading}>Loading…</div>;
	}

	const superpowersArray = Array.isArray(data.superpowers) ? data.superpowers : [];

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h2>{data.nickname}</h2>
				<div className={styles.actions}>
					<Link
						to={`/heroes/${id}/edit`}
						className={styles.linkButton}
					>
						Edit
					</Link>
					<button
						className={styles.deleteButton}
						onClick={async () => {
							await remove(heroId);
							navigation('/heroes');
						}}
					>
						Delete
					</button>
				</div>
			</div>

			<div className={styles.infoGrid}>
				<p>
					<b>Real name:</b> {data.real_name}
				</p>
				<p>
					<b>Catch phrase:</b> {data.catch_phrase}
				</p>
				<p>
					<b>Origin:</b> {data.origin_description}
				</p>
				<p>
					<b>Superpowers:</b> {superpowersArray.join(', ')}
				</p>
			</div>

			<div className={styles.imagesGrid}>
				{data.images?.length ? (
					data.images.map((img) => (
						<img
							key={img.id}
							src={`http://localhost:4000${img.image_url}`}
							className={styles.image}
							alt={data.nickname}
						/>
					))
				) : (
					<div>No images</div>
				)}
			</div>
		</div>
	);
};

export default SuperheroDetails;
