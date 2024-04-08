import "./App.css";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Homepage from "./pages/HomepageWrapper/Homepage";
import { Privates } from "./components/routes/PrivateRoute";
import CreateBlog from "./pages/Private/CreateBlog";
import NoPageFound from "./pages/NoPageFound";
import { AdminPrivate } from "./components/routes/AdminRoutes";
import CreateCategories from "./pages/Admin/CreateCategories";
import AllBlogs from "./pages/Private/AllBlogs";
import UpdateBlog from "./pages/Private/UpdateBlog";
import Search from "./pages/public/Search";
import ReadBlog from "./pages/public/ReadBlog";
import CategoryFilteredBlogs from "./pages/public/CategoryFilteredBlogs";
import ResetPass from "./pages/auth/ResetPass";
import VerifyEmail from "./pages/Private/VerifyEmail";
import SearchResults from "./pages/public/SearchResults";
import UserProfile from "./pages/Private/UserProfile";
import UpdateProfile from "./pages/Private/UpdateProfile";

function App() {
  return (
    <Routes>
      <Route path="*" element={<NoPageFound />} />
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/search-blogs" element={<Search />} />
      <Route path="/search-results/:key" element={<SearchResults />} />
      <Route path="/reset-password" element={<ResetPass />} />
      <Route path="/read-blog/:id" element={<ReadBlog />} />
      <Route path="/category-filter/:id" element={<CategoryFilteredBlogs />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route path="/private" element={<Privates />}>
        <Route path="create-blog" element={<CreateBlog />} />
        <Route path="all-blogs" element={<AllBlogs />} />
        <Route path="update-blog/:id" element={<UpdateBlog />} />
        <Route path="user-profile" element={<UserProfile />} />
        <Route path="update-profile" element={<UpdateProfile />} />
      </Route>

      <Route path="/admin" element={<AdminPrivate />}>
        <Route path="create-category" element={<CreateCategories />} />
      </Route>
    </Routes>
  );
}

export default App;
