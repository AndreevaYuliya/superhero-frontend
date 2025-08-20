import { Link, useSearchParams } from 'react-router';

import { useListQuery } from '../../../api/superheroesApi';

import Pagination from '../../Pagination';

import styles from './index.module.css';

const SuperheroList = () => {
	const [params, setParams] = useSearchParams();

	const page = Number(params.get('page') || '1');
	const limit = 5;

	const { data, isFetching } = useListQuery({ limit, page });

	return (
		<div className={styles.container}>
			{isFetching && <div className={styles.loading}>Loading…</div>}
			<div>
				{(data?.items ?? []).map((h) => {
					return (
						<Link
							key={h.id}
							to={`/heroes/${h.id}`}
							className={styles.heroLink}
						>
							<div className={styles.heroCard}>
								<h3 className={styles.heroName}>{h.nickname}</h3>
								<img
									src={
										h.image
											? `http://localhost:4000${h.image}`
											: 'http://via.placeholder.com/200x200?text=No+Image'
									}
									alt={h.nickname}
									className={styles.heroImage}
								/>
							</div>
						</Link>
					);
				})}
			</div>

			<Pagination
				page={page}
				pageSize={limit}
				total={data?.total || 0}
				onPageChange={(p) => setParams({ page: String(p) })}
			/>
		</div>
	);
};

export default SuperheroList;
