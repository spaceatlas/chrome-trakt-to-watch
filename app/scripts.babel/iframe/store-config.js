import router from './router.js';

const initialState = {
	items: {},
	itemsOrder: [],
	errors: [],
	query: '',
};

export default {
	state: Object.assign({}, initialState),
	mutations: {
		reset (state) {
			for (let prop in state) {
				state[prop] = initialState[prop];
			}
		},
		setItems (state, items) {
			state.items = items;
		},
		setItemsOrder (state, itemsOrder) {
			state.itemsOrder = itemsOrder;
		},
		setQuery (state, query) {
			state.query = query;
		},
		cleanErrors (state) {
			state.errors = [];
		},
		addError (state, message) {
			state.errors.push(message);
		},
		removeError (state, index) {
			Vue.delete(state.errors, index);
		},
		setItemLoading (state, itemId) {
			state.items[itemId].isLoading = true;
		},
		setItemNotLoading (state, itemId) {
			state.items[itemId].isLoading = false;
		},
	},
	getters: {
		// isAuthorized (state) {
		// 	return state.traktAuth.accessToken && state.traktAuth.refreshToken;
		// },
	},
	actions: {
		// selectItem ({commit}, itemId) {
		// 	commit('setSelectedItem', itemId);
		// },
		addToWatchlist ({commit}, item) {
			commit('setItemLoading', item.id);
			chrome.runtime.sendMessage({
				target: 'background',
				type: 'addToWatchlist',
				payload: {
					id: item.id,
					type: item.media_type,
				},
			}, response => {
				commit('setItemNotLoading', item.id);
				if (response.success) {
					router.push(`/item_added/${item.id}`);
				} else {
					commit('addError', response.message);
				}
			});
		},
	}
};
