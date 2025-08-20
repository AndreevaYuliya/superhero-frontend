import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import {
	useCreateMutation,
	useDetailsQuery,
	useRemoveImageMutation,
	useUpdateMutation,
} from '../../../api/superheroesApi';

import styles from './index.module.css';
import { HeroFormState, Superhero } from '../../../types/types';

const SuperheroForm = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [createHero] = useCreateMutation();
	const [updateHero] = useUpdateMutation();
	const [removeImage] = useRemoveImageMutation();
	const isEdit = Boolean(id);
	const heroId = Number(id);
	const { data } = useDetailsQuery(heroId, { skip: !isEdit });

	const [form, setForm] = useState<HeroFormState>({
		nickname: '',
		real_name: '',
		origin_description: '',
		superpowers: '',
		catch_phrase: '',
	});

	const [files, setFiles] = useState<File[]>([]);

	useEffect(() => {
		if (data) {
			setForm({
				nickname: data.nickname,
				real_name: data.real_name,
				origin_description: data.origin_description,
				superpowers: Array.isArray(data.superpowers)
					? data.superpowers.join(', ')
					: data.superpowers || '',
				catch_phrase: data.catch_phrase,
			});
		}
	}, [data]);

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();

		const payload: Omit<Superhero, 'id' | 'images'> & { superpowers: string[] } = {
			nickname: form.nickname.trim(),
			real_name: form.real_name.trim(),
			origin_description: form.origin_description.trim(),
			superpowers: form.superpowers
				.split(',')
				.map((s) => s.trim())
				.filter(Boolean),
			catch_phrase: form.catch_phrase.trim(),
		};

		try {
			if (isEdit && heroId) {
				await updateHero({ id: heroId, data: payload, files }).unwrap();
				navigate('/heroes');
			} else {
				const created = await createHero({ data: payload, files }).unwrap();
				navigate(`/superheroes/${created.id}`);
			}
		} catch (err) {
			console.error('Error while saving hero:', err);
			alert('Failed to save hero: ' + JSON.stringify(err));
		}
	};

	return (
		<form
			onSubmit={onSubmit}
			className={styles.formContainer}
		>
			<h2 className={styles.formTitle}>{isEdit ? 'Edit' : 'Create'} Superhero</h2>

			{['nickname', 'real_name', 'catch_phrase'].map((k) => (
				<label
					key={k}
					className={styles.label}
				>
					<span>{k.replace('_', ' ')}</span>
					<input
						className={styles.input}
						value={(form as any)[k]}
						onChange={(e) => setForm({ ...form, [k]: e.target.value })}
						required={k !== 'catch_phrase'}
					/>
				</label>
			))}

			<label className={styles.label}>
				<span>Origin description</span>
				<textarea
					className={`${styles.textarea} ${styles.input}`}
					value={form.origin_description}
					onChange={(e) => setForm({ ...form, origin_description: e.target.value })}
					required
					rows={4}
				/>
			</label>

			<label className={styles.label}>
				<span>Superpowers (comma-separated)</span>
				<textarea
					className={`${styles.textarea} ${styles.input}`}
					value={form.superpowers}
					onChange={(e) => setForm({ ...form, superpowers: e.target.value })}
					rows={3}
				/>
			</label>

			{isEdit && data && (
				<>
					<div style={{ fontWeight: 600 }}>Existing images</div>
					<div className={styles.existingImages}>
						{data.images.map((img) => (
							<div
								key={img.id}
								className={styles.imageCard}
							>
								<img
									src={`http://localhost:4000${img.image_url}`}
									alt={data.nickname}
									className={styles.previewImage}
									width="100%"
								/>
								<button
									type="button"
									onClick={async () =>
										await removeImage({ id: data.id, imageId: img.id })
									}
									className={styles.deleteButton}
								>
									Delete
								</button>
							</div>
						))}
					</div>
				</>
			)}

			<label className={styles.label}>
				<span>New images</span>
				<input
					type="file"
					multiple
					accept="image/*"
					onChange={(e) => setFiles(Array.from(e.target.files || []))}
					className={styles.fileInput}
				/>
			</label>

			{files.length > 0 && (
				<div className={styles.newFilesGrid}>
					{files.map((f, i) => (
						<div
							key={i}
							className={styles.imageCard}
						>
							<img
								src={URL.createObjectURL(f)}
								alt={f.name}
								width={100}
								height={100}
								className={styles.previewImage}
							/>
							<div style={{ fontSize: 12, marginTop: 4 }}>{f.name}</div>
						</div>
					))}
				</div>
			)}

			<div className={styles.actionButtons}>
				<button
					type="submit"
					className={styles.submitButton}
				>
					{isEdit ? 'Save changes' : 'Create'}
				</button>
				<button
					type="button"
					onClick={() => navigate(-1)}
					className={styles.cancelButton}
				>
					Cancel
				</button>
			</div>
		</form>
	);
};

export default SuperheroForm;
