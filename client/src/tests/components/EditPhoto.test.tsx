import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store"; // Adjust path as needed
import EditPhoto from "../../components/EditPhoto"; // Adjust path as needed

// Mock Photo Data
const mockPhoto = {
  id: "1",
  title: "Test Photo",
  imageUrl: "http://example.com/photo.jpg",
  thumbnailUrl: "http://example.com/thumb.jpg",
};

// Mock Reducers
const mockUsersReducer = (state = {}) => state;
const mockAlbumsReducer = (state = {}) => state;
const mockAuthReducer = (state = {}) => state;
const mockPhotoReducer = (state = {}) => state;

// Mock Store Helper
const mockStore = (state: Partial<RootState>) =>
  configureStore({
    reducer: {
      users: mockUsersReducer,
      albums: mockAlbumsReducer,
      auth: mockAuthReducer,
      photo: (state = {}) => state, // Specific photo reducer mock
    },
    preloadedState: state,
  });

// Test Suite
describe("EditPhoto Component", () => {

  it("shows a loading spinner when loading is true", () => {
    // Mock State
    const mockState: Partial<RootState> = {
      photo: {
        photos: [],
        selectedPhoto: null,
        loading: true,
        error: null,
      },
    };

    // Configure Mock Store
    const store = mockStore(mockState);

    // Render the Component
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/edit/1"]}>
          <Routes>
            <Route path="/edit/:photoId" element={<EditPhoto />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Assertions
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument(); // Spinner
  });

  it("shows an error message when there is an error", () => {
    // Mock State
    const mockState: Partial<RootState> = {
      photo: {
        photos: [],
        selectedPhoto: null,
        loading: false,
        error: "Failed to fetch photo",
      },
    };

    // Configure Mock Store
    const store = mockStore(mockState);

    // Render the Component
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/edit/1"]}>
          <Routes>
            <Route path="/edit/:photoId" element={<EditPhoto />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Assertions
    expect(screen.getByText("Failed to fetch photo")).toBeInTheDocument(); // Error message
  });
});
