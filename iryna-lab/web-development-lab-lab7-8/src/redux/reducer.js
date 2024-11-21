import { ADD_TO_CART, REMOVE_FROM_CART, LOAD_CART_FROM_STORAGE,UPDATE_CART_ITEM,CLEAR_CART  } from './actions';


const initialState = {
    cart: [],
};


const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART: {
            const existingItem = state.cart.find(item => item.id === action.payload.id);

            if (existingItem) {
                
                const updatedCart = state.cart.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                saveCartToLocalStorage(updatedCart); 
                return { ...state, cart: updatedCart };
            } else {
                const updatedCart = [...state.cart, { ...action.payload, quantity: 1 }];
                saveCartToLocalStorage(updatedCart); 
                return { ...state, cart: updatedCart };
            }
        }

        case REMOVE_FROM_CART: {
            const updatedCart = state.cart.filter(item => item.id !== action.payload);
            saveCartToLocalStorage(updatedCart); 
            return { ...state, cart: updatedCart };
        }

        case LOAD_CART_FROM_STORAGE: {
            return { ...state, cart: action.payload || [] };
        }
        case UPDATE_CART_ITEM:
          return {
              ...state,
              cart: state.cart.map((item) =>
                  item.id === action.payload.id
                      ? {
                            ...item,
                            ...action.payload.updates,
                            totalPrice: item.price * (action.payload.updates.days || item.days) * (action.payload.updates.visitors || item.visitors), // Перерахунок totalPrice
                        }
                      : item
              ),
          };
          case CLEAR_CART: 
            return {
                ...state,
                cart: [],
            };
        default:
            return state;
    }
};


const saveCartToLocalStorage = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

export default cartReducer;
