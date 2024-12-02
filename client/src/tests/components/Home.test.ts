import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { RootState } from "../../redux/store"; // Correct path for RootState
import Home from "../../components/Home"; // Correct path for Home component
import  UserState  from "../../redux/slices/userSlice"; // Ensure you import the correct type for UserState

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
        <Home />
      </Provider>
    );

    // Check that the loading spinner is rendered
    expect(screen.getByRole("spinner")).toBeInTheDocument(); // Ensure your LoadingSpinner has a role="spinner"
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
          { id: "1", title: "Album 1", userId: "1" },
          { id: "2", title: "Album 2", userId: "2" },
        ],
        loading: false,
        error: null,
      },
    };

    const store = mockStore(mockState);

    render(
      <Provider store={store}>
        <Home />
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
        <Home />
      </Provider>
    );

    // Check for the error message
    expect(screen.getByText(/Error: Failed to fetch users/)).toBeInTheDocument();
  });
});
