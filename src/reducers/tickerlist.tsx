const initialState = {
    tickers: [],
};

export default function user(state = initialState, action) {
    switch (action.type) {
        case 'ADD_TICKER':
            return state;
        case 'REMOVE_TICKER':
            return state;
        default:
            return state;
    }
}