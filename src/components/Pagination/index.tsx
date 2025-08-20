import { FC } from 'react';

import styles from './index.module.css';

type Props = {
	page: number;
	pageSize: number;
	total: number;
	onPageChange: (p: number) => void;
};

const Pagination: FC<Props> = (props) => {
	const { page, pageSize, total, onPageChange } = props;

	const pages = Math.max(1, Math.ceil(total / pageSize));

	const handleChange = (newPage: number) => {
		onPageChange(newPage);

		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div className={styles.pagination}>
			<button
				className={`${styles.pageButton} ${page <= 1 ? styles.pageButtonDisabled : ''}`}
				disabled={page <= 1}
				onClick={() => handleChange(page - 1)}
			>
				Prev
			</button>

			<span className={styles.pageInfo}>
				Page {page} / {pages}
			</span>

			<button
				className={`${styles.pageButton} ${page >= pages ? styles.pageButtonDisabled : ''}`}
				disabled={page >= pages}
				onClick={() => handleChange(page + 1)}
			>
				Next
			</button>
		</div>
	);
};

export default Pagination;
