import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderComponent from './components/layout/HeaderComponent';
import Intro from "./components/view/IntroPage";
import Search from "./components/view/RecipeSearchPage";
import Recipe from './components/view/RecipeDetailPage';
import Login from "./components/view/LoginPage";
import Join from "./components/view/JoinPage";
import ChangePassword from "./components/view/ChangePasswordPage";
import ChatbotPage from "./components/view/ChatbotPage";
import MyPage from './mypage/MyPage'; 
import InformationEdit from './InformationEdit.jsx/InformationEdit';
import Saved from "./components/view/SavedRecipes";

function App() {
  return (
    <>
      <BrowserRouter>
        <HeaderComponent/>
        <Routes>
          {/* // http://localhost:3000 */}
          <Route path="/" element={<Intro />}></Route>

          {/* // http://localhost:3000/join */}
          <Route path="/join" element={<Join />}></Route>

          {/* // http://localhost:3000/login */}
          <Route path="/login" element={<Login />}></Route>

          {/* // http://localhost:3000/recipesearch */}
          <Route path="/recipesearch" element={<Search />}></Route>

          {/* // http://localhost:3000/recipe/:id */}
          <Route path="/recipe/:id" element={<Recipe />}></Route>

          {/* // http://localhost:3000/chatbot */}
          <Route path="/chatbot" element={<ChatbotPage />}></Route>

          {/* // http://localhost:3000/mypage */}
          <Route path="/mypage" element={<MyPage />}></Route> 

          {/* // http://localhost:3000/mypage/edit */}
          <Route path="/mypage/edit" element={<InformationEdit />}></Route>

          {/* // http://localhost:3000/saved-recipes */}
          <Route path="/saved-recipes" element={<Saved />}></Route>

          {/* // http://localhost:3000/change-password */}
          <Route path="/change-password" element={<ChangePassword />}></Route>

          {/* // http://localhost:3000/profile */}
          {/* <Route path="/profile" element={<Profile />}></Route> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
