
import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryNotAuth } from "./baseQueryNotAuth";
import { Product } from "@/types/products";
import { Shop } from "@/types/shop";



export const guardService = createApi({
    baseQuery: baseQueryNotAuth,
    reducerPath: "guardService",
    // 🌟 CHANGEMENT 1 : Des tags spécifiques au lieu d'un seul tag global
    tagTypes: ['Category', 'Town', 'Shop', 'Product', 'Attribute', 'Gender', 'Delivery'],

    endpoints: builder => ({
        getCategories: builder.query({
            query: () => '/api/categories',
            providesTags: ['Category'],
            // 🌟 CHANGEMENT 2 : Garder les données en cache 15 minutes (900 secondes)
            // Les catégories ne changent pas toutes les secondes !
            keepUnusedDataFor: 900,
        }),

        getTowns: builder.query({
            query: () => "/api/towns",
            providesTags: ['Town'],
            keepUnusedDataFor: 3600, // 1 heure pour les villes
        }),

        getQuarters: builder.query({
            query: () => `/api/quarters`,
            providesTags: ['Town'], // Les quartiers dépendent des villes
            keepUnusedDataFor: 3600,
        }),

        getShop: builder.query({
            query: (id) => `/api/shop/${id}`,
            // 🌟 CHANGEMENT 3 : Tag spécifique avec ID pour une invalidation ciblée
            providesTags: (id) => [{ type: 'Shop', id }],
            keepUnusedDataFor: 300, // 5 minutes
        }),

        checkIfEmailExists: builder.mutation({
            query: (formData) => ({
                url: `/api/check/email-and-phone-number`,
                method: "POST",
                body: formData,
            }),
            // 🌟 CHANGEMENT 4 : Cette mutation n'invalide RIEN de critique, ou juste un tag utilisateur si besoin
            // On retire 'guard' pour éviter de tout recharger
            invalidatesTags: [],
        }),

        getCategoriesWithParentIdNull: builder.query({
            query: (genderId) => {
                let url = `/api/categories/with-parent-id-null`;
                if (genderId != 4) url = `${url}?gender=${genderId}`;
                return { url, method: "GET" };
            },
            providesTags: ['Category'],
            keepUnusedDataFor: 900,
        }),

        getCategoriesWithParentId: builder.query({
            query: ({ id, genderId }) => {
                let url = `/api/category/gender/${id}`;
                if (genderId != 4) url = `${url}?gender=${genderId}`;
                return { url, method: "GET" };
            },
            providesTags: ['Category'],
            keepUnusedDataFor: 900,
        }),

        getCategoryByGender: builder.query({
            query: (id) => ({ url: `/api/get/category/by-gender/${id}`, method: "GET" }),
            providesTags: ['Category'],
            keepUnusedDataFor: 900,
        }),

        getSubCategories: builder.query({
            query: ({ arrayId, id }) => ({ url: `/api/get/sub-categories/${arrayId}/${id}`, method: "GET" }),
            providesTags: ['Category'],
            keepUnusedDataFor: 900,
        }),

        filterProducts: builder.query({
            query: ({ arrayId }) => ({ url: `/api/filter/products/${arrayId}`, method: "GET" }),
            providesTags: ['Product'],
            keepUnusedDataFor: 60, // 1 minute pour les filtres
        }),

        getHomeShops: builder.query({
            query: () => ({ url: `/api/home/shops`, method: "GET" }),
            providesTags: ['Shop'],
            keepUnusedDataFor: 300,
        }),

        getAllShops: builder.query({
            query: (page) => ({ url: `/api/all/shops?page=${page}`, method: "GET" }),
            transformResponse: (response: { data: Shop[], meta: { last_page: number, current_page: number, total: number } }) => ({
                shopList: response.data,
                totalPagesResponse: response.meta.last_page,
                currentPageResponse: response.meta.current_page,
                totalShopsResponse: response.meta.total,
            }),
            providesTags: (_result, _error, page) => [{ type: 'Shop', id: 'LIST' }, { type: 'Shop', id: page }],
            keepUnusedDataFor: 120, // 2 minutes
        }),

        getCurrentHomeByGender: builder.query({
            query: (id) => ({ url: `/api/current/gender/${id}`, method: "GET" }),
            providesTags: ['Product'],
            keepUnusedDataFor: 300,
        }),

        getHomeProducts: builder.query({
            query: () => ({ url: `/api/home/products`, method: "GET" }),
            providesTags: ['Product'],
            keepUnusedDataFor: 300,
        }),

        getProductByUrl: builder.query({
            query: (url) => ({ url: `/api/product/detail/${url}`, method: "GET" }),
            providesTags: (_result, _error, url) => [{ type: 'Product', id: url }],
            keepUnusedDataFor: 300,
        }),

        getAllProducts: builder.query({
            query: ({ page = 1, min_price, max_price, categories, colors, attribut, gender, seller_mode, bulk_price_range }) => {
                const params = new URLSearchParams();
                params.append('page', page.toString());
                if (min_price && min_price > 0) params.append('min_price', min_price.toString());
                if (max_price && max_price < 500000) params.append('max_price', max_price.toString());
                if (categories?.length > 0) params.append('categories', categories.join(','));
                if (colors?.length > 0) params.append('colors', colors.join(','));
                if (attribut?.length > 0) params.append('attribut', attribut.join(','));
                if (gender?.length > 0) params.append('gender', gender.join(','));
                if (seller_mode) params.append('seller_mode', 'true');
                if (bulk_price_range) params.append('bulk_price_range', bulk_price_range);

                return { url: `/api/all/products?${params.toString()}`, method: "GET" };
            },
            transformResponse: (response: any) => ({
                productList: response.data,
                currentPage: response.meta.current_page,
                lastPage: response.meta.last_page,
                total: response.meta.total,
                hasMore: response.meta.current_page < response.meta.last_page
            }),
            providesTags: () => [{ type: 'Product', id: 'LIST' }],
            keepUnusedDataFor: 60,
        }),

        createDelivery: builder.mutation({
            query: (formData) => ({
                url: `/api/create/delivery`,
                method: "POST",
                body: formData,
            }),
            // 🌟 CHANGEMENT 5 : On n'invalide QUE le tag Delivery (ou Order), pas tout le site !
            invalidatesTags: ['Delivery'],
        }),

        getAttributeValues: builder.query({
            query: (id) => ({ url: `/api/attributes/value/${id}`, method: 'GET' }),
            providesTags: ['Attribute'],
            keepUnusedDataFor: 3600, // Les attributs changent rarement
        }),

        getSimilarProducts: builder.query({
            query: (id) => ({ url: `/api/similar/products/${id}`, method: 'GET' }),
            providesTags: ['Product'],
            keepUnusedDataFor: 300,
        }),

        getCategoryProductsByUrl: builder.query({
            query: ({ url, page, min_price, max_price, colors, attribut, gender, seller_mode, bulk_price_range }) => {
                const params = new URLSearchParams();
                if (page) params.append('page', page.toString());
                if (min_price && min_price > 0) params.append('min_price', min_price.toString());
                if (max_price && max_price < 500000) params.append('max_price', max_price.toString());
                if (colors && colors.length > 0) params.append('colors', colors.join(','));
                if (attribut && attribut.length > 0) params.append('attribut', attribut.join(','));
                if (gender && gender.length > 0) params.append('gender', gender.join(','));
                if (seller_mode !== undefined && seller_mode !== false) params.append('seller_mode', seller_mode.toString());
                if (bulk_price_range) params.append('bulk_price_range', bulk_price_range);

                return {
                    url: `/api/product/by-category/${url}${params.toString() ? `?${params.toString()}` : ''}`,
                    method: 'GET'
                };
            },
            transformResponse: (response: { data: Product[], meta?: { last_page: number, current_page: number, total: number } }) => ({
                productList: response.data,
                totalPagesResponse: response.meta?.last_page ?? 1,
                currentPageResponse: response.meta?.current_page ?? 1,
                totalProductsResponse: response.meta?.total ?? response.data?.length ?? 0,
            }),
            providesTags: (_result, _error, arg) => [{ type: 'Product', id: `CATEGORY_${arg.url}` }],
            keepUnusedDataFor: 120,
        }),

        getCategoryByUrl: builder.query({
            query: (url) => ({ url: `/api/category/by-url/${url}`, method: 'GET' }),
            providesTags: ['Category'],
            keepUnusedDataFor: 900,
        }),

        searchByQuery: builder.query({
            query: ({ query, userId }) => ({ url: `/api/search/${query}/${userId}`, method: "GET" }),
            // Pas de tag pour la recherche, car chaque recherche est unique et ne doit pas être mise en cache longtemps
            keepUnusedDataFor: 10,
        }),

        getProfileShop: builder.query({
            query: () => ({ url: '/api/get/profile/shop', method: "GET" }),
            providesTags: ['Shop'],
            keepUnusedDataFor: 300,
        }),

        getModalShop: builder.query({
            query: () => ({ url: "/api/get/modal/shop", method: "GET" }),
            providesTags: ['Shop'],
            keepUnusedDataFor: 300,
        }),

        getCatalogSeller: builder.query({
            query: (shopKey) => ({ url: `/api/catalogue/${shopKey}`, method: "GET" }),
            providesTags: (shopKey) => [{ type: 'Shop', id: shopKey }],
            keepUnusedDataFor: 300,
        }),

        allGenders: builder.query({
            query: () => ({ url: "/api/all/genders", method: "GET" }),
            providesTags: ['Gender'],
            keepUnusedDataFor: 86400, // 24 heures ! Les genres (Homme/Femme/Enfant) ne changent JAMAIS
        }),

        getAttributeByCategory: builder.query({
            query: () => ({ url: "/api/categories/attributes", method: "GET" }),
            providesTags: ['Attribute'],
            keepUnusedDataFor: 3600,
        }),
    }),
})

export const {
    useGetShopQuery,
    useGetCategoriesQuery,
    useAllGendersQuery,
    useGetTownsQuery,
    useGetQuartersQuery,
    useCheckIfEmailExistsMutation,
    useGetCategoriesWithParentIdNullQuery,
    useGetCategoriesWithParentIdQuery,
    useGetCategoryByGenderQuery,
    useGetSubCategoriesQuery,
    useGetHomeShopsQuery,
    useGetAllShopsQuery,
    useGetCurrentHomeByGenderQuery,
    useGetHomeProductsQuery,
    useGetProductByUrlQuery,
    useGetAllProductsQuery,
    useCreateDeliveryMutation,
    useGetAttributeValuesQuery,
    useGetSimilarProductsQuery,
    useGetCategoryProductsByUrlQuery,
    useGetCategoryByUrlQuery,
    useSearchByQueryQuery,
    useGetProfileShopQuery,
    useGetModalShopQuery,
    useGetCatalogSellerQuery,
    useFilterProductsQuery,
    useGetAttributeByCategoryQuery
} = guardService