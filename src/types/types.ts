export type SuperheroListItem = {
	id: number;
	nickname: string;
	image?: string;
};

export type Superhero = {
	id: number;
	nickname: string;
	real_name: string;
	origin_description: string;
	superpowers: string | string[];
	catch_phrase: string;
	images: { id: number; image_url: string }[];
};

export type SuperheroListResponse = {
	items: SuperheroListItem[];
	total: number;
	limit: number;
	page: number;
};

export type ListQueryParams = {
	limit?: number;
	page?: number;
};

export type RemoveImageArgs = {
	id: number;
	imageId: number;
};

export type HeroFormState = {
	nickname: string;
	real_name: string;
	origin_description: string;
	superpowers: string;
	catch_phrase: string;
};
