import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { RootState } from "../../redux/store";
import Home from "../../components/Home";
import { MemoryRouter } from "react-router-dom";  // Import MemoryRouter for wrapping components
import type { UserState } from "../../redux/slices/userSlice"; // Import UserState as a type
import React from "react";

// Mock store for testing
const mockStore = (state: Partial<RootState>) => {
  return createStore(
    (state) => state, // A mock reducer
    state
  );
};

describe("Home Component", () => {
  it("renders a loading spinner when data is loading", () => {
    const mockState: Partial<RootState> = {
      users: {
        users: [],
        userDetails: null,
        userAlbums: [],
        loading: true,  // Set loading to true to trigger the loading spinner
        error: null,
        imageLoading: false,
        albumPhotos: {},
      } as UserState,
      albums: {
        albums: [],
        loading: true,
        error: null,
      }, // Assuming similar structure for albums state
    };

    const store = mockStore(mockState);

    render(
      <Provider store={store}>
        <MemoryRouter> 
          <Home />
        </MemoryRouter>
      </Provider>
    );

    // Ensure the loading spinner is rendered using data-testid
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("displays user list when data is loaded", () => {
    const mockState: Partial<RootState> = {
      users: {
        users: [
          { id: "1", username: "JohnDoe", email: "john@example.com" },
          { id: "2", username: "JaneDoe", email: "jane@example.com" },
        ],
        userDetails: null,
        userAlbums: [],
        loading: false, // Set loading to false to simulate data is loaded
        error: null,
        imageLoading: false,
        albumPhotos: {},
      } as UserState,
      albums: {
        albums: [
          {
            id: "1", title: "Album 1", userId: "1",
            photos: [], username: ""
          },
          {
            id: "2", title: "Album 2", userId: "2",
            photos: [], username: ""
          },
        ],
        loading: false,
        error: null,
      },
    };

    const store = mockStore(mockState);

    render(
      <Provider store={store}>
        <MemoryRouter>  {/* Wrap in MemoryRouter */}
          <Home />
        </MemoryRouter>
      </Provider>
    );

    // Ensure the user cards are rendered
    expect(screen.getByText(/JohnDoe/)).toBeInTheDocument();
    expect(screen.getByText(/JaneDoe/)).toBeInTheDocument();
  });

  it("displays error message when there is an error", () => {
    const mockState: Partial<RootState> = {
      users: {
        users: [],
        userDetails: null,
        userAlbums: [],
        loading: false,
        error: "Failed to fetch users",
        imageLoading: false,
        albumPhotos: {},
      } as UserState,
      albums: {
        albums: [],
        loading: false,
        error: null,
      },
    };

    const store = mockStore(mockState);

    render(
      <Provider store={store}>
        <MemoryRouter>  {/* Wrap in MemoryRouter */}
          <Home />
        </MemoryRouter>
      </Provider>
    );

    // Check for the error message
    expect(screen.getByText(/Error: Failed to fetch users/)).toBeInTheDocument();
  });
});
