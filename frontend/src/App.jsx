import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/main/Dashboard";
import DashboardLayout from "./layouts/Dashboard_Layout";
import Documents from "./pages/main/Documents";
import Profile from "./pages/main/Profile";
import ChatAsk from "./pages/main/ChatAsk";
import ChatHistory from "./pages/main/ChatHistory";

function App() {

  return(

    <BrowserRouter>
    
      <Routes>
        
        <Route path="/" element={<Login/>}></Route>

        <Route path="/register" element={<Register/>} ></Route>

        <Route element={<DashboardLayout/>}>

            <Route path="/dashboard" element = {<Dashboard/>} />

            <Route path="/profile" element = {<Profile/>} />          

            <Route path="/documents" element = {<Documents/>} />

            <Route path="/chat/ask" element ={<ChatAsk/>} />

            <Route path="/chat/history" element ={<ChatHistory/>} />

        </Route>

      </Routes>  
    
    </BrowserRouter>
  
)

}

export default App;