import React from "react";
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import Layout from "./Components/Layout";

import Home, {loader as otherOfferLoader} from "./Pages/Home";
import BestDeals from "./Pages/BestDeals";
import Contact from "./Pages/Contact";
import Disclaimer from "./Pages/Disclaimer";
import About from "./Pages/About";

import SignIn from "./Pages/Login.jsx";
import Management, {loader as ManagementLoader} from "./Pages/Management.jsx";
import OtherManagement, {loader as OtherManagementLoader} from "./Pages/OtherManagement.jsx";

import OfferDetail from "./Pages/OfferDetail.jsx";
import OtherOfferDetail, {loader as OtherOfferDetailLoader} from "./Pages/OtherOfferDetail.jsx";
import { Denied } from "./Pages/Denied.jsx";
import  SignUp  from "./Pages/SignUp.jsx";


const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Layout />} >

        <Route index element={<Home />} loader={otherOfferLoader} exact />
        <Route path="/offers/:id" element={<OfferDetail />} exact  />
        <Route path="/other-offers/:id" element={<OtherOfferDetail />} loader={OtherOfferDetailLoader} exact  />
        
        <Route path="/best-deals" element={<BestDeals />} exact />
        
        <Route path="/contact" element={<Contact />} exact />
        <Route path="/disclaimer" element={<Disclaimer />} exact />
        <Route path="/about" element={<About />} exact />

        <Route path="/login" element={<SignIn />} />
        <Route path="/management" element={<Management />} loader={ManagementLoader} exact />
        <Route path="/other-management" element={<OtherManagement />} loader={OtherManagementLoader} exact />
        <Route path="/denied" element={<Denied/>} exact/>
    </Route>
))

export default function App() {
    return (
        <RouterProvider router={router} />
    )
}