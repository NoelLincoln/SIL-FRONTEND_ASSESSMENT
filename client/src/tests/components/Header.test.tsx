import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';
import Header from '../../components/Header';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock store for testing
const mockStore = (state: Partial<RootState>) => {
  return configureStore({
    reducer: (state) => state, // A mock reducer
    preloadedState: state,
    // No need to add custom middleware if you're not modifying it
  });
};

describe('Header Component', () => {
  it('renders the logo', () => {
    const mockState: Partial<RootState> = {
      auth: {
        name: '',
        email: '',
        isAuthenticated: false,
        loading: false,
        error: null,
        id: null, // Adding 'id' property with null value
      },
    };

    const store = mockStore(mockState);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    // Check if the logo is rendered
    expect(screen.getByAltText('Album Genie Logo')).toBeInTheDocument();
  });

  it('displays user profile and logout button when authenticated', () => {
    const mockState: Partial<RootState> = {
      auth: {
        name: '',
        email: 'john@example.com',
        isAuthenticated: true,
        loading: false,
        error: null,
        id: '1234', // 'id' is a string in this case
      },
    };

    const store = mockStore(mockState);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    // Check if the "Profile" button is visible
    expect(screen.getByText(/Profile/)).toBeInTheDocument();

    // Simulate clicking on the profile button to open the profile dropdown
    fireEvent.click(screen.getByText(/Profile/));

    // Ensure the email is shown and the logout button is present
    expect(screen.getByText(/john@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/Logout/)).toBeInTheDocument();
  });

  it('displays user profile and logout button when authenticated with null id', () => {
    const mockState: Partial<RootState> = {
      auth: {
        name: '',
        email: 'john@example.com',
        isAuthenticated: true,
        loading: false,
        error: null,
        id: null, // 'id' is null in this case
      },
    };

    const store = mockStore(mockState);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    // Check if the "Profile" button is visible
    expect(screen.getByText(/Profile/)).toBeInTheDocument();

    // Simulate clicking on the profile button to open the profile dropdown
    fireEvent.click(screen.getByText(/Profile/));

    // Ensure the email is shown and the logout button is present
    expect(screen.getByText(/john@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/Logout/)).toBeInTheDocument();
  });

  it('displays loading text on logout button when logout is in progress', () => {
    const mockState: Partial<RootState> = {
      auth: {
        name: '',
        email: 'john@example.com',
        isAuthenticated: true,
        loading: true, // Simulate loading state
        error: null,
        id: '1234',
      },
    };

    const store = mockStore(mockState);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    // Simulate clicking on the profile button to open the profile dropdown
    fireEvent.click(screen.getByText(/Profile/));

    // Ensure the logout button shows "Logging out..." when loading
    expect(screen.getByText(/Logging out.../)).toBeInTheDocument();
  });

  it('renders the back button only on small screens', () => {
    const mockState: Partial<RootState> = {
      auth: {
        name: '',
        email: '',
        isAuthenticated: false,
        loading: false,
        error: null,
        id: null, // Adding 'id' property with null value for small screen case
      },
    };

    const store = mockStore(mockState);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    // Check for the presence of the back button only on small screens (use a resize mock if needed)
    expect(screen.getByTestId('back-button')).toBeInTheDocument();
  });
});
