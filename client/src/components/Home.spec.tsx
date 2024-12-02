import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Home from './Home';
import { RootState } from '../redux/store';
import { Middleware, PreloadedState } from 'redux';

const middlewares: Middleware[] = [thunk];  // Explicitly type as Middleware[]
const mockStore = configureStore<RootState>(middlewares);

const renderWithRedux = (component: React.ReactNode, { initialState, store = mockStore(initialState as PreloadedState<RootState>) }: { initialState?: PreloadedState<RootState>; store?: any } = {}) => {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe('Home Component', () => {
  it('should display loading spinner when users and albums are loading', () => {
    const initialState = {
      users: { users: [], loading: true, error: null },
      albums: { albums: [], loading: true, error: null },
    };
    renderWithRedux(<Home />, { initialState });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should display error message when there is an error', () => {
    const initialState = {
      users: { users: [], loading: false, error: 'Failed to fetch users' },
      albums: { albums: [], loading: false, error: null },
    };
    renderWithRedux(<Home />, { initialState });

    expect(screen.getByText(/Error: Failed to fetch users/i)).toBeInTheDocument();
  });

  it('should display users and their album count', () => {
    const initialState = {
      users: { users: [{ id: '1', name: 'John Doe' }], loading: false, error: null },
      albums: { albums: [{ id: '1', userId: '1', title: 'Album 1' }], loading: false, error: null },
    };
    renderWithRedux(<Home />, { initialState });

    expect(screen.getByText(/Users List/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/1 album/i)).toBeInTheDocument();
  });
});
