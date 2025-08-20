import { FC, ReactNode } from 'react';
import { Link } from 'react-router';

import styles from './index.module.css';

type Props = {
	children: ReactNode;
};

const Layout: FC<Props> = (props) => {
	const { children } = props;

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<Link
					to="/heroes"
					className={styles.title}
				>
					<h1>Superheroes</h1>
				</Link>

				<Link
					to="/heroes/new"
					className={styles.createButton}
				>
					+ Create
				</Link>
			</header>

			<main className={styles.main}>{children}</main>
		</div>
	);
};

export default Layout;
