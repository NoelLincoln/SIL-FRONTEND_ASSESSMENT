import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import UserDetails from "../../components/UserDetails";
import {
  fetchUserDetails,
  fetchUserAlbums,
  fetchAlbumPhotos,
  UserState,
} from "../../redux/slices/userSlice";
import React from "react";

// Mock store for testing
const mockStore = (state: Partial<RootState>) => {
  return configureStore({
    reducer: (state) => state, // A mock reducer
    preloadedState: state,
  });
};

// Mock data for testing
const mockUser = {
  id: "1",
  username: "john_doe",
  email: "hello@gmail.com",
};

const mockAlbums = [
  { id: "1", title: "Vacation Photos" },
  { id: "2", title: "Birthday Party" },
];

const mockAlbumPhotos = {
  "1": "https://via.placeholder.com/150",
  "2": "https://via.placeholder.com/150",
};

describe("UserDetails Component", () => {
  it("renders the user details and albums", async () => {
    const mockState: Partial<RootState> = {
      users: {
        userDetails: mockUser,
        userAlbums: mockAlbums,
        albumPhotos: mockAlbumPhotos,
        loading: false,
        error: null,
        imageLoading: false,
      } as unknown as UserState, // Ensuring the type matches UserState
    };

    const store = mockStore(mockState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/user/1"]}>
          <Routes>
            <Route path="/user/:userId" element={<UserDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    // Check if user details are rendered
    expect(screen.getByText(/john_doe/)).toBeInTheDocument();

    // Check if albums are rendered
    expect(screen.getByText(/Vacation Photos/)).toBeInTheDocument();
    expect(screen.getByText(/Birthday Party/)).toBeInTheDocument();

    // Check if album photos are rendered
    await waitFor(() => {
      expect(screen.getByAltText("Vacation Photos")).toHaveAttribute(
        "src",
        mockAlbumPhotos["1"],
      );
      expect(screen.getByAltText("Birthday Party")).toHaveAttribute(
        "src",
        mockAlbumPhotos["2"],
      );
    });
  });

  it("displays loading spinner while loading user data", () => {
    const mockState: Partial<RootState> = {
      users: {
        userDetails: null,
        userAlbums: [],
        albumPhotos: {},
        loading: true,
        error: null,
        imageLoading: false,
      } as unknown as UserState,
    };

    const store = mockStore(mockState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/user/1"]}>
          <Routes>
            <Route path="/user/:userId" element={<UserDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    // Check if loading spinner is displayed
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("displays error message if fetching user data fails", async () => {
    const mockState: Partial<RootState> = {
      users: {
        userDetails: null,
        userAlbums: [],
        albumPhotos: {},
        loading: false,
        error: "Failed to fetch user data",
        imageLoading: false,
      } as unknown as UserState,
    };

    const store = mockStore(mockState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/user/1"]}>
          <Routes>
            <Route path="/user/:userId" element={<UserDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    // Check if error message is displayed
    expect(screen.getByText(/Oops!/)).toBeInTheDocument();
    expect(screen.getByText(/Failed to fetch user data/)).toBeInTheDocument();
  });

  it("displays album photos after albums are fetched", async () => {
    const mockState: Partial<RootState> = {
      users: {
        userDetails: mockUser,
        userAlbums: mockAlbums,
        albumPhotos: mockAlbumPhotos,
        loading: false,
        error: null,
        imageLoading: false,
      } as unknown as UserState,
    };

    const store = mockStore(mockState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/user/1"]}>
          <Routes>
            <Route path="/user/:userId" element={<UserDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    // Wait for album photos to be rendered
    await waitFor(() => {
      expect(screen.getByAltText("Vacation Photos")).toHaveAttribute(
        "src",
        mockAlbumPhotos["1"],
      );
      expect(screen.getByAltText("Birthday Party")).toHaveAttribute(
        "src",
        mockAlbumPhotos["2"],
      );
    });
  });
});
