import Navbar from "./components/navbar.js";
import Dashboard from "./components/dashboard.js";
import Myorders from "./components/myorders.js";
import Cart from "./components/cart.js";
import Signin from "./components/signin.js";
import Signup from "./components/signup.js";
import { useState,useEffect,useContext } from "react";
import userContext from "./usercontext.js";
import { createBrowserRouter,RouterProvider,Routes,BrowserRouter,Route } from "react-router-dom";
function App() {
  const [user,setUser]=useState('');
  useEffect(()=>{
  },[]);
  const router=createBrowserRouter([
    {path:'/',element:<Dashboard />},
    {path:'/myorders',element:<Myorders />},
    {path:'/cart',element:<Cart />},
    {path:'/signin',element:<Signin />}
  ]);
  return (
    <>
      <userContext.Provider value={{user,setUser}} >
        {/*<Navbar />
        <RouterProvider router={router} />*/}
        <BrowserRouter>
        <div style={{width:'100vw',height:'100vh'}}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/myorders" element={<Myorders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        </div>
      </BrowserRouter>
      </userContext.Provider>
    </>
  );
}

export default App;
